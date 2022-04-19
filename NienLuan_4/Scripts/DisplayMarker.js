
// Hien tat ca dia diem
function ShowAllPoints() {
    allPointsLayer.clearLayers();
    $.ajax({
        url: 'Point/ShowAllPoints',
        type: 'get',
        success: function (data) {
            for (var i in data) {
                var c = String(data[i].coor).split(', ');
                var l1 = StrToFloat(c[0]); var l2 = StrToFloat(c[1]);
                var marker = L.marker([l1, l2], { id: data[i].id }).on('click', allPointClick).addTo(allPointsLayer);
                console.log(marker);
            }
        },
        error: function () {
            alert("ShowAllPoints");
        }
    })
}

// allPointClick()
function allPointClick(e) {
    console.log(e.target.options.id);
}

// string to float
function StrToFloat(str) {
    var a = parseFloat(str);
    return a;
}

// show private points
function dnMenuMapClick() {
    ShowPrivatePoints();
}
function ShowPrivatePoints() {
    privatePointLayer.clearLayers();
    $.ajax({
        url: 'Point/ShowPrivatePoints',
        type: 'get',
        success: function (data) {
            for (var i in data) {
                var c = String(data[i].coor).split(', ');
                var l1 = StrToFloat(c[0]);
                var l2 = StrToFloat(c[1]);
                var marker = L.marker([l1, l2], { id: data[i].id }).on('click', PrivatePointClick).addTo(privatePointLayer);
            }
        },
        error: function () {
            alert("ShowPrivatePoint");
        }
    })
}
function PrivatePointClick(e) {
    // console.log(e.target.options.id);
    
    mapObject.setView(e.target.getLatLng(), 15, { animation: true, duration: 2 });
    GetPointProp(e.target.options.id);
}

// get point properties
function GetPointProp(id) {
    $.ajax({
        url: 'Point/GetPointProp',
        type: 'post',
        data: {
            pointID: id
        },
        success: function (data) {
            DisplayPointProperties(data);
        }
    })
}

// display point properties
var layout = '';
layout += '<div id="layout" onmouseover="DisableZoomDrag()" onmouseout="EnableZoomDrag()">';
layout += '<div><table><tr><td><div id="pointName"></div></td><td><div id="pointClose"></div></td></tr></table></div>';
layout += '<div id="pointImage"></div>';
layout += '<div id="pointAddress"></div>';
layout += '<div id="pointComments"></div>';
layout += '</div>';

function DisableZoomDrag() {
    mapObject.scrollWheelZoom.disable();
    mapObject.dragging.disable();
}
function EnableZoomDrag() {
    mapObject.scrollWheelZoom.enable();
    mapObject.dragging.enable();
}

var pointProp = L.control({ position: "topleft" });
pointProp.onAdd = function (map) {
    var div = L.DomUtil.create("div", "div4");
    div.innerHTML = layout;
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
}

function DisplayPointProperties(data) {
    removeAllMenu();
    pointProp.addTo(mapObject);
    var label = '<label for="mk">' + data.TEN_DD + '</label>';
    document.getElementById('pointName').innerHTML = label;
    var close = '<a href="#" onclick="removeAllMenu()"><i class="fa fa-times-circle-o" style="color:green"></i></a>';
    document.getElementById('pointClose').innerHTML = close;
    var img = '<img src="' + data.HINHANHs[0].LINK_HA + '" id="pointImg">';
    document.getElementById('pointImage').innerHTML = img;
    var add = '<label for="mk">' + data.DIACHI_DD + '</label>';
    document.getElementById('pointAddress').innerHTML = add;
    var i = 0;
    var e = "";
    for (i = 0; i < 20; i++) {
        var eachComment = '<div class="pointEachComment">'+ i + '</div>';
        e += eachComment;
    }
    document.getElementById('pointComments').innerHTML = e;
}

// on load
$(document).ready(function () {
    
});