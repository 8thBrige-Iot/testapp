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
var transform = function(lon, lat) {
  var r = (p0.lon - p1.lon) / (p0.x - p1.x);
  var s = (p0.lat - p1.lat) / (p0.y - p1.y);

  console.log('r = ', r);
  console.log('s = ', s);

  return { // -(10, 10) because of circle radius = 10
    x: (lon - p0.lon) / r + p0.x - 10,
    y: (lat - p0.lat) / s + p0.y - 10
  }
};

$.getJSON('/api/districts', function(ds) {
  console.log(ds);
  var $districts = $('#districts');
  _.each(ds, function(d) {
    $districts.append('<p>' + d.name + '</p>');
  });

  var p0t = transform(p0.lon, p0.lat);
  console.log('p0t:');
  console.log(p0t);
  var p1t = transform(p1.lon, p1.lat);
  console.log('p1t:');
  console.log(p1t);

  var $map = $('#map');
  _.each(ds, function(d) {
    var p = transform(d.lon, d.lat);
    $map.append('<div class="marker" title="' + d.name + '" style="position: absolute; margin-top: ' + p.y + 'px; margin-left: ' + p.x + 'px"></div>');
  });
});