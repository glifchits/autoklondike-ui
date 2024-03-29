# solver-server

A simple server that communicates with [ShootMe/Klondike-Solver](https://github.com/ShootMe/Klondike-Solver)
to provide an HTTP interface for Klondike solutions.

## Setup

1. Clone and compile ShootMe/Klondike-Solver on your machine
2. Set up a symlink in this folder to the `KlondikeSolver` binary
3. Run `yarn` to install local node modules

## Usage

1. `yarn start` to start the server
2. Make a request to `localhost:3001/game/:seed`

### Example request

http://localhost:3005/game/12

```json
{
  "deck": {
    "stock": [
      "kc",
      "9c",
      "qc",
      "8c",
      "3c",
      "7s",
      "7h",
      "10c",
      "4c",
      "7d",
      "ks",
      "ad",
      "qs",
      "kh",
      "qd",
      "10h",
      "8s",
      "ah",
      "6h",
      "4h",
      "as",
      "2d",
      "10d",
      "3h"
    ],
    "tableau": [
      ["8H"],
      ["3d", "6C"],
      ["5s", "jd", "JS"],
      ["2h", "kd", "7c", "9S"],
      ["qh", "8d", "jc", "2c", "AC"],
      ["4s", "6s", "2s", "3s", "9d", "5C"],
      ["5h", "6d", "5d", "4d", "10s", "9h", "JH"]
    ]
  },
  "moveSeq": [
    "5C",
    "F5",
    "5C",
    "F5",
    "DR3",
    "W5",
    "45",
    "F4",
    "41",
    "F4",
    "DR1",
    "W4",
    "74",
    "F7",
    "DR3",
    "W7",
    "WC",
    "DR1",
    "NEW",
    "DR2",
    "W1",
    "W6",
    "WS",
    "DR3",
    "W4",
    "WC",
    "74-2",
    "F7",
    "61-2",
    "F6",
    "67",
    "F6",
    "61",
    "F6",
    "6S",
    "F6",
    "1S",
    "W4",
    "64",
    "F6",
    "6S",
    "W6",
    "WD",
    "15-5",
    "W1",
    "W6",
    "36",
    "F3",
    "W7",
    "WH",
    "WD",
    "DR1",
    "W1",
    "31",
    "F3",
    "3S",
    "4S",
    "WS",
    "71-3",
    "F7",
    "W1",
    "43-7",
    "F4",
    "4H",
    "W6",
    "WH",
    "5H",
    "5C",
    "2C",
    "F2",
    "2D",
    "7D",
    "F7",
    "7D",
    "F7",
    "7D",
    "F7",
    "7H",
    "5H",
    "1H",
    "3D",
    "5C",
    "1S",
    "3C",
    "5H",
    "5S",
    "3H",
    "5H",
    "DR1",
    "W2",
    "WC",
    "3C",
    "5C",
    "F5",
    "5D",
    "F5",
    "1D",
    "1S",
    "6D",
    "1D",
    "3H",
    "6S",
    "1C",
    "3S",
    "5H",
    "6D",
    "1H",
    "2C",
    "3D",
    "6S"
  ],
  "output": "0: \n1: 8H\n2: 6C -3D\n3: JS -JD-5S\n4: 9S -7C-KD-2H\n5: AC -2C-JC-8D-QH\n6: 5C -9D-3S-2S-6S-4S\n7: JH -9H-TS-4D-5D-6D-5H\n8: 3H TD 2D AS 4H 6H AH 8S TH QD KH QS AD KS 7D 4C TC 7H 7S 3C 8C QC 9C KC\n9:\n10:\n11:\n12:\nMinimum Moves Needed: 86\n\nMinimal solution in 116 moves. Took 5198772 ms.\n----------------------------------------\nMove AC from tableau 5 on to foundation and flip tableau 5\n\n0:\n1: 8H\n2: 6C -3D\n3: JS -JD-5S\n4: 9S -7C-KD-2H\n5: 2C -JC-8D-QH\n6: 5C -9D-3S-2S-6S-4S\n7: JH -9H-TS-4D-5D-6D-5H\n8: 3H TD 2D AS 4H 6H AH 8S TH QD KH QS AD KS 7D 4C TC 7H 7S 3C 8C QC 9C KC\n9: AC\n10:\n11:\n12:\nMinimum Moves Needed: 84\n\n----------------------------------------\nMove 2C from tableau 5 on to foundation and flip tableau 5\n\n0:\n1: 8H\n2: 6C -3D\n3: JS -JD-5S\n4: 9S -7C-KD-2H\n5: JC -8D-QH\n6: 5C -9D-3S-2S-6S-4S\n7: JH -9H-TS-4D-5D-6D-5H\n8: 3H TD 2D AS 4H 6H AH 8S TH QD KH QS AD KS 7D 4C TC 7H 7S 3C 8C QC 9C KC\n9: 2C AC\n10:\n11:\n12:\nMinimum Moves Needed: 82\n\n----------------------------------------\nDraw 3 times and move TH from waste on to tableau 5\n\n0: 8S AH 6H 4H AS 2D TD 3H\n1: 8H\n2: 6C -3D\n3: JS -JD-5S\n4: 9S -7C-KD-2H\n5: TH JC -8D-QH\n6: 5C -9D-3S-2S-6S-4S\n7: JH -9H-TS-4D-5D-6D-5H\n8: QD KH QS AD KS 7D 4C TC 7H 7S 3C 8C QC 9C KC\n9: 2C AC\n10:\n11:\n12:\nMinimum Moves Needed: 82\n\n----------------------------------------\nMove 9S from tableau 4 on to tableau 5 and flip tableau 4\n\n0: 8S AH 6H 4H AS 2D TD 3H\n1: 8H\n2: 6C -3D\n3: JS -JD-5S\n4: 7C -KD-2H\n5: 9S TH JC -8D-QH\n6: 5C -9D-3S-2S-6S-4S\n7: JH -9H-TS-4D-5D-6D-5H\n8: QD KH QS AD KS 7D 4C TC 7H 7S 3C 8C QC 9C KC\n9: 2C AC\n10:\n11:\n12:\nMinimum Moves Needed: 81\n\n----------------------------------------...\nMove KC from tableau 2 on to foundation\n\n0:\n1:\n2:\n3: KD\n4:\n5:\n6: KS\n7:\n8:\n9: KC QC JC TC 9C 8C 7C 6C 5C 4C 3C 2C AC\n10: QD JD TD 9D 8D 7D 6D 5D 4D 3D 2D AD\n11: QS JS TS 9S 8S 7S 6S 5S 4S 3S 2S AS\n12: KH QH JH TH 9H 8H 7H 6H 5H 4H 3H 2H AH\nMinimum Moves Needed: 2\n\n----------------------------------------\nMove KD from tableau 3 on to foundation\n\n0:\n1:\n2:\n3:\n4:\n5:\n6: KS\n7:\n8:\n9: KC QC JC TC 9C 8C 7C 6C 5C 4C 3C 2C AC\n10: KD QD JD TD 9D 8D 7D 6D 5D 4D 3D 2D AD\n11: QS JS TS 9S 8S 7S 6S 5S 4S 3S 2S AS\n12: KH QH JH TH 9H 8H 7H 6H 5H 4H 3H 2H AH\nMinimum Moves Needed: 1\n\n----------------------------------------\nMove KS from tableau 6 on to foundation\n\n0:\n1:\n2:\n3:\n4:\n5:\n6:\n7:\n8:\n9: KC QC JC TC 9C 8C 7C 6C 5C 4C 3C 2C AC\n10: KD QD JD TD 9D 8D 7D 6D 5D 4D 3D 2D AD\n11: KS QS JS TS 9S 8S 7S 6S 5S 4S 3S 2S AS\n12: KH QH JH TH 9H 8H 7H 6H 5H 4H 3H 2H AH\nMinimum Moves Needed: 0\n\n----------------------------------------\n5C F5 5C F5 DR3 W5 45 F4 41 F4 DR1 W4 74 F7 DR3 W7 WC DR1 NEW DR2 W1 W6 WS DR3 W4 WC 74-2 F7 61-2 F6 67 F6 61 F6 6S F6 1S W4 64 F6 6S W6 WD 15-5 W1 W6 36 F3 W7 WH WD DR1 W1 31 F3 3S 4S WS 71-3 F7 W1 43-7 F4 4H W6 WH 5H 5C 2C F2 2D 7D F7 7D F7 7D F7 7H 5H 1H 3D 5C 1S 3C 5H 5S 3H 5H DR1 W2 WC 3C 5C F5 5D F5 1D 1S 6D 1D 3H 6S 1C 3S 5H 6D 1H 2C 3D 6S\n"
}
```
