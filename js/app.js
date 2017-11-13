const AppViewModel = {
  displaySideBar: ko.observable(false),

  location: ko.observable(),
  ph: 'Enter Location',
  tags: ko.observableArray(['All']),
  selectedTag: ko.observable(),
  markers: ko.observableArray(),

  handleClick: function(target) {
    onMarkerClick.call(this, target)
  },

  toggleSideBar: function() {
    this.displaySideBar(!this.displaySideBar())
  },

  filt: function() {
    filtByTag.call(this, this)
  }
}

AppViewModel.location.subscribe(function(change) {
  filtByLocation(AppViewModel)
})

ko.applyBindings(AppViewModel)


function filtByTag() {
  const filter = this.selectedTag()

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
function filtByLocation(contex) {
  const filter = contex.location()
  contex.markers().forEach(function(marker) {
    if(marker.name.toLowerCase().indexOf(filter) >= 0) {
      marker.setVisible(true)
      marker.shown(true)
    }
    else {
      marker.setVisible(false)
      marker.shown(false)
      marker.infoWindow.close()
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
