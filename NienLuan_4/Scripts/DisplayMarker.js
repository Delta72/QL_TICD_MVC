
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
layout += '<div id="pointAddress"></div><div id="allLike"></div>';
layout += '<div id="pointComments"></div>';
layout += '<div id="pointUserComment"></div>';
layout += '</div>';

function DisableZoomDrag() {
    mapObject.scrollWheelZoom.disable();
    mapObject.dragging.disable();
}
function EnableZoomDrag() {
    mapObject.scrollWheelZoom.enable();
    mapObject.dragging.enable();
}

// point properties div
var pointProp = L.control({ position: "topleft" });
pointProp.onAdd = function (map) {
    var div = L.DomUtil.create("div", "div4");
    div.innerHTML = layout;
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
}

// point point control
var pointControl = L.control({ position: "topleft" });
pointControl.onAdd = function (map) {
    var div = L.DomUtil.create("div", "div3");
    var i = '<div id="pointControl">';
    i += '</div>';
    div.innerHTML = i;
    return div;
};

function DisplayPointProperties(data) {
    removeAllMenu();
    pointProp.addTo(mapObject);
    pointControl.addTo(mapObject);

    var label = '<label for="dd" id="labelName">' + data.TEN_DD + '</label>' + '<input class="KoHienThi" type="text" value="" /><input class="KoHienThi" type="text" id="inputID">';
    document.getElementById('pointName').innerHTML = label;
    document.getElementById('inputID').value = data.ID_DD;
    var close = '<a href="#" onclick="removeAllMenu()"><i class="fa fa-times-circle-o" style="color:green"></i></a>';
    document.getElementById('pointClose').innerHTML = close;
    var img = '<img src="' + data.HINHANHs[0].LINK_HA + '" id="pointImg">';
    document.getElementById('pointImage').innerHTML = img;
    var add = '<label for="dd" id="labelAdd">' + data.DIACHI_DD + '</label>';
    document.getElementById('pointAddress').innerHTML = add;   
    var like = '<i class="" style="color:green" onclick="ThichDiaDiem()" id="heart"></i><p id="LuotThich"></p>';
    document.getElementById('allLike').innerHTML = like;
    KiemTraDaThichDD();
    HienBinhLuan(data.BINHLUANs);
    var comment = '<img src="' + getUserAvatar() + '" id="UserA"><div id="UserNameC">' + getUserName() + '</div><div id="ipbl"><input type="text" id="cmt"/></div><div id="ipbl2" onclick="DangBinhLuan()"><p>Bình luận<p></div>';
    document.getElementById('pointUserComment').innerHTML = comment;    
}

// Hien thi binh luan
function HienBinhLuan(data) {
    document.getElementById('pointComments').innerHTML = '';
    if (data.length == 0) {
        document.getElementById('pointComments').innerHTML = '<label id="EmptyCmt">Chưa có bình luận nào</label>';
    }
    else {
        for (var i = 0; i < data.length; i++) {
            console.log(data[i]);
            var e = "";
            var eachComment = '<div class="pointEachComment">';
            eachComment += '<div class="commentUserName" onmouseover="CommentHover(' + i + ')" onmouseout="CommentOut()">';
            eachComment += '<table><tr><th><p id="user' + i + '"><img src="' + data[i].TAIKHOAN.HINHANHs[0].LINK_HA + '" class="eachCommentImg" id="eachCommentImgid' + i + '"/>&nbsp' + data[i].TAIKHOAN.TENHIENTHI_TK + '</p></th></tr><tr><td><p id="comment' + i + '">' + data[i].NOIDUNG_BL + '</p></td></tr></table>';
            eachComment += '</div>';
            eachComment += '</div>';
            e += eachComment;
        }
        document.getElementById('pointComments').innerHTML = e;
    }
}

// Dang binh luan
function DangBinhLuan() {
    var dd = document.getElementById('inputID').value;
    var cmt = document.getElementById('cmt').value;
    $.ajax({
        url: 'Point/DangBinhLuan',
        type: 'post',
        data: {
            dd: dd,
            cmt: cmt
        },
        success: function (data) {

        }
    })
}

// Kiem tra da thich dia diem
function KiemTraDaThichDD() {
    var id = document.getElementById('inputID').value;
    var dathichdd = false;
    $.ajax({
        url: 'Point/KiemTraDaThichDiaDiem',
        type: 'post',
        async: false,
        data: {
            id: id
        },
        success: function (data) {
            if (data.success == false) {
                document.getElementById('heart').className = "fa fa-heart-o";
            }
            else {
                document.getElementById('heart').className = "fa fa-heart";
            }
            document.getElementById('LuotThich').innerHTML = data.luotthich;
        }
    })
}

// Thich dia diem
function ThichDiaDiem() {
    var id = $('#inputID').val();
    if (document.getElementById('heart').className == "fa fa-heart") {
        if (confirm("Bỏ thích địa điểm này?")) {
            $.ajax({
                url: 'Point/ThichDiaDiem',
                type: 'post',
                async: false,
                data: {
                    id: id
                }
            });
        }
        else {
            
        }
    }
    else {
        $.ajax({
            url: 'Point/ThichDiaDiem',
            type: 'post',
            async: false,
            data: {
                id: id
            }
        });
    }
    KiemTraDaThichDD();
}

// CommentClick
var CommentDetailStr = '';
CommentDetailStr += '<div id="CommentDetail" onmouseover="DisableZoomDrag()" onmouseout="EnableZoomDrag()"></div>';
var CommentDetail = L.control({ position: "topright" });

CommentDetail.onAdd = function (map) {
    var div = L.DomUtil.create("div", "div4");
    div.innerHTML = CommentDetailStr;
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
}

function CommentHover(i) {
    // var name = document.getElementById('labelName').textContent;
    // var img = document.getElementById('pointImg').src;
    // var name = document.getElementById('labelAdd').textContent;
    CommentDetail.remove();
    var idu = 'user' + i;
    var idc = 'comment' + i;
    var idi = 'eachCommentImgid' + i;
    var userName = document.getElementById(idu).innerText;
    var userComment = document.getElementById(idc).innerText;
    var img = document.getElementById(idi).src;
    CommentDetail.addTo(mapObject);
    var str = '';
    str += '<img src="' + img + '" id="cmi" />';
    str += '<div id="cmn"><label for"name">' + userName + '</label></div>';
    str += '<div id="cmc"><p>' + userComment + '</p></div>';
    document.getElementById('CommentDetail').innerHTML = str;
}
function CommentOut() {
    CommentDetail.remove();
}

// on load
$(document).ready(function () {
    
});