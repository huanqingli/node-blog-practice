/**
 * Created by Muc on 17/2/24.
 */
var ObjectID = require('mongodb').ObjectID;

var connect = require('./index').connect;
var insertUsers = require('./index').insertDocs;
var findUser = require('./index').findOneDoc;

module.exports={
    create:function(user, callback=null){
        connect(user, insertUsers, 'users', callback);
    },
    getUserByName:function (name, callback=null) {
        connect({name:name}, findUser, 'users', callback)
    },
    getUserById:function (id, callback=null) {
        connect({_id:ObjectID(id)}, findUser, 'users', callback)
    },
};