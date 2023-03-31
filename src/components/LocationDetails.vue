<template>
  <div class="location-details">
    <v-simple-table>
      <template v-slot:default>
        <tbody>
          <tr>
            <td>Naam</td>
            <td>{{ id }}</td>
          </tr>
          <tr>
            <td>Coördinaten</td>
            <td>Lng: {{ coordinates.lng }} - Lat: {{ coordinates.lat }}</td>
          </tr>
          <tr>
            <td>Gemiddelde</td>
            <td>{{ meanhead }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>

export default {
  name: 'LocationDetails',
  computed: {

    id () {
      return this.pointSelected.properties.loc_id
    },
    coordinates () {
      return this.pointSelected.lngLat
    },
    meanhead () {
      return this.pointSelected.properties.meanhead
    }
  },
  props: {
    pointSelected: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style>
</style>
