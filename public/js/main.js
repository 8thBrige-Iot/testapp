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

var districts = {};
var selection;

//                       "x", "y"
var transform = function(lon, lat, radius) {
  var r = (p0.lon - p1.lon) / (p0.x - p1.x);
  var s = (p0.lat - p1.lat) / (p0.y - p1.y);

  return { // -(10, 10) because of circle radius = 10
    x: (lon - p0.lon) / r + p0.x - radius,
    y: (lat - p0.lat) / s + p0.y - radius
  }
};

var applySelection = function(districtName) {
  selection = districtName;
  var d = districts[selection];
  var text = districtName.slice(1);
  if (districtName[0] === '1') {
    text += ' District';
  } else {
    text += ' Sub District';
  }
  $('#selection-title').text(text);
  var people = d.people || 0;
  $('input').val(people);
};

var selectionUpdate = function(delta) {
  var n = parseInt($('input').val()) + delta;
  if (n  > 0) $('input').val(n);
  var rpcFunc = delta > 0 ? 'increment_people' : 'decrement_people';
  toastr.info('Submitting, please wait...');
  $.ajax({
    type: 'POST',
    url: '/api/districts/' + selection + '/' + rpcFunc
  }).done(function() {
    redraw();
    toastr.info('Updated!');
  }).fail(function() {
    toastr.error('Updated!');
  });
}

var redraw = function() {
  $('.marker').remove();
  $.getJSON('/api/districts', function(ds) {
    _.each(ds, function(d) {
      districts[d.name] = d;
    });
    console.log(districts);
    if (!selection) applySelection(ds[0].name);
    var $map = $('#map');
    _.each(ds, function(d) {
      if (d.lon && d.lat) {
        var isWholeDistrict = d.name[0] == '1';
        var radius = 10;
        if (d.people) radius = 10 + d.people * d.people;
        var p = transform(d.lon, d.lat, radius);
        var className = 'marker ';
        if (isWholeDistrict) {
          className += 'whole-district';
        }
        $map.append('<div class="' + className + '" data-district-name="' + d.name + '" title="' + d.name.slice(1) + '" style="position: absolute; margin-top: ' + p.y + 'px; margin-left: ' + p.x + 'px; height: ' + 2*radius + 'px; width: ' + 2*radius + 'px"></div>');
      } else {
        console.log('no coords for ', d.name);
      }
    });

    $('.marker').click(function() {
      var name = $(this).attr('data-district-name');
      applySelection(name);
    });

    $('#attend').unbind();
    $('#attend').click(function() {
      selectionUpdate(+1);
    });

    $('#not-attend').unbind();
    $('#not-attend').click(function() {
      selectionUpdate(-1);
    });
  });
}

redraw();


