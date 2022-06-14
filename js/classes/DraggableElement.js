import utils from "../utils.js";

/**
 * Implementation of a draggable base element.
 */
export default class DraggableElement {

    /**
     * Construct a new draggable element.
     * @param {String} id ID string to reference this object and HTML element. Defaults to random string.
     * @param {Object} position Position in the form {x: Number, y: Number}. Defaults to {x: 0, y: 0}.
     * @param {String} HTMLString HTML string to override default HTML. Can be undefined.
     * @returns {DraggableElement} New instance of a draggable element.
     */
    constructor(id = `draggable-${utils.newID()}`, position = utils.getZeroPosition(), HTMLString) {
        this.id = id;
        this.HTMLElement = this._createHTML(HTMLString);
        this.position = this.setPosition(position);
    }

    // GETTERS

    getID() {
        return this.id;
    }

    getPosition() {
        return this.position;
    }

    getHTMLElement() {
        return this.HTMLElement;
    }

    // SETTERS

    /**
     * Set the pixel position of this draggable element.
     * @param {Object} position X and Y pixel position in the form of {x: Number, y: Number}.
     * @returns {Object} The set position.
     */
     setPosition(position) {
        // Validate position argument.
        if(Number.isNaN(position.x) || Number.isNaN(position.y)) {
            console.warn(this.id, "One or more values is not a number. Defaulting to", utils.getZeroPosition());
            position = utils.getZeroPosition();
        }
        // Update internal position and CSS position.
        this.position = position;
        this.HTMLElement.style.left = `${this.position.x}px`;
        this.HTMLElement.style.top = `${this.position.y}px`;
        // Return position if needed.
        return position;
    }

    // PRIVATE METHODS

    /**
     * Generate HTML string for default element. Does not append new element to document.
     * @returns {String} The default HTML string.
     */
    _makeDefaultHTMLString() {
        const defaultHTMLString = `
            <div id=${this.id} class="draggable draggable-default">
                DRAG-ME
            </div>
        `;
        return defaultHTMLString;
    }

    _createHTML(HTMLString) {
        // If no HTML string is provided, generate default string.
        const newHTMLString = HTMLString ? HTMLString : this._makeDefaultHTMLString();
        // Append HTML string as element to app root and get reference to it.
        utils.getBrickyardRoot().insertAdjacentHTML("beforeend", newHTMLString);
        const newHTMLElement = document.getElementById(this.id);
        if(newHTMLElement === null) {
            console.warn("Mismatching ID, cannot find", this.id);
            return undefined;
        }
        newHTMLElement.classList.add("draggable");
        newHTMLElement.style.position = "absolute";
        // Return HTML element.
        return newHTMLElement;
    }
}