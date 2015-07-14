var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Shoot for the Stars' });
});

router.get('/about', function(req, res, next) {
	res.render('about', { title: 'About Us' });
})

module.exports = router;
