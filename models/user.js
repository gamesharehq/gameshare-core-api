'use strict';
var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;
var User = new Schema({
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    phonenumber: { type: String, trim: true },
    address: { type: String, trim: true },
    status: {type: String, enum: ['Enabled', 'Disabled'], default: 'Enabled' },
    avatar: { type: String, trim: true },
    reset_password: { type: Number, default: 0 },
    is_admin: { type: Boolean, default: false },
    date_created: { type: Date, default: Date.now },
    date_modified: { type: Date, default: Date.now }
});

User.pre('update', function() {
  this.update({},{ $set: { date_modified: Date.now } });
});
User.virtual('fullname').get(function(){
    return this.first_name + ' ' + this.last_name;
});
User.virtual('datecreated').get(function(){
    return moment(this.date_created).format('MMMM Do, YYYY');
});

module.exports = mongoose.model('User', User);