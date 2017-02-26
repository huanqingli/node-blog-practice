/**
 * Created by Muc on 17/2/21.
 */
var express = require('express');
var bodyParser = require('body-parser');

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
    res.locals.user = "";
    res.locals.success =  req.query.success||"";
    res.locals.error = req.query.error||"";
    next();
});

// 路由
routes(app);

// 监听端口，启动程序
app.listen(config.port, function () {
    console.log(`${pkg.name} listening on port ${config.port}`);
});