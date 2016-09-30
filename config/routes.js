var Index = require('../app/controllers/index')
var User = require('../app/controllers/user')
var Movie = require('../app/controllers/movie')

module.exports = function(app) {
  // pre handle user
  app.use(function(req, res, next) {
    var _user = req.session.user
    app.locals.user = _user
    next()
  })

  // index page
  app.get('/', Index.index)

  // signup
  app.post('/user/signup', User.signup)
  // signin
  app.post('/user/signin', User.signin)

  app.get('/signin', User.showSignin)
  app.get('/signup', User.showSignup)

  // logout
  app.get('/logout', User.logout)
  // userlist page
  app.get('/admin/userlist', User.list)

  // detail page
  app.get('/movie/:id', Movie.detail)
  // admin new page
  app.get('/admin/new', Movie.new)
  // admin update page
  app.get('/admin/update/:id', Movie.update)
  // save  movie
  app.post('/admin/list', Movie.save)
  // admin list page
  app.get('/admin/list', Movie.list)
  // delete movie
  app.delete('/admin/list', Movie.del)
}
