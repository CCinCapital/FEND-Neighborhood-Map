# FEND-Neighbourhood-Map
![Udacity Front-End Web Developer Nanodegree](https://img.shields.io/badge/Udacity-Front--End%20Web%20Developer%20Nanodegree-blue.svg)

This project is to demostrates the ability to build web app with MVVM framework (_`Knockout.js`_) and third party APIs _(`Google Map, RapidAPI, Yelp Fusion`)_. 

# Live Preview
[Live Preview](https://ccincapital.github.io/FEND-Neighborhood-Map/) on GitHub pages.

## API usage
- **Google Map**:  Generates Map, Marker, and InfoWindow.

- **Yelp Fusion**:  Provides business infomation around a location.

- **RapidAPI**:  **Yelp Fusion does not support CORS access from webpage**, it only response to access from back-end. RapidAPI acts as the middle man. App send _"/YelpAPI/:method"_ request to RapidAPI, RapidAPI request Yelp Fusion from the back-end, and echo the result back to our APP. 

## App Boot Sequence

1. User opens `index.html`, App starts to boot.
- App loads `Knockout.js @3.4.2`, `stylesheet`, `HTML`

2. App is now covered by a fullscreen loading message until loading complete. 
- App loads JS code `helper.js`, `map.js`, and `app.js`. App loads `Google Map V3` asynchronously at last.
- App fires XMLHttpRequest to `RapidAPI` immediately after `<body></body>` loads to fetch the `Yelp API AccessKey` and store it in the `AppViewModel`.
- App then fires XMLHttpRequest to `RapidAPI` to get the surrounding bussinesses at pre-defined location `APP_DEFAULT_LAT_LNG` stored in `AppViewModel`.

3. App stores the fetched data in `businesses` variable in `AppViewModel`. App also filters out all available `categories` and `price` range of the fetched data, and updates the DOM.

4. The fullscreen loading message is removed, user may interact now.

## Installation
1. Clone or download the repository.
2. open `index.html` and enjoy.

## TODO
1. search surrounding areas at user drag the map or click on the map.
2. search around a location, search around current location.
3. better looking UI
4. full usage of Yelp Fusion API. (more filter options)
