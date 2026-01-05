export class SnakeGame {
    constructor(ctx, onGameOver, onScore) {
        this.ctx = ctx;
        this.onGameOver = onGameOver;
        this.onScore = onScore;
        
        this.gridSize = 20; // Matches canvas width 300 / 15? No, let's use 20px blocks -> 15 cols
        this.tileCountX = 300 / this.gridSize; // 15
        this.tileCountY = 600 / this.gridSize; // 30
        
        this.snake = [];
        this.food = {};
        this.dx = 0;
        this.dy = 0;
        
        this.isRunning = false;
        this.speed = 7; // moves per second roughly?
        this.loopInterval = 1000 / this.speed;
        this.lastTime = 0;
    }

    start() {
        this.snake = [{x: 7, y: 15}, {x: 7, y: 16}, {x: 7, y: 17}];
        this.dx = 0;
        this.dy = -1; // Moving up initially
        this.spawnFood();
        this.isRunning = true;
        this.lastTime = 0;
        this.requestLoop();
    }

    stop() {
        this.isRunning = false;
    }

    spawnFood() {
        this.food = {
            x: Math.floor(Math.random() * this.tileCountX),
            y: Math.floor(Math.random() * this.tileCountY)
        };
        // Ensure food doesn't spawn on snake
        for(let part of this.snake) {
            if(part.x === this.food.x && part.y === this.food.y) {
                this.spawnFood();
                break;
            }
        }
    }

    update(time = 0) {
        if (!this.isRunning) return;
        
        if (time - this.lastTime < this.loopInterval) {
            this.requestLoop();
            return;
        }
        this.lastTime = time;

        const head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};

        // Wall Collision
        if (head.x < 0 || head.x >= this.tileCountX || head.y < 0 || head.y >= this.tileCountY) {
            this.isRunning = false;
            this.onGameOver();
            return;
        }

        // Self Collision
        for (let part of this.snake) {
            if (head.x === part.x && head.y === part.y) {
                this.isRunning = false;
                this.onGameOver();
                return;
            }
        }

        this.snake.unshift(head);

        // Eat Food
        if (head.x === this.food.x && head.y === this.food.y) {
            this.onScore(10);
            this.spawnFood();
            // speed up slightly?
        } else {
            this.snake.pop();
        }

        this.draw();
        this.requestLoop();
    }

    draw() {
        // Clear background
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // Draw Food
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fillRect(this.food.x * this.gridSize, this.food.y * this.gridSize, this.gridSize - 2, this.gridSize - 2);

        // Draw Snake
        this.ctx.fillStyle = '#2ecc71';
        this.snake.forEach(part => {
            this.ctx.fillRect(part.x * this.gridSize, part.y * this.gridSize, this.gridSize - 2, this.gridSize - 2);
        });
    }

    requestLoop() {
        if(this.isRunning) requestAnimationFrame((t) => this.update(t));
    }

    handleInput(key) {
        if (!this.isRunning) return;
        
        if (key === 'ArrowLeft' && this.dx === 0) { this.dx = -1; this.dy = 0; }
        if (key === 'ArrowRight' && this.dx === 0) { this.dx = 1; this.dy = 0; }
        if (key === 'ArrowUp' && this.dy === 0) { this.dx = 0; this.dy = -1; }
        if (key === 'ArrowDown' && this.dy === 0) { this.dx = 0; this.dy = 1; }
    }
}



