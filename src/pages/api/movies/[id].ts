import { res } from '@utils/api'
import { validateChangeWatched } from '@utils/validate/movieSchema'
import type { APIRoute } from 'astro'
import { db, eq, Movies } from 'astro:db'

export const PATCH: APIRoute = async ({ params, request }) => {
  const { id } = params
  const body = await request.json()

  const { output, success, issues } = validateChangeWatched(body)

  if (!success) {
    return res({ message: 'Bad Request', issues }, { status: 400 })
  }

  try {
    const updatedMovie = await db
      .update(Movies)
      .set(output)
      .where(eq(Movies.id, id ?? ''))

    if (updatedMovie.rowsAffected === 0) {
      return res({ message: 'Movie not found' }, { status: 404 })
    }

    return res({
      message: 'Movie updated',
      updatedCount: updatedMovie.rowsAffected
    })
  } catch (error) {
    console.error(error)
    return res({ message: 'Something went wrong' }, { status: 500 })
  }
}

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const id = params.id ?? ''

    const result = await db.delete(Movies).where(eq(Movies.id, id))

    if (result.rowsAffected === 0) {
      return res({ message: 'Movie not found' }, { status: 404 })
    }

    return res({ message: 'Movie deleted' })
  } catch (error) {
    return res({ message: 'Something went wrong' }, { status: 500 })
  }
}
