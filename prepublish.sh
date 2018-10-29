#!/bin/bash
npm run clean
rm -rf ./node_modules
npm i
npm rebuild node-sass
npm run build