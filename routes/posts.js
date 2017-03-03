/**
 * Created by Muc on 17/3/1.
 */
var express = require('express');
var router = express.Router();

var userModel = require('../models/users');
var PostModel = require('../models/posts');
var CommentModel = require('../models/comments');
var checkLogin = require('../middlewares/check').checkLogin;


// GET /posts 所有用户或者特定用户的文章页
//   eg: GET /posts?author=xxx
router.get('/', function(req, res, next) {
    var author = req.query.author;

    var renderPage = async function (articles) {
        for(var i=0;i<articles.length;i++){
            await new Promise(function (resolve, reject) {
                userModel.getUserById(articles[i].author, function (author) {
                    articles[i].author = author;
                    CommentModel.getComments(articles[i]._id, function (comment) {
                        articles[i].commentsCount = comment.length;
                        resolve();
                    });
                });
            });
        }
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
router.post('/create', checkLogin, function(req, res, next) {
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

// GET /posts/:postId 单独一篇的文章页
router.get('/:postId', function(req, res, next) {
    var postId = req.params.postId;

    var showArticle = async function () {
        await new Promise(function (resolve, reject) {
            PostModel.incPv(postId, function (result) {
                resolve(result);
            });
        });// pv 加 1
        var post = await new Promise(function (resolve, reject) {
            PostModel.getPostById(postId, function (article) {
                resolve(article);
            });
        });// 获取文章信息
        await new Promise(function (resolve, reject) {
            userModel.getUserById(post.author,function (author) {
                post.author=author;
                resolve();
            })
        });//获取文章作者
        var comments = await new Promise(function (resolve, reject) {
            CommentModel.getComments(post._id, function (comment) {
                resolve(comment);
            });
        });// 获取该文章所有留言
        for(var i=0;i<comments.length;i++){
            await new Promise(function (resolve, reject) {
                userModel.getUserById(comments[i].author,function (author) {
                    comments[i].author=author;
                    resolve();
                })
            });//获取文章留言作者
        }
        if (!post) {
            req.session.error = '该文章不存在';
            return res.redirect('/post');
        }
        post.commentsCount = comments.length;
        res.render('post',{post: post, comments: comments});
        delete req.session.error;
        delete req.session.success;
        req.session.save();
    };

    showArticle();

});

// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, function(req, res, next) {
    var postId = req.params.postId;
    var author = req.session.user._id;

    var renderEditPage = function (article) {
        if (!article) {
            req.session.error = '文章不存在';
            // 留言成功后跳转到上一页
            return res.redirect('back');
        }
        if (author.toString() !== article.author.toString()) {
            req.session.error = '没有权限';
            // 留言成功后跳转到上一页
            return res.redirect('back');
        }

        res.render('edit', {post: article});
    };

    PostModel.getPostById(postId, renderEditPage);
});

// POST /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', checkLogin, function(req, res, next) {
    var postId = req.params.postId;
    var author = req.session.user._id;
    var title = req.body.title;
    var content = req.body.content;

    var afterUpdate = function (result) {
        req.session.success = '编辑文章成功';
        res.redirect(`/posts/${postId}`);
    };

    PostModel.updatePostById(postId, author, { title: title, content: content },afterUpdate);
});

// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin, function(req, res, next) {
    var postId = req.params.postId;
    var author = req.session.user._id;

    var afterDel = function (result) {
        if(result.deletedCount==1){
            req.session.success = '删除留言成功';
        }
        // 留言成功后跳转到上一页
        res.redirect('back');
    };

    PostModel.delPostById(postId, author, afterDel)
});

// POST /posts/:postId/comment 创建一条留言
router.post('/:postId/comment', checkLogin, function(req, res, next) {
    var author = req.session.user._id;
    var postId = req.params.postId;
    var content = req.body.content;
    var comment = {
        author: author,
        postId: postId,
        content: content
    };

    var afterComment = function (result) {
        req.session.success = '留言成功';
        // 留言成功后跳转到上一页
        res.redirect('back');
    };

    CommentModel.create(comment, afterComment);

});

// GET /posts/:postId/comment/:commentId/remove 删除一条留言
router.get('/:postId/comment/:commentId/remove', checkLogin, function(req, res, next) {
    var commentId = req.params.commentId;
    var author = req.session.user._id;

    var afterDel = function (result) {
        if(result.deletedCount==1){
            req.session.success = '删除留言成功';
        }
        // 留言成功后跳转到上一页
        res.redirect('back');
    };

    CommentModel.delCommentById(commentId, author, afterDel);
});

module.exports = router;