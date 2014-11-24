$(document).ready(function() {
  // Get user location and send map
  navigator.geolocation.getCurrentPosition(initialize);
});

var map;

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
    title:"Hello World!"
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
      $("#name").empty();
      $("#category").empty();
      $("#distance").empty();
      $("#elevation").empty();

      $.each(result.segments, function(index, item){
        // Adds segments to list
        $("#name").append('<p>' + item.name + '</p>');
        $("#category").append('<p>Category ' + item.climb_category + '</p>');
        $("#distance").append('<p>' + item.distance + ' meters</p>');
        $("#elevation").append('<p>' + item.avg_grade + ' %</p>');

        // Puts a marker on map for each segment
        var markerLatLng = new google.maps.LatLng(item.start_latlng[0],item.start_latlng[1]);
        var marker = new google.maps.Marker({
          position: markerLatLng,
          map: map,
          title: item.name,
          animation: google.maps.Animation.DROP,
        });
      });
    });
  });
}










    