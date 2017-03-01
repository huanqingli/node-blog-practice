/**
 * Created by Muc on 17/2/21.
 */
var fs = require('fs');
var express = require('express');
var router = express.Router();
var sha1 = require('sha1');

var userModel = require('../models/users');

//对 multipart/form-data 形式上传的文件进行处理
var multer  = require('multer');
var storage = multer.diskStorage({
    //设置上传后文件路径
    destination: function (req, file, cb) {
        cb(null, './public/img')
    },
    //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});
var upload = multer({ storage: storage }); //文件上传目录


// GET /signup 注册页
router.get('/',  function(req, res, next) {
    res.render('signup');
    delete req.session.error;
    delete req.session.success;
    req.session.save();
});

// POST /signup 用户注册
router.post('/', upload.single("avatar"), function(req, res, next) {
    var name = req.body.name;
    var password = req.body.password;
    var repassword = req.body.repassword;
    var avatar = req.file&&req.file.path;

    // 校验参数
    try {
        if (!(name.length >= 1 && name.length <= 10)) {
            throw '名字请限制在 1-10 个字符';
        }
        if (password.length < 3) {
            throw '密码至少 3 个字符';
        }
        if (password !== repassword) {
            throw '两次输入密码不一致';
        }
    } catch (err) {
        console.log(err);
        // 注册失败，异步删除上传的头像
        // fs.unlink(avatar);
        req.session.error = err;
        return res.redirect('/signup');
    }

    // 明文密码加密
    password = sha1(password);

    // 待写入数据库的用户信息
    var user = {
        name: name,
        password: password,
        avatar: avatar
    };

    var checkUser = function (docs) {
        if(docs==null){
            userModel.create(user);
            return res.redirect('/post');
        } else{
            fs.unlink(avatar);
            req.session.error = '用户名已被占用';
            return res.redirect('/signup');
        }
    };

    userModel.getUserByName(name, checkUser);

});

module.exports = router;