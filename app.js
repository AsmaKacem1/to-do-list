const express=require("express");
const bodyParser=require("body-parser");
const date = require(__dirname + "/date.js");
const app =express();

app.use(express.static("public"));

const items=[];
const workItems= [];

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.get("/",function(req,res){
    
    let day=date.getDate();
    res.render("list",{ListTitle:day,newListItems:items});
});

app.post("/",function(req,res){

    let item= req.body.newItem;

    if (req.body.key === "Work"){
        workItems.push(item);
        res.redirect("/work");
    } else{
        items.push(item);
        res.redirect("/");
    }

    
})

app.get("/work" ,function(req,res){
    res.render("list", {ListTitle: "Work List", newListItems:workItems})
})

app.post("/work",function(req,res){
    let item= req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
})

app.listen(3000,function(){
    console.log("server running");
});