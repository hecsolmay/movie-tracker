import { OMDB_API_KEY, OMDB_API_URL } from '@constants/config'

export async function getOMDBMovieById (id: string) {
  try {
    const response = await fetch(
      `${OMDB_API_URL}?apikey=${OMDB_API_KEY}&i=${id}&type=movie`
    )
    const data = await response.json()

    if ('Error' in data) {
      return null
    }

    return {
      id: data.imdbID,
      title: data.Title,
      releaseYear: data.Year,
      poster: data.Poster,
      watched: false
    }
  } catch (error) {
    console.error(error)
    return null
  }
}
