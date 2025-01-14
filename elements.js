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
        if (x > 0 && grid[y][x - 1] instanceof Air) {
            grid[y][x - 1] = this;  // Move water to the left
            grid[y][x] = new Air();  // Set current cell to air
            return true;
        }
        this.dir = 1; // Change direction to right if left is blocked
        return false;
    }

    tryMoveRight(grid, x, y) {
        if (x < cols - 1 && grid[y][x + 1] instanceof Air) {
            grid[y][x + 1] = this;  // Move water to the right
            grid[y][x] = new Air();  // Set current cell to air
            return true;
        }
        this.dir = -1; // Change direction to left if right is blocked
        return false;
    }

    tryMoveDownLeft(grid, x, y) {
        if (x > 0 && y < rows - 1 && grid[y + 1][x - 1] instanceof Air) {
            grid[y + 1][x - 1] = this;  // Move water down-left
            grid[y][x] = new Air();  // Set current cell to air
            return true;
        }
        return false;
    }

    tryMoveDownRight(grid, x, y) {
        if (x < cols - 1 && y < rows - 1 && grid[y + 1][x + 1] instanceof Air) {
            grid[y + 1][x + 1] = this;  // Move water down-right
            grid[y][x] = new Air();  // Set current cell to air
            return true;
        }
        return false;
    }

    // Method to search for the first available space within the given range
    searchMove(grid, x, y) {
        for (let distance = 1; distance <= this.searchDistance; distance++) {
            // Try moving straight down
            if (y + distance < rows && grid[y + distance][x] instanceof Air) {
                return { x: x, y: y + distance }; // Found a space below
            }

            // Try moving diagonally down-left
            if (x - distance >= 0 && y + distance < rows && grid[y + distance][x - distance] instanceof Air) {
                return { x: x - distance, y: y + distance }; // Found a space down-left
            }

            // Try moving diagonally down-right
            if (x + distance < cols && y + distance < rows && grid[y + distance][x + distance] instanceof Air) {
                return { x: x + distance, y: y + distance }; // Found a space down-right
            }
        }
        return null; // No available space found within the search distance
    }

    // Method to move water
    move(grid, x, y) {
        if (y < rows - 1) {
            // Try searching for a move within the defined distance
            let move = this.searchMove(grid, x, y);

            if (move) {
                grid[move.y][move.x] = this;  // Move the water
                grid[y][x] = new Air();  // Set current cell to air
                return true;
            }

            // If no space found in the search area, try moving left or right based on direction
            if (this.dir === 1) { // Move right
                if (this.tryMoveRight(grid, x, y)) return true;
                if (this.tryMoveDownRight(grid, x, y)) return true; // Try down-right if right is blocked
                if (this.tryMoveLeft(grid, x, y)) return true; // Try left as fallback
                if (this.tryMoveDownLeft(grid, x, y)) return true; // Try down-left if left is blocked
            } else { // Move left
                if (this.tryMoveLeft(grid, x, y)) return true;
                if (this.tryMoveDownLeft(grid, x, y)) return true; // Try down-left if left is blocked
                if (this.tryMoveRight(grid, x, y)) return true; // Try right as fallback
                if (this.tryMoveDownRight(grid, x, y)) return true; // Try down-right if right is blocked
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