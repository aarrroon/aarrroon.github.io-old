"use strict";
/* 
Add Features:
1. randomise popup colours
2. view distance
*/



//global code for map
mapboxgl.accessToken = MAPBOX_TOKEN;
let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [144.946457,-37.840935], // starting position [lng, lat]
    zoom: 14 // starting zoom
}
);

//global variables
let currentMarkers = [];
let clickCoordinates = [];
let currentClickMarkers = [];

function webServiceRequest(url,data)
{
    // Build URL parameters from data object.
    let params = "";
    // For each key in data object...
    for (let key in data)
    {
        if (data.hasOwnProperty(key))
        {
            if (params.length == 0)
            {
                // First parameter starts with '?'
                params += "?";
            }
            else
            {
                // Subsequent parameter separated by '&'
                params += "&";
            }

            let encodedKey = encodeURIComponent(key);
            let encodedValue = encodeURIComponent(data[key]);

            params += encodedKey + "=" + encodedValue;
         }
    }
    let script = document.createElement('script');
    script.src = url + params;
    document.body.appendChild(script);
}

// TODO: complete the getData function
function getData()
{
    // TODO: retrieve the user input for the city name from HTML
    let cityRef = document.getElementById("city");
    // TODO: define the data to pass for the query string to the web service request function
    //       You will need to pass along the token as well as the callback
    //       See: https://aqicn.org/json-api/doc/#api-City_Feed-GetCityFeed
    let data = 
    {
        key: GEOCODE_TOKEN,
        q: cityRef.value,
        countrycode:"au",
        callback: "showData"
    }


    // TODO: Make the actual web service request to the URL https://api.waqi.info/feed/:city
    //       You need to replace the :city placeholder with the actual city name from the user input
    webServiceRequest(`https://api.opencagedata.com/geocode/v1/json`,data);

}

// TODO: complete the showData function
function showData(result)
{  
    let chosenLocationIndex = -5;
    let promptText = "Which of these is the desired location: (e.g. input '1')\r\n";
    let locationLabel = ""
    if (result.results.length == 0)
    {
        alert("No locations found. Try again.");
        return;
    }
    for (let i = 0; i < result.results.length; i++)
    {
        promptText += `${i+1}. ${result.results[i].formatted}\r\n`
    }
    
    

    let promptIndex = prompt(promptText)
    if (promptIndex == null)
    {
        return;
    }
    else
    {
        chosenLocationIndex = Number(promptIndex) - 1;
    }
    
    locationLabel = prompt("How would you like to label this location?")
    if (locationLabel == null)
    {
        locationLabel = result.results[chosenLocationIndex].formatted;
    }

    let coordinatesInput = [result.results[chosenLocationIndex].geometry.lng, result.results[chosenLocationIndex].geometry.lat]
    console.log(coordinatesInput)
    console.log(result.results[chosenLocationIndex].formatted)
    map.setCenter(coordinatesInput)
    let location = 
    {
        coordinates: coordinatesInput,
        description: locationLabel
    }
    let marker = new mapboxgl.Marker({"color": "#0099ff"});
    marker.setLngLat(coordinatesInput);
    let popup = new mapboxgl.Popup({ offset: 45});
	popup.setHTML(location.description);
	marker.setPopup(popup)
	marker.addTo(map);
    if (currentMarkers.length != 0) {
        for (let i = currentMarkers.length - 1; i >= 0; i--) {
            currentMarkers[i].remove();
        }

    }
    currentMarkers.push(marker);
	popup.addTo(map);
}

map.on('click', function (e) {
    // gives you coorindates of the location where the map is clicked	
    clickCoordinates = [e.lngLat.lng, e.lngLat.lat]
    let marker = new mapboxgl.Marker({ "color": "#0000FF" });
    marker.setLngLat(clickCoordinates);

    if (currentClickMarkers.length != 0) 
    {
        for (let i = currentClickMarkers.length - 1; i >= 0; i--) {
            currentClickMarkers[i].remove();
        }
        currentClickMarkers.pop();
    }
    marker.addTo(map);
    currentClickMarkers.push(marker);



});

function setMarker()
{
    if (currentMarkers.length != 0) 
    {
        currentMarkers[0].remove();
        currentMarkers.pop();
    }
    let locationLabel = "";
    currentClickMarkers[0].remove();
    currentClickMarkers.pop();
    let marker = new mapboxgl.Marker({ "color": "#FF8C00" });
    marker.setLngLat(clickCoordinates);
    let popup = new mapboxgl.Popup({ offset: 45});
    
    locationLabel = prompt("How would you like to label this location? (required)")
    popup.setHTML(locationLabel);
    marker.setPopup(popup)
    marker.addTo(map);
    popup.addTo(map);
    currentMarkers.push(marker);
}

function saveFoodPlace()
{
    let coords = [currentMarkers[0]._lngLat.lng,currentMarkers[0]._lngLat.lat]
    let label = currentMarkers[0]._popup._content.innerText.slice(0, -2)
    console.log(coords)
    console.log(label)
    let tempFood = new FoodPlace(coords,label);
    foodPlaceList.addFoodPlace(tempFood);
    updateData(FOOD_LIST_KEY,foodPlaceList)
    window.location = "foodhome.html"

}
