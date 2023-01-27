
var map;
var service;
var cityElement = document.getElementById("location")
var occupationElement = document.getElementById("occupation")

function initMap(){
  var info = JSON.parse(localStorage.getItem("recoveryradarinfo")) //load last city and occupation user searched for, or search default city
  if (info==null){var lastsearch={City:"Salt Lake City",Occupation:"Resturant"};}else{var lastsearch=info.history[0];}
  getNearbyDoctorsInCity(lastsearch.City,lastsearch.Occupation,'map');
}

function getNearbyDoctorsInCity(city,occupation,element){    
  fetch("https://api.openweathermap.org/geo/1.0/direct?q="+city+"&appid=b02be164d047cfbed86694527d1d3a92").then((cities)=>cities.json()).then(function(cities){   
    
      var location = new google.maps.LatLng(cities[0].lat,cities[0].lon); // create google maps location based on what openweather api returned for city longitude and lat
      if (!map){map = new google.maps.Map(document.getElementById(element),{center:location,zoom:15});}// create map and service object if none exists yet
      if (!service){service = new google.maps.places.PlacesService(map);} 

      service.textSearch({location:location,radius:'500',query:occupation},function(results,status){
        
        // local storage
        var info = JSON.parse(localStorage.getItem("recoveryradarinfo")); // get info for recovery radar as an object
        if (info == null) { info = {history:[]}; } // if no info exists create base structure for json
        info.history.splice(0,0,{City:cities[0].name,Occupation:occupation}); // insert new city and occupation
        if (info.history.length>5){info.history.length=5;} // limit array to have 5 entries max
        localStorage.setItem("recoveryradarinfo",JSON.stringify(info));
        
        for(i=0;i<results.length;i++){ // add markers 
          new google.maps.Marker({ position: results[i].geometry.location, map: map,}); //label: results[i].icon
        }
})})} 

addEventListener('submit', (event) => {
  event.preventDefault();
  getNearbyDoctorsInCity(cityElement.value,occupationElement.value,'map');
  console.log(cityElement.value,occupationElement.value);
} )