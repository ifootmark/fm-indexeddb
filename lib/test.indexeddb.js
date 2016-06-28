'use strict';

var IDB = require('./fm-indexeddb');
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

$(document).ready(function(){
    if(IDB.isSuppoutIndexedDB){
        IDB.openDB(options, getDataList);
    }else{
        alert('您的浏览器不支持 IndexedDB');
        return false;
    }

    $(".v-add").click(function(){
        addData();
    });

    $(".v-clear").click(function(){
        if(confirm('确定要清空数据吗?')){
            IDB.clearDB(options.db, storeBrands);
            getDataList();
        }
    });
    $(".v-deldb").click(function(){
        if(confirm('确定要删除数据库吗?')){
            IDB.deleteDB(options.name);
        }
    });
});

function addData(){
    var o_name=$('#brandName');
    var o_code=$('#brandCode');
    var o_remark=$('#remark');
    var jsonObj={};
    jsonObj.brandName=o_name.val();
    jsonObj.brandCode=o_code.val();
    jsonObj.remark=o_remark.val();
    if(jsonObj.brandName==""){
        o_name.focus();
        return false;
    }
    if(jsonObj.brandCode==""){
        o_code.focus();
        return false;
    }
    IDB.getOneByIndex(options.db, storeBrands,'nameIndex',jsonObj.brandName,function(data){
        if(data){
            alert('此品牌名称已存在');
            return false;
        }
        IDB.add(options.db, storeBrands,jsonObj);

        o_name.val('');
        o_code.val('');
        o_remark.val('');
        getDataList();
    });
}

function getDataList(){
    IDB.getAll(options.db, storeBrands, function(data){
        if (data.list&&data.list.length>0) {
            $('.v-brand-list').show();
            var tpl = template('listtpl', data);
            $('.v-brand-list table tbody').html(tpl);
            $(".v-del").click(function(){
                if(confirm('确定要删除吗?')){
                    var id=$(this).attr('tag-id');
                    if(!!id){
                        IDB.delete(options.db, storeBrands, parseInt(id));
                    }
                    getDataList();
                }
            });
        }else{
            $('.v-brand-list table tbody').html('');
            $('.v-brand-list').hide();
        }
    });
};
