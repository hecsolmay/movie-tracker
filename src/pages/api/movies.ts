import { res } from '@utils/api'
import { validateMovieCreate } from '@utils/validate/movieSchema'
import type { APIRoute } from 'astro'
import { db, eq, Movies, UserMovies } from 'astro:db'

export const GET: APIRoute = async ({ url }) => {
  const userEmail = url.searchParams.get('userEmail')

  if (userEmail === null) {
    return res({ message: 'User Id Required' }, { status: 400 })
  }

  const movies = await db
    .select()
    .from(UserMovies)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    .innerJoin(Movies, eq(Movies.id, UserMovies.movieId))
    .where(eq(UserMovies.userEmail, userEmail))

  const mappedMovies = movies.map(({ Movies, UserMovies }) => {
    const { watched } = UserMovies

    return {
      ...Movies,
      watched
    }
  })

  const sortedMovies = mappedMovies.toReversed()

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

    const movie = { ...output, watched: output.watched ?? false }

    await db.insert(Movies).values(movie).onConflictDoNothing()

    const newUserMovie = {
      movieId: movie.id,
      userEmail: output.userEmail,
      watched: movie.watched ?? false
    }

    await db.insert(UserMovies).values(newUserMovie).onConflictDoNothing()

    return res({
      message: 'Ok, película guardada',
      movie: output
    })
  } catch (error) {
    console.error(error)
    return res({ message: 'Something went wrong' }, { status: 500 })
  }
}
