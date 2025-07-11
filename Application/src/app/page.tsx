"use client";
import React, { useState } from 'react';
import { config1, config2, config3 } from '../puzzle';
import { Model } from '../model';
import { BoardGUI } from '../boundary';
import { PuzzleConfig } from '../controllers';

export default function Home() {
  const [selectedConfig, setSelectedConfig] = useState<null | string>(null);
  const [model, setModel] = useState<Model | null>(null);
  const [redraw, setRedraw] = useState(0);

  function refresh() {
    setRedraw(redraw + 1);
  }

  function handleSelectConfig(config: PuzzleConfig) {
    setSelectedConfig(config.name);
    setModel(new Model(config));
  }

  // Function to handle going back to the configuration selection screen
  function handleGoBack() {
    setSelectedConfig(null);
    setModel(null);
  }

  if (!selectedConfig) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
        <h1 className="text-8xl font-bold mb-8 text-gray-800">Syllablast</h1>
        <h2 className="text-1xl font-bold mb-8 text-gray-800">By Sonu Tejwani</h2>
        <h3 className="text-2xl font-bold mb-8 text-gray-800">Choose Your Puzzle Configuration</h3>
        <div className="flex flex-col space-y-4">
          {[config1, config2, config3].map((config) => (
            <button 
              key={config.name} 
              className="bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleSelectConfig(config)}
            >
              {config.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <BoardGUI topmodel={model!} redraw={refresh} />
      <button 
        className="text-2xl mt-4 bg-red-500 hover:bg-red-800 text-white font-bold py-2 px-4 rounded"
        onClick={handleGoBack}
      >
        Choose Another Configuration
      </button>
    </div>
  );
}
