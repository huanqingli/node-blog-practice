/**
 * Created by Muc on 17/2/24.
 */
var MongoClient = require('mongodb').MongoClient;

var config = require('../config');

// Connection URL
var url = config.mongodb;

var connect = function (info, handle, callback) {
    // Use connect method to connect to the Server
    MongoClient.connect(url, function(err, db) {
        if(err==null){
            console.log("Connected correctly to server");
            handle(db, info, callback);
            db.close();
        }else{
            console.log(err);
        }

    });
};

var insertUsers = function (db, user, callback) {
    // Get the documents collection
    var collection = db.collection('users');
    // Insert some documents
    collection.insertOne(
        user
        , function (err, result) {
            if (err == null) {
                console.log("Inserted 1 user");
            } else {
                console.log(err);
            }
            if(callback)callback(result);
        });
};

var findUser = function(db, name, callback) {
    // Get the documents collection
    var collection = db.collection('users');
    // Find some documents
    collection.findOne({name:name},function(err, docs) {
        if(err==null){
            console.log("Found the following users");
            console.log(docs);
        }else{
            console.log(err);
        }
        if(callback)callback(docs);
    });
};

module.exports={
    create:function(user, callback=null){
        connect(user, insertUsers, callback)
    },
    getUserByName:function (name, callback=null) {
        connect(name, findUser, callback)
    }
};