function initGoogleMap() {
  var stroudsLatLong = new google.maps.LatLng(39.039148,-94.348433);
  var cornerCafeLatLong = new google.maps.LatLng(39.035531,-94.341660);
  var naturalGrocersLatLong = new google.maps.LatLng(39.030588,-94.357518);
  var littleBlueLatLong = new google.maps.LatLng(39.034521,-94.351333);
  var costcoLatLong = new google.maps.LatLng(39.036698,-94.357593);

  var googleMap = new google.maps.Map(document.getElementById("map-area"), {
    center: {lat: 39.035, lng: -94.352},
    zoom: 15,
    fullscreenControl: true
  });

  var stroudsMarker = new google.maps.Marker({
    position: stroudsLatLong,
    map: googleMap,
    title: "Stroud's"
  });

  var cornerCafeMarker = new google.maps.Marker({
    position: cornerCafeLatLong,
    map: googleMap,
    title: "Corner Cafe"
  });

  var naturalGrocersMarker = new google.maps.Marker({
    position: naturalGrocersLatLong,
    map: googleMap,
    title: "Natural Grocers"
  });

  var littleBlueMarker = new google.maps.Marker({
    position: littleBlueLatLong,
    map: googleMap,
    title: "Little Blue River"
    // use wikipedia API for info on river
  });

  var costcoMarker = new google.maps.Marker({
    position: costcoLatLong,
    map: googleMap,
    title: "Costco"
    // use wikipedia API for info on costco, maybe yelp for a review on the eatery
  });
};
