/**
 * Created by Muc on 17/2/21.
 */
module.exports = {
    port: 3001,
    session: {
        secret: 'poorlyBlog',
        key: 'poorlyBlog',
        maxAge: null
    },
    mongodb: 'mongodb://localhost:27017/poorly_blog'
};