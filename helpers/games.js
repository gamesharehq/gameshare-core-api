let debug = require('debug')('gameshare-core-api:games-helper');
let async = require('async');
let mongoose = require('mongoose');
let stringify = require('json-stringify-safe');
let Games = require('../models/games');

function paginate(req, res, next) {
        
    let perPage = 20;
    let page = (req.params.page ? req.params.page : 1) - 1;

    let findwith = { status: 'Enabled', moderated: true };

    //if user wants only his posted games
    if(req.userId) findwith = { user: req.userId };

    //if a particular game is requested
    if(req.params.id) findwith._id = req.params.id;

    return new Promise((resolve, reject) => {
        async.parallel({

            count: (cb) => Games.count(findwith).exec(cb),
            games: (cb) => {
                Games.find(findwith)
                .populate('category', '_id name slug description')
                .populate('user', '_id email firstname lastname avatar phonenumber')
                .limit(perPage)
                .skip(perPage * page)
                .sort({ date_created: 'desc' })
                .exec(cb);
            }

        }, function(err, result){

            if(err){
                reject(err);
                return;
            }

            let data = {}; 
            data.perPage = perPage;
            data.count = result.count;
            data.currentPage = parseInt(req.params.page ? req.params.page : '1');
            data.games = result.games;

            resolve(data);
        });
            
    });
}

module.exports = paginate;