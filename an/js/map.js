"use strict";
const FOOD_LIST_KEY = "foodListKey";
const MAPBOX_TOKEN = "pk.eyJ1IjoiYWFycm9vbiIsImEiOiJjbGNrNXFhZnUwNXVyM25teHJ6MmJ4enQ4In0.gAHuVBrY2F7BRecWiDQlgA";
const GEOCODE_TOKEN = '18d4bb5124ea434291f1c92ff6a4f916';

let temp = null;
let chosen = null;
let lng = 0;
let lat = 0;
let title = null;

// //sets center on a random marker
// function randomCenter()
// {
//     if (foodPlaceList.listOfFoodPlaces.length != 0)
//     {
//         let centerIndex = Math.floor((Math.random())*(foodPlaceList.listOfFoodPlaces.length));
//         let centerCoordinates = foodPlaceList.listOfFoodPlaces[centerIndex].coordinates;
//         return centerCoordinates;
//     }
//     else 
//     {
//         let centerCoordinates = [144.946457,-37.840935]
//         return centerCoordinates;
//     }
// }

//global code for map
mapboxgl.accessToken = MAPBOX_TOKEN;
let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [144.946457,-37.840935], // starting position [lng, lat]
    zoom: 14 // starting zoom
}
);

// function showFoodPlaces()
// {
//     for (let i = 0; i < foodPlaceList.listOfFoodPlaces.length; i++)
//     {
//         let marker = new mapboxgl.Marker({ "color": "#0099ff" });
//         marker.setLngLat(foodPlaceList.listOfFoodPlaces[i].coordinates);
//         let popup = new mapboxgl.Popup({ offset: 45});
//         popup.setHTML(foodPlaceList.listOfFoodPlaces[i].placeLabel);
//         marker.setPopup(popup)
//         marker.addTo(map);
//         popup.addTo(map);
//     }
// }

// showFoodPlaces();

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


// TODO: complete the showData function
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
    chosen = temp.results[num]

    lat = chosen.geometry.lat;
    lng = chosen.geometry.lng;
    title = document.getElementById("description").value;
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


    
    map.setCenter([lng, lat]);
    modal.style.display = "none";
}

