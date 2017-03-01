/**
 * Created by Muc on 17/3/1.
 */
var MongoClient = require('mongodb').MongoClient;

var config = require('../config');

// Connection URL
var url = config.mongodb;
//连接数据库
var connect = function (info, handle, collection, callback) {
            //参数对应:要操作的信息,要进行的操作,要使用的集合,回调函数
    // Use connect method to connect to the Server
    MongoClient.connect(url, function(err, db) {
        if(err==null){
            console.log("Connected correctly to server");
            handle(db, info, collection, callback);
            db.close();
        }else{
            console.log(err);
        }

    });
};
//插入文件
var insertDocs = function (db, docs, collections, callback) {
    // Get the documents collection
    var collection = db.collection(collections);
    // Insert some documents
    collection.insertOne(
        docs,
        function (err, result) {
            if (err == null) {
                console.log("Inserted 1 doc");
            } else {
                console.log(err);
            }
            if(callback)callback(result);
        });
};
//查找1个文件
var findOneDoc =function(db, condition, collections, callback) {
    // Get the documents collection
    var collection = db.collection(collections);
    // Find some documents
    collection.findOne(condition,function(err, docs) {
        if(err==null){
            console.log("Found 1 doc");
            console.log(docs);
        }else{
            console.log(err);
        }
        if(callback)callback(docs);
    });
};
//产找全部符合条件的文件
var findAllDocs =function(db, condition, collections, callback) {
    // Get the documents collection
    var collection = db.collection(collections);
    // Find some documents
    collection.find(condition).toArray(function(err, docs) {
        if(err==null){
            console.log("Found the following docs");
            console.log(docs);
        }else{
            console.log(err);
        }
        if(callback)callback(docs);
    });
};

module.exports = {
    connect:connect,
    insertDocs:insertDocs,
    findOneDoc:findOneDoc,
    findAllDocs:findAllDocs,
};