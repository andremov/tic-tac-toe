import { GameStateType } from "./types";
import data from "./wisdom.json";

function getGameState(game: string) {
  return (data as Record<string, GameStateType>)[game] as GameStateType;
}
export function getBestMove(game: string) {
  const gameStateData = getGameState(game);

  return gameStateData.moves[gameStateData.best];
}
