Learn about the Elm programming language at [elm-lang.org](http://elm-lang.org/).

## About this fork

This fork is geared towards compiling Elm to [Meteor](http://meteor.com) platform. Currently, it has a Database module using which you can create signals of database query results. The final goal of the project is to make full-stack reactive web development feasible with Elm.

### Dependencies

1. You will need to install Meteor first. You can do this by running `curl http://install.meteor.com | sh`. Read [meteor docs](http://dosc.meteor.com) for more details.
2. See below for Installation instructions for Haskell Platform.

### Usage:

1. Build the compiler with `cabal build`.
2. The Elm compiler executable will be created at `<repository directory>/dist/build/elm/elm`.
3. Initialize a meteor project by running `meteor create <directory>`
3. You will need to make a few changes to data/elm-runtime.js and place it in your meteor project directory. A shell script for making the modifications is at https://github.com/shashi/elm-on-meteor/blob/master/runtimemods.sh.
4. Create a file called init.js to initialize meteor collections. Example:
```js
if (Meteor.isServer) {
    new Meteor.Collection("collection_name");
}
```
5. You can now compile Meteor apps using the elm compiler (See 1 and 2). See https://github.com/shashi/elm-on-meteor for example apps.
6. See documentation of the [Database API](https://github.com/shashi/Elm/blob/elm-on-meteor/libraries/Database.elm) to learn about interacting with meteor's database API from Elm.
7. Use `meteor` to run the app.

What follows is the README file from the upstream Elm repository.

[![Build Status](https://travis-ci.org/evancz/Elm.png)](https://travis-ci.org/evancz/Elm)
[![Build Status](https://travis-ci.org/elm-lang/Elm.png)](https://travis-ci.org/elm-lang/Elm)

## Install

Follow [these instructions][installer] if you just want to use Elm. To build
the compiler from source, run the following commands:

 [installer]: https://github.com/elm-lang/elm-platform/blob/master/README.md#elm-platform 

```bash
git clone https://github.com/elm-lang/Elm.git
cd Elm
cabal configure
cabal build
```

To use `elm` and `elm-server` you may need to add a new directory to your PATH.

Cabal should tell you where your executables are located upon
successful installation. It'll be something like `/home/evan/.cabal/bin`
which you should append to your PATH variable.
See this tutorial if you are new to changing your PATH in
[Unix/Linux](http://www.cyberciti.biz/faq/unix-linux-adding-path/).

## My First Project

Now we will create a simple Elm project.
The following commands will set-up a very basic project and start the Elm server.

    mkdir helloElm
    cd helloElm
    printf "import Mouse\n\nmain = lift asText Mouse.position" > Main.elm
    elm-server

The first two commands create a new directory and navigate into it. The `printf`
commands place a simple program into `Main.elm`. Do this manually if you do not
have `printf`. The final command starts the Elm server at [localhost:8000](http://localhost:8000/),
allowing you to navigate to `Main.elm` and see your first program in action.

#### Final Notes

The `elm` package provides
[some utility functions](http://hackage.haskell.org/package/Elm) for
working with Elm in Haskell. This can be useful for creating tooling
for Elm, and has been useful for projects like
[the website](http://elm-lang.org/) and
[`elm-get`](https://github.com/evancz/elm-get). Email the list if you
want to rely on these functions!

 [installer]: https://github.com/elm-lang/elm-platform/blob/master/README.md#elm-platform 

```bash
git clone https://github.com/elm-lang/Elm.git
cd Elm
cabal configure
cabal build
```

This will build the compiler in `/dist/build/elm/elm` but it will not be on
your PATH.

If you are stuck, email
[the list](https://groups.google.com/forum/?fromgroups#!forum/elm-discuss)
or ask a question in the
[#Elm IRC channel](http://webchat.freenode.net/?channels=elm). 
