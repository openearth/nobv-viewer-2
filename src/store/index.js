import Vue from 'vue'
import Vuex from 'vuex'
import wps from '../lib/wps'

Vue.use(Vuex)

export default new Vuex.Store({
  namespaced: true,

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
          'circle-color': '#E41c1f',
          'circle-radius': 5,
          'circle-stroke-width': 5,
          'circle-stroke-color': '#000',
          'circle-stroke-opacity': 0.5
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
