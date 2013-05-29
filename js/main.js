//////////////////////////////////////////////////
//
//  jQuery GPS
//
//////////////////////////////////////////////////
$(document).ready(function() {

    var settingDao = {
        read:function() {
            var list = [];
            if ( localStorage["setting"] ) {
                list = eval( localStorage["setting"] );
            }
            return list;
        },
        write:function ( list ) {
            localStorage["setting"] = JSON.stringify(list);
        }
    };


    var settings = settingDao.read();
    var setting = ( settings && settings.length > 0 ) ? settings[0] : {};

    $("#screen_name").val(setting.screen_name).change(function() {
        setting.screen_name = $(this).val();
        settingDao.write([ setting ]);
    });

    $("#interval").val(setting.interval ? setting.interval : 8).change(function() {
        setting.interval = $(this).val();
        settingDao.write([ setting ]);
    });



    //GPS情報取得を開始
    var map = new google.maps.Map(
        document.getElementById("map_canvas"),
        {
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

    navigator.geolocation.getCurrentPosition(
        function (position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;

            map.setCenter(new google.maps.LatLng(lat, lng))
        },
        function () {
            alert('失敗しました');
        },
        {
            enableHighAccuracy:true,
        });


    var position_post_thread = null;
    var myPos = new google.maps.Marker({ map:map });
    var yourPos = [];
    var myPosCircle = null;

    // POST thread
    $('#auto_update').click(function(){
        if (position_post_thread) {
            navigator.geolocation.watchStop(position_post_thread);
            position_post_thread = null;
        }

        if ($(this).find(':checked')) {
            var position_post_thread = navigator.geolocation.watchPosition(
                function (position) {
                    var lat = position.coords.latitude;
                    var lng = position.coords.longitude;

                    $('#latitude').html(lat); //緯度
                    $('#longitude').html(lng); //経度

                    var latlng = new google.maps.LatLng(lat, lng);

                    myPos.setPosition(latlng)

                    if (myPosCircle) myPosCircle.setMap(null);
                    if ($("#display_circle").is(':checked')) {

                        myPosCircle = new google.maps.Circle({
                            map:map,
                            center:myPos.position,
                            radius:300,
                            strokeColor:'yellow',
                            strokeOpacity:0.6,
                            strokeWeight:2,
                        })
                    }

                    var screen_name_ctl = $("#screen_name");

                    $.ajax({
                        url: "./api/position/update.php",
                        type: "POST",
                        dataType: "json",
                        data: $.param({
                            position:{
                                lat:lat,
                                lng:lng,
                                screen_name:screen_name_ctl.val()
                            }
                        }),
                        complete: function( data, status ) {

                        },
                        error: function() {},
                    });
                },
                function () {
                    // failure
                },
                {
                    enableHighAccuracy:true,
                }
            );
        }
    }).click();

    // GET thread
    var position_get = function () {
        $.ajax({
            url: "./api/position/get.php",
            type: "GET",
            dataType: "json",
            data: $.param({}),
            success: function( data, status ) {
                $.each(yourPos, function( k, v ) {
                    v.setMap(null);
                });

                $("#positions").empty();

                yourPos = [];
                $.each(data.success.positions, function( k, v ) {
                    if (!v.other) {
                        if (!screen_name_ctl.val()) {
                            screen_name_ctl.val(v.screen_name);
                        }
                        return;
                    }

                    yourPos.push(
                        new google.maps.Marker({
                            position:new google.maps.LatLng(v.lat, v.lng),
                            map:map,
                            icon:'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E4%BB%96|7FFF00|000000',
                        })
                    );

                    $("#positions").append(
                        $("<li />").append($('<a />').text(v.screen_name + '(' + v.lat + ', ' + v.lng + ')').click(function() {
                            map.setCenter(new google.maps.LatLng(v.lat, v.lng));
                            var distance = google.maps.geometry.spherical.computeDistanceBetween(
                                new google.maps.LatLng(myPos.position.lat(), myPos.position.lng()),
                                new google.maps.LatLng(v.lat, v.lng)
                            );
                        }).css({
                            'cursor':'pointer',
                            'text-decoration':'underline'
                        })));

                });

                $(".dropdown-toggle").dropdown();
            },
            error: function() {
            },
            complete: function() {

            },
        });
    };

    var POSITION_GET_THREAD_INTERVAL = 5;
    var position_get_thread = setInterval(position_get, 1000 * POSITION_GET_THREAD_INTERVAL);

    $('#move_center').click(function(){
        map.setCenter(myPos.getPosition());

    });
    $("#zoom_18, #zoom_16, #zoom_14").click(function() {
        map.setZoom(parseInt($(this).attr('id').replace('zoom_', '')));
    });
});
