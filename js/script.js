/*
    When page loads, the name input field is selected by default
    otherJobRole txt field is set to not display
    disable the color select field from get go
    set userpayment to credit-card and only display credit card
*/
function pageLoad() {
    nameField.focus();
    otherJobRole.style.display = "none";
    colorSelect.disabled = true;
    userPayment.value = "credit-card";
    paymentSelection("credit-card")
};
/*
    takes in payment param which contains the payment option the user has selected
    hides the options which were not selected
*/
function paymentSelection(payment) {
    let paymentOptions = {
        "credit-card": document.getElementById("credit-card"),
        "paypal": document.getElementById("paypal"),
        "bitcoin": document.getElementById("bitcoin")
    };

    Object.keys(paymentOptions).forEach((key) => {
        if (payment === key) {
            paymentOptions[key].hidden = false;
        } else {
            paymentOptions[key].hidden = true;
        }
    })
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
let userPayment = document.getElementById("payment");
let form = document.getElementsByTagName("form")[0];
let email = document.getElementById("email");
let activitiesCheckboxes = document.querySelectorAll('.activities input[type="checkbox"]');

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
/*
    listens for changes in the activities checkbox
    if a checkbox is selected, its cost is added to the total
    if a checkbox is unselected, its cost is removed
*/
activities.addEventListener("change", (e) => {
    if (e.target.checked === true) {
        totalCost += parseInt(e.target.dataset.cost);
    } else {
        totalCost -= parseInt(e.target.dataset.cost);
    }
    activitiesCost.innerHTML = `Total: $${totalCost}`;
});
/*
    listens for a change in the user payment select box
    calls the paymentSelection function with the payment selected
*/
userPayment.addEventListener("change", (e) => {
    paymentSelection(e.target.value);
});

form.addEventListener("submit", (e) => {
    let totalInvalid = 0;
    function regExTest(regEx, stringToTest) {
        if (!regEx.text(stringToTest)) {
            totalInvalid++;
        };
    };
    function checkName() {
        if (nameField.value === "") {
            totalInvalid++;
        };
    };
    function checkEmail() {
        let emailFormat = /^\w+@\w+\.\w+$/;
        regExTest(emailFormat, email.value);
    };
    function checkActivities() {
        let checked = 0;
        activitiesCheckboxes.forEach((e) => {
            if (e.checked) {
                checked++;
            };
            if (checked === 0) {
                totalInvalid++;
            };
        });
    };
    function checkCreditCard() {
        if (userPayment.value === "credit-card") {
            let cardNumber = document.getElementById("cc-num").value;
            let zipCode = document.getElementById("zip").value;
            let cvv = document.getElementById("cvv").value;
            let cardNumberRegEx = /^\d{13,16}$/;
            let zipCodeRegEx = /^\d{5}$/;
            let cvvRegEx = /^\d{3}$/;
            regExTest(cardNumberRegEx, cardNumber);
            regExTest(zipCodeRegEx, zipCode);
            regExTest(cvvRegEx, cvv);
        };
    };
    checkName();
    checkEmail();
    checkActivities();
    checkCreditCard();
    if (totalInvalid > 0) {
        console.log("Errors");
        e.preventDefault();
    }
});