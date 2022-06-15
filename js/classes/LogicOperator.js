import KEYWORDS from "../keywords.js";
import utils from "../utils.js";
import Draggable from "./Draggable.js";

/**
 * Helper function to generate HTML string for a LogicOperator. 
 * Should NOT be called directly.
 * @return {String} The created HTML string.
 */
function createLogicOperatorHTMLString(id, type) {
    const HTMLString = `
        <div id="${id}" class="${KEYWORDS.OBJECTS.DRAGGABLE} ${type + KEYWORDS.SUFFIXES.OPERATOR} ${KEYWORDS.OBJECTS.LOGIC_OPERATOR}">
            <div class="${KEYWORDS.DROP_ZONE} ${KEYWORDS.DROP_ZONE}-${KEYWORDS.LEFT}" data-socket="${KEYWORDS.LEFT}"></div>
            <p class="label">${type.toUpperCase()}</p>
            <div class="${KEYWORDS.DROP_ZONE} ${KEYWORDS.DROP_ZONE}-${KEYWORDS.RIGHT}" data-socket="${KEYWORDS.RIGHT}"></div>
        </div>
    `;
    return HTMLString;
}

/**
 * Implementation of a draggable logic operator object.
 */
export default class LogicOperator extends Draggable {
    constructor(type, position, editor) {
        // Construct base draggable object with new ID and new HTML string.
        const newID = `${type}-${utils.newID()}`.toLowerCase();
        const newHTMLString = createLogicOperatorHTMLString(newID, type);
        super(newID, position, newHTMLString);
        // Logic fields.
        this.type = KEYWORDS.OBJECTS.LOGIC_OPERATOR;
        this.logicType = type;
        this.result = undefined;       // The boolean value this block evaluates to.
        this.parent = undefined;       // The parent LogicOperator of this LogicOperator.
        this.parentDropZone = undefined;   // The drop zone that this LogicOperator occupies in the parent LogicOperator.
        this.children = {              // The children of this LogicOperator.
            left: undefined, 
            right: undefined
        }
        // Helper fields.
        this._HTMLDropZones = {
            left: document.querySelector(`#${this.id} .${KEYWORDS.DROP_ZONE}-${KEYWORDS.LEFT}`),
            right: document.querySelector(`#${this.id} .${KEYWORDS.DROP_ZONE}-${KEYWORDS.RIGHT}`)
        }
        this._editor = editor;
        // this.fooBar();
    }

    // GETTERS

    /**
     * Get the parent of this LogicOperator.
     * @returns {LogicOperator} The parent of this LogicOperator, can be undefined.
     */
    getParent() {
        return this.parent;
    }

    /**
     * Get this LogicOperator's children.
     * @returns {Object} Children in the form {left: LogicOperator, right: LogicOperator}.
     */
    getChildren() {
        return this.children;
    }

    getDropZoneHTML(dropZone) {
        return this._HTMLDropZones[dropZone];
    }

    // SENSORS

