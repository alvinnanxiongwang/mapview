<template>
  <GMapMap
      :center="center"
      :zoom="4"
      map-type-id="terrain"
      style="width: 100vw; height: 900px"
  >
  </GMapMap>
    <searchAutocomplete />
</template>

<script>
import SearchAutocomplete from './components/SearchAutocomplete.vue'
export default {
  name: 'App',
  data() {
    return {
      center: {lat: 44.500000, lng: -89.500000},
    }
  },
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
