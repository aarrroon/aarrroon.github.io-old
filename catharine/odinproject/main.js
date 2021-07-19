"use strict";
let heartRef = document.getElementById("heartsAnimation");
let heartRef2 = document.getElementById("heartsAnimation2");
let heartRef3 = document.getElementById("heartsAnimation3");
let output = "";
let output2 = "";
let output3 = "";
//MAKE A TIMER 

function heartAnimation()
{
    
    let randomNumber = Math.ceil((Math.random())*15);
    let randomSpacing = Math.ceil((Math.random())*15)+15;
    let randomSpacing2 = Math.ceil((Math.random())*15)+30;
    let randomSpacing3 = Math.ceil((Math.random())*15)+45;
    let randomSpacing4 = Math.ceil((Math.random())*15)+60;
    let randomSpacing5 = Math.ceil((Math.random())*15)+75;
    let randomSpacing6 = Math.ceil((Math.random())*15)+90;
    output += `<img id="heart" src="heart.png" style="margin-left: ${randomNumber-randomSpacing}vw; margin-top:-175px;">`
    output += `<img id="heart" src="heart.png" style="margin-left: ${randomNumber}vw; margin-top:-175px;">`
    output += `<img id="heart" src="heart.png" style="margin-left: ${randomSpacing2}vw; margin-top:-175px;">`
    output += `<img id="heart" src="heart.png" style="margin-left: ${randomSpacing3}vw; margin-top:-175px;">`
    output += `<img id="heart" src="heart.png" style="margin-left: ${randomSpacing4}vw; margin-top:-175px;">`
    output += `<img id="heart" src="heart.png" style="margin-left: ${randomSpacing5}vw; margin-top:-175px;">`
    output += `<img id="heart" src="heart.png" style="margin-left: ${randomSpacing6}vw; margin-top:-175px;">`
    heartRef.innerHTML = output;
    
}   
function heartAnimation2()
{
    
    let randomNumber = Math.ceil((Math.random())*15);
    let randomSpacing = Math.ceil((Math.random())*15)+15;
    let randomSpacing2 = Math.ceil((Math.random())*15)+30;
    let randomSpacing3 = Math.ceil((Math.random())*15)+45;
    let randomSpacing4 = Math.ceil((Math.random())*15)+60;
    let randomSpacing5 = Math.ceil((Math.random())*15)+75;
    let randomSpacing6 = Math.ceil((Math.random())*15)+90;
    output2 += `<img id="heart" src="heart.png" style="margin-left: ${randomNumber-randomSpacing}vw; margin-top:-175px;">`
    output2 += `<img id="heart" src="heart.png" style="margin-left: ${randomNumber}vw; margin-top:-175px;">`
    output2 += `<img id="heart" src="heart.png" style="margin-left: ${randomSpacing2}vw; margin-top:-175px;">`
    output2 += `<img id="heart" src="heart.png" style="margin-left: ${randomSpacing3}vw; margin-top:-175px;">`
    output2 += `<img id="heart" src="heart.png" style="margin-left: ${randomSpacing4}vw; margin-top:-175px;">`
    output2 += `<img id="heart" src="heart.png" style="margin-left: ${randomSpacing5}vw; margin-top:-175px;">`
    output2 += `<img id="heart" src="heart.png" style="margin-left: ${randomSpacing6}vw; margin-top:-175px;">`
    heartRef2.innerHTML = output2;
    
}   

function heartAnimation3()
{
    
    let randomNumber = Math.ceil((Math.random())*15);
    let randomSpacing = Math.ceil((Math.random())*15)+15;
    let randomSpacing2 = Math.ceil((Math.random())*15)+30;
    let randomSpacing3 = Math.ceil((Math.random())*15)+45;
    let randomSpacing4 = Math.ceil((Math.random())*15)+60;
    let randomSpacing5 = Math.ceil((Math.random())*15)+75;
    let randomSpacing6 = Math.ceil((Math.random())*15)+90;
    output3 += `<img id="heart" src="heart.png" style="margin-left: ${randomNumber-randomSpacing}vw; margin-top:-175px;">`
    output3 += `<img id="heart" src="heart.png" style="margin-left: ${randomNumber}vw; margin-top:-175px;">`
    output3 += `<img id="heart" src="heart.png" style="margin-left: ${randomSpacing2}vw; margin-top:-175px;">`
    output3 += `<img id="heart" src="heart.png" style="margin-left: ${randomSpacing3}vw; margin-top:-175px;">`
    output3 += `<img id="heart" src="heart.png" style="margin-left: ${randomSpacing4}vw; margin-top:-175px;">`
    output3 += `<img id="heart" src="heart.png" style="margin-left: ${randomSpacing5}vw; margin-top:-175px;">`
    output3 += `<img id="heart" src="heart.png" style="margin-left: ${randomSpacing6}vw; margin-top:-175px;">`
    heartRef3.innerHTML = output3;
    
}  

heartAnimation();


const UPDATE_TIME_MS = 2500;
let intervalHandle = setTimeout(heartAnimation2, 4000)
let intervalHandle2 = setTimeout(heartAnimation3, 9000)

intervalHandle;
intervalHandle2;







