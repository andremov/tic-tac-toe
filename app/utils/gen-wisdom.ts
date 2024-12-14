import { GameStateType } from "./types";

const wisdom: Record<string, GameStateType> = {};
const playerSymbol = "X";
const cpuSymbol = "O";
const emptySymbol = "-";

function createEmptyBoard(): string[] {
  return emptySymbol.repeat(9).split("");
}

function isWinner(board: string[], symbol: string): boolean {
  const winPositions: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];

  return winPositions.some(
    ([a, b, c]) =>
      board[a] === symbol && board[b] === symbol && board[c] === symbol
  );
}

function fullBoard(board: string[]): boolean {
  return board.every((slot) => slot !== "-");
}

function doTurn(game: string[], turn: string) {
  const gameString = game.join("");

  if (wisdom[gameString] !== undefined) {
    return wisdom[gameString];
  }

  const cpuWon = isWinner(game, cpuSymbol);
  const playerWon = isWinner(game, playerSymbol);
  const tied = fullBoard(game) && !cpuWon && !playerWon;
  const gameComplete = cpuWon || playerWon || tied;

  const wisdomEntry: GameStateType = {
    value: gameString,
    moves: [],
    bestCpu: -1,
    bestPlayer: -1,
    complete: gameComplete,
    tied: tied,
    cpuWon: cpuWon,
    playerWon: playerWon,
    leaves: {
      total: gameComplete ? 1 : -1,
      tie: gameComplete ? (tied ? 1 : 0) : -1,
      cpu: gameComplete ? (cpuWon ? 1 : 0) : -1,
      player: gameComplete ? (playerWon ? 1 : 0) : -1,
    },
  };

  if (wisdomEntry.complete) {
    wisdom[gameString] = wisdomEntry;
    return wisdomEntry;
  }

  const moves: GameStateType[] = [];

  for (let idx = 0; idx < game.length; idx++) {
    const slot = game[idx];

    if (slot !== "-") {
      continue;
    }

    const nextGameState = [...game];
    nextGameState[idx] = turn;

    const result = doTurn(
      nextGameState,
      turn === cpuSymbol ? playerSymbol : cpuSymbol
    );
    moves.push(result);
  }

  wisdomEntry.moves = moves.map((move) => move.value);

  let bestCpuMove = 0;
  let bestCpuPercent = 0;

  for (let idx = 0; idx < moves.length; idx++) {
    const move = moves[idx];

    if (move.bestCpu === -1 && (move.cpuWon || move.tied)) {
      bestCpuMove = idx;
      break;
    }

    if (move.bestCpu === -1 && move.playerWon) {
      continue;
    }

    const nextPlayerMove = wisdom[move.moves[move.bestPlayer]];

    const thisPercent =
      (nextPlayerMove.leaves.cpu + nextPlayerMove.leaves.tie) /
      nextPlayerMove.leaves.total;

    if (thisPercent > bestCpuPercent) {
      bestCpuMove = idx;
      bestCpuPercent = thisPercent;
    }
  }

  let bestPlayerMove = 0;
  let bestPlayerPercent = 0;

  for (let idx = 0; idx < moves.length; idx++) {
    const move = moves[idx];

    if (move.bestPlayer === -1 && move.playerWon) {
      bestPlayerMove = idx;
      break;
    }

    if (move.bestPlayer === -1 && (move.cpuWon || move.tied)) {
      continue;
    }

    const nextCpuMove = wisdom[move.moves[move.bestCpu]];

    const thisPercent = nextCpuMove.leaves.player / nextCpuMove.leaves.total;

    if (thisPercent > bestPlayerPercent) {
      bestPlayerMove = idx;
      bestPlayerPercent = thisPercent;
    }
  }

  wisdomEntry.bestCpu = bestCpuMove;
  wisdomEntry.bestPlayer = bestPlayerMove;
  wisdomEntry.leaves = moves.reduce(
    (acc, curr) => ({
      cpu: acc.cpu + curr.leaves.cpu,
      player: acc.player + curr.leaves.player,
      tie: acc.tie + curr.leaves.tie,
      total: acc.total + curr.leaves.total,
    }),
    { cpu: 0, player: 0, tie: 0, total: 0 }
  );

  wisdom[gameString] = wisdomEntry;

  return wisdomEntry;
}

export function call() {
  doTurn(createEmptyBoard(), "X");
  console.log(JSON.stringify(wisdom));
}
