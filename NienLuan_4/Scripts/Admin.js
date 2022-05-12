

// Quan ly tai khoan
var AccountManagerControl = L.control({ position: "topleft" });
AccountManagerControl.onAdd = function (map) {
    var div = L.DomUtil.create("div", "div3");
    var i = '<div id="AccountManagerControl" class="adminCtrl" onmouseover="DisableZoomDrag()" onmouseout="EnableZoomDrag()">';
    i += '</div>';
    div.innerHTML = i;
    return div;
};
function QuanLyTaiKhoan() {
    removeAllMenu();
    document.getElementById('btnMenu').click();
    AccountManagerControl.addTo(mapObject);

    var inner = '<div class="adminTitle"><label>Quản lý tài khoản</label></div>';
    inner += '<div class="adminSearch"><input type="text" id="adminSearchBox" class="form-control"></input><div id="btnAdminSearch" onclick="TimKiemTaiKhoan()">Tìm kiếm</div></div>';
    inner += '<div class="adminTable" id="adminAList">' + '</div>';
    inner += '<div class="adminFooter" id="adminFoot">' + '</div>'; 

    document.getElementById('AccountManagerControl').innerHTML = inner;
    HienDanhSachTaiKhoan("");
    HienDieuKhienTaiKhoan();
}

// Hien xoa acc
function HienDieuKhienTaiKhoan() {
    var inner = '<table><tr>';
    inner += '<td><label> Khóa tài khoản không hoạt động trong: </label></td>';
    inner += '<td><select id="ngayxoa" class="form-control">';
    inner += '<option value="3" selected>3 tháng</option>';
    inner += '<option value="6">6 tháng</option>';
    inner += '<option value="9">9 tháng</option>';
    inner += '<option value="12">12 tháng hoặc hơn</option>';
    inner += '</select></td>';
    inner += '<td><div id="btnKhoa" onclick="KhoaTaiKhoanKhongHoatDong()">Khóa</div></td>';
    inner += '</tr></table>';
    document.getElementById('adminFoot').innerHTML = inner;
}

// Khoa tai khoan
function KhoaTaiKhoanKhongHoatDong() {
    var time = document.getElementById('ngayxoa').value;
    $.ajax({
        url: 'User/KhoaKhongHoatDong',
        type: 'post',
        data: {
            time: time
        },
        success: function (data) {
            HienDanhSachTaiKhoan("");
        }
    })
}

// Tim kiem tai khoan
function TimKiemTaiKhoan() {
    var s = document.getElementById('adminSearchBox').value;
    HienDanhSachTaiKhoan(s);
}

// Hien danh sach tai khoan
function HienDanhSachTaiKhoan(s) {
    $.ajax({
        url: 'User/DanhSachTaiKhoan',
        type: 'post',
        async: false,
        data: {
            s: s
        },
        success: function (data) {
            DanhSachTaiKhoan(data);
        }
    })    
}

// Danh sach tai khoan
function DanhSachTaiKhoan(data) {
    document.getElementById('adminAList').innerHTML = "";
    var i = '';
    i += '<table id="tableadmin"><tr>';
    i += '<td style="width:5%"><label>STT</label></td>';
    i += '<td style="width:10%"><label></label></td>';
    i += '<td style="width:5%"><label>Tài khoản</label></td>';
    i += '<td style="width:5%"><label>Tên hiển thị</label></td>';
    i += '<td style="width:5%"><label>Email</label></td>';
    i += '<td style="width:10%"><label>SDT</label></td>';
    i += '<td style="width:5%"><label></label></td>';
    i += '</tr></table>';
    document.getElementById('adminAList').innerHTML += i;
    for (var x in data) {
        var u = '';
        u += '<div class="adminEachAccount">';
        u += '<table><tr>';
        u += '<td><label>' + (parseInt(x) + 1) + '</label></td>';
        u += '<td><img src="' + data[x].img + '" class="adminTableImg"></td>';
        u += '<td><label>' + data[x].name + '</label></td>';
        u += '<td><label>' + data[x].displayname + '</label></td>';
        u += '<td><label>' + data[x].email + '</label></td>';
        u += '<td><label>' + data[x].phone + '</label></td>';
        u += '<td><label><i class="fa fa-ban" id="ban' + x + '" onclick="KhoaTaiKhoan(' + x + ')"></i></label></td>';
        u += '</tr></table>';
        u += '</div>';
        u += '<label class="KoHienThi" id="dataid' + x + '">' + data[x].id + '<label>';
        document.getElementById('adminAList').innerHTML += u;
        KiemTraDaKhoa(data[x].id, x);
    }
}

// Khoa tai khoan
function KhoaTaiKhoan(x) {
    var id = document.getElementById('dataid' + x).innerText;
    if (window.confirm("Khóa/Mở khóa tài khoản này?")) {
        $.ajax({
            url: 'User/KhoaTaiKhoan',
            type: 'post',
            data: {
                id: id
            },
            success: function (data) {
                KiemTraDaKhoa(id, x);
            }
        })
    }
}

// Kiem tra da thich
function KiemTraDaKhoa(id, x) {
    $.ajax({
        url: 'User/KiemTraDaKhoa',
        type: 'post',
        data: {
            id: id
        },
        success: function (data) {
            var iconban = 'ban' + x;
            if (data == true) {
                document.getElementById(iconban).style.color = "red";
            }
            else {
                document.getElementById(iconban).style.color = "green";
            }
        }
    })
}

