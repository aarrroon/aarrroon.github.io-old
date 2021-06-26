"use strict"; 


//global variables
let oldestWeek = new Date("30 May 2021"); //CAN BE CHANGED IN SETTINGS.HTML
let hourlySalary = 21;
let hourlySalaryWeekend = 23;




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

/////////////////////////////////////////////////////////////////////////////////////////////
//function that displays the inputs div 
function displayWeekSelection()
{
    let weekSelectionRef = document.getElementById("weekSelection")
    let output ="";
    output +=`
    <label for="week">Choose a week:</label>
    <select name="week" id="week">
    <option value="" selected hidden>Select a week</option>
    `;
    for (let i=0;i<weekList.listOfWeeks.length;i++)
    {
        let tempDate = new Date(weekList.listOfWeeks[i].startingDate);
        output += `
        <option value="${weekList.listOfWeeks[i].weekNumber}">Week ${weekList.listOfWeeks[i].weekNumber} (starts: ${tempDate.toDateString()}</option>
        `;
    } 
    output += `</select>`;
    weekSelectionRef.innerHTML = output; 
}

//function that checks if the current week is a new week 
function checkForNewWeek()
{
    let largestWeekIndex = -1;
    if (weekList.listOfWeeks.length != 0)
    {
        largestWeekIndex = weekList.listOfWeeks.length-1;
    }
    const MILLISECONDS_IN_WEEK = 604800000;
    let latestDate = new Date(weekList.listOfWeeks[largestWeekIndex].startingDate)
    let today = Date.now();
    if (today-latestDate.getTime() > MILLISECONDS_IN_WEEK)
    {
        //need to make new week
        let newWeekMilliseconds = latestDate.getTime()+MILLISECONDS_IN_WEEK;
        let tempDate = new Date()
        tempDate = tempDate.setTime(newWeekMilliseconds);
        let tempDateNew = new Date(tempDate)
        let tempNumber = largestWeekIndex+2;
        let tempWeek = new Week(tempNumber.toString(),tempDateNew);
        weekList.listOfWeeks.push(tempWeek);
        displayWeekSelection()
        updateData(WEEK_LIST_KEY,weekList)
    }
    
}

//function that creates new shift
function newShift()
{
    let selectedWeekValue = document.getElementById("week").value;
    let selectedDayValue = document.getElementById("day").value;
    let hoursValue = document.getElementById("hours").value;
    let tempShift = new Shift(selectedDayValue,selectedWeekValue,hoursValue)
    if (selectedWeekValue == "" || selectedDayValue == "" || hoursValue == "")
    {
        alert("Please confirm you have inputted all the required values.");
        return;
    }
    if (confirm(`Would you like to add the ${hoursValue} hour shift on the ${selectedDayValue} of Week ${selectedWeekValue}?`))
    {
        weekList.listOfWeeks[tempShift.week-1].addShift(tempShift);
        updateData(WEEK_LIST_KEY,weekList);
    }
    displayShifts();
}


function displayShifts()
{
    let output = "";
    output += `<table>`
    let timesToRunFunction = -1;
    if (weekList.listOfWeeks.length % 2 == 0)
    {
        timesToRunFunction = weekList.listOfWeeks.length;     
    }
    else 
    {
        timesToRunFunction = weekList.listOfWeeks.length-1
    }
    for (let i = 0; i < timesToRunFunction ;i+=2)
        { 
            //first row
            let hoursWorkedInFortnight = 0;
            output += `<tr>`
            let tempDate = new Date(weekList.listOfWeeks[i].startingDate)
            output += `<td><b>${tempDate.toDateString()}</b></td>`

            for (let k = 0; k<6;k++)
            {
                if (weekList.listOfWeeks[i].listOfShifts[k] == undefined)
                {
                    output += `<td>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td>`;
                }
                else 
                {
                    output += `<td>${weekList.listOfWeeks[i].listOfShifts[k]._day}</td>`;
                }
            }
            tempDate = new Date(weekList.listOfWeeks[i+1].startingDate)
            output += `<td><b>${tempDate.toDateString()}</b></td>`
            for (let k = 0; k<6;k++)
            {
                if (weekList.listOfWeeks[i+1].listOfShifts[k] == undefined)
                {
                    output += `<td>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td>`;
                }
                else 
                {
                    output += `<td>${weekList.listOfWeeks[i+1].listOfShifts[k]._day}</td>`;
                }
            }
            output += `<td>Total Hours Worked</td>`
            output += `<td>Paycheck</td>`
            output += `</tr>`
            //second row
            output += `<tr>`
            output += `<td></td>`
            for (let k = 0; k<6;k++)
            {
                if (weekList._listOfWeeks[i]._listOfShifts[k] == undefined)
                {
                    output += `<td>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td>`;
                }
                else 
                {
                    output += `<td>${weekList._listOfWeeks[i]._listOfShifts[k]._duration}</td>`;
                    hoursWorkedInFortnight += Number(weekList._listOfWeeks[i]._listOfShifts[k]._duration);
                }
            }
            output += `<td></td>`
            for (let k = 0; k<6;k++)
            {
                if (weekList.listOfWeeks[i+1].listOfShifts[k] == undefined)
                {
                    output += `<td>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td>`;
                }
                else 
                {
                    output += `<td>${weekList._listOfWeeks[i+1]._listOfShifts[k]._duration}</td>`;
                    hoursWorkedInFortnight += Number(weekList._listOfWeeks[i+1]._listOfShifts[k]._duration);
                }
            }
            let totalPay = hoursWorkedInFortnight*hourlySalary;
            output += `<td>${hoursWorkedInFortnight}</td>`
            output += `<td>$${totalPay.toFixed(2)}</td>`
            output += `</tr>`
            
        }
    //if there is an odd number of week, this adds the extra week
    if (weekList.listOfWeeks.length % 2 == 1)
    {
        output += `<tr>`
        let i = weekList.listOfWeeks.length-1;
        let tempDate = new Date(weekList.listOfWeeks[i].startingDate)
        output += `<td><b>${tempDate.toDateString()}</b></td>`

        for (let k = 0; k<6;k++)
        {
            if (weekList.listOfWeeks[i].listOfShifts[k] == undefined)
            {
                output += `<td>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td>`;
            }
            else 
            {
                output += `<td>${weekList.listOfWeeks[i].listOfShifts[k]._day}</td>`;
            }
        }
        output += `</tr>`
        output += `<tr>`
        output += `<td></td>`
        for (let k = 0; k<6;k++)
        {
            if (weekList._listOfWeeks[i]._listOfShifts[k] == undefined)
            {
                output += `<td>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td>`;
            }
            else 
            {
                output += `<td>${weekList._listOfWeeks[i]._listOfShifts[k]._duration}</td>`;
            }
        }
        output += `</tr>`
        
    }
    output += `</table>`
    
    
    let displayRef = document.getElementById("display");
    displayRef.innerHTML = output;
}
//global code
//checks if there is existing data
let weekList = new WeekList;
//checks if there is payslip data
if (checkData(WEEK_LIST_KEY) == true) {
    let data = retrieveData(WEEK_LIST_KEY);
    weekList.fromData(data);
}
else {
    let week1 = new Week("1",oldestWeek);
    weekList.addWeek(week1);
    let tempToday = Date.now();
    let oldestMilliseconds = oldestWeek.getTime();
    let i = 1;
    while (((tempToday - oldestMilliseconds)/518400000) - i > 1)
    {
        checkForNewWeek();
        i++;
    }
}

