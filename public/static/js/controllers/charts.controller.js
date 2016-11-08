'use strict';
angular.module('smep')
    .controller('chartsController', ['$scope','$http', 'Samples', '$interval', 'moment',
        function($scope, $http, Samples, $interval, moment) {
            $scope.date = new Date();

            // Daily
            $scope.day_data = [ [] ];
            $scope.day_labels = [] ;
            $scope.day_series = [ "Consumo Diário" ];

            $scope.day_options = {
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
                            unit: 'hour'
                        }
                    }]
                }
            };;



            Samples.getPeriodicData( 'day' ).success(function(data) {

                if( data.length ) {
                    var month = $scope.date.getMonth();
                    var date = $scope.date.getDate();

                    var cons = $scope.day_data[0];
                    var labels = $scope.day_labels;

                    for(var i = 0; i < data.length; i++) {
                        var d = moment().hour( data[i]._id ).month( month ).date( date );
                        cons.push( data[i].total );
                        labels.push(d);
                    }
                }
            });


            //Monthly
            $scope.month_data = [ [] ];
            $scope.month_labels = [] ;
            $scope.month_series = [ "Consumo Mensal" ];


            $scope.month_options = {
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
                            unit: 'day'
                        }
                    }]
                }
            };


            Samples.getPeriodicData( 'month' ).success(function(data) {

               if( data.length ) {
                   var month = $scope.date.getMonth();

                   var cons = $scope.month_data[0];
                   var labels = $scope.month_labels;

                   for(var i = 0; i < data.length; i++) {
                       var d = moment().date( data[i]._id ).month( month );
                       cons.push( data[i].total );
                       labels.push(d);
                   }
               }
            });


            // Yearly
            $scope.year_data = [ [] ];
            $scope.year_labels = [] ;
            $scope.year_series = [ "Consumo Anual" ];

            $scope.year_options = {
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
                            unit: 'month'
                        }
                    }]
                }
            };;



            Samples.getPeriodicData( 'year' ).success(function(data) {

                if( data.length ) {
                    var year = $scope.date.getFullYear();

                    var cons = $scope.year_data[0];
                    var labels = $scope.year_labels;

                    for(var i = 0; i < data.length; i++) {
                        var d = moment().month( data[i]._id ).year( year );
                        cons.push( data[i].total );
                        labels.push(d);
                    }
                }
            });

        }]);