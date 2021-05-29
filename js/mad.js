"use strict";



function addMad()
{
    
    let problemRef = document.getElementById("problem");
    let evidenceRef = document.getElementById("evidence");
    let justifiedRef = document.getElementById("justified");
    if (problemRef.value === "")
    {
        let problemMsgRef = document.getElementById("problem_msg");
        problemMsgRef.innerText = "Double-check you have written the reason she is mad.";
        return;
    }
    else if (evidenceRef.value === "")
    {
        let evidenceMsgRef = document.getElementById("evidence_msg");
        evidenceMsgRef.innerText = "Double-check you have written what makes you think she is mad"
        return;
        
    }
    else if (justifiedRef.value === "")
    {
        let justifiedMsgRef = document.getElementById("justified_msg");
        justifiedMsgRef.innerText = "Double-check you have ticked whether she is justified or not.";
        return;
    }
    
    else 
    {
        consultSession.addStudent(fullNameRef.value, studentIdRef.value, problemRef.value);
        updateData(consultSession,APP_DATA_KEY);
        alert("The student has been added to the queue.");
        window.location = "index.html";
    }
}
