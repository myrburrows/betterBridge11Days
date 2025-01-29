let flashcards = [];
let currentIndex = 0;
let missedCards = [];
let isReviewing = false;
let reviewIndex = 0;

// Load flashcards for the selected day
document.getElementById("load-day").addEventListener("click", () => {
  const day = document.getElementById("day-selector").value;
  fetch(`data/day${day}.tsv`)
    .then(response => response.text())
    .then(data => {
      flashcards = parseFlashcards(data);
      currentIndex = 0;
      missedCards = [];
      isReviewing = false;
      reviewIndex = 0;
      displayFlashcard();
    })
    .catch(error => console.error("Error loading flashcards:", error));
});

// Parse flashcards from a tab-delimited string
function parseFlashcards(data) {
  return data
    .trim()
    .split("\n")
    .map(line => {
      const fields = line.split("\t");
      return {
        subTopic: `${fields[2]}. ${fields[4]}`, // Prepend Group to Sub-topic
        question: `${fields[3]}. ${fields[5]}`,   // Prepend Sequence to Question
        answer: fields[6]                   // Field 6: Answer
      };
    });
}

// Display the current flashcard
function displayFlashcard() {
  if (currentIndex < flashcards.length) {
    const card = flashcards[currentIndex];
    document.getElementById("sub-topic").innerText = card.subTopic;
    document.getElementById("question").innerText = card.question;
    document.getElementById("answer").innerText = card.answer;
    document.getElementById("answer").style.display = "none"; // Hide answer initially
  } else {
    console.error("No more flashcards to display!");
  }
}

// Show the answer
document.getElementById("show-answer").addEventListener("click", () => {
  document.getElementById("answer").style.display = "block";
});

// Navigate to the last flashcard
document.getElementById("last-button").addEventListener("click", () => {
  if (!isReviewing) {
    currentIndex = (currentIndex - 1 + flashcards.length) % flashcards.length;
    displayFlashcard();
  }
});

// Mark flashcard as "Knew It"
document.getElementById("knew-it-button").addEventListener("click", () => {
  if (!isReviewing && currentIndex === flashcards.length - 1) {
    transitionToReview();
  } else if (isReviewing && reviewIndex >= missedCards.length) {
    endReview();
  } else {
    nextFlashcard();
  }
});

// Mark flashcard as "Missed It"
document.getElementById("missed-it-button").addEventListener("click", () => {
  if (!isReviewing) {
    missedCards.push(flashcards[currentIndex]);
    if (currentIndex === flashcards.length - 1) {
      transitionToReview();
    } else {
      currentIndex++;
      displayFlashcard();
    }
  }
});

// Go to the next flashcard
function nextFlashcard() {
  if (isReviewing) {
    reviewIndex++;
    displayReviewCard();
  } else {
    currentIndex = (currentIndex + 1) % flashcards.length;
    displayFlashcard();
  }
}

// Transition to review mode
function transitionToReview() {
  isReviewing = true;
  reviewIndex = 0;
  toggleButtonsForReview(true);
  displayReviewCard();
}

// Display the current review flashcard
function displayReviewCard() {
  if (reviewIndex < missedCards.length) {
    const card = missedCards[reviewIndex];
    document.getElementById("sub-topic").innerText = card.subTopic;
    document.getElementById("question").innerText = card.question;
    document.getElementById("answer").innerText = card.answer;
    document.getElementById("answer").style.display = "none";
  } else {
    endReview();
  }
}

// End the review process
function endReview() {
  toggleButtonsForReview(false);
  document.getElementById("sub-topic").innerText = "";
  document.getElementById("question").innerText = "Review Complete! Well done!";
  document.getElementById("answer").style.display = "none";
}

// Toggle button visibility for review mode
function toggleButtonsForReview(inReview) {
  document.getElementById("last-button").style.display = inReview ? "none" : "inline-block";
  document.getElementById("knew-it-button").style.display = inReview ? "none" : "inline-block";
  document.getElementById("missed-it-button").style.display = inReview ? "none" : "inline-block";
  document.getElementById("review-button").style.display = inReview ? "inline-block" : "none";
  document.getElementById("next-button").style.display = inReview ? "inline-block" : "none";
}
