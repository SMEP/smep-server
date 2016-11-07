var app = angular.module('SmepApp', ['ngRoute', 'smep', 'samplesService'  ] )
    .controller('MainNavCtrl', [ '$scope', '$location', function( $scope, $location) {
        $scope.isActive = function( viewLocation) {
            return viewLocation == $location.path();
        }
    }]);
