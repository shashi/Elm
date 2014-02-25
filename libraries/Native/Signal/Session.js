Elm.Native.Session = {};
Elm.Native.Session.make = function(elm) {

  // runtime error if metoer is not present
  if (typeof Deps == "undefined") {
      throw new Error("Deps is not defined. Are you using Meteor?");
  }

  elm.Native = elm.Native || {};
  elm.Native.Session = elm.Native.Session || {};
  if (elm.Native.Session.values) return elm.Native.Session.values;

  var JS = Elm.JavaScript.make(elm);
  var Maybe = Elm.Maybe.make(elm);
  var Signal = Elm.Signal.make(elm);

  function sessionSignal(deps, _default) {
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
  // return dataSignal(function () {
  //     try {
  //         var found = collection.find(query);
  //     } catch (e) {
  //        return { ctor:'Failure', _0:503, _1:JS.toString(e.toString()) };
  //     }
  //     return { ctor:'Success', _0: JS.toList(docs(found.fetch())) };
  // }, elm.Database.values.Waiting);
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

  return elm.Native.Session.values = {
      set: F2(set),
      get: F2(take)
  };
};
