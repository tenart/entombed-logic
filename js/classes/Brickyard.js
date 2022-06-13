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
        this._currentlyDraggingObject = undefined;
        this._currentlyDraggingHTML = undefined;
        this._cursorOffset = utils.getZeroPosition();
        
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
     * Print all root brick IDs and indices.
     */
    printAllBrickIDs() {
        const total = this.allBricks.length;
        console.log(`${total} brick ${total === 1 ? "ID" : "IDs"}:`);
        this.allBricks.forEach((brick, index) => {
            console.log(index, brick.getType(), brick.getID());
        });
    }

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
            if(thisBrick.getParent() === undefined) { newRootBricks.push(thisBrick) }
        })
        // console.log(newRootBricks);
        this.rootBricks = newRootBricks;
    }

    _attachEventListeners() {
        this.rootHTML.addEventListener("mousedown", (event) => {this._onMouseDown(event)});
        this.rootHTML.addEventListener("mousemove", (event) => {this._onMouseMove(event)});
        this.rootHTML.addEventListener("mouseup", (event) => {this._onMouseUp(event)});
    }

    // Drag start.
    _onMouseDown(event) {
        const cursorPosition = {x: event.pageX, y: event.pageY}
        // Find closest HTML element with the "draggable" class.
        const targetHTML = event.target.closest(".draggable");
        if(targetHTML === null || targetHTML === undefined) { return }
        // Get ID and classes from HTML element.
        const targetID = targetHTML.getAttribute("id");
        // If clicked on element is a logic brick.
        if(this._checkIfBrick(targetHTML)) {
            const targetBrick = this.findBrickByID(targetID);
            this._currentlyDraggingObject = targetBrick;
            this._currentlyDraggingHTML = targetHTML;
            this._cursorOffset = utils.getPositionDiff(utils.getHTMLPosition(targetHTML, true), cursorPosition);
            console.log("Dragging", this._currentlyDraggingObject.getID());
        }
    }

    // During drag.
    _onMouseMove(event) {
        const cursorPosition = {x: event.pageX, y: event.pageY}
        // If something is being dragged.
        if(this._currentlyDraggingObject !== undefined && this._currentlyDraggingHTML !== undefined) {
            // If dragged item is a logic brick, detach parent if exists.
            if(this._checkIfBrick(this._currentlyDraggingHTML) && this._currentlyDraggingObject.getParent() !== undefined) {
                this._currentlyDraggingObject.detachParent();
            }
            const dragToPosition = utils.getPositionDiff(this._cursorOffset, cursorPosition);
            this._currentlyDraggingObject.setPosition(dragToPosition);
            this._currentlyDraggingObject.bringToFront();
        }
    }

    // Drag end.
    _onMouseUp(event) {
        console.log("Dropping", this._currentlyDraggingObject.getID());
        this._currentlyDraggingObject = undefined;
        this._currentlyDraggingHTML = undefined;
        this._cursorOffset = utils.getZeroPosition();
    }

    /**
     * Checks an HTML element to see if it's a logic brick.
     * @param {HTMLElement} target HTML element to check if a brick.
     * @returns {Boolean} True if HTML element is a logic brick.
     */
    _checkIfBrick(target) {
        const targetIsBrick = target.classList.contains("logic-brick");
        return targetIsBrick;
    }
}