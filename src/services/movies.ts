import {
  addMovieToLocalDB,
  removeMovieFromLocalDB,
  updateMovieInLocalBd
} from '@lib/indexDB'
import type { Movie } from '../types/movies'

export async function searchMovies ({ search = '' }: { search?: string }) {
  const trimmedSearch = search.trim()
  if (trimmedSearch.length < 3) return []

  try {
    const response = await fetch('/api/movies/search?q=' + trimmedSearch)
    const data = await response.json()

    return data.movies as Movie[]
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function getUserMovies (baseUrl = '/', userEmail: string) {
  try {
    const response = await fetch(`${baseUrl}api/movies?userEmail=${userEmail}`)
    if (!response.ok) throw new Error('Something went wrong')
    const json = await response.json()
    return json.movies as Movie[]
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function SaveMovieToDB ({
  movie,
  userEmail
}: {
  movie: Movie
  userEmail: string
}) {
  try {
    const response = await fetch('/api/movies', {
      method: 'POST',
      body: JSON.stringify({ ...movie, userEmail })
    })

    if (response.ok && response.status === 200) {
      return {
        success: true
      }
    }

    return {
      success: false
    }
  } catch (error) {
    console.error(error)
    try {
      await addMovieToLocalDB(movie)

      return {
        success: true
      }
    } catch (error) {
      console.error(error)
      return {
        success: false
      }
    }
  }
}

export async function patchMovieWatchedToDB (
  movieId: string,
  userEmail: string,
  watched: boolean
) {
  try {
    const response = await fetch('/api/movies/' + movieId, {
      method: 'PATCH',
      body: JSON.stringify({ watched, userEmail })
    })

    if (response.ok && response.status === 200) {
      return {
        success: true
      }
    }

    return {
      success: false
    }
  } catch (error) {
    console.error(error)
    try {
      await updateMovieInLocalBd(movieId, { watched })
      return {
        success: true
      }
    } catch (error) {
      return {
        success: false
      }
    }
  }
}

export async function deleteMovieFromDB ({
  id,
  userEmail
}: {
  id: string
  userEmail: string
}) {
  try {
    const response = await fetch('/api/movies/' + id, {
      method: 'DELETE',
      body: JSON.stringify({ userEmail })
    })

    if (response.ok && response.status === 200) {
      return {
        success: true
      }
    }

    return {
      success: false
    }
  } catch (error) {
    try {
      await removeMovieFromLocalDB(id)
      return {
        success: true
      }
    } catch (error) {
      return {
        success: false
      }
    }
  }
}
