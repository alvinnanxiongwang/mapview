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
      ref="myMapRef"
      map-type-id="terrain"
      style="width: 80vw; height: 700px"
  >
    <GMapPolygon
        :paths="paths"
        ref="myPolyRef"
    />
    <GMapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
    />
  </GMapMap>
</template>

<script>
import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import axios from "axios";
import {ref} from "vue";

export default {
  name: 'SearchAutocomplete',
  setup() {
    const { result, loading, error, refetch } = useQuery(gql`
  query getMatchLocation($match: String) {
    location(match: $match)
  }
`, { match: ''});

    const myMapRef = ref();
    const myPolyRef = ref();

    return {
      result,
      loading,
      error,
      refetch,
      myMapRef,
      myPolyRef
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
      center: {lat: 39.8283, lng: -98.5795},
      paths: [],
      markers: []
    };
  },
  methods: {
    onChange() {
      this.refetch({match: this.search});
      this.isOpen = true;
    },

    onClickLocation(location) {
      this.search = location

      let apiPath = "https://nominatim.openstreetmap.org/search.php";

      let params = {
        q: location,
        polygon_geojson: 1,
        format: "json"
      };

      axios.get(apiPath, { params: params }  ).then( (response) => {
        const responseData = response.data[0]
        this.myMapRef.$mapPromise.then(mapObject => {
          mapObject.setCenter({
            lat: Number(responseData.lat),
            lng: Number(responseData.lon),
          });
          mapObject.setZoom(6)
        })

        this.markers = [
          {
            position: {
              lat: Number(responseData.lat), lng: Number(responseData.lon)
            },
          }
        ]

        let allPolyPath = []
        if (responseData.geojson?.type == "Polygon") {
          const coord = responseData.geojson.coordinates[0]
          allPolyPath = coord.map(latLng => ({lat: latLng[1], lng: latLng[0]}));
        } else {
          const coord = responseData.geojson.coordinates;
          for(let i = 0; i < coord.length; i++) {
            const item = coord[i][0]
            allPolyPath = allPolyPath.concat(item.map(latLng => ({lat: latLng[1], lng: latLng[0]})))
          }
        }


        this.myPolyRef.$mapPromise.then(() => {
          this.paths = allPolyPath
        })
      })
    },
  },
}
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