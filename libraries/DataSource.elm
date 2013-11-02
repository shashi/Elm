module DataSource where

{-| Interface to data

# Sessions
@docs sessionGet, sessionSet

# Collections
@docs collection, query

-}

import Signal (Signal)
import Maybe (Maybe)
import Native.DataSource
import JavaScript (JSObject)
import JavaScript.Experimental

type Collection = JSObject

{-|
    Collection
-}
collection : String -> Maybe Collection
collection = Native.DataSource.collection

{-|
    Query
-}
query : Collection -> a -> Signal Maybe b
query = Native.DataSource.query

{-|
    sessionGet
-}
sessionGet : String -> Maybe a
sessionGet = Native.DataSource.sessionGet


{-|
    sessionSet
-}
sessionSet : String -> a -> Bool
sessionSet = Native.DataSource.sessionSet
