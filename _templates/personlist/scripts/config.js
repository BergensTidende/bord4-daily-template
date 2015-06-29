requirejs.config({
  shim: {

  },
  paths: {
    main: 'main',
    pym: '../bower_components/pym.js/dist/pym',
    jquery: '../bower_components/jquery/dist/jquery',
    handlebars: '../bower_components/handlebars/handlebars',
    underscore: '../bower_components/underscore/underscore'
  },
  packages: [

  ]
});

// Start the main app logic.
requirejs(['main']);
