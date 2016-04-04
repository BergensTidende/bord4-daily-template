define([
    'jquery',
    'pym',
    'maputils',
    'gdocs',
    'underscore',
    'handlebars',
    //'geojson',
    //'cartodb'
], function($, pym, maputils, gdocs, _, Handlebars) {

    'use strict';
    try {
        var pymChild = new pym.Child();
    } catch (err) {
        console.log('No pym parent');
    }

    if ($(document).width() < 460) {
        var mobile = true;
        console.log('MOBILE')
    } else {
        var mobile = false;
        console.log('NOT MOBILE')
    }
    console.log(mobile)

    var itemdata;
    var map;
    var markers;
    var markersgroup = new L.MarkerClusterGroup({
            spiderfyOnMaxZoom: true,
            spiderfyDistanceMultiplier: 2,
            maxClusterRadius: 15,
            polygonOptions: {
                width: 1,
                fillOpacity: 0.2
            },
            spiderLegPolylineOptions: {
                weight: 4,
                opacity: 0.8,
            }
        });



    //Handlebars helpers
    Handlebars.registerHelper('select', function(value, options) {
        var $el = $('<select />').html(options.fn(this));
        $el.find('[value="' + value + '"]').attr({ 'selected': 'selected' });
        return $el.html();
    });

    Handlebars.registerHelper('hearts', function(value, options) {
        var hearts = ''
        _.each(_.range(+value), function(hjerte) {
            hearts += '<span class="heart"><svg class="heart-filled" version="1.0" xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 29.000000 22.000000"  preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,22.000000) scale(0.100000,-0.100000)" fill="#ff0081" stroke="#ff0081"><path d="M26 199 c-19 -15 -26 -30 -26 -53 0 -36 16 -54 70 -81 19 -10 45 -26 56 -37 17 -15 23 -16 27 -5 3 8 30 26 61 40 38 18 60 36 66 53 29 76 -57 138 -114 81 l-23 -23 -27 23 c-33 28 -56 29 -90 2z"/></g></svg></span>';
        })
        return hearts;
    });

    //Handlebars helpers
    Handlebars.registerHelper('category', function(value, lookup) {
        return markercategories[value] ? markercategories[value][lookup] : '';
    });

    //TEMPLATES
    var dropdown_template = Handlebars.compile($("#dropdown_template").html());
    var itemdetail_template = Handlebars.compile($("#itemdetail_template").html());


    function createMap() {
        map = L.map('map', {maxZoom: 17}).setView([60.394, 5.32], 13);

        var mapaccesstoken = 'pk.eyJ1IjoiYnRubyIsImEiOiJHSUNPeVlJIn0.JjbTMRz8e_wBGamJXDMTmw';
        var mapboxTiles = L.tileLayer('https://{s}.tiles.mapbox.com/v4/btno.i6dp7ib3/{z}/{x}/{y}.png?access_token=' + mapaccesstoken, {
            attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
        });
        mapboxTiles.addTo(map);

        if (mobile) {
            maputils.disableMap(map)
        }

        map.scrollWheelZoom.disable();

        $('#mapcontainer').on('click', '.activatebutton', function(e) {
            maputils.enableMap(map)
            $('.activatebutton').hide();
        })

    }

    function createDropdown(items) {
        var dditems = _.clone(items);
        dditems.unshift({ id: null, restaurantnavn: ' --- Velg restaurant ---' })
        $('#dropdowncontainer').html(dropdown_template({
            items: dditems
        }));
        $("#dropdowncontainer").change(function() {
            showItem($('#dropdowncontainer option:selected').val(), 'select_in_dropdown');
        });



    }

    function setUpGeoLocation() {

        $("#locatebtn").click(function(e) {
            e.preventDefault();
            map.locate();
            $("#locationerror").text("Søker etter din posision ...");
            pymChild.sendHeight();
            ga('send', 'event', 'daily-graphic-kart-restaurantanmeldelser-amanda-bahl-v2', 'click_geolocation');

        })
        map.on('locationfound', function(e) {
            var nearest_point = findNearestByUserPosition(e.latlng, itemdata);
            showItem(nearest_point.id);
            $("#locationerror").text("Din nærmeste anmeldte restaurant er " + nearest_point.navn);
            pymChild.sendHeight();

        });

        map.on('locationerror', function(e) {
            $("#locatebtn").attr('disabled', 'disabled')
            $("#locationerror").text("Kunne ikke finne posisjonen din, velg  restaurant i listen ");
            pymChild.sendHeight();
        });

    }

    function findNearestByUserPosition(user_position, items) {

        var distances = _.map(items, function(m) {
            return {
                id: m.id,
                navn: m.restaurantnavn,
                distance: L.latLng(m.latitude, m.longitude).distanceTo(user_position)
            }

        })

        var nearest = _.sortBy(distances, 'distance')[0]
        return nearest;
    }

    function findNearest(item, items, n) {

        var markers_without_current = _.reject(items, function(s) {
            return +s.id == +item.id;
        });

        var distances = _.map(markers_without_current, function(m) {
            return {
                id: m.id,
                navn: m.restaurantnavn,
                distance: L.latLng(m.latitude, m.longitude).distanceTo(L.latLng(item.latitude, item.longitude))
            }

        })

        var nearest = _.sortBy(_.filter(distances, function(n) { return +n.distance < 15000}), 'distance').slice(0, n)
        return nearest;
    }

    function showItem(id, track) {

        if (+id > 0) {
            var item = _.find(itemdata, function(d) {
                return +d.id == id;
            })

            var marker = markers[+id];
            console.log('%c SHOW ITEM %i', 'color: green', marker)

            //select value in dropdown if we come from map
            $("#dropdownselect").val(+id);

            //make map smaller if detail view
            if(!$("#mapcontainer").hasClass("contract")){
                    $("#mapcontainer").addClass("contract");
                    map.invalidateSize();
                 }

            //reset other selected markers
            resetMarkerStyles()
                //set current marker color and focus
            marker.setStyle({ weight: 4, radius: 10, fillOpacity: 1, color: 'black', stroke: true });
            //zoom to marker
            //map.setView(marker.getLatLng(),16,{ animate: true })
            markersgroup.zoomToShowLayer(marker)

            //find other close schools
            var nearest = findNearest(item, itemdata, 5);

            $('#item_detail').html(itemdetail_template({
                item: item,
                nearest: nearest
            }));

            //attach click events
            $(".nearest-items").on("click", "a", function() {
                var selected = $(this).data('item');
                showItem(+selected, 'click_nearest_link');
            });
            $("#locationerror").text("");

            pymChild.sendHeight();

            if (track != false) {
                ga('send', 'event', 'daily-graphic-kart-restaurantanmeldelser-amanda-bahl-v2', track, item.navn);
            }
        }

    }

    function resetMarkerStyles() {
        _.each(markers, function(m) {
            m.setStyle(m.original_style);
        })
    }

    function createMarkers() {

        markers = {}

        _.each(itemdata, function(d) {
            var color = 'rgb(255,0,129)';
            var markerstyle = {
                fillColor: color,
                color: 'grey',
                stroke: true,
                width: 1,
                fillOpacity: 0.7,
                radius: 6,
                weight: 1
            }

            var marker = L.circleMarker([d.latitude, d.longitude], markerstyle)
            marker.id = d.id;
            marker.original_style = markerstyle;
            marker.on('click', function(e) {
                showItem(d.id, 'click_map_marker');
            })
            //markers.addLayer(marker);
            markers[d.id] = marker;
            markersgroup.addLayer(marker);


/*            var faketouchmarker = L.circleMarker([d.latitude, d.longitude], {
                fillOpacity: 0.0,
                stroke: false,
                radius: 15
            })
            faketouchmarker.on('click', function(e) {
                showItem(d.id, 'click_map_marker');
            })
            faketouchmarker.addTo(map);*/

        });

        map.addLayer(markersgroup, function(){
            pymChild.sendHeight();
        });



    }

    createMap();

    gdocs.getData('http://bt-driveshaft.s3.amazonaws.com/kultur/restaurantanmeldelser_bahl.json',
        function(data) {

            itemdata = _.sortBy(data.anmeldelser, function(d) {
                return -d['antall_hjerter'];
            });

            createMarkers();
            createDropdown(itemdata);
            setUpGeoLocation();

        });

    (function(i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function() {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date();
        a = s.createElement(o),
            m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m)
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

    ga('create', 'UA-26877368-1', 'bt.no');
    ga('set', 'anonymizeIp', true);
    ga('send', 'event', 'daily-graphic-kart-restaurantanmeldelser-amanda-bahl-v2', 'load-graphic');



});
