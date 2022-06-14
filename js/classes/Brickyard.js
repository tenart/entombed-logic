import utils from "../utils.js";
import LogicBrick from "./LogicBrick.js";

export default class Brickyard {

    /**
     * Construct a new brickyard instance.
     * @returns {Brickyard} The created instance.
     */
    constructor() {
        // Keep track of bricks.
        this.rootHTML = utils.getBrickyardRoot();
        this.allBricks = [];
        this.rootBricks = [];
        // For dragging.
        this._draggingObject = undefined;
        this._draggingHTML = undefined;
        this._draggingOffset = utils.getZeroPosition();
        // Attach event listeners.
        this._attachEventListeners();
    }

    // GETTERS

    /**
     * Get all logic bricks in this brickyard.
     * @returns {Array} Array of all bricks.
     */
    getAllBricks() {
        return this.allBricks;
    }

    /**
     * Get all root logic bricks in this brickyard.
     * @returns {Array} Array of all root bricks.
     */
    getRootBricks() {
        return this.rootBricks;
    }

    // SETTERS

    // PUBLIC METHODS

    /**
     * Construct new logic brick and add it to this brickyard.
     * @param {String} type The type of logic for this brick. Can be "and", "or", or "not".
     * @param {Object} position X and Y pixel position in the form of {x: Number, y: Number}.
     * @return {LogicBrick} A new instance of a logic brick.
     */
    createBrick(type, position) {
        const newBrick = new LogicBrick(type, position, this);
        this.allBricks.push(newBrick);
        this._updateRootBricks();
        return newBrick;
    }

    /**
     * Attach a child logic brick to a parent logic brick at a given slot.
     * @param {LogicBrick} parent Parent logic brick to contain child.
     * @param {LogicBrick} child Child logic brick to attach to parent.
     * @param {String} slot The parent slot to insert child into.
     */
    attachBricks(parent, child, slot) {
        parent.attachChild(child, slot);
        // this._updateRootBricks();
    }

    /**
     * Print all brick IDs and indices.
     */
    printAllBrickIDs() {
        const total = this.allBricks.length;
        console.log(`${total} brick ${total === 1 ? "ID" : "IDs"}:`);
        this.allBricks.forEach((brick, index) => {
            console.log(index, brick.getType(), brick.getID());
        });
    }

    /**
     * Print all root brick IDs and indices.
     */
    printRootBrickIDs() {
        const total = this.rootBricks.length;
        console.log(`${total} root brick ${total === 1 ? "ID" : "IDs"}:`);
        this.rootBricks.forEach((brick, index) => {
            console.log(index, brick.getType(), brick.getID());
        });
    }

    /**
     * Find a brick by its ID.
     * @param {String} brickID The ID of the brick to look for.
     * @returns {LogicBrick} The found logic brick. Undefined if not found.
     */
    findBrickByID(brickID) {
        for(let i = 0; i < this.allBricks.length; i++) {
            if(this.allBricks[i].getID() === brickID) {
                return this.allBricks[i];
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
        this.allBricks.forEach((thisBrick) => {
            // If this brick has no parent, it is a root brick.
            if(!thisBrick.hasParent()) { 
                newRootBricks.push(thisBrick) 
            }
        })
        // console.log(newRootBricks);
        this.rootBricks = newRootBricks;
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
        const targetHTML = event.target.closest(".draggable");
        if(targetHTML === null || targetHTML === undefined) { return }
        // Get ID and classes from HTML element.
        const targetID = targetHTML.getAttribute("id");
        console.log("Clicked on", targetID);
        // If clicked on element is a logic brick.
        if(this._isBrick(targetHTML)) {
            const targetBrick = this.findBrickByID(targetID);
            this._draggingObject = targetBrick;
            this._draggingHTML = targetHTML;
            this._draggingOffset = utils.getPositionDiff(utils.getHTMLPosition(targetHTML, true), cursorPosition);
            // console.log("Dragging", this._draggingObject.getID());
        } else {
            console.log("foo");
        }
    }

    // During drag.
    _onMouseMove(event) {
        const cursorPosition = {x: event.pageX, y: event.pageY}
        // If something is being dragged.
        if(this._isDragging()) {
            // If dragged item is a logic brick, detach parent if exists.
            if(this._isBrick(this._draggingObject) && this._draggingObject.hasParent()) {
                this._draggingObject.detachParent();
            }
            const dragToPosition = utils.getPositionDiff(this._draggingOffset, cursorPosition);
            this._draggingObject.setPosition(dragToPosition);
            this._draggingObject.bringToFront();
        }
    }

    // Drag end.
    _onMouseUp(event) {
        if(this._isDragging()) {
            // console.log("Dropping", this._draggingObject.getID());
        }
        this._draggingObject = undefined;
        this._draggingHTML = undefined;
        this._draggingOffset = utils.getZeroPosition();
    }

    _isDragging() {
        if(this._draggingObject !== undefined && this._draggingHTML !== undefined) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Checks an HTML element or JS object to see if it's a logic brick.
     * @param {Object} target HTML element or LogicBrick to check if a brick.
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
        return false;
    }
}