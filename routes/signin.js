/**
 * Created by Muc on 17/2/22.
 */
var express = require('express');
var router = express.Router();
var sha1 = require('sha1');

var userModel = require('../models/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signin 登录页
router.get('/', checkNotLogin, function(req, res, next) {
    res.render('signin');
    delete req.session.error;
    delete req.session.success;
    req.session.save();
});

// POST /signin 用户登录
router.post('/', checkNotLogin, function(req, res, next) {
    var name = req.body.name;
    var password = req.body.password;

    var checkUser = function (user) {
        if(user==null){
            req.session.error = '用户不存在';
            return res.redirect('/signin');
        }
        // 检查密码是否匹配
        if (sha1(password) !== user.password) {
            req.session.error = '用户名或密码错误';
            return res.redirect('back');
        }
        req.session.success = '登录成功';
        // 用户信息写入 session
        delete user.password;
        req.session.user = user;
        // 跳转到主页
        res.redirect('/posts');
    };

    userModel.getUserByName(name, checkUser);

});

module.exports = router;