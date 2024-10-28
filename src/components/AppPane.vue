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
        <!-- <level-details /> -->
      </div>

      <div class="details__column">
    <v-card>
      <v-tabs
        background-color="#AA7F4A"
        center-active
        dark
      >
        <v-tab>Regenval</v-tab>
        <!-- <v-tab>Foto's</v-tab> -->

      <v-tab-item style="margin: 10px">
          <h3 class="text-h6">
            Tijdreeks voor {{ id }}
          </h3>
        <v-responsive
          class="scroll-x"
          :min-height="0"
          :style="{ 'overflow-x': 'auto' }"
        >
          <v-chart v-if="hasTimeSeriesData" :option="chartOptions" class="chart"/>
          <div v-else class="no-data-message">Geen tijdreeksgegevens beschikbaar</div>
        </v-responsive>
      </v-tab-item>

      <!-- <v-tab-item style="margin: 10px">
          <h3 class="text-h6">
            Foto's
          </h3>
      </v-tab-item> -->

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
          boundaryGap: false,
          axisLabel: {
            formatter: '{yyyy}/{MM}/{dd}',
            rotate: -20
          },
          offset: 5
        },
        yAxis: {
          type: 'value',
          name: this.unit,
          min: function (value) {
            return Math.ceil(value.min - (value.max - value.min) / 2)
          },
          max: function (value) {
            return Math.ceil(value.max + (value.max - value.min) / 2)
          },
          boundaryGap: [0, '100%'],
          axisLabel: {
            showMinLabel: true,
            showMaxLabel: true
          }
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            start: 0,
            end: 100,
            top: '85%'
          }
        ],
        grid: {
          top: '50px',
          right: '40px',
          bottom: '70px',
          left: '16px',
          containLabel: true,
          backgroundColor: '#fff'
        },
        series: [
          {
            name: 'Regenval',
            type: 'line',
            smooth: true,
            symbol: 'none',
            areaStyle: {
              color: 'rgba(0, 0, 0, 0)'
            },
            data: this.timeSeries,
            markPoint: {
              data: [
                {
                  label: {
                    color: '#373737',
                    textBorderColor: 'none',
                    offset: [0, -15]
                  },
                  name: 'Max',
                  symbolOffset: [0, -5],
                  symbolRotate: 180,
                  type: 'max'
                },
                {
                  label: {
                    color: '#373737',
                    textBorderColor: 'none',
                    offset: [0, 15]
                  },
                  name: 'Min',
                  symbolOffset: [0, 5],
                  type: 'min'
                }
              ],
              emphasis: {
                disabled: true
              },
              itemStyle: {
                color: '#373737'
              },
              symbol: 'arrow',
              symbolSize: '10'
            }
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['timeSeries', 'unit']),
    id () {
      return this.pointSelected?.properties.loc_id
    },
    hasTimeSeriesData () {
      return this.timeSeries && this.timeSeries.length > 0
    }
  },
  methods: {
    renderChart () {
      // Sort timeseries data by ascending timestamp. TODO: this should be handled by the backend
      const sortedData = this.timeSeries
        .map(item => [new Date(item.timestamp), item.value])
        .sort((a, b) => a[0] - b[0])

      this.chartOptions.series[0].data = sortedData
      this.chartOptions.yAxis.name = this.unit
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