// Quan ly dia diem
var PointManagerControl = L.control({ position: "topleft" });
PointManagerControl.onAdd = function (map) {
    var div = L.DomUtil.create("div", "div3");
    var i = '<div id="PointManagerControl" class="adminCtrl" onmouseover="DisableZoomDrag()" onmouseout="EnableZoomDrag()">';
    i += '</div>';
    div.innerHTML = i;
    return div;
};
function QuanLyDiaDiem() {
    removeAllMenu();
    document.getElementById('btnMenu').click();
    PointManagerControl.addTo(mapObject);

    var inner = '<div class="adminTitle"><label>Quản lý địa điểm</label></div>';
    inner += '<div id="btnAdminRemove" onclick="XoaTheoTyLe()">Lọc</div>';
    inner += '<div class="adminSearch"><input type="text" id="adminSearchBox" class="form-control"></input><div id="btnAdminSearch" onclick="TimKiemDiaDiem()">Tìm kiếm</div></div>';
    inner += '<div class="adminTable" id="adminAList">' + '</div>';
    inner += '<div class="adminFooter" id="adminFoot">' + '</div>';

    document.getElementById('PointManagerControl').innerHTML = inner;
    HienDanhSachDiaDiem("");
}

// xoa theo ty le
function XoaTheoTyLe() {
    if (window.confirm("Thực thi xóa tất cả địa điểm theo tỷ lệ?")) {
        $.ajax({
            url: 'Point/Xoa',
            type: 'get',
            success: function (data) {
                QuanLyDiaDiem();
            }
        })
    }
}

// Hien danh sach dia diem
function HienDanhSachDiaDiem(str) {
    $.ajax({
        url: 'Point/DanhSachDiaDiem',
        type: 'post',
        async: false,
        data: {
            str: str
        },
        success: function (data) {
            DanhSachDiaDiem(data);
        }
    })
}
function DanhSachDiaDiem(data) {
    document.getElementById('adminAList').innerHTML = "";
    var i = '';
    i += '<table id="tableadmin" style="width:100%"><tr>';
    i += '<td style="width:5%"><label>STT</label></td>';
    i += '<td style="width:45%"><label>Tên</label></td>';
    i += '<td style="width:15%"><label>Loại</label></td>';
    i += '<td style="width:36%"><label>Lượt thích</label></td>';
    i += '<td style="width:15%"><label>Ngày tạo</label></td>';
    i += '<td style="width:10%"><label></label></td>';
    i += '</tr></table>';
    document.getElementById('adminAList').innerHTML += i;
    for (var x in data) {
        var u = '';
        u += '<div class="adminEachAccount">';
        u += '<table style="width:100%" onclick="HienDieuKhienDiaDiem(' + x + ')"><tr>';
        u += '<td style="width:5%"><label>' + (parseInt(x) + 1) + '</label></td>';
        u += '<td style="width:40%; text-align:left"><label>' + data[x].ten + '</label></td>';
        u += '<td style="width:25%; text-align:left"><label>' + data[x].loai + '</label></td>';
        u += '<td style="width:30%; text-align:center"><label>' + data[x].luotthich + '</label></td>';
        u += '<td style="width:20%"><label>' + data[x].ngaythem +'<label></td>';
        u += '<td style="width:5%"><label><i class="fa fa-trash-o" onclick="XoaDD(' + x + ')"></i></label></td>';
        u += '</tr></table>';
        u += '</div>';
        u += '<label class="KoHienThi" id="xoa' + x +'">' + data[x].id + '</label>';
        document.getElementById('adminAList').innerHTML += u;
    }
}

// xoa
function XoaDD(x) {
    if (confirm("Bạn có đồng ý xóa địa điểm này? Toàn bộ dữ liệu sẽ bị xóa")) {
        var id = document.getElementById('xoa' + x).innerText;
        $.ajax({
            url: 'Point/XoaDiaDiem',
            type: 'post',
            data: {
                id: id
            },
            success: function (data) {
                alert("Đã xóa địa điểm");
                HienDanhSachDiaDiem("");
                console.log(data);
            }
        })
    }
    else {

    }
}

// Hien dieu khien dia diem
function HienDieuKhienDiaDiem(x) {
    var id = document.getElementById("xoa" + x).innerText;
    $.ajax({
        url: 'Point/HienThongTin',
        type: 'post',
        data: {
            id: id
        },
        success: function (data) {
            HienThongTinDiaDiem(data);
        }
    })
}

// hien thong tin dia diem
function HienThongTinDiaDiem(data) {
    var i = "";
    i += '<table class="tablettdd" style="width:100%">';
    i += '<tr><td style="width:60%; text-align:left"><label>Tên: ' + data.ten + '</label></td><td style="width:40%; text-align:left"><label>Loại: ' + data.loai + '</label></td></tr>';
    i += '<tr><td style="width:100%; text-align:left"><label>Địa chỉ: ' + data.diachi + '</label></td><td rowspan="3"><img src="' + data.img + '" class="adminTableImg2"></td></tr>';
    i += '<tr><td style="width:100%; text-align:left"><label>Vị trí: ' + data.pxqh + '</label></td></tr>';
    i += '<tr><td style="width:100%; text-align:left"><label>Mô tả: ' + data.mota + '</label></td></tr>';
    i += '</table>';
    document.getElementById('adminFoot').innerHTML = i;
    // console.log(data);
}

// Tim kiem dia diem
function TimKiemDiaDiem() {
    var s = document.getElementById('adminSearchBox').value;
    HienDanhSachDiaDiem(s);
}

// load
$(document).ready(function () {
    if (getUserRole() == "ad" || getUserRole() == "dn") {
        pos.remove();
    }
});