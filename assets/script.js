// Variables of elements on page
var choicesContent = document.querySelector("#choices-menu");
var startMenu = document.getElementById('start-menu');
var questionHeading = document.getElementById('heading1');
var gameClock = document.getElementById('game-clock');
var enterInitialsMenu = document.getElementById('enter-initials-menu');
var enterInitialsBtn = document.getElementById('submit-intials-btn');
var scoresMenu = document.getElementById('scores-menu');
var backToStartLink = document.getElementById('back-to-start-link');
var viewHighScoresLink = document.getElementById('high-scores-link');

// Default numbers for the game
// to start at first question, setting time, etc.
var questionNumber = 0;

// Variable containing question array data
// referred to in the functions
var numberOfQuestions = questions.length;
var questionChoices = questions[questionNumber].choices;

// 15 seconds for each question to determine total game time
var gameTimer = numberOfQuestions * 15;

var finalScore;
var highScores = [];

// Check to see if there is an existing array of 
// high scores in the localStorage
renderHighScores()

function renderHighScores() {
    var savedHighScores = localStorage.getItem("high scores");
    
    if (savedHighScores === null) {
        return;
    }
    var objectScores = JSON.parse(savedHighScores);
    // console.log("Saved High Scores: " + savedHighScores);
    highScores = objectScores;
    
}


// Function for when user clicks the start button
function startQuiz() {

    // console.log("Question Number: " + questionNumber);

    // Hide the default start menu
    startMenu.setAttribute("style", "display: none;");
    scoresMenu.setAttribute("style", "display: none;");
    choicesContent.setAttribute("style", "display: block");
    enterInitialsMenu.setAttribute("style", "display: none;");
    choicesContent.innerHTML = " ";
    viewHighScoresLink.setAttribute("style", "display: none;");


    // Start countdown clock
    countdownClock();

    // Place first question in h1 and create buttons
    // of the multiple choice answers below
    questionHeading.textContent = questions[questionNumber].title;
    listChoices();

}

function listChoices() {
    // Loop through the available choices in
    // the given question array index
    for (var i = 0; i < questionChoices.length; i++) {
        // Create, build, and place the available choices
        var choiceBtn = document.createElement("button");
        choiceBtn.setAttribute("class", "btn btn-primary btn-sm d-block my-2 choice-btn");
        choiceBtn.setAttribute("id", "choice-" + i );
        choiceBtn.textContent = questions[questionNumber].choices[i];
        choicesContent.appendChild(choiceBtn);

    }
}

// Notify user that they got the answer right
function correctAnswer() {
    var correctNotify = document.createElement("div");
    correctNotify.setAttribute("class", "border-top mt-3 pt-3")
    correctNotify.setAttribute("style", "font-size: 12px; color: green; font-weight: bold;");
    correctNotify.textContent = "You got the answer right!";
    choicesContent.appendChild(correctNotify);
}

// Notify user that they got the answer wrong
function incorrectAnswer() {
    var incorrectNotify = document.createElement("div");
    incorrectNotify.setAttribute("class", "border-top mt-3 pt-3");incorrectNotify.setAttribute("style", "font-size: 12px; color: red; font-weight: bold;");
    incorrectNotify.textContent = "You got the answer wrong!";
    choicesContent.appendChild(incorrectNotify);
}

// The timer that counts down when the game is started
function countdownClock() {
    var timerInterval = setInterval(function() {
        // Display time and decrease by second
        gameClock.textContent = gameTimer;
        gameTimer--;


        // Once the timer hits zero, game is ended
        if (gameTimer <= 0) {
            clearInterval(timerInterval);
            gameClock.textContent = "0";
            choicesContent.innerHTML = " ";
            questionNumber = 0;
            choicesContent.setAttribute("display", "none");
            startMenu.setAttribute("style", "display: block;");
            questionHeading.textContent = "Your score is: " +  gameTimer;
            gameTimer = numberOfQuestions * 15;
        } 
        // Freeze clock if user runs through all the questions and end game
        else if (questionNumber === 10) {
            clearInterval(timerInterval);
            // Reset stats so user can start a new game
            questionNumber = 0;
            gameTimer = numberOfQuestions * 15;
        }

    }, 1000);
} 



