import { $, $$ } from '@lib/dom'
import { deleteMovieFromDB, patchMovieWatchedToDB } from '@services/movies'
import { reloadFilteredMovies } from './reload'

const watchBtnEvent = (btn: HTMLButtonElement) => async (e: MouseEvent) => {
  // @ts-expect-error ts-expect-error
  const card = e.target.closest('.movie-card') as HTMLDivElement
  const currentStatus = card.dataset.status
  const id = card.dataset.id ?? ''
  const newStatus = currentStatus === 'watched' ? 'unwatched' : 'watched'
  const watched = newStatus === 'watched'
  card.dataset.status = newStatus
  btn.textContent = watched ? 'Por ver' : 'Visto'
  const $userEmail = $('#user-email')
  const userEmail = $userEmail?.dataset.email ?? ''
  try {
    await patchMovieWatchedToDB(id, userEmail, watched)
    reloadFilteredMovies()
  } catch (error) {
    console.error(error)
  }
}

export function createPatchMoviesWatchedEvents () {
  const watchBtns = $$<HTMLButtonElement>('.watch-btn')

  watchBtns.forEach(btn => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    btn.addEventListener('click', watchBtnEvent(btn))
  })
}

const trashBtnEvent = (_btn: HTMLButtonElement) => async (e: MouseEvent) => {
  // @ts-expect-error ts-expect-error
  const card = e.target.closest('.movie-card') as HTMLDivElement
  const id = card.dataset.id ?? ''
  const $userEmail = $('#user-email')
  const userEmail = $userEmail?.dataset.email ?? ''

  try {
    const result = await deleteMovieFromDB({ id, userEmail })

    if (result.success) {
      card.remove()
      reloadFilteredMovies()
    }
  } catch (error) {
    console.error(error)
  }
}

export function createDeleteMoviesEvents () {
  const trashBtns = $$<HTMLButtonElement>('.trash-btn')

  trashBtns.forEach(btn => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    btn.addEventListener('click', trashBtnEvent(btn))
  })
}
