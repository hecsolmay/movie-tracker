import { OMDB_API_URL, OMDB_API_KEY } from '@constants/config'
import { movies } from '@constants/mock'
import type { Movie } from '../types/movies'

export async function searchMovies ({ search = '' }: { search?: string }) {
  const trimmedSearch = search.trim()
  if (trimmedSearch.length < 3) return []

  try {
    const response = await fetch('/api/movies/search?q=' + trimmedSearch)
    const data = await response.json()
    console.log(data)

    return data.movies as Movie[]
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function getUserMovies () {
  return movies
}
