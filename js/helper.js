"use strict"

function makeXMLHttpRequest (method, baseUrl, request, headers, payload) {
  const url = baseUrl + '/' + request

  return new Promise(function(resolve, reject) {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url)

    Object.entries(headers).map(function(header) {
      xhr.setRequestHeader(header[0], header[1])
    })

    xhr.onload = function() {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response)
      }
      else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        })
      }
    }
    xhr.onerror = function() {
      reject({
        status: this.status,
        statusText: xhr.statusText
      })
    }
    xhr.send(JSON.stringify(payload))
  })
}

function makeRequest(request, payload) {
  const method = 'POST',
        baseUrl = "https://rapidapi.io/connect/YelpAPI",
        _RapidAPIProject = 'udayelp_5a1f5e1fe4b07e6c1dd209ac',
        _RapidAPIKey = 'bdfcc432-1754-4202-ae14-91abf6041306',
        headers = {
          "Authorization":"Basic "+btoa(_RapidAPIProject+":"+_RapidAPIKey),
          "Content-Type":"application/json",
          "Accept":"application/json"
        }

  return makeXMLHttpRequest(method, baseUrl, request, headers, payload)
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

function GeoLocation (options) {
  return new Promise(function(resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  })
}

function initMarkers () {
  if(AppViewModel.mapLoaded() && AppViewModel.businessLoaded()) {
    AppViewModel.businesses().map(function(business) {
      business.marker = createMarker(business)
    })
  }
}

function replaceMarkers (array) {
  const visibleMarkers = AppViewModel.filteredBusinesses().map(function(business){return business.marker})
  
  AppViewModel.businesses().map(function(business) {
    if(visibleMarkers.includes(business.marker)){
      business.marker.setVisible(true)
    }
    else {
      business.marker.setVisible(false)
    }
  })
}

function createMarker (business) {
  const latLng = {lat: business.coordinates.latitude, lng: business.coordinates.longitude}

  const marker = new google.maps.Marker({
    map: AppViewModel.map,
    position: latLng,
  })

  marker.infoWindow = new google.maps.InfoWindow()

  marker.addListener('click', function() {
    onMarkerClick(business)
  })

  return marker
}


function placeMarker(latLng, map) {
  if(AppViewModel.userMarker) {
    AppViewModel.userMarker.setMap(null)
  }

  const image = {
    path: google.maps.SymbolPath.CIRCLE,
    strokeColor: 'red',
    scale: 6,
  };
  AppViewModel.userMarker = new google.maps.Marker({
    position: latLng,
    map: map,
    icon: image,
  })
  AppViewModel.map.panTo(latLng)
}

function onMarkerClick(target) {
  const lat = target.coordinates.latitude,
        lng = target.coordinates.longitude

  closeAllInfoWindow()
  mapPanTo(lat, lng)
  markerBounce(target.marker)
  openInfoWindow(target)
}

function closeAllInfoWindow() {
  AppViewModel.businesses().map(function(business) {
    if(business.marker) {
      business.marker.infoWindow.close()
    }
  })
}

function openInfoWindow(business) {
  const {marker, name, price, rating, review_count, url, display_phone, location, image_url} = business
  const address = location.display_address.join(',').toString().replace(/,/g, ', ')

  if(marker.infoWindow.marker != marker) {
    marker.infoWindow.marker = marker
    marker.infoWindow.setContent(`
      <div style="width: 250px;">
        <h3>${name}</h3>
        <p>
          <span>Price: ${price}</span>
          <span>- Rating: ${rating}</span>
          <span>- Reviews: ${review_count}</span>
        </p>
        <p>Phone: ${display_phone} |<span style="padding-left: 20px;"><a href=${url} target="_blank">Website</a></span></p>        
        <p>Address: ${address}</p>
        <img src=${image_url} alt=${name} style="width: 100px;"/>
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

function mapPanTo(lat, lng) {
  AppViewModel.map.panTo({lat:lat, lng:lng})
}