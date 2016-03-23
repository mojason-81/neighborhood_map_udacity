// Initialize Google Map
function initGoogleMap() {

  // Create map
  var googleMap = new google.maps.Map(document.getElementById("map"), {
    center: {lat: 39.035, lng: -94.352},
    zoom: 15,
    fullscreenControl: true,
    zoomControl: false,
    streetViewControl: false
  });

  // Create array of objects containing all the markers' information.
  // TODO add Wikipedia API calls and Yelp API calls for info / reviews.
  var markers = [
    {
      position: new google.maps.LatLng(39.039148,-94.348433),
      title: "Stroud's",
      animation: google.maps.Animation.DROP,
      map: googleMap
    },
    {
      position: new google.maps.LatLng(39.035531,-94.341660),
      title: 'Corner Cafe',
      animation: google.maps.Animation.DROP,
      map: googleMap
    },
    {
      position: new google.maps.LatLng(39.030588,-94.357518),
      title: 'Natural Grocers',
      animation: google.maps.Animation.DROP,
      map: googleMap
    },
    {
      position: new google.maps.LatLng(39.034521,-94.351333),
      title: 'Little Blue River',
      animation: google.maps.Animation.DROP,
      map: googleMap
    },
    {
      position: new google.maps.LatLng(39.036698,-94.357593),
      title: 'Costco',
      animation: google.maps.Animation.DROP,
      map: googleMap
    }
  ];

  // Loop over markers array creating new map markers.
  markers.forEach(function(data) {
    var marker = new google.maps.Marker({
      position: data.position,
      map: data.map,
      title: data.title,
      animation: data.animation
    });

    // Add listener for clicks and bounce the marker when clicked.
    marker.addListener('click', bounce);
  });

  // Bounce animation for clicking on marker courtesy of Google's examples.
  var bounce = function() {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }

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
