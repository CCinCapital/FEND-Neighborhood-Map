const AppViewModel = {
  yelpAccessToken: null,

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

