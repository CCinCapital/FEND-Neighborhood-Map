const AppViewModel = {
  displaySideBar: ko.observable(false),

  location: ko.observable(''),
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
      }
      else {
        marker.setVisible(true)
        marker.shown(true)
      }      
    }
  })
}