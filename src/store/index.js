import Vue from 'vue'
import Vuex from 'vuex'
import wps from '../lib/wps'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    locations: {},
    layerLocations: {}
  },
  mutations: {
    SET_LOCATIONS (state, locations) {
      state.locations = locations
    },
    SET_LAYER_LOCATIONS (state, featureCollection) {
      const pointLayer = {
        id: 'locations',
        source: {
          data: featureCollection,
          type: 'geojson'
        },
        type: 'circle',
        layout: {},
        paint: {
          'circle-radius': 5,
          'circle-opacity': 0.7,
          'circle-color': '#54b04a'
        }
      }
      state.layerLocations = pointLayer
    }
  },
  actions: {
    async getLocations ({ commit }) {
      const locations = await wps({
        identifier: 'wps_read_gwslocations',
        outputName: 'jsonstations'
      })
      if (locations.errMsg) {
        console.log(locations.errMsg)
      } else {
        commit('SET_LOCATIONS', locations)
        commit('SET_LAYER_LOCATIONS', locations)
      }
    }
  },
  modules: {
  }
})
