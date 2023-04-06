import Vue from 'vue'
import Vuex from 'vuex'
import wps from '../lib/wps'

Vue.use(Vuex)

export default new Vuex.Store({
  namespaced: true,

  state: {
    locations: {},
    layerLocations: {},
    selectedArea: null,
    areas: []
  },
  mutations: {
    SET_LOCATIONS (state, locations) {
      state.locations = locations
    },
    SET_AREAS (state, areas) {
      state.areas = areas
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
    },
    SET_SELECTED_AREA (state, area) {
      state.selectedArea = area
    }
  },
  actions: {
    async getLocations ({ commit }) {
      const locations = await wps({
        identifier: 'nobv_wps_read_locations',
        outputName: 'jsonstations'
      })
      if (locations.errMsg) {
        console.log(locations.errMsg)
      } else {
        commit('SET_LOCATIONS', locations)
        commit('SET_LAYER_LOCATIONS', locations)
      }
    },
    async getAreas ({ commit }) {
      // for the moment you don't have a request to do
      const areas = [{
        name: 'Dataset 1',
        zoom: 10,
        center: [4.755652, 52.486396]
      },
      {
        name: 'Dataset 2',
        zoom: 10,
        center: [5.935102, 53.060563]
      }
      ]
      commit('SET_AREAS', areas)
    }
  },
  modules: {
  }
})
