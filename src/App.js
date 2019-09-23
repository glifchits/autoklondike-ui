import React, { useState } from "react";
import "./App.scss";

let initialState = {
  foundation: [[], [], [], []],
  waste: [],
  stock: [
    "10h",
    "8d",
    "7h",
    "kc",
    "3d",
    "10d",
    "5h",
    "8c",
    "qs",
    "js",
    "9h",
    "7c",
    "6d",
    "8s",
    "qd",
    "qh",
    "ac",
    "9c",
    "5s",
    "kh",
    "qc",
    "2s",
    "10c",
    "9d"
  ],
  tableau: [
    ["4D"],
    ["4c", "2C"],
    ["3c", "7s", "6S"],
    ["6h", "Ah", "Ad", "2D"],
    ["7d", "As", "5c", "8h", "6C"],
    ["9s", "10s", "Jc", "4h", "Jh", "3S"],
    ["Jd", "2h", "Ks", "Kd", "5d", "4s", "3H"]
  ]
};

function parseCard(card) {
  let value, suit;
  if (card.startsWith("10")) {
    value = "10";
    suit = card[card.length - 1];
  } else {
    [value, suit] = card;
  }
  let faceUp = suit.match(/[A-Z]/) !== null;
  return { value, suit: suit.toUpperCase(), faceUp };
}

