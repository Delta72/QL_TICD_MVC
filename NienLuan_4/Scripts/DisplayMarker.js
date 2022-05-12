
var isLoading = false;
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
                var icon = new IconShape({
                     iconUrl: data[i].loai,
                })
                var marker = L.marker([l1, l2], { id: data[i].id, icon: icon }).bindPopup(data[i].mota).on('click', PointClick).addTo(privatePointLayer);
            }
        },
        error: function () {
            alert("ShowPrivatePoint");
        }
    })
}
function PointClick(e) {
    // console.log(e.target.options.id);
    mapObject.setView(e.target.getLatLng(), 17, { animation: true, duration: 2 });
    GetPointProp(e.target.options.id);
}

// get point properties
function GetPointProp(id) {
    isLoading = true;
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
    isLoading = false;
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
var controlDNStr = '';
controlDNStr += '<div id="pointEdit" onclick="SuaDiaDiem()"><i class="fa fa-pencil"></i></div>';
controlDNStr += '<div id="pointDelete" onclick="XoaDiaDiem()"><i class="fa fa-trash"></i></div>';

var controlAnoStr = '';
controlAnoStr += '<div class="AnoPoint" onclick="ChiDuong()"><i>&#9736</i></div>';
controlAnoStr += '<div class="AnoPoint" onclick="BaoCaoDiaDiem()"><i>&#9785</i></div>';

var pointControl = L.control({ position: "topleft" });
pointControl.onAdd = function (map) {
    var div = L.DomUtil.create("div", "div3");
    var i = '<div id="pointControl" onmouseover="DisableZoomDrag()" onmouseout="EnableZoomDrag()">';
    if (getUserRole() == "dn") {
        i += controlDNStr;
    } else {
        i += controlAnoStr;
    }
    i += '</div>';
    div.innerHTML = i;
    return div;
};

// Xoa dia diem
function XoaDiaDiem() {
    if (confirm("Bạn có đồng ý xóa địa điểm này? Toàn bọ dữ liệu sẽ bị xóa")) {
        var id = document.getElementById('inputID').value;
        $.ajax({
            url: 'Point/XoaDiaDiem',
            type: 'post',
            data: {
                id: id
            },
            success: function (data) {
                ShowPrivatePoints();
                removeAllMenu();
            }
        })
    }
    else {

    }
}

// Sua dia diem
var pointEditDiv = L.control({ position: "topleft" });
pointEditDiv.onAdd = function (map) {
    var div = L.DomUtil.create("div", "div");
    var i = '<div id="EditDiv" onmouseover="DisableZoomDrag()" onmouseout="EnableZoomDrag()"></div>';
    div.innerHTML = i;
    return div;
}

// Sua dia diem
function SuaDiaDiem() {
    if (!document.getElementById('EditDiv')) {
        pointEditDiv.addTo(mapObject);
        var id = document.getElementById('inputID').value;
        HienSuaDiaDiem(id);
    }
    else {
        pointEditDiv.remove();
    }    
}

// select list
function ListLoaiDVu(i) {
    var str = '';
    str += '<select class="form-control txt" id="sllLoaiDVu">';
    $.ajax({
        url: '/User/selectLoaiDVu',
        type: 'get',
        async: false,
        success: function (data) {
            for (var a in data) {
                if (i == data[a].id) {
                    str += '<option value="' + data[a].id + '" selected="selected">' + data[a].loai + '</option>';
                }
                else{
                    str += '<option value="' + data[a].id + '">' + data[a].loai + '</option>';
                }
            }
        }
    });
    str += '</select>';
    return str;
}

// Hien sua dia diem
function HienSuaDiaDiem(id) {
    document.body.style.cursor = "progress";
    var name = document.getElementById('labelName').textContent;
    var add = document.getElementById('labelAdd').textContent;
    var img = document.getElementById('pointImg').src;
    var loai = document.getElementById('LoaiDD').value;
    var mota = document.getElementById('mota').value;

    var str = '<div id="divEdit">';
    str += '<table>';
    str += '<tr><td colspan="2"><label><div id="cs">Chỉnh sửa địa điểm</div></label></td></tr>';
    str += '<tr><td><label for="name" >Tên địa điểm: </label></td><td><input type="text" class="form-control" id="EditName" value="' + name + '"/></td></tr>';
    str += '<tr><td><label for="name" >Địa chỉ: </label></td><td><input type="text" class="form-control" id="EditAdd" value="' + add + '"/></td></tr>';
    str += '<tr><td><label for="name" >Hình ảnh: </label></td><td><div id="divEditImg" onclick="chonfile()">Chọn hình ảnh<div><input type="file" id="EditImg" class="KoHienThi"/></td></tr>';
    str += '<tr><td colspan="2"><div id="ImgEdit"><img src="' + img + '" id="imgedit"/></div></td></tr>';
    str += '<tr><td><label for="name" >Loại: </label></td><td>' + ListLoaiDVu(loai) + '</td></tr>';
    str += '<tr><td colspan><label for="name">Mô tả: </td><td></td></tr>';
    str += '<tr><td colspan="2"><div id="Editarea"><textarea id="EditTextArea">' + mota + '</textarea></div></td></tr>';
    str += '</table></div>';
    str += '<div id="btnSaveEdit" onclick="btnSaveEditOnClick()"><i class="fa fa-floppy-o"></i></div><div id="btnCancelEdit" onclick="btnCancelEditOnClick()"><i class="fa fa-times"></i></div>';

    document.getElementById('EditDiv').innerHTML = str;
    $("#EditImg").change(function () {
        HienImg(this);
    });
    document.body.style.cursor = "auto";
}

// btnSaveEdit click
function btnSaveEditOnClick() {
    if (confirm("Đồng ý chỉnh sửa dữ liệu?")) {
        var id = document.getElementById('inputID').value;
        var name = document.getElementById('labelName').textContent;
        var add = document.getElementById('labelAdd').textContent;
        var img = document.getElementById('EditImg').files;
        var loai = document.getElementById('sllLoaiDVu').value;
        var mota = document.getElementById('mota').value;
        ChinhSuaDiaDiem(id, name, add, img, loai, mota);
    }
    else {
        btnCancelEditOnClick();
    }
}
function ChinhSuaDiaDiem(id, name, add, img, loai, mota) {
    var formData = new FormData();
    formData.append("img", img[0]);
    formData.append("id", id);
    formData.append("name", name);
    formData.append("add", add);
    formData.append("loai", loai);
    formData.append("mota", mota);

    $.ajax({
        url: 'Point/ChinhSuaDiaDiem',
        type: 'post',
        async: true,
        dataType: 'json',
        processData: false,
        contentType: false,
        data: formData,
        success: function (data) {
            DisplayPointProperties(data);
            ShowPrivatePoints();
        }
    })
}

// btnCancelEdit click
function btnCancelEditOnClick() {
    document.getElementById('pointEdit').click();
}

// Hien edit img
function HienImg(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#imgedit').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
function chonfile() {
    document.getElementById('EditImg').click();
}

// Hien thong tin dia diem
function DisplayPointProperties(data) {
    removeAllMenu();
    pointProp.addTo(mapObject);
    pointControl.addTo(mapObject);
    var hiddeninput = '<input class="KoHienThi" type="text" value="' + data.ID_LOAIDD + '" id="LoaiDD"/>';
    hiddeninput += '<input class="KoHienThi" type="text" value="' + data.ID_DD + '" id="inputID">';
    hiddeninput += '<input class="KoHienThi" type="text" value="' + data.TOADO_DD + '" id="toadodd">';
    hiddeninput += '<input class="KoHienThi" type="text" value="' + data.MOTA_DD + '" id="mota">';
    var label = '<label for="dd" id="labelName">' + data.TEN_DD + '</label>';
    document.getElementById('pointName').innerHTML = label + hiddeninput;
    var close = '<a href="#" onclick="removeAllMenu()"><i class="fa fa-times-circle-o" style="color:green"></i></a>';
    document.getElementById('pointClose').innerHTML = close;
    var img = '<img src="' + data.HINHANHs[0].LINK_HA + '" id="pointImg">';
    document.getElementById('pointImage').innerHTML = img;
    var add = '<label for="dd" id="labelAdd">' + data.DIACHI_DD + '</label>';
    document.getElementById('pointAddress').innerHTML = add;        
    HienBinhLuan(data.BINHLUANs);
    if (getUserRole() != "ano") {
        var like = '<i class="" style="color:green" onclick="ThichDiaDiem()" id="heart"></i><p id="LuotThich"></p>';
        document.getElementById('allLike').innerHTML = like;
        KiemTraDaThichDD();
        var comment = '<img src="' + getUserAvatar() + '" id="UserA"><div id="UserNameC">' + getUserName() + '</div><div id="ipbl"><input type="text" id="cmt"/></div><div id="ipbl2" onclick="DangBinhLuan()"><p>Bình luận<p></div>';
        document.getElementById('pointUserComment').innerHTML = comment;
    }
    else {
        var like = '<i class="fa fa-heart-o" style="color:green" id="heart"></i><p id="LuotThich"></p>';
        document.getElementById('allLike').innerHTML = like;
        KiemTraDaThichDD();
        document.getElementById('pointUserComment').innerHTML = "<label>Đăng nhập để bình luận</label>";
    }
}



// Hien thi binh luan
function HienBinhLuan(data) {
    document.getElementById('pointComments').innerHTML = '';
    if (data.length == 0) {
        document.getElementById('pointComments').innerHTML = '<label id="EmptyCmt">Chưa có bình luận nào</label>';
    }
    else {
        data.sort((a, b) => parseInt(b.LUOTTHICH_BL) - parseInt(a.LUOTTHICH_BL));
        for (var i = 0; i < data.length; i++) {
            var eachComment = '<div class="pointEachComment"><input type="text" class="KoHienThi" id="cmt' + i +'" value="' + data[i].ID_BL + '">';
            eachComment += '<div class="commentUserName" onmouseover="CommentHover(' + i + ')" onmouseout="CommentOut()">';
            eachComment += '<table><tr><th><p id="user' + i + '"><img src="' + data[i].TAIKHOAN.HINHANHs[0].LINK_HA + '" class="eachCommentImg" id="eachCommentImgid' + i + '"/>&nbsp' + data[i].TAIKHOAN.TENHIENTHI_TK + '</p></th></tr><tr><td><p id="comment' + i + '">' + data[i].NOIDUNG_BL + '</p></td></tr></table>';
            eachComment += '</div>';
            eachComment += '</div>';
            if (getUserRole() != "ano") {
                eachComment += '<div id="cmtLike"><i class="" style="color:red" onclick="ThichBinhLuan(' + i + ')" id="cmtHeart' + i + '"></i><p id="cmtLuotThich' + i + '"></p></div>';
            }
            else {
                eachComment += '<div id="cmtLike"><i class="fa fa-heart-o" style="color:red" id="cmtHeart' + i + '"></i><p id="cmtLuotThich' + i + '"></p></div>';
            }
            document.getElementById('pointComments').innerHTML += eachComment;
            KiemTraDaThichBL(i);
        }        
    }
}


// Kiem tra da thich binh luan
function KiemTraDaThichBL(id) {
    var x = 'cmt' + id;
    var bl = document.getElementById(x).value;
    var h = 'cmtHeart' + id;
    var p = 'cmtLuotThich' + id;
    if (getUserRole() == 'ano') {
        $.ajax({
            url: 'Point/LayLuotThichBinhLuan',
            type: 'post',
            data: {
                id: bl
            },
            success: function (data) {
                if (parseInt(data) <= 999) {
                    document.getElementById(p).innerHTML = data;
                }
                else {
                    document.getElementById(p).innerHTML = "999+";
                }
            }
        })
    }
    else {
        $.ajax({
            url: 'Point/KiemTraDaThichBL',
            type: 'post',
            data: {
                id: bl
            },
            success: function (data) {
                if (data.liked == true) {
                    document.getElementById(h).className = "fa fa-heart";
                }
                else {
                    document.getElementById(h).className = "fa fa-heart-o";
                }
                if (parseInt(data.luotthich) <= 999) {
                    document.getElementById(p).innerHTML = data.luotthich;
                }
                else {
                    document.getElementById(p).innerHTML = "999+";
                }
            }
        })
    }
}

// Thich binh luan
function ThichBinhLuan(id) {
    var x = 'cmt' + id;
    var bl = document.getElementById(x).value;
    $.ajax({
        url: 'Point/ThichBinhLuan',
        type: 'post',
        data: {
            id: bl
        },
        success: function (data) {
            KiemTraDaThichBL(id);
        }
    })
}

// Dang binh luan
function DangBinhLuan() {
    var dd = document.getElementById('inputID').value;
    var cmt = document.getElementById('cmt').value;
    if (cmt == "" || cmt == null) {

    }
    else {
        $.ajax({
            url: 'Point/DangBinhLuan',
            type: 'post',
            data: {
                dd: dd,
                cmt: cmt
            },
            success: function (data) {
                HienBinhLuan(data);
                document.getElementById('cmt').value = "";
                document.getElementById('pointComments').scrollTop = document.getElementById('pointComments').scrollHeight;
            }
        });        
    }
}

// Kiem tra da thich dia diem
function KiemTraDaThichDD() {
    var id = document.getElementById('inputID').value;
    if (getUserRole == 'ano') {
        $.ajax({
            url: 'Point/LayLuotThich',
            type: 'post',
            data: {
                id: id,
            },
            success: function (data) {
                if (data > 999) {
                    document.getElementById('LuotThich').innerHTML = "999+";
                }
                else {
                    document.getElementById('LuotThich').innerHTML = data.luotthich;
                }
            }
        })
    }
    else {        
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
                if (parseInt(data.luotthich) > 999) {
                    document.getElementById('LuotThich').innerHTML = "999+";
                }
                else {
                    document.getElementById('LuotThich').innerHTML = data.luotthich;
                }
            }
        })
    }
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

