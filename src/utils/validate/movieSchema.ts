import { object, string, boolean, optional, type InferOutput, safeParse } from 'valibot'

const MovieCreateSchema = object({
  id: string(),
  title: string(),
  releaseYear: string(),
  poster: string(),
  watched: optional(boolean())
})

export type MovieCreate = InferOutput<typeof MovieCreateSchema>

export function validateMovieCreate (data: any) {
  return safeParse(MovieCreateSchema, data)
}

const ChangeWatchedSchema = object({
  watched: boolean()
})

export type ChangeWatched = InferOutput<typeof ChangeWatchedSchema>

export function validateChangeWatched (data: any) {
  return safeParse(ChangeWatchedSchema, data)
}