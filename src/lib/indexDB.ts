import Dexie from 'dexie'
import type { Movie } from '../types/movies'

const DB_NAME = 'MovieTracker'

// Function to open a IndexedDB database
export function openDB (dbName: string) {
  // Open a connection to the IndexedDB database
  const db = new Dexie(dbName)
  db.version(1).stores({
    movies: 'id, title, releaseYear, poster, watched'
  })
  return db as Dexie & { movies: Dexie.Table<Movie, string> }
}

// Function to create a register of Movies in the database and add a new Movie
export async function addMovieToLocalDB (movie: Movie) {
  const db = openDB(DB_NAME)
  await db.movies.add(movie)
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