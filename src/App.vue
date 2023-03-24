<template>
  <v-app>
    <div>
      <v-app-bar
        color="#AA7F4A"
        dense
        dark
      >
        <v-btn icon @click="removeRipple" class="v-btn--no-ripple">
          <v-icon @click="drawer = !drawer"> mdi-arrow-left </v-icon>
        </v-btn>
        <v-toolbar-title>Bodembeweging</v-toolbar-title>
        <v-spacer></v-spacer>
        <img src="./assets/Deltares_logo_D-blauw_RGB.png" alt="Deltares Logo" height="40">
      </v-app-bar>
    </div>

    <v-main>
    <v-navigation-drawer
      absolute
      dark
      src="./assets/subsoil-background.jpg"
      width="300"
      v-model="drawer"
      hide-overlay
    >
      <v-list>
        <v-list-item
          v-for="([text], i) in items"
          :key="i"
          link
        >
          <v-list-item-content>
            <v-list-item-title>{{ text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
      <mapbox-map @point-clicked="appCollapsed = !appCollapsed" />
      <app-pane :panelIsCollapsed="appCollapsed" />
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
    items: [
      ['Dataset 1'],
      ['Dataset 2']
    ]
  }),
  methods: {
    ...mapActions(['getLocations'])
  },
  mounted () {
    console.log('mounted loaded')
    this.getLocations()
  }
}
</script>
