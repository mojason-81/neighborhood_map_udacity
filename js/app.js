'use strict';
var initialPlaces = [
  {name: 'Stroud\'s'},
  {name: 'Corner Cafe'},
  {name: 'Natural Grocers'},
  {name: 'Little Blue River'},
  {name: 'Costco'}
];

var SideBarView = function() {
  // TODO add something from the view here.
  // Need to communicate with map.js somehow and tell it to hide / display
  // markers.
  // XXX Perhaps filterList should be here.  Hint* Look at the HTML data-binds
  // for the foreach loop.
};

var ViewModel = function() {
  var self = this;
  this.placeList = ko.observableArray([]);
  console.log(self.placeList());

  this.initPlaces = function() {
    initialPlaces.forEach(function(item) {
      self.placeList.push(item.name);
    });
    self.placeList.sort();
  };

  this.filterList = function(name) {
    self.placeList([
      name
    ]);
  };

  this.reinitList = function() {
    self.placeList([]);
    self.initPlaces();
  };

  self.initPlaces();
};

ko.applyBindings(new ViewModel());
