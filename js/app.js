'use strict';
// Create array of objects containing all the markers' information.
// TODO add Wikipedia API calls and Yelp API calls for info / reviews.
var places = ko.observableArray([
  {
    lat: 39.039148,
    lng: -94.348433,
    title: "Stroud's",
    contentString: "<p>Some random factoids via API here.</p>",
    listItem: 'strouds',
    marker: ''
  },
  {
    lat: 39.035531,
    lng: -94.341660,
    title: 'Corner Cafe',
    contentString: "<p>Some random factoids via API here.</p>",
    listItem: 'corner-cafe',
    marker: ''
  },
  {
    lat: 39.030588,
    lng: -94.357518,
    title: 'Natural Grocers',
    contentString: "<p>Some random factoids via API here.</p>",
    listItem: 'natural-grocers',
    marker: ''
  },
  {
    lat: 39.034521,
    lng: -94.351333,
    title: 'Little Blue River',
    contentString: "<p>Some random factoids via API here.</p>",
    listItem: 'little-blue-river',
    marker: ''
  },
  {
    lat: 39.036698,
    lng: -94.357593,
    title: 'Costco',
    contentString: "<p>Some random factoids via API here.</p>",
    listItem: 'costco',
    marker: ''
  }
]);
// Initialize Google Map
function initGoogleMap() {

  // Create map
  var googleMap = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: 39.035,
      lng: -94.352
    },
    zoom: 15,
    fullscreenControl: true,
    zoomControl: false,
    streetViewControl: false
  });

  // Loop over markers array creating new map markers.
  places().forEach(function(data) {
    var mkPosition = new google.maps.LatLng(data.lat, data.lng);
    var marker = new google.maps.Marker({
      position: mkPosition,
      map: googleMap,
      title: data.title,
      animation: google.maps.Animation.DROP
    });

    // Add listener for clicks and toggle bouncing marker when clicked.
    marker.addListener('click', function() {
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
      } else {
        infoWindow.open(googleMap, marker);
        marker.setAnimation(google.maps.Animation.BOUNCE);
        $('#' + marker.title).click();
        ViewModel.filterList(marker.title);
      }
    });

    var infoWindow = new google.maps.InfoWindow({
      content: data.contentString
    });
  });

  //  Create custom control for displaying / hiding list view
  //  Based off of Google's sample at:
  //  https://developers.google.com/maps/documentation/javascript/examples/control-custom
  function ControlListView(controlDiv, map) {

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.marginTop = '5px';
    controlUI.style.marginLeft = '10px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click for list view';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'Toggle List';
    controlUI.appendChild(controlText);

    // Setup the click event listener
    $(controlUI).click(function(e) {
      $('#sidebar').slideToggle();
    });
  };

  // Create the DIV to hold the Toggle List control and call the
  // ControlListView() constructor passing in this DIV and the map on which
  // the control is to be created.
  var ControlListViewDiv = document.createElement('div');
  var ControlListView = new ControlListView(ControlListViewDiv, googleMap);

  ControlListViewDiv.index = 1;
  googleMap.controls[google.maps.ControlPosition.LEFT].push(ControlListViewDiv);
};

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

  this.initPlaces = function() {
    places().forEach(function(item) {
      self.placeList.push(item.title);
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
