"use strict"
const helper = {
  makeXMLHttpRequest: function (method, baseUrl, request, headers, payload) {
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
  },

  makeRequest: function (request, payload) {
    const method = 'POST',
          baseUrl = "https://rapidapi.io/connect/YelpAPI",
          _RapidAPIProject = 'udayelp_5a1f5e1fe4b07e6c1dd209ac',
          _RapidAPIKey = 'bdfcc432-1754-4202-ae14-91abf6041306',
          headers = {
            "Authorization":"Basic "+btoa(_RapidAPIProject+":"+_RapidAPIKey),
            "Content-Type":"application/json",
            "Accept":"application/json"
          }

    return helper.makeXMLHttpRequest(method, baseUrl, request, headers, payload)
  },

  jsSet: function (array) {
    let _hash = {}
    let result = []

    for (let i = 0; i < array.length; i++) {
      if(!_hash[array[i]]) {
        _hash[array[i]] = true
        result.push(array[i])
      }  
    }
    return result
  },

  getGeoLocation: function (options) {
    return new Promise(function(resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject, options)
    })
  },
}

const map = {
  initMarkers: function () {
    if(AppViewModel.mapLoaded() && AppViewModel.businessLoaded()) {
      AppViewModel.businesses().map(function(business) {
        business.marker = map.createMarker(business)
      })
    }
  },

  createMarker: function (business) {
    const latLng = {lat: business.coordinates.latitude, lng: business.coordinates.longitude}

    const marker = new google.maps.Marker({
      map: AppViewModel.map,
      position: latLng,
    })

    marker.infoWindow = new google.maps.InfoWindow()

    marker.addListener('click', function() {
      map.onMarkerClick(business)
    })

    return marker
  },

  removeAllMarkers: function (markers) {
    markers.map(function(marker){
      marker.marker.setMap(null)
    })
  },

  placeMarker: function (latLng, map) {
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
  },

  filtMarkers: function () {
    const visibleMarkers = AppViewModel.filteredBusinesses().map(function(business){return business.marker})
    
    AppViewModel.businesses().map(function(business) {
      if(visibleMarkers.includes(business.marker)){
        business.marker.setVisible(true)
      }
      else {
        business.marker.setVisible(false)
      }
    })
  },

  onMarkerClick: function (target) {
    const lat = target.coordinates.latitude,
          lng = target.coordinates.longitude

    map.closeAllInfoWindow()
    map.mapPanTo({lat: lat, lng: lng})
    map.markerBounce(target.marker)
    map.openInfoWindow(target)
  },

  markerBounce: function (marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE)
    setTimeout(function() {
      marker.setAnimation(null)
    },1400)
  },

  openInfoWindow: function (business) {
    const {marker, name, price, rating, review_count, url, display_phone, location, image_url} = business
    const address = location.display_address.join(',').toString().replace(/,/g, ', ')

    if(marker.infoWindow.marker != marker) {
      marker.infoWindow.marker = marker
      marker.infoWindow.setContent(`
        <div style="width: 180px;">
          <h3>${name}</h3>
          <p>Price: ${price}</p>
          <p>Rating: ${rating}</p>
          <p>Reviews: ${review_count}</p>
          <p>Phone: ${display_phone}</p>
          <p>Website: <a href=${url} target="_blank">Link</a></p>
          <p>Address: ${address}</p>
          <img src=${image_url} alt=${name} style="width: 100px; height: 80px;"/>
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
  },

  closeAllInfoWindow: function () {
    AppViewModel.businesses().map(function(business) {
      if(business.marker) {
        business.marker.infoWindow.close()
      }
    })
  },

  mapPanTo: function(latLng) {
    AppViewModel.map.panTo(latLng)
  },

  offsetMap: function() {
    let mapCenter = AppViewModel.map.getCenter()

    map.mapPanTo({lat: mapCenter.lat(), lng: mapCenter.lng()})
  },

  getBusinesses: function (position) {
    AppViewModel.geoLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    }
    AppViewModel.businessLoaded(false)
    map.removeAllMarkers(AppViewModel.businesses())
    map.mapPanTo(AppViewModel.geoLocation)
    map.placeMarker(AppViewModel.geoLocation, AppViewModel.map)
    
    return helper.makeRequest('getBusinesses', { 
      'accessToken': AppViewModel.yelpAccessToken.access_token,
      'coordinate': `${AppViewModel.geoLocation.lat}, ${AppViewModel.geoLocation.lng}`,
    })
  }
}
