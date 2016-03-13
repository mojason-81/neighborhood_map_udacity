'use strict';
let initialMap = {
  width: '100%',
  frameborder: '0',
  height: '100%',
  style: 'border:0',
  source: 'https://www.google.com/maps/embed/v1/search?&key=AIzaSyBI2IgE-hBI2jxk4kbBqklCZ_u_SNKekkY' +
          '&q=721+NW+6th+St+Blue+Springs,+MO+64014&zoom=14 allowfullscreen'
};

let GoogleMap = function(data) {
  this.width = ko.observable(data.width);
  this.height = ko.observable(data.height);
  this.frameborder = ko.observable(data.frameborder);
  this.style = ko.observable(data.style);
  this.source = ko.observable(data.source);
};

let ViewModel = function() {
  let self = this;
  this.currentMap = ko.observable(new GoogleMap(initialMap));
};

ko.applyBindings(new ViewModel());
