export type EventType = 'create' | 'update' | 'delete'

export interface EventData {
  type: EventType
  data: object
}