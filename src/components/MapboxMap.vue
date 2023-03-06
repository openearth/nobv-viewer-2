<template>
  <div class="mapbox-map">
    <v-mapbox
      class="mapbox-map__map"
      access-token="pk.eyJ1Ijoic2lnZ3lmIiwiYSI6Il8xOGdYdlEifQ.3-JZpqwUa3hydjAJFXIlMA"
      map-style="mapbox://styles/mapbox/satellite-v9"
      id="map"
      ref="map"
    >
    </v-mapbox>
  </div>
</template>

<script>
export default {
  name: 'MapboxMap'

}
</script>
