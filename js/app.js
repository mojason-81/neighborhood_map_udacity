'use strict';

// Create array of objects containing all the markers' information.
// TODO add Wikipedia API calls and Yelp API calls for info / reviews.
var places = ko.observableArray([
  {
    lat: 39.039148,
    lng: -94.348433,
    title: "Stroud's",
    id: 'strouds',
    listItem: '',/*Later set as an object*/
    mapMarker: '',/*Later set as an object*/
    closeInfoWindow: ''/*Later set as a function*/,
    openInfoWindow: ''/*Later set as a function*/
  },
  {
    lat: 39.035531,
    lng: -94.341660,
    title: 'Corner Cafe',
    id: 'corner-cafe',
    listItem: '',/*Later set as an object*/
    mapMarker: '',/*Later set as an object*/
    closeInfoWindow: ''/*Later set as a function*/,
    openInfoWindow: ''/*Later set as a function*/
  },
  {
    lat: 39.030588,
    lng: -94.357518,
    title: 'Natural Grocers',
    infoWindow: '',
    id: 'natural-grocers',
    listItem: '',/*Later set as an object*/
    mapMarker: '',/*Later set as an object*/
    closeInfoWindow: ''/*Later set as a function*/,
    openInfoWindow: ''/*Later set as a function*/
  },
  {
    lat: 39.034521,
    lng: -94.351333,
    title: 'Little Blue River',
    id: 'little-blue-river',
    listItem: '',/*Later set as an object*/
    mapMarker: '',/*Later set as an object*/
    closeInfoWindow: ''/*Later set as a function*/,
    openInfoWindow: ''/*Later set as a function*/
  },
  {
    lat: 39.036698,
    lng: -94.357593,
    title: 'Costco',
    id: 'costco',
    listItem: '',/*Later set as an object*/
    mapMarker: '',/*Later set as an object*/
    closeInfoWindow: ''/*Later set as a function*/,
    openInfoWindow: ''/*Later set as a function*/
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

    var clickable = $('#' + data.id);
    var infoWindow = new google.maps.InfoWindow({
      content: data.contentString
    });

    if (data.title === "Stroud's") {

      // TODO research Yelp API.  After cursory overview, it doesn't appear
      // There is AJAX integration.
      var linkString = "<a href='http://independence.stroudsrestaurant.com/' target=_blank>Click here for stroudsrestaurant.com</a>";
      infoWindow.setContent(linkString);
    }

    if (data.title === 'Corner Cafe') {

      // TODO research Yelp API.  After cursory overview, it doesn't appear
      // There is AJAX integration.
      var linkString = "<a href='http://www.thecornercafe.com/' target=_blank>Click here for thecornercafe.com</a>";
      infoWindow.setContent(linkString);
    }

    if (data.title === 'Natural Grocers') {
      $.ajax({
        url: 'https://en.wikipedia.org/w/api.php?format=json&action=opensearch&search=vitamin%20cottage%20natural%20grocers&callback=wikiCallback',
        dataType: 'jsonp',
        jsonp: 'callback',
        headers: {'Api-User-Agent': 'jforce/udacity-project/jason@mojason.com'},
        success: function(response) {
          var linkString = '<p>Want to learn a little about Natural Grocers?</p>';
          response[3].forEach(function(entry) {
            linkString += '<a href="' + response[3] + '" target=_blank>' + entry + '</a><br>'
          });
          infoWindow.setContent(linkString);
        },
        fail: function() {
          infoWindow.setContent('Oops!  Looks like there was an issue getting data from Wikipedia.  Try refreshing the page.')
        }
      });
    }

    if (data.title === 'Little Blue River') {
      $.ajax({
        // The commented out url will return data that can be used to get the actual wiki article content.
        // However, without using some fancy regex to parse only the bits you want from the 'extract', you
        // end up creating a very large infowindow when you stick that content into it.
        //url: 'https://en.wikipedia.org/w/api.php?action=query&format=json&prop=revisions%7Cextracts%7Clinks&titles=Little_Blue_River_(Missouri)&redirects=1&callback=wikiCallback&utf8=1&rvprop=content&rvparse=1&exsectionformat=plain',
        url: 'https://en.wikipedia.org/w/api.php?format=json&action=opensearch&search=little%20blue%20river%20MO&callback=wikiCallback',
        dataType: 'jsonp',
        jsonp: 'callback',
        headers: {'Api-User-Agent': 'jforce/udacity-project/jason@mojason.com'},
        success: function(response) {
          var linkString = '<p>Want to learn a little about Little Blue River?</p>';
          response[3].forEach(function(entry) {
            linkString += '<a href="' + response[3] + '" target=_blank>' + entry + '</a><br>'
          });
          infoWindow.setContent(linkString);
        },
        fail: function() {
          infoWindow.setContent('Oops!  Looks like there was an issue getting data from Wikipedia.  Try refreshing the page.')
        }
      });
    }

    if (data.title === 'Costco') {
      $.ajax({
        url: 'https://en.wikipedia.org/w/api.php?format=json&action=opensearch&search=costco&callback=wikiCallback',
        dataType: 'jsonp',
        jsonp: 'callback',
        headers: {'Api-User-Agent': 'jforce/udacity-project/jason@mojason.com'},
        success: function(response) {
          var linkString = '<p>Want to learn a little about Costco?</p>';
          response[3].forEach(function(entry) {
            linkString += '<a href="' + response[3] + '" target=_blank>' + entry + '</a><br>'
          });
          infoWindow.setContent(linkString);
        },
        fail: function() {
          infoWindow.setContent('Oops!  Looks like there was an issue getting data from Wikipedia.  Try refreshing the page.')
        }
      });
    }

    // Set the marker we just created as a property on the list
    // we just looped over so we can have it available to KO.
    data.mapMarker = marker;// FIXME this happens after the list is built.
    data.listItem = clickable;

    // Add listener for clicks and toggle bouncing marker when clicked.
    marker.addListener('click', function(event) {
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null);

        // Grab clear list button anc call it's click event
        $('#clear-list-btn').trigger('click');
        infoWindow.close(googleMap, marker);
      } else {
        infoWindow.open(googleMap, marker);
        marker.setAnimation(google.maps.Animation.BOUNCE);

        // Grab list item via jQuery and call it's click event
        // clickable.trigger('click');
        places().forEach(function(place) {
          if (clickable.text() === place.title) {
            place.listItem.show();
            place.openInfoWindow();
          } else {
            place.listItem.hide();
            place.closeInfoWindow();
            place.mapMarker.setAnimation(null);
          }
        });
      }
    });

    googleMap.addListener('click', function() {
      places().forEach(function(place) {
        place.listItem.show();
        place.closeInfoWindow();
        place.mapMarker.setAnimation(null);
      });
    })

    data.closeInfoWindow = function() {
      infoWindow.close(googleMap, marker);
    }.bind(this);

    data.openInfoWindow = function() {
      infoWindow.open(googleMap, marker);
    }.bind(this);
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
  this.placeFilter = ko.observable();

  this.filterPlaces = function() {
    places().forEach(function(place) {
      if (self.placeFilter() != place.title) {
        place.mapMarker.setVisible(false);
        place.listItem.hide();
      } else {
        place.mapMarker.setVisible(true);
        place.listItem.show();
        place.openInfoWindow();
      }
    });
  };


  // FIXME places is an observableArray.  We need to monitor changes to it,
  // and call initPlaces on changes since the markers are added to it after
  // initPlaces() runs.
  places().forEach(function(place) {
    self.placeList.push(place);
  });

  this.filterList = function(name, event) {
    // if this one is hidden, show it and hide everything else
    places().forEach(function(place) {
      if (event.target.id != place.id) {
        place.listItem.hide();
        // item.mapMarker.trigger('click');
        place.mapMarker.set('animation', null);
        place.closeInfoWindow();
      }
      else {
        place.openInfoWindow();
        place.mapMarker.set('animation', 1);
        place.listItem.show();
      }
    });
  };

  this.clearFilter = function() {
    places().forEach(function(place) {
      place.listItem.show();
      place.mapMarker.setVisible(true);
      place.mapMarker.set('animation', null);
      place.closeInfoWindow();
    });
  };
};

ko.applyBindings(new ViewModel());
