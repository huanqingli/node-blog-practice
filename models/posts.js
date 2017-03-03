/**
 * Created by Muc on 17/3/1.
 */
var ObjectID = require('mongodb').ObjectID;

var connect = require('./index').connect;
var insertArticles = require('./index').insertDocs;
var findArticles = require('./index').findAllDocs;
var findArticle = require('./index').findOneDoc;
var addPV = require('./index').updateDoc;

module.exports={
    create:function(article, callback=null){
        connect(article, insertArticles,'articles', callback); //文章,行为,集合,回调
    },
    getPosts:function (author, callback=null) {
        var query = {};
        if (author) {
            query.author = author;
        }
        connect(query, findArticles, 'articles', callback);
    },
    getPostById:function (id, callback=null) {
        connect({_id:ObjectID(id)}, findArticle, 'articles', callback);
    },
    incPv: function incPv(id, callback=null) {
        connect([{ _id:ObjectID(id)}, { $inc: { pv: 1 } }], addPV, 'articles', callback);
    },
};