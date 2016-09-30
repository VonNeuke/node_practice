// /user/signup/:userId  var userid = req.params.userid
// /user/signup/111?userid=112  var userid = req.query.userid
// 表单提交      var userid = req.body.userid

// /user/signup/111?userid=1112
// {userid: 113}
//  req.param('userid') 先拿 111，没找到就拿 1112 ，，没找到就拿 113
var User = require('../models/user')


// signup --------------
exports.signup =  function(req, res) {
  var _user = req.body.user
  // req.params('user') 也能拿到 user 信息
  // console.log(_user)
  // var user = new User(_user)

  User.findOne({name: _user.name}, function(err, user) {
    if(err) console.log(err)
    if(user){
      return res.redirect('/') //如果用户名重复
    } else {
      var user = new User(_user)
      user.save(function(err, user) {
        if(err) console.log(err)
        // console.log(user)
        res.redirect('/admin/userlist')
      })
    }
  })
}

// user list page
exports.list =  function(req, res) {
  User.fetch(function(err, users) {
    if (err) {
      console.log(err)
    }

    res.render("userlist", {
      title: 'immoc 用户列表页',
      users: users
    });
  })
}

// signin ----------------
exports.signin = function(req, res) {
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
}

// logout --------
exports.logout =  function(req, res) {
  delete req.session.user
  // delete app.locals.user
  res.redirect('/')
}
