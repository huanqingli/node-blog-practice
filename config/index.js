/**
 * Created by Muc on 17/2/21.
 */
module.exports = {
    port: 3001,
    session: {
        secret: 'poorlyBlog',
        key: 'poorlyBlog',
        maxAge: 2592000000
    },
    mongodb: 'mongodb://localhost:27017/poorly_blog'
};