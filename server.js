var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var logger = require("morgan");
var cheerio = require("cheerio");
var axios = require("axios");

// port that server will run on
var PORT = 4000;
var app = express()

// Require all models
var db = require("./models");

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));


// this will hook us to heroku
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

// handlebars engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// home route
app.get("/", (req, res) => res.render("index")) ;
app.get("/saved", (req, res) => res.render("saved"))

// scrape route
app.get("/scrape", function (req, res) {
    
    console.log("")
    console.log("////////////////////")
    
    // URL to site we are going to scrape
    axios.get("https://fox13now.com/category/news/").then(function (response) {
        res.json("scrape route")
        // assign cheerio to '$'
        var $ = cheerio.load(response.data);
        var results = {};

        $(".story").each(function (i, element) {

            // * Headline - the title of the article
            results.title = $(this)
                .children(".extra")
                .text()

            // * Summary - a short summary of the article
            results.summary = $(this)
                .children("h4")
                .text()

            // * URL - the url to the original article
            results.link = $(this)
                .children("a")
                .attr("href");
            

            // create database and store our scrape to it
            db.News.create(results)
              .then(function(dbNews) {
                // console.log(dbNews)
              })
              .catch(function(err) {
                // console.log(err)
              })
        });
        // console.log(results)
        console.log("////////////////////")  
    });
});

// get the items out of our database

// app.get("/scrape") ** change back **
app.get("/all", function(req, res) {
    
    db.News.find({})
    .then(function(dbNews) {
        res.json(dbNews)
        
    })
    .catch(function(dbNews) {
        // console.log(err)
    })
    
});

app.get("/saved/:id", function(req, res) {
    // find all with the value of 'true'
    // db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true })
    db.News.findOneAndUpdate({"_id": req.params.id}, {"saved": true}, {new: true})
    .then(function(dbNews) {
        res.json(dbNews)
    })
    .catch(function(dbNews) {
        // console.log(err)
    });
});

app.get("/get/saved", function(req, res) {
    db.News.find({"saved": true})
    .then(function(dbNews) {
        res.json(dbNews)
        
    })
    .catch(function(dbNews) {
        // console.log(err)
    })
})






    // delete route 
// app.get("/delete", function(req, res) {
//     // this find is working
//     db.News.find({}).drop()
//     .then(function(dbNews) {
//         res.json(dbNews)
//     })
//     .catch(function(dbNews) {
//         console.log(err)
//     })
// })


// Starting the server on PORT
app.listen(PORT, function () {
    console.log("Server listening on: http://localhost:" + PORT);
});