// Add event to the button choices and see if what the 
// user clicks matches the answer in the questions array
document.addEventListener("click", function(event) {
    if (event.target.matches('.choice-btn')) {
        // console.log(event.target.textContent);
        event.stopPropagation();
        event.preventDefault();
        // Condition if user selects correct answer
        if (event.target.textContent === questions[questionNumber].answer) {
            
            

            // Move on to the next question
            questionNumber = questionNumber + 1;
            // Add time to the clock
            gameTimer += 5;


            if (questionNumber <= (numberOfQuestions - 1)) {
                questionHeading.textContent = questions[questionNumber].title;
                    // Run function to clear buttons
                    // and list new choices
                choicesContent.innerHTML = " ";
                listChoices();
                // Inform user that they got the right answer
                correctAnswer();
                // console.log("Question Number: " + questionNumber);
            } else {
                // End of game so clear any trace of choices
                choicesContent.innerHTML = " ";
                // Inform user that they got the right answer
                correctAnswer();
                // Bring up input for user to enter in their high score
                enterInitialsMenu.setAttribute("style", "display: block;");
                // Allow user to restart quiz
                startMenu.setAttribute("style", "display: block;");
                viewHighScoresLink.setAttribute("style", "display: inline;");
                // Display the user's final score
                questionHeading.textContent = "Your score is: " +  gameTimer;
                // User's final score is equal to the time left in the game
                finalScore = gameTimer;
            }

            
        } 
        // Condition if user selects wrong answer
        else if (event.target.textContent !== questions[questionNumber].answer) {
            
            // Move on to the next question
            questionNumber = questionNumber + 1;
            // Remove time from the clock
            gameTimer -= 15;

            if (questionNumber <= (numberOfQuestions - 1)) {
                questionHeading.textContent = questions[questionNumber].title;
                    // Run function to clear buttons
                    // and list new choices
                choicesContent.innerHTML = " ";
                listChoices();
                // Inform user that they got the wrong answer
                incorrectAnswer();
            } else {
                // End of game so clear any trace of choices
                choicesContent.innerHTML = " ";
                // Inform user that they got the wrong answer
                incorrectAnswer();
                // Bring up input for user to enter in their high score
                enterInitialsMenu.setAttribute("style", "display: block;");
                // Allow user to restart quiz
                startMenu.setAttribute("style", "display: block;");
                viewHighScoresLink.setAttribute("style", "display: inline;");
                // Display the user's final score
                questionHeading.textContent = "Your score is: " +  gameTimer;
                // User's final score is equal to the time left in the game
                finalScore = gameTimer;
            }
            
            
        }
    }
});


function enterInitials(event) {
    event.preventDefault();
    // Take the value the user enters into the input after game ends
    var userInitials = document.getElementById('initials-input').value;
    
    // Object containing the user initials and final score
    var userScores = {
        initials: userInitials,
        score: finalScore
    };

    // Push the above object into the high scores array
    highScores.push(userScores);
    // console.log(highScores);

    // Convert the object into a string
    var highScoresString = JSON.stringify(highScores);

    // Store the string into the user's local storage
    window.localStorage.setItem("high scores", highScoresString);

    // Inform user their score is now entered
    questionHeading.textContent = "You have entered your score. Play again?";
    enterInitialsMenu.setAttribute("style", "display: none;");
    choicesContent.innerHTML = " ";

}

// Go back to start Menu
function goBackToStart() {
    backToStartLink.setAttribute("style", "display: none;")
    viewHighScoresLink.setAttribute("style", "display: inline;")
    startMenu.setAttribute("style", "display: block;");
    scoresMenu.setAttribute("style", "display: none;");
    choicesContent.setAttribute("style", "display: none");
    enterInitialsMenu.setAttribute("style", "display: none;");
    questionHeading.textContent = "Coding Quiz Challenge";
}

// When user clicks submit, enter their score
// and their initials to their local Storage
enterInitialsBtn.addEventListener("click", enterInitials);

function viewHighScores() {
    // Show the score menu with title
    scoresMenu.innerHTML = " ";
    startMenu.setAttribute("style", "display: none;");
    scoresMenu.setAttribute("style", "display: block;");
    choicesContent.setAttribute("style", "display: none");
    enterInitialsMenu.setAttribute("style", "display: none;");
    questionHeading.textContent = "View High Scores";
    backToStartLink.setAttribute("style", "display: inline;");
    viewHighScoresLink.setAttribute("style", "display: none;");


    // Grab the high scores from user's local storage
    var highScoreList = window.localStorage.getItem("high scores");
    
    // Convert the high scores from strings to an array of objects
    var highScoreObject = JSON.parse(highScoreList);

    // console.log(highScoreObject);

    // Sort the objects from highest scores to lowest
    highScoreObject.sort(highestToLowest);

    // Cycle through the array and list each initial with 
    // corresponding score as an element
    for (var i=0;i <= highScores.length - 1;i++){
        var highScoreEntry = document.createElement("div");
        highScoreEntry.setAttribute("class", "alert alert-info");
        highScoreEntry.innerHTML = "<span style='font-weight: bold;''>" +  highScoreObject[i].initials + ":</span> " + highScoreObject[i].score;
        scoresMenu.appendChild(highScoreEntry);

    }
}

// Function to sort the objects in the array
// by highest score to lowest
function highestToLowest(x,y) {
var scoreX = x.score;
var scoreY = y.score;

var comparison = 0;
if (scoreX > scoreY) {
    comparison = 1;
} else if (scoreX < scoreY) {
    comparison = -1;
}
return comparison * -1;
}