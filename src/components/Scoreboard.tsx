import React, { useState, useEffect } from 'react';
import PlayerScore from './PlayerScore';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Menu, RotateCcw, Maximize, Minimize } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const PLAYER_COLORS = [
  "#ff3b30",
  "#0a84ff",
  "#30d158",
  "#ff9f0a",
];

const DEFAULT_NAMES = ["PLAYER 1", "PLAYER 2", "PLAYER 3", "PLAYER 4"];
const SCOREBOARD_STORAGE_KEY = 'ntScoreboardState';

interface Player {
  id: number;
  name: string;
  score: number;
  color: string;
}

function getDefaultPlayers(count: number): Player[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    name: DEFAULT_NAMES[i],
    score: 0,
    color: PLAYER_COLORS[i],
  }));
}

const Scoreboard = () => {
  const [players, setPlayers] = useState<Player[]>(getDefaultPlayers(2));

  // Load from localStorage on mount
  useEffect(() => {
    const data = localStorage.getItem(SCOREBOARD_STORAGE_KEY);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPlayers(parsed);
        }
      } catch {
        // Ignore parse errors, use default
      }
    }
  }, []);

  // Save to localStorage on players change
  useEffect(() => {
    localStorage.setItem(SCOREBOARD_STORAGE_KEY, JSON.stringify(players));
  }, [players]);

  const handlePlayerCountChange = (value: string) => {
    const newCount = parseInt(value);
    setPlayers(prev => {
      if (newCount > prev.length) {
        // Add new players
        return [
          ...prev,
          ...getDefaultPlayers(newCount).slice(prev.length, newCount)
        ];
      } else {
        // Remove players
        return prev.slice(0, newCount);
      }
    });
  };

  const updatePlayerScore = (playerId: number, newScore: number) => {
    setPlayers(prev =>
      prev.map(p => (p.id === playerId ? { ...p, score: newScore } : p))
    );
  };

  const updatePlayerName = (playerId: number, newName: string) => {
    setPlayers(prev =>
      prev.map(p => (p.id === playerId ? { ...p, name: newName } : p))
    );
  };

  const handleReset = () => {
    localStorage.removeItem(SCOREBOARD_STORAGE_KEY);
    setPlayers(getDefaultPlayers(2));
  };

  const isMobile = useIsMobile();

  // Helper for responsive player layout
  const getPlayerLayoutClasses = (playerCount: number, index: number, isMobileView: boolean): string => {
    if (isMobileView) {
      if (playerCount === 1) return "w-full h-full";
      if (playerCount === 2) return "w-full h-1/2";
      if (playerCount === 3) return "w-full h-1/3";
      if (playerCount === 4) return "w-full h-1/4";
      return "w-full";
    }
    if (playerCount === 1) return "w-full h-full";
    if (playerCount === 2) return "w-1/2 h-full";
    if (playerCount === 3) return "w-1/3 h-full";
    if (playerCount === 4) return "w-1/2 h-1/2";
    return "w-full h-full";
  };

  return (
    <div className="relative h-screen w-full font-orbitron">
      {/* Menu Icon and DropdownMenu in top-right */}
      <div className="absolute top-4 right-4 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label="Open menu"
              className="p-2 rounded-full bg-black/80 hover:bg-black text-white shadow transition"
            >
              <Menu className="h-7 w-7" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="flex items-center justify-between px-2 py-2">
              <span className="text-sm">Players</span>
              <div className="flex items-center gap-2">
                <button
                  aria-label="Decrease players"
                  className="px-2 py-1 rounded bg-gray-200 text-black font-bold text-lg disabled:opacity-50"
                  onClick={() => handlePlayerCountChange(Math.max(1, players.length - 1).toString())}
                  disabled={players.length <= 1}
                  type="button"
                >-</button>
                <span className="w-6 text-center">{players.length}</span>
                <button
                  aria-label="Increase players"
                  className="px-2 py-1 rounded bg-gray-200 text-black font-bold text-lg disabled:opacity-50"
                  onClick={() => handlePlayerCountChange(Math.min(4, players.length + 1).toString())}
                  disabled={players.length >= 4}
                  type="button"
                >+</button>
              </div>
            </div>
            <DropdownMenuSeparator />
            <FullScreenMenuItem />
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={e => { e.preventDefault(); handleReset(); }}
              className="text-red-600 focus:text-red-700"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Game
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className={`h-full w-full flex ${isMobile ? 'flex-col' : 'flex-row'} flex-wrap`}>
        {players.map((player, index) => (
          <div 
            key={player.id}
            className={getPlayerLayoutClasses(players.length, index, isMobile)}
          >
            <PlayerScore
              id={player.id}
              name={player.name}
              score={player.score}
              color={player.color}
              onScoreChange={newScore => updatePlayerScore(player.id, newScore)}
              onNameChange={newName => updatePlayerName(player.id, newName)}
            />
          </div>
        ))}
      </div>
      
    </div>
  );
};

function FullScreenMenuItem() {
  const [isFullscreen, setIsFullscreen] = React.useState(!!document.fullscreenElement);

  React.useEffect(() => {
    const onFullScreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullScreenChange);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <DropdownMenuItem onSelect={e => { e.preventDefault(); toggleFullScreen(); }}>
      {isFullscreen ? (
        <>
          <Minimize className="mr-2 h-4 w-4" />
          Exit Full Screen
        </>
      ) : (
        <>
          <Maximize className="mr-2 h-4 w-4" />
          Enter Full Screen
        </>
      )}
    </DropdownMenuItem>
  );
}

export default Scoreboard;
