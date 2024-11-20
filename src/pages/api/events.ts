import type { EventData, EventType } from '../../types/index'
import type { APIRoute } from 'astro'

const clients = new Map<string, Array<(data: EventData) => void>>()

export const GET: APIRoute = async ({ request, url }) => {
  try {
    const email = url.searchParams.get('email')

    if (email === null) {
      return new Response('Email Required to connect to events', {
        status: 400
      })
    }

    let sendEvent: (data: EventData) => void = () => {}

    const customReadable = new ReadableStream({
      async start (controller) {
        sendEvent = (data: EventData) => {
          controller.enqueue(`data: ${JSON.stringify(data)}\n\n`)
        }

        controller.enqueue(`data:user ${email} connected to the server event\n\n`)

        if (!clients.has(email)) {
          clients.set(email, [])
        }

        clients.get(email)?.push(sendEvent)

        request.signal.addEventListener('abort', () => {
          controller.close()
        })
      },
      cancel () {
        const currentClients = clients.get(email)
        if (currentClients !== undefined) {
          const filteredEvents = currentClients.filter(fn => fn !== sendEvent)
          clients.set(email, filteredEvents)
        }
      }
    })

    return new Response(customReadable, {
      headers: {
        Connection: 'keep-alive',
        'Content-Encoding': 'none',
        'Cache-Control': 'no-cache, no-transform',
        'Content-Type': 'text/event-stream; charset=utf-8'
      }
    })
  } catch (error) {
    console.error(error)
    return new Response('Something went wrong', { status: 500 })
  }
}

// Emitir eventos a todos los clientes conectados
export const emitEvent = (email: string, type: EventType, data: object) => {
  clients.get(email)?.forEach(fn => {
    fn({ type, data })
  })
}
