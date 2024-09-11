var buttonColours = ["red", "green", "blue", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var gameStarted = false;
var level = 0;

function nextSequence() {
  // random sequence generation
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  // animation
  $("#" + randomChosenColour)
    .fadeOut(100)
    .fadeIn(100);

  // sound
  var sound = new Audio("./sounds/" + randomChosenColour + ".mp3");
  sound.play();

  // advance level
  level += 1;
  $("h1").text("Level " + level);
}

function playSound(name) {
  switch (name) {
    case "red":
      var red = new Audio("./sounds/red.mp3");
      red.play();
      break;
    case "green":
      var green = new Audio("./sounds/green.mp3");
      green.play();
      break;
    case "blue":
      var blue = new Audio("./sounds/blue.mp3");
      blue.play();
      break;
    case "yellow":
      var yellow = new Audio("./sounds/yellow.mp3");
      yellow.play();
      break;
    default:
      console.log(name);
  }
}

function animatePress(currentColour) {
  $("#" + currentColour).addClass("pressed");
  setTimeout(() => {
    $("#" + currentColour).removeClass("pressed");
  }, 100);
}

function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    if (level === currentLevel + 1) {
      setTimeout(() => {
        userClickedPattern = [];
        nextSequence();
      }, 1000);
    }
  } else {
    wrongAnswer();
  }
}

function wrongAnswer() {
  // sound
  var wrongsound = new Audio("./sounds/wrong.mp3");
  wrongsound.play();

  // change text
  $("h1").text("Game Over, Press Any Key to Restart");

  // update game state
  gameStarted = false;
  level = 0;
  gamePattern = [];
  userClickedPattern = [];

  // background flash
  $("body").addClass("game-over");
  setTimeout(() => {
    $("body").removeClass("game-over");
  }, 200);
}

$(".btn").click((e) => {
  if (gameStarted) {
    var userChosenColour = e.target.id;
    userClickedPattern.push(userChosenColour);
    var lastIndex = userClickedPattern.length - 1;
    checkAnswer(lastIndex);
    animatePress(userChosenColour);
    playSound(userChosenColour);
  }
});

$(document).keypress(() => {
  if (!gameStarted) {
    gameStarted = true;
    $("h1").text("Level " + level);
    nextSequence();
  }
});
