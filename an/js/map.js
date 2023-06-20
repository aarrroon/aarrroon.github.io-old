"use strict";


let temp = null;


//sets center on a random marker
function randomCenter()
{
    if (foodPlaceList.listOfFoodPlaces.length != 0)
    {
        let centerIndex = Math.floor((Math.random())*(foodPlaceList.listOfFoodPlaces.length));
        let centerCoordinates = foodPlaceList.listOfFoodPlaces[centerIndex].coordinates;
        return centerCoordinates;
    }
    else 
    {
        let centerCoordinates = [144.946457,-37.840935]
        return centerCoordinates;
    }
}

//global code for map
mapboxgl.accessToken = MAPBOX_TOKEN;
let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: randomCenter(), // starting position [lng, lat]
    zoom: 14 // starting zoom
}
);


// ************ MODAL *************
// Get the modal
var modal = document.getElementById("modal-add");
// Get the button that opens the modal
var btn = document.getElementById("button-add-marker");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

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
    let addressRef = document.getElementById("address");

    let data = 
    {
        key: GEOCODE_TOKEN,
        q: addressRef.value,
        countrycode:"au",
        callback: "showData"
    }

    webServiceRequest(`https://api.opencagedata.com/geocode/v1/json`,data);

}


// Show the results in the modal popup
function showData(result)
{  
    console.log(result)
    temp = result;
    let container = document.getElementById("display-results");
    container.innerHTML = '';
    let i = 0;
    while (i < result.results.length && i < 4) {
        let node = document.createElement("button");
        let title = result.results[i].formatted;
        let textnode = document.createTextNode(title);
        let temp_index = i;
        node.appendChild(textnode);
        node.onclick = function() {
            saveChoice(temp_index)
        }
        container.appendChild(node);
        i++;
    }

}

function saveChoice(num) {
    let chosen = temp.results[num];
    let suburb = chosen.components.suburb;
    let lat = chosen.geometry.lat;
    let lng = chosen.geometry.lng;
    let title = document.getElementById("description").value;
    /* lng, lat */ 
    
    // Create new marker
    let marker = new mapboxgl.Marker({"color": "#0099ff"});
    marker.setLngLat([lng,lat]);
    // Create popup
    let popup = new mapboxgl.Popup({ offset: 45});
	popup.setHTML(title);
	marker.setPopup(popup)
	marker.addTo(map);
    // currentMarkers.push(marker);
	popup.addTo(map);


    // Close modal and change map view
    map.setCenter([lng, lat]);
    modal.style.display = "none";

    // Obtain the radio values of type
    let radiosPrice = document.getElementsByName('price');
    let radiosType = document.getElementsByName('type');
    
    let chosenType = null;
    let chosenPrice = null;
    // Obtain price 
    for (var i = 0; i < radiosPrice.length; i++) {
        if (radiosPrice[i].checked) {
          // do whatever you want with the checked radio
          chosenPrice = radiosPrice[i].value;
          break;
        }
    }

    // Obtain type
    for (var i = 0; i < radiosType.length; i++) {
        if (radiosType[i].checked) {
          // do whatever you want with the checked radio
          chosenType = radiosType[i].value;
          break;
        }
    }


    // Save POI into local storage
    let tempFood = new FoodPlace([lng, lat], title, chosenType, chosenPrice, suburb);
    foodPlaceList.addFoodPlace(tempFood);
    updateData(FOOD_LIST_KEY,foodPlaceList)
    
}

// Display saved POI markers 
function showFoodPlaces()
{
    for (let i = 0; i < foodPlaceList.listOfFoodPlaces.length; i++)
    {
        let marker = new mapboxgl.Marker({ "color": "#0099ff" });
        marker.setLngLat(foodPlaceList.listOfFoodPlaces[i].coordinates);
        let popup = new mapboxgl.Popup({ offset: 45});
        popup.setHTML(foodPlaceList.listOfFoodPlaces[i].placeLabel);
        marker.setPopup(popup)
        marker.addTo(map);
        popup.addTo(map);
    }
}

// // When screen is resized
// function onScreenResize() {
//     map.update();
// }

showFoodPlaces();



