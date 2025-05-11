import React, { useState, useEffect, useRef } from 'react';
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
import { Switch } from "@/components/ui/switch";
import { useWakeLock } from "@/hooks/useWakeLock";
import { toast } from "@/components/ui/sonner";
import { Menu, RotateCcw, Maximize, Minimize, ExternalLink, Github, DollarSign } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useScreenDetails } from "@/hooks/useScreenDetails";

const PLAYER_COLORS = [
  "#ff3b30",
  "#0a84ff",
  "#30d158",
  "#ff9f0a",
];

const NEW_PLAYER_CANDIDATE_NAMES = [
  "Nam the Man",
  "Huy Tóc Dài",
  "Sên Van Tính",
  "Hiếu Se Điếu",
  "Tuấn Hoa Hồng",
  "Công Mong"
];
const SCOREBOARD_STORAGE_KEY = 'ntScoreboardState';

interface Player {
  id: number;
  name: string;
  score: number;
  color: string;
}

/**
 * Generate default players with unique, random names from NEW_PLAYER_CANDIDATE_NAMES.
 * If the pool is exhausted, fallback to "Player N".
 */
function getDefaultPlayers(count: number): Player[] {
  // Shuffle the candidate names
  const shuffledNames = [...NEW_PLAYER_CANDIDATE_NAMES].sort(() => Math.random() - 0.5);
  const usedNames = new Set<string>();
  return Array.from({ length: count }).map((_, i) => {
    let name = shuffledNames.find(n => !usedNames.has(n));
    if (!name) {
      name = `Player ${i + 1}`;
    }
    usedNames.add(name);
    return {
      id: i,
      name,
      score: 0,
      color: PLAYER_COLORS[i % PLAYER_COLORS.length],
    };
  });
}

const Scoreboard = () => {
  const [players, setPlayers] = useState<Player[]>(getDefaultPlayers(2));
  const [keepScreenAwake, setKeepScreenAwake] = useState(false);

  const { isWakeLockSupported, isWakeLockActive, requestWakeLock, releaseWakeLock } = useWakeLock();

  // Handle wake lock toggle effect
  useEffect(() => {
    if (!isWakeLockSupported && keepScreenAwake) {
      toast.error("Screen Wake Lock API is not supported in this browser.");
      setKeepScreenAwake(false);
      return;
    }
    if (keepScreenAwake) {
      requestWakeLock().catch((err) => {
        toast.error("Failed to acquire wake lock: " + (err?.message || "Unknown error"));
        setKeepScreenAwake(false);
      });
    } else {
      releaseWakeLock();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keepScreenAwake, isWakeLockSupported]);

  // Show info toast if wake lock is released unexpectedly
  useEffect(() => {
    if (!isWakeLockActive && keepScreenAwake && isWakeLockSupported) {
      toast.info("Screen wake lock was released.");
      setKeepScreenAwake(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWakeLockActive]);

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

  /**
   * Change the number of players, ensuring new players get unique names from the pool.
   * No duplicate names from NEW_PLAYER_CANDIDATE_NAMES will be assigned.
   */
  const handlePlayerCountChange = (value: string) => {
    const newCount = parseInt(value);
    setPlayers(prev => {
      if (newCount > prev.length) {
        // Add new players with unique names from the pool
        const usedNames = new Set(prev.map(p => p.name));
        // Also track names that will be assigned in this batch
        const newPlayers: Player[] = [];
        let colorIdx = prev.length;
        for (let i = prev.length; i < newCount; i++) {
          // Find a name from the pool not already used
          const availableNames = NEW_PLAYER_CANDIDATE_NAMES.filter(n =>
            !usedNames.has(n) && !newPlayers.some(p => p.name === n)
          );
          let name: string;
          if (availableNames.length > 0) {
            // Pick randomly from available names
            name = availableNames[Math.floor(Math.random() * availableNames.length)];
          } else {
            // Fallback to "Player N"
            name = `Player ${i + 1}`;
          }
          newPlayers.push({
            id: i,
            name,
            score: 0,
            color: PLAYER_COLORS[colorIdx % PLAYER_COLORS.length],
          });
          colorIdx++;
        }
        return [...prev, ...newPlayers];
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

  const { isMobile, isLandscape, height: screenHeight } = useScreenDetails();

  // Helper for responsive player layout
  /**
   * Returns Tailwind classes for player layout based on player count, mobile/landscape state.
   */
  const getPlayerLayoutClasses = (
    playerCount: number,
    index: number,
    isMobileView: boolean,
    isLandscapeView: boolean
  ): string => {
    if (isMobileView) {
      if (isLandscapeView) {
        if (playerCount === 1) return "w-full h-full";
        if (playerCount === 2) return "w-1/2 h-full";
        if (playerCount === 3) return "w-1/3 h-full";
        if (playerCount === 4) return "w-1/2 h-1/2";
        return "w-full h-auto";
      } else {
        if (playerCount === 1) return "w-full h-full";
        if (playerCount === 2) return "w-full h-1/2";
        if (playerCount === 3) return "w-full h-1/3";
        if (playerCount === 4) return "w-full h-1/4";
        return "w-full";
      }
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
            {/* Screen Wake Lock Toggle */}
            <DropdownMenuItem
              onSelect={e => e.preventDefault()}
              className="flex items-center justify-between"
              disabled={!isWakeLockSupported}
            >
              <span className="text-sm flex-1">Keep Screen Awake</span>
              <Switch
                checked={keepScreenAwake}
                onCheckedChange={setKeepScreenAwake}
                disabled={!isWakeLockSupported}
                aria-label="Toggle screen wake lock"
              />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={e => e.preventDefault()}
                  className="text-red-600 focus:text-red-700"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset Game
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cảnh báo</AlertDialogTitle>
                  <AlertDialogDescription>
                    Reset là về 0 hết đấy? Bạn chắc chưa?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset}>Chắc, Reset Đi</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Links</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <a href="https://github.com/vnt87/nt-scoreboard" target="_blank" rel="noopener noreferrer" className="w-full flex items-center">
                <Github className="mr-2 h-4 w-4" />
                Source Code
                <ExternalLink className="ml-auto h-3 w-3 opacity-70" />
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="https://chiabill.pages.dev" target="_blank" rel="noopener noreferrer" className="w-full flex items-center">
                <DollarSign className="mr-2 h-4 w-4" />
                Chia Bill
                <ExternalLink className="ml-auto h-3 w-3 opacity-70" />
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className={`h-full w-full flex ${isMobile && !isLandscape ? 'flex-col' : 'flex-row'} flex-wrap`}>
        {players.map((player, index) => (
          <div 
            key={player.id}
            className={getPlayerLayoutClasses(players.length, index, isMobile, isLandscape)}
          >
            <PlayerScore
              id={player.id}
              name={player.name}
              score={player.score}
              color={player.color}
              onScoreChange={newScore => updatePlayerScore(player.id, newScore)}
              onNameChange={newName => updatePlayerName(player.id, newName)}
              isMobile={isMobile}
              isLandscape={isLandscape}
              screenHeight={screenHeight}
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
