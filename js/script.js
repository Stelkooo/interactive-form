/*
    When page loads, the name input field is selected by default
    otherJobRole txt field is set to not display
    disable the color select field from get go
*/
function pageLoad() {
    nameField.focus();
    otherJobRole.style.display = "none";
    colorSelect.disabled = true;
};

let bodyHTML = document.getElementsByTagName("body")[0];
let nameField = document.getElementById("name");
let userTitle = document.getElementById("title");
let otherJobRole = document.getElementById("other-job-role");
let shirtDesigns = document.getElementById("design");
let colorSelect = document.getElementById("color");
let colorOptions = document.querySelectorAll("#color option");
let activities = document.getElementById("activities");
let activitiesCost = document.getElementById("activities-cost");
let totalCost = 0;

bodyHTML.addEventListener(
    "load",
    pageLoad()
);
/*
    if userTitle = other display the otherJobRole txt field
    if not, carry on hiding it
*/
userTitle.addEventListener("change", () => {
    if (userTitle.value === "other") {
        otherJobRole.style.display = "inline-block";
    } else {
        otherJobRole.style.display = "none";
    }
});

/*
    listens for changes in selection of shirt designs
    depending on design selected, only colors specific to that design will display
*/
shirtDesigns.addEventListener("change", () => {
    function colorOptionsHide(theme) {
        colorOptions.forEach((e) => {
            if (e.dataset.theme === theme) {
                e.hidden = false;
            } else {
                e.hidden = true;
            }
        }) 
    };

    colorSelect.disabled = false;
    switch (shirtDesigns.value) {
        case "js puns":
            colorOptionsHide("js puns");
            break;
        case "heart js":
            colorOptionsHide("heart js"); 
            break;
    }
});

activities.addEventListener("change", (e) => {
    if (e.target.checked === true) {
        totalCost += parseInt(e.target.dataset.cost);
    } else {
        totalCost -= parseInt(e.target.dataset.cost);
    }
    activitiesCost.innerHTML = `Total: $${totalCost}`;
});