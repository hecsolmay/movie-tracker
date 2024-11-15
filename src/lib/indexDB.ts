import Dexie from 'dexie'
import type { Movie } from '../types/movies'

const DB_NAME = 'MovieTracker'

type Action = 'add' | 'remove' | 'update'

interface MovieWithAction extends Movie {
  action: Action
}

// Function to open a IndexedDB database
export function openDB (dbName: string) {
  // Open a connection to the IndexedDB database
  const db = new Dexie(dbName)
  db.version(1).stores({
    movies: 'id, title, releaseYear, poster, watched'
  })
  return db as Dexie & { movies: Dexie.Table<MovieWithAction, string> }
}

// Function to create a register of Movies in the database and add a new Movie
export async function addMovieToLocalDB (movie: Movie) {
  const db = openDB(DB_NAME)
  await db.movies.add({ ...movie, action: 'add' })
}

export async function updateMovieInLocalBd (
  movieId: string,
  updatedMovie: Partial<Movie>
) {
  const db = openDB(DB_NAME)
  const movie = await db.movies.get(movieId)
  if (movie !== undefined) {
    await db.movies.update(movieId, { ...updatedMovie, action: 'update' })
  } else {
    const newMovie = { id: movieId, ...updatedMovie }
    const typedMovie = newMovie as Movie
    await db.movies.add({ ...typedMovie, action: 'update' })
  }
}

export async function removeMovieFromLocalDB (movieId: string) {
  const db = openDB(DB_NAME)
  const movie = await db.movies.get(movieId)
  if (movie !== undefined) {
    await db.movies.update(movieId, { action: 'remove' })
  } else {
    const newMovie = { id: movieId }
    const typedMovie = newMovie as Movie
    await db.movies.add({ ...typedMovie, action: 'remove' })
  }
}

export async function getMoviesFromLocalDB () {
  const db = openDB(DB_NAME)
  const movies = await db.movies.toArray()
  return movies
}

export async function clearAllLocalMovies () {
  const db = openDB(DB_NAME)
  await db.movies.clear()
}
