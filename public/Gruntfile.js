

module.exports = function(grunt){
    grunt.initConfig({
        jshint: {
            options:{
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            }
        },


        concat : {
            dist : {
                src : ['app/components/version/*.js',
                        'app/**/*.js'],
                dest:  'js/site.js'
                //remeber to somehow exclude test from distribution

            }
        },//concat

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
        wiredep: {
            task:{ src:'index.html',options: {
                //cwd: 'public'
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
              mainFiles:{
                'susy':'bower_components/susy/'
              },
                dest:'js/_bower.js'
                ,cssDest:'css/_bower.css'
            }
        },//bower_concat

        watch: {
            options: {
                spawn: false
            },
            scripts: {
                files: ['public/**/*.html',
                    'public/app/**/*.js',
                    'public/sass/**/*.scss'],
                tasks:['concat','sass']
            }
        }//watch

    });//initConfig

    grunt.registerTask('test',[
        'jshint',
        'karma'
    ]);



    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('dist',['bower_concat','wiredep','concat','sass']);
};//wrapper function

