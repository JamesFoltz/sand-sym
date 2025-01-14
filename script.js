const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');

// Define the grid dimensions
const cols = 200;
const rows = 200;
const cellSize = 5;
canvas.width = cols * cellSize;
canvas.height = rows * cellSize;
let mousePosX, mousePosY = 0;
var materials = [new Sand(), new Water(), new Stone(), new Air()]

// Initialize the grid with Air (empty cells)
let grid = Array.from({ length: rows }, () => Array(cols).fill(new Air()));

// Track the last mouse position and brush state
let lastMousePos = null;
let isMouseDown = false;
let currentMaterial = new Sand(); // Default to Sand
let brushSize = 1; // Default brush size

// Function to draw the grid
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (!(grid[y][x] instanceof Air)) {
                ctx.fillStyle = grid[y][x].color;
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    }
    // Align the brush box to the mouse position
    const brushX = Math.floor(mousePosX / cellSize) * cellSize;
    const brushY = Math.floor(mousePosY / cellSize) * cellSize;

    // Draw the brush box (centered on mouse position)
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)'; // Semi-transparent red
    ctx.lineWidth = 2;
    ctx.strokeRect(brushX - (brushSize - 1) * cellSize / 2,
        brushY - (brushSize - 1) * cellSize / 2,
        brushSize * cellSize,
        brushSize * cellSize);
}

// Function to update the simulation
function update() {
    if (lastMousePos) {
        drawBrushOfMaterial(lastMousePos.x, lastMousePos.y);
    }
    for (let y = rows - 1; y >= 0; y--) {
        for (let x = 0; x < cols; x++) {
            const current = grid[y][x];
            if (current) {
                current.move(grid, x, y);
            }
        }
    }
    drawGrid();
}

// Start the simulation loop
function animate() {
    update();
    requestAnimationFrame(animate);
}

animate();
