/**
 * 
 * Poly Play Game Web Component
 * 
 * Based on the original Poly Play arcade game from East Germany, called "Wasserrohrbruch" (Water Pipe Leak).
 * Water drops fall from the top of the screen, and the player controls a character at the bottom to catch them.
 * the drops one or two drops at a time.
 */
class PolyPlayGame extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    --canvas-bg: inherit;
                    --text-color: #00ff00;
                    --ball-color: #00ff00;
                    display: block;
                    text-align: center;
                    margin: 1rem 0;
                }

                :root {
                --text-color: #00ff00;
                }

                canvas {
                    width: 100%;
                    height: 60vh;
                }
            </style>
            <canvas id="polyPlayCanvas"></canvas>
        `;

        this.initGame();
    }

    initGame() {
        const canvas = this.shadowRoot.getElementById('polyPlayCanvas');
        const ctx = canvas.getContext('2d');

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        //ctx.scale(scale, scale);

        // Game variables
        this.width = canvas.width;
        this.height = canvas.height;
        this.drops = [];
        this.paddleWidth = parseInt(Math.max(10, this.width / 20));
        this.playerX = 42;
        this.score = 0;

        console.log(this.paddleWidth);

        // Event listeners
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.playerX = Math.max(0, this.playerX - 5);
            } else if (e.key === 'ArrowRight') {
                this.playerX = Math.min(this.width - 4, this.playerX + 5);
            }
        });

        this.update();
        
    }

    update() {
        // Game update logic
        this.spawnDrop();
        this.moveDrops();
        this.checkCollisions();
        this.draw();

        requestAnimationFrame(() => this.update());
    }

    spawnDrop() {
        if (Math.random() < 0.03) {
            this.drops.push({ x: Math.floor(Math.random() * 80), y: 0 });
        }
    }

    moveDrops() {
        //slow down the drops
        if (!this.dropMoveCounter) this.dropMoveCounter = 0;
        this.dropMoveCounter++;
        if (this.dropMoveCounter % 2 !== 0) return;
        this.drops.forEach(drop => drop.y += 1);
        this.drops = this.drops.filter(drop => drop.y < 48);
    }

    checkCollisions() {

        //remove the drops by collision with player
        this.drops = this.drops.filter(drop => {
            if (drop.y >= 46 && drop.x >= this.playerX && drop.x <= this.playerX + 4) {
                this.score += 1;
                return false;
            }
            return true;
        });
    }

    draw() {
        const ctx = this.shadowRoot.getElementById('polyPlayCanvas').getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.fillStyle = 'blue';
        this.drops.forEach(drop => {
            ctx.fillRect(drop.x, drop.y, 2, 4);
        });

        ctx.fillStyle = 'black';
        ctx.fillStyle = 'var(--text-color)';
        ctx.fillRect(this.playerX, this.height - 4, this.paddleWidth, 4);

        ctx.font = '4px monospace';
        ctx.fillText(`Score: ${this.score}`, 2, 6);
    }
}

customElements.define('poly-play-game', PolyPlayGame);