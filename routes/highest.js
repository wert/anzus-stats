'use strict'

var express = require('express');
var router = express.Router();
const {formatNumber} = require('../utils/functions');
const {setKey,setMultiKey,getKey} = require('../utils/nodeCache');

router.get('/levels', (req, res) => {
  if(getKey("levels") != false) {
    res.render('default/playerlevels', {
      players: getKey("levels"),
      total: getKey("totallevel"),
      admin: req.session.admin,
      dev: req.session.dev,
      username: req.session.username,
      slt: req.session.slt
    })
  } else {
    db.query('SELECT name,exp_total,exp_level FROM players ORDER BY exp_level DESC LIMIT 15;SELECT SUM(exp_level) AS totalLevels, SUM(exp_total) AS totalXP FROM players;', (error, result) => {
    
      var people = [];
      let i = 0;
      result[0].forEach(element => {
        i += 1;
        people.push({num:i,level: formatNumber(element.exp_level),xp: formatNumber(element.exp_total),name: element.name})
      });
  
        var totals = JSON.parse(JSON.stringify(result[1]))[0];
        totals.totalLevels = formatNumber(totals.totalLevels);
        totals.totalXP = formatNumber(totals.totalXP)

        setKey("levels",people);
        setKey("totallevel",totals)

        res.render('default/playerlevels', {
          players:people,
          total:totals,
          admin:req.session.admin,dev:req.session.dev,username:req.session.username,slt: req.session.slt
        })
    });
  }
});

module.exports = router;
  
