
var map;
var service;
var infowindow;

function initMap() {
  getNearbyDoctorsInCity("provo","resturant",'map');
}

function getNearbyDoctorsInCity(city, occupation, element){
    fetch("https://api.openweathermap.org/geo/1.0/direct?q="+city+"&appid=b02be164d047cfbed86694527d1d3a92").then((cities)=>cities.json()).then(function(cities){   
    
    console.log(cities)

    var location = new google.maps.LatLng(cities[0].lat,cities[0].lon); // create google maps location based on longitude and lat

    
    // create map and service object if none exists yet
    if (!map){ map = new google.maps.Map(document.getElementById(element), {center: location ,zoom: 15}); }
    if (!service) { service = new google.maps.places.PlacesService(map); } 

    // make request to service with map if none exists yet 
    var request = { location: location, radius: '500', query: occupation};
    service.textSearch(request, function(results,status){
      
      console.log(results);
      
      for(i=0;i<results.length;i++){
        new google.maps.Marker({ position: results[i].geometry.location, map: map, label: results[i].icon});
      }

})})}

