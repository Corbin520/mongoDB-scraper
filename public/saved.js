// on document ready
// make the call to the get/saved route and append to page

$(document).ready(function () {
    getData()
});

function clearPage() {
    
    $("#news-articles").empty()
}

function getData() {
    clearPage()
    $.getJSON("/get/saved", function (data) {
        writeToPage(data)
    });
}

function writeToPage(data) {
    for (var i = 0; i < data.length; i++) {

        $("#news-articles").append(`
        <div id="button-wrapper">
            <div class="card" data-id="${data[i]._id}">
        <h5 class="card-header">${data[i].title}</h5>
        <div class="card-body">
            <h3 id="summary-text">${data[i].summary}</h3>
            <h3 id="link-text">${data[i].link}</h3>
            <a data-id= "${data[i]._id}" class="btn btn-secondary btn-lg btn-block btn-danger delete-article-button">Delete Article</a>
            </div>
            <form>
            <div class="form-group">
            <textarea class="form-control article input" id="exampleFormControlTextarea1" rows="3" placeholder="What did you like about this article?"></textarea>
            </div>
            </div>
            </form>
            <button type="button" class="btn btn-secondary btn-lg btn-block left-afticle-comment">Leave a comment on this article</button>
        </div>
    <br>    
        `);
    }
    $(".delete-article-button").on("click", function () {
        var thisId = $(this).attr("data-id");
        console.log(thisId)
        $.ajax({
                method: "DELETE",
                url: "/deleted/" + thisId
            })
            .then(function (data) {
                console.log(data)
                getData()
            })

    })
    $(".left-afticle-comment").on("click", function () {
        alert("Comment Button Clicked")
    });

}