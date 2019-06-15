var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var logger = require("morgan");
var cheerio = require("cheerio");
var axios = require("axios");

// port that server will run on

var app = express()

// Require all models
var db = require("./models");

app.use(logger("dev"));

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.use(express.static("public"));


// this will hook us to heroku
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

// handlebars engine
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// home route
app.get("/", (req, res) => res.render("index"));
app.get("/saved", (req, res) => res.render("saved"))

// scrape route
app.get("/scrape", function (req, res) {

    return scrape()
        .then(results => {
            return db.News.create(results)
        })
        .then(resultsArr => {
            res.json(resultsArr);
        })

});

function scrape() {
    // URL to site we are going to scrape
    return axios.get("https://fox13now.com/category/news/").then(function (response) {
        // assign cheerio to '$'
        var $ = cheerio.load(response.data);
        var results = {};

        var resultsArr = [];

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
            resultsArr.push(results);
        });
        return resultsArr;
    });
}

app.get("/all", function (req, res) {

    db.News.find({})
        .then(function (dbNews) {
            res.json(dbNews)

        })
        .catch(function (dbNews) {
            console.log(err)
        })

});

app.get("/saved/:id", function (req, res) {

    db.News.findOneAndUpdate({
            "_id": req.params.id
        }, {
            "saved": true
        }, {
            new: true
        })
        .then(function (dbNews) {
            res.json(dbNews)
        })
        .catch(function (dbNews) {
            console.log(err)
        });
});

app.delete("/deleted/:id", function (req, res) {

    db.News.findOneAndUpdate({
            "_id": req.params.id
        }, {
            "saved": false
        }, {
            new: false
        })
        .then(function (dbNews) {
            res.json(dbNews)
        })
        .catch(function (dbNews) {
            console.log(err)
        });
});

app.get("/get/saved", function (req, res) {
    db.News.find({
            "saved": true
        })
        .then(function (dbNews) {
            res.json(dbNews)

        })
        .catch(function (dbNews) {
            console.log(err)
        })
})

// Starting the server on PORT
app.listen(process.env.PORT || 3000, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

// updating article with note route
app.get("/submit/note/:id", function (req, res) {

    db.News.findOne({
            _id: req.params.id
        })
        .then(function (dbNews) {
            res.json(dbNews)
        })
        .catch(function (err) {
            res.json(err)
        });
})