# fm-indexeddb

## 安装

执行命令

`npm install --save-dev fm-indexeddb`

或者在 html 中直接引用

`<script src="./dist/fm-indexeddb.min.js"></script>`

## 使用方法

* [commonjs](#commonjs)
* [global](#global)
* [api](#api)

### CommonJS
```javascript
var IDB = require('./fm-indexeddb');
```


### Global
```javascript
<script src="./dist/fm-indexeddb.min.js"></script>
```

### 初始化参数
```javascript
var options={
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
var storeBrands=options.objectStoreList[0].name;
```

### API

### IDB.isSuppoutIndexedDB

判断浏览器是否支持 IndexedDB

示例：
```javascript
if(IDB.isSuppoutIndexedDB){
    IDB.openDB(options, getDataList);
}else{
    alert('您的浏览器不支持 IndexedDB');
    return false;
}

function getDataList(){
}
```


### IDB.openDB(options,callback)

`options` 初始化参数
`callback` function， 回调函数

示例：
```javascript
IDB.openDB(options, getDataList);
```


### IDB.add(db,storeName,value)

`db`：DB名称
`storeName`：store 名称
`value`： 保存的数据对象

示例：
```javascript
IDB.add(options.db, storeBrands,jsonObj);
```

### IDB.update(db,storeName,value)

`db`：DB名称
`storeName`：store 名称
`value`： 修改的数据对象

示例：
```javascript
IDB.update(options.db, storeBrands,jsonObj);
```



### IDB.delete(db,storeName,key)

`db`：DB名称
`storeName`：store 名称
`key`： 删除的数据对象 key

示例：
```javascript
IDB.delete(options.db, storeBrands, parseInt(id));
```

### IDB.getOneByKey(db,storeName,key,callback)

`db`：DB名称
`storeName`：store 名称
`key`： 查询的数据对象 key
`callback`： 成功后的回调

示例：
```javascript
IDB.getOneByKey(options.db, storeBrands, parseInt(id),function(data){
    if(data){
        console.log(data);
    }else{
    	console.log('no data');
    }
);
```

### IDB.getOneByIndex(db,storeName,indexName,value,callback)

`db`：DB名称
`storeName`：store 名称
`indexName`：索引名称
`value`： 查询条件
`callback`： 成功后的回调

示例：
```javascript
IDB.getOneByIndex(options.db, storeBrands,'nameIndex',jsonObj.brandName,function(data){
    if(data){
        console.log(data);
    }else{
    	console.log('no data');
    }
});
```


### IDB.getAll(db,storeName,callback)

`db`：DB名称
`storeName`：store 名称
`callback`： 成功后的回调

示例：
```javascript
IDB.getAll(options.db, storeBrands, function(data){
    if (data.list&&data.list.length>0) {
        console.log(data);
    }else{
        console.log('no data');
    }
});
```


### IDB.clearDB(db,storeName)

`db`：DB名称
`storeName`：store 名称

示例：
```javascript
if(confirm('确定要清空数据吗?')){
    IDB.clearDB(options.db, storeBrands);
}
```

### IDB.deleteDB(db)

`db`：DB名称

示例：
```javascript
if(confirm('确定要删除数据库吗?')){
    IDB.deleteDB(options.name);
}
```

### IDB.closeDB(db)

`db`：DB名称

示例：
```javascript
IDB.closeDB(options.db)
```



##	Demo
demo: [http://ifootmark.github.io/fm-indexeddb/test/index.html](http://ifootmark.github.io/fm-indexeddb/test/index.html)


## License
[MIT](https://github.com/ifootmark/fm-indexeddb/blob/master/LICENSE)


© allmeet.net
