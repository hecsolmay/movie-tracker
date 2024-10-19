import { addMovieToLocalDB } from '@lib/indexDB'
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

export async function getUserMovies (baseUrl = '/') {
  try {
    const response = await fetch(`${baseUrl}api/movies`)
    if (!response.ok) throw new Error('Something went wrong')
    const json = await response.json()
    return json.movies as Movie[]
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function SaveMovieToDB ({ movie }: { movie: Movie }) {
  try {
    const response = await fetch('/api/movies', {
      method: 'POST',
      body: JSON.stringify(movie)
    })

    if (!response.ok) throw new Error('Something went wrong')

    if (response.status === 200) {
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

export async function patchMovieWatchedToDB (id: string, watched: boolean) {
  try {
    const response = await fetch('/api/movies/' + id, {
      method: 'PATCH',
      body: JSON.stringify({ watched })
    })

    if (!response.ok) throw new Error('Something went wrong')

    if (response.status === 200) {
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

export async function deleteMovieFromDB ({ id }: { id: string }) {
  try {
    const response = await fetch('/api/movies/' + id, {
      method: 'DELETE'
    })

    if (!response.ok) throw new Error('Something went wrong')

    if (response.status === 200) {
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