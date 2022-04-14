

var LeafIcon = L.Icon.extend({
    options: {
        iconSize: [35, 40], 
        iconAnchor: [15, 35],  
        popupAnchor: [0, -35]
    }
});

var greenHuman = new LeafIcon({
    iconUrl: '/Content/Leaflet/images/greenhuman.png',
})