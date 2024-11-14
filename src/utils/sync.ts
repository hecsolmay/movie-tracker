import { $ } from '@lib/dom'
import { clearAllLocalMovies, getMoviesFromLocalDB } from '@lib/indexDB'
import { SaveMovieToDB } from '@services/movies'

export async function syncLocalDBWithServer () {
  const movies = await getMoviesFromLocalDB()
  const $userEmail = $('#user-email')
  const userEmail = $userEmail?.dataset.email ?? ''
  console.log('INSERTING MOVIES TO SERVER')
  const postPromises = movies.map(async movie => {
    return await SaveMovieToDB({ movie, userEmail })
  })

  await Promise.all(postPromises).then(results => {
    console.log(results)
  })

  console.log('MOVIES SAVE ON BD CORRECTLY')

  await clearAllLocalMovies()
}
