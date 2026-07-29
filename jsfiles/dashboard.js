// ===============================
// CHECK IF USER IS LOGGED IN
// ===============================

const currentUser = localStorage.getItem("currentUser");

if (!currentUser) {
    window.location.href = "login.html";
}

// ===============================
// GET STORED USERS
// ===============================

const users = JSON.parse(localStorage.getItem("users")) || [];

const user = users.find(function (user) {
    return user.email === currentUser;
});

const profileButton = document.getElementById("profileButton");
const profileMenu = document.getElementById("profileMenu");

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");

const logoutButton = document.getElementById("logoutButton");
const settingsButton = document.getElementById("settingsButton");

settingsButton.addEventListener("click", function () {

    window.location.href = "settings.html";

});

// ===============================
// DISPLAY USER INFORMATION
// ===============================

if (user) {

    profileName.textContent = user.name;
    profileEmail.textContent = user.email;

} else {

    localStorage.removeItem("currentUser");
    window.location.href = "login.html";

}

// Display welcome name if available
const welcomeName = document.getElementById("welcomeName");

if (welcomeName && user) {

    welcomeName.textContent = user.name;

}

// ===============================
// PROFILE MENU
// ===============================

profileButton.addEventListener("click", function () {

    profileMenu.classList.toggle("hidden");

});

// Close menu when clicking outside
document.addEventListener("click", function (event) {

    if (
        !profileButton.contains(event.target) &&
        !profileMenu.contains(event.target)
    ) {

        profileMenu.classList.add("hidden");

    }

});

// ===============================
// LOGOUT
// ===============================

logoutButton.addEventListener("click", function () {

    localStorage.removeItem("currentUser");

    alert("You have been logged out.");

    window.location.href = "index.html";

});

// ===============================
// MOTIVATIONAL QUOTES
// ===============================

const API_KEY = "1hdkBQz8MmkGmNRNCxD6bMMPskrOknQfunhz2qt6";

const quoteBox = document.getElementById("quote");
const newQuoteButton = document.getElementById("newQuote");

async function getRandomQuote() {

    try {

        quoteBox.textContent = "Loading motivation...";

        const response = await fetch(
            "https://api.api-ninjas.com/v2/randomquotes?categories=inspirational",
            {
                method: "GET",
                headers: {
                    "X-Api-Key": API_KEY
                }
            }
        );

        if (!response.ok) {

            throw new Error("Could not load quote.");

        }

        const data = await response.json();

        const quote = data[0];

        quoteBox.innerHTML =
            `"${quote.quote}"<br><br>— ${quote.author}`;

    } catch (error) {

        console.log(error);

        quoteBox.textContent =
            "Unable to load motivational quote.";

    }

}

getRandomQuote();

newQuoteButton.addEventListener("click", getRandomQuote);

// ===============================
// GOAL CREATION SYSTEM
// ===============================

const goalForm = document.getElementById("goalForm");

const currentGoal = document.getElementById("currentGoal");
const goalDuration = document.getElementById("goalDuration");
const progressFill = document.getElementById("progressFill");

// Load saved goals
let goals = JSON.parse(localStorage.getItem("goals")) || [];

// ===============================
// SAVE NEW GOAL
// ===============================

goalForm.addEventListener("submit", function (event) {

    event.preventDefault();

    // Make all existing goals inactive

   goals.forEach(function (goal) {

      if (goal.user === currentUser) {

        goal.isCurrent = false;

      }

    });

    const newGoal = {

        user: currentUser,

        title: document.getElementById("goalTitle").value,

        description: document.getElementById("goalDescription").value,

        startDate: document.getElementById("startDate").value,

        endDate: document.getElementById("endDate").value,

        category: document.getElementById("goalCategory").value,

        dailyTarget: document.getElementById("dailyTarget").value,

        progress: 0,
        isCurrent: true

    };

    goals.push(newGoal);

    localStorage.setItem(
        "goals",
        JSON.stringify(goals)
    );

    displayCurrentGoal(newGoal);

    updateStatistics();

    goalForm.reset();

    alert("Goal saved successfully!");

});

// ===============================
// DISPLAY CURRENT GOAL
// ===============================

function displayCurrentGoal(goal) {

    currentGoal.textContent = goal.title;

    goalDuration.innerHTML = `
        <strong>Deadline:</strong> ${goal.endDate}
        <br>
        <strong>Daily Target:</strong> ${goal.dailyTarget}
    `;

    progressFill.style.width = goal.progress + "%";

    progressFill.textContent = goal.progress + "%";

}

// ===============================
// LOAD USER'S CURRENT GOAL
// ===============================

function loadUserGoal() {

    const userGoals = goals.filter(function (goal) {

        return goal.user === currentUser;

    });

    if (userGoals.length === 0) {

        currentGoal.textContent = "No Goal Selected";

        goalDuration.textContent = "Choose a goal to begin.";

        progressFill.style.width = "0%";

        progressFill.textContent = "0%";

        return;

    }

    const activeGoal = userGoals.find(function (goal) {

       return goal.isCurrent;

   });

   if (activeGoal) {

      displayCurrentGoal(activeGoal);

   } else {

    // If no goal is marked as current  use the first goal as a fallback.

    displayCurrentGoal(userGoals[0]);

}

}

