/**
 * Created by Muc on 17/3/1.
 */
var express = require('express');
var router = express.Router();

// GET /posts 所有用户或者特定用户的文章页
//   eg: GET /posts?author=xxx
router.get('/', function(req, res, next) {
    res.render('create');
    delete req.session.error;
    delete req.session.success;
    req.session.save();
    // var author = req.query.author;
    //
    // PostModel.getPosts(author)
    //     .then(function (posts) {
    //         res.render('posts', {
    //             posts: posts
    //         });
    //     })
    //     .catch(next);
});

// GET /posts/create 发表文章页
router.get('/create', function(req, res, next) {
    res.render('create');
    delete req.session.error;
    delete req.session.success;
    req.session.save();
});

module.exports = router;