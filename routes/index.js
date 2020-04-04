'use strict'

var express = require('express');
var router = express.Router();
const {prettyMoney} = require('../utils/functions');

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
  res.render('default/index', {admin:false,dev:false,slt:false,username: req.session.username
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
