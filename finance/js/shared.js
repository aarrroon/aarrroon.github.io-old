"use strict";
//constants
const WEEK_LIST_KEY = "weekListKey"; 
const SETTINGS_KEY = "settingKey";

//global variables
let oldestWeek = new Date("30 May 2021"); //CAN BE CHANGED IN SETTINGS.HTML
let hourlySalary = 21;
let hourlySalaryWeekend = 23;

//Default Functions
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

//Classes
class Shift
{
    constructor(day ="",week="",duration="")
    {
        this._day = day;
        this._week = week;
        this._duration = duration;
    }
    get day() {return this._day}
    get week() {return this._week}
    get duration() {return this._duration}

    fromData(data)
    {
        this._day = data._day;
        this._week = data._week;
        this._duration = data._duration;
    }
}
class Week
{
    constructor(weekNumber,startingDate)
    {
        this._weekNumber = weekNumber;
        this._startingDate = startingDate;
        this._listOfShifts = [];
    }
    get weekNumber() {return this._weekNumber}
    get startingDate() {return this._startingDate}
    get listOfShifts() {return this._listOfShifts}

    getTotalHours()
    {
        //****NEED TO CONTINUE */
    }
    addShift(shift)
    {
        this._listOfShifts.push(shift);
    }
    removeShift(index)
    {
        this._listOfShifts.splice(index,1);
    }
    fromData(data)
    {
        for (let i = 0; i < data._listOfShifts.length; i++)
        {
            let tempShift = new Shift();
            tempShift.fromData(data._listOfShifts[i]);
            this._listOfShifts.push(tempShift);
        }
        this._weekNumber = data._weekNumber;
        this._startingDate = data._startingDate;
        this._listOfShifts = data._listOfShifts;
    }
}
class WeekList
{
    constructor()
    {
        this._listOfWeeks = [];
    }
    get listOfWeeks() {return this._listOfWeeks}

    updateWeek(week)
    {
        //FINISH THIS OFF
    }
    addWeek(week)
    {
        this._listOfWeeks.push(week);
    }
    fromData(data)
    {
        for (let i=0;i<data._listOfWeeks.length;i++)
        {
            let tempWeek = new Week();
            tempWeek.fromData(data._listOfWeeks[i]);
            this._listOfWeeks.push(tempWeek);   
        }
    }
}

//global code
//checks if there is existing data
let weekList = new WeekList;


