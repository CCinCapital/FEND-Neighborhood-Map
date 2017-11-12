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
      title: place.name,
      position: place.position,
    })
    marker.addListener('click', markerBounce)
    marker.tags = place.tags
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
        openInfoWindow(this, place, infoWindow)
        // Why is this knockoutjs observableArray not causing UI update?
        // https://stackoverflow.com/a/10357748    
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

function openInfoWindow(marker, place, infoWindow) {
  if(infoWindow.marker != marker) {
    infoWindow.marker = marker
    infoWindow.setContent(`
      <div>
        <p>${place.formatted_address}</p>
      </div>
    `)
    infoWindow.open(map, marker)
    infoWindow.addListener('closeclick', function() {
      infoWindow.setMarker = null
    })
  }
  else {
    infoWindow.open(map, marker)
  }
}

function markerBounce() {
  let self = this
  self.setAnimation(google.maps.Animation.BOUNCE)
  setTimeout(function() {
    self.setAnimation(null)
  },1400)
}

function jsSet(array) {
  let _hash = {}
  let result = []

  for (let i = 0; i < array.length; i++) {
    if(!_hash[array[i]]) {
      _hash[array[i]] = true
      result.push(array[i])
    }  
  }
  return result
}