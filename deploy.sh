#!/usr/bin/env bash
echo "---
permalink: /404.html
---
" > "./dist/404.html"
cat "./dist/index.html" >> "./dist/404.html"
echo "Deployment folder created!"
