import KEYWORDS from "../keywords.js";
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
        this.rootOperators = [];
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
     * Get all root logic-operators in this editor.
     * @returns {Array} Array of all root logic-operators.
     */
    getRootOperators() {
        return this.rootOperators;
    }

    // SENSORS

    /**
     * Checks if something is targeted for dragging.
     * @returns {Boolean} True / false.
     */
    _isDraggingSomething() {
        if(this._draggingObject !== undefined && this._draggingHTML !== undefined) {
            return true;
        } else {
            return false;
        }
    }

    // PUBLIC METHODS

    /**
     * Create a new object and add it to this editor's collection.
     * @param {String} objectType What object to create.
     * @param {Object} options Object options.
     */
    createObject(objectType, options) {

        // Check to see if object type string is valid.
        if(!utils.getObjectTypeList().includes(objectType)) {
            console.error("Invalid object type:", objectType);
            console.warn("Valid types are:", utils.getObjectTypeList());
            return;
        }

        // Check to see if options are valid.
        switch(objectType) {
            // Creating a new default draggable object.
            case KEYWORDS.OBJECTS.DRAGGABLE:
                const defaultDraggableOptions = {
                    position: utils.getZeroPosition()
                }
                // If no/bad options given, use default position (position is the only option you can give a draggable when instantiating).
                if(options === undefined || !utils.validatePosition(options.position)) {
                    options = {
                        position: utils.getZeroPosition()
                    };
                    console.warn("Invalid/missing 'position' option, using defaults instead:", options);
                }
                break;
            // Creating a new logic-operator object.
            case KEYWORDS.OBJECTS.LOGIC_OPERATOR:
                if(options === undefined || options.operator === undefined || !utils.getOperatorList().includes(options.operator)) {
                    console.error(`Invalid/missing 'operator' option field for ${KEYWORDS.OBJECTS.LOGIC_OPERATOR}.`);
                    console.warn("Valid values are:", utils.getOperatorList());
                    return;
                }
                if(!utils.validatePosition(options.position)) {
                    options.position = utils.getZeroPosition();
                    console.warn("Invalid/missing 'position' option, using defaults instead:", options);
                }
                break;
        }
        
        // Actually creating the new object once options have been validated.
        switch(objectType) {
            case KEYWORDS.OBJECTS.LOGIC_OPERATOR:
                // Creating a new logic-operator object.
                return this._createLogicOperator(options.operator, options.position);
                break;
            case KEYWORDS.OBJECTS.DRAGGABLE:
                // By default, create a placeholder.
                return this._createDefaultDraggable(undefined, options.position, undefined);
                break;
        }
    }

    /**
     * Attach a child logic-operator to a parent logic-operator at a given slot.
     * @param {NewLogicBrick} parent Parent logic-operator to contain child.
     * @param {NewLogicBrick} child Child logic-operator to attach to parent.
     * @param {String} slot The parent slot to insert child into.
     */
    attachLogicOperators(parent, child, slot) {
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
     * Print all root logic-operator IDs and indices.
     */
    printRootOperatorIDs() {
        const total = this.rootOperators.length;
        console.log(`${total} root logic-operators ${total === 1 ? "ID" : "IDs"}:`);
        this.rootOperators.forEach((brick, index) => {
            console.log(index, brick.getType(), brick.getID());
        });
    }

    /**
     * Find an object by its ID.
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
     * Create a new default draggable object and add it to this editor's collection. Use undefined for default settings. Mostly used for testing.
     * @param {String} id ID string to reference this object and HTML element.
     * @param {Object} position Position in the form {x: Number, y: Number}.
     * @param {String} HTMLString HTML string to render object as.
     * @returns {Draggable} A new default draggable object
     */
     _createDefaultDraggable(id, position, HTMLString) {
        const newDraggableElement = new Draggable(id, position, HTMLString);
        this._addObjectToCollection(newDraggableElement);
        return newDraggableElement;
    }

    _createLogicOperator(operator, position) {
        const newLogicOperator = new NewLogicBrick(operator, position, this);
        this._addObjectToCollection(newLogicOperator);
        return newLogicOperator;
    }
    
    _addObjectToCollection(object) {
        this.allObjects.push(object);
        this._updateRootBricks();
    }

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
        this.rootOperators = newRootBricks;
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
        const draggableHTML = event.target.closest(`.${KEYWORDS.OBJECTS.DRAGGABLE}`);
        if(draggableHTML === null) { return }
        // Get ID and classes from HTML element.
        const draggableID = draggableHTML.getAttribute("id");
        // console.log("Clicked on", draggableID);
        // Set draggable element as target and get position offset.
        const draggableObject = this.findObjectByID(draggableID);
        console.log(draggableObject._getInfo());
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
                console.log("Detaching: ", this._draggingObject._getInfo());
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
            const targetIsBrick = target.classList.contains(KEYWORDS.OBJECTS.LOGIC_OPERATOR);
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

}