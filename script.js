const $startButton = $("#start_button");
const $nextButton = $("#next_button");
const $controls = $(".controls");
const $openChest = $(".open_chest");
const $reward = $(".reward");
const $rewardsWon = $(".rewards_won");
const $rewardImage = $(".rewards_won *");
const $closeRewards = $(".close_rewards");
const $score = $(".score");
const $starIcon = $(".star_icon");
const $answerButtons = $(".answer_buttons");
const $closedChest = $(".closed_chest");
const $btnA = $(".btnA");
const $btnB = $(".btnB");
const $prizeSection = $(".prize_section");
const $question = $(".question");
const $submitGoal = $(".form");
const $goalInput = $("#goal");
const $form = $("form");
const $openModal = $("#set_goal");
const $factorChoice = $(".factor_choice");
const $factorBtn = $(".factor");

// Global variables
let currentResult;
let highScore = 0;
let goalInputValue = 10;
let goal = 10;
let factor = "?";

//listeners
$startButton.on("click", function () {
  startGame();
});

$nextButton.on("click", function () {
  loadQuestion();
  $controls.add($openChest).add($reward).addClass("hide");
  $answerButtons.add($closedChest).removeClass("hide");
  $closedChest.removeClass("shake");
  $reward.attr("src", "#");
});

$btnA.on("click", function (e) {
  if (parseInt(e.currentTarget.innerHTML) === currentResult) {
    selectAnswer(true);
  } else {
    selectAnswer(false);
  }
});

$btnB.on("click", function (e) {
  if (parseInt(e.currentTarget.innerHTML) === currentResult) {
    selectAnswer(true);
  } else {
    selectAnswer(false);
  }
});

$goalInput.on("change", (e) => {
  goalInputValue = e.target.value;
});

$submitGoal.on("submit", (e) => {
  goal = parseInt(goalInputValue);
  $openModal.addClass("hide");
  $form[0].reset();
});

$openModal.on("click", () => {
  modal.showModal();
});

$score.on("click", () => {
  $rewardsWon
    .css({ visibility: "visible", opacity: "1" })
    .attr("aria-expanded", "true");
});

$closeRewards.on("click", () => {
  $rewardsWon
    .css({ visibility: "hidden", opacity: "0" })
    .attr("aria-expanded", "false");
});

$rewardImage.on("click", (e) => {
  $zoomMe = $(e.target);
  if (
    $zoomMe.attr("class") === "reward_title" ||
    $zoomMe.attr("class") === "close_rewards" ||
    $zoomMe.attr("class") === "coins" ||
    $zoomMe.attr("class") === "riches" ||
    $zoomMe.attr("class") === "eggs" ||
    $zoomMe.attr("class") === "baby_dragons"
  ) {
    return;
  } else {
    $zoomMe.toggleClass("zoom_reward");
  }
  e.stopPropagation();
});

$factorBtn.on("click", (e) => {
  factor = e.currentTarget.dataset.num;
  $factorChoice.text(factor);
});

// When start button is clicked the first random question appears, along with two answer buttons.
function startGame() {
  $("#start_wav")[0].play();
  $controls.add($startButton).add($openModal).addClass("hide");
  $startButton.addClass("hide");
  $question.add($answerButtons).add($prizeSection).removeClass("hide");
  loadQuestion();
}

// When "start" or "next" are clicked, load a random question.
function loadQuestion() {
  $starIcon.removeClass("shake");
  let num1;

  if (factor === "?") {
    num1 = Math.floor(Math.random() * 12);
  } else {
    num1 = factor;
  }

  const num2 = Math.floor(Math.random() * 12);
  const wrongAnswer = Math.floor(Math.random() * 110);
  const multiply = (a, b) => a * b;

  currentResult = multiply(num1, num2);

  $question.text(`${num1} x ${num2}`);

  // 50/50 chance the right answer lands in one of the two buttons
  if (Math.random() > 0.5) {
    $btnA.text(currentResult);

    if (wrongAnswer !== currentResult) {
      $btnB.text(wrongAnswer);
    } else {
      $btnB.text(wrongAnswer + 5);
    }
  } else {
    $btnB.text(currentResult);

    if (wrongAnswer !== currentResult) {
      $btnA.text(wrongAnswer);
    } else {
      $btnA.text(wrongAnswer + 5);
    }
  }
}

// When an answer is selected, this function runs. If the answer is correct a treasure chest opens to reveal a prize. If incorrect chest stays closed and the "next" button appears.
function selectAnswer(x) {
  if (x === true) {
    highScore++;
    $("#correct_wav")[0].play();
    $(".counter").text(highScore);
    $question.text("Correct!");
    $controls.add($nextButton).add($openChest).add($reward).removeClass("hide");
    $answerButtons.add($closedChest).addClass("hide");
    $starIcon.addClass("shake");
    selectPrize();
  } else if (x === false) {
    $("#tryAgain_wav")[0].play();
    $answerButtons.addClass("hide");
    $closedChest.addClass("shake");
    $controls.add($nextButton).removeClass("hide");
    $question.text("Try again!");
  }
}

