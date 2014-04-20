module DataSource where
{-|
    Module for database interactions
-}
import Signal (Signal)
import JavaScript.Experimental (fromRecord)
import Native.DataSource

type Id = String

{-| The datatype for Mongo documents (courtesy Meteor). `id` is filled
in by Meteor when the value is stored. The body can be any Elm value.
-}
type Doc a = { id : Id, body : a}

{-| The datatype for mutations. Delete contains a Doc, Update contains
a Doc and a value to replace it with. Create contains a value.
-}
data Mutation a = Delete (Doc a) | Update (Doc a) a | Create a

{-| The datatype for responses. Success contains the returned value,
Waiting represents waiting state, Failure contains an error number
and error message.
-}
data Response a = NoRequest | Success a | Waiting | Failure Int String

{-| The Handle type constructor takes two arguments. First one is the type
of requests that you will be sending using an instance of a data source,
the second one is the type of the response from the server.
-}
data Handle a b = Handle
type DataSource a b = { handle: Handle a b
                      , signal: Signal { request : a, response : Response b }
                      }

dataSource : Id -> DataSource a b
dataSource = Native.DataSource.dataSource

{- Set up a query for a DataSource.
The response manifests as a signal in the .signal field
-}
query : Handle a b -> a -> ()
query h q = Native.DataSource.query h (fromRecord q)

{- Send the database requests to mutate some data
-}
mutate : Handle (Mutation a) b -> Mutation a -> ()
mutate = Native.DataSource.mutate
