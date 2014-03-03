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

  function sessionId() {
    var sId = getCookieVal("elm-session-id");
    if (sId) {
        return sId;
    }
    var sessions = collection("sessions");
    sId = sessions.insert({});
    document.cookie = 'elm-session-id=' + sId;
    return sId;  
  }

  window.sessionId = sessionId;

  SessionAmplify = _.extend({}, Session, {  
    keys: _.object(_.map(amplify.store(),   function(value, key) {
      return [key, JSON.stringify(value)]   
    })),                                    
    set: function (key, value) {            
      Session.set.apply(this, arguments);   
      amplify.store(key, value);            
    },
  });
  window.SessionAmplify = SessionAmplify;

  ElmSession = {
    set: function (key, val) {
        var sessions = collection("sessions");
        var sesh = sessions.findOne({_id: sessionId()});
        var update = {};
        update[key] = val;
        sessions.upsert({_id: sesh._id}, update);
    },
    get: function (key, defVal) {
        var sessions = collection("sessions");
        var sesh = sessions.findOne({_id: sessionId()});
        var val = sesh[key];
        return (typeof val == "undefined") ? defVal : val;
    }
  };

  window.ElmSession = ElmSession;

  function sessionSet(key, value) {
    // here we count on Meteor Deps to
    // notify Elm by Deps.autorun-ning
    return ElmSession.set(key, value);
  }

  function sessionGet(key, _default) {
    return dataSignal(function () {
        return ElmSession.get(key, _default);
    }, _default);
  }

  return elm.Native.Database.values = {
      select: F2(select),
      collection: collection,
      mutate: F2(mutate),
      sessionSet: F2(sessionSet),
      sessionGet: F2(sessionGet)
  };
};
