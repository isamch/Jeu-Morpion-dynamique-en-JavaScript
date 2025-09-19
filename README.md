
### Global Variables
```javascript
let currentPlayer = ''X'';        // Who''s turn it is
let board = [];                 // 2D array for the game board
let isGameOver = false;         // Is the game finished?
let moveCount = 0;              // How many moves made
let boardSize = 3;              // Size of the board (3x3, 4x4, etc.)
let scores = { X: 0, O: 0, D: 0 }; // Player scores
let historyItems = [];          // List of game events
```

### Storage Helper Functions

#### `saveSize(value)`
**Purpose**: Saves the board size to browser localStorage  
**Parameters**: `value` (number) - The board size to save  
**Returns**: Nothing  
**How it works**: Uses try-catch to safely store the size value in localStorage with the key ''ttt_size_v1''

#### `loadSize()`
**Purpose**: Loads the board size from browser localStorage  
**Parameters**: None  
**Returns**: Nothing (updates global `boardSize` variable)  
**How it works**: 
1. Retrieves stored size from localStorage
2. Validates it''s a number between 3 and 10
3. Updates `boardSize` if valid, otherwise keeps default (3)

#### `saveScores()`
**Purpose**: Saves current game scores to localStorage  
**Parameters**: None  
**Returns**: Nothing  
**How it works**: Converts the `scores` object to JSON and stores it with key ''ttt_scores_v1''

#### `loadScores()`
**Purpose**: Loads saved scores from localStorage  
**Parameters**: None  
**Returns**: Nothing (updates global `scores` object)  
**How it works**: 
1. Retrieves JSON data from localStorage
2. Parses it back to an object
3. Updates each score (X, O, D) with fallback to 0 if invalid

#### `saveHistory()` / `loadHistory()`
**Purpose**: Save/load game history to/from localStorage  
**Parameters**: None  
**Returns**: Nothing  
**How it works**: Similar to scores - converts `historyItems` array to/from JSON with key ''ttt_history_v1''

### UI Helper Functions

#### `updateStatus(text)`
**Purpose**: Updates the status message displayed to players  
**Parameters**: `text` (string, optional) - Custom message, or uses default turn message  
**Returns**: Nothing  
**How it works**: 
- If text provided: shows that message
- If no text: shows "Player X''s turn" or "Player O''s turn"

#### `updateScoresUI()`
**Purpose**: Updates the score display on screen  
**Parameters**: None  
**Returns**: Nothing  
**How it works**: Updates the text content of score elements (X, O, Draw) with current values

#### `addHistory(text)`
**Purpose**: Adds a new entry to the game history  
**Parameters**: `text` (string) - The message to add  
**Returns**: Nothing  
**How it works**: 
1. Creates timestamped entry: "HH:MM:SS - [text]"
2. Adds to `historyItems` array
3. Saves to localStorage
4. Creates new `<li>` element and adds to history list (newest first)

#### `renderHistory()`
**Purpose**: Displays all history entries on screen  
**Parameters**: None  
**Returns**: Nothing  
**How it works**: 
1. Clears existing history display
2. Loops through `historyItems` in reverse order (newest first)
3. Creates `<li>` elements for each entry

### Game Setup & Rendering Functions

#### `makeEmptyBoard(size)`
**Purpose**: Creates a new empty game board  
**Parameters**: `size` (number) - The dimensions of the board (e.g., 3 for 3x3)  
**Returns**: Nothing (updates global `board` variable)  
**How it works**: 
1. Resets the `board` array to empty
2. Creates nested loops for rows and columns
3. Fills each cell with ''-'' (empty marker)
4. For 3x3: `[[''-'', ''-'', ''-''], [''-'', ''-'', ''-''], [''-'', ''-'', ''-'']]`

#### `renderBoard(size)`
**Purpose**: Draws the game board on screen with clickable cells  
**Parameters**: `size` (number) - The dimensions of the board  
**Returns**: Nothing  
**How it works**: 
1. Clears existing board HTML
2. Sets CSS grid layout: `repeat(size, minmax(36px, 1fr))`
3. Creates buttons for each cell with:
   - CSS class ''cell''
   - ARIA labels for accessibility
   - Data attributes for row/column position
   - Click event listeners
   - Current cell content (X, O, or empty)

#### `startNewGame(size)`
**Purpose**: Resets everything and starts a fresh game  
**Parameters**: `size` (number) - The board size for the new game  
**Returns**: Nothing  
**How it works**: 
1. Updates `boardSize` and saves it
2. Resets game state: `currentPlayer = ''X''`, `isGameOver = false`, `moveCount = 0`
3. Creates empty board and renders it
4. Updates status display

### Game Logic Functions

#### `onCellClick(e)`
**Purpose**: Handles when a player clicks a game cell  
**Parameters**: `e` (Event) - The click event from the cell button  
**Returns**: Nothing  
**How it works**: 
1. **Validation**: Checks if game is over or cell already taken
2. **Move execution**: Places player''s symbol in the cell and updates display
3. **Win check**: Calls `checkWin()` to see if current player won
4. **Win handling**: If won, updates scores, saves data, adds history, shows winner
5. **Draw check**: If board is full, declares draw and updates scores
6. **Turn switch**: Changes to other player and updates status

#### `checkWin(row, col)`
**Purpose**: Determines if the current player has won the game  
**Parameters**: 
- `row` (number) - The row of the last move
- `col` (number) - The column of the last move  
**Returns**: `true` if current player won, `false` otherwise  
**How it works**: Checks four possible winning conditions:
1. **Row check**: All cells in the same row as the move
2. **Column check**: All cells in the same column as the move  
3. **Main diagonal**: If move is on diagonal (row === col), check all diagonal cells
4. **Anti-diagonal**: If move is on anti-diagonal (row + col === size-1), check all anti-diagonal cells

### Control Functions

#### `onApplySize()`
**Purpose**: Changes board size and starts new game  
**Parameters**: None (reads from size input element)  
**Returns**: Nothing  
**How it works**: 
1. Gets value from size input, validates it (3-10 range)
2. Updates input field with validated value
3. Adds history entry about size change
4. Starts new game with new size

#### `onNewGame()`
**Purpose**: Restarts game with same board size  
**Parameters**: None  
**Returns**: Nothing  
**How it works**: 
1. Adds "New game started" to history
2. Calls `startNewGame()` with current `boardSize`

#### `onReset()`
**Purpose**: Clears all scores and history  
**Parameters**: None  
**Returns**: Nothing  
**How it works**: 
1. Resets `scores` object to all zeros
2. Saves empty scores to localStorage
3. Updates score display
4. Clears `historyItems` array
5. Saves empty history to localStorage
6. Re-renders empty history list

#### `init()`
**Purpose**: Initializes the entire game when page loads  
**Parameters**: None  
**Returns**: Nothing  
**How it works**: 
1. Loads saved data (size, scores, history)
2. Sets up UI elements with loaded values
3. Starts first game
4. Attaches event listeners to all buttons

---' | Set-Content 'README.md'"