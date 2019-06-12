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

// this will hook us to heroku
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);


// home route
app.get("/", function (req, res) {
    res.json("Home Route")
});
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
app.get("/news", function(req, res) {
    db.News.find({})
    .then(function(dbNews) {
        res.json(dbNews)
    })
    .catch(function(dbNews) {
        console.log(err)
    })
});


// Starting the server on PORT
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});