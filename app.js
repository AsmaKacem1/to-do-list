const express=require("express");
const bodyParser=require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose=require("mongoose");
const app =express();

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB",{UseNewUrlParser:true});

const ItemsSchema ={
    name:String
};

const Item=mongoose.model("item",ItemsSchema);

const item1=new Item({
    name:"welcome todolist site"
});

const item2=new Item({
    name:"Hit the + button to add new item"
});

const item3=new Item({
    name:"<-- Hit this to delete item"
});

const listItems=[item1,item2,item3];

Item.insertMany(listItems,function(err){
    if(err){
        console.log("check there is an error!");
    }else{
        console.log("success!");
    }
})

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