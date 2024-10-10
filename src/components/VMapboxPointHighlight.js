export default {
  name: 'v-mapbox-point-highlight',
  inject: ['getMap'],
  render: () => null,
  mounted () {
    this.addHighlightEffect()
  },
  methods: {
    deferredMountedTo () {
      this.addHighlightEffect()
    },
    addHighlightEffect () {
      const map = this.getMap()
      let hoverId = null

      // Add hover effect when mouse enters the point
      map.on('mouseenter', 'locations', (event) => {
        map.getCanvas().style.cursor = 'pointer' // Change cursor to pointer

        if (event.features.length === 0) return

        // Remove hover state from previously hovered feature, if any
        if (hoverId) {
          map.removeFeatureState({
            source: 'locations',
            id: hoverId
          })
        }

        // Set the new hoverId and apply the hover state
        hoverId = event.features[0].id

        map.setFeatureState(
          {
            source: 'locations',
            id: hoverId
          },
          {
            hover: true
          }
        )
      })

      // Remove hover effect when mouse leaves the point
      map.on('mouseleave', 'locations', () => {
        map.getCanvas().style.cursor = '' // Reset cursor

        // Remove hover state from the last hovered feature
        if (hoverId) {
          map.removeFeatureState({
            source: 'locations',
            id: hoverId
          })
        }

        hoverId = null
      })
    }
  }
}
