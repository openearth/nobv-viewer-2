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
      <div class="menu">
        <input id="satellite-streets-v12" type="radio" name="rtoggle" value="satellite-streets-v12" v-model="mapStyle" >
        <label for="satellite-streets-v12">satellite streets</label>
        <input id="light-v11" type="radio" name="rtoggle" value="light-v11" v-model="mapStyle">
        <label for="light-v11">light</label>
        <input id="dark-v11" type="radio" name="rtoggle" value="dark-v11" v-model="mapStyle">
        <label for="dark-v11">dark</label>
        <input id="streets-v12" type="radio" name="rtoggle" value="streets-v12" v-model="mapStyle">
        <label for="streets-v12">streets</label>
        <input id="outdoors-v12" type="radio" name="rtoggle" value="outdoors-v12" v-model="mapStyle">
        <label for="outdoors-v12">outdoors</label>
      </div>
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
      mapZoom: 8.7,
      mapStyle: 'streets-v12'
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
    },
    styleUrl (value) {
      this.map.setStyle(value)
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
