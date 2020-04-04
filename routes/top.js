'use strict'

var express = require('express');
var router = express.Router();

const {formatNumber,prettyMoney} = require('../utils/functions');
const {setKey,setMultiKey,getKey} = require('../utils/nodeCache');

router.get('/players', (req, reply) => {
  if(getKey("players") != false) {
    console.log("cache")
    reply.render('default/richplayers', {
      players: getKey("players"),
      total: getKey("total"),
      admin: req.session.admin,
      dev: req.session.dev,
      username: req.session.username
    })
  } else {
    db.query(`
          SELECT
            p.pid,
            p.name,
            p.cash,
            p.bankacc,
            p.cash + p.bankacc AS playerTotal,
            SUM(((SELECT CAST(price AS INT) FROM vconf WHERE classname = v.classname)))+p.bankacc+p.cash AS netWorth
          FROM
              players AS p
          INNER JOIN
              vehicles AS v ON p.pid = v.pid
          GROUP BY
              p.pid,
              p.name,
              p.cash,
              p.bankacc
          ORDER BY
              netWorth
          DESC LIMIT 15;SELECT COUNT(*) AS totalCharacterCount, SUM(bankacc) AS totalPlayerBank, SUM(cash) AS totalPlayerCash FROM players;`, (error, result) => {
      console.log(error)

      
      var people = [];
      let i = 0;
      try {
        result[0].forEach(element => {
          i += 1;
          people.push({
            num: i,
            bankacc: prettyMoney(element.bankacc),
            cash: prettyMoney(element.cash),
            name: element.name,
            networth: prettyMoney(element.netWorth)
          });
        });
      } catch (error) {
        people = result[0];
      }

      var totals = JSON.parse(JSON.stringify(result[1]))[0];
      totals.eco = prettyMoney(totals.totalPlayerCash + totals.totalPlayerBank)
      totals.totalPlayerBank = prettyMoney(totals.totalPlayerBank)
      totals.totalPlayerCash = prettyMoney(totals.totalPlayerCash)

      setKey("players",people);
      setKey("total",totals)

      reply.render('default/richplayers', {
        players: people,
        total: totals,
        admin: req.session.admin,
        dev: req.session.dev,
	slt: req.session.slt,
        username: req.session.username
      })
    });
  };
});

router.get('/gangs', (req, res) => {
  if(getKey("gangs") != false) {
    res.render('default/richgangs', {
      gang: getKey("gangs"),
      total: getKey("gangtotal"),
      admin: req.session.admin,
      dev: req.session.dev,
      username: req.session.username
    })
  } else {
    db.query('SELECT name AS gangName, bank AS gangBank FROM gangs ORDER BY gangBank DESC LIMIT 10;SELECT COUNT(*) AS totalGangCount,SUM(bank) AS totalGangBank FROM gangs;', (error, result) => {

      var gangs = [];
      let i = 0;
      try {
        result[0].forEach(element => {
          i += 1;
          gangs.push({
            num: i,
            bank: prettyMoney(element.gangBank),
            name: element.gangName
          })
        });
      } catch (error) {
        gangs = result[0];
      };

      var totals = JSON.parse(JSON.stringify(result[1]))[0];
      totals.totalGangBank = prettyMoney(totals.totalGangBank);
      totals.gangs = formatNumber(totals.totalGangCount)

      setKey("gangs",gangs);
      setKey("gangtotal",totals)

      res.render('default/richgangs', {
        gang: gangs,
        total: totals,
        admin: req.session.admin,
        dev: req.session.dev,
        slt: req.session.slt,
        username: req.session.username
      })
    });
  };
});

module.exports = router;
