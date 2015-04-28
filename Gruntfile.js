'use strict';

module.exports = function(grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        yeoman: {
            // configurable paths
            app: require('./project.json').appPath || 'app',
            dist: 'dist',
            server_folder: require('./project.json').server_folder || require('./project.json').name,
            app_type: require('./project.json').app_type || 'map'
        },
        bowerRequirejs: {
            all: {
                rjsConfig: 'app/scripts/config.js',
                options: {
                    exclude: ['bootstrap-sass-official', 'requirejs', 'requirejs-plugins']
                }
            }
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            js: {
                files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
                tasks: ['newer:jshint:all'],
                options: {
                    livereload: true
                }
            },
            //jsTest: {
            //    files: ['test/spec/{,*/}*.js'],
            //    tasks: ['newer:jshint:test']
            //},

            compass: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['compass:server', 'autoprefixer'],
                options: {
                    livereload: true
                }
            },

            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= yeoman.app %>/{,*/}*.html',
                    '.tmp/styles/{,*/}*.css',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: '0.0.0.0',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        '<%= yeoman.app %>'
                    ]
                }
            },
            test: {
                options: {
                    port: 9001,
                    base: [
                        '.tmp',
                        'test',
                        '<%= yeoman.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    base: '<%= yeoman.dist %>',
                    livereload: false
                }
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {

                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/{,*/}*.js',
                '!<%= yeoman.app %>/scripts/vendor/**'
            ],
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/spec/{,*/}*.js']
            },
            app: [
                '<%= yeoman.app %>/scripts/{,*/}*.js',
                '!<%= yeoman.app %>/scripts/vendor/**'
            ]
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/**/*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            templatesdestination: {
                files: [{
                    dot: true,
                    src: [
                        '<%= yeoman.app %>/scripts/**',
                        '<%= yeoman.app %>/partials/**',
                        '<%= yeoman.app %>/styles/**',
                        '<%= yeoman.app %>/views/**',
                        '<%= yeoman.app %>/index.html',
                        '<%= yeoman.app %>/README.md',
                        'bower.json'
                    ]
                }]
            },
            extrabower: {
                files: [{
                    dot: true,
                    src: [
                        '<%= yeoman.app %>/bower.json'
                    ]
                }]
            },
            server: '.tmp'
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            }
        },

        // Compiles Sass to CSS and generates necessary files if requested
        compass: {
            options: {
                sassDir: '<%= yeoman.app %>/styles',
                cssDir: '<%= yeoman.app %>/css',
                generatedImagesDir: '.tmp/images/generated',
                imagesDir: '<%= yeoman.app %>/styles/elm',
                javascriptsDir: '<%= yeoman.app %>/scripts',
                fontsDir: '<%= yeoman.app %>/fonts',
                importPath: ['<%= yeoman.app %>/bower_components'],
                httpImagesPath: '/images',
                httpGeneratedImagesPath: '/images/generated',
                httpFontsPath: 'fonts',
                relativeAssets: true,
                assetCacheBuster: false,
                debugInfo: false,
                raw: 'Sass::Script::Number.precision = 10\n'

            },
            dist: {
                options: {
                    generatedImagesDir: '<%= yeoman.dist %>/images/generated',
                    outputStyle: 'compressed',
                    environment: 'production',
                    debugInfo: false

                }
            },
            server: {
                options: {
                    debugInfo: false
                }
            }
        },

        //concat and compile all the small requirejs files to one big file
        requirejs: {
            compile: {
                options: {
                    baseUrl: "<%= yeoman.app %>/scripts",
                    mainConfigFile: "<%= yeoman.app %>/scripts/config.js",
                    name: "config", // assumes a production build using almond
                    insertRequire: ['main'],
                    out: ".tmp/concat/scripts/main.build.js",
                    optimize: "none", // do not optimize, we do that later after ngmin task
                    compress: false,
                    //enforceDefine : true,
                    /*paths: {
                          'jquery': 'http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min'
                    },
                    */
                    done: function(done, output) {
                        var duplicates = require('rjs-build-analysis').duplicates(output);

                        if (duplicates.length > 0) {
                            grunt.log.subhead('Duplicates found in requirejs build:');
                            grunt.log.warn(duplicates);
                            done(new Error('r.js built duplicate modules, please check the excludes option.'));
                        } else {
                            grunt.log.debug('No duplicates found in requirejs build');
                        }

                        done();
                    }

                }
            }
        },

        uglify: {
            dist: {
                options: {
                    mangle: false,
                    preserveComments: false,
                    compress: {
                        global_defs: {
                            DEBUG: false
                        },
                        pure_getters: true,
                        drop_console: true,
                        //pure_funcs: [ 'require' ],
                    },
                },
                src: '.tmp/concat/scripts/main.build.js',
                dest: '.tmp/concat/scripts/optimized/main_optimized.js',
            }
        },

        //replace the script tag using data-main to using minified version of require and a version build of main_optimized.js
        'regex-replace': {
            dist: {
                src: ['<%= yeoman.dist %>/index.html'],
                actions: [{
                    name: 'mainjs-newpath',
                    search: '<script data-main=".*" src="bower_components/requirejs/require.js"></script>',
                    replace: function(match) {
                        var regex = /scripts\/.*main/;
                        var result = regex.exec(match);
                        return '<script src="scripts/vendor/require.min.js" data-main="scripts/main_optimized"></script>\n';
                        //+ '<!-- build:js scripts/main_optimized.js -->\n '
                        //+ '<script src="scripts/main_optimized.js"></script>\n'
                        //+ '<!-- endbuild -->\n'
                    },
                    flags: 'g'
                }]
            }
        },


        // Renames files for browser caching purposes
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/{,*/}*.js',
                        '!<%= yeoman.dist %>/scripts/vendor/*',
                        '<%= yeoman.dist %>/css/{,*/}*.css',
                        //'<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                        '<%= yeoman.dist %>/styles/fonts/*'
                    ]
                }
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            options: {
                assetsDirs: ['<%= yeoman.dist %>']
            }
        },

        // The following *-min tasks produce minified files in the dist folder
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>',
                    src: ['*.html', 'views/{,*/}*.html'],
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '*.html',
                        //'bower_components/sass-bootstrap/*',
                        'images/{,*/}*.{webp}',
                        'data/**',
                        'scripts/vendor/**',
                    ]
                }, {
                    expand: true,
                    cwd: '.tmp/images',
                    dest: '<%= yeoman.dist %>/images',
                    src: ['generated/*']
                }, {
                    expand: true,
                    cwd: '.tmp/concat/scripts/optimized',
                    dest: '<%= yeoman.dist %>/scripts',
                    src: ['*.js']
                }]
            },
            styles: {
                expand: true,
                cwd: '<%= yeoman.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            },
            scripts: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '.tmp/scripts_for_ngmin',
                    src: [

                        'scripts/**'
                    ]
                }]
            },
            selectedtemplate: {
                files: [
                    //copy files from the selected template dir to the app dir
                    {
                        expand: true,
                        dot: true,
                        cwd: '_templates/<%= template_type %>',
                        dest: '<%= yeoman.app %>',
                        src: [

                            '!bower.*', '**'
                        ]
                    },
                    //copy bower.json from selected template dir to project root
                    {
                        expand: true,
                        dot: true,
                        cwd: '_templates/<%= template_type %>',
                        dest: '',
                        src: [

                            'bower.json'
                        ]
                    }

                ]
            },
            savetemplate: {
                files: [
                    //copy files from the selected template dir to the app dir
                        {
                            expand: true,
                            dot: true,
                            cwd: '<%= yeoman.app %>',
                            dest: '_templates/<%= template_type %>',
                            src: [

                                '**', '!**/bower_components/**', '!**/css/**', 'parent.html'
                            ]
                        }
                    ]
            },
            vanillatemplate: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '_templates/vanilla',
                    dest: '<%= yeoman.app %>',
                    src: [

                        '!bower.*', '**'
                    ]
                }, {
                    expand: true,
                    dot: true,
                    cwd: '_templates/vanilla',
                    dest: '',
                    src: [

                        'bower.json'
                    ]
                }]
            },

            cssAsScss: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/bower_components',
                    src: ['**/*.css', '!**/*.min.css'],
                    dest: '<%= yeoman.app %>/bower_components',
                    filter: 'isFile',
                    ext: ".scss"
                }]
            }
        },

        //task to check ssh connection to bttux
        sshexec: {
            test: {
                command: 'uptime',
                options: {
                    host: process.env.PROD_HOSTNAME,
                    username: process.env.PROD_USERNAME,
                    passphrase: process.env.PROD_KEY_PASS,
                    privateKey: grunt.file.read(process.env.PROD_KEY_LOCATION),
                }
            }
        },

        sftp: {
            stage: {
                files: {
                    "./": ["dist/**", "!dist/api/**", "!dist/views/**"]
                },
                options: {
                    path: process.env.STAGE_BASE_PATH + '<%= yeoman.server_folder %>/',
                    srcBasePath: "dist/", //moves the files up on level
                    host: process.env.STAGE_HOSTNAME,
                    username: process.env.STAGE_USERNAME,
                    passphrase: process.env.STAGE_KEY_PASS,
                    privateKey: grunt.file.read(process.env.STAGE_KEY_LOCATION),
                    showProgress: true,
                    createDirectories: true
                }
            },
            prod: {
                files: {
                    "./": ["dist/**", "!dist/api/**", "!dist/views/**"]
                },
                options: {
                    path: process.env.PROD_BASE_PATH + '<%= yeoman.server_folder %>/',
                    srcBasePath: "dist/", //moves the files up on level
                    host: process.env.PROD_HOSTNAME,
                    username: process.env.PROD_USERNAME,
                    passphrase: process.env.PROD_KEY_PASS,
                    privateKey: grunt.file.read(process.env.PROD_KEY_LOCATION),
                    showProgress: true,
                    createDirectories: true
                }
            },
        },

        //opens browser on the published version
        open: {
            stage: {
                path: process.env.STAGE_BASE_URL + '<%= yeoman.server_folder %>/',
                app: 'Google Chrome'
            },
            prod: {
                path: 'http://www.bt.no/spesial/<%= yeoman.server_folder %>/',
                app: 'Google Chrome'
            },
            embed: {
                path: 'http://lisatest.bt.no/daily-graphics-embedder/',
                app: 'Google Chrome'
            }
        },

        //purge cache via http post request
        http: {
            cache_purge: {
                options: {
                    url: process.env.CACHE_PURGE_URL, //process.env.CACHE_PURGE_URL,
                    method: 'POST',
                    form: {
                        url: 'http://www.bt.no/spesial/<%= yeoman.server_folder %>/'
                    },
                    callback: function(error, response, body) {
                        console.log(process.env.CACHE_PURGE_URL);
                        //return console.log(body);
                    }

                }
            }
        },

        push: {
            options: {
                files: ['package.json'],
                updateConfigs: [],
                releaseBranch: false,
                add: true,
                addFiles: ['.'], // '.' for all files except ingored files in .gitignore
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['package.json'], // '-a' for all files
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'origin',
                npm: false,
                npmTag: 'Release v%VERSION%',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
            }
        },

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
                'compass:server'
            ],
            test: [
                'compass'
            ],
            dist: [
                'compass:dist',
                'imagemin',
                'svgmin'
            ]
        },

    });

    /*
    This task should be run every time you want to work on a template.
    First write the app_type in project.json and then run grunt usetemplate
    */

    grunt.registerTask('workon', function(target) {

        grunt.config.set('template_type', target);
        grunt.task.run([
            'clean:templatesdestination',
            'copy:vanillatemplate',
            'copy:selectedtemplate',
            'clean:extrabower'

        ]);
    });

    grunt.registerTask('save', function(target) {

        grunt.config.set('template_type', target);
        console.log(target);
        grunt.task.run([
            'copy:savetemplate',
            'clean:templatesdestination'
        ]);
    });
    grunt.registerTask('serve', function(target) {
        if (target === 'dist') {
            return grunt.task.run(['connect:dist:keepalive']);
        }
        if (target === 'templates') {
            grunt.task.run(['copy:templates']);
        }
        //this is serve-command...
        grunt.task.run([
            'clean:server',
            //'bower-install',
            'concurrent:server',
            'autoprefixer',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('server', function() {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve']);
    });

    grunt.registerTask('test', [
        'clean:server',
        'concurrent:test',
        'autoprefixer',
        'connect:test',
    ]);

    grunt.registerTask('embed', [
        'open:embed'        
    ]);

    grunt.registerTask('deploy', function(target) {
        if (target === null) {
            return grunt.warn('Deploy target must be specified, like deploy:stage or deploy:prod.');
        }
        grunt.task.run('sftp:' + target);
        if (target === 'prod') {
            grunt.task.run('http:cache_purge');
        }
        grunt.task.run('open:' + target);
        //grunt.task.run('open:embed');
    });

    grunt.registerTask('build', function(target) {
        //copies config-file with relevant configs if target given.s
        //if no target, uses prod settings to avoid Lasse fuckup.
        //usage: build:dev build:stage build:prod
        console.log("Building using target", target);
        //this is serve-command...
        grunt.task.run([
            'clean:dist',
            //'bower-install',
            'useminPrepare',
            'concurrent:dist',
            'autoprefixer',
            'concat',
            'requirejs',
            'uglify',
            'copy:dist',
            'cssmin',
            'regex-replace',
            'rev',
            'usemin',
            //'htmlmin',
        ]);
    });

    grunt.registerTask('default', [
        //'newer:jshint',
        'test',
        'build'
    ]);
};
