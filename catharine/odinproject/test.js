"use strict";
/*
let output = "";
for (let i=0;i<110;i=i+10)
{
    let b = 0;
    if (i%40 == 0|| i%40 == 20)
    {
        b = 0;
    }
    else if (i%40 == 10)
    {
        b = 35;
    }
    else if (i%40 == 30)
    {
        b = -35;
    }

    output += `
    ${i}% {
        transform: translate(${b}px,${i+5}vh)
      }
    `;
}
console.log(output);

*/
let output = "";
for (let i=0;i<101;i++)
{
    let b = 0;
    if (i%20== 0)
    {
        b = 0;
    }
    else if (i%20 == 1)
    {
        b = 10;
    }
    else if (i%20 == 2)
    {
        b = 20;
    }
    else if (i%20 == 3)
    {
        b = 30;
    }
    else if (i%20 == 4)
    {
        b = 40;
    }
    else if (i%20 == 5)
    {
        b = 50;
    }
    else if (i%20== 6)
    {
        b = 40;
    }
    else if (i%20 == 7)
    {
        b = 30;
    }
    else if (i%20 == 8)
    {
        b = 20;
    }
    else if (i%20 == 9)
    {
        b = 10;
    }
    else if (i%20== 10)
    {
        b = 0;
    }
    else if (i%20== 11)
    {
        b = -10;
    }
    else if (i%20== 12)
    {
        b = -20;
    }
    else if (i%20== 13)
    {
        b = -30;
    }
    else if (i%20== 14)
    {
        b = -40;
    }
    else if (i%20== 15)
    {
        b = -50;
    }
    else if (i%20== 16)
    {
        b = -40;
    }
    else if (i%20== 17)
    {
        b = -30;
    }
    else if (i%20== 18)
    {
        b = -20;
    }
    else if (i%20== 19)
    {
        b = -10;
    }

    output += `
    ${i}% {
        transform: translate(${b}px,${i+5}vh)
      }
    `;
}
console.log(output);