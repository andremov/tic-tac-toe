import clsx from "clsx";
import { CircleIcon, XIcon } from "lucide-react";

type GameFieldPropsType = {
  gameState: string;
  updateGameState: (idx: number) => void;
  canPlay: boolean;
};

export default function GameField(props: GameFieldPropsType) {
  const { gameState, updateGameState, canPlay } = props;

  return (
    <div className="grid grid-cols-3 gap-4">
      {gameState.split("").map((char, idx) => (
        <button
          className={clsx([
            "rounded-md w-20 transition h-20 bg-gray-900 p-4 flex items-center justify-center hover:bg-gray-800 disabled:hover:bg-transparent disabled:bg-transparent disabled:border border-white/10",
          ])}
          key={idx}
          disabled={char !== "-" || !canPlay}
          onClick={() => updateGameState(idx)}
        >
          <GamePiece char={char} />
        </button>
      ))}
    </div>
  );
}

function GamePiece({ char }: { char: string }) {
  switch (char) {
    case "X":
      return <XIcon className="w-10 h-10 text-blue-500" />;
    case "O":
      return <CircleIcon className="w-10 h-10 text-red-500" />;
    default:
      return <></>;
  }
}
