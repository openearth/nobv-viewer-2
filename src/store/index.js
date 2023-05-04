import Vue from 'vue'
import Vuex from 'vuex'
import wps from '../lib/wps'
import buildFeatureUrl from '@/lib/build-feature-url'

Vue.use(Vuex)

export default new Vuex.Store({
  namespaced: true,

  state: {
    locations: {},
    layerLocations: {},
    selectedArea: null,
    areas: [],
    timeSeries: null
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
          // AN ID NEEDS TO BE GENERATED
          data: featureCollection,
          type: 'geojson',
          generateId: true
        },
        type: 'circle',
        layout: {},
        paint: {
          'circle-color': ['case', ['boolean', ['feature-state', 'hover'], false], 'firebrick', 'whitesmoke'],
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
    },
    SET_TIMESERIES (state, timeSeries) {
      state.timeSeries = timeSeries
    }
  },
  getters: {
    timeSeries (state) {
      console.log('in Getter')
      const data = []
      if (state.timeSeries && state.timeSeries.timeseries) {
        const { timeseries } = state.timeSeries
        timeseries.forEach(element => {
          const { datetime, head } = element
          const date = new Date(datetime)
          data.push([date, head])
        })
      }
      return data
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
      const response = await fetch(buildFeatureUrl({
        url: 'https://bodembewegingen.nl/geoserver/nobv/ows',
        layer: 'nobv:boundingbox'
      }))
      const areasData = await response.json()
      commit('SET_AREAS', areasData.features)
    },
    async getTimeseries ({ commit, state }, id) {
      const jsonData = {
        locid: id, // check it
        parameter: 'Grondwaterstand'
      }
      commit('SET_TIMESERIES', null)
      const timeSeries = await wps({
        identifier: 'nobv_wps_gettimeseries',
        outputName: 'jsonstimeseries',
        functionid: 'locationinfo',
        data: JSON.stringify(jsonData)
      })
      if (timeSeries.errMsg) {
        // console.log(locations.errMsg)
      } else {
        // console.log(timeSeries)
        commit('SET_TIMESERIES', timeSeries)
      }
    }
  },
  modules: {
  }
})
