function initGoogleMap() {
  var stroudsLatLong = new google.maps.LatLng(39.039148,-94.348433);
  var cornerCafeLatLong = new google.maps.LatLng(39.035531,-94.341660);
  var naturalGrocersLatLong = new google.maps.LatLng(39.030588,-94.357518);
  var littleBlueLatLong = new google.maps.LatLng(39.034521,-94.351333);
  var costcoLatLong = new google.maps.LatLng(39.036698,-94.357593);

  var googleMap = new google.maps.Map(document.getElementById("map"), {
    center: {lat: 39.035, lng: -94.352},
    zoom: 15,
    fullscreenControl: true
  });

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
};