// prize randomizer
function randomPrize(type) {
  let randomPrizeIndex = Math.floor(Math.random() * type.length);
  return type[randomPrizeIndex];
}

// A fn for when the goal has been met. Show trophy and confetti, loop through the array of dragons.
function goalMet() {
  const confettiSection = document.querySelector(".high_score");
  party.confetti(confettiSection, {
    count: party.variation.range(500, 1000),
    spread: 1000,
  });
  $("#youWin_wav")[0].play();
  $reward.attr("src", "./assets/trophy.png");
  $question.text("You Win!");
  $nextButton.addClass("hide");
  $("#play_again_button")
    .removeClass("hide")
    .on("click", function () {
      location.reload();
    });
  setTimeout(() => {
    babyDragons.forEach((dragon, i) => {
      setTimeout(() => {
        if (i >= 60) {
          $reward.attr("src", "./assets/trophy.png");
        } else {
          $reward.attr("src", dragon);
        }
      }, i * 2500);
    });
  }, 10000);
}

//A function to select a prize from different categories and store it in the "rewards" section.
//* (Tip: Player can hover over the "high score" counter to take a closer look at all the prizes they've won!) *
const selectPrize = function () {
  if (highScore === goal) {
    goalMet();
  } else if (highScore % 6 === 0 || highScore % 13 === 0) {
    currentPrize = randomPrize(babyDragons);
    $reward.attr("src", currentPrize);
    $(".baby_dragons").append(
      '<li><img src="#" class="rwd" alt="A random baby dragon"></li>'
    );
    $(".baby_dragons li img").last().attr("src", currentPrize);
  } else if (highScore % 3 === 0 || highScore % 8 === 0) {
    currentPrize = randomPrize(eggs);
    $reward.attr("src", currentPrize);
    $(".eggs").append(
      '<li><img src="#" class="rwd" alt="A random colorful dragon egg"></li>'
    );
    $(".eggs li img").last().attr("src", currentPrize);
  } else if (highScore % 5 === 0 || highScore % 7 === 0) {
    currentPrize = randomPrize(riches);
    $reward.attr("src", currentPrize);
    $(".riches").append(
      '<li><img src="#" class="rwd" alt="A random expensive, bejeweled trinket."></li>'
    );
    $(".riches li img").last().attr("src", currentPrize);
  } else {
    currentPrize = randomPrize(coins);
    $reward.attr("src", currentPrize);
    $(".coins").append(
      '<li><img src="#" class="rwd" alt="A random shiny coin."></li>'
    );
    $(".coins li img").last().attr("src", currentPrize);
  }
};

const coins = [
  "./assets/coins/coin1.png",
  "./assets/coins/coin2.png",
  "./assets/coins/coin3.png",
  "./assets/coins/coin4.png",
  "./assets/coins/coin5.png",
];

const riches = [
  "./assets/riches/riches1.png",
  "./assets/riches/riches2.png",
  "./assets/riches/riches3.png",
  "./assets/riches/riches4.png",
  "./assets/riches/riches5.png",
  "./assets/riches/riches6.png",
  "./assets/riches/riches7.png",
  "./assets/riches/riches8.png",
  "./assets/riches/riches9.png",
  "./assets/riches/riches10.png",
  "./assets/riches/riches11.png",
];

