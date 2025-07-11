import React, { useState } from 'react';
import { Model, Coordinate } from './model';
import { realHandle } from './controllers';

export function BoardGUI({ topmodel, redraw }: { topmodel: Model; redraw: () => void }) {
  const [firstSelection, setFirstSelection] = useState<Coordinate | null>(null);
  function handleReset() {
    topmodel.isFrozen = false;
    realHandle(topmodel, redraw);
    redraw();
  }
  
  function handleClick(r: number, c: number) {
    if (firstSelection === null) {
      setFirstSelection(new Coordinate(r, c));
    } else {
      // Swap syllables
      topmodel.swapSyllables(firstSelection, new Coordinate(r, c));
      setFirstSelection(null);
      redraw();
    }
  }
  return (
    <div className="game-container flex flex-col md:flex-row items-start justify-center gap-4 p-6 rounded-lg shadow-lg">
      {/* Game board */}
      <div className="board grid grid-cols-4 gap-2">
        {topmodel.board.syllables.map((row, rowIndex) => (
          <div className="row flex" key={rowIndex}>
            {row.map((syllable, colIndex) => (
              <button 
                className="square text-xl font-semibold text-gray-800 bg-white border-2 border-gray-300 rounded-lg transition duration-300 ease-in-out hover:bg-green-100" 
                key={colIndex} 
                onClick={() => handleClick(rowIndex, colIndex)}
              >
                {syllable}
              </button>
            ))}
          </div>
        ))}
      </div>
  
      {/* Score display */}
      <div className="p-4 bg-white border rounded-lg shadow-md flex flex-col items-center justify-center">
      <span className="text-lg font-bold text-white">Score: {topmodel.score}</span>
      <span className="text-lg font-bold text-white">Swaps: {topmodel.swapCount}</span>
      </div>


      {/* Undo and Reset */}
      <div className="flex flex-col gap-2">
        <button 
        style={{ backgroundColor: '#3B82F6' }}
          className="text-white font-bold py-2 px-4 rounded" 
          onClick={() => {
            topmodel.undo();
            redraw();
          }}
        >Undo
        </button>
        
        <button 
        style={{ backgroundColor: '#EF4444' }}
          className="text-white font-bold py-2 px-4 rounded" 
          onClick={() => {
            handleReset();
          }}
        >Reset
        </button>
      </div>
    </div>
  );  
}