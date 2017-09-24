'use strict';
let mongoose = require('mongoose');
let moment = require('moment');
let Schema = mongoose.Schema;

let Game = new Schema({
    title: { type: String, required: true },
    release_year: { type: Date, required: true },
    category: { type: Schema.ObjectId, ref: 'Category', required: true },
    user: { type: Schema.ObjectId, ref: 'User', required: true },
    image: [{ type: String, required: true }],
    video: { type: String },
    description: { type: String },
    date_created: { type: Date, default: Date.now},
    date_modified: { type: Date, default: Date.now}
});
Game.pre('update', function() {
  this.update({},{ $set: { date_modified: Date.now } });
});
Game.virtual('datecreated').get(function(){
    return moment(this.date_created).format('MMMM Do, YYYY');
});

module.exports = mongoose.model('Game', Game);