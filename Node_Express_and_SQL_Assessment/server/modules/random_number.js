var express = require('express');
var router = express.Router();

var equation = function randomNumber(min, max){
  return Math.floor(Math.random() * (1 + max - min) + min);
};

router.post('/', function(req, res) {
  console.log('body', req.body);
  var integer = equation(1, 100);
  res.send(integer.toString());
});

module.exports = router;
