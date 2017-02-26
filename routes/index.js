/**
 * Created by Muc on 17/2/21.
 */
module.exports = function (app) {
    app.use('/signup', require('./signup'));
    app.use('/signin', require('./signin'));
};