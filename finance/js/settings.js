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

displaySalaryInputs();
