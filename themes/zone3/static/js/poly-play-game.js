/**
 * 
 * Poly Play Game Web Component
 * 
 * Based on the original Poly Play arcade game from East Germany, called "Wasserrohrbruch" (Water Pipe Leak).
 * Water drops fall from the top of the screen, and the player controls a character at the bottom to catch them.
 * the drops one or two drops at a time.
 * Use Ascii art to update a pre element, no canvas
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
                    --text-color: #ece2d5;
                    display: block;
                    text-align: center;
                    margin: 1rem 0;
                }

                pre {
                    font-family: 'Courier New', Courier, monospace;
                    font-size: 1rem;
                    line-height: 6px;
                    color: var(--text-color);
                    background-color: var(--canvas-bg);
                    height: auto;
                    user-select: none;
                    display: inline;
                }
            </style>
            <pre id="polyPlayTextElement"></pre>
        `;

        this.initGame();
    }

    initGame() {
        //use no canvas
        this.textElement = this.shadowRoot.getElementById('polyPlayTextElement');

        //detect parent eelement width to scale the game
        const parentWidth = this.parentElement.clientWidth;
        this.textElement.textContent = '...';
        const characterWidth = this.textElement.getBoundingClientRect().width / 3;
        const witdh = Math.floor(parentWidth / characterWidth);

        this.width = witdh;
        this.height = 20;
        this.drops = [];
        this.playerX = Math.floor(this.width / 2);
        this.score = 0;
        this.game = 1;
        this.rest = 50;

        this.update();

        // Event listeners
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.playerX = Math.max(0, this.playerX - 2);
            } else if (e.key === 'ArrowRight') {
                this.playerX = Math.min(this.width - 4, this.playerX + 2);
            }
        });
    }

    update() {
        // Game update logic
        this.spawnDrop();
        this.moveDrops();
        this.checkCollisions();
        this.draw();

        setTimeout(() => {
            this.update()
        }, 1000/15);
        //requestAnimationFrame(() => this.update());
    }

    spawnDrop() {
        //spawn a new drop at random x position
        if (Math.random() < 0.03) {
            const dropX = Math.floor(Math.random() * this.width);
            this.drops.push({ x: dropX, y: 0 });
            this.rest--;
        }

        if (this.rest <= 0) {
            this.game++;
            this.rest = 50 + ((this.game - 1) * 10);
        }
    }

    moveDrops() {
        //slow down the drops
        if (!this.dropMoveCounter) this.dropMoveCounter = 0;
        this.dropMoveCounter++;
        if (this.dropMoveCounter % 4 !== 0) return;
        this.drops.forEach(drop => drop.y += 1);
        this.drops = this.drops.filter(drop => drop.y < this.height);
    }

    checkCollisions() {
        this.drops = this.drops.filter(drop => {
            if (drop.y === this.height - 1 && Math.abs(drop.x - this.playerX) <= 1) {
                this.score += 1;
                return false;
            }
            return true;
        });
    }

    draw() {
        let output = '';
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let isDrop = this.drops.some(drop => drop.x === x && drop.y === y);
                if (isDrop) {
                    output += 'o';
                } else if (y === this.height - 1 && Math.abs(x - this.playerX) <= 1) {
                    output += '▄'; // player character
                } else {
                    output += ' ';
                }
            }
            output += '\n';
        }

        //add score in first line
        output = `Poly Game == Score: ${this.score || 0} == Game: ${this.game} == Drops: ${this.rest}\n` + output;

        this.textElement.textContent = output;
    }
}

customElements.define('poly-play-game', PolyPlayGame);