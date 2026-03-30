# Block Blast Remake
A web based block puzzle game built with entirely with HTML5 Canvas. Its almost just like the popular block blast game. Drag shapes, clear lines, and try to get the highest scores.

## How to Play
Keep the board from filling up while clearing as many lines as possible. Its up to you to strategically place the shapes.
#### Drag and Drop: 
- You are provided with 3 random shapes in your "hand" at the bottom of the screen. Drag them onto the grid.

#### Clear Lines: 
- Complete a full vertical or horizontal line to clear it from the board.

#### Combo System: 
- Clearing multiple lines at once or clearing lines in consecutive moves triggers score multipliers.

#### Game Over: 
- The game ends when you have a shape in your hand that cannot fit anywhere on the remaining grid.

## Scoring System
The game rewards strategic placement and multi line clears.

#### Base Points Placement: 
- Each block placed on the grid earns 1 point.

#### Line Clear: 
- Each line cleared starts with a base of 10 points.

#### Multi-Line Bonuses
- Clearing more than one line in a single move grants a bonus

| Lines Cleared | Bonus Points |
| :--- | :--- |
| 2 Lines | +10 |
| 3 Lines | +30 |
| 4 Lines | +60 |
| 5 Lines | +100 |
| 6+ Lines | +150 |

## Streaks and Combos
The game tracks your streak clearing lines in back to back moves.

#### Multiplier: 
- Your score for a move is multiplied based on your current streak.

#### Streak reset:
- Failing to clear a line for 3 consecutive moves will reset your combo multiplier.

## Options
Press the red button on the top right corner beside the scores to show the options dialog.

#### Sound Toggle: 
- Quickly turn game audio on or off.

#### Replay: 
- Restart your game.

#### Reset Best Score: 
- Wipes your best score from local storage.

## Assets
#### Visuals: 
- Sprite assets, including UI elements and blocks, were sourced from freegameassets.net.

#### Typography: 
- Uses Fredoka on the options dialog.

## Technical Details
#### Engine: 
- Pure JavaScript / HTML5 Canvas API.

#### Layout: 
- Responsive grid that scales based on device screen size.

#### State Management: 
- Game states (Menu, Playing, Options, GameOver).