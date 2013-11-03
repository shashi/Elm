import Mouse
import Window
import Native.DataSource
import JavaScript.Experimental (toRecord, fromRecord)
import Native.JavaScript

-- set up data source and sink
pointsSource = Native.DataSource.collection "points"
clicks = sampleOn Mouse.clicks Mouse.position
pointsSink = Native.DataSource.insert pointsSource <~ clicks

-- TODO: fromRecord, toList should be done in DataSource module
results = Native.DataSource.query pointsSource (fromRecord {})
points = lift (\x -> case x of    -- Nothing means an error occured. Handle gracefully
                Just d -> Native.JavaScript.toList d
                Nothing -> []) results

scene (w,h) locs =
  let drawPentagon (x,y) =
          ngon 5 20 |> filled (hsva (toFloat x) 1 1 0.7)
                    |> move (toFloat x - toFloat w / 2, toFloat h / 2 - toFloat y)
                    |> rotate (toFloat x)
  in  layers [ collage w h (map drawPentagon locs)
             , plainText "Click to stamp a pentagon. Ask others to join!" ]

main = scene <~ Window.dimensions ~ points
