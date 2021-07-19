"use strict";
//DOM references
let weekdaySalaryRef = document.getElementById("weekdaySalary");
let weekendSalaryRef = document.getElementById("weekendSalary");
let salaryRef = document.getElementById("salary")

function displaySalaryInputs()
{
    let output = "";
    let hourlySalary = "e.g. 20";
    let hourlySalaryWeekend = "e.g. 23";
    if (checkData(SETTINGS_KEY) == true) {
        let data = retrieveData(SETTINGS_KEY);
        hourlySalary = `Current: ${data.hourlySalary}`;
        hourlySalaryWeekend = `Current: ${data.hourlySalaryWeekend}`;

    }
    output += `
    <label for="weekdaySalary">Weekday Salary</label>
    <input type="text" id="weekdaySalary" name="weekdaySalary" placeholder="${hourlySalary}">
    <label for="weekendSalary">Weekend Salary</label>
    <input type="text" id="weekendSalary" name="weekendSalary" placeholder="${hourlySalaryWeekend}">
    `
    salaryRef.innerHTML = output;
}

function saveSettings()
{
    weekdaySalaryRef = document.getElementById("weekdaySalary");
    weekendSalaryRef = document.getElementById("weekendSalary");
    if (weekdaySalaryRef.value == "" || weekdaySalaryRef.value == "")
    {
        alert("Double check you have inputed in both fields.")
        return;
    }
    if (confirm("Double check if input is correct!")==true)
    {
        let tempWeekdaySalary = weekdaySalaryRef.value;
        let tempWeekendSalary = weekendSalaryRef.value;
        let settings = 
        {
            hourlySalary: tempWeekdaySalary,
            hourlySalaryWeekend: tempWeekendSalary
        }
        updateData(SETTINGS_KEY, settings)
    }
    
}

function exportData(data) 
{
    let jsonData = data;
    if (typeof data == "object") {
        jsonData = JSON.stringify(data);
    }
    let ref = document.getElementById("exportText");
    ref.innerText = jsonData;
}

function importData()
{
    let ref = document.getElementById("importText");
    let data = ref.value;
    localStorage.setItem(WEEK_LIST_KEY, data);
    alert("You have imported data!");
}

function resetData()
{
    let data ='{"_listOfWeeks":[{"_weekNumber":"1","_startingDate":"2021-05-29T14:00:00.000Z","_listOfShifts":[{"_day":"Wednesday","_week":"1","_duration":"6.5"},{"_day":"Thursday","_week":"1","_duration":"6.5"},{"_day":"Friday","_week":"1","_duration":"4"}]},{"_weekNumber":"2","_startingDate":"2021-06-05T14:00:00.000Z","_listOfShifts":[{"_day":"Monday","_week":"2","_duration":"6.5"},{"_day":"Friday","_week":"2","_duration":3.5}]},{"_weekNumber":"3","_startingDate":"2021-06-12T14:00:00.000Z","_listOfShifts":[{"_day":"Thursday","_week":"3","_duration":"5.5"},{"_day":"Friday","_week":"3","_duration":"6"}]},{"_weekNumber":"4","_startingDate":"2021-06-19T14:00:00.000Z","_listOfShifts":[{"_day":"Monday","_week":"4","_duration":"6.5"},{"_day":"Tuesday","_week":"4","_duration":"6.5"},{"_day":"Wednesday","_week":"4","_duration":"6.5"},{"_day":"Thursday","_week":"4","_duration":"6.5"}]},{"_weekNumber":"5","_startingDate":"2021-06-26T14:00:00.000Z","_listOfShifts":[{"_day":"Monday","_week":"5","_duration":"6.5"},{"_day":"Wednesday","_week":"5","_duration":"6.5"},{"_day":"Thursday","_week":"5","_duration":"6.5"}]},{"_weekNumber":"6","_startingDate":"2021-07-03T14:00:00.000Z","_listOfShifts":[{"_day":"Thursday","_week":"6","_duration":"6.5"},{"_day":"Friday","_week":"6","_duration":"7"}]},{"_weekNumber":"7","_startingDate":"2021-07-10T14:00:00.000Z","_listOfShifts":[{"_day":"Monday","_week":"7","_duration":"6.5"},{"_day":"Tuesday","_week":"7","_duration":"6.5"},{"_day":"Wednesday","_week":"7","_duration":"6.5"},{"_day":"Thursday","_week":"7","_duration":"6.5"}]},{"_weekNumber":"8","_startingDate":"2021-07-17T14:00:00.000Z","_listOfShifts":[{"_day":"Tuesday","_week":"8","_duration":"6.5"},{"_day":"Wednesday","_week":"8","_duration":"6.5"},{"_day":"Friday","_week":"8","_duration":"6.5"}]}]}';
    localStorage.setItem(WEEK_LIST_KEY, data);
    alert("You have reset your data!");
}

displaySalaryInputs();
