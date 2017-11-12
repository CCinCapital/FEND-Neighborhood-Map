const AppViewModel = {
  displaySideBar: ko.observable(false),

  location: ko.observable(''),
  ph: 'Enter Location',
  filters: ko.observableArray(['1', '2', '3', '4']),

  address: ko.observableArray(INITIAL_PLACES_OF_INTEREST),

  handleClick: function(target) {
    console.log(target)
  },

  toggleSideBar: function(e) {
    this.displaySideBar(!this.displaySideBar())
  },
}

ko.applyBindings(AppViewModel)
