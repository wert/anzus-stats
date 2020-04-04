const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const logSchem = new Schema(
  {
    user: {type: String,required: true,minlength: 5,maxlength: 50},
    action: {type: String,required: true,minlength: 5,maxlength: 1024},
    ip: {type: String,required: true,minlength: 1,maxlength: 1024},
    info: {type: String,required: false,minlength: 5,maxlength: 1024}
  }
);

module.exports.Logs = mongoose.model('Logs', logSchem);