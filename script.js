var passwordField = document.querySelector("#password-create");
var confirmField = document.querySelector("#confirm-create");

var regForm = document.querySelector("#create-account");
var loginForm = document.querySelector("#login");

regForm.addEventListener('submit', function (e) {

    if (passwordField.value !== confirmField.value) {
        e.preventDefault();
        alert("Passwords do not match");
        
    }

    
});