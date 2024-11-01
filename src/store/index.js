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
    rainfallTimeseries: {},
    extensometerTimeseries: [],
    selectedPoint: {},
    rainfallUnit: '',
    extensometerUnit: ''
  },
  mutations: {
    SET_LOCATIONS (state, locations) {
      state.locations = locations
    },
    SET_RAINFALL_TIMESERIES (state, rainfallTimeseries) {
      state.rainfallTimeseries = rainfallTimeseries
      state.rainfallUnit = rainfallTimeseries.parameterProperties.unit
    },
    SET_EXTENSOMETER_TIMESERIES (state, extensometerTimeseries) {
      Vue.set(state, 'extensometerTimeseries', extensometerTimeseries)
      if (extensometerTimeseries.length > 0 && extensometerTimeseries[0].parameterProperties) {
        state.extensometerUnit = extensometerTimeseries[0].parameterProperties.unit
      }
      console.log('Extensometer Timeseries updated:', state.extensometerTimeseries)
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
    }
  },
  getters: {
    rainfallTimeSeries: state => {
      return state.rainfallTimeseries.timeseries || []
    },
    rainfallUnit: state => {
      return state.rainfallUnit || ''
    },
    extensometerTimeSeries: state => {
      if (!state.extensometerTimeseries || state.extensometerTimeseries.length === 0) {
        return []
      }

      // Return an array of all the timeseries arrays
      return state.extensometerTimeseries.map(item => item.timeseries || [])
    },
    extensometerUnit: state => {
      return state.extensometerUnit || ''
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
    async getRainfallTimeseriesData ({ commit }) {
      // TODO: make a better reset of the timeseries state
      this.state.rainfallTimeseries = {}
      const rainfallTimeseries = await wps({
        identifier: 'nobvgl_wps_gettimeseries',
        outputName: 'jsonstimeseries',
        functionid: 'locationinfo',
        data: JSON.stringify({ measid: this.state.selectedPoint.properties.meas_id, parameter: 'regenval', datestart: '2024-03-01', dateend: '2024-03-31' })
      })
      if (rainfallTimeseries.errMsg) {
        console.log(rainfallTimeseries.errMsg)
      } else {
        commit('SET_RAINFALL_TIMESERIES', rainfallTimeseries)
      }
    },
    async getExtensometerTimeseriesData ({ commit }) {
      // TODO: make a better reset of the timeseries state
      this.state.extensometerTimeseries = []

      const parameters = ['zetting1', 'zetting2', 'zetting3', 'zetting4', 'zetting5', 'zetting6']
      const requests = parameters.map(parameter => {
        return wps({
          identifier: 'nobvgl_wps_gettimeseries',
          outputName: 'jsonstimeseries',
          functionid: 'locationinfo',
          data: JSON.stringify({
            measid: this.state.selectedPoint.properties.meas_id,
            parameter: parameter,
            datestart: '2024-03-01',
            dateend: '2024-03-31'
          })
        })
      })

      try {
        const results = await Promise.all(requests)

        const successfulResults = results.filter(result => {
          if (result.errMsg) {
            console.log(result.errMsg)
            return false
          }
          return true
        })

        // Commit the successful results
        commit('SET_EXTENSOMETER_TIMESERIES', successfulResults)
      } catch (error) {
        console.error('An error occurred while fetching extensometer data:', error)
      }
    },
    setSelectedPoint ({ commit }, point) {
      commit('SET_SELECTED_POINT', point)
    }
  },
  modules: {
  }
})
