/**
 * Created by Muc on 17/2/21.
 */
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var pkg = require('./package');
var routes = require('./routes');
var config = require('./config');

var app = express();

// 设置模板目录
app.set('views', __dirname + '/views');
// 设置模板引擎为 ejs
app.set('view engine', 'ejs');

// 静态文件目录
app.use(express.static(__dirname + '/public'));

//会话管理
app.use(session({
    name: config.session.key,// 设置 cookie 中保存 session id 的字段名称
    secret: config.session.secret,// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    cookie: {
        maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
    },
    store: new MongoStore({// 将 session 存储到 mongodb
        url: config.mongodb// mongodb 地址
    })
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());
// parse application/json
app.use(bodyParser.json());

// 设置模板全局常量
app.locals.blog = {
    title: pkg.name,
    description: pkg.description
};
// 添加模板必需的三个变量
app.use(function (req, res, next) {
    res.locals.user = req.session.user||"";
    res.locals.success =  req.session.success||"";
    res.locals.error = req.session.error||"";
    next();
});

// 路由
routes(app);

// 监听端口，启动程序
app.listen(config.port, function () {
    console.log(`${pkg.name} listening on port ${config.port}`);
});