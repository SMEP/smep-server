var mongoose = require('mongoose');

module.exports = mongoose.model('Samples', {
    power  : { type: Number, required : true },
    interval : { type: Number, required : true },
    kWh : { type: Number, required : true},
    voltage : { type: Number, required : true },
    offset : { type : Number, required : true },
    sample : { type: Number, required : true},
    received : { type: Date, required: true, default: Date.now() }
});
