$(document).ready(function() {
  // Get user location and send map
  navigator.geolocation.getCurrentPosition(initialize);
});

var map;
var markers = [];

// Initialize map
function initialize(location) {
  console.log(location);

  var currentLocation = { lat: location.coords.latitude, lng: location.coords.longitude };

  var mapOptions = {
    center: currentLocation,
    zoom: 12,
  };

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  var marker = new google.maps.Marker({
    position: currentLocation,
    map: map,
    title:"Your location."
  });

  google.maps.event.addListener(map, 'idle', function() {
    var bounds = map.getBounds();
    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();
    var neLat = ne.k;
    var neLng = ne.B;
    var swLat = sw.k;
    var swLng = sw.B;

    var request =  {
      bounds: "" + swLat + "," + swLng + "," + neLat + "," + neLng + "",
      activity_type: 'riding'
    }

    var result = $.ajax({
      url: "https://www.strava.com/api/v3/segments/explore?access_token=7110140a2a5a53862a7151fba713c1771c22c15c",
      data: request,
      dataType: "jsonp",
      type: "GET",
    })
    .done(function(result){
      clearSearchArea();
      $.each(result.segments, function(index, item){

        // Adds segments to list
        addSegmentToList(item);

        // Puts a marker on map for each segment
        var markerLatLng = new google.maps.LatLng(item.start_latlng[0],item.start_latlng[1]);
        addMarker(item, markerLatLng);
      });
    });
  });
}

function addMarker(item, location) {
  var marker = new google.maps.Marker({
    position: location,
    map: map,
    title: item.name,
    animation: google.maps.Animation.DROP,
  });
  markers.push(marker);
}

function setAllMap(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function clearMarkers() {
  setAllMap(null);
}

function showMarkers() {
  setAllMap(map);
}

function deleteMarkers() {
  clearMarkers();
  markers = [];
}

function clearSearchArea() {
  deleteMarkers();
  $("#name").empty();
  $("#category").empty();
  $("#distance").empty();
  $("#elevation").empty();
}

function addSegmentToList(segment) {
  $("#name").append('<p>' + segment.name + '</p>');
  $("#category").append('<p>Category ' + segment.climb_category + '</p>');
  $("#distance").append('<p>' + segment.distance + ' meters</p>');
  $("#elevation").append('<p>' + segment.avg_grade + ' %</p>');
}    