
import React, { useState } from 'react';
import PlayerScore from './PlayerScore';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Default player colors
const PLAYER_COLORS = [
  "#ff3b30", // Red (as seen in the reference)
  "#0a84ff", // Blue (as seen in the reference)
  "#30d158", // Green
  "#ff9f0a", // Orange
];

// Default player names
const DEFAULT_NAMES = ["PLAYER 1", "PLAYER 2", "PLAYER 3", "PLAYER 4"];

const Scoreboard = () => {
  const [playerCount, setPlayerCount] = useState(2);
  
  const handlePlayerCountChange = (value: string) => {
    setPlayerCount(parseInt(value));
  };

  return (
    <div className="relative h-screen w-full font-orbitron">
      <div className="absolute top-4 left-4 z-10">
        <Select value={playerCount.toString()} onValueChange={handlePlayerCountChange}>
          <SelectTrigger className="w-40 bg-black text-white border-white font-orbitron">
            <SelectValue placeholder="Players" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2 Players</SelectItem>
            <SelectItem value="3">3 Players</SelectItem>
            <SelectItem value="4">4 Players</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="h-full w-full flex flex-wrap">
        {Array.from({ length: playerCount }).map((_, index) => (
          <div 
            key={index}
            className={`
              ${playerCount === 2 ? 'w-1/2 h-full' : ''}
              ${playerCount === 3 ? (index === 0 ? 'w-full h-1/2' : 'w-1/2 h-1/2') : ''}
              ${playerCount === 4 ? 'w-1/2 h-1/2' : ''}
            `}
          >
            <PlayerScore
              initialName={DEFAULT_NAMES[index]}
              color={PLAYER_COLORS[index]}
              index={index}
            />
          </div>
        ))}
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="absolute bottom-4 right-4 bg-black text-white border-white"
        onClick={() => window.location.reload()}
      >
        Reset Game
      </Button>
    </div>
  );
};

export default Scoreboard;
