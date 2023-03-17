<template>
  <v-app>
    <div>
      <v-app-bar
        color="#A1887F"
        dense
        dark
      >
        <v-app-bar-nav-icon></v-app-bar-nav-icon>

        <v-toolbar-title>Page title</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon>
          <v-icon>mdi-heart</v-icon>
        </v-btn>

        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <v-menu
          left
          bottom
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              v-for="n in 5"
              :key="n"
              @click="() => {}"
            >
              <v-list-item-title>Option {{ n }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>
    </div>

    <v-main>
    <v-navigation-drawer
      absolute
      dark
      src="./assets/subsoil-background.jpg"
      width="300"
      permanent
    >
      <v-list>
        <v-list-item
          v-for="([icon, text], i) in items"
          :key="i"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
      <mapbox-map @map-clicked="appCollapsed = !appCollapsed" />
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
    appCollapsed: true,
    items: [
      ['mdi-email', 'Inbox'],
      ['mdi-account-supervisor-circle', 'Supervisors'],
      ['mdi-clock-start', 'Clock-in']
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
