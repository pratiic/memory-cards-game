import { elements } from "./elements.js";

//setting the board size
let boardSize = "small";

let cardValues = [
	{ count: 2, value: "one" },
	{ count: 2, value: "two" },
	{ count: 2, value: "three" },
	{ count: 2, value: "four" },
	{ count: 2, value: "five" },
	{ count: 2, value: "six" },
	{ count: 2, value: "seven" },
	{ count: 2, value: "eight" },
];

let selectedCards = [];

let twoCardsFlipped = false;

let moves = 0;

let matchedPairs = 0;

//this is the first function that gets called
init();

function init() {
	//it sets the height of the body of the game
	elements.gameBody.style.minHeight = `calc(100vh - ${elements.header.clientHeight}px)`;

	if (boardSize === "small") {
		generateCards(16);
		setBoardSize("small");
	}

	//setting the number of moves
	document.querySelector(".moves-count").innerText = moves;

	//setting the event listener for when the cards are clicked
	elements.gameBody.addEventListener("click", (event) => {
		if (
			event.target.parentNode.classList.contains("card") &&
			!twoCardsFlipped
		) {
			flipCard(event.target.parentNode);

			setTimeout(function () {
				selectedCards.push(event.target.parentNode);

				if (selectedCards.length === 2) {
					twoCardsFlipped = true;

					checkIfMatched();

					updateMoves();
				}
			}, 550);
		}
	});

	document.querySelector(".reset-button").addEventListener("click", reset);
}

//this function creates n number of cards for the board
function generateCards(n) {
	for (let i = 0; i < n; i++) {
		elements.gameBody.innerHTML += `
            <div class = "card">
                <div class = "card-front"></div>
                <div class = "card-back"></div>
            </div>
        `;
	}

	let cards = document.querySelectorAll(".card");

	cards.forEach((card) => {
		assignCardValue(card);
	});
}

//this function sets the size of the board
function setBoardSize(size) {
	elements.gameBody.classList.add(`${size}-game-body`);
}

//this function assigns values of the cards
function assignCardValue(card) {
	let randomNum = generateRandomNumber(7);
	let cardValue;

	//this logic is to prevent more than two cards to have the same value
	if (cardValues[randomNum].count > 0) {
		cardValue = cardValues[randomNum].value;
		card.children[1].innerText = cardValue;
		cardValues[randomNum].count--;
	} else {
		assignCardValue(card);
	}
}

//this function flips the clicked card
function flipCard(card) {
	card.classList.add("flip");
}

//this function generates a random number from 0 to num
function generateRandomNumber(num) {
	return Math.floor(Math.random() * (num + 1));
}

//this function checks if the selected cards match
function checkIfMatched() {
	if (
		selectedCards[0].children[1].innerText ===
		selectedCards[1].children[1].innerText
	) {
		//hiding the matched pairs
		hideMatchedPairs();

		resetForEveryPair();

		matchedPairs++;

		if (matchedPairs === 8) {
			setTimeout(function () {
				gameOver();
			}, 250);
		}
	} else {
		//unflipping the cards
		selectedCards.forEach((selectedCard) => {
			unFlipCard(selectedCard);
		});

		resetForEveryPair();
	}
}

//this function hides the matched pair
function hideMatchedPairs() {
	selectedCards.forEach((selectedCard) => {
		selectedCard.classList.add("hide");
	});
}

//this function unflips a card
function unFlipCard(card) {
	card.classList.remove("flip");
}

//this function reset small things after each pair
function resetForEveryPair() {
	//setting the selected cards to be zero
	selectedCards = [];

	twoCardsFlipped = false;
}

//this function updates the total number of moves
function updateMoves() {
	moves++;
	document.querySelector(".moves-count").innerText = moves;
}

//this function is for when the user matches all the cards
function gameOver() {
	elements.gameBody.classList.add("gameover");
	elements.gameBody.innerHTML = `
		<div class = "gameover">
			<p class = "message-one">you did it</p>
			<p class = "message-two"> it took you ${moves} moves </p>
			<p class = "message-three">resetting now...</p>
		</div>
	`;
	setTimeout(function () {
		reset();
	}, 2500);
}

//this resets the whole game
function reset() {
	location.reload();
}
