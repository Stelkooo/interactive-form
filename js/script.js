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
/*
    when form gets submitted it checks required fields
    if required field is not correctly filled in, it returns true and adds the not-valid class to its parent element
    if required field is filled correctly in, it returns false and adds the valid class to its parent element
    if all checks return false it will submit the form
    otherwise if at least one returns true it will not submit the form
*/
form.addEventListener("submit", (e) => {
    function validationStyle(element, validOrNot) {
        switch (validOrNot) {
            case "valid":
                if (element.classList.contains("not-valid")) {
                    element.classList.remove("not-valid");
                }
                element.classList.add("valid");
                break;
            case "not-valid":
                if (element.classList.contains("valid")) {
                    element.classList.remove("valid");
                }
                element.classList.add("not-valid");
        }
    }
    function regExTest(regEx, stringToTest) {
        if (!regEx.test(stringToTest)) {
            return true;
        } else {
            return false;
        };
    };
    function isNameInvalid() {
        if (nameField.value === "") {
            validationStyle(nameField.parentElement, "not-valid");
            return true;
        } else {
            validationStyle(nameField.parentElement, "valid");
            return false;
        };
    };
    function isEmailInvalid() {
        let emailFormat = /^\w+@\w+\.\w+$/;
        if (regExTest(emailFormat, email.value)) {
            validationStyle(email.parentElement, "not-valid");
            return true;
        } else {
            validationStyle(email.parentElement, "valid");
            return false;
        };
    };
    function isActivitiesInvalid() {
        let checkedCheckboxes = 0;
        activitiesCheckboxes.forEach((e) => {
            if (e.checked) {
                checkedCheckboxes++;
            };
        });
        if (checkedCheckboxes === 0) {
            validationStyle(activities, "not-valid");
            return true;
        } else {
            validationStyle(activities, "valid");
            return false;
        };
    };
    function isPaymentInvalid() {
        if (userPayment.value === "credit-card") {
            let cardNumber = document.getElementById("cc-num");
            let zipCode = document.getElementById("zip");
            let cvv = document.getElementById("cvv");
            let cardNumberRegEx = /^\d{13,16}$/;
            let zipCodeRegEx = /^\d{5}$/;
            let cvvRegEx = /^\d{3}$/;
            let cardNumberValidity = regExTest(cardNumberRegEx, cardNumber.value);
            let zipCodeValidity = regExTest(zipCodeRegEx, zipCode.value);
            let cvvValidity = regExTest(cvvRegEx, cvv.value);
            if (cardNumberValidity) {
                validationStyle(cardNumber.parentElement, "not-valid");
            } else {
                validationStyle(cardNumber.parentElement, "valid");
            }
            if (zipCodeValidity) {
                validationStyle(zipCode.parentElement, "not-valid");
            } else {
                validationStyle(zipCode.parentElement, "valid");
            }
            if (cvvValidity) {
                validationStyle(cvv.parentElement.parentElement, "not-valid");
            } else {
                validationStyle(cvv.parentElement.parentElement, "valid");
            }
            return (cardNumberValidity ||
            zipCodeValidity ||
            cvvValidity);
        } else {
            return false;
        };
    };
    let nameValidity = isNameInvalid();
    let emailValidity = isEmailInvalid();
    let activitiesValidity = isActivitiesInvalid();
    let paymentValidity = isPaymentInvalid();
    if (nameValidity || emailValidity || activitiesValidity || paymentValidity) {
        e.preventDefault();
    }
});
/*
    adds an event listener to each checkbox to listen for focus and blur
    adds/removes the class depending on the event
*/
activitiesCheckboxes.forEach((checkbox) => {
    let parentClassList = checkbox.parentElement.classList;
    checkbox.addEventListener("focus", () => {
        if (parentClassList.contains("blur")) {
            parentClassList.remove("blur");
        };
        parentClassList.add("focus");
    });
    checkbox.addEventListener("blur", () => {
        if (parentClassList.contains("focus")) {
            parentClassList.remove("focus");
        };
        parentClassList.add("blur");
    });
});