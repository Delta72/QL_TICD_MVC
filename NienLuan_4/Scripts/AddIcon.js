
// Tao kich thuoc icon
var IconShape = L.Icon.extend({
    options: {
        iconSize: [40, 40], 
        iconAnchor: [20, 35],  
        popupAnchor: [0, -40]
    }
});

// green human
var greenHuman = new IconShape({
    iconUrl: '/Content/Leaflet/images/greenhuman.png',
})

// them dia diem
var iconThem = new IconShape({
    iconUrl: '/Content/Images/Icon/iconThem.png',
})