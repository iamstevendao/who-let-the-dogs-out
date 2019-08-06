#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist

# echo 'www.who-let-the-dogs-out.iamstevendao.com' > CNAME

git config --global user.email "$GH_EMAIL" > /dev/null 2>&1
git config --global user.name "$GH_NAME" > /dev/null 2>&1

git init
git add -A
git commit -m "Deploy"

git push -f git@github.com:iamstevendao/who-let-the-dogs-out.git master:gh-pages

cd -
