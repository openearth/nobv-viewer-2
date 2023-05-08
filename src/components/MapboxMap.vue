<template>
  <div class="mapbox-map">
    <v-mapbox
      class="mapbox-map"
      access-token="pk.eyJ1Ijoic2lnZ3lmIiwiYSI6Il8xOGdYdlEifQ.3-JZpqwUa3hydjAJFXIlMA"
      map-style="mapbox://styles/mapbox/streets-v12"
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
import { MapboxStyleSwitcherControl } from 'mapbox-gl-style-switcher'
import 'mapbox-gl-style-switcher/styles.css'

export default {
  name: 'MapboxMap',
  mounted () {
    this.map = this.$refs.map.map
    this.map.addControl(new MapboxStyleSwitcherControl())
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
    },
    styleUrl () {
      return `mapbox://styles/mapbox/${this.mapStyle}`
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

.menu {
position: absolute;
background: #efefef;
padding: 10px;
font-family: 'Open Sans', sans-serif;
top: 0;
left: 0
}

</style>
