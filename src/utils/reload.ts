import { $, $$ } from '@lib/dom'
import {
  createFirstDeleteMovieEvent,
  createFirstPatchMovieWatchEvent
} from '@utils/events'
import type { Movie } from '../types/movies'
import { scheduleNotification } from './notifications'

const tabs = $$<HTMLButtonElement>('.tab')
const $emptyState = $('#empty-state')
export function loadFilteredMovies (filter: string) {
  const movieCards = $$('.movie-card')
  let showCount = 0

  console.log(movieCards.length)

  movieCards.forEach(card => {
    if (filter === 'all' || card.dataset.status === filter) {
      card.style.display = 'block'
      showCount++
    } else {
      card.style.display = 'none'
    }
  })

  if ($emptyState === null) return

  if (showCount === 0) {
    $emptyState.style.display = 'block'
  } else {
    $emptyState.style.display = 'none'
  }
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

  const existMovie = movieGrid.querySelector(`[data-id="${movie.id}"]`)

  if (existMovie !== null) {
    return
  }

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

  watchBtn.textContent = movie.watched ? 'Por ver' : 'Visto'

  // Añadir al DOM
  movieGrid.insertBefore(clone, movieGrid.firstChild)
  reloadFilteredMovies()
  createFirstDeleteMovieEvent()
  createFirstPatchMovieWatchEvent()
  scheduleNotification(movie.title, 5000)
    .catch(error => { console.error(error) })
}
