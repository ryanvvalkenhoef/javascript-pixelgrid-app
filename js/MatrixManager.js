class MatrixManager {

    constructor(matrices) {
        const isMatrix = (typeof matrices !== 'undefined' && matrices.length > 0);
        this.all = isMatrix ? matrices : [this.defMatrix(false)];
        this.curIndex = 0;
    }

    get current() {
        return this.all[this.curIndex];
    }

    defMatrix(add) {
        // Fill up array defMatrix with indices refering to a white color
        let matrix = [];
        const len = project.cellCount**0.5;
        for (let y = 0; y < len; y++) {
            matrix.push([]); // Push fifty arrays, representing the vertical axis
            for (let x = 0; x < len; x++) {
                matrix[y].push(0); // Push 0 (standard color transparent)
            }
        }
        // Add default matrix to matrices
        if (add) this.add(matrix);
        return matrix;
    }

    add(matrix) {
        this.all.push(matrix);
        this.curIndex = this.all.length-1;
    }

    move(index) {
        array_move(this.all, this.curIndex, index);
    }

    copyCurrent() {
        let matrix = [];
        const allColors = [].concat(colors, project.customColors);
        const len = project.cellCount**0.5;
        for (let y = 0; y < len; y++) {
            matrix.push([]);
            for (let x = 0; x < len; x++) {
                // Since gridCells isn't twodimensional, calculate index and push colorIndx
                const colorIndx = allColors.indexOf(gridCells[len*y+x].color);
                matrix[y].push(colorIndx);
            }
        }
        return matrix;
    }

    changeCurrent(x, y, color) {
        this.all[this.curIndex][y][x] = color;
    }

    deleteCurrent() {
        this.all.splice(this.curIndex, 1);
        this.curIndex = this.all.length-1;
    }

    changeIndex(leftDirection) {
        let newIndex = leftDirection ? (this.curIndex-1) : this.curIndex+1;
        if (newIndex+1 > this.all.length) this.defMatrix(true);
        if (newIndex >= 0) this.curIndex = newIndex;
    }

    playAnimation() {
        if (matrices.curIndex == matrices.all.length-1) matrices.curIndex = 0;
        // Change grid after every millisecond
        setTimeout(function() { matrices.playFrame(); }, 100);
    }

    playFrame() {
        this.changeIndex(false);
        grid.updateElements();
        if (this.curIndex < this.all.length-1) {
            setTimeout(function() { matrices.playFrame(); }, 100);
        } else {
            setTimeout(function() {
                matrices.curIndex = 0;
                grid.updateElements();
            }, 100);
            return;
        }
    }

}

function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
};