function App() {
  const [state, setState] = useState(initialState);
  const [clicked, setClicked] = useState(null);

  function cardCls(card) {
    let { value, suit, faceUp } = parseCard(card);
    if (value === "J") {
      value = 11;
    } else if (value === "Q") {
      value = 12;
    } else if (value === "K") {
      value = 13;
    } else if (value === "A") {
      value = 1;
    }
    let isClicked = card === clicked ? "active" : "";
    let cardFlip = faceUp ? "card--front" : "card--back";
    return `card card--${suit.toLowerCase()}-${value} ${isClicked} ${cardFlip}`;
  }

  function findCard(card) {
    let srcTableau = state.tableau.map(t => t.indexOf(card) >= 0).indexOf(true);
    if (srcTableau >= 0) {
      return { location: "tableau", pile: srcTableau };
    }
    let wasteIdx = state.waste.indexOf(card);
    if (wasteIdx >= 0) {
      return { location: "waste", pile: null };
    }
    let fnd = state.foundation.map(t => t.indexOf(card) >= 0).indexOf(true);
    if (fnd >= 0) {
      return { location: "foundation", pile: fnd };
    }
    debugger;
  }

  let ensureFlippedUp = state => {
    let tableau = [...state.tableau];
    tableau.forEach(talon => {
      if (talon.length > 0) {
        let last = talon.length - 1;
        talon[last] = talon[last].toUpperCase();
      }
    });
    setState({ ...state, tableau });
  };

  let handleCardClick = card => evt => {
    evt.stopPropagation();
    console.log("card clicked", card);
    let { faceUp } = parseCard(card);
    if (!faceUp) {
      return;
    }
    if (clicked === null) {
      setClicked(card);
    } else if (card === clicked) {
      setClicked(null);
    } else {
      let src = findCard(clicked);
      let dest = findCard(card);
      // debugger;
      let newState = { ...state };
      if (src.location === "tableau") {
        let clickedIdx = state.tableau[src.pile].indexOf(clicked);
        let dragPile = state.tableau[src.pile].slice(clickedIdx);
        let newTableau = state.tableau[src.pile].slice(0, clickedIdx);
        newState.tableau[src.pile] = newTableau;
        newState.tableau[dest.pile] = state.tableau[dest.pile].concat(dragPile);
      } else if (src.location === "waste") {
        newState.tableau[dest.pile].push(newState.waste.pop());
      } else {
        debugger;
      }
      setState(newState);
      ensureFlippedUp(newState);
      setClicked(null);
      // debugger;
    }
  };

  let handleFoundationClick = foundation => evt => {
    console.log(state, foundation, evt, clicked);
    if (clicked === null) {
      return;
    }
    let newState = { ...state };
    let src = findCard(clicked);
    if (src.location === "tableau") {
      newState.tableau[src.pile].pop();
      newState.foundation[foundation].push(clicked);
    }
    setState(newState);
    ensureFlippedUp(newState);
    setClicked(null);
  };

  let handleBuildClick = build => evt => {
    if (clicked === null) {
      return;
    }
    let src = findCard(clicked);
    let newState = { ...state };
    if (src.location === "tableau") {
      let tableau = [...state.tableau];
      let clickedIdx = state.tableau[src.pile].indexOf(clicked);
      let dragPile = state.tableau[src.pile].slice(clickedIdx);
      let newBuildDeck = state.tableau[src.pile].slice(0, clickedIdx);
      tableau[src.pile] = newBuildDeck;
      tableau[build] = state.tableau[build].concat(dragPile);
      newState.tableau = tableau;
    } else if (src.location === "waste") {
      newState.tableau[build].push(newState.waste.pop());
    } else {
      debugger;
    }
    setClicked(null);
    setState(newState);
    ensureFlippedUp(newState);
  };

  function dealStock(e) {
    let stock = [...state.stock];
    let waste = [...state.waste];

    if (stock.length === 0) {
      stock = [...waste].map(c => c.toLowerCase());
      waste = [];
    }

    let numToDraw = Math.min(state.stock.length, 3);
    for (let i = 0; i < numToDraw; i++) {
      waste.push(stock.shift().toUpperCase());
    }

    setState({
      ...state,
      stock,
      waste
    });
  }

  return (
    <div className="window">
      <div className="window__inner">
        <div className="window__heading">
          <div className="window__heading-icon" />
          Solitaire
        </div>
        <div className="window__actions">
          <button type="button" id="js-reset" className="new-game">
            New game
          </button>
          <button type="button" id="js-nextmove" className="new-game">
            Next move
          </button>
        </div>
        <div className="window__content">
          <div className="window__content-inner">
            <div className="solitaire" id="js-solitaire">
              <div id="js-finish" className="finish-deck">
                {state.foundation.map((talon, i) => (
                  <div
                    key={i}
                    className={`aces aces--${i}`}
                    onClick={handleFoundationClick(i)}
                  >
                    {talon.map((card, i) => {
                      let doClick = () => {};
                      if (i === talon.length - 1) {
                        doClick = handleCardClick(card);
                      }
                      return (
                        <div
                          key={card}
                          className={cardCls(card)}
                          onClick={doClick}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
              <div id="js-board" className="board-deck">
                {state.tableau.map((tableauCards, i) => {
                  let cardElements = null;
                  if (tableauCards.length > 0) {
                    let cards = [...tableauCards];
                    cards.reverse();
                    let [first, ...rest] = cards;
                    cardElements = (
                      <div
                        key={first}
                        className={cardCls(first)}
                        onClick={handleCardClick(first)}
                      />
                    );
                    rest.forEach(card => {
                      let newCardElements = (
                        <div
                          key={card}
                          className={cardCls(card)}
                          onClick={handleCardClick(card)}
                          children={cardElements}
                        />
                      );
                      cardElements = newCardElements;
                    });
                  }
                  return (
                    <div
                      key={i}
                      className={`tableau seven seven--${i}`}
                      onClick={handleBuildClick(i)}
                    >
                      {cardElements}
                    </div>
                  );
                })}
              </div>

              <div className="deck">
                <div
                  id="js-deck-pile"
                  className="deck__pile"
                  onClick={dealStock}
                >
                  {state.stock.map(card => (
                    <div key={card} className={`${cardCls(card)} card--back`} />
                  ))}
                </div>
                <div id="js-deck-deal" className="deck__deal">
                  {state.waste.map(card => (
                    <div
                      key={card}
                      className={`${cardCls(card)} card--front`}
                      onClick={handleCardClick(card)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;