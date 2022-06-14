import utils from "../utils.js";
import Draggable from "./Draggable.js";
import LogicBrick from "./LogicBrick.js";
import NewLogicBrick from "./NewLogicBrick.js";

export default class Editor {

    /**
     * Construct a new editor instance.
     * @returns {Editor} The created instance.
     */
    constructor() {
        // Keep track of bricks.
        this.rootHTML = utils.getEditorRoot();
        this.allObjects = [];
        this.binaryTreeRoots = [];
        // For dragging.
        this._draggingObject = undefined;
        this._draggingHTML = undefined;
        this._draggingOffset = utils.getZeroPosition();
        // Attach event listeners.
        this._attachEventListeners();
    }

    // GETTERS

    /**
     * Get all objects in this editor.
     * @returns {Array} Array of all objects.
     */
    getAllObjects() {
        return this.allObjects;
    }

    /**
     * Get all root logic bricks in this editor.
     * @returns {Array} Array of all root bricks.
     */
    getBinaryTreeRoots() {
        return this.binaryTreeRoots;
    }

    // SENSORS

    _isDraggingSomething() {
        if(this._draggingObject !== undefined && this._draggingHTML !== undefined) {
            return true;
        } else {
            return false;
        }
    }

    // SETTERS

    // PUBLIC METHODS

    /**
     * Construct new logic brick and add it to this editor.
     * @param {String} type The type of logic for this brick. Can be "and", "or", or "not".
     * @param {Object} position X and Y pixel position in the form of {x: Number, y: Number}.
     * @return {NewLogicBrick} A new instance of a logic brick.
     */
    createBrick(type, position) {
        if(type === undefined && position === undefined) {
            this._createDefaultDraggable();
        } else {
            const newBrick = new NewLogicBrick(type, position, this);
            this._addNewObject(newBrick);
            return newBrick;
        }
    }

    createObject(type, position) {
        // 
    }

    /**
     * Attach a child logic brick to a parent logic brick at a given slot.
     * @param {NewLogicBrick} parent Parent logic brick to contain child.
     * @param {NewLogicBrick} child Child logic brick to attach to parent.
     * @param {String} slot The parent slot to insert child into.
     */
    attachBricks(parent, child, slot) {
        parent.attachChild(child, slot);
        // this._updateRootBricks();
    }

    /**
     * Print all object IDs and indices.
     */
    printAllObjectIDs() {
        const total = this.allObjects.length;
        console.log(`${total} objects ${total === 1 ? "ID" : "IDs"}:`);
        this.allObjects.forEach((object, index) => {
            console.log(index, object.getType(), object.getID());
        });
    }

    /**
     * Print all root brick IDs and indices.
     */
    printRootBrickIDs() {
        const total = this.binaryTreeRoots.length;
        console.log(`${total} root brick ${total === 1 ? "ID" : "IDs"}:`);
        this.binaryTreeRoots.forEach((brick, index) => {
            console.log(index, brick.getType(), brick.getID());
        });
    }

    /**
     * Find a object by its ID.
     * @param {String} IDString The ID of the object to look for.
     * @returns {NewLogicBrick} The found object. Undefined if not found.
     */
    findObjectByID(IDString) {
        for(let i = 0; i < this.allObjects.length; i++) {
            if(this.allObjects[i].getID() === IDString) {
                return this.allObjects[i];
            }
        }
        return undefined;
    }

    // PRIVATE METHODS

    /**
     * Helper method to find and update all root bricks.
     */
    _updateRootBricks() {
        let newRootBricks = [];
        this.allObjects.forEach((object) => {
            // If this brick has no parent, it is a root brick.
            if(object instanceof NewLogicBrick && !object.hasParent()) { 
                newRootBricks.push(object) 
            }
        })
        // console.log(newRootBricks);
        this.binaryTreeRoots = newRootBricks;
    }

    _attachEventListeners() {
        document.addEventListener("mousedown", (event) => {this._onMouseDown(event)});
        document.addEventListener("mousemove", (event) => {this._onMouseMove(event)});
        document.addEventListener("mouseup", (event) => {this._onMouseUp(event)});
    }

    // Drag start.
    _onMouseDown(event) {
        // Get cursor position at time of mousedown.
        const cursorPosition = {x: event.pageX, y: event.pageY}
        // Find closest HTML element with the "draggable" class.
        const draggableHTML = event.target.closest(".draggable");
        if(draggableHTML === null) { return }
        // Get ID and classes from HTML element.
        const draggableID = draggableHTML.getAttribute("id");
        console.log("Clicked on", draggableID);
        // Set draggable element as target and get position offset.
        const draggableObject = this.findObjectByID(draggableID);
        this._draggingObject = draggableObject;
        this._draggingHTML = draggableHTML;
        this._draggingOffset = utils.getPositionDiff(utils.getHTMLPosition(draggableHTML, true), cursorPosition);

    }

    // During drag.
    _onMouseMove(event) {
        const cursorPosition = {x: event.pageX, y: event.pageY}
        // If something is being dragged.
        if(this._isDraggingSomething()) {
            // If dragged item is a logic brick, detach parent if exists.
            if(this._isBrick(this._draggingObject) && this._draggingObject.hasParent()) {
                console.log("Detaching", this._draggingObject.getID());
                this._draggingObject.detachParent();
            }
            // 
            const dragToPosition = utils.getPositionDiff(this._draggingOffset, cursorPosition);
            this._draggingObject.setPosition(dragToPosition);
            this._draggingObject.bringToFront();
        }
    }

    // Drag end.
    _onMouseUp(event) {
        if(this._isDraggingSomething()) {
            // console.log("Dropping", this._draggingObject.getID());
        }
        this._draggingObject = undefined;
        this._draggingHTML = undefined;
        this._draggingOffset = utils.getZeroPosition();
    }

    _isDraggingSomething() {
        if(this._draggingObject !== undefined && this._draggingHTML !== undefined) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Checks an HTML element or JS object to see if it's a logic brick.
     * @param {Object} target HTML element or NewLogicBrick to check if a brick.
     * @returns {Boolean} True if HTML element is a logic brick.
     */
    _isBrick(target) {
        if(target instanceof HTMLElement) {
            const targetIsBrick = target.classList.contains("logic-brick");
            return targetIsBrick;
        }
        if(target instanceof LogicBrick) {
            return true;
        }
        if(target instanceof NewLogicBrick) {
            return true;
        }
        return false;
    }

    _createDefaultDraggable(id, position, HTMLString) {
        const newDraggableElement = new Draggable(id, position, HTMLString);
        this._addNewObject(newDraggableElement);
        return newDraggableElement;
    }
    
    _addNewObject(object) {
        this.allObjects.push(object);
        this._updateRootBricks();
    }
}