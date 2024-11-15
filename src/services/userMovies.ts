import { db, eq, Movies, UserMovies } from 'astro:db'

import { getOMDBMovieById } from '@services/omdb'

export async function createUserMovieFromId (
  movieId: string,
  userEmail: string,
  watched: boolean = false
) {
  try {
    const existedMovie = await db
      .select()
      .from(Movies)
      .where(eq(Movies.id, movieId))

    if (existedMovie.length !== 0) {
      await db.insert(UserMovies).values({
        movieId,
        userEmail,
        watched
      })

      return {
        success: true
      }
    }

    const movie = await getOMDBMovieById(movieId)

    if (movie !== null) {
      await db.insert(Movies).values(movie).onConflictDoNothing()
      await db.insert(UserMovies).values({
        movieId,
        userEmail,
        watched
      })

      return {
        success: true
      }
    }

    return {
      success: false
    }
  } catch (error) {
    console.error(error)
    return {
      success: false
    }
  }
}
