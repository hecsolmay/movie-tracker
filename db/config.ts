import { defineDb, column } from 'astro:db'

const Movies = {
  columns: {
    id: column.text({ primaryKey: true }),
    title: column.text(),
    releaseYear: column.text(),
    poster: column.text()
  }
}

const User = {
  columns: {
    email: column.text({ primaryKey: true }),
    name: column.text(),
    image: column.text()
  }
}

const UserMovies = {
  columns: {
    userEmail: column.text({ references: () => User.columns.email }),
    movieId: column.text({ references: () => Movies.columns.id }),
    watched: column.boolean()
  }
}

// https://astro.build/db/config
export default defineDb({
  tables: {
    Movies,
    User,
    UserMovies
  }
})
