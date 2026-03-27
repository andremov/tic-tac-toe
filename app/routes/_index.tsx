import type { MetaFunction } from "@remix-run/node";
import clsx from "clsx";
import { DotIcon } from "lucide-react";
import { useEffect, useState } from "react";
import GameField from "~/_components/game-field";
import GameHistory from "~/_components/game-history";
import { isTie, isWinner } from "~/utils/functions";
import { call } from "~/utils/gen-wisdom";
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
    const generateWisdom = false;
    if (generateWisdom) {
      call();
    }
  }, []);

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
    <div className="flex flex-col h-screen items-center justify-between py-10 bg-cream">
      <div className="flex items-center gap-3">
        <img src="/favicon.svg" alt="" className="h-8 w-8 -rotate-12" />
        <h1 className="text-4xl font-bold select-none font-serif text-walnut">Tic Tac Toe</h1>
      </div>

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
                  "bg-blue-100 text-blue-600": turn % 2 === 0,
                  "bg-red-100 text-red-600": turn % 2 === 1,
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
                  "bg-blue-100 text-blue-600": winner === "X",
                  "bg-red-100 text-red-600": winner === "O",
                  "bg-sand/50 text-warm-gray": winner === "T",
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
            className="border border-sand hover:border-terracotta bg-cream hover:bg-terracotta/10 transition py-2 px-8 rounded-md text-walnut"
            onClick={restartGame}
          >
            Restart
          </button>
        </div>
      </div>

      <a href="https://andremov.dev" target="_blank" rel="noopener noreferrer" className="text-warm-gray hover:text-terracotta transition-colors duration-200">
        Built by Andrés Movilla
      </a>
    </div>
  );
}
