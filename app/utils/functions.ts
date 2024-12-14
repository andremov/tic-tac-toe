export function isWinner(board: string, player: string): boolean {
  const winPositions: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  return winPositions.some(
    ([a, b, c]) =>
      board[a] === player && board[b] === player && board[c] === player
  );
}

export function isTie(board: string): boolean {
  return board.split("").every((slot) => slot !== "-");
}
