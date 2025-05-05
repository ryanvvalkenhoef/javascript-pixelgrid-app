 // >-< HTML Generator >-<

// Create class Dominator
class Templater {
    // Define instances that represent a DOM element as object
    constructor(HTMLDocument) {
        // Replicate the template with the dynamic values
        const domElement = HTMLDocument.getElementsByTagName('html');
        const object = this.domTemplateObj(domElement);

        // Assign the values specific for the object
        this.templateObject;
        Object.assign(this, object);
    }

    // Create function domElement() with get to make it changable
    set domTemplateObj(domElement) {
        // Generate and return a DOM templateObject with the values of the element
        this.templateObject = {
            id: domElement.id,
            content: domElement.innerText,
            
        }
        if (domElement.id) this[id] = domElement.id;
        if (domElement.innerText) this[content] = domElement.innerText;
        if (domElement.props) for (const prop in domElement.props) {
            this[properties][prop] = domElement.props[prop];
        }
        if (domElement.className) for (const cssClass of domElement.className.split(' ')) {
            this[classes].append(cssClass)
        }
        if (domElement.children) for (const child of domElement.children) {
            const object = this.domTemplateObj(child)
            this[children].append(object);
            if (child.id) this[children][child.id] = object;
        }
    }

    // Create function findChildById(id)
    findChildById(id) {
        if (this.children) {
            // Iterate through the children
            for (const child of this.children) {
                // Return child if id is equal to child.id and of the same type
                if (child.id === id) {
                    return child;
                } else if (child.children) {
                    // Else, if the child itself has children, 
                    // execute the function on the child and return what's found
                    let found = child.findChildById(id);
                    if (found) return found;
                }
            }
        }
        return false;
    }

    // Create function event()
    event(action, id, type = 'click') {
        // If id is present, define node with searched child
        // and push event when present
        if (id) {
            const node = this.findChildById(id);
            if (node) {
                node.eventListeners.push({ type: type, action: action });
            }
        } else {
            // Otherwise push event to its own eventListeners
            this.eventListeners.push({ type: type, action: action });
        }
    }
    
}