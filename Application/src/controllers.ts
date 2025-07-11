import { Model, Coordinate, Board } from './model'

let firstSelection: Coordinate | null = null; 

export function realHandle(model: Model, refresh: () => void) {
  model.board = new Board();
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      model.board.syllables[r][c] = model.initial[r][c];
    }
  }
  model.swapCount = 0;
  model.score = 0;
  model.history = [];
  model.isFrozen = false;
  refresh();
}


// Handle Reset
export function handleReset(model: Model, refresh: () => void) {
  realHandle(model, refresh);
}

// Handle syllable selection and swap
export function handleSyllableSelection(model: Model, coord: Coordinate, refresh: () => void) {
  if (firstSelection === null) {
      firstSelection = coord;
  } else {
      model.swapSyllables(firstSelection, coord);
      firstSelection = null;
      refresh();
  }
}

// Handle Undo
export function handleUndo(model: Model, refresh: () => void) {
  model.undo();
  refresh();
}

// Handle configurations
export type PuzzleConfig = {
  name: string;
  words: string[];
  initial: string[][];
};