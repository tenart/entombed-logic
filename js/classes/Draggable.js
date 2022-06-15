import KEYWORDS from "../keywords.js";
import utils from "../utils.js";

function validateInput() {

}

/**
 * Implementation of a draggable base element.
 */
export default class Draggable {

    /**
     * Construct a new base draggable object and HTML element.
     * ID, position, and HTML string can be provided to override defaults.
     * @param {String} id ID string to reference this object and HTML element. Defaults to random "draggable-XXX" string.
     * @param {Object} position Position in the form {x: Number, y: Number}. Defaults to {x: 0, y: 0}.
     * @param {String} HTMLString HTML string to render object as. Defaults to yellow div.
     * @returns {Draggable} New instance of a draggable object.
     * @example const newObject = new Draggable("myStringID", {x: 32, y: 32}, "<div id='myStringID'>HTML</div>")
     */
    constructor(id = `${KEYWORDS.OBJECTS.DRAGGABLE}-${utils.newID()}`, position = utils.getZeroPosition(), HTMLString) {
        this.id = id;                                       // This object's unique string identifier. Defaults to random string.
        this.type = KEYWORDS.OBJECTS.DRAGGABLE;  // This object's type identifier. Defaults to "draggable".
        this.HTMLElement = this._createHTML(HTMLString);    // This object's reference to its HTML element.
        this.position = this.setPosition(position);         // This object's internal position in the form {x: Number, y: Number}.
    }

    // GETTERS

    /**
     * Get this object's unique ID string.
     * @returns {String} This object's unique ID string.
     * @example Draggable.getID() // "1xeeeek5zsf09g1uoinutw"
     */
    getID() {
        return this.id;
    }

    /**
     * Get this object's internal position in the form {x: Number, y: Number}.
     * @returns {Object} This object's position.
     * @example Draggable.getPosition() // {x: 32, y: 32}
     */
    getPosition() {
        return this.position;
    }

    /**
     * Get this object's internal reference to its HTML element.
     * @returns {HTMLElement} This object's HTML element.
     * @example Draggable.getHTMLElement() // HTMLElement
     */
    getHTMLElement() {
        return this.HTMLElement;
    }

    /**
     * Get this object's type. Can be overwritten by subclasses.
     * @returns {String} This object's type.
     * @example Draggable.getID() // "draggable"
     */
    getType() {
        return this.type;
    }

    // PUBLIC METHODS

    /**
     * Set the pixel position of this object.
     * @param {Object} position X and Y pixel position in the form of {x: Number, y: Number}.
     * @returns {Object} The new position.
     * @example Draggable.setPosition({x: 64, y: 64}) // {x: 64, y: 64}
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

    /**
     * Bring this HTML element to the front by detaching from parent node and reattaching to container.
     */
    bringToFront() {
        utils.getEditorRoot().appendChild(this.HTMLElement);
    }

    // PRIVATE METHODS

    /**
     * Helper method to generate and append an HTML element associated with this object.
     * @param {String} HTMLString New HTML string to override default HTML template.
     * @returns {HTMLElement} The newly appended HTML element.
     */
    _createHTML(HTMLString) {
        const defaultHTMLString = `
            <div id=${this.id} class="${KEYWORDS.OBJECTS.DRAGGABLE} ${KEYWORDS.OBJECTS.DRAGGABLE}${KEYWORDS.SUFFIXES.DEFAULT}">
                DRAG-ME
            </div>
        `;
        // If no HTML string is provided, generate default string.
        const newHTMLString = HTMLString ? HTMLString : defaultHTMLString;
        // Append HTML string as element to app root and get reference to it.
        utils.getEditorRoot().insertAdjacentHTML("beforeend", newHTMLString);
        const newHTMLElement = document.getElementById(this.id);
        // If cannot find element with given ID for some reason.
        if(newHTMLElement === null) {
            console.warn("Mismatching ID, cannot find", this.id);
            return undefined;
        }
        // Add needed classes and styling if haven't.
        newHTMLElement.classList.add(KEYWORDS.OBJECTS.DRAGGABLE);
        newHTMLElement.style.position = "absolute";
        // Return HTML element.
        return newHTMLElement;
    }

    _getInfo() {
        const info = {
            id: this.id,
            type: this.type,
            position: this.position,
            // HTMLElement: this.HTMLElement
        }
        return info;
    }
}