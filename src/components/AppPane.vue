<template>
    <div class="app-panel" :class="{ 'app-panel--collapsed': panelIsCollapsed }">
      <div class="details d-flex flex-row">
      <v-btn
      v-if="!panelIsCollapsed"
      class="app-panel__minimize"
      icon
      title="Minimaliseer"
      @click="$emit('update:panelIsCollapsed', !panelIsCollapsed)"
      >
        <v-icon>mdi-chevron-down</v-icon>
      </v-btn>

      <div class="details__column">
        <h3 class="text-h6">
          Details meetlocatie
        </h3>
        <location-details :pointSelected="pointSelected" />
        <v-divider class="my-8" />
        <!-- <level-details /> -->
      </div>

      <div class="details__column">
    <v-card>
      <v-tabs
        background-color="#AA7F4A"
        center-active
        dark
      >
        <v-tab>Pictures</v-tab>
        <v-tab>Elevation</v-tab>
        <v-tab>Water Quality</v-tab>

      <v-tab-item>
          <h3 class="text-h6">
            Pictures
          </h3>
      </v-tab-item>

      <v-tab-item>
          <h3 class="text-h6">
            Timeseries voor {{ id }}
          </h3>
      </v-tab-item>

      <v-tab-item>
          <h3 class="text-h6">
            Pictures
          </h3>
      </v-tab-item>

      </v-tabs>
    </v-card>
        <!-- <area-chart v-if="showChart" /> -->
      </div>
      <v-chart :option="chartOptions" />
      </div>
    </div>
</template>

<script>
import 'echarts'
import VChart from 'vue-echarts'
import LocationDetails from './LocationDetails'

export default {
  name: 'AppPane',
  components: { LocationDetails, VChart },
  props: {
    panelIsCollapsed: {
      type: Boolean,
      default: false
    },
    pointSelected: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      chartOptions: {
        textStyle: {
          fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif'
        },
        title: {
          text: 'Traffic Sources',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: [
            'Direct',
            'Email',
            'Ad Networks',
            'Video Ads',
            'Search Engines'
          ]
        },
        series: [
          {
            name: 'Traffic Sources',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: 335, name: 'Direct' },
              { value: 310, name: 'Email' },
              { value: 234, name: 'Ad Networks' },
              { value: 135, name: 'Video Ads' },
              { value: 1548, name: 'Search Engines' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    }
  },
  computed: {
    id () {
      return this.pointSelected?.properties.loc_id
    }
  }
}
</script>

<style>
.app-panel {
  position: fixed;
  z-index: 1;
  z-index: 2;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 66vh;
  overflow: hidden;
  transform: translateY(0);
  transition: transform 0.35s cubic-bezier(0.25, 0.8, 0.5, 1);
  background-color: #fff;
  box-shadow: 0 -2px 8px 0px rgba(0, 0, 0, .3);
}

.app-panel--collapsed {
  transform: translateY(100%);
}

.app-panel__minimize {
  position: absolute;
  top: 0;
  right: 0;
  margin: 8px;
}

.details {
  gap: 24px;
  height: 100%;
  padding: 52px 0;
  overflow: hidden;
}

.details__column {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 24px;
  overflow: auto;
}

.details__column .text-h6 {
  margin-bottom: 16px;
}

.details__column:first-child {
  flex: 0 0 600px;
}

.details__column:last-child {
  flex: 1 1 auto;
}
</style>