// Phat hien dia diem nguoi dung
function btnPosClick() {
    mapObject.locate({ setView: false, watch: false }).on('locationfound', function (e) {
        myLocation.clearLayers();
        if (e.accuracy != 100) {
            //$("html").css("cursor: progress");
            // L.circle(e.latlng, e.accuracy).addTo(myLocation);
            var toado = e.latlng.lat + ', ' + e.latlng.lng;

            var popupStr = '';
            popupStr += '<div id="popupDiv"><table>';
            popupStr += '<tr><td><label>Tìm địa điểm gần nhất trong phạm vi: </label></td><td><input class="form-control" id="inputKC" value="5"/><div id="km"><label>km</label></div></td></tr>';
            popupStr += '<tr><td>' + SelectListLoaiDVu() + '</td><td><div id="btnTimKiemGanNhat">Tìm kiếm</div></td></tr>'
            popupStr += '</table></div>';

            mapObject.setView([e.latlng.lat, e.latlng.lng], 15, { animate: true, duration: 2 });
            var popup = L.popup({ closeOnClick: false, autoClose: false, closeButton: true, className: 'idpopup'});
            var marker = L.marker([e.latitude, e.longitude], { icon: greenHuman })
                .on('click', function (e) {
                    mapObject.setView([e.latlng.lat, e.latlng.lng], 15, { animate: true, duration: 2 });
                    popup.options.offset = e.target.options.icon.options.popupAnchor;
                    popup.setContent(popupStr).setLatLng(e.target.getLatLng()).addTo(mapObject);
                    $('#sllLoaiDVu').prepend('<option value="all" selected="selected">--- Tất cả địa điểm ---</option>');
                    $('#btnTimKiemGanNhat').click(function () {
                        TimKiemDiaDiem(toado);
                    })
                })
                .addTo(myLocation)
                .openPopup();            
            HienDiaDiemCongDong(toado);
            //$("html").css("cursor: auto");
        }
        else {
            alert("Đường truyền không ổn định, không thể xác nhận vị trí !!!");
        }                
    }).on('locationerror', function () {
        alert("Không thể truy cập vị trí");
    });
}

