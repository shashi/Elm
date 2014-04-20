Elm.Native.Session = {};
Elm.Native.Session.make = function(elm) {

    // runtime error if metoer is not present
    if (typeof Deps == "undefined") {
        throw new Error("Deps is not defined. Are you using Meteor?");
    }
   
    elm.Native = elm.Native || {};
    elm.Native.Session = elm.Native.Session || {};
    if (elm.Native.Session.values) return elm.Native.Session.values;
   
    var JS = Elm.Native.JavaScript.make(elm);
    var DS = Elm.Native.DataSource.make(elm);
    var Signal = Elm.Signal.make(elm);

    function makeId() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 32; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    function getCookieVal(key) {
        var parts = document.cookie.split(';');
        var dict = _.object(_.map(parts, function (a) {
            return _.map(a.split("="), function (b) {return b.trim();})}));
        return dict[key];
    }
    function sessionId() {
      var sId = getCookieVal("elm-session-id");
      if (sId) {
          return sId;
      }
      sId = makeId();
      document.cookie = 'elm-session-id=' + sId;
      return sId;
    }
    window.sessionId = sessionId;

    var sessions = DS.collection("sessions");
    var sessionVars = {}; // have we dropped the default value for a variable yet?
    function sessionVar(id) {
        if (sessionVars[id]) {
            return sessionVars[id].signal;
        }
        var NotSet = { ctor: 'NotSet' }
        var signal = Signal.constant(NotSet);
        var sId = sessionId();

        sessionVars[id] = { signal: signal, droppedFirst: false };

        function currentValue() {
            var query = { sessionId: sId, key: id };
            try {
                var found = sessions.findOne(query);
                if (typeof found == 'undefined') {
                   return { ctor:'NotSet' };
                }
                var value = found.value;
            } catch (e) {
               // FIXME: Failure can't be gracefully handled, might make debugging hell.
               return { ctor:'NotSet' };
            }
            if (value && value.ctor == 'NotSet') {
                return value;
            } else {
                return { ctor:'Value', _0: value };
            }
        }

        Deps.autorun(function () {
            //console.log("Recv", currentValue());
            elm.notify(signal.id, currentValue());
        });
        return { _: {}, signal: signal, handle : {id : id, signal: signal}};
    }

    function update(handle, value) {
        // I am assuming this is called inside a lift.
        var varId = handle.id;
        if (!sessionVars[varId].droppedFirst) {
            sessionVars[varId].droppedFirst = true;
            return;
        }

        var _id = sessionVars[varId]._id;
        if (!_id) {
            var current = sessions.findOne({sessionId: sessionId(), key: varId});
            if (current) {
                _id = current._id;
                sessionVars[varId]._id = _id;
            }
        }

        if (!_id) {
            //console.log("Insert", {sessionId: sessionId(), key: varId, value: value});
            sessions.insert({sessionId: sessionId(), key: varId, value: value});
        } else {
            //console.log("Update", _id, {$set: {value: value}});
            sessions.update(_id, {$set: {value: value}});
        }
    }

    function destroySession() {
        sessions.remove({ sessionId: sessionId() });
        document.cookie = 'elm-session-id=';
    }

    function sessionsGC() {
        // garbage collect sessions
    }

    return elm.Native.Session.values = {
        sessionVar: sessionVar,
        update: F2(update),
        destroySession: destroySession
    };
}