// ===============================
// FIND USER'S ACTIVE GOAL
// ===============================

function getCurrentGoal() {

    const userGoals = goals.filter(function (goal) {

        return goal.user === currentUser;

    });

    if (userGoals.length === 0) {

        return null;

    }

    return userGoals[userGoals.length - 1];

}

// ===============================
// LOAD GOAL WHEN PAGE OPENS
// ===============================

loadUserGoal();

// ===============================
// DAILY PROGRESS TRACKING
// ===============================

const progressForm = document.getElementById("progressForm");
const progressList = document.getElementById("progressList");

let progressRecords =
    JSON.parse(localStorage.getItem("progressRecords")) || [];

// ===============================
// SAVE DAILY PROGRESS
// ===============================

progressForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const newProgress = {

        user: currentUser,

        date: new Date().toISOString().split("T")[0],

        activity: document.getElementById("progressActivity").value,

        time: document.getElementById("progressTime").value,

        amount: Number(
            document.getElementById("progressAmount").value
        )

    };

    progressRecords.push(newProgress);

    // Update current goal progress

    const activeGoal = getCurrentGoal();

    if (activeGoal) {

        activeGoal.progress += newProgress.amount;

        if (activeGoal.progress > 100) {

            activeGoal.progress = 100;

        }

        localStorage.setItem(
            "goals",
            JSON.stringify(goals)
        );

        displayCurrentGoal(activeGoal);
        generateCalendar();
        updateReminder();

    }

    // Save progress

    localStorage.setItem(
        "progressRecords",
        JSON.stringify(progressRecords)
    );

    progressForm.reset();

    displayProgressHistory();

    updateStatistics();

    alert("Progress saved successfully!");

});

// ===============================
// DISPLAY PROGRESS HISTORY
// ===============================

function displayProgressHistory() {

    progressList.innerHTML = "";

    const userProgress = progressRecords.filter(function (record) {

        return record.user === currentUser;

    });

    if (userProgress.length === 0) {

        progressList.innerHTML = `
            <li>No progress recorded yet.</li>
        `;

        return;

    }

    userProgress.reverse().forEach(function (record) {

        const li = document.createElement("li");

        li.innerHTML = `

            <div class="progress-date">
                ${record.date}
            </div>

            <div class="progress-activity">
                ✓ ${record.activity}
            </div>

            <div class="progress-time">
                ${record.time} minutes worked
            </div>

            <div class="progress-time">
                Progress Added: +${record.amount}%
            </div>

        `;

        progressList.appendChild(li);

    });

}

// ===============================
// DASHBOARD STATISTICS
// ===============================

function updateStatistics() {

    const userGoals = goals.filter(function (goal) {

        return goal.user === currentUser;

    });

    const activeGoals = userGoals.filter(function (goal) {

        return goal.progress < 100;

    });

    const completedGoals = userGoals.filter(function (goal) {

        return goal.progress >= 100;

    });

    document.getElementById("goalCount").textContent =
        activeGoals.length;

    document.getElementById("completedGoals").textContent =
        completedGoals.length;

    updateCompletionRate(userGoals);

    updateDayStreak();

}

// ===============================
// COMPLETION RATE
// ===============================

function updateCompletionRate(userGoals) {

    if (userGoals.length === 0) {

        document.getElementById("completionRate").textContent = "0%";

        return;

    }

    let totalProgress = 0;

    userGoals.forEach(function (goal) {

        totalProgress += goal.progress;

    });

    const average =
        Math.round(totalProgress / userGoals.length);

    document.getElementById("completionRate").textContent =
        average + "%";

}

// ===============================
// DAY STREAK
// ===============================

function updateDayStreak() {

    const userProgress = progressRecords.filter(function (record) {

        return record.user === currentUser;

    });

    if (userProgress.length === 0) {

        document.getElementById("currentStreak").textContent = "0";

        return;

    }

    const uniqueDates = [];

    userProgress.forEach(function (record) {

        if (!uniqueDates.includes(record.date)) {

            uniqueDates.push(record.date);

        }

    });

    uniqueDates.sort();

    let streak = 1;

    for (let i = uniqueDates.length - 1; i > 0; i--) {

        const current = new Date(uniqueDates[i]);

        const previous = new Date(uniqueDates[i - 1]);

        const difference =
            (current - previous) / (1000 * 60 * 60 * 24);

        if (difference === 1) {

            streak++;

        } else {

            break;

        }

    }

    document.getElementById("currentStreak").textContent =
        streak;

}

// ===============================
// INITIALIZE DASHBOARD
// ===============================

displayProgressHistory();

updateStatistics();


