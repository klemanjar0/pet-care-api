var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Pet Care API' });
});


/*
router.get('/test', function(req, res, next) {
  res.render('/views/index.hbs', { title: 'Pet Care API Users' });
});

 */
module.exports = router;
