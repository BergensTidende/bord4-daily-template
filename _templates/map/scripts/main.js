define([
    'jquery',
    'pym',
    //'leaflet',
    //'cartodb'
    ], function ($, pym ) {

        'use strict';

        try {
            var pymChild = new pym.Child();
        } catch (err) {
            console.log('No pym parent');
        }

        console.log(cartodb);

        var map = L.map('map').setView([60.4, 5.3], 12);

        var mapaccesstoken = 'pk.eyJ1IjoiYnRubyIsImEiOiJHSUNPeVlJIn0.JjbTMRz8e_wBGamJXDMTmw';
        var mapboxTiles = L.tileLayer('https://{s}.tiles.mapbox.com/v4/btno.i6dp7ib3/{z}/{x}/{y}.png?access_token=' + mapaccesstoken, {
          attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
      });

        mapboxTiles.addTo(map);

      // add the cartodb layer

      cartodb.createLayer(map, 'http://btno.cartodb.com/api/v2/viz/d0e46e46-73e6-11e4-836b-0e9d821ea90d/viz.json', 
        { legends: false })
      .addTo(map).on('done', function(layer) {
          layer.setInteraction(true);
          layer.setZIndex(2);

      }).on('error', function() {
          cartodb.log.log('some error occurred');
      });



      $('h1').click(function () {
        $(this).css('font-size', '50px');
        pymChild.sendHeight();
    });
  });