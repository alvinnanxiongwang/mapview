<template>
  <div class="autocomplete">
    <input
        v-model="search"
        @input="onChange"
        type="text"
    />
    <ul
        v-show="isOpen"
        class="autocomplete-results"
    >
      <li
          v-for="location in result.location"
          :key="location"
          class="autocomplete-result"
          @click="onClickLocation(location)"
      >
        {{ location }}
      </li>
    </ul>
  </div>
  <GMapMap
      :center="center"
      :zoom="4"
      map-type-id="terrain"
      style="width: 80vw; height: 700px"
  >
    <GMapPolygon
        :paths="paths"
    />
  </GMapMap>
</template>

<script>
import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'

export default {
  name: 'SearchAutocomplete',
  setup() {
    const { result, loading, error, refetch } = useQuery(gql`
  query getMatchLocation($match: String) {
    location(match: $match)
  }
`, { match: ''});





    return {
      result,
      loading,
      error,
      refetch,
    }
  },
  props: {
    items: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      search: '',
      isOpen: false,
      center: {lat: 25.774, lng: -80.19},
      paths: [
        { lat: 25.774, lng: -80.19 },
        { lat: 18.466, lng: -66.118 },
        { lat: 32.321, lng: -64.757 },
      ],
    };
  },
  methods: {
    onChange() {
      this.refetch({match: this.search});
      this.isOpen = true;
    },
    onClickLocation(location) {
      this.search = location
    }
  },
};
</script>

<style>
.autocomplete {
  position: relative;
}

.autocomplete-results {
  padding: 0;
  margin: 0;
  border: 1px solid #eeeeee;
  height: 120px;
  min-height: 1em;
  max-height: 10em;
  overflow: auto;
}

.autocomplete-result {
  list-style: none;
  text-align: left;
  padding: 4px 2px;
  cursor: pointer;
}

.autocomplete-result:hover {
  background-color: #4AAE9B;
  color: white;
}
</style>