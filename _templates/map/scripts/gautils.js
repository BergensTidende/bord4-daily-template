'use strict';
define([
    'jquery'
], function($) {

    return {
        disableMap: function(themap) {
            themap.dragging.disable();
            themap.scrollWheelZoom.disable();
            themap.touchZoom.disable();
            themap.doubleClickZoom.disable();
            themap.scrollWheelZoom.disable();
            themap.boxZoom.disable();
            themap.keyboard.disable();
            console.log(themap.getContainer());
            themap.getContainer().style.cursor = 'arrow';
            if (themap.tap) themap.tap.disable();
            $('.info').addClass('hiddenmobile');
            $('.leaflet-control-zoom').hide();
            //$('.leaflet-map-pane').css('opacity', '0.5');
        },

        enableMap: function(themap) {

            themap.dragging.enable();
            themap.touchZoom.enable();
            themap.doubleClickZoom.enable();
            themap.scrollWheelZoom.enable();
            themap.boxZoom.enable();
            themap.keyboard.enable();
            themap.getContainer().style.cursor = 'grab';
            console.log("enabling");
            if (themap.tap) themap.tap.enable();
            $('.leaflet-control-zoom').show();
            $('.info').removeClass('hiddenmobile');
            //$('.leaflet-map-pane').css('opacity', '0.99');
        }
    }

});
