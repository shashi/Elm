#!/bin/sh

cd testapp
../dist/build/elm/elm  --only-js --build-dir . main.elm
meteor
