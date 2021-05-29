"use strict";

let today = new Date();
let day = today.getDate();
let month = today.getMonth();
let ref = document.getElementById("daysTillNextAnniversary")
let daysLeft = -1;



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

