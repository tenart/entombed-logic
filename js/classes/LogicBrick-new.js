import utils from "../utils.js";
import Draggable from "./Draggable.js";

/**
 * Implementation of a logic brick.
 */
export default class LogicBrick extends Draggable {
    // PRIVATE FIELDS
    #HTMLSlots;
    #brickyard;

    /**
     * Construct new logic brick.
     * @param {String} type The type of logic for this brick. Can be "and", "or", or "not".
     * @param {Object} position X and Y pixel position in the form of {x: Number, y: Number}.
     * @param {Object} parent A parent to attach to in the form {brick: LogicBrick, slot: "left" | "right"}. Can be undefined.
     * @param {Object} children Children logic bricks in the form of {left: LogicBrick, right: LogicBrick}. Can be undefined.
     * @param {Brickyard} brickyard The brickyard this brick is a part of.
     * @return {LogicBrick} A new instance of a logic brick.
     */
    constructor(type, position = {x: 0, y: 0}, brickyard) {
        // Generate new ID and HTML to override defaults from super.
        const id = `${type}-${utils.newID()}`.toLowerCase();
        const HTMLString = utils.makeHTMLStringFor.twoSlotBrick(id, type);
        // Construct superclass.
        super(id, position, HTMLString);

        // Logic fields.
        this.type = type.toLowerCase(); // The logic operation this brick will perform.
        this.result = undefined;        // The boolean value this block evaluates to.
        this.parent = undefined;        // The parent logic brick of this brick.
        this.parentSlot = undefined;    // The slot that this brick occupies in the parent brick.
        this.children = {               // The children of this brick.
            left: undefined, 
            right: undefined
        }
        // Capture HTML nodes.
        this.#HTMLSlots = {
            left: document.querySelector(`#${id} .slot-left`),
            right: document.querySelector(`#${id} .slot-right`)
        }
        // Brickyard reference.
        if(brickyard === undefined) {
            console.warn(id, "Missing brickyard reference.");
            return;
        }
        this.#brickyard = brickyard;

