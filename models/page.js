var mongoose=require('mongoose');

//Page Schema
var PageSchema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    slug:{
        type:String
        //required:true
    },
    content:{
        type:String,
        required:true
    },
    sorting:{
        type:Number
        //required:true
    }
});

var Page=module.exports=mongoose.model('Page', PageSchema);