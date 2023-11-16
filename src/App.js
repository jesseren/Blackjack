import "./App.css";
import React, { useState, useRef } from "react";

const cards = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];

const deck = [];

for (const card of cards) {
  let val = 0;
  if (Number.isNaN(Number(card))) {
    if (card === "A") {
      val = 11;
    } else {
      val = 10;
    }
  } else {
    val = Number(card);
  }
  for (let i = 0; i < 4; i++) {
    deck.push({ name: card, val: val });
  }
}

function App() {
  const [start, setStart] = useState(false);
  const [hand, setHand] = useState([]);
  const [dealer, setDealer] = useState([]);
  const [endMessage, setEndMessage] = useState(null);
  const curDeck = useRef([...deck]);

  const drawCard = () => {
    const i = Math.floor(Math.random() * curDeck.current.length);
    const card = curDeck.current[i];
    curDeck.current.splice(i, 1);
    return card;
  };

  const deal = () => {
    const playerHand = [];
    const dealerHand = [];
    for (let i = 0; i < 2; i++) {
      playerHand.push(drawCard());
      dealerHand.push(drawCard());
    }
    setHand(playerHand);
    setDealer(dealerHand);
    if (calculateHand(playerHand) === 21) {
      if (calculateHand(dealerHand) === 21) {
        setEndMessage("Push!");
      } else {
        setEndMessage("Player Wins!");
      }
    }
  };

  const calculateHand = (hand) => {
    let aces = 0;
    let total = 0;
    for (const card of hand) {
      if (card.name === "A") {
        aces++;
      }
      total += card.val;
    }
    while (total > 21 && aces > 0) {
      total -= 10;
      aces--;
    }
    return total;
  };

  const playerHits = () => {
    const playerHand = [...hand];
    playerHand.push(drawCard());
    setHand(playerHand);
    if (calculateHand(playerHand) > 21) {
      setEndMessage("Dealer Wins!");
    }
  };

  const dealerTurn = () => {
    const dealerHand = [...dealer];
    while (calculateHand(dealerHand) < 17) {
      dealerHand.push(drawCard());
    }
    const dealerTotal = calculateHand(dealerHand);
    const playerTotal = calculateHand(hand);
    setDealer(dealerHand);
    if (dealerTotal > 21 || dealerTotal < playerTotal) {
      setEndMessage("Player Wins!");
    } else if (dealerTotal > playerTotal) {
      setEndMessage("Dealer Wins!");
    } else if (
      dealerTotal === 21 &&
      dealerHand.length === 2 &&
      hand.length > 2
    ) {
      setEndMessage("Dealer Wins!");
    } else {
      setEndMessage("Push!");
    }
  };

  const reset = () => {
    curDeck.current = [...deck];
    setEndMessage(null);
    deal();
  };

  return (
    <div className="App">
      {!start && (
        <button
          onClick={() => {
            deal();
            setStart(true);
          }}
        >
          Start
        </button>
      )}
      {start && (
        <div>
          {endMessage ? <p>{endMessage}</p> : null}
          <p>Dealer's Hand</p>
          {endMessage ? (
            <div>
              {dealer.map((card, i) => (
                <p key={i}>{card.name}</p>
              ))}
              <p>{`Dealer's total: ${calculateHand(dealer)}`}</p>
            </div>
          ) : (
            <div>
              {dealer.length > 0 && <p>{dealer[0].name}</p>}
              {dealer.length > 0 && <p>{`Dealer's total: ${dealer[0].val}`}</p>}
            </div>
          )}
          <p>Player's Hand</p>
          {hand.map((card, i) => (
            <p key={i}>{card.name}</p>
          ))}
          <p>{`Player's total: ${calculateHand(hand)}`}</p>
          {endMessage == null && <button onClick={dealerTurn}>Stand</button>}
          {endMessage == null && <button onClick={playerHits}>Hit</button>}
          {endMessage && <button onClick={reset}>Play Again</button>}
        </div>
      )}
    </div>
  );
}

export default App;
