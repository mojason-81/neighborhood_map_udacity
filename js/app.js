'use strict';
var initialPlaces = [
  {name: 'Stroud\'s'},
  {name: 'Corner Cafe'},
  {name: 'Natural Grocers'},
  {name: 'Little Blue River'},
  {name: 'Costco'}
];

//var Place = function(data) {
//  this.name = ko.observable(data);
//};

var View = function() {
  var $toggleListBtn = $('#toggle-list-btn');
};

var ViewModel = function() {
  var self = this;
  this.placeList = ko.observableArray([]);
  console.log(self.placeList());

  var initPlaces = function() {
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
    console.log(self.placeList());
    initPlaces();
  };

  initPlaces();
};

ko.applyBindings(new ViewModel());

//console.log('app.js loads');
//console.log($('#toggle-list-btn'));
