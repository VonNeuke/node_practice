var Movie = require('../models/movie')
var Comment = require('../models/comment')
var _ = require('underscore')

// detail page.
exports.detail = function(req, res) {
  var id = req.params.id;

  Movie.findById(id, function(err, movie) {
    if (err) {
      console.log(err)
    }

    // 查询完电影的数据后再查询评论的数据
    // 缺点：每次评论完 detail 页面都要刷新一次，故应该用异步的方法实现
    Comment
      .find({movie: id})
      // mongoose 的 populate 方法不用在页头调用 user model 就可以直接拿到 user里面的name
      .populate('from', 'name') // 把 user 表里的 name 数据取出来，加到 comments 表里
      .exec(function(err, comments) { // exec 回调方法
        res.render('detail', {
          title: '电影 详情页',
          movie: movie,
          comments: comments
        })
      })

    // res.render("detail", {
    //   title: 'imooc detail',
    //   movie: movie
    // })
  })
}

// admin new page.
exports.new = function(req, res) {
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
}

// admin update movie.
exports.update = function(req, res) {
  var id = req.params.id;

  if (id) {
    Movie.findById(id, function(err, movie) {
      res.render('admin', {
        title: 'imooc admin update page',
        movie: movie
      })
    })
  }
}

// admin post movie.
exports.save = function(req, res) {
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
}

// list page.
exports.list = function(req, res) {
  Movie.fetch(function(err, movies) {
    if (err) {
      console.log(err)
    }

    res.render("list", {
      title: 'immoc list page',
      movies: movies
    });
  })
}

// delete movie.
exports.del = function(req, res) {
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
}
