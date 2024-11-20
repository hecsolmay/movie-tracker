import { $ } from '@lib/dom'
import type { EventData } from '../types/index'
import type { Movie } from '../types/movies'
import { addNewMovieToList, reloadFilteredMovies } from './reload'

const $userEmail = $('#user-email')
const userEmail = $userEmail?.dataset.email ?? ''

const eventSource = new EventSource(
  `/api/events?email=${encodeURIComponent(userEmail)}`
)

eventSource.onopen = () => {
  console.log('Connected to the SSE server.')
}

eventSource.onmessage = event => {
  let eventData = event.data

  if (typeof eventData === 'string') {
    try {
      eventData = JSON.parse(eventData)
    } catch (error) {
      eventData = event.data
    }
  }

  handleEvent(eventData as EventData)
}

eventSource.onerror = error => {
  console.error('Error:', error)
}

function handleEvent (event: EventData) {
  const hasType = event?.type !== undefined
  const hasData = event?.data !== undefined

  if (!hasType || !hasData) return

  switch (event.type) {
    case 'create':
      eventMovieCreated(event.data as Movie)
      break
    case 'update':
      eventMovieUpdated(event.data as Movie)
      break
    case 'delete':
      eventMovieDeleted(event.data as Movie)
      break
    default:
      console.warn('Unknown event type:', event.type)
      break
  }
}

function eventMovieCreated (movie: Movie) {
  console.log('New Movie created')
  addNewMovieToList(movie)
}

function eventMovieUpdated (movie: Movie) {
  console.log('Movie updated')
  const isNewMovie = movie?.title !== undefined

  if (isNewMovie) {
    addNewMovieToList(movie)
    reloadFilteredMovies()
    return
  }

  const $movieCard = $<HTMLDivElement>(`[data-id="${movie.id}"]`)

  if ($movieCard === null) return

  $movieCard.dataset.status = movie.watched ? 'watched' : 'unwatched'
  const watchBtn = $movieCard.querySelector('.watch-btn')

  if (watchBtn === null) return

  watchBtn.textContent = movie.watched ? 'Por ver' : 'Visto'
  reloadFilteredMovies()
}

function eventMovieDeleted (movie: Movie) {
  console.log('Movie deleted')
  const $movieCard = $<HTMLDivElement>(`[data-id="${movie.id}"]`)

  if ($movieCard === null) return

  $movieCard.remove()
  reloadFilteredMovies()
}
