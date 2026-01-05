# Tetris & Snake Dual Game - Architecture Design

## 1. Overview
A dual-mode web game where the player starts with Tetris. Upon Game Over, the game automatically transitions to Snake. Both games share a common UI for score, controls, and settings.

## 2. Directory Structure
```
tetris-snake/
├── index.html          # Entry point, UI container
├── style.css           # Global styles & game specific themes
├── main.js             # Entry point, initializes GameManager
├── game-manager.js     # Manages Game State (Menu -> Tetris -> Snake -> GameOver)
├── tetris.js           # Tetris Game Logic & Rendering
├── snake.js            # Snake Game Logic & Rendering
└── utils.js            # Shared helpers (Canvas, Input, Storage)
```

## 3. Module Responsibilities

### 3.1 `GameManager` (Singleton)
- **State Machine**: `MENU` -> `TETRIS` -> `TRANSITION` -> `SNAKE` -> `SUMMARY`
- **Responsibilities**:
  - Listen for "GameOver" events from active game.
  - Switch active game instance.
  - Update global UI (Score, Level).
  - Handle global inputs (Pause, Mute).

### 3.2 `TetrisGame` (Class)
- **Inputs**: Canvas Context, InputManager.
- **Outputs**: `onScore(points)`, `onGameOver()`.
- **Core Loop**:
  - `update(dt)`: Gravity, collision detection.
  - `draw()`: Render grid and active piece.

### 3.3 `SnakeGame` (Class)
- **Inputs**: Canvas Context, InputManager.
- **Outputs**: `onScore(points)`, `onGameOver()`.
- **Core Loop**:
  - `update(dt)`: Move snake, check self/wall collision.
  - `draw()`: Render snake and food.

## 4. Transition Logic
1. `TetrisGame` triggers `onGameOver`.
2. `GameManager` catches event.
3. `GameManager` displays "Transitioning to Phase 2..." overlay (2s).
4. `GameManager` hides Tetris Canvas layer, shows Snake Canvas layer (or clears same canvas).
5. `GameManager` initializes `SnakeGame`.
6. `SnakeGame` starts.

## 5. UI / UX
- **Scoreboard**: Persistent top bar. Cumulative score? Or separate? -> *Decision: Cumulative for high score challenge.*
- **Controls**:
  - Arrows: Move
  - Up: Rotate (Tetris)
  - Space: Drop (Tetris) / Dash (Snake - optional)
  - Esc: Pause

## 6. Technical Stack
- Vanilla HTML5 Canvas + JS (ES6 Modules).
- No external dependencies.



