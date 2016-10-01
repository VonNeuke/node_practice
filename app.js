var express = require('express')
var port = process.env.PORT || 3000 // PROCESS 是全局变量
var session = require('express-session')
var mongoose = require('mongoose')
var mongoStore = require('connect-mongo')(session)
var morgan = require('morgan')
// var logger = morgan('dev');

var path = require('path')
var app = express()
var open = require('open')
var serveStatic = require('serve-static')
var bodyParser = require('body-parser')

var cookieParser = require('cookie-parser')

var dbUrl = 'mongodb://localhost/imooc'
mongoose.connect(dbUrl)

app.set('views', path.join(__dirname, './app/views/pages')) // 设备视图根目录
app.set('view engine', 'jade')
app.use(serveStatic('public'))
app.locals.moment = require('moment')
app.use(bodyParser.urlencoded()) // 格式化提交表单的数据

app.listen(port)

app.use(cookieParser())
app.use(session({
  secret: 'imooc',
  store: new mongoStore({
    url: dbUrl,
    collection: 'sessions',
  }),
  resave: false,
  saveUninitialized: true
}))

if('development' === app.get('env')) { //env 拿到环境变量
  app.set('showStackError', true)
  app.use(morgan(':method :url :status'))
  app.locals.pretty = true // 显示未压缩源码
  mongoose.set('debug', true)
}

require('./config/routes')(app)

console.log('imooc started on port' + port)
