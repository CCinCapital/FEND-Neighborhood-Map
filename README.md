# FEND-Neighborhood-Map
![Udacity Front-End Web Developer Nanodegree](https://img.shields.io/badge/Udacity-Front--End%20Web%20Developer%20Nanodegree-blue.svg)

This project is to demostrates the ability to build web app with MVVM framework (_`Knockout.js`_) and third party APIs _(`Google Map, RapidAPI, Yelp Fusion`)_. 

## App Boot Sequence

1. User opens `index.html`, App starts to boot.

2. App loads `Knockout.js @3.4.2`, `stylesheet`, `HTML`, JS code `helper.js`, `map.js`, and `app.js`. App loads `Google Map V3` asynchronously at last.
- App fires XMLHttpRequest to `RapidAPI` immediately after `<body></body>` loads to fetch the `Yelp API AccessKey` and store it in the `AppViewModel`.
- App then fires XMLHttpRequest to `RapidAPI` to get the surrounding bussinesses at pre-defined location `APP_DEFAULT_LAT_LNG` stored in `AppViewModel`.

## Installation
1. Clone or download the repository.
2. open `index.html` and enjoy.
