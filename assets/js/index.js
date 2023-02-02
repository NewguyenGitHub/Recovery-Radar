
var map;
var service;
var markers = [];
var cityElement = document.getElementById("location")
var occupationElement = document.getElementById("occupation")
// var submitMap = document.getElementById("submit-map")
// var submitContact = document.getElementById("submit-contact")

function initMap(){
  var info = JSON.parse(localStorage.getItem("recoveryradarinfo")) //load last city and occupation user searched for, or search default city
  if (info==null){var lastsearch={City:"Salt Lake City",Occupation:"Resturant"};}else{var lastsearch=info.history[0];}
  getNearbyDoctorsInCity(lastsearch.City,lastsearch.Occupation,'map',mapstylers);
}

function getNearbyDoctorsInCity(city,occupation,element,mapstylers){    
  fetch("https://api.openweathermap.org/geo/1.0/direct?q="+city+"&appid=b02be164d047cfbed86694527d1d3a92").then((cities)=>cities.json()).then(function(cities){   
    
      var location = new google.maps.LatLng(cities[0].lat,cities[0].lon); // create google maps location based on what openweather api returned for city longitude and lat
      if (!map){map = new google.maps.Map(document.getElementById(element),{center:location,zoom:15,gestureHandling: "greedy"});}// create map and service object if none exists yet
      map.setOptions({styles: mapstylers});//set map style
      if (!service){service = new google.maps.places.PlacesService(map);}  
      for(i=0;i<markers.length;i++){ markers[i].setMap(null);} //clear markers

      service.textSearch({location:location,radius:'1000',query:occupation},function(results,status){
        
        // local storage
        var info = JSON.parse(localStorage.getItem("recoveryradarinfo")); // get info for recovery radar as an object
        if (info == null) { info = {history:[]}; } // if no info exists create base structure for json
        info.history.splice(0,0,{City:cities[0].name,Occupation:occupation}); // insert new city and occupation
        if (info.history.length>5){info.history.length=5;} // limit array to have 5 entries max
        localStorage.setItem("recoveryradarinfo",JSON.stringify(info));
        
        //console.log(results);

        //create markers and info window
        for(i=0;i<results.length;i++){ 

          var markerscale=(1-(i*.03));
          var customicon = {
            url: "https://www.seekpng.com/png/full/236-2363915_white-google-map-marker.png", // url
            scaledSize: new google.maps.Size(50*markerscale, 40*markerscale), // scaled size
          };

          markers[i] = new google.maps.Marker({ position: results[i].geometry.location, map: map, icon:customicon}); //label: results[i].icon //borderColor: '#386994',
          var address = results[i].formatted_address.split(',')[0];
          var content=  "<h1> " + results[i].name + "</h1> <br>" + 
                        "Address: " + address + "<br>" +
                        "Rating: " + results[i].rating + "<br>"
          markers[i]['infowindow'] = new google.maps.InfoWindow({content:content}); //give marker infowindow key value
          markers[i]['moreinfolink'] = "https://www.google.com/maps/place/?q=place_id:" + results[i].place_id ;
          markers[i].addListener("click",function(){ 
            window.open(this.moreinfolink,"_blank"); 
          }); // make infowindow open wheqn marker is pressed 
          markers[i].addListener("mouseover",function(){ this.infowindow.open(map,this)}); // make infowindow open when marker is hovered
          markers[i].addListener("mouseout",function(){ this.infowindow.close();}); // make infowindow close when pressed
        }

        //set zoom and location based on markers 
        map.panTo(location);
        //var bounds = new google.maps.LatLngBounds();
        //for(var i=0;i<markers.length;i++){
          //bounds.extend(markers[i]);
        //}
        //map.fitBounds(bounds);
        //console.log(bounds);

})})} 

var page= document.querySelector("#contactForm");
console.log(page)
function handleEmailForm(e){
  e.preventDefault()
  var message= document.getElementById("message").value
  console.log(message)
}
  

page.addEventListener("submit", handleEmailForm)
addEventListener('submit', (event) => {
  event.preventDefault();
  getNearbyDoctorsInCity(cityElement.value,occupationElement.value,'map',mapstylers);
})



var mapstylers = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#181818"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1b1b1b"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#2c2c2c"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8a8a8a"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#373737"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3c3c3c"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4a6d8c"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#4e4e4e"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#386994"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3d3d3d"
      }
    ]
  }
]

function myFunction() {
  var x, text;
  //Getting the value of the input field with id="edu"
  x = document.getElementById("con").value;
  // If x is less than 0, input is invalid
  //otherwise input is valid
  if (isNaN(x) || x < 0) {
  text = "Input invalid";
  } else {
  text = "A valid Input";
  }
  document.getElementById("conForm").innerHTML = text;
  }