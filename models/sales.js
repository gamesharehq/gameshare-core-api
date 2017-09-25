'use strict';
let mongoose = require('mongoose');
let moment = require('moment');
let Schema = mongoose.Schema;

let Sales = new Schema({
    user: { type: Schema.ObjectId, ref: 'User', required: true },
    game: { type: Schema.ObjectId, ref: 'Games', required: true },
    transaction: { type: Schema.ObjectId, ref: 'Transactions', required: true },
    price: { type: Number, min: 1000, max: 15000, required: true },
    additional_info: Schema.Types.Mixed,
    date_created: { type: Date, default: Date.now },
    date_modified: { type: Date, default: Date.now }
});
Sales.virtual('datecreated').get(function(){
    return moment(this.date_created).format('MMMM Do, YYYY');
});

module.exports = mongoose.model('Sales', Sales);