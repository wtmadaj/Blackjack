//Blackjack
// --WTM--

let suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'];
let values = ['Ace', 'King', 'Queen', 'Jack',
      'Ten', 'Nine', 'Eight', 'Seven', 'Six',
      'Five', 'Four', 'Three', 'Two'];

//Access areas of html file by id's (DOM variables)
// let textArea = document.getElementById('text-area');
let leftTextArea = document.getElementById('lefttextarea');
let middleTextArea = document.getElementById('middletextarea');
let rightTextArea = document.getElementById('righttextarea');
let dealerWinsTextArea = document.getElementById('dealer-wins-text-area');
let playerWinsTextArea = document.getElementById('player-wins-text-area');
let newGameButton = document.getElementById('new-game-button')
let hitButton = document.getElementById('hit-button');
let stayButton = document.getElementById('stay-button');

let gameStarted = false,
    gameOver = false,
    playerWon = false,
    dealerCards = [],
    playerCards = [],
    dealerScore = 0,
    playerScore = 0,
    deck = [];

//Hide the hit and stay buttons by default, and hide text in win text area
hitButton.style.display = 'none';
stayButton.style.display = 'none';
dealerWinsTextArea.value = "";
playerWinsTextArea.value = "";
showStatus();

//On pressing new game button: display some text, hide new game button, show hit and stay buttons in-line
newGameButton.addEventListener('click', function() {
  gameStarted = true;
  gameOver = false;
  playerWon = false;
  
  // TODO: add another shuffleDeck to display on screen to show cards are shuffled
  // TODO: create version branches
  // TODO: black bg with felt colored divs for player/dealer/card areas
  deck = createDeck();
  shuffleDeck(deck);
  dealerCards = [getNextCard(), getNextCard()];
  playerCards = [getNextCard(), getNextCard()];
  
  newGameButton.style.display = 'none';
  hitButton.style.display = 'inline';
  stayButton.style.display = 'inline';
  document.getElementById('dealer-wins-text-area').value = "";
  document.getElementById('player-wins-text-area').value = "";
  document.getElementById('righttextarea').value = "";
  showStatus();
});

hitButton.addEventListener('click', function() {
  playerCards.push(getNextCard());
  checkForEndOfGame();
  showStatus();
});

stayButton.addEventListener('click', function() {
  gameOver = true;
  checkForEndOfGame();
  showStatus();
});

//create the deck of cards by cycling through suits and values arrays
function createDeck() {
  let deck = [];
  for (let suitIdx = 0; suitIdx < suits.length; suitIdx++){
    for (let valueIdx = 0; valueIdx < values.length; valueIdx++){
      let card = {
        suit: suits[suitIdx],
        value: values[valueIdx]
      };
      deck.push(card);
    }
  }
  return deck;
}

function shuffleDeck() {
  for (let i = 0; i < deck.length; i++) {
    let swapIdx = Math.trunc(Math.random() * deck.length);
    let tmp = deck[swapIdx];
    deck[swapIdx] = deck[i];
    deck[i] = tmp;
  }
}

function getCardString(card) {
  return card.value + ' of ' + card.suit;
}

function getNextCard() {
  return deck.shift();
}

// Note: ace is only worth 1 here, adding the remaining 10 (to make 11) is handled in getScore
function getCardNumericValue(card) {
  switch(card.value){
    case 'Ace':
      return 1;
    case 'Two':
      return 2;
    case 'Three':
      return 3;
    case 'Four':
      return 4;
    case 'Five':
      return 5;
    case 'Six':
      return 6;
    case 'Seven':
      return 7;
    case 'Eight':
      return 8;
    case 'Nine':
      return 9;
    default:
      return 10;
  }
}

function getScore(cardArray) {
  let score = 0;
  let hasAce= false;
  for (let i = 0; i < cardArray.length; i++) {
    let card = cardArray[i];
    score += getCardNumericValue(card);
    if (card.value === 'Ace') {
      hasAce = true;
    }
  }
  if (hasAce && score + 10 <= 21) {
    return score + 10;
  }
  return score;
}

function updateScores() {
  dealerScore = getScore(dealerCards);
  playerScore = getScore(playerCards);
}

function checkForEndOfGame() {
  updateScores();
  
  if (gameOver) {
    //let dealer take cards
    while (dealerScore < playerScore
            && dealerScore <= 21
            && playerScore <= 21) {
              dealerCards.push(getNextCard());
              updateScores();
            }
  }
  
  if (playerScore > 21) {
    playerWon = false;
    gameOver = true;
  }
  else if (dealerScore > 21) {
    playerWon = true;
    gameOver = true;
  }
  else if (gameOver) {
    if (playerScore > dealerScore) {
      playerWon = true;
    }
    else {
      playerWon = false;
    }
    
    // TODO
    // If scores are equal, dealer wins by default - no handling of ties yet
  }
}

function showStatus() {
  if (!gameStarted) {
    middleTextArea.innerText = 'Welcome to Blackjack!';
    return;
  }
  
  let dealerCardString = '';
  for (let i =0; i < dealerCards.length; i++) {
    dealerCardString += getCardString(dealerCards[i]) + '\n';
  }
  
  let playerCardString = '';
  for (let i = 0; i < playerCards.length; i++) {
    playerCardString += getCardString(playerCards[i]) + '\n';
  }
  
  updateScores();
  
  leftTextArea.innerText = 
    'Dealer has:\n' +
    dealerCardString +
    '(score: ' + dealerScore + ')\n\n';
    
  middleTextArea.innerText =
    'Player has:\n' +
    playerCardString +
    '(score: ' + playerScore + ')\n\n';
    
    if (gameOver) {
      if (playerWon) {
        playerWinsTextArea.innerText += 'YOU WIN!';
      }
      else {
        dealerWinsTextArea.innerText += 'DEALER WINS';
      }

    newGameButton.style.display = 'inline';
    hitButton.style.display = 'none';
    stayButton.style.display = 'none';
    }
    
  //shows the shuffled deck
  for (var i = 0; i < deck.length; i++) {
  rightTextArea.innerText += '\n' + getCardString(deck[i]);
  }
}

// Function called to clear out the text in these areas when a new game is started
function clearFields() {
  document.getElementById('dealer-wins-text-area').innerText = "";
  document.getElementById('player-wins-text-area').innerText = "";
  document.getElementById('righttextarea').innerText = "";
}




