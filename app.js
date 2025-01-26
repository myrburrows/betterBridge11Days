const apiUrl = "https://script.google.com/macros/s/AKfycbz8rqRTn_0_c3heNpJWYCAVYyqea8oEY88pG1BqOG5D8gH_zz8UZZ7C_FhXXUnI3AQZ/exec"; // Replace with your Apps Script web app URL

// Get all users from the Google Sheet
function getUsers() {
  fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "getUsers" }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log("Users:", data.data);
      } else {
        console.error("Error fetching users:", data.message);
      }
    })
    .catch(error => console.error("Error:", error));
}

// Get flashcards for a specific day
function getFlashcards(day) {
  fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "getFlashcards", day: day }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log("Flashcards:", data.data);
      } else {
        console.error("Error fetching flashcards:", data.message);
      }
    })
    .catch(error => console.error("Error:", error));
}

// Update user progress
function updateUser(username, lastCompleted, nextSet) {
  fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "updateUser",
      username: username,
      lastCompleted: lastCompleted,
      nextSet: nextSet,
    }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log(data.message);
      } else {
        console.error("Error updating user:", data.message);
      }
    })
    .catch(error => console.error("Error:", error));
}

// Example Usage:
// Replace these function calls with your actual frontend logic
getUsers();
getFlashcards(1); // Replace '1' with the desired day number
updateUser("testuser@gmail.com", 1, 2); // Replace with real user data
