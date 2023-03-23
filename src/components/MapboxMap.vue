<template>
  <div class="mapbox-map">
    <v-mapbox
      class="mapbox-map"
      access-token="pk.eyJ1Ijoic2lnZ3lmIiwiYSI6Il8xOGdYdlEifQ.3-JZpqwUa3hydjAJFXIlMA"
      map-style="mapbox://styles/mapbox/streets-v11"
      id="map"
      ref="map"
    >
      <v-mapbox-layer @click='pointClicked' v-if="layerLocations" :options="layerLocations" :clickable="true"></v-mapbox-layer>
    </v-mapbox>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'MapboxMap',
  mounted () {
    this.map = this.$refs.map.map
  },
  computed: {
    ...mapState(['layerLocations'])
  },
  methods: {
    pointClicked (e) {
      this.$emit('point-clicked', e)
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
