'use strict'

var express = require('express');
var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// const User = require('../models/user');

// router.get('/', function(req, ress, next) {
//   User.find({},function(err, res) {
//     ress.send(res)
//   })
// });
router.get('/', (req,res) => {
  var usr = (req.session.username != undefined ? req.session.username : false);
  var ad = (req.session.admin != undefined ? req.session.admin : false)
  var d = (req.session.dev != undefined ? req.session.dev : false)
  res.render('default/index', {admin:ad,dev:d,slt:false,username: usr
  })
});


router.get('/login', (req, reply) => {
    reply.render('default/login', {admin:false,dev:false,username:false})
});

router.get('/logout', (req, reply) => {
  if (req.session.authenticated) {
    req.session.destroy((err) => {
      if (err) {
        reply.send({"code":500,"message":err});
      } else {
        reply.redirect('/')
      }
    })
  } else {
    reply.redirect('/')
  }
});


module.exports = router;
