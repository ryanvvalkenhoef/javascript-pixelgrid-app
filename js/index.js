var gridCells = []; // gridCell objects
var backgroundColor = 0;
var selectedColor = 2;
var selectedTool = 0;
const defCellCount = 1024;
const sTools = ['pencil', 'bucket', 'eraser'] // Selectable tools
const colors = ['transparent', 'white', 'black', 'grey', 'red', 'brown', 'orangered', 'orange', 'lightsalmon', 'yellow', 'yellowgreen', 'green', 'lightgreen', 'blue', 'darkblue', 'deepskyblue', 'aqua', 'turquoise', 'purple', 'magenta'];

class gridCell {

    constructor(id, color, position, index) {
        this.id = id;
        this.color = color;
        this.pos = position;
        this.index = index;

        this.element = this.gridCell;
    }

    static get colors() {
        return colors;
    }

    get gridCell() {
        const dominator = new Dominator(Templates.gridCell(this));
        // Add click-event to perform the tool that's selected
        dominator.event(this.performTool.bind(this));
        const elem = dominator.domElement;
        this.element = elem;
        return elem;
    }

    performTool() {
        const allColors = [].concat(colors, project.customColors);
        switch (selectedTool) {
          case 0:
            // Change cell's color to selected one and dye cell
            this.element.classList.remove(this.color);
            this.color = allColors[selectedColor];
            matrices.changeCurrent(this.pos.x, this.pos.y, selectedColor);
            this.element.classList.add(this.color);
            break;
          case 1:
            // Dye all cells with selectedColor
            gridCells.forEach(cell => {
                cell.element.classList.remove(cell.color);
                cell.color = allColors[selectedColor];
                matrices.changeCurrent(cell.pos.x, cell.pos.y, selectedColor);
                cell.element.classList.add(allColors[selectedColor]);
            });
            // Set backgroundColor
            backgroundColor = selectedColor;
            break;
          case 2:
            // Change cell's color to backgroundColor and dye cell
            this.element.classList.remove(this.color);
            this.color = allColors[0];
            matrices.changeCurrent(this.pos.x, this.pos.y, 0);
            this.element.classList.add(this.color);
            break;
        }
    }
}

class gridContainer {

    constructor() {
        this.matrix = matrices.current;

        this.select = this.gridSizeSelect;
        this.framesH = this.framesHeading;
        this.container = this.gridContainer;

        this.appendGridCells();
    }

    get gridContainer() {
        const dominator = new Dominator(Templates.gridContainer(this));
        const div = dominator.domElement;
        const options = document.querySelector('#project-properties');
        options.appendChild(this.select);
        options.appendChild(this.framesH);
        this.container = div;
        return div;
    }

    get framesHeading() {
        const dominator = new Dominator(Templates.framesCountH());
        // Set content of dominator to position of current matrix and length of all.
        dominator.content = `Frame ${matrices.curIndex+1} / ${matrices.all.length}`;
        let heading = dominator.domElement;
        this.framesH = heading;
        return heading;
    }

    get gridSizeSelect() {
        const dominator = new Dominator(Templates.gridSizeSelect());
        let select = dominator.domElement;
        this.select = select;
        return select;
    }

    appendGridCells() {
        this.matrix = matrices.current; // Update matrix
        // Fill up array gridCells and return elements created with initiation
        gridCells = [];
        for (let y = 0; y < this.matrix.length; y++) {
            for (let x = 0; x < this.matrix[y].length; x++) {
                // Create new cell and push data to an array of cells
                const indx = gridCells.length;
                const allColors = [].concat(colors, project.customColors);
                const cell = new gridCell(`c${x}-${y}`, allColors[this.matrix[y][x]], {x: x, y: y}, indx);
                gridCells.push(cell);
                // Create element with size based on cellCount
                let element = cell.element;
                const c = (project.cellCount == 256) ? 46.85
                          : (project.cellCount == 2208) ? 15.96
                          : 23.45;
                    element.style.width = `${c}px`;
                    element.style.height = `${c}px`;
                this.container.appendChild(element);
            }
        }
    }

    changeCellSize(value) {
        if (confirm('Are you sure you want to change the grid\'s size?\nBy doing this, your project will be reset.')) {
            project.cellCount = (value == '16x16') ? 256
                            : (value == '48x48') ? 2208
                            : 1024;
            matrices.all = [matrices.defMatrix(false)];
            matrices.curIndex = 0;
            this.updateElements();
        } else {
            document.querySelector('#gridSize-select').value = `${project.cellCount**0.5}x${project.cellCount**0.5}`;
        }
        return;
    }

    updateElements() {
        const del = tools.container.querySelector('#delete-frame');
        const move = tools.container.querySelector('#move-frame');
        (matrices.all.length == 1) ? del.classList.add('disabled') : del.classList.remove('disabled');
        (matrices.all.length == 1) ? move.classList.add('disabled') : move.classList.remove('disabled');
        this.framesH.innerHTML = `Frame ${matrices.curIndex+1} / ${matrices.all.length}`;
        this.container.innerHTML = "";
        this.appendGridCells();
    }
}

class colorButton {

    constructor(color) {
        this.color = color;

        this.element = this.colorButton;
    }

    get colorButton() {
        const dominator = new Dominator(Templates.colorButton(this));
        const allColors = [].concat(colors, project.customColors);
        let colorButton = dominator.domElement;
        // Select element if colorButton's color is equal to selected color
        if (this.color == allColors[selectedColor]) colorButton.classList.add('active');
        this.element = colorButton;
        return colorButton;
    }
}

