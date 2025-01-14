// input.js
var currentMaterialIndex = 0
function coordinate(event) {
    const rect = canvas.getBoundingClientRect();  // Get the canvas position
    mousePosX = event.clientX - rect.left;  // Adjust for the canvas's left position
    mousePosY = event.clientY - rect.top;   // Adjust for the canvas's top position
}
// Function to handle mouse events
function handleMouseEvents(e) {
    if (e.type === 'mousedown') {
        isMouseDown = true;
        lastMousePos = { x: Math.floor(e.offsetX / cellSize), y: Math.floor(e.offsetY / cellSize) };
    } else if (e.type === 'mousemove' && isMouseDown) {
        const x = Math.floor(e.offsetX / cellSize);
        const y = Math.floor(e.offsetY / cellSize);

        drawBrushOfMaterial(x, y);
        lastMousePos = { x, y };
    } else if (e.type === 'mouseup') {
        isMouseDown = false;
        lastMousePos = null;
    } else if (e.type === 'wheel') {
        if (e.deltaY < 0) {
            brushSize = Math.min(brushSize + 1, 10);  // Increase brush size (max 10)
        } else {
            brushSize = Math.max(brushSize - 1, 1);  // Decrease brush size (min 1)
        }
    }
}

// Function to handle keyboard events for material selection
function handleArrowKeySelection(event) {
    if (event.key === 'ArrowRight') {
        // Move to the next material
        currentMaterialIndex = (currentMaterialIndex + 1) % materials.length;
    } else if (event.key === 'ArrowLeft') {
        // Move to the previous material
        currentMaterialIndex = (currentMaterialIndex - 1 + materials.length) % materials.length;
    }

    // Update the current material
    currentMaterial = materials[currentMaterialIndex];
    updateIndicator(); // Update the material indicator
}

document.addEventListener("DOMContentLoaded", ()=>{
    // Listen for mouse and keyboard events
    canvas.addEventListener('mousedown', handleMouseEvents);
    canvas.addEventListener('mousemove', handleMouseEvents);
    canvas.addEventListener('mouseup', handleMouseEvents);
    canvas.addEventListener('wheel', handleMouseEvents);
    document.addEventListener('keydown', handleArrowKeySelection);

    // Prevent right-click menu from appearing
    canvas.addEventListener('contextmenu', event => event.preventDefault());
});