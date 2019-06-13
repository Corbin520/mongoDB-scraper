alert("Page worked")

$("#scrape-button").on("click", function(){
    alert("You clicked me")
})
$.getJSON("/all", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#news-articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].summary + "<br />" + data[i].link + "</p>");
    }
  });