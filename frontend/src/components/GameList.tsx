import React from "react";
import { IGame } from "./IGame";
import Game from "./Game"; // Import the Game component

type GameListProps = {
  games: IGame[];
};

const GameList: React.FC<GameListProps> = ({ games }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-center">Game List</h2>
      {games.length === 0 ? (
        <p className="text-gray-500 text-center">No games available.</p>
      ) : (
        <div className="grid gap-4">
          {games.map((game) => (
            <Game key={game.name} game={game} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GameList;
