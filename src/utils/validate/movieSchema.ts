import { object, string, boolean, optional, type InferOutput, safeParse } from 'valibot'

const MovieCreateSchema = object({
  id: string(),
  title: string(),
  releaseYear: string(),
  poster: string(),
  watched: optional(boolean())
})

type MovieCreate = InferOutput<typeof MovieCreateSchema>

export function validateMovieCreate (data: any) {
  return safeParse(MovieCreateSchema, data)
}