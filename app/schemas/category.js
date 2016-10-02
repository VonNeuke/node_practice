var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var CategorySchema = new Schema({
  name: String,
  movies: [{type: ObjectId, ref: 'Movie'}],// 映射数组
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
CategorySchema.pre('save', function(next) {
  if(this.isNew) { // 数据是否是新加的
    this.meta.createAt = this.meta.updateAt = Date.now() // 设置为当前时间
  } else {
    this.meta.updateAt = Date.now()
  }

  next() // 调用 next() 才会把存储流程走下去
})

//添加静态方法（静态方法不会与数据库交互，虽然它是给模型添加的方法，但都是实例在调用）
CategorySchema.statics = {
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

 module.exports = CategorySchema
