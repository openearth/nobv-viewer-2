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
            <td>Lng: {{ coordinates?.lng?.toFixed(3) }} - Lat: {{ coordinates?.lat?.toFixed(3) }}</td>
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
      return this.pointSelected?.properties.loc_id
    },
    coordinates () {
      return this.pointSelected?.lngLat
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
