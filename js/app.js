function AppViewModel() {
  this.location = ko.observable('')
  this.ph = 'Enter Location'
  this.filters = ko.observableArray(['1', '2', '3', '4'])

  this.address = ko.observableArray([
    {address: '101 cormack circle'},
    {address: '202 go north way'},
    {address: '303 hungury road'},
    {address: '404 not found'},
    {address: '505 in the air'}
  ])

  this.handleClick = function(target) {
    console.log(target)
  }
}

ko.applyBindings(new AppViewModel())