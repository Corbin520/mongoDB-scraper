

$("#scrape-button").on("click", function () {

    // or do a EACH statement for handlebars
    $.getJSON("/all", function (data) {
        // For each one
        for (var i = 0; i < data.length; i++) {
            // <button><p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].summary + "<br />" + data[i].link + "</p><br></button

            $("#news-articles").append(`
            <div id="button-wrapper">
                <div class="card" data-id="${data[i]._id}">
            <h5 class="card-header">${data[i].title}</h5>
            <div class="card-body">
                <h3 id="summary-text">${data[i].summary}</h3>
                <h3 id="link-text">${data[i].link}</h3>
                <a href="" id="save-button" class="btn btn-secondary btn-lg btn-block">Save Article</a>
            </div>
            </div>
        </div>
        <br>    
            `);
        }

    });
});

$("#clear-button").on("click", function () {
    // * We drop a collection with `db.[COLLECTION_NAME].drop()`
    $.getJson("/all", function (data) {
        db.News.drop({})
    })
})

$("#saved-button").on("click", function () {

    // on click this will save the article to the saved route
    // call the save route
    $.getJSON("/saved") // add codet
})

// on click "save article" {
// get the articleid from the data attrabute
// send a request to the back end and include the ID in the request (it can be included in the path, or body, or query string)
// the back end will update the saved field of the article with the given ID to (true)
//}

// if you click on the saved articles button it will go to /saved
// the saved route will load in articles that have field saved = true