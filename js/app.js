const AppViewModel = {
  displaySideBar: ko.observable(false),
  tags: ko.observableArray(['All']),

  markers: ko.observableArray(),
  markerNameFilter: ko.observable(),
  markerTagFilter: ko.observable(),

  markerNameFilter_ph: 'Enter Location',


  handleClick: function(target) {
    onMarkerClick.call(this, target)
  },

  toggleSideBar: function() {
    this.displaySideBar(!this.displaySideBar())
  },

  filt: function() {
    filtByTag.call(this, this)
    filtByName.call(this, this)
  }
}

AppViewModel.markerNameFilter.subscribe(function(change) {
  AppViewModel.filt()
})

ko.applyBindings(AppViewModel)


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
