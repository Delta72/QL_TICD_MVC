

// Random color
function randomColor() {
    var color;
    var r = Math.floor(Math.random() * 150);
    var g = Math.floor(Math.random() * 150);
    var b = Math.floor(Math.random() * 150);
    color = "rgb(" + r + " ," + g + "," + b + ")";
    return color;
}

// Ve Can Tho
function Ve_CT() {
    $.ajax({
        url: '/Home/Ve_Can_Tho',
        type: 'get',
        success: function (data) {
            var c = randomColor();
            var draw = "var draw = " + data;
            eval(draw);            
            L.geoJSON(draw, { opacity: 1, color: c, fillOpacity: 0 }).on('mouseover', function () {
                this.setStyle({
                    opacity: 0,
                });
            }).on('mouseout', function () {
                this.setStyle({
                    opacity: 1,
                    fillOpacity: 0,
                    color: c,
                });
            }).addTo(polyLayer);
            mapObject.setView([10.117598, 105.540848], 11, { "animate": true, "duration": 2 });
        },
        error: function () {
            alert("Ve_CT failed");
        }
    })
}


// Ve quan huyen
function Ve_QH() {
    $.ajax({
        url: '/Home/Ve_QH',
        type: 'get',
        success: function (data) {
            for (var a in data) {
                var c = randomColor();
                var draw = "var draw = " + data[a].poly;
                eval(draw);                
                var name = data[a].name;
                L.geoJSON(draw, { opacity: 0.3, color: c, fillOpacity: 0 }).bindPopup(name, { autoPan: false }).on('mouseover', function () {
                    this.setStyle({
                        fillOpacity: 0.3,
                        opacity: 1,
                    }),
                    this.openPopup();
                }).on('mouseout', function () {
                    this.setStyle({
                        opacity: 0.3,
                        fillOpacity: 0,
                    }),
                    this.closePopup();
                }).on('click', function (e) {                    
                    var p = String(e.target._popup._content);
                    Ve_PX(p);
                    mapObject.fitBounds(e.layer.getBounds());
                    this.closePopup();                    
                }).addTo(polyLayer);
            }           
        }
    });
};

// onClick resetView
function fResetView() {
    Ve_CT();
    Ve_QH();
    polyPX.clearLayers();
}
mapObject.on('contextmenu', function () {
    fResetView();
});


// Ve Phuong xa
function Ve_PX(TenQ) {
    $.ajax({
        url: '/Home/Ve_PX',
        type: 'post',
        data: {
            data: TenQ
        },
        success: function (data) {
            polyPX.clearLayers();
            for (var a in data) {
                var c = randomColor();
                var id = data[a].id;
                var draw = "var draw = " + data[a].poly;
                eval(draw);
                var name = data[a].name;
                L.geoJSON(draw, { opacity: 1, color: c, fillOpacity: 0 }).bindPopup(name, { autoPan: false }).on('mouseover', function () {
                    this.setStyle({
                        fillOpacity: 0.3,
                        opacity: 1,
                    }),
                        this.openPopup();
                }).on('mouseout', function () {
                    this.setStyle({
                        opacity: 1,
                        fillOpacity: 0,
                    }),
                    this.closePopup();
                }).on('click', function (e) {
                    this.setStyle({
                        opacity: 1,
                        fillOpacity: 0,
                    }),
                    mapObject.fitBounds(e.layer.getBounds());
                    mapObject.doubleClickZoom.disable();
                    this.closePopup();
                }).addTo(polyPX);
            }
        },
        error: function () {
            alert("Ve_PX");
        }
    })
}

// Ve tat ca PX
function VeTatCaPX() {
    $.ajax({
        url: '/Home/VeTatCaPX',
        type: 'get',        
        success: function (data) {
            allPX.clearLayers();
            for (var a in data) {
                var id = data[a].id;
                var draw = "var draw = " + data[a].poly;
                eval(draw);
                var name = data[a].name;
                L.geoJSON(draw, { opacity: 0, fillOpacity: 0, id: id }).bindPopup(id).addTo(allPX);
            }
            mapObject.removeLayer(allPX);
        },
        error: function () {
            alert("Ve_PX");
        }
    })
}

// Ready
$(document).ready(function () {
    VeTatCaPX();
    Ve_QH();
    Ve_CT();
});