// Hien dia diem cong dong xung quanh 5 km
function HienDiaDiemCongDong(coor) {
    $.ajax({
        url: 'Point/HienDiaDiemCongDong',
        type: 'post',
        data: {
            coor: coor,
        },
        success: function (data) {
            HienMarker(data);
        }
    })
};

// Hien marker nguoi dung khong phai doanh nghiep
function HienMarker(data) {
    privatePointLayer.clearLayers();
    // console.log(data);
    for (var i in data) {
        var c = String(data[i].coor).split(', ');
        var l1 = StrToFloat(c[0]);
        var l2 = StrToFloat(c[1]);
        var icon = new IconShape({
            iconUrl: data[i].loai,
        })
        var marker = L.marker([l1, l2], { id: data[i].id, icon: icon })
            .bindPopup(data[i].mota).on('click', MarkerOnClick)
            .addTo(privatePointLayer);
    }
}

// Marker on click
function MarkerOnClick(m) {
    mapObject.setView(m.target.getLatLng(), 17, { animation: true, duration: 2 });
    //$("html").css("cursor: progress");
    GetPointProp(m.target.options.id);
    //$("html").css("cursor: auto");
}


// Hien dia diem cong dong xung quanh theo tim kiem
function TimKiemDiaDiem(coor) {
    var loai = $('#sllLoaiDVu').val();
    var dis = $('#inputKC').val();

    $.ajax({
        url: 'Point/TimKiemDiaDiem',
        type: 'post',
        data: {
            coor: coor,
            dis: dis,
            loai: loai,
        },
        async: false,
        success: function (data) {
            HienMarker(data);
        }
    })
}

