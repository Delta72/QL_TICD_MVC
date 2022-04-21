var logon = isLogOn();

if (logon == true) {
    var role = getUserRole();
    if (role == "dn") {
        minus.addTo(mapObject);
        add.addTo(mapObject);
        // Select list loai dich vu
        function SelectListLoaiDVu() {
            var str = '';
            str += '<select class="form-control txt" id="sllLoaiDVu">';
            $.ajax({
                url: '/User/selectLoaiDVu',
                type: 'get',
                async: false,
                success: function (data) {
                    for (var a in data) {
                        str += '<option value="' + (parseInt(a) + 1) + '">' + data[a] + '</option>';
                    }
                }
            });
            str += '</select>';
            return str;
        }
        

        // Noi dung marker
        // browseImage, browseFile
        // imgMarker
        // ten
        // sllLoaiDVu
        // coor
        // txtarea
        // btnSaveMarker, btnCancelMarker
        var content = '';
        content += '<table>';
        content += '<tr><td>' + '<label for="mk" style="">Hình ảnh:</label>' + '</td><td>' + '<input type="button" value="Tải lên" class="btnMarker" id="browseImage" onclick="btnUpLoadClick()" /><input type="file" id="browseFile" class="upld" />' + '</td></tr>';
        content += '<tr><td colspan="2">' + '<div id="markerImage"><img src="#" id="imgMarker"/></div>' + '</td></tr>';
        content += '<tr><td>' + '<label for="mk">Tên địa điểm:</label>' + '</td><td>' + '<input type="text" class="form-control txt" id="ten">' + '</td></tr>';
        content += '<tr><td>' + '<label for="mk">Địa chỉ:</label>' + '</td><td>' + '<input type="text" class="form-control txt" id="add">' + '</td></tr>';
        content += '<tr><td>' + '<label for="mk">Loại dịch vụ:</label>' + '</td><td>' + SelectListLoaiDVu() + '</td></tr>';        
        content += '<tr><td>' + '<label for="mk">Mô tả:</label>' + '</td><td></td></tr>';
        content += '<tr><td colspan="2">' + '<div id="trar"><textarea id="txtarea"></textarea></div>' + '<br></td></tr>';
        content += '<tr><td>' + '<input type="button" value="Lưu" class="btnMarker" id="btnSaveMarker" onclick="btnSaveMarkerClick()">' + '</td><td>' + '<input type="button" value="Hủy bỏ" class="btnMarker" id="btnCancelMarker" onclick="btnCancelMarkerClick()">' + '</td></tr>';
        content += '</table>';
        content += '<input type="text" id="coor" readonly="true">' + '<input type="text" id="idpx" readonly="true">';

        

        // Xoa mau PX
        function clearColor() {
            polyPX.eachLayer(function (layer) {
                layer.on('mouseover', function () {
                    this.setStyle({
                        fillOpacity: 0,
                        opacity: 1,
                    })
                });
            });
        };

        // marker prop control
        var markerProp = L.control({ position: "topleft" });
        markerProp.onAdd = function (map) {
            var div = L.DomUtil.create("div", "div3");
            var i = '<div id="markerMenu">';
            i += '</div>';
            div.innerHTML = i;
            return div;
        };

        // Them markerProp
        function addMarkerPropDiv() {
            userMenu.remove();
            markerProp.addTo(mapObject);
            document.getElementById('markerMenu').innerHTML = content;
            document.getElementById('ten').focus();
            $("#browseFile").change(function () {
                readURL(this);
            });
        }

        // on plus click
        var marker;
        function btnAddClick() {
            removeAllMenu();
            addMarkerPropDiv();
            addMarker.clearLayers();
            var px;
            marker = L.marker(mapObject.getCenter(), { draggable: 'true'}).addTo(addMarker);
            $('#coor').val(marker._latlng.lat + ', ' + marker._latlng.lng);
            allPX.eachLayer(function (l) {
                if (leafletPip.pointInLayer(marker.getLatLng(), l, true).length != 0) {
                    px = leafletPip.pointInLayer(marker.getLatLng(), l, true);
                }
            })
            if (px != null) {
                $('#idpx').val(px[0].options.id);
            }

            marker.on("dragend", function (e) {
                clearColor();
                var chagedPos = e.target.getLatLng();
                $('#coor').val(e.target._latlng.lat + ', ' + e.target._latlng.lng);
                leafletPip.bassackwards = true;
                allPX.eachLayer(function (l) {
                    if (leafletPip.pointInLayer(e.target.getLatLng(), l, true).length != 0) {
                        px = leafletPip.pointInLayer(e.target.getLatLng(), l, true);
                    }
                })
                if (px != null) {
                    $('#idpx').val(px[0].options.id);;
                }
            });
            marker.on('click', function (e) {
                clearColor();
                mapObject.setView(e.latlng, 15);
            })
        };

        // on minus click
        function btnMinusClick() {
            addMarker.clearLayers();
            markerProp.remove();
        };

        function PreventDrag() {
            mapObject.dragging.disable();
        }
        function AllowDrag() {
            mapObject.dragging.enable();
        }        

        // btnSaveMarkerCLick
        function btnSaveMarkerClick() {
            SaveMarkerInfo();
        };
        function SaveMarkerInfo() {
            var formData = new FormData();
            var img = document.getElementById('browseFile').files;
            var imgl = img.length;
            var name = $('#ten').val();
            var dc = $('#add').val();
            var loai = $('#sllLoaiDVu').val();
            var coor = $('#coor').val();
            var mota = $('#txtarea').val();
            var idpx = $('#idpx').val();

            if (imgl < 1) {
                alert("Chưa chọn hình ảnh cho địa điểm !!!");
            }
            else if (name.length == 0) {
                alert("Chưa nhập tên cho địa điểm !!!");
            }
            else if (dc == "") {
                alert("Chưa nhập địa chỉ cho địa điểm !!!");
            }
            else if (mota.length == 0) {
                alert("Chưa nhập mô tả cho địa điểm !!!");
            }
            else if (idpx == "") {
                alert("Hãy chọn vị trí phù hợp !!!");
            }
            else {
                var l = String(img[0].name).replace(/\.[^/.]+$/, "");
                formData.append("imgLink", l);
                formData.append("img", img[0]);
                formData.append("name", name);
                formData.append("add", dc);
                formData.append("loai", loai);
                formData.append("coor", coor);
                formData.append("mota", mota);
                formData.append("idpx", idpx);

                $.ajax({
                    url: 'Point/AddMarker',
                    type: 'post',
                    async: true,
                    dataType: 'json',
                    processData: false,
                    contentType: false,
                    data: formData,
                    success: function (data) {
                        alert("Thêm địa điểm thành công !!!");
                        $('#btnMenu').click();
                        $('#dnMap').click();
                    },
                    error: function () {
                        alert("AddMarker");
                    }
                })
            }

        };

        // btnCancelMarkerClick
        function btnCancelMarkerClick() {
            btnMinusClick();
        }

        // Tai file
        function btnUpLoadClick() {
            document.getElementById('browseFile').click();
        }

        // File change
        function readURL(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('#imgMarker').attr('src', e.target.result);
                }
                reader.readAsDataURL(input.files[0]);
            }
        }

    }
}
else {

}
