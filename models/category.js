var mongoose=require('mongoose');

//Page Schema
var CategorySchema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    slug:{
        type:String
        //required:true
    }
});

var Page=module.exports=mongoose.model('Category', CategorySchema);