// Chi duong
var route = L.Routing.control({}).addTo(mapObject);
function ChiDuong() {
    var toado = document.getElementById('toadodd').value;
    removeAllMenu();
    route.remove();
    var mLat = 0.0; var mLng = 0.0;
    var c = toado.split(', ');
    var l1 = StrToFloat(c[0]);
    var l2 = StrToFloat(c[1]);
    myLocation.eachLayer(function (layer) {
        // console.log(layer._latlng);
        mLat = layer._latlng.lat;
        mLng = layer._latlng.lng;
    });
    polyPX.clearLayers();
    Ve_CT();
    route = L.Routing.control({
        waypoints: [
            L.latLng(mLat, mLng),
            L.latLng(l1, l2)
        ],
        lineOptions: {
            styles: [{
                color: 'green',
                opacity: 1,
                weight: 5
            }]
        },
        createMarker: function () {
            return null;
        },
        language: 'en',
    }).addTo(mapObject);    
    route._container.style.display = "None";
    route.on('routesfound', function (e) {
        HienThongTinDuongDi(e.routes[0].summary);
    });
}

// Hien thong tin duong
var ThongTinDuongDi = L.control({ position: "topright" });
ThongTinDuongDi.onAdd = function (map) {
    var div = L.DomUtil.create("div", "div3");
    var i = '<div id="ThongTinDuongDi"><table>';
    i += '<tr><td><label>Độ dài quãng đường: </label></td><td><label id="quangduong">300</label></td></tr>';
    i += '<tr><td><label>Thời gian ước tính: </label></td><td><label id="thoigian">300</label></td></tr>';
    i += '</table></div>';
    div.innerHTML = i;
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
};
function HienThongTinDuongDi(e) {
    ThongTinDuongDi.addTo(mapObject);
    document.getElementById('quangduong').innerText = e.totalDistance + ' m';
    document.getElementById('thoigian').innerText = Math.round(e.totalTime % 3600 / 60) + ' phút';
}


