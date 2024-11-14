import { db, eq, User } from 'astro:db'

interface UserType {
  email: string
  name: string
  image: string
}

export async function saveUserIfNotExists (user: UserType) {
  const existingUser = await db.select().from(User).where(eq(User.email, user.email))

  if (existingUser.length > 0) {
    return
  }

  await db.insert(User).values(user).onConflictDoNothing()
  console.log('User saved on db')
}
