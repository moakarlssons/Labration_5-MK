"use strict";
/*
 * Laboration 5 - Studentkortsgenerator
 * Namn: Moa Karlsson
 */

// Hämta element från DOM
const form = document.querySelector("#studentform");
const clearButton = document.querySelector("#clear");

const fullnameInput = document.querySelector("#fullname");
const emailInput = document.querySelector("#email");
const phoneInput = document.querySelector("#phone");
const fontSelect = document.querySelector("#font");

const previewFullname = document.querySelector("#previewfullname");
const previewEmail = document.querySelector("#previewemail");
const previewPhone = document.querySelector("#previewphone");

const errorList = document.querySelector("#errorlist");
const historySection = document.querySelector("#history");
const deleteHistoryButton = document.querySelector("#delete");


// Array som används för felmeddelanden
let errors = [];

// Array som innehåller sparade studentkort
let history = [];

/**
 * Validerar formulärets inmatning.
 * @returns {boolean}
 */
function validateForm() {
    // Kontrollera formulärets obligatoriska fält
    const nameValue = fullnameInput.value.trim();
    const emailValue = emailInput.value.trim();
    const phoneValue = phoneInput.value.trim();
    let validate = true;

    errors = [];
    errorList.innerHTML = "";

    // Validerar formuläret
    if (nameValue === "") {
        errors.push("Ange ditt namn");
        validate = false;
    }

    if (emailValue.length === 0) {
        errors.push("Ange din e-postadress");
        validate = false;
    }

    if (!emailValue.includes("@")) {
        errors.push("Ange en giltig e-postadress");
        validate = false;
    }

    if (phoneValue.length === 0) {
        errors.push("Ange ditt telefon nummer");
        validate = false;
    }

    // Returnera resultatet (true eller false) av valideringen
    return validate;
}


/**
 * Visar felmeddelanden på sidan.
*/
function displayErrors() {
    // Rensa tidigare felmeddelanden
    if (errors.length > 0) {
        for (let i = 0; i < errors.length; i++) {
            const liEl = document.createElement("li");
            liEl.innerHTML = errors[i];

            errorList.appendChild(liEl);
        }
    }
}

/**
 * Skapar ett studentkort och visar det på sidan.
 */
function createStudentCard() {
    // Hämta information från formuläret
    let fullname = fullnameInput.value;
    let email = emailInput.value;
    let phone = phoneInput.value;
    let font = fontSelect.value;

    // Uppdatera studentkortet
    previewFullname.innerHTML = fullname;
    previewEmail.innerHTML = email;
    previewPhone.innerHTML = phone;

    // Skapar ett student objekt
    const student = {
        name: fullname,
        email: email,
        phone: phone,
        font: font
    }

    renderHistory(student);
}


/**
 * Sparar historiken i localStorage.
 */
function saveHistory(student) {
    // Hämta historik från localStorage
    history = JSON.parse(loadHistory());

    if (history === null) {
        history = [];
    }
    // Lägg till student först i array och sparar till local storage
    history.unshift(student);
    const studentsJson = JSON.stringify(history);
    localStorage.setItem("students", studentsJson);
}


/**
 * Läser in tidigare historik från localStorage.
 */
function loadHistory() {
    // Hämta eventuell sparad historik
    const localStorageInfo = localStorage.getItem("students");
    return localStorageInfo;
}


/**
 * Visar historiken på sidan.
 */
function renderHistory(student) {
    // Sparar student i historiken
    saveHistory(student);

    // Skriv ut historiken till DOM
    writeHistory();
}

function writeHistory() {
    historySection.innerHTML = "";
    // Hämta historiken från localStorage
    history = JSON.parse(loadHistory());

    if (history === null) {
        history = [];
    }
    // Skapar studentkort utifrån historiken
    for (let i = 0; i < history.length; i++) {
        const sectionEl = document.createElement("section");
        const pEl = document.createElement("p");
        pEl.innerHTML = `Student: ${history[i].name}
            <br>
            E-post: ${history[i].email}
            <br>
            Telefon: ${history[i].phone}
            <br>
            Typsnitt: ${history[i].font}
            `;
        // Lägger till studentkorten i DOM
        sectionEl.appendChild(pEl);
        historySection.appendChild(sectionEl);
    }
}

/**
 * Rensar formulär, aktuellt studentkort och felmeddelanden.
 */
function clearForm() {
    // Nollställer fälten i formuläret
    fullnameInput.value = "";
    emailInput.value = "";
    phoneInput.value = "";
    fontSelect.selectedIndex = 0;

    errors = [];
    errorList.innerHTML = "";
}

/**
 * Raderar hela historiken.
 */
function deleteHistory() {
    history = [];
    historySection.innerHTML = "";
    localStorage.removeItem("students");
}

// Eventlyssnare

// När formuläret skickas:
form.addEventListener("submit", function (event) {
    event.preventDefault();
    // - validera inmatningen
    let valid = validateForm();
    if (!valid) {
        // visar felmeddelande om valideringen misslyckas
        displayErrors();
    }
    else {
        // - skapa studentkort om valideringen lyckas
        createStudentCard();
        clearForm();
    }
});

// När användaren klickar på "Rensa"
clearButton.addEventListener("click", () => {
    clearForm();
});

// När användaren klickar på "Radera historik"
deleteHistoryButton.addEventListener("click", () => {
    deleteHistory();
});

// När sidan laddas:
// - läs in och visa eventuell tidigare historik
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("font").addEventListener("change", changeFont);
    writeHistory();
});
// funktion för att byta typsnitt i studentkortet
function changeFont() {
    const font = document.getElementById("font").value;
    document.querySelector("#preview").style.fontFamily = font;
}