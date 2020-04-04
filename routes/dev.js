'use strict'

var express = require('express');
var router = express.Router();
const {User} = require('../models/user');
const {Logs} = require('../models/log');

router.get('/users', (req, res) => {
    if(req.session.dev || req.session.slt) {
      User.find({},function(err, results) {
        res.render('dev/users', {admin:req.session.admin,dev:req.session.dev,username:req.session.username,slt:req.session.slt,users:results})
      })
    } else {
      res.redirect('/')
    }
});

router.get('/logs', (req, res) => {
  if(req.session.dev || req.session.slt) {
    Logs.find({},function(err, results) {
      res.render('dev/logs', {admin:req.session.admin,dev:req.session.dev,username:req.session.username,slt:req.session.slt,logs:results})
    })
  } else {
    res.redirect('/')
  }
});

module.exports = router;