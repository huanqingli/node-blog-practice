/**
 * Created by Muc on 17/3/3.
 */
var ObjectID = require('mongodb').ObjectID;

var connect = require('./index').connect;
var insertComments = require('./index').insertDocs;
var findComments = require('./index').findAllDocs;
var delComment = require('./index').deleteDoc;

module.exports={
    create:function(comment, callback=null){
        connect(comment, insertComments, 'comments', callback);
    },
    getComments:function (postId, callback=null) {
        connect({postId:postId.toString()}, findComments, 'comments', callback)
    },
    delCommentById:function (id, author, callback=null) {
        connect({_id:ObjectID(id),author:author}, delComment, 'comments', callback)
    }
};