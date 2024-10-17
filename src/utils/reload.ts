import { $$ } from '@lib/dom'

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
