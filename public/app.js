
$("#scrape-button").on("click", function () {

    $.getJSON("/scrape", function (data) {
       console.log(data)
        for (var i = 0; i < data.length; i++) {
           
            $("#news-articles").append(`
            <div id="button-wrapper">
                <div class="card">
            <h5 class="card-header">${data[i].title}</h5>
            <div class="card-body">
                <h3 id="summary-text">${data[i].summary}</h3>
                <h3 id="link-text">${data[i].link}</h3>
                <a href="#" data-id="${data[i]._id}" class="btn btn-secondary btn-lg btn-block save-button">Save Article</a>
            </div>
            </div>
            </div>
            <br>    
            `);
        }
        $(".save-button").on("click", function () {
            var thisId = $(this).attr("data-id");
            console.log(thisId)
            $.ajax({
                method: "GET",
                url: "/saved/" + thisId
            })
            .then(function(data) {
                console.log(data)
                
            })
        })                        
    });
});

