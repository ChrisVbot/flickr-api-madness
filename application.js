$(function(){
    


  var apiKey = MY_KEY

  //calls Flickr api and then calls randomizeImage function on lighthousePhotos object
  $.ajax({
    method: 'get',
    url: 'https://api.flickr.com/services/rest/?method=flickr.photos.search',
    data: {
      api_key: apiKey,
      tags: "lighthouse",
      format: "json",
      "content-type": "1",
      },
    dataType: 'jsonp',        
    jsonp: 'jsoncallback',
    success: function (lighthousePhotos){
      console.log("success");
      // getImagesAddToPhotoArray(lighthousePhotos);
      randomizeImage(lighthousePhotos.photos.photo);
    }, 
    error: function(){
      console.log("Failure");
    }  
  });

  //builds url based on the input(randomizeImage function)
  function buildURL(item){
    return 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '.jpg'
  }

  //selects a random image from lighthousePhotos.photos.photo - passed in as photoArray
  function randomizeImage(photoArray){
    var randomized = photoArray[Math.floor(Math.random() * photoArray.length)];;
    $("img").attr('src', buildURL(randomized));
    console.log(randomized)
    displayImageInfo(randomized);
    // setTimeout(function(){
    //   randomizeImage(photoArray);
    //   }, 5000);
  };

  //gets info about photo from flickr api and also updates page via ajax
  function displayImageInfo(photo){
    var $title = $("#title");
    var $description = $("#description");
    var $username = $("#username");
    var $link = $("#link");
    var $comments = $("#comments");
    var $views = $("#views");
    var $takenOn = $("#taken-on");

    $.ajax({
      method: 'get',
      url:'https://api.flickr.com/services/rest/?method=flickr.photos.getInfo',
      data:{
        api_key: apiKey,
        photo_id: photo.id,
        secret: photo.secret,
        format: "json"
      },
      dataType: 'jsonp',
      jsonp: 'jsoncallback',
      success: function(randomPhoto){
        console.log(randomPhoto);
        var url = randomPhoto.photo.urls.url[0]._content;
        console.log(url);
        $title
          .empty()
          .append(randomPhoto.photo.title._content);
        $description
          .empty()
          .append(randomPhoto.photo.description._content);
        $username
          .empty()
          .append(randomPhoto.photo.owner.username);
        $link
          .empty()
          .attr('href', url)
          .attr('target', "_blank")
          .append(url)
          .text("Click for Flickr page");
        $comments
          .append(randomPhoto.photo.comments._content);
        $views
          .append(randomPhoto.photo.views);
        $takenOn
          .append(randomPhoto.photo.dates.taken);
      },
      error: function(){
        console.log('failed to check flickr api');
      }
    });

  };

})