//checks if there are previous settings data
if (checkData(SETTINGS_KEY) == true) {
    let data = retrieveData(SETTINGS_KEY);
    hourlySalary = Number(data.hourlySalary);
    hourlySalaryWeekend = Number(data.hourlySalaryWeekend);
}
else 
{
    let errorSettingsRef = document.getElementById("errorBanner")
    errorSettingsRef.innerHTML = `
    <h1>
        Please click on the settings icon to set your salary and other settings.
    </h1>
    
    `
}


displayWeekSelection();
checkForNewWeek();
displayShifts();





//TESTS!!!!
//test 1: see if fromdata for shift and week works AND weekList works
/*
let week1 = new Week("1","25 June 2021");
let shift = new Shift("thursday","1","6.5")
week1.addShift(shift);
weekList.addWeek(week1);

updateData(WEEK_LIST_KEY,weekList)
*/
//RUBBISH
/*
    let j = 0;
    for (let i = 0; i < weekList.listOfWeeks.length ;i++)
    {
        
        if (j%2 == 0 && j!=0)
        {
            output += `</tr>
            <tr>
            <td>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td>
            `
            for (let k = 0; k < 6;k++)
            {
                if (weekList.listOfWeeks[i].listOfShifts[k] == undefined)
                {
                    output += `<td>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td>`;
                }
                else 
                {
                    output += `<td>${weekList.listOfWeeks[i].listOfShifts[k].duration}</td>`;
                }
            }
            for (let k = 0; k < 6;k++)
            {
                if (weekList.listOfWeeks[i+1].listOfShifts[k] == undefined)
                {
                    output += `<td>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td>`;
                }
                else 
                {
                    output += `<td>${weekList.listOfWeeks[i+1].listOfShifts[k].duration}</td>`;
                }
            }
        }
        let tempDate = new Date(weekList.listOfWeeks[i].startingDate)
        output += `
        
        <td>${tempDate.toDateString()}</td>`
        for (let k = 0; k < 6;k++)
        {
            if (weekList.listOfWeeks[i].listOfShifts[k] == undefined)
            {
                output += `<td>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td>`;
            }
            else 
            {
                output += `<td>${weekList.listOfWeeks[i].listOfShifts[k].day}</td>`;
            }
        }
        j++;
    }
    output +=`</tr></table>`
    */

    /*
{"_listOfWeeks":[{"_weekNumber":"1","_startingDate":"2021-05-29T14:00:00.000Z","_listOfShifts":[{"_day":"Wednesday","_week":"1","_duration":"6.5"},{"_day":"Thursday","_week":"1","_duration":"6.5"},{"_day":"Friday","_week":"1","_duration":"4"}]},{"_weekNumber":"2","_startingDate":"2021-06-05T14:00:00.000Z","_listOfShifts":[{"_day":"Monday","_week":"2","_duration":"6.5"},{"_day":"Friday","_week":"2","_duration":3.5}]},{"_weekNumber":"3","_startingDate":"2021-06-12T14:00:00.000Z","_listOfShifts":[{"_day":"Thursday","_week":"3","_duration":"5.5"},{"_day":"Friday","_week":"3","_duration":"6"}]},{"_weekNumber":"4","_startingDate":"2021-06-19T14:00:00.000Z","_listOfShifts":[{"_day":"Monday","_week":"4","_duration":"6.5"},{"_day":"Tuesday","_week":"4","_duration":"6.5"},{"_day":"Wednesday","_week":"4","_duration":"6.5"},{"_day":"Thursday","_week":"4","_duration":"6.5"}]},{"_weekNumber":"5","_startingDate":"2021-06-26T14:00:00.000Z","_listOfShifts":[]}]}
{"hourlySalary":"21.78","hourlySalaryWeekend":"23"}
    */