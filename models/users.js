/**
 * Created by Muc on 17/2/24.
 */
var connect = require('./index').connect;
var insertUsers = require('./index').insertDocs;
var findUser = require('./index').findOneDoc;

module.exports={
    create:function(user, callback=null){
        connect(user, insertUsers, 'users', callback);
    },
    getUserByName:function (name, callback=null) {
        connect({name:name}, findUser, 'users', callback)
    }
};