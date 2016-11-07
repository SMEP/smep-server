'use strict';
angular.module('smep', [ 'chart.js', 'angularMoment'] )
    .controller('smepController', ['$scope','$http', 'Samples', '$interval',
        function($scope, $http, Samples, $interval) {
        $scope.valor = 1000000;

        $scope.date = new Date();


        $interval( function() {
            Samples.getLast().success( function( data ) {
                $scope.lastPower = data.power;
                $scope.lastkWh = data.kWh;
                $scope.lastDate = new Date( data.received );
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