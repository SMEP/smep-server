angular.module('samplesService', [])
    .factory( 'Samples', [ '$http', function( $http) {
        var host = 'http://localhost:8080';

        return {
            get : function( id ) {
                return $http.get( host + '/samples/' + id);
            },
            lastMinutes : function() {
                return $http.get( host + '/stats/lastMinutes');
            },
            lastSeconds : function() {
                return $http.get( host + '/stats/lastSeconds');
            },
            getLast : function() {
                return $http.get( host + '/stats/last');
            },
            getAllAfter : function( lastTime ) {
                return $http.get( host + '/stats/allAfter/' + lastTime);
            },
            getPeriodicData : function( period ) {
                return $http.get( host + '/stats/periodic/' + period );
            }


        }
    }]);