        // Attach parent and children if provided.
        // if(parent !== undefined) {
        //     if(parent.brick !== undefined && ["left", "right"].includes(parent.slot)) {
        //         this.attachParent(parent.brick, parent.slot);
        //     }
        // }
        // if(children !== undefined) {
        //     if(children.left !== undefined) { this.attachChild(children.left, "left") }
        //     if(children.right !== undefined) { this.attachChild(children.right, "right") }
        // }
    }

    // GETTERS

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
        // if(this.parent === undefined) { console.log(super.id, "Has no parent.") }
        return this.parent;
    }

    /**
     * Get this logic brick's children.
     * @returns {Object} Children in the form {left: LogicBrick, right: LogicBrick}.
     */
    getChildren() {
        // if(this.logicChildren.left === undefined) { console.log(super.id, "Has no left child.") }
        // if(this.logicChildren.right === undefined) { console.log(super.id, "Has no right child.") }
        return this.children;
    }

    getResult() {
        // if(this.logicResult === undefined) { console.warn(super.id, "Cannot evaluate result.") }
        return this.result;
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
        if(child.getParent() !== undefined && !doubleLinkCall) {
            console.warn(super.id, "Child already has parent.");
            return;
        }
        // Check if slot is already occupied.
        if(this.children[slot] !== undefined && !doubleLinkCall) {
            console.warn(super.id, `Already has child in ${slot} slot.`);
            return;
        }
        // Establish link.
        switch(slot) {
            case "left":
                this.#HTMLSlots.left.appendChild(child.getHTMLNode());
                this.children.left = child;
            break;
            case "right":
                this.#HTMLSlots.right.appendChild(child.getHTMLNode());
                this.children.right = child;
            break;
        }
        // If child does not have parent, attach self as parent.
        if(child.getParent() === undefined && !doubleLinkCall) {
            child.attachParent(this, slot, true);
        }
        // Once double link has been established, update root bricks.
        if(doubleLinkCall) {
            this.#brickyard._updateRootBricks();
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
            console.warn(super.id, "Already has parent.");
            return;   
        }
        // Check if slot in parent is already occupied.
        if(parent.getChildren()[slot] !== undefined && !doubleLinkCall) {
            console.warn(super.id, `Parent already has child in ${slot} slot.`);
            return;
        }
        // Establish link.
        this.parent = parent;
        this.parentSlot = slot;
        // Set child positioning to sit nicely inside parent's HTML.
        super.setPosition({x: 0, y: 0});
        super.getHTMLNode().style.position = "initial";
        // If parent does not have child in this slot, attach self as child.
        if(parent.getChildren()[slot] === undefined && !doubleLinkCall) {
            parent.attachChild(this, slot, true);
        }
        // Once double link has been established, update root bricks.
        if(doubleLinkCall) {
            this.#brickyard._updateRootBricks();
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
            console.warn(super.id, `No child in ${slot} slot to detach.`);
            return;
        }
        // Grab temporary reference to child.
        const tempChild = this.children[slot];
        // Sever self's link to child.
        this.children[slot] = undefined;
        // If child still has link to parent, sever child's link.
        if(tempChild.getParent() !== undefined && !doubleLinkCall) {
            tempChild.detachParent(true);
        }
        // Once double link has been established, update root bricks.
        if(doubleLinkCall) {
            this.#brickyard._updateRootBricks();
        }
    }

    /**
     * Detach this logic brick from parent brick.
     * @param {Boolean} doubleLinkCall Only set to true if this method is called from within its counterpart.
     */
    detachParent(doubleLinkCall) {
        // Check if has parent.
        if(this.parent === undefined && !doubleLinkCall) {
            console.warn(super.id, "No parent to detach.");
            return;
        }
        // Grab temporary reference to parent and slot.
        const tempParent = this.parent;
        const tempParentSlot = this.parentSlot;
        // Sever links to parent.
        this.parent = undefined;
        this.parentSlot = undefined;
        // Reset internal position and HTML position.
        super.getHTMLNode().style.position = "absolute";
        super.setPosition(utils.getHTMLPosition(super.getHTMLNode()));
        // Detach own HTML from parent HTML.
        this.bringToFront();
        // If parent still has link to self, sever parent's link.
        if(tempParent.getChildren()[tempParentSlot] !== undefined && !doubleLinkCall) {
            tempParent.detachChild(tempParentSlot, true);
        }
        // Once double link has been established, update root bricks.
        if(doubleLinkCall) {
            this.#brickyard._updateRootBricks();
        }
    }

    /**
     * Bring this HTML element to the front by detaching from parent node and reattaching to container.
     */
    bringToFront() {
        utils.getBrickyardRoot().appendChild(super.getHTMLNode());
    }

    /**
     * Remove this brick and all its children. Also severs link to parent.
     */
    remove() {
        // Detach from parent if exists.
        if(this.parent !== undefined) {
            this.detachParent();
        }
        super.getHTMLNode().remove();
    }

    // PRIVATE METHODS

    /**
     * Helper function to attach event listeners to this HTML element.
     * Should NOT be called directly. 
     */
    _attachEventListeners() {
        // _dragging handler is attached to document since cursor may leave
        // brick's bounding box when cursor is moved quickly.
        super.getHTMLNode().addEventListener("mousedown", (event) => {this._dragStart(event)});
        document.addEventListener("mousemove", (event) => {this._dragging(event)});
        super.getHTMLNode().addEventListener("mouseup", (event) => {this._dragStop(event)});
    }

    /**
     * Helper handler for starting drag.
     * Should NOT be called directly. 
     */
    _dragStart(event) {
        // console.log(`Dragging #${super.id}`);

        // Get cursor's offset at moment of mouse down and set isDragging flag to true.

        const myPosition = utils.getHTMLPosition(super.getHTMLNode());
        const cursorPosition = {x: event.clientX, y: event.clientY}
        this._cursorOffset = utils.getPositionDiff(myPosition, cursorPosition);
        


        // If self is a child, detach from parent and prevent parents from being dragged

        if(this.parent !== undefined) {
            this.detachParent();
            this.bringToFront();
            super.setPosition(myPosition);
            this._isDragging = true;
            super.getHTMLNode().classList.add("active");
        }





        // Bring HTML element to front when drag starts.

        
    }

    /**
     * Helper handler when being dragged.
     * Should NOT be called directly. 
     */
    _dragging(event) {
        // Set brick's position to cursor minus offset.
        if(this._isDragging) {
            const cursorPosition = {x: event.clientX, y: event.clientY}
            const newPosition = utils.getPositionDiff(this._cursorOffset, cursorPosition);
            super.setPosition(newPosition);
        }
    }

    /**
     * Helper handler for stopping drag.
     * Should NOT be called directly. 
     */
    _dragStop() {
        console.log(super.id, "Dragging stopped.");
        // Reset cursor's offset and set isDragging flag to false.
        this._isDragging = false;
        this._cursorOffset = undefined;
        super.getHTMLNode().classList.remove("active");
    }
}