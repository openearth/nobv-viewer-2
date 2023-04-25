<template>
  <div class="mapbox-map">
    <v-mapbox
      class="mapbox-map"
      access-token="pk.eyJ1Ijoic2lnZ3lmIiwiYSI6Il8xOGdYdlEifQ.3-JZpqwUa3hydjAJFXIlMA"
      map-style="mapbox://styles/mapbox/streets-v11"
      :center="mapCenter"
      :zoom="mapZoom"
      id="map"
      ref="map"
    >
      <v-mapbox-navigation-control :position="'top-right'" />
      <v-mapbox-layer @click='pointClicked' v-if="layerLocations" :options="layerLocations" :clickable="true"></v-mapbox-layer>
    </v-mapbox>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'MapboxMap',
  mounted () {
    this.map = this.$refs.map.map
  },
  data () {
    return {
      mapCenter: [5.4, 52.7],
      mapZoom: 8.7
    }
  },
  computed: {
    ...mapState(['layerLocations']),
    selectedArea () {
      return this.$store.state.selectedArea
    }
  },
  watch: {
    selectedArea (value) {
      this.map.fitBounds([
        [value.bbox[0], value.bbox[1]],
        [value.bbox[2], value.bbox[3]]
      ],
      { padding: 320 }
      )
    }
  },
  methods: {
    ...mapActions(['getTimeseries']),
    pointClicked (e) {
      console.log('when point clicked the event retursn', e)
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
