'use strict';
var Samples = require('./models/samples');


module.exports = function( app ) {
    app.post('/sample', function(req, res) {
        var power = req.body.power;
        var interval = req.body.interval;
        var fracHour = interval / 3600;
        var voltage = req.body.voltage;
        var offset = req.body.offset;
        var sample = req.body.sample;


        var kWh = power * fracHour;


        var date = new Date();
        //date.setMinutes( date.getMinutes() - date.getTimezoneOffset() ); // Timezone

        Samples.create( {
            power       : power,
            interval    : interval,
            kWh         : kWh,
            voltage     : voltage,
            offset      : offset,
            sample      : sample,
            received    : date
        }, function(err, sample) {
            if(err) {
                console.log(err);
            }
        });

        console.log(req.body);

        res.send('ok');
    });


    app.get('/stats/periodic/:type', function(req, res) {
        var type = req.params.type;
        var d = new Date();

        var date = { day : d.getDate(), month : d.getMonth()+1, year : d.getFullYear() };




        switch(type) {
            case 'year':
                var query = [
                                { $project : { kWh : 1, month : { $month : "$received" }, year : { $year : "$received" } } },
                                { $match : {  year : date.year } },
                                { $group : { _id : "$month", total : { $sum : "$kWh" } } },
                                { $sort : { _id : 1 } } // ASC
                            ];
                break;

            case 'month':
                var query = [
                                { $project : { kWh : 1, day : { $dayOfMonth : "$received" }, month : { $month : "$received" }, year : { $year : "$received" } } },
                                { $match : {  month : date.month,  year : date.year } }, // getMonth returns [0, 11]
                                { $group : { _id : "$day", total : { $sum : "$kWh" } } },
                                { $sort : { _id : 1 } } // ASC
                             ];
                break;

            case 'day':
            default:
                var query = [
                    { $project : { kWh : 1, hour : { $hour : "$received" }, day : { $dayOfMonth : "$received" }, month : { $month : "$received" }, year : { $year : "$received" } } },
                    { $match : { day : date.day, month : date.month,  year : date.year } },
                    { $group : { _id : "$hour", total : { $sum : "$kWh" } } },
                    { $sort : { _id : 1 } } // ASC
                ];
        }

        Samples.aggregate( query, function(err, result) {
            if( err ) {
                console.log( err );
                res.send(err);
            } else {
                res.json( result );
            }


        })

    });


    app.get( '/stats/month', function(req, res) {
        var date = new Date();
       Samples.aggregate(
           [
               { $project : { kWh : 1, day : { $dayOfMonth : "$received" }, month : { $month : "$received" }, year : { $year : "$received" } } },
               { $match : { month : date.getMonth() + 1, year : date.getFullYear() }},
               { $group : { _id : null, total : { $sum : "$kWh"} } }
           ],
           function( err, result ) {
               res.json( result );
           }
       )
    });

    app.get( '/stats/day', function(req, res) {
        var date = new Date();

        Samples.aggregate(
            [
                { $project : { kWh : 1, day : { $dayOfMonth : "$received" }, month : { $month : "$received" }, year : { $year : "$received" } } },
                { $match :  { day : date.getDate(), month : date.getMonth() + 1, year : date.getFullYear() }},
                { $group : { _id : null, total : { $sum : "$kWh"} } }
            ],
            function( err, result ) {
                res.json( result );
            }
        );
    });

    app.get( '/stats/lastMinutes', function(req, res) {
        var date = new Date();
        date.setMinutes( date.getMinutes() - 5);
        Samples.aggregate(
            [
                { $project : { power : 1, received : 1, hour : { $hour : "$received"}, minute : { $minute : "$received"}, second : { $second : "$received"} } },
                { $match :  { "received" : { $gt : date} } },
                //{ $group : { _id : { "hour" : "$hour", "minute" : "$minute", "second" : "$second" }, total : { $sum : "$power" } } },
                { $sort : {  received : 1} }
            ],
            function( err, result ) {
                if( err ) res.send(err);
                res.json( result );
            }
        );
    });

    app.get( '/stats/lastSeconds', function(req, res) {
        var date = new Date();
        console.log(date);
        date.setSeconds( date.getSeconds() - 10);
        console.log(date);
        Samples.aggregate(
            [
                { $project : { power : 1, received : 1, hour : { $hour : "$received"}, minute : { $minute : "$received"}, second : { $second : "$received"} } },
                { $match :  { "received" : { $gte : date} } },
                //{ $group : { _id : { "hour" : "$hour", "minute" : "$minute", "second" : "$second" }, total : { $sum : "$power" } } },
                { $sort : {  received : 1} }
            ],
            function( err, result ) {
                res.json( result );
            }
        );
    });

    app.get( '/stats/allAfter/:date', function(req, res) {
        var date = new Date(req.params.date);

        Samples.aggregate(
            [
                { $project : { power : 1, received : 1, hour : { $hour : "$received"}, minute : { $minute : "$received"}, second : { $second : "$received"} } },
                { $match :  { "received" : { $gt : date} } },
                //{ $group : { _id : { "hour" : "$hour", "minute" : "$minute", "second" : "$second" }, total : { $sum : "$power" } } },
                { $sort : {  received : 1} }
            ],
            function( err, result ) {
                res.json( result );
            }
        );
    });

    app.get( '/stats/last', function( req, res) {
        Samples.findOne().sort( { received : -1 } ).exec( function( err, sample ) {
            res.send( sample );
        } );
    });

    app.all( '/*', function(req, res) {
        var path = require('path');
        res.sendFile( path.resolve( __dirname + '/../public/index.html' ) );
    })
};