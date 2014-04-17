Elm.Native.Database = {};
Elm.Native.Database.make = function(elm) {

  // runtime error if metoer is not present
  if (typeof Deps == "undefined") {
      throw new Error("Deps is not defined. Are you using Meteor?");
  }

  elm.Native = elm.Native || {};
  elm.Native.Database = elm.Native.Database || {};
  if (elm.Native.Database.values) return elm.Native.Database.values;

  var JS = Elm.JavaScript.make(elm);
  var Maybe = Elm.Maybe.make(elm);
  var Signal = Elm.Signal.make(elm);

  function dataSignal(deps, _default) {
      // get the current value, make it the
      // default for the signal
      var signal = Signal.constant(_default);

      // notify Elm runtime of any changes to the data
      Deps.autorun(function () {
          elm.notify(signal.id, deps());
      });

      return signal;
  }

  var collections = {};
  function collection(name) {
    // TODO: Make it so that compiler enforces
    // one-to-one mapping between collections and data types
    // This might need intense type system ramp-up
    if (typeof collections[name] == "undefined") {
        collections[name] = new Meteor.Collection(name);
    }

    return collections[name];
  }

  window.collections = collections;

  function docs(results) {
      // _id gives problems in Elm!
      var ds = [];
      for (var i=0, l = results.length; i < l;i++) {
          ds[i] = {id: results[i]._id, body: results[i]}
          delete ds[i].body._id;
      }
      return ds;
  }

  // function to set up a reactive database query.
  // returns a signal.
  function select(collection, query) {
    return dataSignal(function () {
        try {
            var found = collection.find(query);
        } catch (e) {
           return { ctor:'Failure', _0:503, _1:JS.toString(e.toString()) };
        }
        return { ctor:'Success', _0: JS.toList(docs(found.fetch())) };
    }, elm.Database.values.Waiting);
  }

  function mutate(collection, mutation) {
    switch (mutation.ctor) {
        case "Create":
            try {
                var res = collection.insert(mutation._0);
            } catch (e) {
                // This error handling is too broad!
                // console.log(e);
                return { ctor:'Failure', _0:503, _1:JS.toString(e.toString()) };
            }
            if (typeof(res) == "string") {
                return { ctor:'Success', _0: JS.toString(res) };
            }
            break;
        case "Update":
            try {
                var orig = mutation._0;
                var res = collection.update({_id: orig.id,
                                             $set: {body: mutation._1}});
            } catch (e) {
                return { ctor:'Failure', _0:503, _1:JS.toString(e.toString()) };
            }
            if (typeof(res) == "string") {
                return { ctor:'Success', _0: JS.toString(res) };
            }
            break;
        case "Delete":
            try {
                var target = mutation._0;
                var res = collection.delete(mutation._0);
            } catch (e) {
                return { ctor:'Failure', _0:503, _1:JS.toString(e.toString()) };
            }
            if (typeof(res) == "string") {
                return { ctor:'Success', _0: JS.toString(res) };
            }
            break;
    }
  }
  function getCookieVal(key) {
    var parts = document.cookie.split(';');
    var dict = _.object(_.map(parts, function (a) {
        return _.map(a.split("="), function (b) {return b.trim();})}));
    return dict[key];
  }
  window.getCookieVal = getCookieVal;

  var sessions = collection("sessions");
  function sessionId() {
    var sId = getCookieVal("elm-session-id");
    if (sId) {
        return sId;
    }
    sId = sessions.insert({});
    document.cookie = 'elm-session-id=' + sId;
    return sId;  
  }

  window.sessionId = sessionId;
  window.getSession = function () {
  }

  function sessionSet(key, value) {
    // here we count on Meteor Deps to
    // notify Elm by Deps.autorun-ning
    try {
        var update = {};
        update[key] = value;
        var res = sessions.update({_id: sessionId()}, update);
        console.log("set", key, value, res);
    } catch (e) {
        console.log("set", key, value, { ctor:'Failure', _0:503, _1:JS.toString(e.toString()) });
        return { ctor:'Failure', _0:503, _1:JS.toString(e.toString()) };
    }

    console.log("set", key, value, { ctor:'Success', _0: JS.toString(res) });
    return { ctor:'Success', _0: JS.toString(res) };
  }

  function sessionGet(key, _default) {
    function get() {
        try {
            var sesh = sessions.findOne({_id: sessionId()}) || {_id: sessionId()};
            var found = sesh[key] || _default;
        } catch (e) {
           return { ctor:'Failure', _0:503, _1:JS.toString(e.toString()) };
        }
        console.log("get", key, _default, { ctor:'Success', _0: found });
        return { ctor:'Success', _0: found };
    }
    return dataSignal(get, get(key, _default));
  }

  return elm.Native.Database.values = {
      select: F2(select),
      collection: collection,
      mutate: F2(mutate),
      sessionSet: F2(sessionSet),
      sessionGet: F2(sessionGet)
  };
};
