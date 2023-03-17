<template>
  <div class="mapbox-map">
    <v-mapbox
      class="mapbox-map"
      access-token="pk.eyJ1Ijoic2lnZ3lmIiwiYSI6Il8xOGdYdlEifQ.3-JZpqwUa3hydjAJFXIlMA"
      map-style="mapbox://styles/mapbox/satellite-v9"
      id="map"
      ref="map"
    >
      <v-mapbox-layer v-if = "layerLocations" :options="layerLocations" :clickable="true"></v-mapbox-layer>
    </v-mapbox>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'MapboxMap',
  mounted () {
    this.map = this.$refs.map.map
    this.map.on('load', () => {
      this.map.on('click', e => {
        this.$emit('map-clicked', true)
      })
    })
  },
  computed: {
    ...mapState(['layerLocations'])
  }
}
</script>

<style>
.mapbox-map {
  height: 100vh;
  width: 100vw;
}
</style>
