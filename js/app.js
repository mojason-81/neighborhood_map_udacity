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
    lat: 39.035531,
    lng: -94.341660,
    title: 'Corner Cafe',
    id: 'corner-cafe',
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
      lat: 39.035,
      lng: -94.352
    },
    zoom: 15,
    fullscreenControl: true,
    zoomControl: false,
    streetViewControl: false
  });

  var $getWikiInfo = function(data) {
    console.log(data);

}

  // Loop over markers array creating new map markers.
  places().forEach(function(data) {
    var mkPosition = new google.maps.LatLng(data.lat, data.lng);
    var marker = new google.maps.Marker({
      position: mkPosition,
      map: googleMap,
      title: data.title,
      animation: google.maps.Animation.DROP,
    });

    var listButton = $('#' + data.id);

    var infoWindow;

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
        console.log(response);
        data.contentString = linkString;
      }
    }).fail(function() {
      data.contentString = 'Oops!  Looks like there was an issue getting data from Wikipedia.  Try refreshing the page.';
    }).done(function() {
      infoWindow = new google.maps.InfoWindow({
        content: data.contentString
      });
    });




    // Set the marker we just created as a property on the list
    // we just looped over so we can have it available for later.
    data.mapMarker = marker;
    data.listItem = listButton;

    // Add listener for clicks to the marker we just created.
    marker.addListener('click', function(event) {
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null);

        // Grab clear list button anc call it's click event
        $('#clear-list-btn').trigger('click');
        infoWindow.close(googleMap, marker);
      } else {
        infoWindow.open(googleMap, marker);
        marker.setAnimation(google.maps.Animation.BOUNCE);

        places().forEach(function(place) {
          if (listButton.text() === place.title) {
            place.listItem.show();
            place.openInfoWindow();
          } else {
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
    });

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
  this.placeFilter = ko.observable();
  $(document).ready($('#place-filter-input').focus());

  this.filterPlaces = function() {
    places().forEach(function(place) {
      if (self.placeFilter().toLowerCase() != place.title.toLowerCase()) {
        place.mapMarker.setVisible(false);
        place.listItem.hide();
      } else {
        place.mapMarker.setVisible(true);
        place.listItem.show();
        place.openInfoWindow();
      }
    });
  };

  places().forEach(function(place) {
    self.placeList.push(place);
  });

  this.filterList = function(name, event) {
    // if this one is hidden, show it and hide everything else
    places().forEach(function(place) {
      if (event.target.id != place.id) {
        place.mapMarker.set('animation', null);
        place.closeInfoWindow();
      }
      else {
        place.openInfoWindow();
        place.mapMarker.set('animation', 1);
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
}

ko.applyBindings(new ViewModel());
