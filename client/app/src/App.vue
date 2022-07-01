<template>
  <p v-if="error">Something went wrong...</p>
  <p v-if="loading">Loading...</p>
  <p v-else>
    {{ result.hello }}
  </p>
  <div></div>
</template>

<script>
import SearchAutocomplete from '../../client3/app/src/components/SearchAutocomplete.vue'
export default {
  name: 'App',
  components: {
    SearchAutocomplete
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
