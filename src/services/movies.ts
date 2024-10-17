import { OMDB_API_KEY } from '@constants/config'
import { movies } from '@constants/mock'

export async function searchMovies ({ search = '' }: { search?: string }) {
  if (search.length < 3) return []

  return movies.filter(movie =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  )
}

export async function getUserMovies () {
  return movies
}
