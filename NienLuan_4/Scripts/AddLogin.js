// Kiem tra dang nhap
// Lay role tai khoan
function getUserRole() {
    var role = null;
    $.ajax({
        url: 'User/getUserRole',
        type: 'get',
        async: false,
        success: function (data) {
            role = String(data);
        }
    });
    return role;
}

// Lay ten tai khoan
function getUserName() {
    var Name = null;
    $.ajax({
        url: 'User/getUserName',
        type: 'get',
        async: false,
        success: function (data) {
            Name = String(data);
        }
    });
    return Name;
};

// Lay avatar
function getUserAvatar() {
    var Link = null;
    $.ajax({
        url: 'User/getUserAvatar',
        type: 'get',
        async: false,
        success: function (data) {
            Link = String(data);
        }
    });
    return Link;
};
function isLogOn() {
    var l = false;
    $.ajax({
        url: '/Login/isLogon',
        type: 'get',
        async: false,
        success: function (data) {
            l = data;
        }
    })
    return l;
}
var LogOn = isLogOn();
if (LogOn == false) {
    // Login controller


    // Them nut dang nhap
    var lgbt = L.control({ position: "topright" });
    lgbt.onAdd = function (map) {
        var div = L.DomUtil.create("div", "div2");
        div.innerHTML = '<input type="button" value="Đăng nhập" class="form-control" id="lgbt">';
        div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
        return div;
    };
    lgbt.addTo(mapObject);

    // Login field
    //  lgbt2, btnSignUp
    var lgf = L.control({ position: "topright" });
    lgf.onAdd = function (map) {
        var div = L.DomUtil.create("div", "div2");
        var i = "";
        i += '<div id="field" >';
        i += '';
        i += '<label for="tk" style="">Tài khoản:</label><input type="text" class="form-control" id="tkdn">';
        i += '<label for="mk" style="">Mật khẩu:</label><input type="password" class="form-control" id="mkdn"><br>';
        i += "<center><table><tr><td><input type='button' value='Đăng nhập' class='form-control' style='width: 100px;' id='lgbt2' onClick='btnSignInClick()'></td>";
        i += "<td><input type='button' value='Đăng ký' class='form-control' style='width: 100px;' id='btnSignUp' onClick='btnSignUpClick()'></td>";
        i += '</tr></table></center></div>';
        div.innerHTML = i;
        div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
        return div;
    };

    // Hien login field
    $('#lgbt').click(function () {
        if (!document.getElementById("field") && !document.getElementById("sufield")) {
            lgf.addTo(mapObject);
        }
        else {
            suf.remove();
            lgf.remove();
        }
    });


    // sleep
    function sleep(ms) {
        var start = new Date().getTime();
        var end = start;
        while (end < start + ms) {
            end = new Date().getTime();
        }
    }

    // Dang nhap
    function SignIn(tk, mk) {
        $.ajax({
            url: 'Login/Login',
            type: 'post',
            data: {
                tk: tk,
                mk: mk
            },
            success: function (data) {
                if (data == false) {
                    alert("Sai tên tài khoản/mật khẩu hoặc tài khoản của bạn đã bị khóa !!!");
                }
                else {
                    document.location.reload();
                }
            },
            error: function () {

            }
        });
    };
    function btnSignInClick() {
        var tk = $('#tkdn').val();
        var mk = $('#mkdn').val();
        SignIn(tk, mk);
    }

    // Sign up field
    var suf = L.control({ position: "topright" });
    suf.onAdd = function (map) {
        var div = L.DomUtil.create("div", "div2");
        var i = '<div id="sufield">';
        i += '<label for="ltk" style="">Loại tài khoản:</label><select class="form-control" id="ltk"><option value="1">Tài khoản cá nhân</option><option value="2">Tài khoản doanh nghiệp</option></select>'
        i += '<label for= "tk" style = "" > Tài khoản:</label > <input type="text" class="form-control" id="tk">';
        i += '<label for="mk" style="">Mật khẩu:</label><input type="password" class="form-control" id="mk">';
        i += '<label for="mk" style="">Xác nhận mật khẩu:</label><input type="password" class="form-control" id="xnmk">';
        i += '<label for="mk" style="">Email:</label><input type="text" class="form-control" id="email">';
        i += "<br><center><input type='button' value='Đăng ký' class='form-control' style='width: 100px; ' id='btnSignUp2' onClick='btnSignUp2Click()'></center>";
        div.innerHTML = i;
        div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
        return div;
    };
    // Hien sign up field
    function btnSignUpClick() {
        if (document.getElementById("field")) {
            // alert("have");
            lgf.remove();
            suf.addTo(mapObject);
        }
        else {
            alert("not");
        }
    }


    // Dang ky
    function btnSignUp2Click() {
        var ltk = $('#ltk').val();
        var tk = $('#tk').val();
        var mk = $('#mk').val();
        var xnmk = $('#xnmk').val();
        var email = $('#email').val();
        // Kiem tra tai khoan
        if (!KiemTraTK(tk)) {
            $('#tk').focus();
        }
        // Kiem tra mat khau
        else if (!KiemTraMK(mk, xnmk)) {
            $('#mk').focus();
        }
        // Kiem tra email
        else if (!KiemTraEmail(email)) {
            $('#email').focus();
        }
        // Tao tai khoan
        else {
            // alert("Right");
            isExist(ltk, tk, mk, email);
        }
    }


    // Tao tai khoan
    function TaoTaiKhoan(ltk, tk, mk, email) {
        $.ajax({
            url: '/Login/CreateAccount',
            type: 'post',
            data: {
                ltk: ltk,
                tk: tk,
                mk: mk,
                email: email
            },
            success: function (data) {
                alert("Tạo tài khoản thành công");
                SignIn(tk, mk);
                location.reload();
            },
            error: function () {
                alert("CreateAccount");
            }
        })
    }
    // Kiem tra ton tai tai khoan
    function isExist(ltk, tk, mk, email) {
        $.ajax({
            url: '/Login/isExist',
            type: 'post',
            data: {
                tk: tk
            },
            success: function (data) {
                if (data == true) {
                    alert("Tài khoản này đã tồn tại !!!");
                }
                else {
                    TaoTaiKhoan(ltk, tk, mk, email);
                }
            },
            error: function () {
                alert("isExist");
            }
        })
    }
    // Kiem tra mat khau
    function KiemTraMK(mk, xnmk) {
        var isLegit = false;
        if (mk.length == 0) {
            alert("Chưa nhập mật khẩu !!!");
        }
        else if (mk.length < 3 || mk.length >= 24) {
            alert("Mật khẩu có độ dài từ 3 đến 24 ký tự !!!");
        }
        else if (xnmk != mk) {
            alert("Mật khẩu xác nhận không trùng khớp !!!");
        }
        else {
            isLegit = true;
        }
        return isLegit;
    }
    // Kiem tra tai khoan
    function KiemTraTK(tk) {
        var isLegit = false;
        if (tk.length == 0) {
            alert("Chưa nhập tài khoản !!!");
        }
        else if (tk.length < 3 || tk.length >= 24) {
            alert("Tài khoản chỉ có thể có tối đa từ 3 đến 24 ký tự !!!");
        }
        else if (!/^[a-zA-Z]+$/.test(tk)) {
            alert("Tài khoản chỉ có thể chứa ký tự Latin !!!");
        }
        else {
            isLegit = true;
        }
        return isLegit;
    }
    // Kiem tra email
    function KiemTraEmail(email) {
        var isLegit = false;
        let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
        if (!regex.test(email)) {
            alert("Email không hợp lệ !!!");
        }
        else if (email.length == 0) {
            alert("Chưa nhập Email !!!");
        }
        else {
            isLegit = true;
        }
        return isLegit;
    }
    // Kiem tra so dien thoai
    function KiemTraSdt(sdt) {
        let regex = new RegExp('[0-9]');
        if (regex.test(sdt) && (sdt.length == 10 || sdt.length == 0)) {
            return true;
        }
        else {
            alert("Số điện thoại không hợp lệ !!!");
            return false;
        }
    }
}
else {
    var user = L.control({ position: "topright" });
    user.onAdd = function (map) {
        var div = L.DomUtil.create("div", "div2");
        var i = '<div id="userProfile"></div>';
        div.innerHTML = i;
        div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
        return div;
    };
    user.addTo(mapObject);

    var up = '';
    up += '<table><tr><td>'
    up += '<p>' + getUserName() + '</p></td>';
    up += '<td><img src="' + getUserAvatar() + '" /></td></tr></table>';

    document.getElementById('userProfile').innerHTML = up;
}