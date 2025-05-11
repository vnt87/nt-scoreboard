import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlayerScoreProps {
  id: number;
  name: string;
  score: number;
  color: string;
  onScoreChange: (newScore: number) => void;
  onNameChange: (newName: string) => void;
}

const PlayerScore = ({
  id,
  name,
  score,
  color,
  onScoreChange,
  onNameChange,
}: PlayerScoreProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(name);

  const increaseScore = () => {
    onScoreChange(score + 1);
  };

  const decreaseScore = () => {
    onScoreChange(score - 1);
  };

  const startEditing = () => {
    setIsEditing(true);
    setInputValue(name);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNameChange(inputValue || name);
    setIsEditing(false);
  };

  const handleBlur = () => {
    onNameChange(inputValue || name);
    setIsEditing(false);
  };

  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center h-full w-full",
        "transition-all duration-300"
      )}
      style={{ backgroundColor: color }}
    >
      <div className="w-full px-6 py-3 text-center">
        {isEditing ? (
          <form onSubmit={handleNameSubmit} className="flex justify-center">
            <Input
              type="text"
              value={inputValue}
              onChange={handleNameChange}
              onBlur={handleBlur}
              autoFocus
              className="font-bai text-white text-xl md:text-2xl bg-transparent border-white text-center w-3/4"
              maxLength={15}
            />
          </form>
        ) : (
          <h2 
            className="font-bai text-white text-xl md:text-2xl font-bold uppercase tracking-wider cursor-pointer"
            onClick={startEditing}
          >
            {name}
          </h2>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center w-full relative">
        <Button
          className="absolute left-4 top-1/2 -translate-y-1/2 p-0 bg-transparent border-none shadow-none hover:bg-transparent focus:bg-transparent active:bg-transparent"
          onClick={decreaseScore}
        >
          <Minus className="h-10 w-10" />
        </Button>
        <span className="font-dseg text-7xl sm:text-9xl md:text-[12rem] lg:text-[16rem] font-bold text-black select-none mx-auto">
          {score}
        </span>
        <Button
          className="absolute right-4 top-1/2 -translate-y-1/2 p-0 bg-transparent border-none shadow-none hover:bg-transparent focus:bg-transparent active:bg-transparent"
          onClick={increaseScore}
        >
          <Plus className="h-10 w-10" />
        </Button>
      </div>
    </div>
  );
};

export default PlayerScore;
