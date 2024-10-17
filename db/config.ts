import { defineDb, column } from 'astro:db'

const Movies = {
  columns: {
    id: column.text({ primaryKey: true }),
    title: column.text(),
    releaseYear: column.text(),
    poster: column.text(),
    watched: column.boolean()
  }
}

// https://astro.build/db/config
export default defineDb({
  tables: {
    Movies
  }
})