    /**
     * Check if this LogicOperator has a parent.
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
     * Check if this LogicOperator has a specific child.
     * @param {String} dropZone "left" or "right".
     * @returns {Boolean} True/False.
     */
    hasChild(dropZone) {
        if(this.children[dropZone] !== undefined) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Check if this LogicOperator has both children.
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
     * Attach a child LogicOperator to this LogicOperator.
     * Counterpart of LogicOperator.attachParent().
     * @param {LogicOperator} child The LogicOperator to attach.
     * @param {String} dropZone Where to attach the child LogicOperator, "left" or "right".
     * @param {Boolean} doubleLinkCall Only set to true if this method is called from within its counterpart.
     */
    attachChild(child, dropZone, doubleLinkCall) {
        // Check if child already has parent.
        if(child.hasParent() && !doubleLinkCall) {
            console.warn(this.id, "Child already has parent.");
            return;
        }
        // Check if drop zone is already occupied.
        if(this.children[dropZone] !== undefined && !doubleLinkCall) {
            console.warn(this.id, `Already has child in ${dropZone} drop zone.`);
            return;
        }
        // Establish link.
        switch(dropZone) {
            case KEYWORDS.LEFT:
                this._HTMLDropZones.left.appendChild(child.getHTMLElement());
                this.children.left = child;
            break;
            case KEYWORDS.RIGHT:
                this._HTMLDropZones.right.appendChild(child.getHTMLElement());
                this.children.right = child;
            break;
        }
        // If child does not have parent, attach self as parent.
        if(!child.hasParent() && !doubleLinkCall) {
            child.attachParent(this, dropZone, true);
        }
        // Once double link has been established, update root LogicOperators.
        if(doubleLinkCall) {
            this._editor._onTreeUpdate();
        }
    }

    /**
     * Attach this LogicOperator to a parent LogicOperator.
     * Counterpart of LogicOperator.attachChild().
     * @param {LogicOperator} parent The parent LogicOperator to attach to.
     * @param {String} dropZone Where to attach to parent, "left" or "right".
     * @param {Boolean} doubleLinkCall Only set to true if this method is called from within its counterpart.
     */
    attachParent(parent, dropZone, doubleLinkCall) {
        // Check if already has parent.
        if(this.parent !== undefined && !doubleLinkCall) {
            console.warn(this.id, "Already has parent.");
            return;   
        }
        // Check if drop zone in parent is already occupied.
        if(parent.hasChild(dropZone) && !doubleLinkCall) {
            console.warn(this.id, `Parent already has child in ${dropZone} drop zone.`);
            return;
        }
        // Establish link.
        this.parent = parent;
        this.parentDropZone = dropZone;
        // Set child positioning to sit nicely inside parent's HTML.
        this.setPosition(utils.getZeroPosition());
        this.getHTMLElement().style.position = "initial";
        // If parent does not have child in this drop zone, attach self as child.
        if(!parent.hasChild(dropZone) && !doubleLinkCall) {
            parent.attachChild(this, dropZone, true);
        }
        // Once double link has been established, update root LogicOperators.
        if(doubleLinkCall) {
            this._editor._onTreeUpdate();
        }
    }

    /**
     * Detach child LogicOperator in specified drop zone from this LogicOperator.
     * @param {String} dropZone Which child to detach, "left" or "right".
     * @param {Boolean} doubleLinkCall Only set to true if this method is called from within its counterpart.
     */
    detachChild(dropZone, doubleLinkCall) {
        // Check if child exists.
        if(this.children[dropZone] === undefined && !doubleLinkCall) {
            console.warn(this.id, `No child in ${dropZone} drop zone to detach.`);
            return;
        }
        // Grab temporary reference to child.
        const tempChild = this.children[dropZone];
        // Sever self's link to child.
        this.children[dropZone] = undefined;
        // If child still has link to parent, sever child's link.
        if(tempChild.hasParent() && !doubleLinkCall) {
            tempChild.detachParent(true);
        }
        // Once double link has been cut, update root LogicOperators.
        if(doubleLinkCall) {
            this._editor._onTreeUpdate();
        }
    }

    /**
     * Detach this LogicOperator from parent LogicOperator.
     * @param {Boolean} doubleLinkCall Only set to true if this method is called from within its counterpart.
     */
    detachParent(doubleLinkCall) {
        // Check if has parent.
        if(this.parent === undefined && !doubleLinkCall) {
            console.warn(this.id, "No parent to detach.");
            return;
        }
        // Grab temporary reference to parent and drop zone.
        const tempParent = this.parent;
        const tempParentDropZone = this.parentDropZone;
        // Sever links to parent.
        this.parent = undefined;
        this.parentDropZone = undefined;
        // Reset internal position and HTML position.
        this.setPosition(utils.getHTMLPosition(this.getHTMLElement(), true));
        this.getHTMLElement().style.position = "absolute";
        // Detach own HTML from parent HTML.
        this.bringToFront();
        // If parent still has link to self, sever parent's link.
        if(tempParent.hasChild(tempParentDropZone) && !doubleLinkCall) {
            tempParent.detachChild(tempParentDropZone, true);
        }
        // Once double link has been cut, update root LogicOperators.
        if(doubleLinkCall) {
            this._editor._onTreeUpdate();
        }
    }

    /**
     * Overrides Draggable's default method. Will check for a parent first before bringing to front.
     */
    bringToFront() {
        if(this.hasParent()) {
            console.warn(this.id, "Cannot bring to front without detaching from parent first.");
            return;
        }
        super.bringToFront();
    }
}