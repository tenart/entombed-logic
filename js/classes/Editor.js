import KEYWORDS from "../keywords.js";
import utils from "../utils.js";
import Draggable from "./Draggable.js";
import LogicOperator from "./LogicOperator.js";

/**
 * Implementation of the Editor class.
 */
export default class Editor {

    /**
     * Construct a new Editor instance. Requires no arguments.
     * @returns {Editor} The created instance.
     * @example new Editor() // Editor
     */
    constructor() {
        // Keep track of all objects in this Editor.
        this.rootHTML = utils.getEditorRoot();
        this.allObjects = [];
        this.rootOperators = [];
        this.availableDropZones = [];
        this.targetDropZone = undefined;
        // For dragging.
        this._draggingObject = undefined;
        this._draggingHTML = undefined;
        this._draggingOffset = utils.getZeroPosition();
        // Attach event listeners.
        this._attachEventListeners();
    }

    // GETTERS

    /**
     * Get all objects in this editor's collection.
     * @returns {Array} Array of all objects.
     * @example Editor.getAllObjects() // [LogicOperator, Draggable, LogicRule]
     */
    getAllObjects() {
        return this.allObjects;
    }

    /**
     * Get all root LogicOperators in this editor.
     * @returns {Array} Array of all root LogicOperators.
     * @example Editor.getRootOperators() // [LogicOperator, LogicOperator]
     */
    getRootOperators() {
        return this.rootOperators;
    }

    // PUBLIC METHODS

    /**
     * Create a new object and add it to this editor's collection.
     * @param {String} objectType What object to create.
     * @param {Object} options New object options.
     * @example 
     * // Creating a default Draggable for testing. No options required.
     * // options.position field optional.
     * Editor.createObject("draggable");
     * @example 
     * // Creating an "and" LogicOperator. 
     * // options.operator field is required. 
     * // options.position field optional.
     * Editor.createObject("logic-operator", {
     *     operator: "and",
     *     position: {
     *         x: 100,
     *         y: 100
     *     }
     * });
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
                // If no/bad options given, use default position (position is the only option you can give a draggable when instantiating).
                if(options === undefined || !utils.validatePosition(options.position)) {
                    options = {
                        position: utils.getZeroPosition()
                    };
                    console.warn("Invalid/missing 'position' option field, using defaults instead:", options);
                }
                break;
            // Creating a new LogicOperator object.
            case KEYWORDS.OBJECTS.LOGIC_OPERATOR:
                if(options === undefined || options.operator === undefined || !utils.getOperatorList().includes(options.operator)) {
                    console.error(`Invalid/missing 'operator' option field for ${KEYWORDS.OBJECTS.LOGIC_OPERATOR}.`);
                    console.warn("Valid values are:", utils.getOperatorList());
                    return;
                }
                if(!utils.validatePosition(options.position)) {
                    options.position = utils.getZeroPosition();
                    console.warn("Invalid/missing 'position' option field, using defaults instead:", options);
                }
                break;
        }
        
        // Actually creating the new object once options have been validated.
        switch(objectType) {
            case KEYWORDS.OBJECTS.LOGIC_OPERATOR:
                // Creating a new LogicOperator object.
                return this._newLogicOperator(options.operator, options.position);
                break;
            case KEYWORDS.OBJECTS.DRAGGABLE:
                // By default, create a placeholder with default ID and default HTML.
                return this._newDefaultDraggable(options.position);
                break;
        }
    }

    /**
     * Attach a parent LogicOperator to a child LogicOperator in a given drop zone. Uses LogicOperator.attachChildren() method.
     * @param {LogicOperator} parent Parent LogicOperator.
     * @param {LogicOperator} child Child LogicOperator.
     * @param {String} dropZone The drop zone to insert child into.
     * @example
     * // Attaching child LogicOperator at parent LogicOperator's right drop zone. All parameters required.
     * Editor.attachLogicOperators(parentOperator, childOperator, "right")
     */
    attachLogicOperators(parent, child, dropZone) {
        if(parent === undefined || !(parent instanceof LogicOperator)) {
            console.error("Invalid parent:", parent);
            return;
        }
        if(child === undefined || !(child instanceof LogicOperator)) {
            console.error("Invalid child:", child);
            return;
        }
        if(child === parent) {
            console.error("Alabama detected. Parent is child.");
            return;
        }
        if(![KEYWORDS.LEFT, KEYWORDS.RIGHT].includes(dropZone)) {
            console.error("Invalid drop zone paramter:", dropZone);
            console.warn("Valid drop zones are:", [KEYWORDS.LEFT, KEYWORDS.RIGHT]);
            return;
        }
        parent.attachChild(child, dropZone);
    }

