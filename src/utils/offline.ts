import { syncLocalDBWithServer } from './sync'

console.log('Load offline utilities')

syncLocalDBWithServer()
  .then(_res => {
    console.log('Sync local DB with server')
  })
  .catch(err => {
    console.error(err)
  })

window.addEventListener('offline', () => {
  console.log('You are offline')
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
window.addEventListener('online', async () => {
  console.log('You are online')
  await syncLocalDBWithServer()
})
