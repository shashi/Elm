import Mouse
import Window
import Native.DataSource
import JavaScript.Experimental (toRecord, fromRecord)
import Native.JavaScript

clickLocs = Native.DataSource.collection "points"
sharedClickLocs = Native.DataSource.query clickLocs (fromRecord {})

clickLocations = foldp (::) [] (sampleOn Mouse.clicks Mouse.position)
insertClicks = lift (\pos -> Native.DataSource.insert clickLocs pos) (sampleOn Mouse.clicks Mouse.position)

scene (w,h) locs =
  let drawPentagon (x,y) =
          ngon 5 20 |> filled (hsva (toFloat x) 1 1 0.7)
                    |> move (toFloat x - toFloat w / 2, toFloat h / 2 - toFloat y)
                    |> rotate (toFloat x)
  in  layers [ collage w h (map drawPentagon locs)
             , plainText "Click to stamp a pentagon." ]

points = lift (\x -> case x of
                Just d -> Native.JavaScript.toList d
                Nothing -> []) sharedClickLocs
main = lift2 scene Window.dimensions points
