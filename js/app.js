'use strict';
// Create array of objects containing all the markers' information.
// TODO add Wikipedia API calls and Yelp API calls for info / reviews.
var places = ko.observableArray([
  {
    lat: 39.039148,
    lng: -94.348433,
    title: "Stroud's",
    contentString: "<p>Some random factoids via API here.</p>",
    id: 'strouds',
    listItem: '',
    mapMarker: ''
  },
  {
    lat: 39.035531,
    lng: -94.341660,
    title: 'Corner Cafe',
    contentString: "<p>Some random factoids via API here.</p>",
    id: 'corner-cafe',
    listItem: '',
    mapMarker: ''
  },
  {
    lat: 39.030588,
    lng: -94.357518,
    title: 'Natural Grocers',
    contentString: "<p>Some random factoids via API here.</p>",
    id: 'natural-grocers',
    listItem: '',
    mapMarker: ''
  },
  {
    lat: 39.034521,
    lng: -94.351333,
    title: 'Little Blue River',
    contentString: "<p>Some random factoids via API here.</p>",
    id: 'little-blue-river',
    listItem: '',
    mapMarker: ''
  },
  {
    lat: 39.036698,
    lng: -94.357593,
    title: 'Costco',
    contentString: "<p>Some random factoids via API here.</p>",
    id: 'costco',
    listItem: '',
    mapMarker: ''
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
      animation: google.maps.Animation.DROP,
    });
    var clickable = $('#' + data.id)

    // Set the marker we just created as a property on the list
    // we just looped over so we can have it available to KO.
    data.mapMarker = marker;// FIXME this happens after the list is built.
    data.listItem = clickable;

    // Add listener for clicks and toggle bouncing marker when clicked.
    marker.addListener('click', function(event) {
      // console.log(event.latLng.lat());
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null);

        // Grab clear list button anc call it's click event
        $('#clear-list-btn').trigger('click');
        infoWindow.close(googleMap, marker);
      } else {
        infoWindow.open(googleMap, marker);
        marker.setAnimation(google.maps.Animation.BOUNCE);

        // Grab list item via jQuery and call it's click event
        clickable.trigger('click');
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



function ViewModel() {
  var self = this;

  this.placeList = ko.observableArray([]);

  // FIXME places is an observableArray.  We need to monitor changes to it,
  // and call initPlaces on changes since the markers are added to it after
  // initPlaces() runs.
  this.initPlaces = function() {
    places().forEach(function(item) {
      self.placeList.push(item);
    });
    self.placeList.sort();
  };

  // may have to refactor this.  data (name) and the event (dom event)
  // associated with a dom object.  need the js object.
  this.filterList = function(name, event) {
    // if this one is hidden, show it and hide everything else
    places().forEach(function(item) {
      if (event.target.id != item.id) {
        item.listItem.hide();
        // item.mapMarker.trigger('click');
        item.mapMarker.set('animation', null);
      }
      else {
        item.listItem.show();
      }
    });
  };

  this.clearFilter = function() {
    places().forEach(function(item) {
      item.listItem.show();
    });
  };

  self.initPlaces();
};

ko.applyBindings(new ViewModel());
