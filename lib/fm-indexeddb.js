'use strict';

var localIndexedDB = {
    isSuppoutIndexedDB: function(){
        if(window.indexedDB)
        {
            return true;
        }else{
            return false;
        }
    },
    openDB: function (options,callback) {
        var name=options.name || 'footmark';
        var version=options.version || 1;
        if(!options.db){
            options.db=null;
        }
        var request=window.indexedDB.open(name,version);
        request.onerror=function(e){
            console.log(e.currentTarget.error.message);
        };
        request.onsuccess=function(e){
            var db=e.target.result;
            db.onversionchange = function(event) {
                db.close();
                location.href=location.href;
            };
            options.db=db;
            if(callback){
                callback();            
            }
        };
        request.onupgradeneeded=function(e){
            var db=e.target.result;
            db.onversionchange = function(event) {
                db.close();
                location.href=location.href;
            };

            //create  objectStore
            for(var i=0;i<options.objectStoreList.length;i++){
                var objStore=options.objectStoreList[i];
                var storeName=objStore.name;
                var indexList=objStore.index;
                if(storeName && !db.objectStoreNames.contains(storeName)){
                    var store=db.createObjectStore(storeName, {keyPath: 'id', autoIncrement: true});
                    if(indexList){
                        for(var j=0;j<indexList.length;j++){
                            var indexName=indexList[j].name;
                            var field=indexList[j].field;
                            var unique=indexList[j].unique || false;
                            if(indexName && field){
                                store.createIndex(indexName,field,{unique:unique});
                            }
                        }                        
                    }
                }
            }
            console.log('IndexedDB version changed to '+version);
        };
    },
    addData: function (db,storeName,value){
        var transaction=db.transaction(storeName,'readwrite'); 
        var store=transaction.objectStore(storeName); 
        store.add(value);
    },
    getDataByKey: function (db,storeName,key,callback){
        var transaction=db.transaction(storeName,'readwrite');
        var store=transaction.objectStore(storeName); 
        var request=store.get(key); 
        request.onsuccess=function(e){ 
            var o=e.target.result; 
            if(callback){
                callback(o);
            }
        };
    },
    getDataByIndex: function (db,storeName,indexName,value,callback){
        var transaction=db.transaction(storeName);
        var store=transaction.objectStore(storeName);
        var index = store.index(indexName);
        index.get(value).onsuccess=function(e){
            var o=e.target.result;
            if(callback){
                callback(o);
            }
        }
    },
    updateData: function (db,storeName,value){
        var transaction=db.transaction(storeName,'readwrite');
        var store=transaction.objectStore(storeName); 
        store.put(value);
    },
    deleteDataByKey: function (db,storeName,key){
        var transaction=db.transaction(storeName,'readwrite');
        var store=transaction.objectStore(storeName);
        store.delete(key); 
    },
    clearObjectStore: function (db,storeName){
        var transaction=db.transaction(storeName,'readwrite');
        var store=transaction.objectStore(storeName); 
        store.clear();
    },
    deleteObjectStore: function (db,storeName){
        if(db.objectStoreNames.contains(storeName)){ 
            db.deleteObjectStore(storeName);
        }
    },
    deleteDB: function (dbname){
        var request = window.indexedDB.deleteDatabase(dbname);
        request.onerror = function(event) {
            console.log("Error deleting database.");
        };
        request.onsuccess = function(event) {
            console.log("Database deleted successfully");
        };
    },
    getDataList: function (db,storeName,indexName,value,callback){
        var transaction=db.transaction(storeName);
        transaction.onerror = function(event) {
            console.log("Error");
            preventDefault()
        };    
        transaction.oncomplete = function(event) {
            //console.log("Success");
        };
        var store=transaction.objectStore(storeName);
        var request=null;
        if(indexName){
            var index = store.index(indexName);
            if(value)
                request=index.openCursor(IDBKeyRange.only(value),IDBCursor.prev);
            else
                request=index.openCursor(null,IDBCursor.prev);
        }else{
            request=store.openCursor(null,IDBCursor.prev);
        }
        var data={};
        data.list=[];
        request.onsuccess=function(e){
            var cursor=e.target.result;
            if(cursor){
                var o=cursor.value;
                data.list.push(o);
                cursor.continue();
            }else{
                if(callback){
                    callback(data);
                }
            }
        };
    }
};

/**
options:{
    name:'footmark',
    version:1,
    objectStoreList:[
        {
            name:"Brands",
            index:[
                {name:"nameIndex",field:"brandName",unique:false},
                {name:"codeIndex",field:"brandCode",unique:false}
            ]
        }
    ]
}
*/
var IDB = {
    isSuppoutIndexedDB: localIndexedDB.isSuppoutIndexedDB(),
    openDB: function(options,callback){
        localIndexedDB.openDB(options,callback);
    },
    add: function(db,storeName,value){
        localIndexedDB.addData(db,storeName,value);
    },
    update: function(db,storeName,value){
        localIndexedDB.updateData(db,storeName,value);
    },
    delete: function(db,storeName,key){
        localIndexedDB.deleteDataByKey(db,storeName,key);
    },
    getOneByKey: function(db,storeName,key,callback){
        localIndexedDB.getDataByKey(db,storeName,key,callback);
    },
    getOneByIndex: function(db,storeName,indexName,value,callback){
        localIndexedDB.getDataByIndex(db,storeName,indexName,value,callback);
    },
    getList: function(db,storeName,indexName,value,callback){
        localIndexedDB.getDataList(db,storeName,indexName,value,callback);
    },
    clearDB: function(db,storeName){
        localIndexedDB.clearObjectStore(db,storeName);
    },    
    deleteDB: function(dbname){
        localIndexedDB.deleteDB(dbname);
    },
    closeDB: function(db){
        db.close();
    }
};

(function(root, IDB){
    if (typeof define === 'function' && define.amd) {
        define('IDB',[], IDB);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = IDB;
    } else {
        root.IDB = IDB;
    }
})(this, IDB);
