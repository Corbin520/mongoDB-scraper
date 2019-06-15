// on document ready
// make the call to the get/saved route and append to page

$( document ).ready(function() {

    $.getJSON("/get/saved", function (data) {
       
        for (var i = 0; i < data.length; i++) {
           
            $("#news-articles").append(`
            <div id="button-wrapper">
                <div class="card" data-id="${data[i]._id}">
            <h5 class="card-header">${data[i].title}</h5>
            <div class="card-body">
                <h3 id="summary-text">${data[i].summary}</h3>
                <h3 id="link-text">${data[i].link}</h3>
                <a href="" class="btn btn-secondary btn-lg btn-block">Save Article</a>
                <a href="" class="btn btn-secondary btn-lg btn-block delete-article-button">Delete Article</a>
            </div>
            </div>
        </div>
        <br>    
            `);
        }
        $(".delete-article-button").on("click", function () {
            var thisId = $(this).attr("data-id");
            console.log(thisId)
            alert("Iv Been Clicked")
            // $.ajax({
            //     method: "GET",
            //     url: "/saved/" + thisId
            // })
            // .then(function(data) {
            //     console.log(data)
            //   alert("iv Been Clicked")  
            // })
        }) 
    });
});


