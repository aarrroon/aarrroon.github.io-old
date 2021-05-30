"use strict";

let today = new Date();
let day = today.getDate();
let month = today.getMonth();
let ref = document.getElementById("daysTillNextAnniversary");
let specialDayRef = document.getElementById("specialDay");
let daysLeft = -1;
const SPECIAL_DAY = new Date("22/12/2020");
const MILLISECONDS_IN_DAY = 1000*60*60*24;



function daysTillNextAnniversary()
{
    if (day == 22)
    {
        daysLeft = 0;
    }
    else if (month == 1 && day < 22) 
    {
        daysLeft = 22 - day;
        daysLeft.toString();
    }
    else if (month == 1 && day > 22 && today.getFullYear % 4 != 0)
    {
        daysLeft =  28 - day + 22;
    }
    else if (month == 1 && day > 22 && today.getFullYear % 4 == 0)
    {
        daysLeft =  29 - day + 22;
    }
    else if ((month == 8 || month == 3 || month == 5 || month == 10) && day < 22)
    {
        daysLeft = 22 - day;
        daysLeft.toString();
    }
    else if ((month == 8 || month == 3 || month == 5 || month == 10) && day > 22)
    {
        daysLeft =  30 - day + 22;
        daysLeft.toString();
    }
    else if (day < 22)
    {
        daysLeft = 22 - day;
    }    
    else if (day > 22)
    {
        daysLeft =  31 - day + 22;
    }
    
}
daysTillNextAnniversary();
ref.innerText = daysLeft;

function betweenTwoDates(firstDate, secondDate)
{
    specialDayRef.innerText = (secondDate.getTime() - firstDate.getTime())/MILLISECONDS_IN_DAY;
}
betweenTwoDates(SPECIAL_DAY,today);
