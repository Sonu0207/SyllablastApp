import { describe, it, expect, beforeEach } from 'vitest';
import { Model, Coordinate } from './model';
import { handleReset, handleSyllableSelection, handleUndo } from './controllers';
import { config1, config2, config3 } from './puzzle';
import { BoardGUI } from './boundary';
import Home from './app/page';

describe('Model', () => {
    let model: Model;


    beforeEach(() => {
        const puzzleConfig = {
            words: ["ja,va,scr,ipt" , "re,st,le, ss" , "li,n,u,x " , "se, r,ve,rs"],
            initial: [
                ['st', 'ipt', 're', 'n'],
                ['rs', 'ja', 'li', 'le'],
                ['x', 'se', 'va', 'ss'],
                ['scr', 'r', 've', 'u']
            ]
        };
        model = new Model(puzzleConfig);
    });

    it('check if model is initialize correctly', () => {
        expect(model.swapCount).toBe(0);
        expect(model.score).toBe(0);
        expect(model.isFrozen).toBe(false);
        expect(model.board.syllables).toEqual([
            ['st', 'ipt', 're', 'n'],
            ['rs', 'ja', 'li', 'le'],
            ['x', 'se', 'va', 'ss'],
            ['scr', 'r', 've', 'u']
        ]);
    });

    it('should swap syllables correctly', () => {
        const first = new Coordinate(3, 0);
        const second = new Coordinate(3, 3);
        model.swapSyllables(first, second);
        expect(model.board.syllables[3][0]).toBe('u');
        expect(model.board.syllables[3][3]).toBe('scr');
        expect(model.swapCount).toBe(1);
    });
    it('should not swap if same syllable is selected', () => {
        const first = new Coordinate(0, 0);
        const second = new Coordinate(0, 0);
        model.swapSyllables(first, second);
        expect(model.board.syllables[0][0]).toBe('st');
        expect(model.swapCount).toBe(0)});

    it('should update score correctly', () => {
        model.swapSyllables(new Coordinate(1, 0), new Coordinate(1, 3)); // Swap rs and le
        model.updateScore();
        // No change in score as no word starting with 'le'
        expect(model.score).toBe(0); 

        model.swapSyllables(new Coordinate(0, 0), new Coordinate(1, 1));
        model.updateScore();
        expect(model.score).toBe(1);
    });

    it('should detect victory', () => {
        // Winning condition
        model.board.syllables = [
            ['ja', 'va', 'scr', 'ipt'],
            ['re', 'st', 'le', 'ss'],
            ['li', 'n', 'u', 'x'],
            ['se', 'r', 've', 'rs']
        ];
        model.score = 16;
        model.checkVictory();
        expect(model.isFrozen).toBe(true); // Should freeze the board if victory
    });

    it('should undo the last swap', () => {
        const first = new Coordinate(0, 0);
        const second = new Coordinate(0, 1);
        model.swapSyllables(first, second);
        expect(model.board.syllables[0][0]).toBe('ipt'); // Should swap 'st' with 'ipt'
        model.undo();
        expect(model.board.syllables[0][0]).toBe('st');
        expect(model.swapCount).toBe(0); // Swap count should decrement
    });

    it('should not allow swapping when frozen', () => {
        model.freezeBoard(); // Manually freeze the board
        const first = new Coordinate(0, 0);
        const second = new Coordinate(0, 1);
        model.swapSyllables(first, second);
        expect(model.board.syllables[0][0]).toBe('st'); // State should not change
    });
});



// Test Controllers
describe('Controllers', () => {
    let model: Model;
    let refresh: () => void;

    beforeEach(() => {
        const puzzleConfig = {
            words: ["ja,va,scr,ipt" , "re,st,le, ss" , "li,n,u,x " , "se, r,ve,rs"],
            initial: [
                ['st', 'ipt', 're', 'n'],
                ['rs', 'ja', 'li', 'le'],
                ['x', 'se', 'va', 'ss'],
                ['scr', 'r', 've', 'u']
            ]
        };
        model = new Model(puzzleConfig);
        refresh = () => {}; 
    });

    it('should reset the model state correctly', () => {
        // Set up initial state
        model.swapCount = 15;
        model.score = 12;
        model.isFrozen = true;
        model.board.syllables[0][0] = 'li';

        // Call handleReset
        handleReset(model, refresh);
        // Model state should be reset to initial configuration with score and swapcount to be 0
        expect(model.swapCount).toBe(0);
        expect(model.score).toBe(0);
        expect(model.isFrozen).toBe(false);
        expect(model.board.syllables).toEqual([
            ['st', 'ipt', 're', 'n'],
            ['rs', 'ja', 'li', 'le'],
            ['x', 'se', 'va', 'ss'],
            ['scr', 'r', 've', 'u']
        ]);
    });

    it('should handle syllable selection and swapping', () => {
        const firstCoord = new Coordinate(3, 0);
        const secondCoord = new Coordinate(1, 1);
        handleSyllableSelection(model, firstCoord, refresh);
        handleSyllableSelection(model, secondCoord, refresh);
        expect(model.board.syllables[3][0]).toBe('ja'); // r and ja should be swapped
        expect(model.swapCount).toBe(1);
        expect(model.score).toBe(1);
    });

    it('should handle undo correctly', () => {
        const firstCoord = new Coordinate(3, 3);
        const secondCoord = new Coordinate(2, 3);
        // Saving the initial state to check after undo
        const initialState = model.board.syllables.map(row => [...row]);
        handleSyllableSelection(model, firstCoord, refresh);
        handleSyllableSelection(model, secondCoord, refresh);
        expect(model.swapCount).toBe(1);
        // Undo
        handleUndo(model, refresh);
        expect(model.board.syllables).toEqual(initialState); // Board state should be initial state
        expect(model.swapCount).toBe(0); // Swap count should decrease
    });
});



// Test Puzzle Configurations
describe('Puzzle Configurations', () => {
  it('config1 has correct structure', () => {
    expect(config1).toHaveProperty('words');
    expect(Array.isArray(config1.words)).toBe(true);
    expect(config1.words.length).toBe(4); // Check for four words
    expect(config1).toHaveProperty('initial');
    expect(Array.isArray(config1.initial)).toBe(true);
    expect(config1.initial.length).toBe(4); // Check rows
    // check columns
    config1.initial.forEach(row => {
      expect(row.length).toBe(4);
    });
  });

  it('config2 has structure', () => {
    expect(config2).toHaveProperty('words');
    expect(Array.isArray(config2.words)).toBe(true);
    expect(config2.words.length).toBe(4); // Check for four words
    expect(config2).toHaveProperty('initial');
    expect(Array.isArray(config2.initial)).toBe(true);
    expect(config2.initial.length).toBe(4); // Check rows
    // check columns
    config2.initial.forEach(row => {
      expect(row.length).toBe(4);
    });
  });

  it('config3 has correct properties and structure', () => {
    expect(config3).toHaveProperty('words');
    expect(Array.isArray(config3.words)).toBe(true);
    expect(config3.words.length).toBe(4); // Check for four words
    expect(config3).toHaveProperty('initial');
    expect(Array.isArray(config3.initial)).toBe(true);
    expect(config3.initial.length).toBe(4); // Check rows
    // checkcolumns
    config3.initial.forEach(row => {
      expect(row.length).toBe(4);
    });
  });
});


// Test Boundary
describe('Boundary', () => {
  it('BoardGUI should be defined', () => {
    expect(BoardGUI).toBeDefined();
  });
});

// Test Page
describe('Home', () => {
  it('Home should be defined', () => {
    expect(Home).toBeDefined();
  });
})