/**
 * Created by Muc on 17/3/1.
 */
var express = require('express');
var router = express.Router();

var checkLogin = require('../middlewares/check').checkLogin;

// GET /signout 登出
router.get('/', checkLogin, function(req, res, next) {
    // 清空 session 中用户信息
    delete req.session.user;
    req.session.success = '登出成功';
    // 登出成功后跳转到主页
    res.redirect('/posts');
});

module.exports = router;