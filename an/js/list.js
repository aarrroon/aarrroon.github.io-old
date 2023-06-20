"use strict";

console.log(foodPlaceList)

function showFoodPlaces() {
    const root = document.getElementById('food-table-body')
    root.innerHTML = ''
    // const table = document.createElement('tableimage.png')
    // const temp1 = document.createTextNode('Hasd')
    // temp.appendChild(temp1);
    for (let i = 0; i < foodPlaceList.listOfFoodPlaces.length; i++) {
        const row = document.createElement('tr');
        row.addEventListener("click", () => { deletePOI(i) }) // make row clickable

        const tdName = document.createElement('td');
        const temp1 = document.createTextNode(`${capitaliseFirstLetter(foodPlaceList._listOfFoodPlaces[i].placeLabel)}`);
        tdName.appendChild(temp1);

        const tdAddress = document.createElement('td');
        
        
        const temp2 = document.createTextNode(`${foodPlaceList._listOfFoodPlaces[i].suburb}`);
        tdAddress.appendChild(temp2);

        const tdType = document.createElement('td')
        const temp3 = document.createTextNode(`${capitaliseFirstLetter(foodPlaceList._listOfFoodPlaces[i].type)}`)
        tdType.appendChild(temp3);

        const tdPrice = document.createElement('td')
        const temp4 = document.createTextNode(`${foodPlaceList._listOfFoodPlaces[i].price}`)
        tdPrice.appendChild(temp4);

        row.appendChild(tdName);
        row.appendChild(tdAddress);
        row.appendChild(tdType);
        row.appendChild(tdPrice);
        root.appendChild(row);


    }

}

function capitaliseFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

function deletePOI(index) {
    if (confirm(`Do you want to delete the POI '${foodPlaceList.listOfFoodPlaces[index].placeLabel}'?`) == true) {
        foodPlaceList.removeFoodPlace(index);
        updateData(FOOD_LIST_KEY,foodPlaceList);
        showFoodPlaces()
    }
}

showFoodPlaces()