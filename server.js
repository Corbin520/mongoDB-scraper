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

     scrape()
        .then(results => {
             db.News.create(results)
        })
        .then(resultsArr => {
           db.News.find({}).then((data)=>{
            res.json(data)
           })
        })

});

function scrape() {
    // URL to site we are going to scrape
    return axios.get("https://fox13now.com/category/news/").then(function (response) {
        // assign cheerio to '$'
        var $ = cheerio.load(response.data);
        
        var resultsArr = [];
        
        $(".story").each(function (i, element) {
            var results = {};

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
                // console.log(results)
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




// this route is for saving and updating the article notes
app.post("/note/:id", function (req, res) {

    // we then create a "create" req from db.News
    db.Note.create(req.body)

    return db.News.findOneAndUpdate({

        // If a Note was created successfully, find one Article with an `_id` equal 
        // to `req.params.id`. Update the Article to be associated with the new Note
            _id: req.params.id
        }, {
            note: dbNote._id
        }, {
            // { new: true } tells the query that we want it to return
            // the updated User -- it returns the original by default
            new: true

            // Since our mongoose query returns a promise, we can chain 
            // another `.then` which receives the result of the query
        }).then(function (dbNews) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbNews)
        })

        .catch(function (err) {
            // If there is an error, send the error
            res.json(err)
        })
});




app.listen(process.env.PORT || 3000, function () {
    console.log("App is live on Port 3000")
    // console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

// how to get the comments to store...

// what do we know?
// We know that we need to get a route to our back end
// We know that we will need to get a response back from the Db
// We know that it needs to be stored in the db and update schema

// what do we do?
// We create a server route to the db and get a response.