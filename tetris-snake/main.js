import { TetrisGame } from './tetris.js';
import { SnakeGame } from './snake.js';

class GameManager {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.overlay = document.getElementById('ui-overlay');
        this.overlayTitle = document.getElementById('overlay-title');
        this.overlayMessage = document.getElementById('overlay-message');
        this.startBtn = document.getElementById('start-btn');
        
        this.state = 'MENU'; // MENU, TETRIS, TRANSITION, SNAKE, GAMEOVER
        this.score = 0;
        this.activeGame = null;
        
        this.initListeners();
    }

    initListeners() {
        this.startBtn.addEventListener('click', () => {
            if (this.state === 'MENU' || this.state === 'GAMEOVER') {
                this.startGame();
            } else if (this.state === 'PAUSED') {
                this.resumeGame();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (this.state === 'TETRIS' || this.state === 'SNAKE') {
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                    e.preventDefault(); // Prevent scrolling
                    this.activeGame.handleInput(e.key);
                }
            }
        });
    }

    startGame() {
        this.score = 0;
        this.updateUI();
        this.overlay.classList.add('hidden');
        this.startTetris();
    }

    startTetris() {
        this.state = 'TETRIS';
        this.activeGame = new TetrisGame(
            this.ctx, 
            () => this.onTetrisGameOver(),
            (points) => this.addScore(points)
        );
        this.activeGame.start();
    }

    onTetrisGameOver() {
        this.activeGame.stop();
        this.state = 'TRANSITION';
        
        // Show Transition Overlay
        this.overlayTitle.innerText = "Tetris Completed!";
        this.overlayMessage.innerText = "Prepare for Snake...";
        this.startBtn.classList.add('hidden');
        this.overlay.classList.remove('hidden');

        setTimeout(() => {
            this.overlay.classList.add('hidden');
            this.startBtn.classList.remove('hidden'); // Reset for later
            this.startSnake();
        }, 2000);
    }

    startSnake() {
        this.state = 'SNAKE';
        this.activeGame = new SnakeGame(
            this.ctx,
            () => this.onSnakeGameOver(),
            (points) => this.addScore(points)
        );
        this.activeGame.start();
    }

    onSnakeGameOver() {
        this.activeGame.stop();
        this.state = 'GAMEOVER';
        
        this.overlayTitle.innerText = "Game Over";
        this.overlayMessage.innerText = `Final Score: ${this.score}`;
        this.startBtn.innerText = "Play Again";
        this.overlay.classList.remove('hidden');
    }

    addScore(points) {
        this.score += points;
        this.updateUI();
    }

    updateUI() {
        this.scoreElement.innerText = this.score;
    }
}

// Start app
window.game = new GameManager();
