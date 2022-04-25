

// Them menu
var userMenu = L.control({ position: "topleft" });
userMenu.onAdd = function (map) {
    var div = L.DomUtil.create("div", "div3");
    var i = '<div id="userMenu">';
    i += '<table id="tableHeader"><tr><td><div id="avatar"></div></td>' + '<td><div id="userName"></div></td></tr><table>';
    i += '<div id="menuContent"></div>';
    i += '<div id="menuFooter"></div>';
    i += '</div>';
    div.innerHTML = i;
    return div;
};


// Menu nguoi chua dang nhap
var AnoMenuStr = '';
AnoMenuStr += '<br><p>Bạn chưa đăng nhập !!!</p>';
AnoMenuStr += '<h3"><a href="#" onClick="btnSignInClick2()">Đăng nhập</a></h3>';
// Menu nguoi dung
var userMenuStr = '';
userMenuStr += '<h3><a href="#" onclick="btnPosClick()"><i class="fa fa-map"></i>&nbsp&nbspBản đồ cộng đồng</a></h3>';
userMenuStr += '<h3><a href="#"><i class="fa fa-map-signs"></i>&nbsp&nbspĐịa điểm đã thích</a></h3>';
userMenuStr += '<h3><a href="#"><i class="fa fa-user"></i>&nbsp&nbspQuản lý tài khoản</a></h3>';
userMenuStr += '<hr>';
userMenuStr += '<h3><a href="Home/About">Giới thiệu</a></h3>';
// Menu doanh nghiep
var dnMenuStr = '';
dnMenuStr += '<h3><a href="#" onclick="dnMenuMapClick()" id="dnMap"><i class="fa fa-map-signs"></i>&nbsp&nbspBản đồ</a></h3>';
dnMenuStr += '<h3><a href="#"><i class="fa fa-user"></i>&nbsp&nbspQuản lý tài khoản</a></h3>';
dnMenuStr += '<hr>';
dnMenuStr += '<h3><a href="Home/About">Giới thiệu</a></h3>';
// Menu admin
var adMenuStr = '';
adMenuStr += '<h3><a href="#"><i class="fa fa-map"></i>&nbsp&nbspQuản lý tài khoản</a></h3>';
adMenuStr += '<h3><a href="#"><i class="fa fa-map"></i>&nbsp&nbspQuản lý địa điểm</a></h3>';
adMenuStr += '<h3><a href="#" id="coll" onClick="addOptions()"><i class="fa fa-map"></i>&nbsp&nbspThống kê&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<i class="fa fa-chevron-down" id="arrow"></i></a></h3>';
adMenuStr += '<div id="tkct">';
adMenuStr += '</div>';
// Menu footer
var footerMenuStr = '<h3><a href="#" onClick="SignOut()"><i class="fa fa-sign-out"></i>&nbsp&nbspĐăng xuất</a></h3>';

// btnSignIn click
function btnSignInClick2() {
    document.getElementById('lgbt').click();
}

// SignOut
function SignOut() {
    $.ajax({
        url: '/Login/LogOut',
        type: 'get',
        success: function (data) {
            document.location.reload();
        }
    })
}

// addOptions
function addOptions() {
    var i = '';
    i += '<h3><a href="#"><i class="fa fa-map"></i>&nbsp&nbspThống kê tài khoản</a></h3>';
    i += '<h3><a href="#"><i class="fa fa-map"></i>&nbsp&nbspThống kê địa điểm</a></h3>';
    if (document.getElementById('tkct').childNodes.length == 0) {
        document.getElementById('arrow').style.transform = 'rotate(270deg)';
        document.getElementById('tkct').innerHTML = i;
    }
    else {
        document.getElementById('arrow').style.transform = 'rotate(0deg)';
        document.getElementById('tkct').innerHTML = '';
    }
}

// Hien menu
$('#btnMenu').click(function () {   
    addMarker.clearLayers();
    if (!document.getElementById("userMenu")) {
        userMenu.addTo(mapObject);
        document.getElementById('avatar').innerHTML = '<img src="' + getUserAvatar() + '" />';
        document.getElementById('userName').innerHTML = '<p>' + getUserName() + '</p>';
        var role = getUserRole();
        if (role == "ano") {
            document.getElementById('menuContent').innerHTML = AnoMenuStr;
        }
        else if (role == "cn") {
            document.getElementById('menuContent').innerHTML = userMenuStr;
            document.getElementById('menuFooter').innerHTML = footerMenuStr;
        }
        else if (role == "ad") {
            document.getElementById('menuContent').innerHTML = adMenuStr;
            document.getElementById('menuFooter').innerHTML = footerMenuStr;
        }
        else {
            document.getElementById('menuContent').innerHTML = dnMenuStr;
            document.getElementById('menuFooter').innerHTML = footerMenuStr;
            $('#dnMap').click();
        }
    }
    else {
        removeAllMenu();
    }    
})

function removeAllMenu() {
    if (document.getElementById("markerMenu")) {
        markerProp.remove();
    }
    if (document.getElementById("userMenu")) {
        userMenu.remove();
    }
    if (document.getElementById("layout")) {
        pointProp.remove();
    }
    if (document.getElementById('pointControl')) {
        pointControl.remove();
    }
    if (document.getElementById('EditDiv')) {
        pointEditDiv.remove();
    }
    EnableZoomDrag();
}