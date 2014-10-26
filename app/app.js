var arango = require('arangojs');
var compress = require('compression');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var districts = require('../Script/BerlinDistricts.json');
var express = require("express");
var morgan = require('morgan');
var Promise = require('micropromise');
var _ = require("underscore");


var app = express();
app.use(morgan('combined'));
app.use(compress());
app.use(cookieParser());
app.use(cookieSession({
  secret: process.env.COOKIE_SECRET
}));


app.use(express.static(__dirname + '/../public'));

var db = arango.Connection(process.env.CONNECTION_STRING);


app.get('/api/foo', function(req, res) {
  res.status(200).send('bar');
});

app.get('/api/collections', function(req, res) {
  db.collection.list().done(function(dbRes) {
    var cs = _.filter(dbRes.collections, function(c) {
      return !c.isSystem;
    });
    res.status(200).json(cs);
  });
  console.log('c');
});

var districts = function () {
  var p = Promise();
  db.collection.get("districts").done(function(coll) {
    console.log('fetched districts collection');
    db.document.list(coll.id).done(function(data) {
      console.log('fetched ', coll.id)
      var promises = _.map(data.documents, function(docUri) {
        var docId = docUri.slice('/_api/document/'.length);
        //console.log('docId: ', docId);
        return db.document.get(docId);
      });
      console.log('now joining:');
      promises[0].join(promises.slice(1)).done(function(dbRes) {
        console.log('joined...');
        p.resolve(dbRes);
      });
    });
  });
  return p;
};

app.get('/api/districts', function(req, res) {
  districts().done(function(ds) {
    res.status(200).json(ds);
  });
});

var districtsUpdatePeople = function(districtName, delta) {
  var p = Promise();
  districts().done(function(ds) {
    for (var i = 0; i < ds.length; i++) {
      var d = ds[i];
      if (d.name === districtName) {
        if (!d.people) d.people = 0;
        d.people += delta;
        db.document.patch(d._id, {people: d.people}).done(function() {
          console.log('patch successful!')
          p.resolve({});
        })
        .catch(function() {
          console.log('patch failed!!!');
        });
      }
    }
    var msg = 'could not find ' + districtName;
    console.log(msg);
    p.reject(msg);
  });
  return p;
};

app.post('/api/districts/:district_name/decrement_people', function(req, res) {
  districtsUpdatePeople(req.params.district_name, -1).done(function() {
    res.status(200).end();
  });
});

app.post('/api/districts/:district_name/increment_people', function(req, res) {
  districtsUpdatePeople(req.params.district_name, +1).done(function() {
    res.status(200).end();
  });
});

app.get('/api/districts/copy_to_db', function(req, res) {
  db.collection.get("districts").done(function(coll) {
    db.collection.count(coll.id).done(function(res) {
      console.log('Initially the collection has # docs = ', res.count);
    });
    db.collection.truncate(coll.id).done(function() {
      console.log('Truncated collection...');
      var list = _.map(districts.BERLIN, function(rec) {
        for (var name in rec) {
          var obj = {
            name: name,
            subDistricts: []
          };
          _.each(rec[name].split('/'), function(s) {
            switch (s.toUpperCase().slice(0, 3)) {
              case 'LAT':
                obj.lat = parseFloat(s.slice(3));
                break;
              case 'LON':
                obj.lon = parseFloat(s.slice(3));
                break;
              default:
                if (s[0] === '1' && name[0] === '2') {
                  obj.parentDistrict = s;
                } else if (s !== name) {
                  if (s) obj.subDistricts.push(s);
                }
            }
          });
          return obj;
        }
      });
      console.log(list.slice(0, 3));
      console.log('.....');
      var promises = [];
      _.each(list, function(obj) {
        promises.push(db.document.create(coll.id, obj));
      });
      promises[0].join(promises.slice(1)).done(function() {
        console.log('creations successful!');
      });
      res.status(200).end();
    })
    .catch(function(err) {
      console.log('truncate failed: ', err);
      res.status(500).end();
    });
  });
});


var port = process.env.PORT || 5000;
var server = require('http').Server(app);
server.listen(port, function() {
  console.log("Listening on " + port);
});




