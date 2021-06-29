"use strict";
let currentAssetsRef = document.getElementById("currentAssets");
let nonCurrentAssetsRef = document.getElementById("nonCurrentAssets");
let liabilitiesRef = document.getElementById("liabilities");
let totalBalanceRef = document.getElementById("totalBalance");
let descriptionRef = document.getElementById("description");
let amountRef = document.getElementById("amount");

class Record 
{
    constructor(description="",amount="",type="")
    {
        this._description = description;
        this._amount = amount;
        this._type = type;
    }
    get description() {return this._description}
    get amount() {return this._amount}
    get type() {return this._type}
    set amount(newAmount){this._amount = newAmount}
    fromData(data)
    {
        this._description = data._description;
        this._amount = data._amount;
        this._type = data._type;
    }
}

class BalanceSheet 
{
    constructor()
    {
        this._listOfRecords = [];
        
    }
    get listOfRecords() {return this._listOfRecords}
    fromData(data) {
        for (let i = 0; i < data._listOfRecords.length; i++) {
            let tempRecord = new Record();
            tempBooking.fromData(data._listOfBookings[i])
            this._listOfBookings.push(tempBooking)
        }
    }
}

function getRadioButton() 
{
    let typeSelected = "";
    if (document.getElementById("inflow").checked == true) 
    {
        typeSelected = "Asset";
    }
    else if (document.getElementById("outflow").checked == true) 
    {
        typeSelected = "Liability";
    }
    return typeSelected
}

function addRecord()
{
    let tempRecord = new Record(descriptionRef.value,amountRef.value,getRadioButton());


}

