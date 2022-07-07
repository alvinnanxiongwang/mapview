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
      //center: {lat: 25.774, lng: -80.19},
      //center: {lat: 36, lng: -118},
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
        this.myMapRef.$mapPromise.then(mapObject => {
          mapObject.setCenter({
            lat: Number(response.data[0].lat),
            lng: Number(response.data[0].lon),
          });
          mapObject.setZoom(6)

        //this.paths = response.data[0].geojson.coordinates
        //console.log("paths", this.paths)
        console.log("polygon", this.myPolyRef)
        console.log('geo',response.data[0].geojson)
        },

        //$refs.myPolyRef
        this.markers = [
          {
            position: {
              lat: Number(response.data[0].lat), lng: Number(response.data[0].lon)
            },
          }
        ],
        this.paths = response.data[0].geojson.coordinates[0],
        console.log('path', this.paths)
        // this.myPolyRef.$mapPromise.then(() => {
        //   this.paths = [
        //     { lat: 32, lng: 33.3629593 },
        //     { lat: 12.466, lng: -66.118 },
        //     { lat: 80.321, lng: -64.757 },
        //   ]
        // }),
        )
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