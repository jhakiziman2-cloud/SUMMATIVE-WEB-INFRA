const loginForm = document.getElementById("loginForm");

const emailInput = document.getElementById("loginEmail");
const passwordInput = document.getElementById("loginPassword");


// LOGIN PROCESS

loginForm.addEventListener("submit", function (event) {

    
    event.preventDefault();

    
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    
    let users = JSON.parse(localStorage.getItem("users")) || [];

    
    const user = users.find(function (user) {

        return (
            user.email === email &&
            user.password === password
        );

    });

    
    if (user) {

        
        localStorage.setItem("currentUser", user.email);

        
        alert("Login successful!");

        
        window.location.href = "dashboard.html";

    } else {

        
        alert("Incorrect email or password.");

    }

});