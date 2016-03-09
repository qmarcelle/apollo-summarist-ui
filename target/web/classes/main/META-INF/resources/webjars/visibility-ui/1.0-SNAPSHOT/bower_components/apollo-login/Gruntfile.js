'use strict';

module.exports = function(grunt){
  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        jshint: {
            options:{
                jshintrc: 'public/.jshintrc',
                reporter: require('jshint-stylish')
            }
        },


        concat : {
          options:{
            banner:
                'angular.module(\'apollo-login\',' +
                '[\'ui.router\',' +
                '\'ngResource\',' +
                '\'ngSanitize\',' +
                '\'ngAnimate\',' +
                '\'md.data.table\',' +
                '\'myApp.version\',' +
                '\'pascalprecht.translate\',' +
                '\'translationLogin\','+
                '\'apollo-login.templates\']);'
          },
            dist : {
                src : ['./app/account/**/*.js'],
                dest:  './dist/apollo-login.js'
                //remeber to somehow exclude test from distribution

            }
        },//concat

      html2js:{
        app:{
          options:{
            base:'./',
            useStrict: true,
            quoteChar: '\'',
            htmlmin:{
              collapseBooleanAttribute: true,
              collapseWhitespace: true,
              removeAttributeQuotes: true,
              removeComments: true,
              removeEmptyAttributes: true,
              removeRedundantAttributes: true,
              removeScriptTypeAttributes: true,
              removeStyleLinkTypeAttributes: true
            }
          },
          src:['./views/{,*/}*.html'],
          dest:'./app/account/templates.js',
          module:'apollo-login.templates'
        }
      },//html2js


        sass: {
            dist: {
                options:{
                    style:'expanded',
                    require: 'susy'
                },
                files :[{
                    src: 'sass/main.scss',
                    dest: 'css/style.css'
                }]
            }
        },//sass


      copy:{
        main:{
          expand:true,
          src:['app/images/*','css/*'],
          dest:'dist/'
        }
      },//copy
        wiredep: {
            task:{ src:'./index.html',options: {
                cwd: './'
            } }
        } ,//wiredep
        karma:{
            unit:{
                options:{
                    frameworks: ['jasmine'],
                  singleRun: true,
                  browsers: ['PhantomJS'],
                  files: [
                    'public/bower_components/jquery/dist/jquery.js',
                    'public/bower_components/angular/angular.js',
                    'public/bower_components/angular-loader/angular-loader.js',
                    'public/bower_components/angular-animate/angular-animate.js',
                    'public/bower_components/angular-aria/angular-aria.js',
                    'public/bower_components/angular-material/angular-material.js',
                    'public/bower_components/angular-material-data-table/dist/md-data-table.min.js',
                    'public/bower_components/angular-mocks/angular-mocks.js',
                    'public/bower_components/angular-translate/angular-translate.js',
                    'public/bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
                    'public/bower_components/angular-route/angular-route.js',
                    'public/bower_components/angular-simple-logger/dist/angular-simple-logger.js',
                    'public/bower_components/lodash/lodash.js',
                    'public/bower_components/angular-google-maps/dist/angular-google-maps.js',
                    'public/bower_components/angular-ui-router/release/angular-ui-router.js',
                    'public/bower_components/ngmap/build/scripts/ng-map.js',
                    'public/bower_components/angular-resource/angular-resource.js',
                    'public/bower_components/angular-cookies/angular-cookies.js',
                    'public/bower_components/angular-sanitize/angular-sanitize.js',
                    'public/bower_components/ng-token-auth/dist/ng-token-auth.js',
                    'public/app/app.js',
                    'public/app/**/*.js'
                    /*'public/app/components/!**!/!*.js',
                     'public/app/view*!/!**!/!*.js'*/
                  ],
                  reporters:['progress','html'],
                  htmlReporter:{
                    outputFile:'test/units.html'
                  }
                }



            }
        },//karma
        bower_concat:{
            all:{
                dest:'./dist/_bower.js'
                ,cssDest:'./css/_bower.css',
              mainFiles:{
                'susy':'/bower_components/susy/sass/_susy.scss',
                'css':'/css/style.css'
              }
            }

        },//bower_concat

        watch: {
            options: {
                spawn: false
            },
            scripts: {
                files: ['./**/*.html',
                    './app/**/*.js',
                    './sass/**/*.scss'],
                tasks:['concat','sass']
            }
        }//watch

    });//initConfig

    grunt.registerTask('test',[
        'jshint',
        'karma'
    ]);



    grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('dist',['html2js','bower_concat','wiredep','concat','sass','copy']);
};//wrapper function

