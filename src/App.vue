<template>
  <v-app>
    <div>
      <v-app-bar color="#AA7F4A" dense dark>
        <v-btn icon @click="toggleDrawer" class="v-btn--no-ripple">
          <v-icon>
            {{ icon }}
          </v-icon>
        </v-btn>
        <v-toolbar-title>Bodembeweging</v-toolbar-title>
        <v-spacer></v-spacer>
        <img src="./assets/Deltares_logo_D-blauw_RGB.png" alt="Deltares Logo" height="40" />
      </v-app-bar>
    </div>

    <v-main>
      <v-navigation-drawer absolute dark src="./assets/subsoil-background.jpg" width="300" v-model="drawer" hide-overlay>
        <v-list>
          <!-- TODO: add below this but for locations.  link @click="handleLocationListClick(area)" -->
          <v-list-item v-for="(location, i) in locations.features" :key="i" link @click="onPointListClicked(location)">
            <v-list-item-content>
              <v-list-item-title>{{
                location.properties.loc_id
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <mapbox-map @point-clicked="onPointClicked" :pointSelected="point" />
      <app-pane :panelIsCollapsed="appCollapsed" :pointSelected="point"
        @update:panelIsCollapsed="appCollapsed = $event" />
    </v-main>
  </v-app>
</template>

<script>
import MapboxMap from './components/MapboxMap'
import AppPane from './components/AppPane'
import { mapActions, mapState } from 'vuex'

export default {
  components: { MapboxMap, AppPane },
  data: () => ({
    drawer: true,
    appCollapsed: true,

    icon: 'mdi-arrow-left',
    point: null // TODO: instead of a data, move it to state. Mutate it every time you click  a new point
  }),
  computed: {
    ...mapState(['locations']),
    locationList () {
      return this.$store.state.locationList
    }
  },
  methods: {
    ...mapActions(['getLocationsData', 'getTimeseriesData', 'setSelectedPoint']),
    toggleDrawer () {
      this.drawer = !this.drawer
      this.icon =
        this.icon === 'mdi-arrow-right' ? 'mdi-arrow-left' : 'mdi-arrow-right'
    },
    onPointClicked (point) {
      this.point = point // This is where I will be calling the mutation or action
      this.setSelectedPoint(point)
      this.getTimeseriesData()
      if (this.appCollapsed) {
        this.appCollapsed = !this.appCollapsed
      }
    },
    onPointListClicked (location) {
    // Transform the location object to match the format
      const point = {
        lngLat: {
          lng: location.geometry.coordinates[0],
          lat: location.geometry.coordinates[1]
        },
        properties: {
          loc_id: location.properties.loc_id,
          meas_id: location.properties.meas_id,
          meas_type: location.properties.meas_type,
          parameters: JSON.stringify(location.properties.parameters) // Convert array to string
        }
      }

      this.point = point

      this.setSelectedPoint(point)
      this.getTimeseriesData()

      if (this.appCollapsed) {
        this.appCollapsed = !this.appCollapsed
      }
    }
  },
  mounted () {
    this.getLocationsData()
  }
}
</script>
