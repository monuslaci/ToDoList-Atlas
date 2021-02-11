//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const ejs = require("ejs");
const https = require("https");
const mongoose = require('mongoose');
require('dotenv').config();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set('view engine', 'ejs');


mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});



const itemsSchema = {
  name: String
};

//create the schema
const Item = mongoose.model("Item", itemsSchema);

//When the user lands on the site we will send this page
app.get("/", function (req, res) {

   // Get the current year for the copyright
   var year=new Date().getFullYear();

  //load the items from the database and give the data to lists. Item is the nem of the collection (in the db it is created in plural)
  Item.find({}, function (err, foundItems) {
    if (err) {
      console.log(err);
    } else {
      res.render("lists", {
        listItemName: foundItems,
        currentYear: year
      });
      console.log("Documents found in the db: " + foundItems);

    }
  });

  

});


app.post("/", function (req, res) {
  //read the input field called item from the page
  let itemInstance = req.body.newItem;


  //save the item to the db
  //first create a new document according to the schema from the input on the page
  const item = new Item({
    name: itemInstance
  });
  //save this document to the database
  //only save the document if the field is filled
  if (req.body.newItem) {
    item.save();
    res.redirect("/");
  }
});



app.post("/delete", function (req, res) {
  var formCheckbox = req.body.formCheckbox;
  console.log(formCheckbox)

  //Delete the item from the database
  Item.deleteOne({
    _id: formCheckbox
  }, function (err) {
    if (err) {
      console.log(err);
    }
  })
  res.redirect("/");
});


app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});