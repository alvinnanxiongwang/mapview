import { createApp, provide, h } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import App from './App.vue'
import  VueGoogleMaps from '@fawmi/vue-google-maps'

const cache = new InMemoryCache()

const apolloClient = new ApolloClient({
    cache,
    uri: 'http://localhost:4000/graphql',
})

const app = createApp({
    setup () {
        provide(DefaultApolloClient, apolloClient)
    },

    render: () => h(App),
})
app.use(VueGoogleMaps, {
    load: {
        key: 'AIzaSyBOoJhFh3oq0ygKyjcYytDJmsbFW-VM0RE',
    },
});
app.mount('#app');