"use strict"; 
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
    //header row
    output += `<tr>
    <th>Week Starts On</th>
    <th></th>
    <th></th>
    <th></th>
    <th></th>
    <th></th>
    <th></th>
    <th>Week Starts On</th>
    <th></th>
    <th></th>
    <th></th>
    <th></th>
    <th></th>
    <th></th>
    <th>Total Hours Worked</th>
    <th>Paycheck</th>
    </tr>
    
    
    
    `
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
                    output += `<td style="color:darkgreen"><b>${weekList.listOfWeeks[i].listOfShifts[k]._day}</b></td>`;
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
                    output += `<td style="color:darkgreen"><b>${weekList.listOfWeeks[i+1].listOfShifts[k]._day}</b></td>`;
                }
            }
            output += `<td></td>`
            output += `<td></td>`
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
            output += `<td style="color:red;font-weight:bold">${hoursWorkedInFortnight}</td>`
            output += `<td style="color:red;font-weight:bold">$${totalPay.toFixed(2)}</td>`
            output += `</tr>`
            
        }
    //if there is an odd number of week, this adds the extra week
    if (weekList.listOfWeeks.length % 2 == 1)
    {
        let hoursWorkedInFortnight = 0;
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
                output += `<td style="color:darkgreen;font-weight:bold">${weekList.listOfWeeks[i].listOfShifts[k]._day}</td>`;
                hoursWorkedInFortnight += Number(weekList._listOfWeeks[i]._listOfShifts[k]._duration);
            }
        }
        output += `<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>`
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
        output += `<td></td><td></td><td></td><td></td><td></td><td></td><td></td>`
        let totalPay = hoursWorkedInFortnight*hourlySalary;
        output += `<td style="color:red;font-weight:bold">${hoursWorkedInFortnight}</td>`
        output += `<td style="color:red;font-weight:bold">$${totalPay.toFixed(2)}</td>`
        output += `</tr>`
        
    }
    output += `</table>`
    
    
    let displayRef = document.getElementById("display");
    displayRef.innerHTML = output;
}

function goToAdiInsights()
{
    const MILLISECONDS_IN_DAY = 86400000;
    let largestWeekIndex = -1;
    if (weekList.listOfWeeks.length != 0)
    {
        largestWeekIndex = weekList.listOfWeeks.length-1;
    }
    let latestDate = new Date(weekList.listOfWeeks[largestWeekIndex].startingDate);
    let updatedDate = new Date(latestDate.getTime() + MILLISECONDS_IN_DAY)
    console.log(updatedDate);
    let day = updatedDate.getDate() + 1;
    let month = updatedDate.getMonth() + 1;
    let url = `https://see.adiinsights.com/shifts/?unit=6145&date=2021-${month}-${day}`;
    window.location.replace(url);
}

//GLOBAL CODE
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