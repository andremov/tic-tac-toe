export type GameState = {
  board: string; // The board as a string of 9 characters
  isComplete: boolean; // Flag indicating if the game is complete (i.e., no empty spaces and a winner or full board)
};

export type GameStateType = {
  value: string;
  moves: string[];
  best: number;
  complete: boolean;
  tied: boolean;
  playerWon: boolean;
  cpuWon: boolean;
  leaves: {
    total: number;
    tie: number;
    cpu: number;
    player: number;
  };
};
