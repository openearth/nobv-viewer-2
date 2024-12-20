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
            <v-tab>Bodembeweging</v-tab>
            <v-tab>Regenval</v-tab>

            <v-tab-item style="margin: 10px">
                <h3 class="text-h6">
                  Tijdreeks voor {{ id }}
                </h3>
              <v-responsive
                class="scroll-x"
                :min-height="0"
                :style="{ 'overflow-x': 'auto' }"
              >
                <v-chart v-if="hasExtensometerTimeSeriesData" :option="extensometerChartOptions" class="chart"/>
                <div v-else class="no-data-message">Geen tijdreeksgegevens van zetting beschikbaar</div>
              </v-responsive>
            </v-tab-item>

            <v-tab-item style="margin: 10px">
                <h3 class="text-h6">
                  Tijdreeks voor {{ id }}
                </h3>
              <v-responsive
                class="scroll-x"
                :min-height="0"
                :style="{ 'overflow-x': 'auto' }"
              >
                <v-chart v-if="hasRainfallTimeSeriesData" :option="rainfallChartOptions" class="chart"/>
                <div v-else class="no-data-message">Geen tijdreeksgegevens van regenval beschikbaar</div>
              </v-responsive>
            </v-tab-item>

          </v-tabs>
        </v-card>
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
    rainfallTimeSeries () {
      this.renderRainfallChart()
    },
    extensometerTimeSeries (newVal) {
      if (newVal && Array.isArray(newVal) && newVal.length > 0) {
        console.log('Extensometer timeseries updated, rendering chart.')
        this.renderExtensometerChart()
      }
    }
  },
  data () {
    return {
      extensometerChartOptions: {
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
        legend: {
          type: 'scroll',
          top: 'top',
          orient: 'horizontal',
          data: [],
          lineStyle: {
            symbol: 'none'
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
          name: this.extensometerUnit ? `[${this.extensometerUnit}]` : '',
          min: function (value) {
            const minValue = value.min - (value.max - value.min) / 2
            return minValue < 0 ? Math.floor(minValue) : Math.ceil(minValue)
          },
          max: function (value) {
            const maxValue = value.max + (value.max - value.min) / 2
            return maxValue < 0 ? Math.floor(maxValue) : Math.ceil(maxValue)
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
        series: []
      },
      rainfallChartOptions: {
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
          name: this.rainfallUnit ? `[${this.rainfallUnit}]` : '',
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
            data: this.rainfallTimeSeries,
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
    ...mapGetters(['rainfallTimeSeries', 'rainfallUnit', 'extensometerTimeSeries', 'extensometerUnit']),
    id () {
      return this.pointSelected?.properties.loc_id
    },
    hasRainfallTimeSeriesData () {
      return this.rainfallTimeSeries && this.rainfallTimeSeries.length > 0
    },
    hasExtensometerTimeSeriesData () {
      return this.extensometerTimeSeries && this.extensometerTimeSeries.length > 0
    }
  },
  methods: {
    renderRainfallChart () {
      // Sort timeseries data by ascending timestamp. TODO: this should be handled by the backend
      const sortedData = this.rainfallTimeSeries
        .map(item => [new Date(item.timestamp), item.value])
        .sort((a, b) => a[0] - b[0])

      this.rainfallChartOptions.series[0].data = sortedData
      this.rainfallChartOptions.yAxis.name = this.rainfallUnit ? `[${this.rainfallUnit}]` : ''
    },
    renderExtensometerChart () {
    // Check if extensometerTimeSeries is a valid array with at least one element
      if (!this.extensometerTimeSeries || !Array.isArray(this.extensometerTimeSeries) || this.extensometerTimeSeries.length === 0) {
        console.warn('Extensometer timeseries data is empty or undefined.')
        return
      }

      // Updated sortedData computation for each series
      const sortedData = this.extensometerTimeSeries.map((timeseriesArray, index) => {
        if (!Array.isArray(timeseriesArray) || timeseriesArray.length === 0) {
          console.warn(`Timeseries data is missing or invalid for zetting ${index + 1}`, timeseriesArray)
          return []
        }

        // Sort timeseries data by ascending timestamp
        return timeseriesArray
          .filter(item => item.timestamp && item.value !== undefined) // Filter valid entries
          .map(item => [new Date(item.timestamp).getTime(), item.value]) // Use getTime() to ensure the timestamp is in milliseconds
          .sort((a, b) => a[0] - b[0])
      })

      const colors = [
        '#A0522D',
        '#8B4513',
        '#6B4226',
        '#5C4033',
        '#4E3629',
        '#808080'
      ]

      // Update chart options to include all six time series
      this.extensometerChartOptions.series = sortedData.map((data, index) => ({
        name: `Zetting ${index + 1}`,
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: {
          color: colors[index],
          width: 2
        },
        itemStyle: {
          color: 'transparent'
        },
        areaStyle: {
          color: 'rgba(0, 0, 0, 0)'
        },
        data: data
      }))

      // Populate legend data with series names
      this.extensometerChartOptions.legend.data = sortedData.map((_, index) => `Zetting ${index + 1}`)

      // Update y-axis name if units are available
      this.extensometerChartOptions.yAxis.name = this.extensometerUnit ? `[${this.extensometerUnit}]` : ''
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
  /* TODO: the width fixes the DOM error when going between points, but the warning is still in the console */
  width: 75vw
}
</style>
