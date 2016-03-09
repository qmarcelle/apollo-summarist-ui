module.exports = function(config){
    config.set({

        basePath : 'public),

      frameworks: ['jasmine'],

        files : [
          'bower_components/angular/angular.js',
          '../bower_components/angular-route/angular-route.js',
          '../bower_components/angular-mocks/angular-mocks.js',
          '../app/**/*.js'
        ],

        autoWatch : false,



        browsers : ['PhantomJS'],

        plugins : [
            /*'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'*/
        ]

        /*junitReporter : {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        }*/

    });
};
