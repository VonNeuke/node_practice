var Movie = require('../models/movie')
var User = require('../models/user')
var _ = require('underscore')

module.exports = function(app) {
  // pre handle user
  app.use(function(req, res, next) {      
    var _user = req.session.user || false
    if(_user) {
      app.locals.user = _user
    }
    return next()
  })

  // index page
  app.get('/', function(req, res) {
    console.log('user in session:')
    console.log(req.session.user)

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

  // /user/signup/:userId  var userid = req.params.userid
  // /user/signup/111?userid=112  var userid = req.query.userid
  // 表单提交      var userid = req.body.userid

  // /user/signup/111?userid=1112
  // {userid: 113}
  //  req.param('userid') 先拿 111，没找到就拿 1112 ，，没找到就拿 113



  // signup --------------
  app.post('/user/signup', function(req, res) {
    var _user = req.body.user
    // req.params('user') 也能拿到 user 信息
    // console.log(_user)
    var user = new User(_user)

    User.findOne({name: _user.name}, function(err, user) {
      if(err) console.log(err)
      if(user) return res.redirect('/') //如果用户名重复

      user.save(function(err, user) {
        if(err) console.log(err)
        // console.log(user)
        res.redirect('/admin/userlist')
      })
    })
  })

  // user list page
  app.get('/admin/userlist', function(req, res) {
    User.fetch(function(err, users) {
      if (err) {
        console.log(err)
      }

      res.render("userlist", {
        title: 'immoc 用户列表页',
        users: users
      });
    })
  })

  // signin ----------------
  app.post('/user/signin', function(req, res) {
    var _user = req.body.user
    var name =  _user.name
    var password = _user.password

    User.findOne({name: name}, function(err, user) {
      if(err) console.log(errr)
      console.log(user)
      if(!user) {
        console.log('用户不存在')
        return res.redirect('/')
      }

      user.comparePassword(password, function(err, isMatch) {
        if(err) console.log(err)
        if (isMatch) {
          req.session.user = user

          console.log('登录成功')
          return res.redirect('/')
        } else {
          console.log('密码错误')
        }
      })
    })
  })

  // logout --------
  app.get('/logout', function(req, res) {
    delete req.session.user
    delete app.locals.user
    res.redirect('/')
  })
}