// Create array of objects containing information for the markers
// and list items / buttons.
var places = ko.observableArray([
  {
    lat: 39.040008,
    lng: -94.357552,
    title: "Silverstein Eye Centers Arena",
    id: 'silverstein-arena',
  },
  {
    lat: 39.039778,
    lng: -94.347704,
    title: 'Interstate I-70',
    id: 'interstate-i-70',
  },
  {
    lat: 39.030588,
    lng: -94.357518,
    title: 'Vitamin Cottage',
    infoWindow: '',
    id: 'vitamin-cottage',
  },
  {
    lat: 39.034521,
    lng: -94.351333,
    title: 'Little Blue River',
    id: 'little-blue-river',
  },
  {
    lat: 39.036698,
    lng: -94.357593,
    title: 'Costco',
    id: 'costco',
  }
]);

// Initialize Google Map
function initGoogleMap() {

  // Create map
  var googleMap = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: 39.036018,
      lng: -94.353780
    },
    zoom: 15,
    fullscreenControl: true,
    zoomControl: false,
    streetViewControl: false
  });

  var ajaxFailureCount = 0;

  // TODO Future enhancment. Add only one click event
  // to the map.  Clicking the markers should 'bubble up'
  // to the map and they can be handled there dependent
  // on event.eventTarget
  // Example:
  // googleMap.addListener('click', function(event) {
  //   console.log(event.eventTarget)
  //   do more stuff;
  // });

  // Loop over markers array creating new map markers.
  places().forEach(function(data) {
    var mkPosition = new google.maps.LatLng(data.lat, data.lng);
    var marker = new google.maps.Marker({
      position: mkPosition,
      map: googleMap,
      title: data.title,
      animation: google.maps.Animation.DROP,
    });

    var infoWindow;

    // TODO Future enhancement. Assign this ajax call as a variable outside the
    // forEach() loop. On marker clicks, pass in the marker and make the ajax
    // call then.
    $.ajax({
      url: 'https://en.wikipedia.org/w/api.php?format=json&action=opensearch&search=' + data.title + '&callback=wikiCallback',
      dataType: 'jsonp',
      jsonp: 'callback',
      headers: {'Api-User-Agent': 'jforce/udacity-project/jason@mojason.com'},
      success: function(response) {
        var linkString = "<div class='map-info-window'><h5>" + data.title + "</h5>" +
                         "<p>" + response[2][0] + "</p>";
        response[3].forEach(function(entry) {
          linkString += '<a href="' + entry + '" target=_blank>' + entry + '</a><br>';
        });
        linkString += "</div>"
        data.contentString = linkString;
      }
    }).fail(function() {

      // Don't want to alert the user 5 times if API calls to Wikipedia are failing.  Once is enough
      // to indicate there's an issue.
      if (ajaxFailureCount === 0) {
        alert('Oops!  Looks like there was an issue getting data from Wikipedia.  Try refreshing the page.');
        ajaxFailureCount++;
      }
      data.contentString = 'Oops!  Looks like there was an issue getting data from Wikipedia.  Try refreshing the page.';
    }).done(function() {
      infoWindow = new google.maps.InfoWindow({
        content: data.contentString
      });
    });

    // Set the marker we just created as a property on the list
    // we just looped over so we can have it available for later.
    data.mapMarker = marker;

    // Add listener for clicks to the marker we just created.
    marker.addListener('click', function(event) {
      data.triggerMarker(marker);
      places().forEach(function(place) {
        if (data.title === place.title) {
          place.openInfoWindow();
        } else {
          place.closeInfoWindow();
        }
      });
    });

    googleMap.addListener('click', function() {
      places().forEach(function(place) {
        place.closeInfoWindow();
      });
    });

    data.triggerMarker = function(marker) {
      infoWindow.open(googleMap, marker);
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function() { marker.setAnimation(null); }, 700);
    }.bind(this);

    data.closeInfoWindow = function() {
      infoWindow.close(googleMap, marker);
    }.bind(this);

    data.openInfoWindow = function() {
      infoWindow.open(googleMap, marker);
    }.bind(this);

    mapMarkersExist = true;
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
  }

  // Create the DIV to hold the Toggle List control and call the
  // ControlListView() constructor passing in this DIV and the map on which
  // the control is to be created.
  var ControlListViewDiv = document.createElement('div');
  ControlListView = new ControlListView(ControlListViewDiv, googleMap);

  ControlListViewDiv.index = 1;
  googleMap.controls[google.maps.ControlPosition.LEFT].push(ControlListViewDiv);
}

function ViewModel() {
  var self = this;
  this.placeList = ko.observableArray([]);

  places().forEach(function(place) {
    place.visible = ko.observable(true);
    self.placeList.push(place);
  });

  this.filterValue = ko.observable('');

  // Called by list item clicks.
  this.triggerMapMarker = function(name, event) {
    places().forEach(function(place) {
      if (event.target.id === place.id) {
        place.triggerMarker(place.mapMarker);
      } else {
        place.closeInfoWindow();
      }
    });
  };

  // Filter the list and trigger the marker on user
  // input into the filter text input.
  this.filterList = ko.computed(function() {
    places().forEach(function(place) {
      var searchParam = self.filterValue().toLowerCase();
      var toBeSearched = place.title.toLowerCase();

      // Set visible binding to the folowing boolean.  Filters on type.
      place.visible(!toBeSearched.indexOf(searchParam) || !searchParam);

      // Have to add check for existence of mapMarker since on initial render,
      // the marker doesn't yet exist by the time filterList() is called / built.
      if (place.visible() && searchParam && place.mapMarker) {
        place.triggerMarker(place.mapMarker)
      }

      // Make sure to close all infowindows if the filter doesn't have a match.
      else if (place.mapMarker) {
        place.closeInfoWindow();
      }
    })
  }, this);
}

ko.applyBindings(new ViewModel());
