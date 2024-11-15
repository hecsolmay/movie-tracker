import { $ } from '@lib/dom'
import { clearAllLocalMovies, getMoviesFromLocalDB } from '@lib/indexDB'
import { deleteMovieFromDB, patchMovieWatchedToDB, SaveMovieToDB } from '@services/movies'

export async function syncLocalDBWithServer () {
  const movies = await getMoviesFromLocalDB()
  const $userEmail = $('#user-email')
  const userEmail = $userEmail?.dataset.email ?? ''
  console.log('SYNC MOVIES TO SERVER')
  const postPromises = movies.map(async movieWithAction => {
    const { action, ...movie } = movieWithAction

    if (action === 'add') {
      return await SaveMovieToDB({ movie, userEmail })
    }

    if (action === 'update') {
      return await patchMovieWatchedToDB(movie.id, userEmail, movie.watched)
    }

    if (action === 'remove') {
      return await deleteMovieFromDB({ id: movie.id, userEmail })
    }
  })

  await Promise.allSettled(postPromises)

  console.log('MOVIES SYNC ON BD CORRECTLY')

  await clearAllLocalMovies()
}
