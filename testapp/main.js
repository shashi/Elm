Elm.Main = Elm.Main || {};
Elm.Main.make = function (elm)
                {
                  elm.Main = elm.Main || {};
                  if (elm.Main.values)
                  return elm.Main.values;
                  var N = Elm.Native,
                      _N = N.Utils.make(elm),
                      _L = N.List.make(elm),
                      _E = N.Error.make(elm),
                      _J = N.JavaScript.make(elm),
                      $moduleName = "Main";
                  var Text = Elm.Text.make(elm);
                  var Text = Elm.Text.make(elm);
                  var Basics = Elm.Basics.make(elm);
                  var Signal = Elm.Signal.make(elm);
                  var List = Elm.List.make(elm);
                  var Maybe = Elm.Maybe.make(elm);
                  var Time = Elm.Time.make(elm);
                  var Prelude = Elm.Prelude.make(elm);
                  var Graphics = Graphics || {};
                  Graphics.Element = Elm.Graphics.Element.make(elm);
                  var Color = Elm.Color.make(elm);
                  var Graphics = Graphics || {};
                  Graphics.Collage = Elm.Graphics.Collage.make(elm);
                  var Mouse = Elm.Mouse.make(elm);
                  var Window = Elm.Window.make(elm);
                  var _op = {};
                  var tick = Time.fps(30);
                  var scene = F2(function (arg1,locs)
                                 {
                                   return function ()
                                          {
                                            switch (arg1.ctor)
                                            {case
                                             "_Tuple2" :
                                               return function ()
                                                      {
                                                        var drawPentagon = function (arg0)
                                                                           {
                                                                             return function ()
                                                                                    {
                                                                                      switch (arg0.ctor)
                                                                                      {case
                                                                                       "_Tuple2" :
                                                                                         return Graphics.Collage.rotate(Basics.toFloat(arg0._0))(Graphics.Collage.move({ctor: "_Tuple2", _0: Basics.toFloat(arg0._0) - Basics.toFloat(arg1._0) / 2, _1: Basics.toFloat(arg1._1) / 2 - Basics.toFloat(arg0._1)})(Graphics.Collage.filled(A4(Color.hsva,
                                                                                                                                                                                                                                                                                                                                           Basics.toFloat(arg0._0),
                                                                                                                                                                                                                                                                                                                                           1,
                                                                                                                                                                                                                                                                                                                                           1,
                                                                                                                                                                                                                                                                                                                                           0.7))(A2(Graphics.Collage.ngon,
                                                                                                                                                                                                                                                                                                                                                    5,
                                                                                                                                                                                                                                                                                                                                                    20))));}
                                                                                      _E.Case($moduleName,
                                                                                              "between lines 10 and 12");
                                                                                    }();
                                                                           };
                                                        return Graphics.Element.layers(_J.toList([A3(Graphics.Collage.collage,
                                                                                                     arg1._0,
                                                                                                     arg1._1,
                                                                                                     A2(List.map,
                                                                                                        drawPentagon,
                                                                                                        locs)),
                                                                                                  Text.plainText("Click to stamp a pentagon.")]));
                                                      }();}
                                            _E.Case($moduleName,"between lines 9 and 14");
                                          }();
                                 });
                  var main = A3(Signal.lift2,
                                scene,
                                Window.dimensions,
                                A2(Signal.lift,
                                   function (x)
                                   {
                                     return _J.toList([x]);
                                   },
                                   Mouse.position));
                  var clickLocations = A3(Signal.foldp,
                                          F2(function (x,y)
                                             {
                                               return {ctor: "::", _0: x, _1: y};
                                             }),
                                          _J.toList([]),
                                          Mouse.position);
                  elm.Main.values = {_op: _op, tick: tick, clickLocations: clickLocations, scene: scene, main: main};
                  return elm.Main.values;
                };