// Lay toa do
function LayToaDoDD(id) {
    var toado;
    $.ajax({
        url: 'Point\LayToaDo',
        type: 'post',
        data: {
            id: id,
        },
        success: function (data) {
            toado = data;
        }
    })
    return toado;
}

// Tim kiem dia diem
function TimKiemTheoTen(str) {
    $.ajax({
        url: 'Point/TimKiemTheoTen',
        type: 'post',
        data: {
            str: str,
        },
        success: function (data) {
            console.log(data);
            if (data.length == 0) {
                alert("Không tìm thấy địa điểm nào phù hợp");
            }
            else {
                HienMarker(data);
            }
            
        }
    })
}
function btnSearchClick() {
    var str = document.getElementById('SbSearch').value;
    if (str == "") {

    }
    else if (str.length < 3) {
        alert("hãy nhập tối thiểu 3 ký tự !!!");
    }
    else {
        str = str.toLowerCase()
        TimKiemTheoTen(str.substring(0));
        // console.log(str);
    }
}

// Hien diem onload
function DisplayPoints() {
    if (getUserRole == 'dn') {
        ShowPrivatePoints();
    }
    else {
        btnPosClick();
    }
}

// Hien dia diem yeu thich
function HienDiaDiemYeuThich() {
    $.ajax({
        url: 'Point/HienDiaDiemYeuThich',
        type: 'get',
        success: function (data) {
            HienMarker(data);
        }
    })
}

// on load
$(document).ready(function () {
    if (getUserRole() == 'ano' || getUserRole == 'cn') {
        //DisplayPoints();
    }
});