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
    layerLocations: {},
    timeseries: {},
    selectedPoint: {}
  },
  mutations: {
    SET_LOCATIONS (state, locations) {
      state.locations = locations
    },
    SET_TIMESERIES (state, timeseries) {
      state.timeseries = timeseries
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
          'circle-color': [
            'case',
            ['boolean', ['feature-state', 'selected'], false], '#AA7F4A', // Color for selected points
            ['boolean', ['feature-state', 'hover'], false], '#AA7F4A', // Color for hovered points
            '#ffffff' // Default color (white)
          ],
          'circle-radius': 5,
          'circle-stroke-width': 5,
          'circle-stroke-color': '#000',
          'circle-stroke-opacity': 0.5
        }
      }
      state.layerLocations = pointLayer
    },
    SET_SELECTED_POINT (state, point) {
      state.selectedPoint = point
      console.log('selectedPoint', state.selectedPoint)
    }
  },
  getters: {
    timeSeries: state => {
      return state.timeseries.timeseries || []
    }
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
    },
    async getTimeseriesData ({ commit }) {
      // TODO: make a better reset of the timeseries state
      this.state.timeseries = {}
      const timeseries = await wps({
        identifier: 'nobvgl_wps_gettimeseries',
        outputName: 'jsonstimeseries',
        functionid: 'locationinfo',
        data: JSON.stringify({ measid: this.state.selectedPoint.properties.meas_id, parameter: 'regenval', datestart: '2024-03-01', dateend: '2024-03-31' })
      })
      if (timeseries.errMsg) {
        console.log(timeseries.errMsg)
      } else {
        commit('SET_TIMESERIES', timeseries)
      }
    },
    setSelectedPoint ({ commit }, point) {
      commit('SET_SELECTED_POINT', point)
    }
  },
  modules: {
  }
})
