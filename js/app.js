const AppViewModel = {
  displaySideBar: ko.observable(false),

  location: ko.observable(''),
  ph: 'Enter Location',
  filters: ko.observableArray(['1', '2', '3', '4']),

  address: ko.observableArray([
    {address: '101 cormack circle'},
    {address: '202 go north way'},
    {address: '303 hungury road'},
    {address: '404 not found'},
    {address: '111 in the air'}
  ]),

  handleClick: function(target) {
    console.log(target)
  },

  toggleSideBar: function(e) {
    this.displaySideBar(!this.displaySideBar())
  },
}

ko.applyBindings(AppViewModel)
