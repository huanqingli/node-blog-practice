/**
 * Created by Muc on 17/2/21.
 */
module.exports = function (app) {
    app.get('/', function (req, res) {
        res.redirect('/posts');
    });
    app.use('/posts', require('./posts'));
    app.use('/signup', require('./signup'));
    app.use('/signin', require('./signin'));
    app.use('/signout', require('./signout'));
    // 404 page
    app.use(function (req, res) {
        if (!res.headersSent) {
            res.render('404');
        }
    });
};