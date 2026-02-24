const chaoszoneArray = [
  // Zeile 1: " ######  ##     ##    ###     #######   ######  ########  #######  ##    ## ######## "
  [0,1,1,1,1,1,1,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,0,1,1,0,0,0,0,1,1,0,1,1,1,1,1,1,1,1],
  
  // Zeile 2: "##    ## ##     ##   ## ##   ##     ## ##    ##      ##  ##     ## ###   ## ##       "
  [1,1,0,0,0,0,1,1,0,1,1,0,0,0,0,0,1,1,0,0,0,1,1,0,1,1,0,0,0,1,1,0,0,0,0,0,1,1,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0,1,1,0,1,1,1,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0],
  
  // Zeile 3: "##       ##     ##  ##   ##  ##     ## ##           ##   ##     ## ####  ## ##       "
  [1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,1,1,0,0,0,1,1,0,0,1,1,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,1,1,0,1,1,1,1,0,0,1,1,0,1,1,0,0,0,0,0,0,0],
  
  // Zeile 4: "##       ######### ##     ## ##     ##  ######     ##    ##     ## ## ## ## ######   "
  [1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,1,1,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,1,1,0,0,1,1,1,1,1,1,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,0,0,0],
  
  // Zeile 5: "##       ##     ## ######### ##     ##       ##   ##     ##     ## ##  #### ##       "
  [1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,1,1,0,0,1,1,1,1,0,1,1,0,0,0,0,0,0,0],
  
  // Zeile 6: "##    ## ##     ## ##     ## ##     ## ##    ##  ##      ##     ## ##   ### ##       "
  [1,1,0,0,0,0,1,1,0,1,1,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,1,1,0,1,1,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,1,1,0,0,0,1,1,1,0,1,1,0,0,0,0,0,0,0],
  
  // Zeile 7: " ######  ##     ## ##     ##  #######   ######  ########  #######  ##    ## ######## "
  [0,1,1,1,1,1,1,0,0,1,1,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,1,1,0,0,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,0,1,1,0,0,0,0,1,1,0,1,1,1,1,1,1,1,1]
];

//register custom element
class PongGame extends HTMLElement {
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
                    --ball-color: #ece2d5;
                    display: block;
                    text-align: center;
                    margin: 1rem 0;
                }

                :root {
                --text-color: #ece2d5;
                }

                canvas {
                    width: 100%;
                    height: auto;
                }
            </style>
            <canvas id="pongCanvas"></canvas>
        `;

        this.initGame();
    }

    initGame() {
        const canvas = this.shadowRoot.getElementById('pongCanvas');
        const ctx = canvas.getContext('2d');

        console.log('Initializing Pong Game');

        // set cancan inner dimanesion
        canvas.width = 520;
        canvas.height = 100;

        // Game variables
        let ballRadius = 2;
        let x = canvas.width / 2;
        let y = canvas.height - 30;
        let dx = 2;
        let dy = -2;

        // Draw the ball
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
            ctx.fillStyle = 'var(--ball-color)';
            ctx.fill();
            ctx.closePath();

            // Draw the ASCII art
            ctx.font = '10px monospace';
            ctx.fillStyle = '#ece2d5';
            //set text color
            for (let row = 0; row < chaoszoneArray.length; row++) {
                for (let col = 0; col < chaoszoneArray[row].length; col++) {
                    if (chaoszoneArray[row][col] === 1) {
                        ctx.fillText('#', col * 6 + 10, row * 12 + 20);
                    }
                }
            }
        }

        // Update the game state
        function update() {
            draw();

            // Move the ball
            x += dx;
            y += dy;

            // Bounce off walls
            if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
                dx = -dx;
            }
            if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
                dy = -dy;
            }

            //detect collision with ASCII art and remove part of it
            let col = Math.floor((x - 10) / 6);
            let row = Math.floor((y - 20) / 12);
            if (row >= 0 && row < chaoszoneArray.length && col >= 0 && col < chaoszoneArray[row].length) {
                if (chaoszoneArray[row][col] === 1) {
                    chaoszoneArray[row][col] = 0;
                    dy = -dy; //bounce the ball
                }
            }

            requestAnimationFrame(update);
        }

        update();
    }
}

customElements.define('pong-game', PongGame);