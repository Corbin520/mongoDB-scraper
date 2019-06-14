
$("#scrape-button").on("click", function () {

    $.getJSON("/all", function (data) {
       
        for (var i = 0; i < data.length; i++) {
           
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
    // button is working & alerting

        // use delete route
        // app.delete
    // get the data in out click function
    $.getJSON("/all", function (data) {
        for (var j = 0; j < data.length; j++) {
            // got our data back
            console.log(data[j])      
        }
    })
})



$("#saved-button").on("click", function () {


    // get the articleid from the data attrabute
    var thisId = $(this).attr("data-id");

    $.ajax({

        // POST it
        method: "POST",
        url: "/saved" + thisId + alert("I worked")
    })
    .then(function(data) {
        console.log(data)
    })
    

})





// append to the saved page
// find all the data with a 'true' and display it

// on click "save article" {
// send a request to the back end and include the ID in the request (it can be included in the path, or body, or query string)
// the back end will update the saved field of the article with the given ID to (true)
//}

// if you click on the saved articles button it will go to /saved
// the saved route will load in articles that have field saved = true