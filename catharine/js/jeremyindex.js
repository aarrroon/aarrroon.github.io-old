'use strict';
let today = new Date();
let day = today.getDate();
let month = today.getMonth();
let ref = document.getElementById("daysTillNextAnniversary");
let specialDayRef = document.getElementById("specialDay");
let firstDateRef = document.getElementById("firstDate");
let daysLeft = -1;
const SPECIAL_DAY = new Date("08 June 2021");

const MILLISECONDS_IN_DAY = 1000*60*60*24;

function betweenTwoDates(firstDate, secondDate,ref)
{
    ref.innerText = Math.floor((secondDate.getTime() - firstDate.getTime())/MILLISECONDS_IN_DAY);
}
betweenTwoDates(SPECIAL_DAY,today,specialDayRef);