const eggs = [
  "./assets/eggs/egg1.png",
  "./assets/eggs/egg2.png",
  "./assets/eggs/egg3.png",
  "./assets/eggs/egg4.png",
  "./assets/eggs/egg5.png",
  "./assets/eggs/egg6.png",
  "./assets/eggs/egg7.png",
  "./assets/eggs/egg8.png",
  "./assets/eggs/egg9.png",
  "./assets/eggs/egg10.png",
  "./assets/eggs/egg11.png",
  "./assets/eggs/egg12.png",
  "./assets/eggs/egg13.png",
  "./assets/eggs/egg14.png",
  "./assets/eggs/egg15.png",
  "./assets/eggs/egg16.png",
  "./assets/eggs/egg17.png",
  "./assets/eggs/egg18.png",
  "./assets/eggs/egg19.png",
  "./assets/eggs/egg20.png",
  "./assets/eggs/egg21.png",
  "./assets/eggs/egg22.png",
  "./assets/eggs/egg23.png",
  "./assets/eggs/egg24.png",
  "./assets/eggs/egg25.png",
  "./assets/eggs/egg26.png",
  "./assets/eggs/egg27.png",
  "./assets/eggs/egg28.png",
  "./assets/eggs/egg29.png",
  "./assets/eggs/egg30.png",
  "./assets/eggs/egg31.png",
  "./assets/eggs/egg32.png",
  "./assets/eggs/egg33.png",
  "./assets/eggs/egg34.png",
  "./assets/eggs/egg35.png",
  "./assets/eggs/egg36.png",
  "./assets/eggs/egg37.png",
  "./assets/eggs/egg38.png",
  "./assets/eggs/egg39.png",
  "./assets/eggs/egg40.png",
  "./assets/eggs/egg41.png",
  "./assets/eggs/egg42.png",
  "./assets/eggs/egg43.png",
  "./assets/eggs/egg44.png",
  "./assets/eggs/egg45.png",
  "./assets/eggs/egg46.png",
  "./assets/eggs/egg47.png",
  "./assets/eggs/egg48.png",
  "./assets/eggs/egg49.png",
  "./assets/eggs/egg50.png",
  "./assets/eggs/egg51.png",
  "./assets/eggs/egg52.png",
  "./assets/eggs/egg53.png",
  "./assets/eggs/egg54.png",
  "./assets/eggs/egg55.png",
  "./assets/eggs/egg56.png",
  "./assets/eggs/egg57.png",
  "./assets/eggs/egg58.png",
  "./assets/eggs/egg59.png",
  "./assets/eggs/egg60.png",
  "./assets/eggs/egg61.png",
];

const babyDragons = [
  "./assets/babyDragons/babyDragon1.png",
  "./assets/babyDragons/babyDragon2.png",
  "./assets/babyDragons/babyDragon3.png",
  "./assets/babyDragons/babyDragon4.png",
  "./assets/babyDragons/babyDragon5.png",
  "./assets/babyDragons/babyDragon6.png",
  "./assets/babyDragons/babyDragon7.png",
  "./assets/babyDragons/babyDragon8.png",
  "./assets/babyDragons/babyDragon9.png",
  "./assets/babyDragons/babyDragon10.png",
  "./assets/babyDragons/babyDragon11.png",
  "./assets/babyDragons/babyDragon12.png",
  "./assets/babyDragons/babyDragon13.png",
  "./assets/babyDragons/babyDragon14.png",
  "./assets/babyDragons/babyDragon15.png",
  "./assets/babyDragons/babyDragon16.png",
  "./assets/babyDragons/babyDragon17.png",
  "./assets/babyDragons/babyDragon18.png",
  "./assets/babyDragons/babyDragon19.png",
  "./assets/babyDragons/babyDragon20.png",
  "./assets/babyDragons/babyDragon21.png",
  "./assets/babyDragons/babyDragon22.png",
  "./assets/babyDragons/babyDragon23.png",
  "./assets/babyDragons/babyDragon24.png",
  "./assets/babyDragons/babyDragon25.png",
  "./assets/babyDragons/babyDragon26.png",
  "./assets/babyDragons/babyDragon27.png",
  "./assets/babyDragons/babyDragon28.png",
  "./assets/babyDragons/babyDragon29.png",
  "./assets/babyDragons/babyDragon30.png",
  "./assets/babyDragons/babyDragon31.png",
  "./assets/babyDragons/babyDragon32.png",
  "./assets/babyDragons/babyDragon33.png",
  "./assets/babyDragons/babyDragon34.png",
  "./assets/babyDragons/babyDragon35.png",
  "./assets/babyDragons/babyDragon36.png",
  "./assets/babyDragons/babyDragon37.png",
  "./assets/babyDragons/babyDragon38.png",
  "./assets/babyDragons/babyDragon39.png",
  "./assets/babyDragons/babyDragon40.png",
  "./assets/babyDragons/babyDragon41.png",
  "./assets/babyDragons/babyDragon42.png",
  "./assets/babyDragons/babyDragon43.png",
  "./assets/babyDragons/babyDragon44.png",
  "./assets/babyDragons/babyDragon45.png",
  "./assets/babyDragons/babyDragon46.png",
  "./assets/babyDragons/babyDragon47.png",
  "./assets/babyDragons/babyDragon48.png",
  "./assets/babyDragons/babyDragon49.png",
  "./assets/babyDragons/babyDragon50.png",
  "./assets/babyDragons/babyDragon51.png",
  "./assets/babyDragons/babyDragon52.png",
  "./assets/babyDragons/babyDragon53.png",
  "./assets/babyDragons/babyDragon54.png",
  "./assets/babyDragons/babyDragon55.png",
  "./assets/babyDragons/babyDragon56.png",
  "./assets/babyDragons/babyDragon57.png",
  "./assets/babyDragons/babyDragon58.png",
  "./assets/babyDragons/babyDragon59.png",
  "./assets/babyDragons/babyDragon60.png",
  "./assets/babyDragons/babyDragon61.png",
  "./assets/babyDragons/babyDragon62.png",
];
