const INITIAL_PLACES_OF_INTEREST = [
  { name: 'Casa Loma',
    position: {
      lat: 43.6780158,
      lng: -79.4095692,
    },
    tags: ['Castle', 'Historical'],
  },
  { name: 'Art Gallery of Ontario',
    position: {
      lat: 43.653605,
      lng: -79.392505,
    },
    tags: ['Educational'],
  },
  { name: 'Royal Ontario Museum',
    position: {
      lat: 43.667687,
      lng: -79.394774,
    },
    tags: ['Educational'],
  },
  {
    name: 'Old City Hall',
    position: {
      lat: 43.652485,
      lng: -79.382011,
    },
    tags: ['City Hall', 'Historical'],
  },
  {
    name: 'Rogers Centre',
    position: {
      lat: 43.641447,
      lng: -79.389329,
    },
    tags: ['Stadium'],
  },
]

function initApp() {
  let tags = []
  INITIAL_PLACES_OF_INTEREST.forEach(function(place) {
    place.tags.forEach(function(tag) {
      tags.push(tag)
    })
  })

  const uniqueTags = jsSet(tags)
  uniqueTags.forEach(function(tag) {
    AppViewModel.tags.push(tag)
  })
}

function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 43.662825, lng: -79.395648},
    zoom: 14,
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

  // Setup markers for each initial location
  INITIAL_PLACES_OF_INTEREST.forEach(function(place) {
    const marker = new google.maps.Marker({
      map: map,
      position: place.position,
    })

    marker.addListener('click', function() {
      onMarkerClick(this)
    })

    marker.infoWindow = new google.maps.InfoWindow()
    marker.name = place.name
    marker.tags = place.tags
    marker.shown = ko.observable(true)

    AppViewModel.markers.push(marker)
  })

  // Search bar for locations.
  // https://developers.google.com/maps/documentation/javascript/examples/places-searchbox
  const input = document.getElementById('mapSearch')
  const searchBox = new google.maps.places.SearchBox(input)

  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds())
  })

  searchBox.addListener('places_changed', function() {
    let places = searchBox.getPlaces()
    if(places.length == 0) {
      return
    }

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds()
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry")
        return
      }

      // Create a marker for each place.
      const infoWindow = new google.maps.InfoWindow()
      const marker = new google.maps.Marker({
        map: map,
        title: place.name,
        position: place.geometry.location,
        animation: google.maps.Animation.DROP,
      })
      marker.addListener('click', function() {
        openInfoWindow(this, infoWindow)  
      })

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

function onMarkerClick(marker) {
  markerBounce(marker)
  openInfoWindow(marker)
}

function openInfoWindow(marker) {
  if(marker.infoWindow.marker != marker) {
    marker.infoWindow.marker = marker
    marker.infoWindow.setContent(`
      <div>
        <p></p>
      </div>
    `)
    marker.infoWindow.open(map, marker)
    marker.infoWindow.addListener('closeclick', function() {
      marker.infoWindow.setMarker = null
    })
  }
  else {
    marker.infoWindow.open(map, marker)
  }
}

function markerBounce(marker) {
  marker.setAnimation(google.maps.Animation.BOUNCE)
  setTimeout(function() {
    marker.setAnimation(null)
  },1400)
}
