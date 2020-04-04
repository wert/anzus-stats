const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;

const userSchem = new Schema(
  {
    username: {type: String,required: true,minlength: 5,maxlength: 50},
    password: {type: String,required: true,minlength: 5,maxlength: 1024},
    dev: {type: Boolean,default: false},
    slt: {type: Boolean,default: false},
    admin: {type: Boolean,default: true},
  }
);

function validateUser(user) {
  const schema = {
      username: Joi.string().min(5).max(50).required(),
      password: Joi.string().min(5).max(255).required(),
  };
  return Joi.validate(user, schema);
}


module.exports.User = mongoose.model('User', userSchem);
module.exports.validate = validateUser;