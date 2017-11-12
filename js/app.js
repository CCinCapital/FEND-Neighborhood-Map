const AppViewModel = {
  displaySideBar: ko.observable(false),

  location: ko.observable(''),
  ph: 'Enter Location',
  tags: ko.observableArray(['All']),
  selectedTag: ko.observable(),
  markers: ko.observableArray(),

  handleClick: function(target) {
    markerBounce.call(this, target)
  },

  toggleSideBar: function() {
    this.displaySideBar(!this.displaySideBar())
  },

  filt: function() {
    filt.call(this, this)
  }
}

ko.applyBindings(AppViewModel)


function filt() {
  const filter = this.selectedTag()

  this.markers().forEach(function(mark) {
    if(filter == 'All') {
      mark.setVisible(true)
    }
    else {
      if(!mark.tags.includes(filter)) {
        mark.setVisible(false)
      }
      else {
        mark.setVisible(true)
      }      
    }
  })
}