    /**
     * Detach parent ogicOperator from child LogicOperator. Uses LogicOperator.detachParent() method.
     * @param {LogicOperator} parent Parent LogicOperator.
     * @param {LogicOperator} child Child LogicOperator.
     * @example
     * Editor.attachLogicOperators(parentOperator, childOperator)
     */
    detachLogicOperators(parent, child) {
        if(parent === undefined || !(parent instanceof LogicOperator)) {
            console.error("Invalid parent:", parent);
            return;
        }
        if(child === undefined || !(child instanceof LogicOperator)) {
            console.error("Invalid child:", child);
            return;
        }
        if(child === parent) {
            console.error("Alabama detected. Parent is child.");
            return;
        }
        child.detachParent();
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
     * Print all root LogicOperator IDs and indices.
     */
    printRootOperatorIDs() {
        const total = this.rootOperators.length;
        console.log(`${total} root LogicOperator ${total === 1 ? "ID" : "IDs"}:`);
        this.rootOperators.forEach((logicOperator, index) => {
            console.log(index, logicOperator.getType(), logicOperator.getID());
        });
    }

    /**
     * Find an object by its ID.
     * @param {String} IDString The ID of the object to look for.
     * @returns {Object} The found object. Undefined if not found.
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

    _newDefaultDraggable(position) {
        const newDraggableElement = new Draggable(undefined, position, undefined);
        this._addObjectToCollection(newDraggableElement);
        return newDraggableElement;
    }

    _newLogicOperator(operator, position) {
        const newLogicOperator = new LogicOperator(operator, position, this);
        this._addObjectToCollection(newLogicOperator);
        return newLogicOperator;
    }
    
    _addObjectToCollection(object) {
        this.allObjects.push(object);
        this._onTreeUpdate();
    }

    _isDraggingSomething() {
        if(this._draggingObject !== undefined && this._draggingHTML !== undefined) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Checks an HTML element or JS object to see if it's a LogicOperator.
     * @param {Object} objectOrHTML HTML element or LogicOperator to check if a LogicOperator.
     * @returns {Boolean} True if HTML element is a LogicOperator.
     */
    _isLogicOperator(objectOrHTML) {
        if(objectOrHTML instanceof HTMLElement) {
            const targetIsOperator = objectOrHTML.classList.contains(KEYWORDS.OBJECTS.LOGIC_OPERATOR);
            return targetIsOperator;
        }
        if(objectOrHTML instanceof LogicOperator) {
            return true;
        }
        return false;
    }

    /**
     * This method is exposed to all LogicOperators. A LogicOperator calls this method whenever the tree structure has been updated e.g. when LogicOperators are detached.
     */
    _onTreeUpdate() {
        // Find standalone LogicOperators and track them as roots.
        this._updateRootOperators();
        // Find all unoccupied drop zones and track them as available.
        this._updateAvailableDropZones();

        
    }

    /**
     * Helper method to find and update all root LogicOperators.
     */
    _updateRootOperators() {
        let newRootOperators = [];
        this.allObjects.forEach((object) => {
            // If this LogicOperator has no parent, it is a root operator.
            if(this._isLogicOperator(object) && !object.hasParent()) { 
                newRootOperators.push(object) 
            }
        })
        this.rootOperators = newRootOperators;
    }

    /**
     * Helper method to tag all unoccupied drop zones with the class "available-drop-zone".
     */
    _updateAvailableDropZones() {
        let newAvailableDropZones = [];
        this.allObjects.forEach((object, index) => {
            if(this._isLogicOperator(object)) {
                object.getDropZoneHTML(KEYWORDS.LEFT).classList.remove("closest");
                object.getDropZoneHTML(KEYWORDS.RIGHT).classList.remove("closest");
                object.getDropZoneHTML(KEYWORDS.LEFT).classList.remove(KEYWORDS.AVAILABLE_DROP_ZONE);
                object.getDropZoneHTML(KEYWORDS.RIGHT).classList.remove(KEYWORDS.AVAILABLE_DROP_ZONE);
                if(!object.hasChild(KEYWORDS.LEFT)) {
                    object.getDropZoneHTML(KEYWORDS.LEFT).classList.add(KEYWORDS.AVAILABLE_DROP_ZONE);
                    newAvailableDropZones.push(object.getDropZoneHTML(KEYWORDS.LEFT));
                } else {
                    object.getDropZoneHTML(KEYWORDS.LEFT).classList.remove(KEYWORDS.AVAILABLE_DROP_ZONE);
                }
                if(!object.hasChild(KEYWORDS.RIGHT)) {
                    object.getDropZoneHTML(KEYWORDS.RIGHT).classList.add(KEYWORDS.AVAILABLE_DROP_ZONE);
                    newAvailableDropZones.push(object.getDropZoneHTML(KEYWORDS.RIGHT));
                } else {
                    object.getDropZoneHTML(KEYWORDS.RIGHT).classList.remove(KEYWORDS.AVAILABLE_DROP_ZONE);
                }
            }
        });
        this.availableDropZones = newAvailableDropZones;
    }

    /**
     * Helper method to remove the class "available-drop-zone" from all drop zones within the dragged object.
     */
    _excludeDraggedDropZones() {
        // Select drop zones within dragged objects and remove the available keyword from them.
        const excludedDropZones = document.querySelectorAll(`#${this._draggingObject.getID()} .${KEYWORDS.AVAILABLE_DROP_ZONE}`);
        for(let i = 0; i < excludedDropZones.length; i++) {
            excludedDropZones[i].classList.remove(KEYWORDS.AVAILABLE_DROP_ZONE);
        }
        // Get new list of available drop zones minus excluded ones.
        this.availableDropZones = [];
        const newAvailableDropZones = document.getElementsByClassName(KEYWORDS.AVAILABLE_DROP_ZONE);
        for(let i = 0; i < newAvailableDropZones.length; i++) {
            this.availableDropZones.push(newAvailableDropZones[i]);
        }
    }

    _findNearestDropZone(cursorPosition) {
        this.availableDropZones.forEach((dropZone) => {
            dropZone.classList.remove("closest");
        })

        let zonesWithinReach = [];
        let distances = [];
        for(let i = 0; i < this.availableDropZones.length; i++) {
            const dropZone = this.availableDropZones[i];
            const distanceToCursor = utils.getDistance(cursorPosition, utils.getHTMLCenter(dropZone));
            if(distanceToCursor <= 64) {
                zonesWithinReach.push(dropZone);
                distances.push(distanceToCursor);
            }
        }
        let minDistance = Math.min(...distances);
        const closestDropZone = zonesWithinReach[distances.indexOf(minDistance)];
        if(closestDropZone !== undefined) {
            closestDropZone.classList.add("closest");
            this.targetDropZone = closestDropZone;
        } else {
            this.targetDropZone = undefined;
        }
    }

    _getDropZoneParentOperator(dropZoneHTML) {
        // console.log(dropZoneHTML);
        const operatorID = dropZoneHTML.closest(`.${KEYWORDS.OBJECTS.LOGIC_OPERATOR}`).getAttribute("id");
        const operatorSocketSide = dropZoneHTML.getAttribute("data-socket");
        console.log(operatorID, operatorSocketSide);
        const operator = this.findObjectByID(operatorID);
        return {parent: operator, socket: operatorSocketSide};
    }

    _attachEventListeners() {
        document.addEventListener("mousedown", (event) => {this._onMouseDown(event)});
        document.addEventListener("mousemove", (event) => {this._onMouseMove(event)});
        document.addEventListener("mouseup", (event) => {this._onMouseUp(event)});
    }

    _onMouseDown(event) {
        // Get cursor position at time of mousedown.
        const cursorPosition = {x: event.pageX, y: event.pageY}
        // Find closest HTML element with the "draggable" class.
        const draggableHTML = event.target.closest(`.${KEYWORDS.OBJECTS.DRAGGABLE}`);
        // If Draggable object exists.
        if(draggableHTML !== null) { 
            // Get ID from HTML element and select object from collection.
            const draggableObjectID = draggableHTML.getAttribute("id");
            const draggableObject = this.findObjectByID(draggableObjectID);
            // Set current object as dragging target.
            this._draggingObject = draggableObject;
            this._draggingHTML = draggableHTML;
            this._draggingOffset = utils.getPositionDiff(utils.getHTMLPosition(draggableHTML, true), cursorPosition);
            // Let dragged object knows it's being dragged.
            this._draggingObject.onDragStart();
            
        }
    }

    _onMouseMove(event) {
        // Get cursor's position on move.
        const cursorPosition = {x: event.pageX, y: event.pageY}
        // If something is being dragged.
        if(this._isDraggingSomething()) {

            // If dragged item is a LogicOperator.
            if(this._isLogicOperator(this._draggingObject)) {
                // Detach parent if exists.
                if(this._draggingObject.hasParent()) {
                    console.log("Detaching: ", this._draggingObject._getBasicInfo());
                    this._draggingObject.detachParent();
                }
                // Update available drop zones.
                
                // Exclude drop zones inside dragged LogicOperator.
                
                this._updateAvailableDropZones();
                this._excludeDraggedDropZones();
                this._findNearestDropZone(cursorPosition);
            }

            // General dragging logic for all Draggable objects.
            const dragToPosition = utils.getPositionDiff(this._draggingOffset, cursorPosition);
            this._draggingObject.setPosition(dragToPosition);
            this._draggingObject.bringToFront();
        }
    }

    _onMouseUp(event) {
        const cursorPosition = {x: event.pageX, y: event.pageY}
        // If dragging something.
        if(this._isDraggingSomething()) {
            // Let dragged object knows it's being dropped.
            this._draggingObject.onDragStop();
            // If dragging a LogicOperator.
            if(this._isLogicOperator(this._draggingObject)) {

                // this._updateAvailableDropZones();
                // this._excludeDraggedDropZones();
                // this._findNearestDropZone(cursorPosition);

                // Get drop zone's parent LogicOperator if exists.
                if(this.targetDropZone !== undefined) {
                    const target = this._getDropZoneParentOperator(this.targetDropZone);
                    this.attachLogicOperators(target.parent, this._draggingObject, target.socket);
                }
            }
        }
        this._draggingObject = undefined;
        this._draggingHTML = undefined;
        this._draggingOffset = utils.getZeroPosition();
        this.targetDropZone = undefined;
    }

}