const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { exec } = require("child_process");
const app = express();
const port = 3005;

app.use(cors());

app.get("/", (req, res) => res.send("Hello World!"));

/*
seed 11 - impossible
*/

let cache = {};

fs.readFile("./seed12.txt", (err, data) => {
  cache["12"] = data;
  console.log("saved resp for seed 12");
});

function parseSolvitaireDeck(shootMeOutput) {
  let lines = shootMeOutput
    .split("\n")
    .slice(0, 16)
    .map(line => line.trim())
    .map(line => line.replace("T", "10").slice(3));

  let waste = lines[8].toLowerCase().split(" ");
  waste.reverse();

  let tabLines = lines.slice(1, 8);
  let tableau = tabLines.map((line, tableauIdx) => {
    let tab = line.replace(/ ?-/g, " ").split(" ");
    tab.reverse();
    return tab.map((t, i) => {
      if (i !== tableauIdx) {
        // non-last cards in tableau are face down
        return t.toLowerCase();
      } else {
        // last card in the tableau is face up
        return t.toUpperCase();
      }
    });
  });

  return {
    waste,
    tableau
  };
}

function parseMoveSequence(shootMeOutput) {
  let lines = shootMeOutput.trim().split("\n");
  return lines[lines.length - 1].split(" ");
}

async function shootMeResponse(seed) {
  return new Promise((resolve, rej) => {
    if (seed in cache) {
      console.log("we have cached response for seed", seed);
      resolve(cache[seed]);
    } else {
      const bin = "/Users/glifchits/Development/Klondike-Solver/KlondikeSolver";
      const cmd = `${bin} /G ${seed} /R /DC 3 /MOVES`;
      console.log(`running ${cmd}`);
      exec(cmd, (err, stdout, stderr) => {
        console.info("saving cached response");
        cache[seed] = stdout;
        resolve(cache[seed]);
      });
    }
  });
}

app.get("/game/:seed", async (req, res) => {
  let seed = req.params.seed;
  let resp = await shootMeResponse(seed);
  let output = resp.toString("ascii");
  let deck = parseSolvitaireDeck(output);
  let moveSeq = parseMoveSequence(output);
  res.send({ deck, moveSeq, output });
});

app.listen(port, () => console.log(`Solver app listening on port ${port}!`));