function displayGoals() {

    const goalList = document.getElementById("goalList");

    goalList.innerHTML = "";

    const userGoals = goals.filter(function (goal) {

        return goal.user === currentUser;

    });

    if (userGoals.length === 0) {

        goalList.innerHTML = "<li>No goals created yet.</li>";

        return;

    }

    userGoals.forEach(function (goal, index) {

        const li = document.createElement("li");

        li.innerHTML = `

            <strong>${goal.title}</strong>

            <br>

            ${goal.progress}% Complete

            <br>

            Deadline: ${goal.endDate}

            <div class="goal-buttons">

                <button
                    class="current-goal"
                    onclick="setCurrentGoal(${index})">

                    Make Current

                </button>

                <button
                    class="edit-goal"
                    onclick="editGoal(${index})">

                    Edit

                </button>

                <button
                    class="delete-goal"
                    onclick="deleteGoal(${index})">

                    Delete

                </button>

            </div>

        `;

        goalList.appendChild(li);

    });

}

function setCurrentGoal(index) {

    const userGoals = goals.filter(function (goal) {

        return goal.user === currentUser;

    });

    userGoals.forEach(function (goal) {

        goal.isCurrent = false;

    });

    userGoals[index].isCurrent = true;

    localStorage.setItem("goals", JSON.stringify(goals));

    displayCurrentGoal(userGoals[index]);

    displayGoals();

}

function deleteGoal(index) {

    if (!confirm("Delete this goal?")) {

        return;

    }

    const userGoals = goals.filter(function (goal) {

        return goal.user === currentUser;

    });

    const goalToDelete = userGoals[index];

    const realIndex = goals.indexOf(goalToDelete);

    goals.splice(realIndex, 1);

    localStorage.setItem("goals", JSON.stringify(goals));

    displayGoals();

    loadUserGoal();

    updateStatistics();

}

function editGoal(index) {

    const userGoals = goals.filter(function (goal) {

        return goal.user === currentUser;

    });

    const goal = userGoals[index];

    const newTitle = prompt("Goal title:", goal.title);

    if (newTitle === null) {

        return;

    }

    const newDeadline = prompt("Deadline:", goal.endDate);

    if (newDeadline === null) {

        return;

    }

    const newTarget = prompt("Daily target:", goal.dailyTarget);

    if (newTarget === null) {

        return;

    }

    goal.title = newTitle;

    goal.endDate = newDeadline;

    goal.dailyTarget = newTarget;

    localStorage.setItem("goals", JSON.stringify(goals));

    displayGoals();

    loadUserGoal();

}
displayGoals();

// ===============================
// CALENDAR
// ===============================

function generateCalendar() {

    const calendar = document.getElementById("calendar");

    const goal = getCurrentGoal();

    if (!goal) {

        calendar.innerHTML = "No active goal.";

        return;

    }

    const today = new Date();

    const month = today.getMonth();

    const year = today.getFullYear();

    const firstDay = new Date(year, month, 1).getDay();

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let html = "";

    html += `
        <div class="calendar-header">

            ${today.toLocaleString("default", {
                month: "long",
                year: "numeric"
            })}

        </div>
    `;

    html += `<div class="calendar-grid">`;

    const weekDays = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"
    ];

    weekDays.forEach(function(day) {

        html += `<strong>${day}</strong>`;

    });

    for (let i = 0; i < firstDay; i++) {

        html += "<div></div>";

    }

    for (let day = 1; day <= daysInMonth; day++) {

        const date = new Date(year, month, day)
            .toISOString()
            .split("T")[0];

        let className = "calendar-day";

        let symbol = "";

        const progress = progressRecords.find(function(record) {

            return record.user === currentUser &&
                   record.date === date;

        });

        if (progress) {

            className += " completed-day";

            symbol = "✔";

        }

        if (date === goal.endDate) {

            className += " deadline-day";

            symbol = `<img src="jsfiles/alarm_110dp_EA3323_FILL0_wght400_GRAD0_opsz48.png"
              class="deadline-icon"
              alt="Deadline">`;

        }

        if (day === today.getDate()) {

            className += " today";

        }

        html += `
            <div class="${className}">
                ${day}${symbol}
            </div>
        `;

    }

    html += "</div>";

    calendar.innerHTML = html;

}

generateCalendar();

// ===============================
// REMINDER SYSTEM
// ===============================

function updateReminder() {

    const reminderText = document.getElementById("reminderText");

    const activeGoal = getCurrentGoal();

    if (!activeGoal) {

        reminderText.textContent =
            "Create a goal to begin your journey.";

        return;

    }

    const today = new Date();

    const deadline = new Date(activeGoal.endDate);

    const difference =
        Math.ceil(
            (deadline - today) /
            (1000 * 60 * 60 * 24)
        );

    const todayDate =
        new Date().toISOString().split("T")[0];

    const loggedToday = progressRecords.some(function(record) {

        return (
            record.user === currentUser &&
            record.date === todayDate
        );

    });

    if (activeGoal.progress >= 100) {

        reminderText.textContent =
            "Congratulations! You completed your goal.";

    }

    else if (difference < 0) {

        reminderText.textContent =
            "Your goal deadline has passed.";

    }

    else if (difference <= 7) {

        reminderText.textContent =
            `Your "${activeGoal.title}" goal is due in ${difference} day(s).`;

    }

    else if (!loggedToday) {

        reminderText.textContent =
            "You haven't logged progress today.";

    }

    else {

        reminderText.textContent =
            "You're all caught up!";

    }

}

updateReminder();