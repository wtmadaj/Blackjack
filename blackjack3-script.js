//Blackjack 3.0
// --WTM--

let suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'];
let values = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6','5', '4', '3', '2']

let dealerTextArea = document.getElementById('dealer-text-area');
let playerTextArea = document.getElementById('player-text-area');
// let deckTextArea = document.getElementById('deck-text-area');
let dealerHeaderArea = document.getElementById('dealer-header-area');
let playerHeaderArea = document.getElementById('player-header-area');
let dealerWinsTextArea = document.getElementById('dealer-wins-text-area');
let playerWinsTextArea = document.getElementById('player-wins-text-area');
let dealerHandUI = document.getElementById('dealer-hand-ui');
let playerHandUI = document.getElementById('player-hand-ui');
let newGameButton = document.getElementById('new-game-button');
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

//Hide the hit and stay buttons by default, and hide text in winning text area
hitButton.style.display = 'none';
stayButton.style.display = 'none';
dealerWinsTextArea.value = "";
dealerWinsTextArea.style.display = 'none';
playerWinsTextArea.value = "";
playerWinsTextArea.style.display = 'none';
showStatus();

//On pressing new game button: display some text, hide new game button, show hit and stay buttons in-line
newGameButton.addEventListener('click', function() {
  gameStarted = true;
  gameOver = false;
  playerWon = false;
  tieGame = false;
  
  deck = createDeck();
  shuffleDeck(deck);
  dealerCards = [getNextCard(), getNextCard()];
  playerCards = [getNextCard(), getNextCard()];

  let dealerHandUI = '';
  for (let i = 0; i < dealerCards.length; i++)
  {
    var hand = document.getElementById('dealer-hand-ui');

    hand.appendChild(getCardUI(dealerCards[i]));
  }

  let playerHandUI = '';
  for (let i = 0; i < playerCards.length; i++) 
  {
    renderCard(playerCards[i]);
  }
  
  newGameButton.style.display = 'none';
  hitButton.style.display = 'inline';
  stayButton.style.display = 'inline';
  dealerWinsTextArea.style.display = 'none';
  playerWinsTextArea.style.display = 'none';
  document.getElementById('dealer-wins-text-area').value = "";
  document.getElementById('player-wins-text-area').value = "";
  document.getElementById('player-hand-ui').value = "";
  document.getElementById('dealer-hand-ui').value = "";
  //document.getElementById('deck-text-area').value = "";
  showStatus();
});

hitButton.addEventListener('click', function() {
  playerCards.push(getNextCard());
  checkForEndOfGame();
  showStatus();

  var card = deck.pop();
  let i = playerCards.length - 1;
  renderCard(playerCards[i]);
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
    case 'A':
      return 1;
    case '2':
      return 2;
    case '3':
      return 3;
    case '4':
      return 4;
    case '5':
      return 5;
    case '6':
      return 6;
    case '7':
      return 7;
    case '8':
      return 8;
    case '9':
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

function checkForEndOfGame() 
{
  updateScores();
  
  if (gameOver) 
  {
    //let the dealer take cards, render those cards
    while (dealerScore < playerScore
            && dealerScore <= 21
            && playerScore <= 21) 
            {
              dealerCards.push(getNextCard());
              var hand = document.getElementById('dealer-hand-ui');
              hand.appendChild(getCardUI(dealerCards[dealerCards.length-1]));

              updateScores();
            }
  }
  
  if (playerScore > 21) 
  {
    playerWon = false;
    gameOver = true;
  }
  else if (dealerScore > 21) 
  {
    playerWon = true;
    gameOver = true;
  }
  else if (gameOver) 
  {
    if (playerScore > dealerScore) 
    {
      playerWon = true;
    }
    else if (playerScore == dealerScore) 
    {
      tieGame = true;
    }
    else 
    {
      playerWon = false;
    }
    
    // TODO
    // If scores are equal, dealer wins by default - no handling of ties yet
  }
}

function showStatus() 
{
  if (!gameStarted) 
  {
    playerTextArea.innerText = 'Welcome to Blackjack!';
    return;
  }
  
  let dealerCardString = '';
  for (let i =0; i < dealerCards.length; i++) 
  {
    dealerCardString += getCardString(dealerCards[i]) + '\n';
  }
  
  let playerCardString = '';
  for (let i = 0; i < playerCards.length; i++) 
  {
    playerCardString += getCardString(playerCards[i]) + '\n';
  }
  
  updateScores();
  
// Show Dealer score and cards
  dealerHeaderArea.innerText = 'Dealer\n' + dealerScore;
  dealerTextArea.innerText = dealerCardString;
    
// Show Player score and cards
  playerHeaderArea.innerText = 'Player\n' + playerScore;
  playerTextArea.innerText = playerCardString;

    
    if (gameOver) 
    {
      if (playerWon) 
      {
        playerWinsTextArea.style.display = 'revert';
        playerWinsTextArea.innerText += 'YOU WIN!';
      }
      else if (tieGame) 
      {
        playerWinsTextArea.style.display = 'revert';
        dealerWinsTextArea.style.display = 'revert';
        playerWinsTextArea.innerText += 'DRAW!';
        dealerWinsTextArea.innerText += 'DRAW!';
      }
      else 
      {
        dealerWinsTextArea.style.display = 'revert';
        dealerWinsTextArea.innerText += 'DEALER WINS';
      }

      newGameButton.style.display = 'inline';
      hitButton.style.display = 'none';
      stayButton.style.display = 'none';
    }
    
  //shows the shuffled deck
  // for (var i = 0; i < deck.length; i++) 
  // {
  //   deckTextArea.innerText += '\n' + getCardString(deck[i]);
  // }
}

// Function called to clear out the text in these areas when a new game is started
function clearFields() {
  document.getElementById('dealer-wins-text-area').innerText = "";
  document.getElementById('player-wins-text-area').innerText = "";
  document.getElementById('player-hand-ui').innerText = "";
  document.getElementById('dealer-hand-ui').innerText = "";
  //document.getElementById('deck-text-area').innerText = "";
}

// Function to render the dealer and player cards
// function renderDeck()
// {
//   document.getElementById('deck').innerHTML = '';
//   for(var i = 0; i < deck.length; i++)
//   {
//     var card = document.createElement("div");
//     var value = document.createElement("div");
//     var suit = document.createElement("div");
//     card.className = "card";
//     value.className = "value";
//     suit.className = "suit " + deck[i].Suit;

//     value.innerHTML = deck[i].Value;
//     card.appendChild(value);
//     card.appendChild(suit);

//     document.getElementById("deck").appendChild(card);
//   }
// }

// Development area for UI
function renderCard(card)
{
    var hand = document.getElementById('player-hand-ui');
    hand.appendChild(getCardUI(card));

}
function getCardUI(card)
{
    var el = document.createElement('div');
    var icon = '';
    if (card.suit == 'Hearts')
    icon='&hearts;';
    else if (card.suit == 'Spades')
    icon = '&spades;';
    else if (card.suit == 'Diamonds')
    icon = '&diams;';
    else
    icon = '&clubs;';
    
    el.className = 'card';
    el.innerHTML = card.value + '<br/>' + icon;

    // Added some color for red cards
    if (card.suit == "Hearts" || card.suit == "Diamonds") {
        el.style.color = "red";
        el.style.border = "solid 2px red";
    } else el.style.color = "black";
    return el;
}

