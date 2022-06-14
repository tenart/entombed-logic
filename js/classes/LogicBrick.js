import utils from "../utils.js";

/**
 * Implementation of a logic brick.
 */
export default class LogicBrick {
    
    /**
     * Construct new logic brick.
     * @param {String} type The type of logic for this brick. Can be "and", "or", or "not".
     * @param {Object} position X and Y pixel position in the form of {x: Number, y: Number}.
     * @param {Brickyard} brickyard The brickyard this brick is a part of.
     * @return {LogicBrick} A new instance of a logic brick.
     */
    constructor(type, position, brickyard) {
        // Encapsulate arguments, generate new ID, and create HTML element.
        this.id = `${type}-${utils.newID()}`.toLowerCase();
        // Logic fields.
        this.type = type.toLowerCase();              // The logic operation this brick will perform.
        this.result = undefined;       // The boolean value this block evaluates to.
        this.parent = undefined;       // The parent logic brick of this brick.
        this.parentSlot = undefined;   // The slot that this brick occupies in the parent brick.
        this.children = {              // The children of this brick.
            left: undefined, 
            right: undefined
        }
        // Capture HTML nodes.
        this._HTMLNode = this._createBrickHTML();
        this._HTMLSlots = {
            left: document.querySelector(`#${this.id} .slot-left`),
            right: document.querySelector(`#${this.id} .slot-right`)
        }
        // For dragging.
        this.position = this.setPosition(position);
        // this._isDragging = false;
        // Brickyard reference.
        this._brickyard = brickyard;
    }

    // SETTERS

    /**
     * Set the pixel position of this logic brick.
     * @param {Object} position X and Y pixel position in the form of {x: Number, y: Number}.
     * @returns {Number} The set position.
     */
    setPosition(position) {
        // Validate position argument.
        if(Number.isNaN(position.x) || Number.isNaN(position.y)) {
            console.warn(this.id, "One or more values is not a number. Defaulting to", utils.getZeroPosition());
            position = utils.getZeroPosition();
        }
        // Update internal position and CSS position.
        this.position = position;
        this._HTMLNode.style.left = `${this.position.x}px`;
        this._HTMLNode.style.top = `${this.position.y}px`;
        // Return position if needed.
        return position;
    }

    // GETTERS

    /**
     * Get this logic brick's unique ID string.
     * @returns {String} The ID as a string.
     */
    getID() {
        return this.id;
    }

    /**
     * Get this logic brick's logic type.
     * @returns {String} The logic type as a string.
     */
    getType() {
        return this.type;
    }

    /**
     * Get this logic brick's pixel position.
     * @returns {Object} The position in the form {x: Number, y: Number}.
     */
    getPosition() {
        return this.position;
    }

    /**
     * Get the parent of this logic brick.
     * @returns {LogicBrick} The parent of this brick, can be undefined.
     */
    getParent() {
        // if(this.parent === undefined) { console.log(this.id, "Has no parent.") }
        return this.parent;
    }

    /**
     * Get this logic brick's children.
     * @returns {Object} Children in the form {left: LogicBrick, right: LogicBrick}.
     */
    getChildren() {
        // if(this.logicChildren.left === undefined) { console.log(this.id, "Has no left child.") }
        // if(this.logicChildren.right === undefined) { console.log(this.id, "Has no right child.") }
        return this.children;
    }

    /**
     * Get this logic brick's HTML element.
     * @returns {HTMLElement} The HTML element.
     */
    getHTMLNode() {
        return this._HTMLNode;
    }

    getResult() {
        // if(this.logicResult === undefined) { console.warn(this.id, "Cannot evaluate result.") }
        return this.result;
    }

    // SENSORS

