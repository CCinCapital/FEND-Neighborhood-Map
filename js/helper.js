"use strict"

function makeXMLHttpRequest (method, baseUrl, request, headers, payload) {
  const url = baseUrl + '/' + request

  return new Promise(function( resolve, reject) {
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


function filtByTag() {
  const filter = this.markerTagFilter()

  this.markers().forEach(function(marker) {
    if(filter == 'All') {
      marker.setVisible(true)
      marker.shown(true)
    }
    else {
      if(!marker.tags.includes(filter)) {
        marker.setVisible(false)
        marker.shown(false)
        marker.infoWindow.close()
      }
      else {
        marker.setVisible(true)
        marker.shown(true)
      }      
    }
  })
}

// Check string contains substring
// https://stackoverflow.com/questions/3480771/how-do-i-check-if-string-contains-substring
function filtByName() {
  const filter = this.markerNameFilter()
  if (!filter) {
    return
  }
  this.markers().forEach(function(marker) {
    if (marker.visible) {
      if(marker.name.toLowerCase().indexOf(filter) >= 0) {
        marker.setVisible(true)
        marker.shown(true)
      }
      else {
        marker.setVisible(false)
        marker.shown(false)
        marker.infoWindow.close()
      }
    }
  })
}

function filtMarker(marker, markers) {
  for(let i = 0; i < markers.length; i++) {
    if(markers[i].uuid === marker.id) {
      return markers[i]
    }
  }
  return undefined
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

function uuid () {
  return Date.now()+((Math.random()*0x10000000)|0).toString(16)
}

