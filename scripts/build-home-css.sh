#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
npm exec --yes --package=tailwindcss@3.4.17 -- tailwindcss -c tailwind.home.cjs -i assets/css/home-utilities.source.css -o assets/css/home-utilities.css --minify
