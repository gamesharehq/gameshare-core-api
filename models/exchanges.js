'use strict';
let mongoose = require('mongoose');
let moment = require('moment');
let Schema = mongoose.Schema;

let Exchanges = new Schema({
    user: { type: Schema.ObjectId, ref: 'User', required: true },
    game: { type: Schema.ObjectId, ref: 'Games', required: true },
    exchange_with: { type: Schema.ObjectId, ref: 'Games', required: true },
    exchange_status: { type: String, enum: ['Pending', 'Approved', 'Declined'], default: 'Declined' },
    additional_info: Schema.Types.Mixed,
    date_created: { type: Date, default: Date.now },
    date_modified: { type: Date, default: Date.now }
});
Exchanges.virtual('datecreated').get(function(){
    return moment(this.date_created).format('MMMM Do, YYYY');
});

module.exports = mongoose.model('Exchanges', Exchanges);