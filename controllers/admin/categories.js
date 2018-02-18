'use strict';
let debug = require('debug')('gameshare-core-api:category');
let stringify = require('json-stringify-safe');
let Category = require('../../models/category');
let util = require('../../helpers/utilities');
let _ = require('lodash');

let public_categories = require('../categories');

//Create or Update a category (category/:id?)
exports.creat_update_category = (req, res, next) => {
    
    req.checkBody('name', 'Category name is required').notEmpty();

    req.sanitizeBody('name').escape();
    req.sanitizeBody('description').escape();
    req.sanitizeBody('status').escape();

    req.getValidationResult().then((validation_result) => {

        if(!validation_result.isEmpty()){ //there is error
            
            let error = new Error(validation_result.array({ onlyFirstError: true })[0].msg);
            error.status = 400; //bad request

            debug("Encountered validation error: " + error.message);
            return next(error);
        }

        //all is fine
        let newCategory = new Category({
            name: req.body.name,
            slug: _.replace(req.body.name.toLowerCase(), ' ', '-'),
            description: req.body.description,
            status: req.body.status ? req.body.status : 'Enabled'
        });

        let callback = (err, category) => {
            if(err && err.code === 11000) {
                err.message = 'Category title already exists';
                err.status = 400;
                debug('New category could not be created: ' + err.message);
                return next(err); 
            }else if(err) return next(err);

            //all is fine - return all categories
            if(req.params.id) req.params.id = undefined;
            return public_categories.get_all_categories(req, res, next);
        };

        if(req.params.id){
            newCategory._id = req.params.id;
            Category.findByIdAndUpdate(req.params.id, newCategory, callback);

        }else newCategory.save(callback);
    });
};