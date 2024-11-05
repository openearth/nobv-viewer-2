<template>
  <div class="mapbox-map">
    <v-mapbox
      class="mapbox-map"
      :access-token="accessToken"
      map-style="mapbox://styles/mapbox/streets-v12"
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
      <v-mapbox-point-highlight v-if="mapLoaded && layerLocations" />
    </v-mapbox>
  </div>
</template>

<script>
import VMapboxPointHighlight from './VMapboxPointHighlight.js'
import { mapState, mapActions } from 'vuex'
import { MapboxStyleSwitcherControl } from 'mapbox-gl-style-switcher'
import 'mapbox-gl-style-switcher/styles.css'

const styles = [
  {
    title: 'Streets',
    uri: 'mapbox://styles/mapbox/streets-v12'
  },
  {
    title: 'Satellite',
    uri: 'mapbox://styles/mapbox/satellite-streets-v9'
  }
]

export default {
  name: 'MapboxMap',
  props: {
    pointSelected: { type: Object, default: null }
  },
  components: {
    VMapboxPointHighlight
  },
  data () {
    return {
      mapZoom: 9,
      accessToken: process.env.VUE_APP_MAPBOX_TOKEN,
      activeFunction: 'selectedArea',
      mapLoaded: false
    }
  },
  mounted () {
    this.map = this.$refs.map.map

    this.map.addControl(new MapboxStyleSwitcherControl(styles))

    this.map.on('load', () => {
      // Set mapLoaded to true when the map is fully loaded
      this.mapLoaded = true
    })

    this.initialRender = true

    this.map.on('style.load', () => {
      if (this.initialRender) {
        this.initialRender = false

        return
      }

      this.map.addLayer(this.layerLocations)
    })
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
    },
    styleUrl () {
      return `mapbox://styles/mapbox/${this.mapStyle}`
    },
    mapCenter () {
      // Use the lat and lng from the selectedPoint to determine the map center
      if (this.selectedPoint && this.selectedPoint.lngLat) {
        return [this.selectedPoint.lngLat.lng, this.selectedPoint.lngLat.lat]
      }
      // Fallback to the default center if selectedPoint is not set
      return [4.7505, 51.9893]
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
        center: [value.lngLat.lng, value.lngLat.lat],
        padding: this.padding,
        speed: 0.8,
        zoom: 16.5
      })
    }
  },
  methods: {
    ...mapActions(['getRainfallTimeseries', 'getExtensometerTimeseries']),
    pointClicked (e) {
      // Extract the clicked point properties from the event
      const clickedProperties = e.features[0].properties
      const clickedGeometry = e.features[0].geometry

      // Construct a new point object using the properties of the clicked point
      const point = {
        lngLat: {
          lng: clickedGeometry.coordinates[0], // Assuming `longitude` exists in the properties of the clicked point
          lat: clickedGeometry.coordinates[1] // Assuming `latitude` exists in the properties of the clicked point
        },
        properties: clickedProperties
      }

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
