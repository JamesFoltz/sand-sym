class Material {
    constructor(color) {
        this.color = color;
    }
}

class Sand extends Material {
    constructor() {
        super('rgb(194, 178, 128)');
        this.initialMoveChance = 0.3;
    }

    move(grid, x, y) {
        if (y < rows - 1) {
            let moveChance = Math.random() * this.initialMoveChance;

            if (grid[y + 1][x] instanceof Air || grid[y + 1][x] instanceof Water) {
                swapCells(x, y, x, y + 1);
                return true;
            }

            let sandAboveCount = 0;
            for (let i = y - 1; i >= 0; i--) {
                if (grid[i][x] instanceof Sand) {
                    sandAboveCount++;
                }
            }

            moveChance *= (1 + sandAboveCount * 0.1);
            let randomChance = Math.random();

            if (x > 0 && (grid[y + 1][x - 1] instanceof Air || grid[y + 1][x - 1] instanceof Water)) {
                if (randomChance < moveChance) {
                    swapCells(x, y, x - 1, y + 1);
                    return true;
                }
            }

            if (x < cols - 1 && (grid[y + 1][x + 1] instanceof Air || grid[y + 1][x + 1] instanceof Water)) {
                if (randomChance < moveChance) {
                    swapCells(x, y, x + 1, y + 1);
                    return true;
                }
            }
        }
        return false;
    }
}

class Water extends Material {
    constructor() {
        super('rgb(0, 0, 255)');
        this.dir = Math.random() < 0.5 ? 1 : -1;
        this.searchDistance = 3;
    }

    tryMoveLeft(grid, x, y) {
        for (let i = 1; i < this.searchDistance; i++) {
            if (x > 0 && grid[y][x - i] instanceof Air) {
                swapCells(x, y, x - i, y);
                return true;
            }
        }
        this.dir = 1;
        return false;
    }

    tryMoveRight(grid, x, y) {
        for (let i = 1; i < this.searchDistance; i++) {
            if (x < cols - 1 && grid[y][x + i] instanceof Air) {
                swapCells(x, y, x + i, y);
                return true;
            }
        }
        this.dir = -1;
        return false;
    }

    move(grid, x, y) {
        if (y < rows - 1) {
            for (let i = 1; i < this.searchDistance; i++) {
                if (y + i < grid.length && grid[y + i][x] instanceof Air) {
                    swapCells(x, y, x, y + i);
                    return true;
                }
            }
            
            if (this.dir === 1) {
                if (this.tryMoveRight(grid, x, y)) return true;
                if (this.tryMoveLeft(grid, x, y)) return true;
            } else {
                if (this.tryMoveLeft(grid, x, y)) return true;
                if (this.tryMoveRight(grid, x, y)) return true;
            }
        }
        return false;
    }
}

class Stone extends Material {
    constructor() {
        super('rgb(128, 128, 128)');
    }

    move(grid, x, y) {
        return false;
    }
}

class Air extends Material {
    constructor() {
        super('rgba(0, 0, 0, 0)');
    }

    move(grid, x, y) {
        return false;
    }
}

function swapCells(cellAX, cellAY, cellBX, cellBY) {
    let cellA = grid[cellAY][cellAX];
    let cellB = grid[cellBY][cellBX];
    grid[cellAY][cellAX] = cellB;
    grid[cellBY][cellBX] = cellA;
}
