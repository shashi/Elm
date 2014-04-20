module Session where
{-|
    Module for database interactions
-}

import Native.Session
import Signal (Signal)

data Sessional a = NotSet | Value a
data Handle a = Handle
type SessionVar a = { handle: Handle a,
                      signal: Signal (Sessional a) }

sessionVar : String -> SessionVar a
sessionVar = Native.Session.sessionVar

update : Handle a -> a -> ()
update = Native.Session.update

destroySession : ()
destroySession = Native.Session.destroySession
