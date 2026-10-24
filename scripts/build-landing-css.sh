#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
npm exec --yes --package=tailwindcss@3.4.17 -- tailwindcss -c tailwind.landing.cjs -i assets/css/home-utilities.source.css -o assets/css/landing-utilities.css --minify
