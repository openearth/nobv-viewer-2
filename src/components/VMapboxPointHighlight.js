export default {
  name: 'v-mapbox-point-highlight',
  inject: ['getMap'],
  render: () => null,
  mounted () {
    console.log('mounted')
    this.addHighlightEffect()
  },
  methods: {
    deferredMountedTo () {
      this.addHighlightEffect()
    },
    addHighlightEffect () {
      const map = this.getMap()
      let hoverId = null
      map.on('click', 'locations', (event) => {
        console.log('event', event.features[0])
        map.getCanvas().style.cursor = 'pointer'

        if (event.features.length === 0) return

        // When the mouse moves over the locations layer, update the
        // feature state for the feature under the mouse
        if (hoverId) {
          map.removeFeatureState({
            source: 'locations',
            id: hoverId
          })
        }

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

      // When the mouse leaves the locations layer, update the
      // feature state of the previously hovered feature
    }
  }
}
