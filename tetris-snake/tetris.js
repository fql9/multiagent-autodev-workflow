export class TetrisGame {
    constructor(ctx, onGameOver, onScore) {
        this.ctx = ctx;
        this.onGameOver = onGameOver;
        this.onScore = onScore;
        
        this.cols = 10;
        this.rows = 20;
        this.blockSize = 30; // Matches canvas width 300 / 10
        
        this.grid = this.createGrid();
        this.piece = null;
        this.dropCounter = 0;
        this.dropInterval = 1000;
        this.lastTime = 0;
        this.isRunning = false;

        this.colors = [
            null,
            '#FF0D72', '#0DC2FF', '#0DFF72', '#F538FF', '#FF8E0D', '#FFE138', '#3877FF'
        ];

        this.pieces = 'ILJOTSZ';
    }

    start() {
        this.grid = this.createGrid();
        this.resetPiece();
        this.score = 0;
        this.isRunning = true;
        this.lastTime = 0;
        this.dropCounter = 0;
        this.requestLoop();
    }

    stop() {
        this.isRunning = false;
    }

    createGrid() {
        return Array(this.rows).fill().map(() => Array(this.cols).fill(0));
    }

    createPiece(type) {
        if (type === 'I') {
            return [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
            ];
        } else if (type === 'L') {
            return [
                [0, 2, 0],
                [0, 2, 0],
                [0, 2, 2],
            ];
        } else if (type === 'J') {
            return [
                [0, 3, 0],
                [0, 3, 0],
                [3, 3, 0],
            ];
        } else if (type === 'O') {
            return [
                [4, 4],
                [4, 4],
            ];
        } else if (type === 'Z') {
            return [
                [5, 5, 0],
                [0, 5, 5],
                [0, 0, 0],
            ];
        } else if (type === 'S') {
            return [
                [0, 6, 6],
                [6, 6, 0],
                [0, 0, 0],
            ];
        } else if (type === 'T') {
            return [
                [0, 7, 0],
                [7, 7, 7],
                [0, 0, 0],
            ];
        }
    }

    resetPiece() {
        const type = this.pieces[this.pieces.length * Math.random() | 0];
        this.piece = {
            matrix: this.createPiece(type),
            pos: {x: (this.cols / 2 | 0) - 1, y: 0},
        };
        if (this.collide(this.grid, this.piece)) {
            this.isRunning = false;
            this.onGameOver();
        }
    }

    collide(arena, player) {
        const [m, o] = [player.matrix, player.pos];
        for (let y = 0; y < m.length; ++y) {
            for (let x = 0; x < m[y].length; ++x) {
                if (m[y][x] !== 0 &&
                   (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                    return true;
                }
            }
        }
        return false;
    }

    drawMatrix(matrix, offset) {
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    this.ctx.fillStyle = this.colors[value];
                    this.ctx.fillRect((x + offset.x) * this.blockSize,
                                      (y + offset.y) * this.blockSize,
                                      this.blockSize, this.blockSize);
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeStyle = '#2c3e50';
                    this.ctx.strokeRect((x + offset.x) * this.blockSize,
                                      (y + offset.y) * this.blockSize,
                                      this.blockSize, this.blockSize);
                }
            });
        });
    }

    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.drawMatrix(this.grid, {x: 0, y: 0});
        this.drawMatrix(this.piece.matrix, this.piece.pos);
    }

    merge(arena, player) {
        player.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    arena[y + player.pos.y][x + player.pos.x] = value;
                }
            });
        });
    }

    rotate(matrix, dir) {
        for (let y = 0; y < matrix.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
            }
        }
        if (dir > 0) {
            matrix.forEach(row => row.reverse());
        } else {
            matrix.reverse();
        }
    }

    playerDrop() {
        this.piece.pos.y++;
        if (this.collide(this.grid, this.piece)) {
            this.piece.pos.y--;
            this.merge(this.grid, this.piece);
            this.resetPiece();
            this.arenaSweep();
        }
        this.dropCounter = 0;
    }

    playerMove(dir) {
        this.piece.pos.x += dir;
        if (this.collide(this.grid, this.piece)) {
            this.piece.pos.x -= dir;
        }
    }

    playerRotate(dir) {
        const pos = this.piece.pos.x;
        let offset = 1;
        this.rotate(this.piece.matrix, dir);
        while (this.collide(this.grid, this.piece)) {
            this.piece.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > this.piece.matrix[0].length) {
                this.rotate(this.piece.matrix, -dir);
                this.piece.pos.x = pos;
                return;
            }
        }
    }

    arenaSweep() {
        let rowCount = 1;
        outer: for (let y = this.grid.length - 1; y > 0; --y) {
            for (let x = 0; x < this.grid[y].length; ++x) {
                if (this.grid[y][x] === 0) {
                    continue outer;
                }
            }
            const row = this.grid.splice(y, 1)[0].fill(0);
            this.grid.unshift(row);
            ++y;
            this.onScore(rowCount * 10);
            rowCount *= 2;
        }
    }

    update(time = 0) {
        if (!this.isRunning) return;
        const deltaTime = time - this.lastTime;
        this.lastTime = time;
        this.dropCounter += deltaTime;
        if (this.dropCounter > this.dropInterval) {
            this.playerDrop();
        }
        this.draw();
        this.requestLoop();
    }
    
    requestLoop() {
        if(this.isRunning) requestAnimationFrame((t) => this.update(t));
    }

    handleInput(key) {
        if (!this.isRunning) return;
        if (key === 'ArrowLeft') this.playerMove(-1);
        if (key === 'ArrowRight') this.playerMove(1);
        if (key === 'ArrowDown') this.playerDrop();
        if (key === 'ArrowUp') this.playerRotate(1);
        if (key === ' ') {
             // Hard drop could be implemented here
             while(!this.collide(this.grid, this.piece)) {
                 this.piece.pos.y++;
             }
             this.piece.pos.y--;
             this.merge(this.grid, this.piece);
             this.resetPiece();
             this.arenaSweep();
             this.dropCounter = 0;
        }
    }
}



