import { OMDB_API_KEY, OMDB_API_URL } from '@constants/config'
import { movies } from '@constants/mock'
import { res } from '@utils/api'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ url }) => {
  try {
    const q = url.searchParams.get('q')
    const movies = await searchOMDBMovies(q ?? '')
    return res({ movies })
  } catch (error) {
    return res({ message: 'Something went wrong' }, { status: 500 })
  }
}

async function searchOMDBMovies (search: string) {
  const trimmedSearch = search.trim()
  if (trimmedSearch.length < 3) return []

  try {
    const response = await fetch(
      `${OMDB_API_URL}?apikey=${OMDB_API_KEY}&s=${trimmedSearch}&type=movie`
    )
    const data = await response.json()

    if ('Error' in data) {
      return []
    }

    return data.Search.map((movie: any) => ({
      id: movie.imdbID,
      title: movie.Title,
      releaseYear: movie.Year,
      poster: movie.Poster,
      watched: false
    }))
  } catch (error) {
    console.error(error)
    return []
  }
}