    /**
     * Check if this brick has a parent.
     * @returns {Boolean} True/False.
     */
    hasParent() {
        if(this.parent !== undefined) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Check if this brick has a specific child.
     * @param {String} slot "left" or "right".
     * @returns {Boolean} True/False.
     */
    hasChild(slot) {
        if(this.children[slot] !== undefined) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Check if this brick has both children.
     * @returns {Boolean} True/False.
     */
    hasTwoChildren() {
        if(this.children.left !== undefined && this.children.right !== undefined) {
            return true;
        } else {
            return false;
        }
    }

    // PUBLIC METHODS

    /**
     * Attach a child logic brick to this brick.
     * Counterpart of LogicBrick.attachParent().
     * @param {LogicBrick} child The logic brick to attach.
     * @param {String} slot Where to attach the child brick, "left" or "right".
     * @param {Boolean} doubleLinkCall Only set to true if this method is called from within its counterpart.
     */
    attachChild(child, slot, doubleLinkCall) {
        // Check if child already has parent.
        if(child.hasParent() && !doubleLinkCall) {
            console.warn(this.id, "Child already has parent.");
            return;
        }
        // Check if slot is already occupied.
        if(this.children[slot] !== undefined && !doubleLinkCall) {
            console.warn(this.id, `Already has child in ${slot} slot.`);
            return;
        }
        // Establish link.
        switch(slot) {
            case "left":
                this._HTMLSlots.left.appendChild(child._HTMLNode);
                this.children.left = child;
            break;
            case "right":
                this._HTMLSlots.right.appendChild(child._HTMLNode);
                this.children.right = child;
            break;
        }
        // If child does not have parent, attach self as parent.
        if(!child.hasParent() && !doubleLinkCall) {
            child.attachParent(this, slot, true);
        }
        // Once double link has been established, update root bricks.
        if(doubleLinkCall) {
            this._brickyard._updateRootBricks();
        }
    }

    /**
     * Attach this logic brick to a parent brick.
     * Counterpart of LogicBrick.attachChild().
     * @param {LogicBrick} parent The parent logic brick to attach to.
     * @param {String} slot Where to attach to parent, "left" or "right".
     * @param {Boolean} doubleLinkCall Only set to true if this method is called from within its counterpart.
     */
    attachParent(parent, slot, doubleLinkCall) {
        // Check if already has parent.
        if(this.parent !== undefined && !doubleLinkCall) {
            console.warn(this.id, "Already has parent.");
            return;   
        }
        // Check if slot in parent is already occupied.
        if(parent.hasChild(slot) && !doubleLinkCall) {
            console.warn(this.id, `Parent already has child in ${slot} slot.`);
            return;
        }
        // Establish link.
        this.parent = parent;
        this.parentSlot = slot;
        // Set child positioning to sit nicely inside parent's HTML.
        this.setPosition(utils.getZeroPosition());
        this._HTMLNode.style.position = "initial";
        // If parent does not have child in this slot, attach self as child.
        if(!parent.hasChild(slot) && !doubleLinkCall) {
            parent.attachChild(this, slot, true);
        }
        // Once double link has been established, update root bricks.
        if(doubleLinkCall) {
            this._brickyard._updateRootBricks();
        }
    }

    /**
     * Detach child logic brick in specified slot from this brick.
     * @param {String} slot Which child to detach, "left" or "right".
     * @param {Boolean} doubleLinkCall Only set to true if this method is called from within its counterpart.
     */
    detachChild(slot, doubleLinkCall) {
        // Check if child exists.
        if(this.children[slot] === undefined && !doubleLinkCall) {
            console.warn(this.id, `No child in ${slot} slot to detach.`);
            return;
        }
        // Grab temporary reference to child.
        const tempChild = this.children[slot];
        // Sever self's link to child.
        this.children[slot] = undefined;
        // If child still has link to parent, sever child's link.
        if(tempChild.hasParent() && !doubleLinkCall) {
            tempChild.detachParent(true);
        }
        // Once double link has been cut, update root bricks.
        if(doubleLinkCall) {
            this._brickyard._updateRootBricks();
        }
    }

    /**
     * Detach this logic brick from parent brick.
     * @param {Boolean} doubleLinkCall Only set to true if this method is called from within its counterpart.
     */
    detachParent(doubleLinkCall) {
        // Check if has parent.
        if(this.parent === undefined && !doubleLinkCall) {
            console.warn(this.id, "No parent to detach.");
            return;
        }
        // Grab temporary reference to parent and slot.
        const tempParent = this.parent;
        const tempParentSlot = this.parentSlot;
        // Sever links to parent.
        this.parent = undefined;
        this.parentSlot = undefined;
        // Reset internal position and HTML position.
        this.setPosition(utils.getHTMLPosition(this._HTMLNode, true));
        this._HTMLNode.style.position = "absolute";
        // Detach own HTML from parent HTML.
        this.bringToFront();
        // If parent still has link to self, sever parent's link.
        if(tempParent.hasChild(tempParentSlot) && !doubleLinkCall) {
            tempParent.detachChild(tempParentSlot, true);
        }
        // Once double link has been cut, update root bricks.
        if(doubleLinkCall) {
            this._brickyard._updateRootBricks();
        }
    }

    /**
     * Bring this HTML element to the front by detaching from parent node and reattaching to container.
     */
    bringToFront() {
        
        utils.getBrickyardRoot().appendChild(this._HTMLNode);
    }

    /**
     * Remove this brick and all its children. Also severs link to parent.
     */
    remove() {
        // Detach from parent if exists.
        if(this.parent !== undefined) {
            this.detachParent();
        }
        this._HTMLNode.remove();
    }

    // PRIVATE METHODS

    /**
     * Helper function to generate and append HTML element to the DOM tree. 
     * Should NOT be called directly.
     * @return {HTMLElement} A reference to the appended HTML node.
     */
     _createBrickHTML() {
        // Insert new HTML element.
        utils.getBrickyardRoot().insertAdjacentHTML("beforeend", `
            <div id="${this.id}" class="logic-brick ${this.type}-brick draggable" data-type="${this.type}">
                <div class="drop-slot slot-left"></div>
                <p class="label">${this.type.toUpperCase()}</p>
                <div class="drop-slot slot-right"></div>
            </div>
        `);
        // Return newly appended HTML element.
        return document.getElementById(this.id);
    }
}