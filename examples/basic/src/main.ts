import '@iconify/iconify'
import '@purge-icons/generated'
import { registerSW } from 'virtual:pwa-register'
import './main.css'

export const updateSW = registerSW({
  onOfflineReady() {
    // show a ready to work offline to user
    console.debug('Offline Ready')
  },
})
