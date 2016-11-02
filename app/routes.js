var Samples = require('./models/samples');

module.exports = function( app ) {
    app.post('/sample', function(req, res) {
        var power = req.body.power / 1000; // W -> kW
        var interval = req.body.interval;
        var fracHour = interval / 3600;
        var voltage = req.body.voltage;
        var offset = req.body.offset;
        var sample = req.body.sample;


        var kWh = power * fracHour;

        Samples.create( {
            power       : power,
            interval    : interval,
            kWh         : kWh,
            voltage     : voltage,
            offset      : offset,
            sample      : sample,
            received    : new Date()
        }, function(err, sample) {
            if(err) {
                console.log(err);
            }
        });

        console.log(req.body);

        res.send('ok');
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