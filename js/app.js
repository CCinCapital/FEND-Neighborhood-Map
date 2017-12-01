const AppViewModel = {
  yelpAccessToken: null,
  APP_DEFAULT_LAT_LNG: {lat: 43.662825, lng: -79.395648}, 
  geoLocation: null,

  map: null,
  mapLoaded: ko.observable(false),
  businessLoaded: ko.observable(false),
  businesses: ko.observableArray(),
  filteredBusinesses: ko.observableArray(),

  userMarker: null,

  categories: ko.observableArray(['All']),
  categoryFilter: ko.observable(),

  price: ko.observableArray(['All']),
  priceFilter: ko.observable(),

  nameFilter: ko.observable(),
  nameFilter_ph: 'Enter store name',

  updateBusinesses: function(businesses) {
    let categories = AppViewModel.categories()
    let price = AppViewModel.price()

    AppViewModel.businesses.removeAll()
    JSON.parse(businesses).payload.businesses
      .map(function(business) {
        AppViewModel.businesses.push(business)
        business.categories.map(function(category) {
          categories.push(category.title)
        })
        price.push(business.price)
      })

    AppViewModel.filteredBusinesses(AppViewModel.businesses())
    AppViewModel.categories(jsSet(categories))
    AppViewModel.price(jsSet(price).sort())

    AppViewModel.businessLoaded(true)
  },

  handleClick: function(target) {
    console.log(target)
    onMarkerClick(target)
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
    closeAllInfoWindow()
    AppViewModel.filteredBusinesses(
      filt
      .filtByName(AppViewModel.nameFilter())
      .filtByPrice(AppViewModel.priceFilter())
      .filtByCategory(AppViewModel.categoryFilter())
      .buffer
    )
  }
}

let filt = {
  array: AppViewModel.businesses(),
  buffer: [],

  filtByName: function(filter) {
    if(!filter) {
      this.buffer = this.array
      return this
    }

    this.buffer = this.array.filter(function(element) {
      if(element.name.toLowerCase().indexOf(filter) >= 0) {
        return element
      }
    })

    return this
  },

  filtByPrice: function(filter) {
    if(this.buffer.length > 0 && filter != 'All') {
      this.buffer = this.buffer.filter(function(element) {
        if(element.price.length <= filter.length) {
          return element
        }
      })      
    }

    return this
  },

  filtByCategory: function(filter) {
    if(this.buffer.length > 0 && filter != 'All') {
      this.buffer = this.buffer.filter(function(element) {
        if(element.categories.filter(function(category){if(category.title == filter) return category}).length > 0) {
          return element
        }
      })
    }

    return this
  }
}

AppViewModel.nameFilter.subscribe(function(change) {
  AppViewModel.filt()
})

AppViewModel.priceFilter.subscribe(function(change) {
  AppViewModel.filt()
})

AppViewModel.categoryFilter.subscribe(function(change) {
  AppViewModel.filt()
})

AppViewModel.mapLoaded.subscribe(function(change) {
  initMarkers()
})

AppViewModel.businessLoaded.subscribe(function(change) {
  initMarkers()
})

AppViewModel.filteredBusinesses.subscribe(function(change) {
  if(AppViewModel.businessLoaded()) {
    replaceMarkers()
  }
})

ko.applyBindings(AppViewModel)