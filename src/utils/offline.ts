import { syncLocalDBWithServer } from './sync'

window.addEventListener('offline', () => {
  console.log('You are offline')
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
window.addEventListener('online', async () => {
  console.log('You are online')
  await syncLocalDBWithServer()
})