class toolsContainer {

    constructor() {
        this.colorInput = this.colorPicker;
        this.container = this.toolsContainer;

        // Create color palette
        this.appendColorPalette();
    }

    get toolsContainer() {
        const dominator = new Dominator(Templates.toolsContainer(this));
        // Add events to non-selectable tools
        dominator.event(this.resetFrame, 'delete-frame');
        dominator.event(this.moveFrame, 'move-frame');
        // Add events to frame-tools
        dominator.event(this.duplicateFrame, 'clone-frame');
        dominator.event(this.stepBackward, 'step-backward');
        dominator.event(matrices.playAnimation, 'play-animation');
        dominator.event(this.stepForward, 'step-forward');
        // Get and return the domElement
        let div = dominator.domElement;
        this.container = div;
        return div;
    }

    get colorPicker() {
        const dominator = new Dominator(Templates.colorPicker(this));
        let colorInput = dominator.domElement;
        this.colorInput = colorInput;
        return colorInput;
    }

    appendColorPalette() {
        const allColors = [].concat(colors, project.customColors);
        for (let i = 0; i < allColors.length; i++) {
            // Initiate new colorButton
            let colorBtn = new colorButton(allColors[i]);
            // Add colorBtn to palette container
            this.container.querySelector('#color-palette').appendChild(colorBtn.element);
            const element = this.container.querySelector(`#${allColors[i]}`);
            (i == selectedColor) ? element.classList.add('active') : element.classList.remove('active');
        }
        // Add select events to colorButtons
        this.addSelectEvents('.color-btn');
        // Add colorInput for adding custom colors
        this.container.querySelector('#color-palette').appendChild(this.colorInput);
    }

    addCustomColor(value) {
        const selector = value.replace('#', '');
        const sheet = document.querySelector('#custom-colors').sheet;
        // Only add new customColor if it doesn't already exist and if there aren't 47 colors or more
        if (!project.customColors.includes(`c${selector}`)) {
            project.customColors.push(`c${selector}`);
            sheet.insertRule(`.c${selector}, #c${selector} { background-color: ${value}; }`, 0);
            // Set selectedColor to proper index with the updated array
            selectedColor = [].concat(colors, project.customColors).indexOf(`c${selector}`);
        }
        // Reset color palette
        this.container.querySelector('#color-palette').innerHTML = "";
        this.appendColorPalette();
    }

    duplicateFrame() {
        matrices.add(matrices.copyCurrent());
        grid.updateElements();
    }

    stepBackward() { matrices.changeIndex(true); grid.updateElements(); }

    stepForward() { matrices.changeIndex(false); grid.updateElements(); }

    resetFrame() {
        // If delete button isn't disabled, ask for confirm to reset current frame
        if (matrices.all.length != 1) {
            if (confirm("Are you sure you want to reset this frame?")) {
                matrices.deleteCurrent();
                grid.updateElements();
            }
        }
    }

    moveFrame() {
        // If move button isn't disabled, ask where the frame must be moved to
        if (matrices.all.length != 1) {
            let input = prompt("Move to frame:");
            for (let i = 0; i < matrices.all.length; i++) {
                if (!isNaN(input)) {
                    if (Number(input) == i + 1) {
                        matrices.move(i);
                    }
                } else {
                    alert('The input is not a number');
                    return;
                }
            }
            grid.updateElements();
        }
    }

    addSelectEvents(selector) {
        const allColors = [].concat(colors, project.customColors);
        const elements = document.querySelectorAll(selector);
        [].forEach.call(elements, function(elem) {
            // Add select event to each selectable tool
            elem.addEventListener('click', function() {
                [].forEach.call(elements, function(elem) { elem.classList.remove('active') });
                document.querySelector(`#${elem.id}`).classList.add('active');
                // Set index of the selected tool or color to proper variable
                if (sTools.includes(elem.id)) {
                    selectedTool = sTools.indexOf(elem.id);
                } else if (allColors.includes(elem.id)) {
                    selectedColor = allColors.indexOf(elem.id);
                }
            });
            if (elements.length == 1) {
                // Add change event to other elements
                document.querySelector(selector).addEventListener('change', function() {
                    const v = this.value;
                    (elem.id == 'color-picker') ? tools.addCustomColor(v) : grid.changeCellSize(v);
                });
            }
        });
    }

}

// Future function: const projects = new ProjectsManager();
// var project = projects.current;
var project = {
    name: "",
    cellCount: defCellCount,
    matrices: [],
    customColors: []
}

// Iterate through customColors of project and insert stylesheet rules
const sheet = document.querySelector("#custom-colors").sheet;
for (let i = 0; i < project.customColors.length; i++) {
    const c = project.customColors[i].replace('c', '');
    sheet.insertRule(`.c${c}, #c${c} { background-color: #${c}; }`, 0);
}

// Initiate appropriate classes
const matrices = new MatrixManager(project.matrices);
const grid = new gridContainer();
const tools = new toolsContainer();

// Append appropriate elements
document.querySelector('#tools-wrapper').append(tools.container);

// Focus on project title inputfield
window.onload = function() {
    const input = document.getElementById('project-title');
    input.focus();
    input.select();
  }
document.querySelector('#canvas-wrapper').append(grid.container);

tools.addSelectEvents('.selectable');
tools.addSelectEvents('.color-btn');
tools.addSelectEvents('#color-picker');
tools.addSelectEvents('#gridSize-select');
