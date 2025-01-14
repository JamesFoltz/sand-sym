class Material {
    constructor(color) {
        this.color = color;
    }
}

class Sand extends Material {
    constructor() {
        super('rgb(194, 178, 128)');
        this.initialMoveChance = 0.3;  // Initial chance to move diagonally
    }

    // Method to move the sand
    move(grid, x, y) {
        if (y < rows - 1) {
            // Calculate the move chance at runtime (no decay, just random)
            let moveChance = Math.random() * this.initialMoveChance;  // Random moveChance for each move

            // Try to move down
            if (grid[y + 1][x] instanceof Air || grid[y + 1][x] instanceof Water) {
                // If the space below is either Air or Water, swap with water
                if (grid[y + 1][x] instanceof Water) {
                    // Swap sand with water
                    grid[y + 1][x] = this;
                    grid[y][x] = new Water();  // Replace the current sand with water
                } else {
                    // Otherwise, just move the sand down as usual
                    grid[y + 1][x] = this;
                    grid[y][x] = new Air();
                }
                return true;
            }

            // Check if there is sand above, increasing the chance based on the number of sand particles
            let sandAboveCount = 0;
            for (let i = y - 1; i >= 0; i--) {
                if (grid[i][x] instanceof Sand) {
                    sandAboveCount++;
                }
            }

            // Increase move chance multiplier based on the number of sand particles above
            moveChance *= (1 + sandAboveCount * 0.1);  // Increase by 10% for each sand particle above

            // Random chance for diagonal movement
            let randomChance = Math.random();  // Random chance between 0 and 1

            // Try to move down-left with the updated move chance
            if (x > 0 && (grid[y + 1][x - 1] instanceof Air || grid[y + 1][x - 1] instanceof Water)) {
                if (randomChance < moveChance) {  // Move diagonally based on chance
                    // If the space below-left is either Air or Water, swap with water
                    if (grid[y + 1][x - 1] instanceof Water) {
                        // Swap sand with water
                        grid[y + 1][x - 1] = this;
                        grid[y][x] = new Water();  // Replace the current sand with water
                    } else {
                        // Otherwise, just move the sand down-left as usual
                        grid[y + 1][x - 1] = this;
                        grid[y][x] = new Air();
                    }
                    return true;
                }
            }

            // Try to move down-right with the updated move chance
            if (x < cols - 1 && (grid[y + 1][x + 1] instanceof Air || grid[y + 1][x + 1] instanceof Water)) {
                if (randomChance < moveChance) {  // Move diagonally based on chance
                    // If the space below-right is either Air or Water, swap with water
                    if (grid[y + 1][x + 1] instanceof Water) {
                        // Swap sand with water
                        grid[y + 1][x + 1] = this;
                        grid[y][x] = new Water();  // Replace the current sand with water
                    } else {
                        // Otherwise, just move the sand down-right as usual
                        grid[y + 1][x + 1] = this;
                        grid[y][x] = new Air();
                    }
                    return true;
                }
            }
        }
        return false;
    }
}


class Water extends Material {
    constructor() {
        super('rgb(0, 0, 255)'); // Blue color for water
        this.dir = Math.random() < 0.5 ? 1 : -1; // Start by moving to the right (1 = right, -1 = left)
        this.searchDistance = 3; // Set the search distance (number of cells to look ahead)
    }

    tryMoveLeft(grid, x, y) {
        for (let i = 1; i < this.searchDistance; i++) {
            if (x > 0 && grid[y][x - i] instanceof Air) {
                grid[y][x - i] = this;  // Move water to the left
                grid[y][x] = new Air();  // Set current cell to air
                return true;
            }
        }
        this.dir = 1; // Change direction to right if left is blocked
        return false;
    }

    tryMoveRight(grid, x, y) {
        for (let i = 1; i < this.searchDistance; i++) {

            if (x < cols - 1 && grid[y][x + i] instanceof Air) {
                grid[y][x + i] = this;  // Move water to the right
                grid[y][x] = new Air();  // Set current cell to air
                return true;
            }
        }
        this.dir = -1; // Change direction to left if right is blocked
        return false;
    }

    // Method to move water
    move(grid, x, y) {
        if (y < rows - 1) {
            for (let i = 1; i < this.searchDistance; i++) {
                // Check if we are within bounds of the grid
                if (y + i < grid.length && grid[y + i][x] instanceof Air) {
                    grid[y + i][x] = this;  // Move water to the new position
                    grid[y][x] = new Air();  // Set current cell to air
                    return true;
                }
            }
            
            // If no spac found in the search area, try moving left or right based on direction
            if (this.dir === 1) { // Move right
                if (this.tryMoveRight(grid, x, y)) return true;
                if (this.tryMoveLeft(grid, x, y)) return true; // Try left as fallback
            } else { // Move left
                if (this.tryMoveLeft(grid, x, y)) return true;
                if (this.tryMoveRight(grid, x, y)) return true; // Try right as fallback
            }
        }
        return false; // No movement possible
    }
}

class Stone extends Material {
    constructor() {
        super('rgb(128, 128, 128)');
    }

    // Stone doesn't move, it remains in place
    move(grid, x, y) {
        return false;
    }
}

class Air extends Material {
    constructor() {
        super('rgba(0, 0, 0, 0)');  // Transparent color
    }

    // Air doesn't move, it remains invisible and empty
    move(grid, x, y) {
        return false;
    }
}