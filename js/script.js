function pageLoad() {
    nameField.focus();
    otherJobRole.style.display = "none";
}

let bodyHTML = document.getElementsByTagName("body")[0];
let nameField = document.getElementById("name");
let userTitle = document.getElementById("title");
let otherJobRole = document.getElementById("other-job-role");
// When page loads, the name input field is selected by default
bodyHTML.addEventListener(
    "load",
    pageLoad()
);