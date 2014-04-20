Elm.Native.DataSource = {};
Elm.Native.DataSource.make = function(elm) {

    // runtime error if metoer is not present
    if (typeof Deps == "undefined") {
        throw new Error("Deps is not defined. Are you using Meteor?");
    }
   
    elm.Native = elm.Native || {};
    elm.Native.DataSource = elm.Native.DataSource || {};
    if (elm.Native.DataSource.values) return elm.Native.DataSource.values;
   
    var JS = Elm.Native.JavaScript.make(elm);
    var List = Elm.Native.List.make(elm);
    var Maybe = Elm.Maybe.make(elm);
    var Signal = Elm.Signal.make(elm);
   
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
            ds[i] = { _: {}, id: results[i]._id, body: results[i] }
            delete ds[i].body._id;
        }
        return List.fromArray(ds);
    }
   
    function wrapResponse(req, res) {
        return { _:{}
               , request: req
               , response: res };
    }
   
   
    function dataSource(collectionName) {
          var c = collection(collectionName),
              s = Signal.constant(wrapResponse(undefined, { ctor: 'NoRequest' }));
   
          return { _:{}
                   , handle: {signal: s, collection: c}
                   , signal: s
                 };
    }
   
    function query(handle, query) {
      function response () {
          try {
              var found = handle.collection.find(query);
          } catch (e) {
             return { ctor:'Failure', _0:503, _1:JS.toRecord(e.toString()) };
          }
          return { ctor:'Success', _0: docs(found.fetch()) };
      };
   
      if (handle._computation) {
          handle._computation.stop();
      }
      handle._computation = Deps.autorun(function () {
          elm.notify(handle.signal.id, wrapResponse(query, response()));
      });
    }
   
    function mutate(handle, mutation) {
      var collection = handle.collection;
      function response () {
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
      };
   
      // elm.notify needs to be called asynchronously.
      setTimeout(function () {
        elm.notify(handle.signal.id, wrapResponse(mutation, response()))
      }, 0);
    }
   
   
    return elm.Native.DataSource.values = {
        dataSource: dataSource,
        query: F2(query),
        mutate: F2(mutate),
    };
}
