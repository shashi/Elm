module Database where

{-| Database signals on top of [Meteor](http://meteor.com/). Here is
the README file about setting up Elm to compile to "meteor platform".

# Collections and Documents

@docs Collection, Doc, collection

# Queries

docs Query, select

# Mutations

docs Mutation, mutate

# Responses

@docs Response
-}

import Maybe (Maybe, Just, Nothing, maybe)
import Signal (Signal)
import JavaScript (JSObject)
import JavaScript.Experimental (fromRecord)
import Native.Database

type Id = String

{-| The datatype for Mongo documents (courtesy Meteor). `id` is filled
in by Meteor when the value is stored. The body can be any Elm value.
-}
type Doc a = {id : Id, body: a}

{-| The type constructor for a collection. Takes an Elm type as argument.
The collection is assumed to contain values of this type.
-}
type Collection a = JSObject

{-| The datatype for a MongoDB query, it's just a plain old Elm record.
See [here][http://docs.meteor.com/#find] to know what the query can be.
-}
type Query = {}

{-| The datatype for mutations. Delete contains a Doc, Update contains
a Doc and a value to replace it with. Create contains a value.
-}
data Mutation a = Delete (Doc a) | Update (Doc a) a | Create a

{-| The datatype for responses. Success contains the returned value,
Waiting represents waiting state, Failure contains an error number
and error message.
-}
data Response a = Success a | Waiting | Failure Int String

{-| Initialize a Collection of a given string name and return it.
-}
collection : String -> Collection a
collection = Native.Database.collection

{-| Return a signal that contains the result of a database query.
See Query.
-}
select : Collection a -> Query -> Signal (Response [Doc a])
select c q =
    Native.Database.select c (fromRecord q)

{-| Execute a Mutation. Returns a Response.
-}
mutate : Collection a -> Mutation a -> Response c
mutate = Native.Database.mutate
