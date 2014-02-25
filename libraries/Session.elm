module Session where

{-| Per user key-value store.

-}

import Maybe (Maybe, Just, Nothing, maybe)
import Signal (Signal)
import JavaScript (JSObject)
import JavaScript.Experimental (fromRecord)
import Native.Session

type Key = String

set : Key -> a -> b
set = Native.Session.set

{-| Execute a Mutation. Returns a Response.
-}
get : Key -> a -> Signal a
get = Native.Session.take
