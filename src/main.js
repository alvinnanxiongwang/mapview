import Vue from 'vue'
import VueCompositionAPI, { createApp, h } from '@vue/composition-api'
import App from './App.vue'
//import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueCompositionAPI)
// Vue.use(VueGoogleMaps, {
//   load: {
//     key: 'AIzaSyBOoJhFh3oq0ygKyjcYytDJmsbFW-VM0RE',
//     libraries: 'places',
//   },
// })

const app = createApp({
  render: () => h(App)
})

app.mount('#app')
