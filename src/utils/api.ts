export const res = (data: any, { status } = { status: 200 }) =>
  new Response(JSON.stringify(data), { status })
