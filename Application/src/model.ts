export class Coordinate {
    readonly row: number;
    readonly column: number;

    constructor(row: number, column: number) {
        this.row = row;
        this.column = column;
    }
}

export class Board {
    syllables: string[][];

    constructor() {
        this.syllables = [];
        for (let r: number = 0; r < 4; r++) {
            this.syllables[r] = [];
            for (let c: number = 0; c < 4; c++) {
                this.syllables[r][c] = '';
            }
        }
    }
}

export class Model {
    words: string[];
    initial: string[][];
    board: Board;
    swapCount: number;
    score: number;
    history: string[][][];
    isFrozen: boolean = false;

    constructor(puzzleConfig: {words: string[], initial: string[][]}) {
        this.words = puzzleConfig.words;
        this.initial = puzzleConfig.initial;
        // Initialize the board
        this.board = new Board();
        for (let r: number = 0; r < 4; r++) {
            for (let c: number = 0; c < 4; c++) {
                this.board.syllables[r][c] = puzzleConfig.initial[r][c];
            }
        }

        this.swapCount = 0; 
        this.score = 0;  
        this.history = [];
    }

    // Swap syllables
    swapSyllables(first: Coordinate, second: Coordinate) {
        if (this.isFrozen) {
            return;
        }
        if (first.row === second.row && first.column === second.column) {
            return;  // Handle Same selection
        }
        const { row: r1, column: c1 } = first;
        const { row: r2, column: c2 } = second;
        // Save the current board state in history
        this.history.push(this.cloneBoard(this.board.syllables));
        // Do Swap
        const temp = this.board.syllables[r1][c1];
        this.board.syllables[r1][c1] = this.board.syllables[r2][c2];
        this.board.syllables[r2][c2] = temp;
        this.swapCount++;
        this.updateScore();
        this.checkVictory();
    }

    // Function to clone the current board state
    cloneBoard(board: string[][]): string[][] {
        return board.map(row => [...row]);
    }

    // Update the Score
    updateScore() {
        this.score = 0;
        const words_to_check = this.words.flat();
        // Horizontal Checks
        for (let r = 0; r < 4; r++) {
            const first_syllable = this.board.syllables[r][0];
            let matching_word = null;
            for (let i = 0; i < words_to_check.length; i++) {
                const target_syllables = words_to_check[i].split(",").map(s => s.trim());
                if (first_syllable === target_syllables[0]) {
                    matching_word = target_syllables;
                    break;
                }
            }
            // First syllable matches
            // console.log(matching_word);
            if (matching_word) {
                for (let c = 0; c < 4; c++) {
                    const current_syllable = this.board.syllables[r][c];
    
                    if (current_syllable === matching_word[c]) {
                        this.score++;
                    }
                    else {
                        break;
                    }
                }
            }
        }
    }

    // Victory Check
   checkVictory() {
    const numrows = this.board.syllables.length;
    const numcols = this.board.syllables[0].length;
        if (this.score === numrows * numcols) {
            alert("You won!");
            this.freezeBoard();
        }
    }

    // To handle game over
    freezeBoard() {
        this.isFrozen = true;
        console.log(`Game Over! Total swaps: ${this.swapCount}`);
    }

    // Undo function
    undo() {
        if (this.isFrozen) {
            return;
        }
        if (this.history.length > 0) {
            // Restore the previous board state from history
            const previousState = this.history.pop();
            if (previousState) {
                this.board.syllables = previousState;
                this.swapCount--;  // Decrement the swap count
                if (this.swapCount > 0) {
                    this.updateScore();  // Recalculate the score
                }
                else {
                    this.score = 0;
                }
            }
        }
    }
}
