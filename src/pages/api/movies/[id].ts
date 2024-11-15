import { createUserMovieFromId } from '@services/userMovies'
import { res } from '@utils/api'
import { validateChangeWatched } from '@utils/validate/movieSchema'
import type { APIRoute } from 'astro'
import { and, db, eq, UserMovies } from 'astro:db'

export const PATCH: APIRoute = async ({ params, request }) => {
  const { id } = params
  const body = await request.json()

  const { output, success, issues } = validateChangeWatched(body)

  if (!success) {
    return res({ message: 'Bad Request', issues }, { status: 400 })
  }

  const { watched, userEmail } = output
  try {
    const updatedMovie = await db
      .update(UserMovies)
      .set({ watched })
      .where(
        and(
          eq(UserMovies.movieId, id ?? ''),
          eq(UserMovies.userEmail, userEmail)
        )
      )

    if (updatedMovie.rowsAffected !== 0) {
      return res({
        message: 'Movie updated',
        updatedCount: updatedMovie.rowsAffected
      })
    }

    const { success } = await createUserMovieFromId(
      id ?? '',
      userEmail,
      output.watched
    )

    if (!success) {
      return res({ message: 'Something went wrong' }, { status: 400 })
    }

    return res({ message: 'Movie Updated' })
  } catch (error) {
    console.error(error)
    return res({ message: 'Something went wrong' }, { status: 500 })
  }
}

export const DELETE: APIRoute = async ({ params, request }) => {
  try {
    const id = params.id ?? ''
    const body = await request.json()
    const { userEmail } = body

    if (typeof userEmail !== 'string') {
      return res({ message: 'Bad Request' }, { status: 400 })
    }

    const result = await db
      .delete(UserMovies)
      .where(
        and(eq(UserMovies.movieId, id), eq(UserMovies.userEmail, userEmail))
      )

    if (result.rowsAffected === 0) {
      return res({ message: 'Movie not found' }, { status: 404 })
    }

    return res({ message: 'Movie deleted' })
  } catch (error) {
    return res({ message: 'Something went wrong' }, { status: 500 })
  }
}
