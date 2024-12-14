import type { MetaFunction } from "@remix-run/node";
import clsx from "clsx";
import { DotIcon } from "lucide-react";
import { useEffect, useState } from "react";
import GameField from "~/_components/game-field";
import GameHistory from "~/_components/game-history";
import { isTie, isWinner } from "~/utils/functions";
import { getBestMove } from "~/utils/use-wisdom";

export const meta: MetaFunction = () => {
  return [
    { title: "Tic Tac Toe" },
    { name: "description", content: "👤✏️ Andrés Movilla" },
  ];
};

const symbols = ["X", "O"];

const emptyBoard: string[] = ["-", "-", "-", "-", "-", "-", "-", "-", "-"];

export default function Index() {
  const [gameState, setGameState] = useState(emptyBoard.join(""));
  const [turn, setTurn] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [winner, setWinner] = useState("");

  function updateGameState(stringPosition: number) {
    const symbol = symbols[turn % 2];

    setHistory([...history, gameState]);

    const newGameState = gameState
      .split("")
      .map((char, idx) => (idx === stringPosition ? symbol : char))
      .join("");

    setGameState(newGameState);

    if (isWinner(newGameState, symbol)) {
      setWinner(symbol);
    } else {
      if (isTie(newGameState)) {
        setWinner("T");
      } else {
        setTurn(turn + 1);
      }
    }
  }

  function restartGame() {
    setTurn(0);
    setGameState(emptyBoard.join(""));
    setHistory([]);
    setWinner("");
  }

  useEffect(() => {
    if (winner !== "") {
      return;
    }

    if (turn % 2 === 1) {
      const symbol = symbols[turn % 2];

      setHistory([...history, gameState]);
      const newGameState = getBestMove(gameState);
      setGameState(newGameState);

      if (isWinner(newGameState, symbol)) {
        setWinner(symbol);
      } else {
        if (isTie(newGameState)) {
          setWinner("T");
        } else {
          setTurn(turn + 1);
        }
      }
    }
  }, [turn]);

  return (
    <div className="flex flex-col h-screen items-center justify-between py-10">
      <h1 className="text-4xl font-bold select-none">Tic Tac Toe</h1>

      <div className="flex flex-col items-center gap-4">
        <div className="flex">
          <GameField
            canPlay={turn % 2 === 0 && winner === ""}
            gameState={gameState}
            updateGameState={updateGameState}
          />
          <GameHistory history={history} />
        </div>

        <div className="flex gap-2 items-center justify-center">
          {winner === "" ? (
            <span
              className={clsx([
                "w-32 text-center py-2 border border-transparent rounded-md select-none",
                {
                  "bg-blue-900/20 text-blue-400": turn % 2 === 0,
                  "bg-red-900/20 text-red-400": turn % 2 === 1,
                },
              ])}
            >
              {turn % 2 === 0 ? "Your Turn" : "CPU's turn"}
            </span>
          ) : (
            <span
              className={clsx([
                "w-32 text-center py-2 border border-transparent rounded-md select-none",
                {
                  "bg-blue-900/20 text-blue-400": winner === "X",
                  "bg-red-900/20 text-red-400": winner === "O",
                  "bg-gray-900/20 text-gray-400": winner === "T",
                },
              ])}
            >
              {winner === "O"
                ? "CPU wins"
                : winner === "X"
                ? "Player wins"
                : "Tie"}
            </span>
          )}
          <DotIcon />
          <button
            className="border border-white/20 hover:border-white/60 bg-white/0 hover:bg-white/10 transition py-2 px-8 rounded-md"
            onClick={restartGame}
          >
            Restart
          </button>
        </div>
      </div>

      <span className="opacity-70 hover:opacity-100 transition">
        👤✏️ Andrés Movilla
      </span>
    </div>
  );
}
