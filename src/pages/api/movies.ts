import { res } from '@utils/api'
import { validateMovieCreate } from '@utils/validate/movieSchema'
import type { APIRoute } from 'astro'
import { db, Movies } from 'astro:db'

export const GET: APIRoute = async ({ url }) => {
  const movies = await db.select().from(Movies)
  const sortedMovies = movies.toReversed()
  return res({ message: 'ok', movies: sortedMovies })
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { success, output, issues } = validateMovieCreate(
      await request.json()
    )

    if (!success) {
      return res({ message: 'Bad Request', issues }, { status: 400 })
    }

    const movie = { ...output, watched: false }

    await db.insert(Movies).values(movie).onConflictDoNothing()

    return res({
      message: 'Ok, película guardada',
      movie: output
    })
  } catch (error) {
    console.error(error)
    return res({ message: 'Something went wrong' }, { status: 500 })
  }
}
