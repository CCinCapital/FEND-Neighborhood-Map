function initApp() {
  initYelpAPI()
}

function initYelpAPI() {
  const _YelpAppId = 'bg69c3FQKEnMNsBUwvk2YA',
        _YelpAppSecret = 'M3IkShcjrhXDGSvQebZhNizmX8imOnXs308UfB2BPCC1JFZXykvt5zhUZjfLMZdl'

  makeRequest('getAccessToken', {'appId': _YelpAppId,'appSecret': _YelpAppSecret})
    .then(function(response) {
      AppViewModel.yelpAccessToken = JSON.parse(response).payload
    })
    .catch(function(err) {
      throw new Error(`Error encountered during initializing Yelp API: ${err}`)
    })
    .then(function(){  
      return makeRequest('getBusinesses', { 
        'accessToken': AppViewModel.yelpAccessToken.access_token,
        'coordinate': `${AppViewModel.APP_DEFAULT_LAT_LNG.lat}, ${AppViewModel.APP_DEFAULT_LAT_LNG.lng}`,
      })
    })
    .then(AppViewModel.updateBusinesses)
}

function initMap() {
  AppViewModel.map = new google.maps.Map(document.getElementById('map'), {
    backgroundColor: '#00aaa0',
    center: AppViewModel.APP_DEFAULT_LAT_LNG,
    clickableIcons: false,
    disableDefaultUI: true,
    fullscreenControl: false,
    gestureHandling: 'greedy',
    keyboardShortcuts: false,
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

    streetViewControl: false,

    scaleControl: true,
  })

  // Search bar for locations.
  // https://developers.google.com/maps/documentation/javascript/examples/places-searchbox
  const input = document.getElementById('mapSearchBox')
  const searchBox = new google.maps.places.SearchBox(input)

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
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport)
      } else {
        bounds.extend(place.geometry.location)
      }
    })
    AppViewModel.map.fitBounds(bounds)
  })

  AppViewModel.map.addListener('click', function(e) {
    placeMarker(e.latLng, map)
  })

  AppViewModel.mapLoaded(true)
}

function placeMarker(latLng, map) {
  const image = {
    path: google.maps.SymbolPath.CIRCLE,
    strokeColor: 'red',
    scale: 6,
  };
  const marker = new google.maps.Marker({
    position: latLng,
    map: map,
    icon: image,
  })
  AppViewModel.map.panTo(latLng)
}

function initMarker(map, place) {
  const marker = new google.maps.Marker({
    map: map,
    position: place.position,
  })

  marker.addListener('click', function() {
    onMarkerClick(this)
  })

  marker.infoWindow = new google.maps.InfoWindow()
  marker.wikiURL = place.wikiURL
  marker.name = place.name
  marker.tags = place.tags
  marker.shown = ko.observable(true)
  marker.uuid = uuid()

  return marker
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
        <p>Loading Info...</p>
      </div>
    `)

    const page = marker.wikiURL.split('/').pop()
    fetch(`/w/api.php?action=query&format=json&prop=extracts&titles=${place}&exintro=1`, {
      headers: {
        'Api-User-Agent' : 'Example/1.0'
      },
      mode: 'cors',
      method: 'POST'
    }).then(console.log)
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
