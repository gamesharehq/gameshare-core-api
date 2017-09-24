'use strict';
let _ = require('lodash');

module.exports = {

    get_duplicate_message: function(error){

        var regex = /index\:\ (?:.*\.)?\$?(?:([_a-z0-9]*)(?:_\d*)|([_a-z0-9]*))\s*dup key/i,
        match = error.message.match(regex);

        var field = match[1] || match[2];
        return _.capitalize(field) + ' already exists';
    }
}