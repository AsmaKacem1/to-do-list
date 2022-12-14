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

const listSchema ={
    name:String,
    items: [ItemsSchema]
};

const List = mongoose.model("List",listSchema);
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


app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));


app.get("/",function(req,res){

    let day=date.getDate();
    Item.find({},function(err,fItems){

        if(fItems.length===0){
            Item.insertMany(listItems,function(err){
                if(err){
                    console.log("check there is an error!");
                }else{
                    console.log("success!");
                }
            })
            res.redirect("/");
        }
        else{
            res.render("list",{listTitle:day,newListItems:fItems});
        }
    })
});

app.post("/",function(req,res){

    const itemName= req.body.newItem;
    const listName= req.body.list;

    const item=new Item({
        name:itemName
    });

    if(listName ==="Today"){
        item.save();
        res.redirect("/");
    }else{
        List.findOne({name:listName},function(err,foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }

    
})


app.post("/delete",function(req,res){

    const checkedItemId=req.body.checkbox;
    const listName= req.body.listName;
    if(listName==="Today"){
        Item.findByIdAndRemove(checkedItemId,function(err){
            if(!err){
                console.log("item deleted");
                res.redirect("/");
        }
    });
    }else{
        List.findOneAndUpdate({name:listName},{$pull:{items: {_id:checkedItemId}}},function(err,foundList){
            if(!err){
                res.redirect("/" + listName);
            }
        });
    }
    


})


app.get("/:customListName" ,function(req,res){
    const customListName=req.params.customListName;
    List.findOne({name: customListName},function(err,foundList){
        if (!err){
            if(!foundList){
                const list =new List({
                    name: customListName,
                    items: listItems
                });
                list.save();
                res.redirect("/" + customListName);
            }
            else {
                res.render("list",{listTitle: foundList.name, newListItems: foundList.items})
            }
        }
    })
})

app.post("/work",function(req,res){
    let item= req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
})

app.listen(3000,function(){
    console.log("server running");
});