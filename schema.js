// const Joi = require('joi');
// //const review = require('./model/review');


// module.exports.ratingSchema = Joi.object({
//     review: Joi.object.required({
//         rating: Joi.number().required().min(1).max(5),
//         comment: Joi.string().required()
//     })
// })


// schemas.js
const Joi = require('joi');

module.exports.ratingSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required()
  }).required()
});