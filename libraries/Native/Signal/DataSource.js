/*
 * Generic data that act as signals
 */

Elm.Native.DataSource = {};
Elm.Native.DataSource.make = function(elm) {
    if (typeof Deps == "undefined") {
        throw new Error("Deps is not defined. Are you using Meteor?");
    }

    elm.Native = elm.Native || {};
    elm.Native.DataSource = elm.Native.DataSource || {};
    if (elm.Native.DataSource.values) return elm.Native.DataSource.values;

    var Signal = Elm.Signal.make(elm);
    var Maybe = Elm.Maybe.make(elm);

    function nothingOrJust(val) {
        if (val == null) {
            return Maybe.Nothing;
        } else {
            return Maybe.Just(val);
        }
    }

    function dataSignal(deps) {
        var init = deps();
        var signal = Signal.constant(nothingOrJust(init));

        // notify Elm runtime of any changes to the data
        Deps.autorun(function () {
            notify(signal.id, nothingOrJust(deps()));
        });

        return signal;
    }

    var collections = {};
    function collection(name) {
        if (typeof collections[name] == "undefined") {
            collections[name] = new Meteor.Collection(name);
        }

        return nothingOrJust(collections[name]);
    }

    // takes a collection and a query,
    // returns a signal of responses
    // TODO: look to see if this can be done using a Lift
    // in other words how exactly are db results
    // invalidated in Meteor
    function query(c, q) {
        return dataSignal(function () {
            return c.find(q).fetch();
        });
    }

    // How does one guarrantee the type here?!
    function sessionGet(key) {
        return dataSignal(function () {
            return Session.get(key);
        });
    }

    function sessionSet(key, value) {
        // here we count on Meteor Deps to
        // notify Elm by Deps.autorun-ning
        // HELP! This is not a pure function,
        // although it is made to look like one here.
        return Session.set(key, value);
    }

    return elm.Native.DataSource.values = {
        collection: collection,
        query: query,
        sessionGet: sessionGet,
        sessionSet: sessionSet
    };
};

