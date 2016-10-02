var Category = require('../models/category')
var _ = require('underscore')

// admin new page.
exports.new = function(req, res) {
  res.render("category_admin", {
    title: 'immoc 后台分类录入页',
    category: {}
  })
}

// admin post category. 分类录入页面
exports.save = function(req, res) {
  var _category = req.body.category

  var category  = new Category(_category)
  category.save(function(err, category) {
    if (err) {
      console.log(err)
    }

    res.redirect('/admin/category/list')
  })
}

// category list
exports.list = function(req, res) {
  Category.fetch(function(err, categories) {
    if (err) {
      console.log(err)
    }

    res.render("category_list", {
      title: '分类列表页',
      categories: categories
    });
  })
}

// delete movie.
// exports.del = function(req, res) {
//   var id = req.query.id
//
//   if (id) {
//     Movie.remove(id, function(err, movie) {
//       if (err) {
//         console.log(err)
//       } else {
//         res.json({
//           success: 1
//         })
//       }
//     })
//   }
// }
