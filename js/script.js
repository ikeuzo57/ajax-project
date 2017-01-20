
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    
    // YOUR CODE GOES HERE!
   var streetStr = $('#street').val();
   var cityStr = $('#city').val();
   var address = streetStr + ', ' + cityStr;

   $greeting.text('So you want to leave at ' + address + '?');

    // Google streetView api
    var streetViewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + address + '';
    var urlKey = 'AIzaSyA2Njk2g8jGMR01qPvegoSbkzh_brYs75I';
    $body.append('<img class="bgimg" src=" ' + streetViewUrl + ' + &urlKey ">');

    // NYT AJAX request data
    var nytimesUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=234b154f89bb4c9e8ba9a6499ce8c052';
   
    $.getJSON(nytimesUrl, function(data){
       $nytHeaderElem.text('New York Times Articles About ' + cityStr); // HEADER FOR NYT

       articles = data.response.docs;
       //console.log(articles);
       for(var i=0; i<articles.length; i++){
        var article = articles[i];
        $nytElem.append('<li class="article">'+
            '<a href="'+article.web_url+'">'+article.headline.main+'</a>'+
                '<p>'+article.snippet +'</p>'
         +'</li>');
       };
    }).error(function(e){
         $nytHeaderElem.text("New York Times Articles Could Not Be Loaded");
       });

    // Wikipedia Ajax call Data
     var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';

     var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources");
     }, 8000)
    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        // jsonp: "callback",
        success: function(response){
            var articleList = response[1];
                // console.log(articleList);
            for(var i=0; i<articleList.length; i++){
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href=" '+url+' "> '+ articleStr +' </a></li>');
            };
            clearTimeout(wikiRequestTimeout);
        }
       
    });


    return false;
};

$('#form-container').submit(loadData);
