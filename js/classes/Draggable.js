import utils from "../utils.js";

export default class Draggable {

    /**
     * Construct a new draggable element.
     * @param {String} id A unique string ID, defaults to a random string if not set.
     * @param {Object} position A position object {x: Number, y: Number}. Defaults to {x: 0, y: 0}.
     * @param {String} HTMLString HTML string to represent the new element.
     * @returns {Draggable} A new instance of a draggable element.
     */
    constructor(id = utils.newID(), position = {x: 0, y: 0}, HTMLString = utils.makeHTMLStringFor.defaultDraggable(id)) {
        this.id = id;
        this.HTMLNode = this.createHTMLNode(HTMLString);
        this.position = this.setPosition(position);
        this.cursorOffset = {x: 0, y: 0};
        this.isDragging = false;
    }

    /**
     * Set the pixel position of this draggable element.
     * @param {Object} position X and Y pixel position in the form of {x: Number, y: Number}.
     * @returns {Number} The set position.
     */
    setPosition(position) {
        // Validate position argument.
        if(Number.isNaN(position.x) || Number.isNaN(position.y)) {
            console.warn(this.id, "One or more values is not a number. Defaulting to", {x: 0, y: 0});
            position = {x: 0, y: 0}
        }
        // Update internal position and CSS position.
        this.position = position;
        this.HTMLNode.style.left = `${this.position.x}px`;
        this.HTMLNode.style.top = `${this.position.y}px`;
        // Return position if needed.
        return position;
    }

    getHTMLNode() {
        return this.HTMLNode;
    }

    /**
     * Get this draggable element's unique ID string.
     * @returns {String} The ID as a string.
     */
     getID() {
        return this.id;
    }

    /**
     * Get this draggable element's pixel position.
     * @returns {Object} The position in the form {x: Number, y: Number}.
     */
    getPosition() {
        return this.position;
    }

    createHTMLNode(HTMLString) {
        utils.getBrickyardRoot().insertAdjacentHTML("beforeend", HTMLString);
        return document.getElementById(this.id);
    }

}