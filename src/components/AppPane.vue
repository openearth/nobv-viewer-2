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
      <v-chart :option="chartOptions" class="chart" />

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
      </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
  watch: {
    timeSeries () {
      console.log(this.timeSeries)
      this.renderChart()
    }
  },
  data () {
    return {
      chartOptions: {
        tooltip: {
          trigger: 'axis',
          position: function (pt) {
            return [pt[0], '10%']
          }
        },
        title: {
          left: 'center',
          text: 'Large Ara Chart'
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'time',
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%']
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 20
          },
          {
            start: 0,
            end: 20
          }
        ],
        series: [
          {
            name: 'Fake Data',
            type: 'line',
            smooth: true,
            symbol: 'none',
            areaStyle: {},
            data: this.timeSeries // this is where the data is passed
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['timeSeries']),
    id () {
      return this.pointSelected?.properties.loc_id
    }
  },
  methods: {
    renderChart () {
      console.log('rendering')
      this.chartOptions.series[0].data = this.timeSeries
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

.chart {
  height: 400px;
}
</style>
