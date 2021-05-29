"use strict";

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

showFoodPlaces();

