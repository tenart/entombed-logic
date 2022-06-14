const utils = {
    /**
     * Defines string logic types for consistency.
     */
    logicTypes: {
        AND: "and",
        OR: "or",
        NOT: "not"
    },
    objectTypes: [
        "logic-brick"
    ],
    /**
     * Generate a new unique string ID. By chaitanyabd on GitHub.
     * https://gist.github.com/gordonbrander/2230317?permalink_comment_id=3443509#gistcomment-3443509
     * @return {String} A unique string.
     */
    newID: () => {
        return (performance.now().toString(36)+Math.random().toString(36)).replace(/\./g,"");
    },
    getEditorRoot: () => {
        return document.getElementById("editor-root");
    },
    /**
     * Calculate the difference of position B minus position A.
     * @param {Object} positionA Position A in the form of {x: Number, y: Number}.
     * @param {Object} positionB Position B in the form of {x: Number, y: Number}.
     * @returns {Object} The difference between positions A and B.
     */
    getPositionDiff: (positionA, positionB) => {
        return {
            x: positionB.x - positionA.x,
            y: positionB.y - positionA.y,
        }
    },
    /**
     * Get the position of an HTML element relative to the whole document.
     * @param {HTMLElement} htmlNode The HTML element to get the position of.
     * @param {Boolean} round Whether or not to round the result. Defaults to false.
     * @returns {Object} The position in the form {x: Number, y: Number}.
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
     */
    getZeroPosition: () => {
        return {x: 0, y: 0}
    }
}

export default utils;