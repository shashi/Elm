if (Meteor.isClient) {
    (function (Elm) {
            window.onload = function () {
                Elm.fullscreen(Elm.Main);
            };
    })(Elm);
}
