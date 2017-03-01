/**
 * Created by Muc on 17/3/1.
 */
module.exports = {
    checkLogin: function checkLogin(req, res, next) {
        if (!req.session.user) {
            req.session.error = '未登录';
            return res.redirect('/signin');
        }
        next();
    },

    checkNotLogin: function checkNotLogin(req, res, next) {
        if (req.session.user) {
            req.session.error = '已登录';
            return res.redirect('back');//返回之前的页面
        }
        next();
    }
};