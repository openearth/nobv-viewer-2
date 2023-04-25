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
      <div class="menu">
        <input id="satellite-streets-v12" type="radio" name="rtoggle" value="satellite" checked="checked">
        <!-- See a list of Mapbox-hosted public styles at -->
        <!-- https://docs.mapbox.com/api/maps/styles/#mapbox-styles -->
        <label for="satellite-streets-v12">satellite streets</label>
        <input id="light-v11" type="radio" name="rtoggle" value="light">
        <label for="light-v11">light</label>
        <input id="dark-v11" type="radio" name="rtoggle" value="dark">
        <label for="dark-v11">dark</label>
        <input id="streets-v12" type="radio" name="rtoggle" value="streets">
        <label for="streets-v12">streets</label>
        <input id="outdoors-v12" type="radio" name="rtoggle" value="outdoors">
        <label for="outdoors-v12">outdoors</label>
      </div>
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
    },
    mounted () {
      const layerList = document.getElementById('menu')
      const inputs = layerList.getElementsByTagName('input')

      for (const input of inputs) {
        input.onclick = (layer) => {
          const layerId = layer.target.id
          this.$refs.map.mapObject.setStyle('mapbox://styles/mapbox/' + layerId)
        }
      }
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
padding: 100px;
font-family: 'Open Sans', sans-serif;
}

</style>
