import { SquareIcon } from "lucide-react";

type GameHistoryPropsType = {
  history: string[];
};

type GameHistoryEntryPropsType = {
  entry: string;
  idx: number;
};

export default function GameHistory(props: GameHistoryPropsType) {
  const { history } = props;
  return (
    <div className="w-0">
      <div className="pl-2 max-h-[272px] w-32 overflow-y-auto">
        {history.map((entry, idx) => (
          <GameHistoryEntry key={idx} entry={entry} idx={idx} />
        ))}
      </div>
    </div>
  );
}

function GameHistoryEntry(props: GameHistoryEntryPropsType) {
  const { entry, idx } = props;

  return (
    <div className="border border-white/30 w-24 rounded-md flex justify-center py-2 gap-4 items-center">
      <span className="text-lg">{idx + 1}.</span>
      <div className="grid grid-cols-3 gap-0.5 w-fit">
        {entry.split("").map((char, idx) => (
          <GameHistoryPiece char={char} key={idx} />
        ))}
      </div>
    </div>
  );
}

function GameHistoryPiece({ char }: { char: string }) {
  switch (char) {
    case "X":
      return <SquareIcon className="w-2 h-2 text-blue-500 fill-blue-500" />;
    case "O":
      return <SquareIcon className="w-2 h-2 text-red-500 fill-red-500" />;
    default:
      return <SquareIcon className="w-2 h-2 text-gray-500" />;
  }
}
