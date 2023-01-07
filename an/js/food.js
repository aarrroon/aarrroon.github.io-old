"use strict "

class FoodPlace {
// Constructor
	constructor(coordinates, placeLabel, type, price) {
		this._coordinates = coordinates;
		this._placeLabel = placeLabel;
        this._type = type;
        this._price = price;
		
	}

// Accessors
	get coordinates() { return this._coordinates; }
	get placeLabel() { return this._placeLabel; }
    get type() { return this._type; }
    get price() { return this._price; }


// Methods
	fromData(data) {
		this._coordinates = data._coordinates;
		this._placeLabel = data._placeLabel;
		this._price = data._price;
        this._type = data._type;
	}

}

// Class that has all the singular ride data
class FoodPlaceList {
  // Constructor
  constructor() 
  {
      this._listOfFoodPlaces = [];
  }

  // Accessors
  get listOfFoodPlaces() { return this._listOfFoodPlaces}

  // Methods
  addFoodPlace(foodPlace)//booking should be an object
  {
      this._listOfFoodPlaces.push(foodPlace)
  }
  removeFoodPlace(foodPlaceIndex) {
      this._listOfFoodPlaces.splice(foodPlaceIndex, 1);
  }
  fromData(data) {
      for (let i = 0; i < data._listOfFoodPlaces.length; i++) {
          let tempFoodPlace = new FoodPlace;
          tempFoodPlace.fromData(data._listOfFoodPlaces[i])
          this._listOfFoodPlaces.push(tempFoodPlace)
      }
  }
}

function checkData(key) {
  let storageData = localStorage.getItem(key);
  if (storageData) {
      return true;
  }
  else {
      return false;
  }
}

/*
The function updateData has the parameters 'data' and 'key'. If the 'data' is an object it stringies it first.
The function then saves the parameter 'data' to local storage and assigns it to the parameter 'key'. 
*/
function updateData(key, data) {
  let jsonData = data;
  if (typeof data == "object") {
      jsonData = JSON.stringify(data);
  }
  localStorage.setItem(key, jsonData);
}



/*
The function retrieveData has the parameter 'key'. This function retrieves data using the key parameter, and if data was 
previously an object, it parses it. Either way, it will return the data obtained.
*/
function retrieveData(key) {
  let data = localStorage.getItem(key);
  try {
      data = JSON.parse(data);
  }
  catch (e) {
  }
  finally {
      return data;
  }
}



//global code
let foodPlaceList = new FoodPlaceList();

//checks if there is existing data
if (checkData(FOOD_LIST_KEY) == true) 
{
	let data = retrieveData(FOOD_LIST_KEY);
	foodPlaceList.fromData(data);
}
// else if (checkData(FOOD_LIST_KEY) == false)
// {
// 	pushTransferData('{"_listOfFoodPlaces":[{"_coordinates":[145.140294,-37.9230559],"_placeLabel":"Wheels on Buns"},{"_coordinates":[145.1190533,-37.817669],"_placeLabel":"Zero Mode"},{"_coordinates":[145.09519,-37.88766],"_placeLabel":"Calia"},{"_coordinates":[145.0861079,-37.7868789],"_placeLabel":"Cafe Matta"},{"_coordinates":[145.1490439,-37.8322128],"_placeLabel":"Arshee Fried Chicken"},{"_coordinates":[144.9477124,-37.8147539],"_placeLabel":"Ilza Cafe"},{"_coordinates":[144.968306,-37.812553],"_placeLabel":"Udon Maedaya (very cheap Japanese)"},{"_coordinates":[144.9604122,-37.8088582],"_placeLabel":"Rose Garden BBQ (cheap)"},{"_coordinates":[144.9600583,-37.8322902],"_placeLabel":"Ayam Penyet Ria (robot Indonesian)"},{"_coordinates":[144.963178,-37.8095557],"_placeLabel":"Chilli India"},{"_coordinates":[144.956626,-37.809537],"_placeLabel":"Diner on Franklin"},{"_coordinates":[145.1651596718679,-37.87563299298202],"_placeLabel":"Omi"},{"_coordinates":[145.08349113684824,-37.88713659230647],"_placeLabel":"Omi"},{"_coordinates":[144.9605202,-37.8136278],"_placeLabel":"Namsan (korean)"},{"_coordinates":[144.9681913,-37.8108849],"_placeLabel":"Yamato"}]}')
// }

