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
      >
        {{ location }}
      </li>
    </ul>
  </div>
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
    };
  },
  methods: {
    onChange() {
      this.refetch({match: this.search});
      this.isOpen = true;
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
  max-height: 6em;
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