import { defineMiddleware } from 'astro:middleware'
import { getSession } from 'auth-astro/server'

const LOGIN_PAGE_ROUTE = '/login'
const PROTECTED_ROUTES = ['/']

export const onRequest = defineMiddleware(async (context, next) => {
  console.log('onRequest from middleware')
  const session = await getSession(context.request)
  console.log({ session })
  const isLoginPage = context.url.pathname === LOGIN_PAGE_ROUTE
  if (
    session === null &&
    PROTECTED_ROUTES.some(route => context.url.pathname === route)
  ) {
    return context.redirect(LOGIN_PAGE_ROUTE)
  }

  if (session !== null && isLoginPage) {
    return context.redirect('/')
  }

  return await next()
})
