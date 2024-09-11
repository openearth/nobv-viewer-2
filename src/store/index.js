import Vue from 'vue'
import Vuex from 'vuex'
import wps from '../lib/wps'

Vue.use(Vuex)

export default new Vuex.Store({
  namespaced: true,

  state: {
    locations: {},
    locationFeatures: {},
    locationList: [],
    layerLocations: {}
  },
  mutations: {
    SET_LOCATIONS (state, locations) {
      state.locations = locations
    },
    SET_LOCATION_FEATURES (state, locationFeatures) {
      state.locationFeatures = locationFeatures
    },
    SET_LOCATION_LIST (state, locationList) {
      state.locationList = locationList
    },
    SET_LAYER_LOCATIONS (state, featureCollection) {
      const pointLayer = {
        id: 'locations',
        source: {
          data: featureCollection,
          type: 'geojson',
          generateId: true
        },
        type: 'circle',
        layout: {},
        paint: {
          'circle-color': ['case', ['boolean', ['feature-state', 'hover'], false], '#AA7F4A', '#ffffff'],
          'circle-radius': 5,
          'circle-stroke-width': 5,
          'circle-stroke-color': '#000',
          'circle-stroke-opacity': 0.5
        }
      }
      state.layerLocations = pointLayer
    }
  },
  getters: {
  },
  actions: {
    async getLocationsData ({ commit }) {
      const locations = await wps({
        identifier: 'nobvgl_wps_read_locations',
        outputName: 'jsonstations'
      })
      if (locations.errMsg) {
        console.log(locations.errMsg)
      } else {
        commit('SET_LOCATIONS', locations)
        commit('SET_LAYER_LOCATIONS', locations)
      }

      const locationFeatures = locations.features
      commit('SET_LOCATION_FEATURES', locationFeatures)

      const locationList = locationFeatures.map(feature => feature.properties.loc_id)
      commit('SET_LOCATION_LIST', locationList)
    }
  },
  modules: {
  }
})
