const utils = {
    /**
     * Defines string logic types for consistency.
     */
    logicTypes: {
        AND: "and",
        OR: "or",
        NOT: "not"
    },
    /**
     * Generate a new unique string ID. By chaitanyabd on GitHub.
     * https://gist.github.com/gordonbrander/2230317?permalink_comment_id=3443509#gistcomment-3443509
     * @return {String} A unique string.
     */
    newID: () => {
        return (performance.now().toString(36)+Math.random().toString(36)).replace(/\./g,"");
    },
    getBrickyardRoot: () => {
        return document.getElementById("brickyard-root");
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
     * @returns {Object} The position in the form {x: Number, y: Number}.
     */
    getHTMLPosition: (htmlNode) => {
        const elementBounds = htmlNode.getBoundingClientRect();
        return {x: elementBounds.left, y: elementBounds.top}
    },
    // UN-USED FOR NOW
    makeHTMLStringFor: {
        twoSlotBrick: (id, type) => {
            return `
                <div id="${id}" class="draggable-element logic-brick ${type}-brick">
                    <div class="drop-slot slot-left"></div>
                    <p class="label">${type.toUpperCase()}</p>
                    <div class="drop-slot slot-right"></div>
                </div>
            `
        },
        defaultDraggable: (id) => {
            return `
                <div id="${id}" class="draggable-element draggable-default">
                    DRAG ME
                </div>
            `;
        }
    }
}

export default utils;