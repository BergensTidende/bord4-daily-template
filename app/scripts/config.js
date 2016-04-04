requirejs.config({
  shim: {
     cartodb: {
            exports: 'cartodb'
        },
     geojson: {
            exports: 'geojson'
        },
  },
  paths: {
    main: 'main',
    maputils: 'maputils',
    geojson: 'geojson',
    pym: '../bower_components/pym.js/dist/pym',
    jquery: '../bower_components/jquery/dist/jquery',
    underscore: '../bower_components/underscore/underscore',
    handlebars: '../bower_components/handlebars/handlebars'
  },
  packages: [

  ]
});

// Start the main app logic.
requirejs(['main']);
