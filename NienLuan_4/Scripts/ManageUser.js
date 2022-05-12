

// THem controller
var UserManager = L.control({ position: "topright" });
UserManager.onAdd = function (map) {
    var div = L.DomUtil.create("div", "div3");
    var i = '<div id="UserManager" onmouseover="DisableZoomDrag()" onmouseout="EnableZoomDrag()">';
    i += '<div id="mAvatar"></div>';
    i += '<div id="mInfo"></div>';
    i += '</div>';
    div.innerHTML = i;
    return div;
};

// QUan ly tai khoan
function QuanLyTaiKhoan() {
    LayThongTinTaiKhoan();
}

// Lay thong tin tai khoan
function LayThongTinTaiKhoan() {
    $.ajax({
        url: 'User/LayThongTin',
        type: 'get',
        success: function (data) {
            HienThongTinTaiKhoan(data);
        }
    })
}

// Hien thong tin tai khoan
function HienThongTinTaiKhoan(data) {
    removeAllMenu();
    document.getElementById('btnMenu').click();
    UserManager.addTo(mapObject);

    var userAvatar = '<table>';
    userAvatar += '<tr><td><img src="' + data.img + '" id="mAvartarImg"></td><td><label>' + data.id + '</label><div id="btnEditAvatar">Chỉnh sửa</div></td></tr>';
    userAvatar += '</table>';
    document.getElementById('mAvatar').innerHTML = userAvatar;

    var sdt = data.phone;
    if (sdt == "          ") {
        sdt = "N/A";
    }
    var userInfo = '<table>';
    userInfo += '<tr><td><label>Tên tài khoản: </label></td><td><label class="InfoL" id="tentk">' + data.name + '</label></td></tr>';
    userInfo += '<tr><td><label>Tên hiển thị: </label></td><td><label class="InfoL" id="tenht">' + data.displayname + '</label></td></tr>';
    userInfo += '<tr><td><label>Mật khẩu: </label></td><td><label class="InfoL" >' + '**********' + '</label></td></tr>';
    userInfo += '<tr><td><label>Email: </label></td><td><label class="InfoL" id="email">' + data.email + '</label></td></tr>';
    userInfo += '<tr><td><label>Số điện thoại: </label></td><td><label class="InfoL" id="sdt">' + data.phone + '</label></td></tr>';
    userInfo += '</table>';
    userInfo += '<div id="mEditPass" class="mButton" onclick="HienDoiMatKhau()">Đổi mật khẩu</div>';
    userInfo += '<div id="mEditInfo" class="mButton" onclick="HienSuaThongTin()">Sửa thông tin</div>';
    document.getElementById('mInfo').innerHTML = userInfo;

}

// Hien doi mat khau
function HienDoiMatKhau() {
    var editpass = '<table>';
    editpass += '<tr><td><label>Mật khẩu cũ: </label></td><td><input type="password" class="ipmk" id="mkc"></input></td></tr>';
    editpass += '<tr><td><label>Mật khẩu mới: </label></td><td><input type="password" class="ipmk" id="mkm"></input></td></tr>';
    editpass += '<tr><td><label>Xác nhận mật khẩu: </label></td><td><input type="password" class="ipmk" id="mkxn"></input></td></tr>';
    editpass += '</table>';
    editpass += '<div id="mEditPassC" class="mButton" onclick="DoiMatKhau()">Xác nhận</div><div id="mCancel" class="mButton" onclick="QuanLyTaiKhoan()">Thoát</div>';

    document.getElementById('mInfo').innerHTML = editpass;
}

// Hien sua thong tin
function HienSuaThongTin() {
    var tentk = document.getElementById('tentk').innerText;
    var tenht = document.getElementById('tenht').innerText;
    var email = document.getElementById('email').innerText;
    var sdt = document.getElementById('sdt').innerText;

    var editinfo = '<table>';
    editinfo += '<tr><td><label>Tên tài khoản: </label></td><td><input type="text" class="ipmk" id="Etentk" value="' + tentk + '"></input></td></tr>';
    editinfo += '<tr><td><label>Tên hiển thị: </label></td><td><input type="text" class="ipmk" id="Etenht" value="' + tenht + '"></input></td></tr>';
    editinfo += '<tr><td><label>Email: </label></td><td><input type="text" class="ipmk" id="Eemail" value="' + email + '"></input></td></tr>';
    editinfo += '<tr><td><label>Số điện thoại: </label></td><td><input type="text" class="sdt" id="Esdt" value="' + sdt + '"></input></td></tr>';
    editinfo += '</table>';
    editinfo += '<div id="mEditPassC" class="mButton" onclick="LuuThongTin()">Lưu</div>';
    editinfo += '<div id="mCancel" class="mButton" onclick="QuanLyTaiKhoan()">Thoát</div>';

    document.getElementById('mInfo').innerHTML = editinfo;
}

// Luu thong tin
function LuuThongTin() {
    var tentk = document.getElementById('Etentk').value;
    var tenht = document.getElementById('Etenht').value;
    var email = document.getElementById('Eemail').value;
    var sdt = document.getElementById('Esdt').value;

    if (!KiemTraTK(tentk)) {
        document.getElementById('Etentk').focus();
    }
    else if (!KiemTraTenHienThi(tenht)) {
        document.getElementById('Etenht').focus();
    }
    else if (!KiemTraEmail(email)) {
        document.getElementById('Eemail').focus();
    }
    else if (!KiemTraSdt(sdt)) {
        document.getElementById('Eemail').focus();
    }
    else {
        $.ajax({
            url: 'User/LuuThongTin',
            type: 'post',
            data: {
                tentk: tentk,
                tenht: tenht,
                email: email,
                sdt: sdt
            },
            success: function (data) {
                alert("Lưu thông tin thành công !!!");
            }
        })
    }
}

// Kiem tra ten hien thi
function KiemTraTenHienThi(tenht) {
    var isLegit = false;
    if (tenht.length == 0) {
        alert("Chưa nhập tên hiển thị !!!");
    }
    else if (tenht.length < 3 || tenht.length >= 50) {
        alert("Tên hiển thị chỉ có thể có tối đa từ 3 đến 50 ký tự !!!");
    }
    else {
        isLegit = true;
    }
    return isLegit;
}

// Doi mat khau
function DoiMatKhau() {
    var mkc = document.getElementById('mkc').value;
    var mkm = document.getElementById('mkm').value;
    var mkxn = document.getElementById('mkxn').value;
    //console.log(mkc + mkm + mkxn);

    if (mkm != mkxn) {
        alert("Mật khẩu không trùng khớp !!!");
    } else {
        if (!KiemTraMatKhau(mkc)) {
            alert("Sai mật khẩu !!!");
            document.getElementById('mkc').value = "";
            document.getElementById('mkc').focus();
        } else {
            $.ajax({
                url: 'User/DoiMatKhau',
                type: 'post',
                data: {
                    mk: mk
                },
                success: function (data) {
                    alert("Đổi mật khẩu thành công !!!");
                    SignOut();
                    btnSignInClick2();
                }
            })
        }
    }
}

// Kiem tra mat khau
function KiemTraMatKhau(mk) {
    var isValid = false;
    $.ajax({
        url: 'User/KiemTraMatKhau',
        type: 'post',
        data: {
            mk: mk,
        },
        async: false,
        success: function (data) {
            isValid = data;
        }
    })
    return isValid;
}