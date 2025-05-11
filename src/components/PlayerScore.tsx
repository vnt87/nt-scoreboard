
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlayerScoreProps {
  initialName: string;
  color: string;
  index: number;
}

const PlayerScore = ({ initialName, color, index }: PlayerScoreProps) => {
  const [score, setScore] = useState(0);
  const [name, setName] = useState(initialName);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(initialName);

  const increaseScore = () => {
    setScore(prevScore => prevScore + 1);
  };

  const decreaseScore = () => {
    setScore(prevScore => prevScore - 1);
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setName(inputValue || initialName);
    setIsEditing(false);
  };

  const handleBlur = () => {
    setName(inputValue || initialName);
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

      <div className="flex-1 flex items-center justify-center w-full">
        <div className="flex flex-row items-center justify-center w-full gap-6">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full aspect-square p-0 border-2 border-black bg-white/70"
            onClick={decreaseScore}
          >
            <Minus className="h-6 w-6" />
          </Button>
          <span className="font-dseg text-7xl sm:text-9xl md:text-[12rem] lg:text-[16rem] font-bold text-black select-none">
            {score}
          </span>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full aspect-square p-0 border-2 border-black bg-white/70"
            onClick={increaseScore}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlayerScore;
