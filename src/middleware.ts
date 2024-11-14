import { saveUserIfNotExists } from '@services/users'
import { defineMiddleware } from 'astro:middleware'
import { getSession } from 'auth-astro/server'

const LOGIN_PAGE_ROUTE = '/login'
const PROTECTED_ROUTES = ['/']

export const onRequest = defineMiddleware(async (context, next) => {
  const session = await getSession(context.request)
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

  if (session?.user !== undefined) {
    const user = {
      email: session.user.email ?? '',
      name: session.user.name ?? '',
      image: session.user.image ?? ''
    }
    await saveUserIfNotExists(user)
  }

  return await next()
})
