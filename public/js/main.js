var fixPoints = [
  { // Haselhorst
    x: 323,
    y: 458,
    lon: 13.230387,
    lat: 52.543182
  },
  { // Friedrichsfelde
    x: 883,
    y: 588,
    lon: 13.517853,
    lat: 52.503104
  }
];

var p0 = fixPoints[0];
var p1 = fixPoints[1];

//                       "x", "y"
var transform = function(lon, lat, isLarge) {
  var r = (p0.lon - p1.lon) / (p0.x - p1.x);
  var s = (p0.lat - p1.lat) / (p0.y - p1.y);

  var radius = isLarge ? 20 : 10;

  return { // -(10, 10) because of circle radius = 10
    x: (lon - p0.lon) / r + p0.x - radius,
    y: (lat - p0.lat) / s + p0.y - radius
  }
};

$.getJSON('/api/districts', function(ds) {
  console.log(ds);
  var $districts = $('#districts');
  _.each(ds, function(d) {
    $districts.append('<p>' + d.name + '</p>');
  });

  var $map = $('#map');
  _.each(ds, function(d) {
    if (d.lon && d.lat) {
      var isLarge = d.name[0] == '1';
      var p = transform(d.lon, d.lat, isLarge);
      var className = 'marker ';
      if (isLarge) {
        className += 'large';

      }
      $map.append('<div class="' + className + '" title="' + d.name.slice(1) + '" style="position: absolute; margin-top: ' + p.y + 'px; margin-left: ' + p.x + 'px"></div>');
    } else {
      console.log('no coords for ', d.name);
    }
  });
});