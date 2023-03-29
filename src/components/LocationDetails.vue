<template>
  <div class="location-details">
    <v-simple-table v-if="activeLocation">
      <template v-slot:default>
        <tbody>
          <tr>
            <td>Naam</td>
            <td>{{ id }}</td>
          </tr>
          <tr>
            <td>Coördinaten</td>
            <td>Lng: {{ coordinates[0] }} - Lat: {{ coordinates[1] }}</td>
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
import { mapGetters } from 'vuex'

export default {
  name: 'LocationDetails',
  computed: {
    ...mapGetters('locations', ['activeLocation']),
    id () {
      return this.activeLocation.properties.loc_id
    },
    coordinates () {
      return this.activeLocation.geometry.coordinates
    },
    meanhead () {
      return this.activeLocation.properties.meanhead
    }
  }
}
</script>

<style>
</style>
