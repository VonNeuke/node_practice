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

app.set('views', path.join(__dirname, './views/pages')) // 设备视图根目录
app.set('view engine', 'jade')
app.use(serveStatic('public'))
app.locals.moment = require('moment')
app.use(bodyParser.urlencoded()) // 格式化提交表单的数据
app.listen(port)

console.log('imooc started on port' + port)

// index page
app.get('/', function(req, res) {
  Movie.fetch(function(err, movies) {
    if (err) {
      console.log(err)
    }

    res.render("index", {
      title: 'immoc home page',
      movies: movies
    });
  })

})

// detail page
app.get('/movie/:id', function(req, res) {
  var id = req.params.id;

  Movie.findById(id, function(err, movie) {
    if (err) {
      console.log(err)
    }
    res.render("detail", {
      title: 'imooc detail',
      movie: movie
    })
  })
})

// admin page
app.get('/admin/new', function(req, res) {
  res.render("admin", {
    title: 'immoc admin page',
    movie: {
      director: '',
      country: '',
      title: '',
      year: '',
      poster: '',
      lang: '',
      flash: '',
      summary: ''
    }
  })
})

// admin update movie
app.get('/admin/update/:id', function(req, res) {
    var id = req.params.id;

    if (id) {
      Movie.findById(id, function(err, movie) {
        res.render('admin', {
          title: 'imooc admin update page',
          movie: movie
        })
      })
    }
  })
  // admin post movie
app.post('/admin/movie/new', function(req, res) {
  var id = req.body.movie._id
  var movieObj = req.body.movie
  var _movie
  if (id !== 'undefined') {
    Movie.findById(id, function(err, movie) {
      if (err) {
        console.log(err)
      }

      _movie = _.extend(movie, movieObj)
      _movie.save(function(err, movie) {
        if (err) {
          console.log(err)
        }

        res.redirect('/movie/' + movie._id)
      })
    })
  } else {
    _movie = new Movie({
      director: movieObj.director,
      title: movieObj.title,
      country: movieObj.country,
      language: movieObj.language,
      year: movieObj.year,
      poster: movieObj.poster,
      summary: movieObj.summary,
      flash: movieObj.flash,
    })
    _movie.save(function(err, movie) {
      if (err) {
        console.log(err)
      }

      res.redirect('/movie/' + movie._id)
    })
  }
})

// index page
app.get('/admin/list', function(req, res) {
  Movie.fetch(function(err, movies) {
    if (err) {
      console.log(err)
    }

    res.render("list", {
      title: 'immoc list page',
      movies: movies
    });
  })

})

app.delete('/admin/list', function(req, res) {

  var id = req.query.id

  if (id) {
    Movie.remove(id, function(err, movie) {
      if (err) {
        console.log(err)
      } else {
        res.json({
          success: 1
        })
      }
    })
  }
})
