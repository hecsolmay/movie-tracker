export async function scheduleNotification (movieTitle: string, delay: number) {
  if ('Notification' in window && 'serviceWorker' in navigator) {
    const permission = await Notification.requestPermission()

    if (permission !== 'granted') {
      console.warn('Permiso de notificaciones denegado.')
      return
    }

    const registration = await navigator.serviceWorker.getRegistration()

    if (registration === undefined) {
      console.error('No se ha encontrado un Service Worker registrado.')
      return
    }

    setTimeout(() => {
      registration.showNotification('¡Nueva Película Agregada!', {
        body: `No olvides revisar la película: ${movieTitle}`,
        icon: '/images/icons/icon-192x192.png',
        tag: 'add-movie' // Útil para evitar duplicados
      }).catch(error => { console.error(error) })
    }, delay)
  } else {
    console.error(
      'Notificaciones o Service Workers no soportados en este navegador.'
    )
  }
}
