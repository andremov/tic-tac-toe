import { GameStateType } from "./types";
import data from "./wisdom.json";

function getGameState(game: string) {
  return (data as Record<string, GameStateType>)[game] as GameStateType;
}
export function getBestMove(game: string): string {
  const currentGameState = getGameState(game);

  // const bestMove = getGameState(
  //   currentGameState.moves[currentGameState.bestCpu]
  // );

  // const playerNextMove = getGameState(bestMove.moves[bestMove.bestCpu]);

  // console.log({ currentGameState, bestMove, playerNextMove });

  return currentGameState.moves[currentGameState.bestCpu];
}
