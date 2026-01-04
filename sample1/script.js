// Game Constants
const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 480;
const GRAVITY = 0.25;
const JUMP_STRENGTH = 4.6;
const PIPE_SPEED = 2;
const PIPE_SPAWN_RATE = 100; // Frames
const PIPE_GAP = 100;

// Game State
let canvas, ctx;
let frames = 0;
let score = 0;
let gameState = 'START'; // START, PLAYING, GAMEOVER
let highScore = localStorage.getItem('flappyHighScore') || 0;

// Game Objects
const bird = {
    x: 50,
    y: 150,
    w: 34,
    h: 24,
    radius: 12,
    velocity: 0,
    rotation: 0,
    
    draw: function() {
        ctx.save();
        ctx.translate(this.x, this.y);
        // Rotation based on velocity
        this.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (this.velocity * 0.1)));
        ctx.rotate(this.rotation);
        
        ctx.fillStyle = "#FFD700";
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Eye
        ctx.fillStyle = "#FFF";
        ctx.beginPath();
        ctx.arc(6, -6, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(8, -6, 1, 0, Math.PI * 2);
        ctx.fill();
        
        // Wing
        ctx.fillStyle = "#FFF";
        ctx.beginPath();
        ctx.ellipse(-6, 2, 8, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();
    },
    
    update: function() {
        // Gravity
        this.velocity += GRAVITY;
        this.y += this.velocity;
        
        // Floor Collision
        if (this.y + this.radius >= CANVAS_HEIGHT - 20) { // -20 for ground
            this.y = CANVAS_HEIGHT - 20 - this.radius;
            gameOver();
        }
        
        // Ceiling Collision (optional, usually ignored or limited)
        if (this.y - this.radius <= 0) {
            this.y = this.radius;
            this.velocity = 0;
        }
    },
    
    jump: function() {
        this.velocity = -JUMP_STRENGTH;
    },
    
    reset: function() {
        this.y = 150;
        this.velocity = 0;
        this.rotation = 0;
    }
};

const pipes = {
    items: [],
    
    draw: function() {
        for (let i = 0; i < this.items.length; i++) {
            let p = this.items[i];
            
            ctx.fillStyle = "#73BF2E";
            ctx.strokeStyle = "#558C22";
            ctx.lineWidth = 2;
            
            // Top Pipe
            ctx.fillRect(p.x, 0, p.w, p.top);
            ctx.strokeRect(p.x, 0, p.w, p.top);
            
            // Bottom Pipe
            ctx.fillRect(p.x, CANVAS_HEIGHT - p.bottom, p.w, p.bottom);
            ctx.strokeRect(p.x, CANVAS_HEIGHT - p.bottom, p.w, p.bottom);
        }
    },
    
    update: function() {
        // Add new pipe
        if (frames % PIPE_SPAWN_RATE === 0) {
            this.items.push({
                x: CANVAS_WIDTH,
                w: 52,
                top: Math.random() * (CANVAS_HEIGHT - PIPE_GAP - 100) + 50, // Min height 50
                get bottom() { return CANVAS_HEIGHT - this.top - PIPE_GAP; },
                passed: false
            });
        }
        
        for (let i = 0; i < this.items.length; i++) {
            let p = this.items[i];
            p.x -= PIPE_SPEED;
            
            // Collision Detection
            // Horizontal check
            if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + p.w) {
                // Vertical check (hit top or bottom pipe)
                if (bird.y - bird.radius < p.top || bird.y + bird.radius > CANVAS_HEIGHT - p.bottom) {
                    gameOver();
                }
            }
            
            // Score update
            if (p.x + p.w < bird.x && !p.passed) {
                score++;
                p.passed = true;
                updateScore();
            }
            
            // Remove off-screen pipes
            if (p.x + p.w < 0) {
                this.items.shift();
                i--;
            }
        }
    },
    
    reset: function() {
        this.items = [];
    }
};

const foreground = {
    x: 0,
    h: 20,
    draw: function() {
        ctx.fillStyle = "#ded895";
        ctx.fillRect(0, CANVAS_HEIGHT - this.h, CANVAS_WIDTH, this.h);
        
        ctx.beginPath();
        ctx.moveTo(0, CANVAS_HEIGHT - this.h);
        ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT - this.h);
        ctx.strokeStyle = "#cbb968";
        ctx.stroke();
    },
    update: function() {
        // Animation effect (optional)
    }
}

// Game Control Functions
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Event Listeners
    window.addEventListener('keydown', function(e) {
        if (e.code === 'Space') {
            action();
        }
    });
    canvas.addEventListener('mousedown', action);
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        action();
    });
    
    loop();
}

function action() {
    switch (gameState) {
        case 'START':
            gameState = 'PLAYING';
            document.getElementById('start-screen').classList.add('hidden');
            document.getElementById('score-display').classList.remove('hidden');
            bird.jump();
            break;
            
        case 'PLAYING':
            bird.jump();
            break;
            
        case 'GAMEOVER':
            resetGame();
            break;
    }
}

function resetGame() {
    bird.reset();
    pipes.reset();
    score = 0;
    frames = 0;
    updateScore();
    gameState = 'START';
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
}

function gameOver() {
    gameState = 'GAMEOVER';
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('flappyHighScore', highScore);
    }
    document.getElementById('final-score').innerText = `Score: ${score}`;
    document.getElementById('game-over-screen').classList.remove('hidden');
    document.getElementById('score-display').classList.add('hidden');
}

function updateScore() {
    document.getElementById('score-display').innerText = score;
}

function loop() {
    // Update
    if (gameState === 'PLAYING') {
        bird.update();
        pipes.update();
        foreground.update();
        frames++;
    } else if (gameState === 'START') {
        // Bobbing animation
        bird.y = 150 + Math.sin(Date.now() / 300) * 5;
    }
    
    // Draw
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Background (Sky is css)
    
    pipes.draw();
    foreground.draw();
    bird.draw();
    
    requestAnimationFrame(loop);
}

// Start Game
window.onload = init;
