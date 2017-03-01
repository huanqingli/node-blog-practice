/**
 * Created by Muc on 17/3/1.
 */
var express = require('express');
var router = express.Router();

var PostModel = require('../models/posts');
var checkLogin = require('../middlewares/check').checkLogin;


// GET /posts 所有用户或者特定用户的文章页
//   eg: GET /posts?author=xxx
router.get('/', function(req, res, next) {
    var author = req.query.author;

    var renderPage = function (articles) {
        res.render('posts', {posts: articles});
        delete req.session.error;
        delete req.session.success;
        req.session.save();
    };
    PostModel.getPosts(author, renderPage);

});

// GET /posts/create 发表文章页
router.get('/create',checkLogin, function(req, res, next) {
    res.render('create');
    delete req.session.error;
    delete req.session.success;
    req.session.save();
});

// POST /posts 发表一篇文章
router.post('/', checkLogin, function(req, res, next) {
    var author = req.session.user._id;
    var title = req.body.title;
    var content = req.body.content;

    // 校验参数
    try {
        if (!title.length) {
            throw '请填写标题';
        }
        if (!content.length) {
            throw '请填写内容';
        }
    } catch (err) {
        req.session.error = err;
        return res.redirect('back');
    }

    var article = {
        author: author,
        title: title,
        content: content,
        pv: 0
    };

    var afterPost = function (result) {
        // 此 post 是插入 mongodb 后的值，包含 _id
        var post = result.ops[0];
        req.session.success = '发表成功';
        // 发表成功后跳转到该文章页
        res.redirect(`/posts/${post._id}`);
    };

    PostModel.create(article, afterPost)
});
module.exports = router;