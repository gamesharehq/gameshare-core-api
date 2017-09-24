'use strict';
let mongoose = require('mongoose');
let moment = require('moment');
let Schema = mongoose.Schema;

let Reviews = new Schema({
    user: { type: Schema.ObjectId, ref: 'User', required: true },
    game: { type: Schema.ObjectId, ref: 'Games', required: true },
    rating: { type: Number, min: 0, max: 5 },
    comment: { type: String },
    date_created: { type: Date, default: Date.now },
    date_modified: { type: Date, default: Date.now }
});

Reviews.virtual('datecreated').get(function(){
    return moment(this.date_created).format('MMMM Do, YYYY');
});

module.exports = mongoose.model('Reviews', Reviews);
