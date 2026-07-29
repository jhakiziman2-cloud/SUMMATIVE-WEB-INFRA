// ===============================
// CHECK LOGIN
// ===============================

const currentUser = localStorage.getItem("currentUser");

if (!currentUser) {

    window.location.href = "login.html";

}

// ===============================
// LOAD USERS
// ===============================

let users = JSON.parse(localStorage.getItem("users")) || [];

const user = users.find(function (user) {

    return user.email === currentUser;

});

if (!user) {

    localStorage.removeItem("currentUser");

    window.location.href = "login.html";

}

// ===============================
// GET PAGE ELEMENTS
// ===============================

const profileForm = document.getElementById("profileForm");

const nameInput = document.getElementById("name");

const emailInput = document.getElementById("email");

// ===============================
// DISPLAY USER INFORMATION
// ===============================

nameInput.value = user.name;

emailInput.value = user.email;

// ===============================
// SAVE PROFILE INFORMATION
// ===============================

profileForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const newName = nameInput.value.trim();

    const newEmail = emailInput.value.trim();

    // Check if another account already uses this email

    const emailExists = users.some(function (account) {

        return account.email === newEmail &&
               account.email !== currentUser;

    });

    if (emailExists) {

        alert("That email address is already in use.");

        return;

    }

    user.name = newName;

    user.email = newEmail;

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    localStorage.setItem(
        "currentUser",
        newEmail
    );

    alert("Profile updated successfully.");

});

// ===============================
// CHANGE PASSWORD
// ===============================

const passwordForm = document.getElementById("passwordForm");

const currentPassword = document.getElementById("currentPassword");

const newPassword = document.getElementById("newPassword");

const confirmPassword = document.getElementById("confirmPassword");

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

passwordForm.addEventListener("submit", function (event) {

    event.preventDefault();

    if (currentPassword.value !== user.password) {

        alert("Current password is incorrect.");

        return;

    }

    if (!passwordRegex.test(newPassword.value)) {

        alert(
            
            "Password must contain an uppercase letter, a lowercase letter, a number, a special character, and be at least 8 characters long."
        );

    return;

     }

    

    if (newPassword.value !== confirmPassword.value) {

        alert("New passwords do not match.");

        return;

    }

    user.password = newPassword.value;

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    alert("Password changed successfully.");

    passwordForm.reset();

});

// ===============================
// THEME SETTINGS
// ===============================

const lightThemeButton = document.getElementById("lightTheme");

const darkThemeButton = document.getElementById("darkTheme");

function applyTheme(theme) {

    if (theme === "dark") {

        document.body.classList.add("dark-mode");

    } else {

        document.body.classList.remove("dark-mode");

    }

}

lightThemeButton.addEventListener("click", function () {

    localStorage.setItem("theme", "light");

    applyTheme("light");

});

darkThemeButton.addEventListener("click", function () {

    localStorage.setItem("theme", "dark");

    applyTheme("dark");

});

// ===============================
// LOAD SAVED THEME
// ===============================

const savedTheme = localStorage.getItem("theme");

if (savedTheme) {

    applyTheme(savedTheme);

} else {

    applyTheme("light");

}

// ===============================
// DELETE ACCOUNT
// ===============================

const deleteAccountButton = document.getElementById("deleteAccountButton");

deleteAccountButton.addEventListener("click", function () {

    const confirmed = confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmed) {

        return;

    }

    // Remove the user account

    users = users.filter(function (account) {

        return account.email !== currentUser;

    });

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    // Remove all goals belonging to the user

    let goals = JSON.parse(
        localStorage.getItem("goals")
    ) || [];

    goals = goals.filter(function (goal) {

        return goal.user !== currentUser;

    });

    localStorage.setItem(
        "goals",
        JSON.stringify(goals)
    );

    // Remove all progress records

    let progressRecords = JSON.parse(
        localStorage.getItem("progressRecords")
    ) || [];

    progressRecords = progressRecords.filter(function (record) {

        return record.user !== currentUser;

    });

    localStorage.setItem(
        "progressRecords",
        JSON.stringify(progressRecords)
    );

    // Log the user out

    localStorage.removeItem("currentUser");

    alert("Your account has been deleted successfully.");

    window.location.href = "index.html";

});

// ===============================
// BACK TO DASHBOARD
// ===============================

const backButton = document.getElementById("backButton");

backButton.addEventListener("click", function () {

    window.location.href = "dashboard.html";

});

// ===============================
// INITIALIZE SETTINGS PAGE
// ===============================

// Display current user information
nameInput.value = user.name;
emailInput.value = user.email;

// Apply saved theme
const theme = localStorage.getItem("theme");

if (theme) {

    applyTheme(theme);

} else {

    applyTheme("light");

}