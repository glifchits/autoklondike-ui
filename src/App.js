import React, { useState, useEffect } from "react";
import { cloneDeep, last } from "lodash";
import "./App.scss";

const FOUNDATION = {
  0: "C",
  1: "D",
  2: "S",
  3: "H"
};
const SUITS = {
  C: 0,
  D: 1,
  S: 2,
  H: 3
};

let stateTracker = [];

window.moves = [];
function addMove(move) {
  // console.log("move", move);
  window.moves.push(move);
}
function drawMove(numToDraw) {
  if (window.moves.length > 0 && last(window.moves).match(/^D(\d+)$/)) {
    let lastMove = window.moves.pop();
    let num = parseInt(lastMove.match(/^D(\d+)$/)[1], 10);
    window.moves.push(`D${num + numToDraw}`);
  } else {
    window.moves.push(`D${numToDraw}`);
  }
  // console.log("draw", last(window.moves));
}

let initialState = {
  foundation: [[], [], [], []],
  waste: [],
  stock: [],
  tableau: [[], [], [], [], [], [], []]
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
  const [state, setStateImpl] = useState(initialState);
  const [clicked, setClicked] = useState(null);

  useEffect(() => {
    let seed = 12;
    fetch(`http://localhost:3005/game/${seed}`)
      .then(r => r.json())
      .then(({ deck, moveSeq }) => {
        setStateImpl(state => ({ ...state, moveSeq, ...deck }));
      });
  }, []);

  function doMoveFromSequence() {
    if (state.moveSeq.length === 0) {
      console.error("no moves left!");
      return false;
    }
    let moveSeq = [...state.moveSeq];
    let move = moveSeq.shift();
    console.log("move", move);
    let newState = cloneDeep(state);
    if (move.match(/^(\d)(\d)$/)) {
      let [x, y] = move.match(/^(\d)(\d)$/).slice(1);
      let xT = parseInt(x, 10) - 1;
      let yT = parseInt(y, 10) - 1;
      newState.tableau[yT].push(newState.tableau[xT].pop());
    } else if (move.match(/^(\d)([CDSH])$/)) {
      let [tableau, suit] = move.match(/^(\d)([CDSH])$/).slice(1);
      let srcT = parseInt(tableau, 10) - 1;
      let destF = SUITS[suit];
      newState.foundation[destF].push(newState.tableau[srcT].pop());
    } else if (move.match(/^DR(\d+)$/)) {
      // allows for more draws than stock allows
      // this is the idea of the K+ state representation
      let drawTimes = parseInt(move.match(/^DR(\d+)$/)[1], 10);
      while (drawTimes > 0) {
        if (newState.stock.length === 0) {
          newState.stock = [...newState.waste].map(c => c.toLowerCase());
          newState.stock.reverse(); // ShootMe/KlondikeSolver
          newState.waste = [];
        }
        let stockLen = newState.stock.length;
        for (let draw = 0; draw < Math.min(3, stockLen); draw++) {
          newState.waste.push(newState.stock.pop().toUpperCase());
        }
        drawTimes--;
      }
    } else if (move.match(/^W(\d)$/)) {
      let destT = parseInt(move.match(/^W(\d)$/)[1], 10) - 1;
      newState.tableau[destT].push(newState.waste.pop());
    } else if (move.match(/^W([CDSH])$/)) {
      let fnd = SUITS[move.match(/^W([CDSH])$/)[1]];
      newState.foundation[fnd].push(newState.waste.pop());
    } else if (move === "NEW") {
      newState.stock = [...newState.waste].map(c => c.toLowerCase());
      newState.stock.reverse(); // ShootMe/KlondikeSolver
      newState.waste = [];
    } else if (move.match(/^(\d)(\d)-(\d+)$/)) {
      let [x, y, num] = move
        .match(/^(\d)(\d)-(\d+)$/)
        .slice(1)
        .map(x => parseInt(x, 10));
      x--;
      y--;
      let movingCards = state.tableau[x].slice(-num);
      newState.tableau[x] = state.tableau[x].slice(0, -num);
      newState.tableau[y] = [...state.tableau[y], ...movingCards];
    } else if (move.match(/^([CDSH])(\d)$/)) {
      // move from foundation to tableau
      let m = move.match(/^([CDSH])(\d)$/);
      let fnd = SUITS[m[1]];
      let tab = parseInt(m[2], 10) - 1;
      let card = newState.foundation[fnd].pop();
      newState.tableau[tab].push(card);
    } else {
      console.info("unrecognized move", move);
      debugger;
    }
    if (moveSeq.length >= 1 && moveSeq[0].match(/^F(\d+)$/)) {
      moveSeq.shift(); // skip the flip card moves
    }
    newState.moveSeq = [...moveSeq];
    ensureFlippedUp(newState);
    return true;
  }
  window.doMove = doMoveFromSequence;

  // RUN THIS CODE IN THE BROWSER FOR DEMO
  window.autoMove = (delay = 100) => {
    let intervalId = setInterval(() => {
      requestAnimationFrame(() => {
        let canContinue = window.doMove();
        if (!canContinue) {
          clearInterval(intervalId);
        }
      });
    }, delay);
  };

  function setState(newState) {
    stateTracker.push(state);
    setStateImpl(newState);
  }

  function undo() {
    if (stateTracker.length >= 1) {
      setStateImpl(stateTracker.pop());
    }
  }

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

  window.copyState = () => window.copy(JSON.stringify(state));

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
  }

  let ensureFlippedUp = state => {
    let tableau = [...state.tableau];
    tableau.forEach(stack => {
      if (stack.length > 0) {
        let last = stack.length - 1;
        stack[last] = stack[last].toUpperCase();
      }
    });
    setState({ ...state, tableau });
  };

  let handleCardClick = card => evt => {
    evt.stopPropagation();
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
      let newState = cloneDeep(state);

      if (src.location === "tableau") {
        let clickedIdx = state.tableau[src.pile].indexOf(clicked);
        if (dest.location === "tableau") {
          if (src.pile === dest.pile) {
            console.error("cant move to the same pile");
            setClicked(null);
            return;
          }
          let dragPile = state.tableau[src.pile].slice(clickedIdx);
          let newTableau = state.tableau[src.pile].slice(0, clickedIdx);
          newState.tableau[src.pile] = newTableau;
          newState.tableau[dest.pile] = [
            ...state.tableau[dest.pile],
            ...dragPile
          ];
        } else if (dest.location === "foundation") {
          if (last(state.tableau[src.pile]) !== clicked) {
            console.error("cant move several cards to foundation");
            setClicked(null);
            return;
          }
          newState.foundation[dest.pile].push(newState.tableau[src.pile].pop());
          let foundationSuit = FOUNDATION[dest.pile];
          addMove(`${src.pile + 1}${foundationSuit}`);
        }
      } else if (src.location === "waste") {
        newState[dest.location][dest.pile].push(newState.waste.pop());
        addMove(`W${dest.pile + 1}`);
      } else if (src.location === "foundation") {
        newState[dest.location][dest.pile].push(
          newState[src.location][src.pile].pop()
        );
      } else {
        console.error("unknown card source");
        debugger;
      }
      setState(newState);
      ensureFlippedUp(newState);
      setClicked(null);
    }
  };

  let handleFoundationClick = foundation => evt => {
    if (clicked === null) {
      return;
    }
    let newState = cloneDeep(state);
    let src = findCard(clicked);
    if (src.location === "tableau") {
      if (last(state[src.location][src.pile]) !== clicked) {
        console.error("cannot bring multiple cards to foundation");
        setClicked(null);
        return;
      }
      newState.tableau[src.pile].pop();
      newState.foundation[foundation].push(clicked);
      let foundationSuit = FOUNDATION[foundation];
      addMove(`${src.pile + 1}${foundationSuit}`);
    } else if (src.location === "waste") {
      newState.foundation[foundation].push(newState.waste.pop());
    } else {
      console.error("unknown source");
      debugger;
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
    let newState = cloneDeep(state);
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
      console.error("unknown card source");
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
      stock.reverse();
      waste = [];
    }

    let numToDraw = Math.min(state.stock.length, 3);
    for (let i = 0; i < numToDraw; i++) {
      waste.push(stock.pop().toUpperCase());
    }
    // console.log("stock", stock);
    // console.log("waste", waste);

    setState({
      ...state,
      stock,
      waste
    });

    drawMove(numToDraw);
  }

  return (
    <div className="window">
      <div className="window__inner">
        <div className="window__heading">
          <div className="window__heading-icon" />
          Solitaire
        </div>
        <div className="window__actions">
          <button type="button" className="new-game" onClick={undo}>
            Undo
          </button>
          {"  "}
          <button
            type="button"
            className="new-game"
            onClick={doMoveFromSequence}
          >
            Move
          </button>
          {"  "}
          <button
            type="button"
            className="new-game"
            onClick={() => window.autoMove(80)}
          >
            Auto Solve
          </button>
        </div>
        <div className="window__content">
          <div className="window__content-inner">
            <div className="solitaire" id="js-solitaire">
              <div id="js-finish" className="finish-deck">
                {state.foundation.map((stack, i) => (
                  <div
                    key={i}
                    className={`aces aces--${i}`}
                    onClick={handleFoundationClick(i)}
                  >
                    {stack.map((card, i) => {
                      let doClick = () => {};
                      if (i === stack.length - 1) {
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
