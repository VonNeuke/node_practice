var mongoose = require('mongoose')
var bcrypt = require('bcrypt')
var SALT_WORK_FACTOR = 10

var UserSchema = new mongoose.Schema({
  name: {
    unique: true,
    type: String,
  },
  password: String,
  meta: { // 更新数据时的时间记录
    createAt: {
      type: Date,
      default: Date.now() // 默认值
    },
    updateAt: {
      type: Date,
      default: Date.now()
    },
  },
})

// 给模式添加一个方法：每次存储一个数据之前，都会调用这个方法
UserSchema.pre('save', function(next) {
  var user = this
  if(this.isNew) { // 数据是否是新加的
    this.meta.createAt = this.meta.updateAt = Date.now() // 设置为当前时间
  } else {
    this.meta.updateAt = Date.now()
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) { // 第一个参数：计算强度
    if(err) return next(err)
    bcrypt.hash(user.password, salt, function(err, hash) {
        if(err) return next(err)
        user.password = hash
        next() // 调用 next() 才会把存储流程走下去
    })
  })
})

//添加静态方法（静态方法不会与数据库交互，虽然它是给模型添加的方法，但都是实例在调用）
UserSchema.statics = {
  fetch: function(cb) { // 取出目前数据库所有数据
    return this
      .find({})
      .sort('meta.updateAt') // 按照更新时间排序
      .exec(cb) // 回调方法
  },
  findById: function(id, cb) { //查询单条数据
    return this
      .findOne({_id: id})
      .exec(cb)
  }
}

 module.exports = UserSchema
