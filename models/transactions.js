'use strict';
let mongoose = require('mongoose');
let moment = require('moment');
let Schema = mongoose.Schema;

let Transactions = new Schema({
    user: { type: Schema.ObjectId, ref: 'User', required: true },
    gateway: { type: String, required: true },
    reference: { type: String, required: true },
    status: { type: String, enum: ['Approved', 'Declined'], default: 'Declined' },
    amount: { type: Number, min: 1000, max: 15000, required: true },
    payment_info: Schema.Types.Mixed,
    date_created: { type: Date, default: Date.now },
    date_modified: { type: Date, default: Date.now }
});
Transactions.virtual('datecreated').get(function(){
    return moment(this.date_created).format('MMMM Do, YYYY');
});

module.exports = mongoose.model('Transactions', Transactions);