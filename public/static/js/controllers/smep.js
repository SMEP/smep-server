'use strict';
angular.module('smep', [ 'chart.js'] )
    .controller('smepController', ['$scope','$http', 'Samples', '$interval' , function($scope, $http, Samples, $interval) {
        $scope.valor = 1000000;

        $scope.date = new Date();


        $scope.labels = [ ];
        $scope.consumo_mensal = [ ];
        $scope.series = [ "Constumo Total" ];

        $scope.data_lastMinutes = [];
        $scope.labels_lastMinutes = [] ;
        $scope.series_lastMinutes = [ "Consumo Instantâneo" ];

        var lastTime = 0;

        Samples.lastMinutes().success( function( data ) {
            if( data.length > 0 ) {
                var consumo = [];
                var time = [];

                for( var i = 0; i < data.length; i++ ) {
                    consumo.push( data[i].power );
                    time.push( data[i].hour + ":" + data[i].minute + ":" + data[i].second);
                }

                $scope.data_lastMinutes.push( consumo );
                $scope.labels_lastMinutes = time;

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
                    var consumo = $scope.data_lastMinutes[ 0 ];
                    var time = $scope.labels_lastMinutes;

                    for( var i = 0; i < data.length; i++ ) {
                        consumo.push( data[i].power );
                        time.push( data[i].hour + ":" + data[i].minute + ":" + data[i].second );
                    }

                    lastTime = data[ data.length - 1].received;
                }
            });
        };

        $interval(refreshGraph, 500);


        $interval( function() {
            Samples.getLast().success( function( data ) {
                $scope.lastPower = data.power;
                $scope.lastkWh = data.kWh;
                $scope.lastDate = new Date( data.received );
                console.log( "Last" );
                console.log( data );
            } );
        }, 200);



        var daysInMonth = function(month,year) {
            return new Date(year, month+1, 0).getDate();
        };

        /*$scope.options = {

         }*/

        var getMonthName = function( month ) {
            var months = [ 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
            return months[month - 1];
        };

    }]);