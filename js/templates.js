const Templates = {
    gridCell: function(obj) {
        return {
            tag: 'button',
            classes: ['gridCell', obj.color],
            id: obj.id
        }
    },
    gridContainer: function(obj) {
        return {
            tag: 'div',
            id: obj.id,
            classes: ['grid-container'],
            children: []
        }
    },
    toolsContainer: function(obj) {
        return {
            tag: 'div',
            classes: ['tools-container'],
            children: [ {
                tag: 'div',
                classes: ['project-options'],
                children: [
                    {
                        tag: 'input',
                        id: 'project-title',
                        content: project.name,
                        properties: { placeholder: 'My Awesome Project' }
                    },
                    { tag: 'a', id: 'save-project', classes: ['fas', 'fa-save'], properties: { href: '' } }
                ]
            },
            {
                tag: 'div',
                id: obj.id,
                classes: ['tools'],
                children: [
                    {
                        tag: 'div',
                        id: 'tool-container',
                        children: [
                            { tag: 'button', id: 'pencil', classes: ['selectable', 'tool', 'fas', 'fa-pen', 'active'], properties: { title: 'Pencil' } },
                            { tag: 'button', id: 'bucket', classes: ['selectable', 'tool', 'fas', 'fa-fill'], properties: { title: 'Fill' } },
                            { tag: 'button', id: 'eraser', classes: ['selectable', 'tool', 'fas', 'fa-eraser'], properties: { title: 'Eraser' } },
                        ]
                    },
                    {
                        tag: 'div',
                        id: 'color-palette',
                        children: []
                    },
                    {
                        tag: 'div',
                        id: 'option-container',
                        children: [
                            { tag: 'button', id: 'delete-frame', classes: ['option', 'fas', 'fa-trash', 'disabled'], properties: { title: 'Delete frame' } },
                            { tag: 'button', id: 'move-frame', classes: ['option', 'fas', 'fa-arrow-down', 'disabled'], properties: { title: 'Move frame' } },
                            { tag: 'button', id: 'clone-frame', classes: ['option', 'fas', 'fa-clone'], properties: { title: 'Clone frame' } },
                            { tag: 'button', id: 'step-backward', classes: ['option', 'fas', 'fa-step-backward'], properties: { title: 'Step backward' } },
                            { tag: 'button', id: 'play-animation', classes: ['option', 'fas', 'fa-play'], properties: { title: 'Play animation' } },
                            { tag: 'button', id: 'step-forward', classes: ['option', 'fas', 'fa-step-forward'], properties: { title: 'Step forward' } }
                        ]
                    }
                ]   
            } ]
        }
    },
    gridSizeSelect: function() {
        return {
            tag: 'div', id: 'gridSize-select-wrapper', children: [
                { tag: 'select', id: 'gridSize-select', properties: { name: 'gridSize' }, children: [
                    { tag: 'option', properties: { value: '16x16' }, content: '16x16' },
                    { tag: 'option', properties: { value: '32x32', selected: 'selected' }, content: '32x32' },
                    { tag: 'option', properties: { value: '48x48' }, content: '48x48' }
                ] }
            ]
        }
    },
    framesCountH: function() {
        return { tag: 'h6', id: 'frames-count', content: '' }
    },
    colorPicker: function() {
        return { 
            tag: 'input',
            id: 'color-picker', 
            properties: {
                title: 'Custom color',
                type: 'color',
                value: 'black'
            }
        }
    },
    colorButton: function(obj) {
        return { tag: 'button',
            id: obj.color,
            classes: ['color-btn'],
            properties: { 
                title: project.customColors.includes(obj.color) ? obj.color.replace('c', '#') : capitalize(obj.color) 
            }
        }
    }
}
const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}