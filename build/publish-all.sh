#!/bin/bash

npm install

npm run build

npm publish

git clone https://github.com/framevuerk/public.git



cd ./public
git rm -r *
cp ../docs/* ./
git add --all
git commit -m 'updated'
git push -f origin master

cd ..
rm -rf ./public