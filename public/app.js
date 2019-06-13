

$("#scrape-button").on("click", function(){

    // or do a EACH statement for handlebars
    $.getJSON("/all", function(data) {
        // For each one
        for (var i = 0; i < data.length; i++) {
          // Display the apropos information on the page
          $("#news-articles").append("<button><p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].summary + "<br />" + data[i].link + "</p><br></button");
        }
      });
      $("#show-card").show()
});

$("#clear-button").on("click", function() {
    // * We drop a collection with `db.[COLLECTION_NAME].drop()`
    $.getJson("/all", function(data) {
        db.News.drop()
    })
})