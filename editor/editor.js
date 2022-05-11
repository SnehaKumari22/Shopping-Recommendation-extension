document.addEventListener('DOMContentLoaded', function() {
   onLoad();
});
function onLoad(){
  chrome.storage.sync.get('foo', function(items) {
      
      response = JSON.parse(items.foo)
      getimage(response)
    });
}


function getimage(response){
var flg= response.flag
if (flg==="success"){
var urls= response.urls
var weburls = response.web_urls
var prices = response.prices

var imagediv1 = document.getElementById('img1div')
var imagediv2 = document.getElementById('img2div')
var imagediv3 = document.getElementById('img3div')
var imagediv4 = document.getElementById('img4div')

imagediv1.getElementsByTagName('img')[0].src = urls[0]
imagediv2.getElementsByTagName('img')[0].src =urls[1]
imagediv3.getElementsByTagName('img')[0].src= urls[2]
imagediv4.getElementsByTagName('img')[0].src =urls[3]

imagediv1.getElementsByTagName('a')[0].href = weburls[0]
imagediv2.getElementsByTagName('a')[0].href = weburls[1]
imagediv3.getElementsByTagName('a')[0].href=  weburls[2]
imagediv4.getElementsByTagName('a')[0].href = weburls[3]

imagediv1.getElementsByTagName('p')[0].innerHTML = prices[0]
imagediv2.getElementsByTagName('p')[0].innerHTML = prices[1]
imagediv3.getElementsByTagName('p')[0].innerHTML=  prices[2]
imagediv4.getElementsByTagName('p')[0].innerHTML = prices[3]
}}