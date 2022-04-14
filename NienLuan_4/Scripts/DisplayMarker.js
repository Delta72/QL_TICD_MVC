
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
            console.log(data);
        }
    })
}

// on load
$(document).ready(function () {
    
});