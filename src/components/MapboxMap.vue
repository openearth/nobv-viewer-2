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
import { mapState } from 'vuex'
export default {
  name: 'MapboxMap',
  mounted () {
    this.map = this.$refs.map.map
  },
  data () {
    return {
      mapCenter: [4.6, 52.435],
      mapZoom: 12
    }
  },
  computed: {
    ...mapState(['layerLocations'])
  },
  methods: {
    pointClicked (e) {
      console.log('when point clicked the event retursn', e)
      this.$emit('point-clicked', e.features)
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
