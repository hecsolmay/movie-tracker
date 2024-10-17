import { $, $$ } from '@lib/dom'
import { createDeleteMoviesEvents, createPatchMoviesWatchedEvents } from '@utils/events'
import type { Movie } from '../types/movies'

const tabs = $$<HTMLButtonElement>('.tab')
const movieCards = $$('.movie-card')

export function loadFilteredMovies (filter: string) {
  movieCards.forEach(card => {
    if (filter === 'all' || card.dataset.status === filter) {
      card.style.display = 'block'
    } else {
      card.style.display = 'none'
    }
  })
}

export function getActiveFilter () {
  let activeTab = 'all'

  tabs.forEach(tab => {
    if (tab.classList.contains('active')) {
      activeTab = tab.dataset.filter ?? 'all'
    }
  })
  return activeTab
}

export function reloadFilteredMovies () {
  const activeTab = getActiveFilter()
  loadFilteredMovies(activeTab)
}

export function addNewMovieToList (movie: Movie) {
  const movieGrid = $<HTMLDivElement>('.movie-grid')
  const movieCardTemplate = $<HTMLTemplateElement>('#movie-template')

  if (movieCardTemplate === null || movieGrid === null) return

  const clone = document.importNode(movieCardTemplate.content, true)
  // Configurar los datos dinámicos
  const movieCard = clone.querySelector('.movie-card')
  const img = clone.querySelector('img')
  const title = clone.querySelector('h3')
  const releaseYear = clone.querySelector('p')
  const watchBtn = clone.querySelector('.watch-btn')

  if (
    movieCard === null ||
    img === null ||
    title === null ||
    releaseYear === null ||
    watchBtn === null
  ) {
    return
  }

  movieCard.setAttribute('data-status', movie.watched ? 'watched' : 'unwatched')
  movieCard.setAttribute('data-id', movie.id)

  img.src = movie.poster
  img.alt = `${movie.title} poster`

  title.textContent = movie.title

  releaseYear.textContent = movie.releaseYear

  watchBtn.textContent = movie.watched ? 'Unwatch' : 'Watch'

  // Añadir al DOM
  movieGrid.insertBefore(clone, movieGrid.firstChild)
  createPatchMoviesWatchedEvents()
  createDeleteMoviesEvents()
}
