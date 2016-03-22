// Initialize Google Map
function initGoogleMap() {
  /*-------------------------------------------------------
    Create custom control for displaying / hiding list view
    Based off of Google's sample at:
    https://developers.google.com/maps/documentation/javascript/examples/control-custom
  -----------------------------------------------------------------------------------*/
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

    // Make a jQuery object out of controlText and
    // set the ID so we can later manipulate it with KO.js
    var $controlText = $(controlText);
    $controlText.attr('id', 'toggle-list-btn');
    $controlText.attr('data-bind', 'click: toggleList');
    //console.log('map.js loads');
    //console.log($('#toggle-list-btn'));
    // Setup the click event listeners: simply set the map to Chicago.
    //controlUI.addEventListener('click', function(e) {
    //  console.log(e.target);
    //});
  };
  // Declare map marker coordinates
  var stroudsLatLong = new google.maps.LatLng(39.039148,-94.348433);
  var cornerCafeLatLong = new google.maps.LatLng(39.035531,-94.341660);
  var naturalGrocersLatLong = new google.maps.LatLng(39.030588,-94.357518);
  var littleBlueLatLong = new google.maps.LatLng(39.034521,-94.351333);
  var costcoLatLong = new google.maps.LatLng(39.036698,-94.357593);

  // Create map
  var googleMap = new google.maps.Map(document.getElementById("map"), {
    center: {lat: 39.035, lng: -94.352},
    zoom: 15,
    fullscreenControl: true,
    zoomControl: false,
    streetViewControl: false
  });


  // Create map markers with associated information
  var stroudsMarker = new google.maps.Marker({
    position: stroudsLatLong,
    map: googleMap,
    title: "Stroud's"
    // TODO use Yelp for review
  });

  var cornerCafeMarker = new google.maps.Marker({
    position: cornerCafeLatLong,
    map: googleMap,
    title: "Corner Cafe"
    // TODO use Yelp for review
  });

  var naturalGrocersMarker = new google.maps.Marker({
    position: naturalGrocersLatLong,
    map: googleMap,
    title: "Natural Grocers"
    // TODO find API for info source
  });

  var littleBlueMarker = new google.maps.Marker({
    position: littleBlueLatLong,
    map: googleMap,
    title: "Little Blue River"
    // TODO use wikipedia API for info on river
  });

  var costcoMarker = new google.maps.Marker({
    position: costcoLatLong,
    map: googleMap,
    title: "Costco"
    // TODO use wikipedia API for info on costco, maybe yelp for a review on the eatery
  });

  // Create the DIV to hold the control and call the ControlListView()
  // constructor passing in this DIV.
  var ControlListViewDiv = document.createElement('div');
  var ControlListView = new ControlListView(ControlListViewDiv, googleMap);

  ControlListViewDiv.index = 1;
  googleMap.controls[google.maps.ControlPosition.LEFT].push(ControlListViewDiv);
};
