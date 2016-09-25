var express = require('express')
var port = process.env.PORT || 3000 // PROCESS 是全局变量
var _ = require('underscore')

var mongoose = require('mongoose')
var Movie = require('./models/movie')

var path = require('path')
var app = express()
var open = require('open')
var serveStatic = require('serve-static')
var bodyParser = require('body-parser')

mongoose.connect('mongodb://localhost/imooc')

app.set('views',path.join(__dirname,'./views/pages')) // 设备视图根目录
app.set('view engine', 'jade')
app.use(serveStatic('bower_components'))
app.use(bodyParser.urlencoded()) // 格式化提交表单的数据
app.listen(port)

console.log('imooc started on port' + port)

app.get('/', function(req, res) {
	Movie.fetch(function(err, movies) {
		if(err) {
			console.log(err)
		}

		res.render('index', {
			title: 'imooc 首页',
			movies: moives,
		})
	})
})

//detail page
app.get('/movie/:id', function(req, res) {
	var id = req.params.id

	Movie.findById(id, function(err, movie) {
		res.render('detail', {
			title: 'imooc' + movie.title,
			movie: movie,
		})
	})
})

//admin page
app.get('/admin/movie', function(req, res) {
	res.render('admin', {
		title: 'imooc 后台录入页',
		movie: {
			title: '',
			doctor: '',
			country: '',
			year: '',
			poster: '',
			flash: '',
			summary: '',
			language: ''
		}
	})
})

// admin update movie
app.get('/admin/update/:id', function(req, res) {
	var id = req.params.id

	if(id) {
		Movie.findById(id, function(err, movie) {
			if(err) console.log(err)
			res.render('admin', {
				title: 'imooc 后台更新页',
				movie: movie,
			})
		})
	}
})

// admin post movie
app.post('/admin/movie/new', function(req, res) {
	var id = req.body.movie._id
	var movieObj = req.body.movie
	var _movie

	if(id !== 'underfined') {
		Movie.findById(id, function(err, movie) {
			if(err) {
				console.log(err)
			}

			// _movie = Object.assign(movie. movieObj)
			_movie = _.extend(movie, movieObj)
			_movie.save(function(err, movie) {
				if(err) {
					console.log(err)
				}

				res.redirect('/movie/' + movie._id)
			})
		})

	} else {
		_movie = new Movie({
			doctor: movieObj.doctor,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash,
		})

		_movie.save(function(err, movie) {
			if(err) {
				console.log(err)
			}

			res.redirect('/movie/' + movie._id)
		})
	}
})

//list page
app.get('/admin/list', function(req, res) {
	Movie.fetch(function(err, movies) {
		if(err) {
			console.log(err)
		}

		res.render('list', {
			title: 'imooc 列表页',
			movies: moives,
		})
	})
})



open('http://127.0.0.1:3000')
