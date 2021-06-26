"use strict";
//constants
const WEEK_LIST_KEY = "weekListKey"; 
const SETTINGS_KEY = "settingKey";
/*
 The function checkData has parameter 'key', and is used to check whether there is data saved to that parameter 'key'
 in local storage. If there is, it returns true, if not, it returns false. 
*/
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