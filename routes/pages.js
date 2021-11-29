var express=require('express');
var router=express.Router();

//Get page model
var Page=require('../models/page');

/*
* Get /
*/
router.get('/', function(req, res)
{
    Page.findOne({slug:'home'}, function(err, page)
    {
        if(err)
            console.log(err)
        else{
            res.render('index', {
                title:page.title,
                content:page.content
            });
        }
    });
});

router.get('/:slug', function(req, res)
{
    var slug=req.params.slug;

    Page.findOne({slug:slug}, function(err, page)
    {
        if(err)
            console.log(err)
        if(!page)
        {
            res.redirect('/');
        }

        else{
            res.render('index', {
                title:page.title,
                content:page.content
            });
        }
    });
});

//Exports
module.exports=router;