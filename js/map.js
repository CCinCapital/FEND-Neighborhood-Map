function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 0, lng: 0},
    zoom: 3,
    // Move contols around
    // https://developers.google.com/maps/documentation/javascript/examples/control-positioning
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
      position: google.maps.ControlPosition.TOP_RIGHT
    },

    zoomControl: true,
    zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER
    },

    streetViewControl: true,
    StreetViewControlOptions: {
      position: google.maps.ControlPosition.RIGHT_BOTTOM
    },

    scaleControl: true,
    fullscreenControl: true,
  })

  // Search bar for locations.
  // https://developers.google.com/maps/documentation/javascript/examples/places-searchbox
  const input = document.getElementById('mapSearch')
  const searchBox = new google.maps.places.SearchBox(input)

  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds())
  })

  let markers = []
  searchBox.addListener('places_changed', function() {
    let places = searchBox.getPlaces()
    if(places.length == 0) {
      return
    }

    markers.forEach(function(marker) {
      marker.setMap(null)
    })
    markers = []

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds()
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry")
        return
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      }

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }))

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport)
      } else {
        bounds.extend(place.geometry.location)
      }
    })
    map.fitBounds(bounds)
  })
}
