import React, { useEffect, useState } from "react";
import "./App.css";
import { IGame } from "./components/IGame";
import axios from "axios";
import GameList from "./components/GameList";
import AddGame from "./components/AddGame";

function App() {
  const [games, setGames] = useState<IGame[]>([]);
  const reload = async () => {
    try {
      const url = process.env.REACT_APP_API_GAME_URL || "";
      const response = await axios.get(url);
      setGames(response.data);
    } catch (error) {
    }
  };
  useEffect(() => {
    reload();
  }, [])
  return (
    <div>
      <AddGame reload={reload} games={games} />
      <hr />
      <GameList games={games} />
    </div>
  );
}

export default App;
