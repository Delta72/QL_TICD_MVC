

// Menu
// btnMenu, SbSearch, btnSearch
var menu = L.control({ position: "topleft" });
menu.onAdd = function (map) {
    var div = L.DomUtil.create("div", "div3");
    var i = '<div class="container-fluid"><table>';
    i += '<tr><td><button type="submit" class="form-control" id="btnMenu"><div id="menubar"></div><div  id="menubar"></div><div id="menubar"></div></button></td><td>&nbsp&nbsp&nbsp</td>';
    i += '<td><input type="text" class="form-control" size="500" id="SbSearch"></td><td>&nbsp&nbsp&nbsp</td>';
    i += '<td><button type="submit" class="form-control id="btnSearch"><i class="fa fa-search"></i></button></td></tr>';
    i += '</table></div>'
    div.innerHTML = i;
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
};
menu.addTo(mapObject);

// Current position
// btnPos
var pos = L.control({ position: "bottomright" });
pos.onAdd = function (map) {
    var div = L.DomUtil.create("div", "div4");
    var i = '';
    i += '<button type="submit" class="form-control id="btnPos" onclick="btnPosClick()"><i class="fa fa-compass"></i></button>'
    div.innerHTML = i;
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
}
pos.addTo(mapObject);


// btnMinus
var minus = L.control({ position: "bottomright" });
minus.onAdd = function (map) {
    var div = L.DomUtil.create("div", "div4");
    var i = '';
    i += '<button type="submit" class="form-control id="btnMinus" onclick="btnMinusClick()"><i class="fa fa-times"></i></button>';
    div.innerHTML = i;
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
}


// btnAdd
var add = L.control({ position: "bottomright" });
add.onAdd = function (map) {
    var div = L.DomUtil.create("div", "div4");
    var i = '';
    i += '<button type="submit" class="form-control id="btnAdd" onclick="btnAddClick()" onmouseover="PreventDrag()" onmouseout="AllowDrag()"><i class="fa fa-plus"></i></button>';
    div.innerHTML = i;
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
}

// Reset view ctrl
var resetView = L.control({ position: "bottomleft" });
resetView.onAdd = function (map) {
    var div = L.DomUtil.create("div", "rs");
    var i = '<table>';
    i += '<tr><td><button type="submit" class="form-control" id="rs" onclick="fResetView()"><i class="fa fa-eye"></i></button></td></tr>';
    i += '</table>'
    div.innerHTML = i;
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
};
// Location

