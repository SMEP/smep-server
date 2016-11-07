'use strict';
angular.
    module( 'SmepApp')
    .config([ '$locationProvider', '$routeProvider',
        function config($locationProvider, $routeProvider) {
           // $locationProvider.hashPrefix('!');
            $locationProvider.html5Mode( true );

            $routeProvider
                .when( '/', {
                    template: '<samples></samples>'
                })
                .when( '/reports', {
                    templateUrl: 'static/js/templates/reports.template.html'
                })
                .otherwise( '/' );
            }

    ]);