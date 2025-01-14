// Function to draw a brush of material in a square
function drawBrushOfMaterial(x, y) {
    const halfBrushSize = Math.floor(brushSize / 2);

    for (let i = -halfBrushSize; i <= halfBrushSize; i++) {
        for (let j = -halfBrushSize; j <= halfBrushSize; j++) {
            const newX = x + i;
            const newY = y + j;

            if (newX >= 0 && newX < cols && newY >= 0 && newY < rows) {
                grid[newY][newX] = currentMaterial;
            }
        }
    }

    drawGrid();
}

// Function to update the material indicator on screen
function updateIndicator() {
    const indicatorElement = document.getElementById('material-indicator');
    indicatorElement.textContent = `Current Material: ${currentMaterial.constructor.name}`;
}

function swapCells(cellAX,cellAY,cellBX,cellBY,) {
    let cellA = grid[cellAY][cellAX];
    let cellB = grid[cellBY][cellBX];
    grid[cellAY][cellAX] = cellB;
    grid[cellBY][cellBX] = cellB;
}