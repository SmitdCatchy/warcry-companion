#!/usr/bin/env bash
if [ -d "./docs" ]; then rm -Rf ./docs; fi
mkdir "./docs"
cp -R ./dist/* ./docs
echo "---
permalink: /404.html
---
" > "./docs/404.html"
cat "./dist/index.html" >> "./docs/404.html"
echo "Deployment folder created!"
