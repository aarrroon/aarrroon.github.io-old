"use strict";
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
    localStorage.setItem(FOOD_LIST_KEY, data);
    alert("You have imported data!");

}
