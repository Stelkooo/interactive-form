let bodyHTML = document.getElementsByTagName("body")[0];
let nameField = document.getElementById("name");
// When page loads, the name input field is selected by default
bodyHTML.addEventListener(
    "load",
    nameField.focus()
);