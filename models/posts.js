/**
 * Created by Muc on 17/3/1.
 */
var connect = require('./index').connect;
var insertArticle = require('./index').insertDocs;
var findArticles = require('./index').findAllDocs;

module.exports={
    create:function(article, callback=null){
        connect(article, insertArticle,'articles', callback); //文章,行为,集合,回调
    },
    getPosts:function (author, callback=null) {
        var query = {};
        if (author) {
            query.author = author;
        }
        connect(query, findArticles, 'articles', callback)
    },
};