import KEYWORDS from "./keywords.js";

/**
 * Common shared utility methods.
 */
const utils = {
    /**
     * Generate a new unique string ID. By chaitanyabd on GitHub.
     * https://gist.github.com/gordonbrander/2230317?permalink_comment_id=3443509#gistcomment-3443509
     * @return {String} A unique string.
     * @example utils.newID() // "1xeeeek5zsf09g1uoinutw"
     */
    newID: () => {
        return (performance.now().toString(36)+Math.random().toString(36)).replace(/\./g,"");
    },
    /**
     * Get the editor's primary HTML container.
     * @returns {HTMLElement} The editor's HTML element.
     * @example utils.getEditorRoot() // HTMLElement
     */
    getEditorRoot: () => {
        return document.getElementById("editor-root");
    },
    /**
     * Calculate the difference of position B minus position A.
     * @param {Object} positionA Position A in the form of {x: Number, y: Number}.
     * @param {Object} positionB Position B in the form of {x: Number, y: Number}.
     * @returns {Object} The difference between positions A and B.
     * @example utils.getPositionDiff({x: 2, y: 4}, {x: 5, y: 10}) // {x: 3, y: 6}
     */
    getPositionDiff: (positionA, positionB) => {
        return {
            x: positionB.x - positionA.x,
            y: positionB.y - positionA.y,
        }
    },
    getDistance: (positionA, positionB) => {
        const x = positionB.x - positionA.x;
        const y = positionB.y - positionA.y;
        const distance = Math.sqrt(x * x + y * y);
        return distance;
    },
    getHTMLSize: (HTMLElement) => {
        const size = {
            x: HTMLElement.offsetWidth,
            y: HTMLElement.offsetHeight
        }
        return size;
    },
    getHTMLCenter: (HTMLElement) => {
        const size = {
            x: HTMLElement.offsetWidth,
            y: HTMLElement.offsetHeight
        }
        const position = {
            x: Math.round(HTMLElement.getBoundingClientRect().left),
            y: Math.round(HTMLElement.getBoundingClientRect().top)
        }
        const center = {
            x: position.x + (size.x / 2),
            y: position.y + (size.y / 2),
        }
        return center;
    },
    /**
     * Get the position of an HTML element relative to the whole document.
     * @param {HTMLElement} htmlNode The HTML element to get the position of.
     * @param {Boolean} round Whether or not to round the result. Defaults to false.
     * @returns {Object} The position in the form {x: Number, y: Number}.
     * @example utils.getHTMLPosition(HTMLElement) // {x: 32.64, y: 32.64}
     * @example utils.getHTMLPosition(HTMLElement, true) // {x: 33, y: 33}
     */
    getHTMLPosition: (htmlNode, round = false) => {
        const elementBounds = htmlNode.getBoundingClientRect();
        const position = {
            x: elementBounds.left, 
            y: elementBounds.top
        }
        const roundedPosition = {
            x: Math.round(position.x),
            y: Math.round(position.y)
        }
        if(round) {
            return roundedPosition;
        } else {
            return position;
        }
    },
    /**
     * Get a zero position object for convenience.
     * @returns {Object} {x: 0, y: 0}.
     * @example utils.getZeroPosition() // {x: 0, y: 0}
     */
    getZeroPosition: () => {
        return {x: 0, y: 0}
    },
    /**
     * Check a string to see if it's a valid object type.
     * @param {String} typeInQuestion The string type to validate.
     * @returns 
     */
    validateObjectType: (typeInQuestion) => {
        const allTypes = [];
        for(const [key, value] of Object.entries(KEYWORDS.OBJECTS)) {
            allTypes.push(value);
        }
        console.log(allTypes);
        if(allTypes.includes(typeInQuestion)) {
            return true;
        } else {
            return false;
        }
    },

    validatePosition: (position) => {
        if(position === undefined) {
            return false;
        }
        if(position.x === undefined || position.y === undefined) {
            return false;
        }
        return true;
    },

    getObjectTypeList: () => {
        const allTypes = [];
        for(const [key, value] of Object.entries(KEYWORDS.OBJECTS)) {
            allTypes.push(value);
        }
        return allTypes;
    },

    getOperatorList: () => {
        const allOperators = [];
        for(const [key, value] of Object.entries(KEYWORDS.OPERATORS)) {
            allOperators.push(value);
        }
        return allOperators;
    }

}

export default utils;