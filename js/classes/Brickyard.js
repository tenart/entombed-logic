import utils from "../utils.js";
import LogicBrick from "./LogicBrick.js";

export default class Brickyard {
    constructor() {
        this.rootHTML = utils.getBrickyardRoot();
        this.allBricks = [];
        this.rootBricks = [];
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
     * @returns {Object} The result object {brick: LogicBrick, index: Number}.
     */
    findBrickByID(brickID) {
        for(let i = 0; i < this.allBricks.length; i++) {
            if(this.allBricks[i].getID() === brickID) {
                return {
                    brick: this.allBricks[i], 
                    index: i
                }
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
    }

    _onMouseDown(event) {
        const targetBrickHTML = event.target.closest(".logic-brick");
        if(targetBrickHTML === null || targetBrickHTML === undefined) { return }
        const targetBrickID = targetBrickHTML.getAttribute("id");
        const targetBrick = this.findBrickByID(targetBrickID);
        // console.log(targetBrickHTML);
        console.log("Clicked on", targetBrick.brick);
    }
}