var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

// PÁG views/author.ejs  
router.get('/author', function (req,res) {
	res.render('author', { autor: 'Juan C. Martinez' });
});

/*
// PÁG buscar preguntas
router.get('/buscar', function (req,res) {
	res.render('buscar', { autor: 'Juan C. Martinez' });
});
*/

// Autoload de comandos con :quizId
router.param('quizId', quizController.load);  // autoload :quizId

// Definición de rutas de /quizes
router.get('/quizes',                      quizController.index);
router.get('/quizes/:quizId(\\d+)',        quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);

module.exports = router;
