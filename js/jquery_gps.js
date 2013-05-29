//////////////////////////////////////////////////
//
//  jQuery GPS
//
//////////////////////////////////////////////////
$(document).ready(function() {
    var thread = null;
    //GPS情報取得を開始
    $('#start_gps').click(function(){
        if (thread) {
            $(this).text('追跡 - 開始');
            clearInterval(thread);
            thread = null;
        } else {
            $(this).text('追跡 - 中止');

            var map = null;
            var marker = new google.maps.Marker();

            var gps = function () {

                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        marker.setMap(null);

                        var lat = position.coords.latitude;
                        var lng = position.coords.longitude;

                        $('#latitude').html(lat); //緯度
                        $('#longitude').html(lng); //経度

                        var latlng = new google.maps.LatLng(lat, lng);

                        if (!map) {
                            var opts = {
                                zoom: 15,
                                center: latlng,
                                mapTypeId: google.maps.MapTypeId.ROADMAP
                            };

                            map = new google.maps.Map(document.getElementById("map_canvas"), opts);
                        } else {
                            map.setCenter( latlng );
                        }

//                        var marker = new google.maps.Marker({
//                            positon: latlng
//                        });
                        marker.setPosition(latlng);
                        marker.setMap(map);
                    },
                    function () {
                        alert('失敗しました');
                    },
                    {
                        enableHighAccuracy:true,
                    });


//                navigator.geolocation.watchPosition(
//                    function(position){
//
//                        //GoogleMapLOAD
//                        if (GBrowserIsCompatible()) {
//                            var map = new GMap2(document.getElementById("map"));
//                            map.addControl(new GLargeMapControl());
//
//                            map.addControl(new GMapTypeControl());
//
//                            var latlng = new GLatLng(position.coords.latitude,position.coords.longitude);
//                            map.setCenter(latlng, 16, G_NORMAL_MAP);
//
//                            var marker = new GMarker(latlng);
//                            map.addOverlay(marker);
//
//
////                            GEvent.addListener(map,'click',function(overlay, point){
////                                if(point){
////                                    $('#click_lat').val(point.y);
////                                    $('#click_long').val(point.x);
////                                }
////                            });
//                        }
//                    }
//                );
            };
            gps();
            var interval = parseInt($("#interval").val());
            thread = setInterval(gps, 1000 * interval);
        }
    });
});
