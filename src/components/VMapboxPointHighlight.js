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
      let selectedId = null

      // Add hover effect when mouse enters the point
      map.on('mouseenter', 'locations', (event) => {
        map.getCanvas().style.cursor = 'pointer' // Change cursor to pointer

        if (event.features.length === 0) return

        // Get the hoverId and set hover state
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

        // Only remove hover state, do not affect selected state
        if (hoverId) {
          map.setFeatureState(
            {
              source: 'locations',
              id: hoverId
            },
            {
              hover: false // Only remove hover state, keep selection intact
            }
          )
        }

        hoverId = null
      })

      // Add click event to handle point selection
      map.on('click', 'locations', (event) => {
        if (event.features.length === 0) return

        const clickedId = event.features[0].id

        // Remove selected state from the previously selected feature
        if (selectedId && selectedId !== clickedId) {
          map.setFeatureState(
            {
              source: 'locations',
              id: selectedId
            },
            {
              selected: false // Reset the previous selected point
            }
          )
        }

        // Set the clicked feature as selected
        selectedId = clickedId

        map.setFeatureState(
          {
            source: 'locations',
            id: selectedId
          },
          {
            selected: true // Keep the selected state
          }
        )
      })
    }
  }
}
