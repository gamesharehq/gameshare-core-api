let mongoose = require('mongoose');
let moment = require('moment');
let Schema = mongoose.Schema;

let Category = new Schema({
    name: { type: String, required: true},
    slug: { type: String, unique: true},
    status: { type: String, enum: ['Enabled', 'Disabled'], default: 'Enabled'},
    description: { type: String, trim: true},
    date_created: { type: Date, default: Date.now},
    date_modified: { type: Date, default: Date.now}
});

Category.pre('update', function() {
    this.update({},{ $set: { date_modified: Date.now } });
});
Category.pre('save', function(next) {
    if(!this.slug){
        this.slug = this.name.trim().toLowerCase().split(' ').join('-');
    }
    else this.slug = this.slug.trim().toLowerCase().split(' ').join('-');
    next();
});
Category.virtual('datecreated').get(function(){
    return moment(this.date_created).format('MMMM Do, YYYY');
});

module.exports = mongoose.model('Category', Category);
