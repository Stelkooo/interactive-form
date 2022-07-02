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
let cardNumber = document.getElementById("cc-num");
let zipCode = document.getElementById("zip");
let cvv = document.getElementById("cvv");

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
    the first available color is selected
*/
shirtDesigns.addEventListener("change", () => {
    function colorOptionsHide(theme) {
        let newOptions = [];
        colorOptions.forEach((e) => {
            if (e.dataset.theme === theme) {
                e.hidden = false;
                newOptions.push(e);
            } else {
                e.hidden = true;
            }
        })
        newOptions[0].selected = true;
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
    function conflictingActivities(isChecked) {
        activitiesCheckboxes.forEach((checkbox) => {
            let doesTargetHaveAttribute = e.target.hasAttribute("data-day-and-time");
            let doesCheckboxHaveAttribute = checkbox.hasAttribute("data-day-and-time");
            if (doesTargetHaveAttribute && doesCheckboxHaveAttribute) {
                let targetDataValue = e.target.getAttribute("data-day-and-time");
                let checkboxDataValue = checkbox.getAttribute("data-day-and-time");
                if (targetDataValue === checkboxDataValue && e.target !== checkbox) {
                    switch (isChecked) {
                        case true:
                            checkbox.parentElement.classList.add("disabled");
                            break;      
                        case false:
                            checkbox.parentElement.classList.remove("disabled");
                            break;
                    }
                    
                }
            }
        })
    }

    if (e.target.checked === true) {
        totalCost += parseInt(e.target.dataset.cost);
        conflictingActivities(true);
    } else {
        totalCost -= parseInt(e.target.dataset.cost);
        conflictingActivities(false);
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
    if required field is not correctly filled in, it returns true, adds the not-valid class to its parent element and display hint
    if required field is filled correctly in, it returns false, adds the valid class to its parent element and hides hint
    if all checks return false it will submit the form
    otherwise if at least one returns true it will not submit the form
*/
form.addEventListener("submit", (e) => {
    let nameValidity = isNameInvalid();
    let emailValidity = isEmailInvalid();
    let activitiesValidity = isActivitiesInvalid();
    let paymentValidity = isPaymentInvalid();
    if (nameValidity || emailValidity || activitiesValidity || paymentValidity) {
        e.preventDefault();
    }
});
/*
    takes in a element and where it is valid or not
    depending on the validity it will add/remove a class and show/hide the hint
*/
function validationStyle(element, validOrNot) {
    switch (validOrNot) {
        case "valid":
            if (element.classList.contains("not-valid")) {
                element.classList.remove("not-valid");
            }
            element.classList.add("valid");
            element.lastElementChild.style.display = "none";
            break;
        case "not-valid":
            if (element.classList.contains("valid")) {
                element.classList.remove("valid");
            }
            element.classList.add("not-valid");
            element.lastElementChild.style.display = "inline-block";
            break;
    }
}
/*
    takes in a regex and a string
    runs a test
    if it passes it return false, if it fails it return true
*/
function regExTest(regEx, stringToTest) {
    if (!regEx.test(stringToTest)) {
        return true;
    } else {
        return false;
    };
};
/*
    checks if the name field is valid
*/
function isNameInvalid() {
    if (nameField.value === "" || !regExTest(/\s+/, nameField.value)) {
        validationStyle(nameField.parentElement, "not-valid");
        return true;
    } else {
        validationStyle(nameField.parentElement, "valid");
        return false;
    };
};
/*
    checks the validity of the name field in real time
*/
nameField.addEventListener("keyup", isNameInvalid);
/*
    checks if the email field is valid
*/

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
/*
    checks the validity of the email field in real time
*/
email.addEventListener("keyup", isEmailInvalid);
/*
    checks to see if the activities has been filled in correctly
*/
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
/*
    checks to see if the credit card payment has been filled in correctly
*/
function isPaymentInvalid() {
    if (userPayment.value === "credit-card") {
        return (isCardNumberInvalid() ||
        isZipCodeInvalid() ||
        isCvvInvalid());
    } else {
        return false;
    };
};
/*
    checks to see if the credit card number has been filled in correctly
*/
function isCardNumberInvalid() {
    let cardNumberRegEx = /^\d{13,16}$/;
    let cardNumberValidity = regExTest(cardNumberRegEx, cardNumber.value);
    if (cardNumberValidity) {
        validationStyle(cardNumber.parentElement, "not-valid");
        cardNumber.parentElement.lastElementChild.textContent = `Credit card number must be between 13 - 16 digits, it is currently ${cardNumber.value.length} digit/s long`
    } else {
        validationStyle(cardNumber.parentElement, "valid");
    }
}
/*
    checks the validity of the email field in real time
*/
cardNumber.addEventListener("keyup", isCardNumberInvalid);
/*
    checks to see if the zip code has been filled in correctly
*/
function isZipCodeInvalid() {
    let zipCodeRegEx = /^\d{5}$/;
    let zipCodeValidity = regExTest(zipCodeRegEx, zipCode.value);
    if (zipCodeValidity) {
        validationStyle(zipCode.parentElement, "not-valid");
        zipCode.parentElement.lastElementChild.textContent = `Credit card number must be between 13 - 16 digits, it is currently ${zipCode.value.length} digit/s long`
    } else {
        validationStyle(zipCode.parentElement, "valid");
    }
}
/*
    checks the validity of the zip code field in real time
*/
zipCode.addEventListener("keyup", isZipCodeInvalid);
/*
    checks to see if the cvv number has been filled in correctly
*/
function isCvvInvalid() {
    let cvvRegEx = /^\d{3}$/;
    let cvvValidity = regExTest(cvvRegEx, cvv.value);
    if (cvvValidity) {
        validationStyle(cvv.parentElement, "not-valid");
        cvv.parentElement.lastElementChild.textContent = `Credit card number must be between 13 - 16 digits, it is currently ${cvv.value.length} digit/s long`
    } else {
        validationStyle(cvv.parentElement, "valid");
    }
}
/*
    checks the validity of the cvv field in real time
*/
cvv.addEventListener("keyup", isCvvInvalid);
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