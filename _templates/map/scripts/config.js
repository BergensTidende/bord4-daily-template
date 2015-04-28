requirejs.config({
  shim: {
     cartodb: {
            exports: 'cartodb'
        },
  },
  paths: {
    main: 'main',
    pym: '../bower_components/pym.js/src/pym',
    jquery: '../bower_components/jquery/dist/jquery',
  },
  packages: [

  ]
});

// Start the main app logic.
requirejs(['main']);