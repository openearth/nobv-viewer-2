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
          <v-list-item v-for="(area, i) in areas" :key="i" link @click="handleAreaClick(area)">
            <v-list-item-content>
              <v-list-item-title>{{
                area.properties.groupname
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
import { mapActions } from 'vuex'

export default {
  components: { MapboxMap, AppPane },
  data: () => ({
    drawer: true,
    appCollapsed: true,

    icon: 'mdi-arrow-left',
    point: null // TODO: instead of a data, move it to state. Mutate it every time you click  a new point
  }),
  computed: {
    areas () {
      return this.$store.state.areas
    }
  },
  methods: {
    ...mapActions(['getLocations', 'getAreas', 'getTimeseries']),
    toggleDrawer () {
      this.drawer = !this.drawer
      this.icon =
        this.icon === 'mdi-arrow-right' ? 'mdi-arrow-left' : 'mdi-arrow-right'
    },
    onPointClicked (point) {
      this.point = point // This is where I will be calling the mutation or action
      if (this.appCollapsed) {
        this.appCollapsed = !this.appCollapsed
      }
      this.getTimeseries(point.properties.loc_id)
    },
    handleAreaClick (area) {
      this.$store.commit('SET_SELECTED_AREA', area)
    }
  },
  mounted () {
    this.getLocations()
    this.getAreas()
  }
}
</script>
