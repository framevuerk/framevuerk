#!/bin/bash

npm install

npm run build


git clone https://github.com/framevuerk/public.git

git rm -r *

cp docs/* public

cd ./public
git add --all
git commit -m 'updated'
git push -f origin master

cd ..
rm -rf ./public