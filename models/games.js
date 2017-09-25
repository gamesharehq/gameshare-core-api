'use strict';
let mongoose = require('mongoose');
let moment = require('moment');
let Schema = mongoose.Schema;

let Games = new Schema({
    title: { type: String, required: true, trim: true },
    release_year: { type: Number, required: true },
    category: { type: Schema.ObjectId, ref: 'Category', required: true },
    user: { type: Schema.ObjectId, ref: 'User', required: true },
    image: [{ type: String, required: true }],
    video: { type: String },
    description: { type: String },
    status: { type: String, enum: ['Enabled', 'Disabled'], default: 'Enabled'},
    moderated: { type: Boolean, enum: [true, false], default: false },
    mode: { type: String, enum: ['Sell', 'Exchange'], default: 'Exchange'},
    price: { type: Number, min: 1000, max: 15000 },
    date_created: { type: Date, default: Date.now},
    date_modified: { type: Date, default: Date.now}
});
Games.pre('update', function() {
  this.update({},{ $set: { date_modified: Date.now } });
});
Games.virtual('datecreated').get(function(){
    return moment(this.date_created).format('MMMM Do, YYYY');
});

module.exports = mongoose.model('Games', Games);