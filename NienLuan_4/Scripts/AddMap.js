

// Them map nen
var mapObject = L.map("map", { center: [10.117598, 105.540848], zoom: 11, zoomControl: false, attributionControl: false });
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: ['a', 'b', 'c']
}).addTo(mapObject);

// Them layer
var ctrlLayer = L.layerGroup().addTo(mapObject);
var polyLayer = L.layerGroup().addTo(mapObject);
var polyPX = L.layerGroup().addTo(mapObject);
var addMarker = L.layerGroup().addTo(mapObject);
var allPX = L.layerGroup().addTo(mapObject);
var myLocation = L.layerGroup().addTo(mapObject);
var allPointsLayer = L.layerGroup().addTo(mapObject);
var privatePointLayer = L.layerGroup().addTo(mapObject);
var routeLayer = L.layerGroup().addTo(mapObject);

// Popup
var popup = L.popup({ autoPan: false });
mapObject.on("click", onMapClick);
function onMapClick(e) {
    /* popup
        .setLatLng(e.latlng)
        .setContent(
            Math.round(e.latlng.lat * 1000000 + Number.EPSILON) / 1000000 + ", " +
            Math.round(e.latlng.lng * 1000000 + Number.EPSILON) / 1000000
        )
        .openOn(mapObject); */
}




