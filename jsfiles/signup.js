const signupForm = document.getElementById("signupForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");



// ===============================
// EMAIL VALIDATION REGEX
// ===============================

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/;




// ===============================
// PASSWORD BUTTON
// ===============================

const passwordBox = passwordInput.parentElement;


// Generate password button

const generateButton = document.createElement("button");

generateButton.type = "button";

generateButton.textContent = "Generate Password";

passwordBox.appendChild(generateButton);




// Show / Hide password button

const viewPasswordButton = document.createElement("button");

viewPasswordButton.type = "button";

viewPasswordButton.textContent = "Show Password";

passwordBox.appendChild(viewPasswordButton);






// ===============================
// PASSWORD CHECK FUNCTION
// ===============================

function checkPassword(password) {

    let errors = [];


    if (password.length < 16) {

        errors.push(
            "Password must contain at least 16 characters."
        );

    }


    if (!/[A-Z]/.test(password)) {

        errors.push(
            "Password needs at least one uppercase letter."
        );

    }


    if (!/[a-z]/.test(password)) {

        errors.push(
            "Password needs at least one lowercase letter."
        );

    }


    if (!/[0-9]/.test(password)) {

        errors.push(
            "Password needs at least one number."
        );

    }


    if (!/[^A-Za-z0-9]/.test(password)) {

        errors.push(
            "Password needs at least one symbol."
        );

    }


    return errors;

}







// ===============================
// PASSWORD GENERATION
// ===============================

function generatePassword() {


    const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";


    let generatedPassword = "";


    for (let i = 0; i < 16; i++) {


        let randomIndex =
        Math.floor(Math.random() * characters.length);


        generatedPassword += characters[randomIndex];

    }


    passwordInput.value = generatedPassword;

}



generateButton.addEventListener(
    "click",
    generatePassword
);







// ===============================
// SHOW / HIDE PASSWORD
// ===============================

viewPasswordButton.addEventListener(
    "click",
    function () {


        if (passwordInput.type === "password") {


            passwordInput.type = "text";


            viewPasswordButton.textContent =
            "Hide Password";


        } else {


            passwordInput.type = "password";


            viewPasswordButton.textContent =
            "Show Password";

        }

    }
);







// ===============================
// SIGNUP PROCESS
// ===============================

signupForm.addEventListener(
    "submit",
    function(event) {


        event.preventDefault();



        const name =
        nameInput.value.trim();



        const email =
        emailInput.value.trim().toLowerCase();



        const password =
        passwordInput.value;






        // CHECK EMPTY EMAIL

        if (email === "") {


            alert(
                "Please enter your email."
            );


            return;

        }





        // CHECK EMAIL FORMAT

        if (!emailRegex.test(email)) {


            alert(
                "Please enter a valid email address."
            );


            return;

        }





        // GET STORED USERS

        let users =
        JSON.parse(
            localStorage.getItem("users")
        ) || [];






        // CHECK DUPLICATE EMAIL

        const emailExists =
        users.some(
            user => user.email === email
        );



        if (emailExists) {


            alert(
                "This email already exists. Please login instead."
            );


            return;

        }







        // CHECK PASSWORD STRENGTH

        const passwordErrors =
        checkPassword(password);




        if (passwordErrors.length > 0) {


            alert(
                passwordErrors.join("\n")
            );


            return;

        }








        // CREATE USER OBJECT

        const newUser = {


            name: name,


            email: email,


            password: password

        };






        // SAVE USER

        users.push(newUser);



        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );






        alert(
            "Account created successfully!"
        );



        window.location.href = "dashboard.html";



    }
);