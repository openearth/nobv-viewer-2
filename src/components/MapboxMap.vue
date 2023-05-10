<template>
  <div class="mapbox-map">
    <v-mapbox
      class="mapbox-map"
      :access-token="accessToken"
      map-style="mapbox://styles/mapbox/streets-v11"
      :center="mapCenter"
      :zoom="mapZoom"
      id="map"
      ref="map"
    >
      <v-mapbox-navigation-control :position="'top-right'" />
      <v-mapbox-layer
        @click="pointClicked"
        v-if="layerLocations"
        :options="layerLocations"
        :clickable="true"
      ></v-mapbox-layer>
      <v-mapbox-point-highlight v-if="layerLocations" />
    </v-mapbox>
  </div>
</template>

<script>
import VMapboxPointHighlight from './VMapboxPointHighlight.js'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'MapboxMap',
  props: {
    pointSelected: { type: Object, default: null }
  },
  components: {
    VMapboxPointHighlight
  },
  mounted () {
    this.map = this.$refs.map.map
  },
  data () {
    return {
      mapCenter: [5.4, 52.7],
      mapZoom: 8.7,
      accessToken: process.env.VUE_APP_MAPBOX_TOKEN,
      activeFunction: 'selectedArea'
    }
  },
  computed: {
    ...mapState(['layerLocations']),
    selectedArea () {
      return this.$store.state.selectedArea
    },
    padding () {
      if (this.activeFunction === 'selectedArea') {
        return {
          left: 320,
          bottom: 70,
          right: 30,
          top: 160
        }
      } else if (this.activeFunction === 'pointSelected') {
        return {
          left: 30,
          bottom: 600
        }
      } else {
        return {}
      }
    }
  },
  watch: {
    selectedArea (value) {
      this.activeFunction = 'selectedArea'
      this.map.fitBounds(
        [
          [value.bbox[0], value.bbox[1]],
          [value.bbox[2], value.bbox[3]]
        ],
        {
          padding: this.padding
        }
      )
    },
    pointSelected (value) {
      this.activeFunction = 'pointSelected'
      this.map.flyTo({
        center: value.lngLat,
        padding: this.padding,
        speed: 0.7,
        zoom: 16.5
      })
    }
  },
  methods: {
    ...mapActions(['getTimeseries']),
    pointClicked (e) {
      const point = { lngLat: e.lngLat, properties: e.features[0].properties }
      this.$emit('point-clicked', point)
    }
  }
}
</script>

<style>
.mapbox-map {
  height: 100%;
  width: 100%;
}
</style>
