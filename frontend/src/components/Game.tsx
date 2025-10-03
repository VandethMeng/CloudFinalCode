import React from "react";
import { IGame } from "./IGame";

type GameProps = {
  game: IGame;
};

const Game: React.FC<GameProps> = ({ game }) => {
  return (
    <div className="w-[300px] h-[120px] flex items-center border border-gray-500 rounded-lg shadow-md p-4 bg-white">
      <img
        src={game.imageUrl!}
        alt={game.name}
        className="w-16 h-16 rounded-full border border-gray-400 object-cover"
      />
      <div className="ml-4 flex-1">
        <h3 className="text-lg font-semibold text-gray-800">{game.name}</h3>
        <p className="text-gray-600 text-sm">${game.price}</p>
      </div>
    </div>
  );
};

export default Game;
