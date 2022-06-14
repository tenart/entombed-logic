import utils from "../utils.js";
import Draggable from "./Draggable.js";

function paramsAreValid(type, position, editor) {
    if(!["and", "or", "not"].includes(type)) {
        console.warn("Invalid type for logic brick constructor.");
        return false;
    }
    if(Number.isNaN(position.x) || Number.isNaN(position.y)) {
        console.warn("Invalid position for logic brick constructor.");
        return false;
    }
    if(editor === undefined) {
        console.warn("Invalid editor reference for logic brick constructor.");
        return false;
    }
    return true;
}

/**
     * Helper function to generate HTML string for a logic brick. 
     * Should NOT be called directly.
     * @return {String} The created HTML string.
     */
function createBrickHTMLString(id, type) {
    const HTMLString = `
        <div id="${id}" class="logic-brick ${type}-brick draggable" data-type="${type}">
            <div class="drop-slot slot-left"></div>
            <p class="label">${type.toUpperCase()}</p>
            <div class="drop-slot slot-right"></div>
        </div>
    `;
    return HTMLString;
}

export default class NewLogicBrick extends Draggable {
    constructor(type, position, editor) {
        // Validate parameters.
        if(!paramsAreValid(type, position, editor)) { return }
        // Construct base draggable object.
        const newID = `${type}-${utils.newID()}`.toLowerCase();
        const newHTMLString = createBrickHTMLString(newID, type);
        super(newID, position, newHTMLString);
        // Logic fields.
        this.type = type.toLowerCase();              // The logic operation this brick will perform.
        this.result = undefined;       // The boolean value this block evaluates to.
        this.parent = undefined;       // The parent logic brick of this brick.
        this.parentSlot = undefined;   // The slot that this brick occupies in the parent brick.
        this.children = {              // The children of this brick.
            left: undefined, 
            right: undefined
        }
        // Helper fields.
        this._HTMLSlots = {
            left: document.querySelector(`#${this.id} .slot-left`),
            right: document.querySelector(`#${this.id} .slot-right`)
        }
        this._editor = editor;
        // this.fooBar();
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
                this._HTMLSlots.left.appendChild(child.getHTMLElement());
                this.children.left = child;
            break;
            case "right":
                this._HTMLSlots.right.appendChild(child.getHTMLElement());
                this.children.right = child;
            break;
        }
        // If child does not have parent, attach self as parent.
        if(!child.hasParent() && !doubleLinkCall) {
            child.attachParent(this, slot, true);
        }
        // Once double link has been established, update root bricks.
        if(doubleLinkCall) {
            this._editor._updateRootBricks();
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
        this.getHTMLElement().style.position = "initial";
        // If parent does not have child in this slot, attach self as child.
        if(!parent.hasChild(slot) && !doubleLinkCall) {
            parent.attachChild(this, slot, true);
        }
        // Once double link has been established, update root bricks.
        if(doubleLinkCall) {
            this._editor._updateRootBricks();
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
            this._editor._updateRootBricks();
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
        this.setPosition(utils.getHTMLPosition(this.getHTMLElement(), true));
        this.getHTMLElement().style.position = "absolute";
        // Detach own HTML from parent HTML.
        this.bringToFront();
        // If parent still has link to self, sever parent's link.
        if(tempParent.hasChild(tempParentSlot) && !doubleLinkCall) {
            tempParent.detachChild(tempParentSlot, true);
        }
        // Once double link has been cut, update root bricks.
        if(doubleLinkCall) {
            this._editor._updateRootBricks();
        }
    }
}