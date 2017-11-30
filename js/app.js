const AppViewModel = {
  yelpAccessToken: null,
  APP_DEFAULT_LAT_LNG: {lat: 43.662825, lng: -79.395648}, 
  geoLocation: null,

  map: null,
  mapLoaded: ko.observable(false),
  businessLoaded: ko.observable(false),
  businesses: ko.observableArray(),

  updateBusinesses: function(businesses) {
    AppViewModel.businesses.removeAll()
    JSON.parse(businesses).payload.businesses
      .map(function(business) {
        AppViewModel.businesses.push(business)
      })
    AppViewModel.businessLoaded(true)
  },

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

  getGeoLocation: function() {
    GeoLocation()
      .then(function(position){
        AppViewModel.geoLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      })
  },

  filt: function() {
    filtByTag.call(this, this)
    filtByName.call(this, this)
  }
}

AppViewModel.markerNameFilter.subscribe(function(change) {
  AppViewModel.filt()
})

AppViewModel.businessLoaded.subscribe(function(change) {
  initMarkers()
})


ko.applyBindings(AppViewModel)
