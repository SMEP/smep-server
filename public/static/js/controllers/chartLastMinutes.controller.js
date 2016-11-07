'use strict';
angular.module('smep')
    .controller('ChartLastMinutesCtrl', ['$scope','$http', 'Samples', '$interval', 'moment',
        function($scope, $http, Samples, $interval, moment) {

        var date = new Date();
        date.setMinutes( date.getMinutes() - 5 );


        $scope.data = [ [] ];
        $scope.labels = [] ;
        $scope.series = [ "Consumo Instantâneo" ];

        // Init Data
       /* for( var i = 0; i < 100; i++) {
            $scope.data[0].push( 0 );
            var d = moment().hour( date.getHours() ).minute(date.getMinutes()).second( date.getSeconds() );
            $scope.labels.push( d );
            date.setSeconds( date.getSeconds() - 3 );
        }*/


        var lastTime = 0;

        $scope.options = {
            animation: 0,
            scales: {
                yAxes: [{
                    type: 'linear',
                    ticks: {
                        min: 0,
                        max: 5000
                    }
                }],
                xAxes: [{
                    type: 'time',
                    time: {
                        displayFormats: {
                            minute: 'h:mm:ss a'
                        }
                    }
                }]
            }
        };


        Samples.lastMinutes().success( function( data ) {
            if( data.length > 0 ) {
                var consumo = $scope.data[0];
                var time = $scope.labels;

                for( var i = 0; i < data.length; i++ ) {
                    consumo.push( data[i].power );
                    var d = moment().hour( data[i].hour ).minute( data[i].minute ).second( data[i].second );
                    time.push(  d );
                }

                $scope.data.push( consumo );
                $scope.labels = time;

                lastTime = data[ data.length - 1].received;

            }
        } );




        var refreshGraph = function() {
            var reqDate = lastTime;
            if( reqDate == 0 ) {
                reqDate = new Date();
                reqDate.setMinutes( reqDate.getMinutes() - 5);
            }
            Samples.getAllAfter(lastTime).success( function(data) {
                if( data.length > 0 ) {
                    var consumo = $scope.data[ 0 ];
                    var time = $scope.labels;

                    for( var i = 0; i < data.length; i++ ) {
                        consumo.shift();
                        time.shift();
                        consumo.push( data[i].power );
                        var d = moment().hour( data[i].hour ).minute( data[i].minute ).second( data[i].second );
                        time.push( d );
                    }


                    lastTime = data[ data.length - 1].received;
                }
            });
        };

        $interval(refreshGraph, 500);

    }
]);