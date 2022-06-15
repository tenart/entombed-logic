/**
 * Index of hardcoded strings for reference.
 */
const KEYWORDS = {
    /**
     * All objects have one of the following types/classes. This is returned when calling getType().
     */
    OBJECTS: {
        DRAGGABLE: "draggable",                 // A default draggable object will have this type. All draggable elements have ".draggable" class.
        LOGIC_OPERATOR: "logic-operator",       // All LogicOperator objects will have this type. All LogicOperator elements have ".logic-operator" class.
        LOGIC_RULE: "logic-rule"                // All LogicRule objects will have this type. All LogicRule elements have ".logic-orule" class.
    },
    /**
     * LogicOperator types. A LogicOperator object can have one of the following types/classes.
     */
    OPERATORS: {
        AND: "and",                     
        OR: "or",
        NOT: "not"
    },
    /**
     * Suffixes to specify object subtypes.
     */
    SUFFIXES: {
        DEFAULT: "-default",            // A default draggable object with have ".draggable-default" as a class.
        OPERATOR: "-operator",          // An "and" LogicOperator object with have ".and-operator" as a class.
        RULE: "-rule"                   // An "if" LogicRule object will have ".if-rule" as a class.
    },
    DROP_ZONE: "drop-zone",             // All drop zones will have the class ".drop-zone".
    AVAILABLE_DROP_ZONE: "available-drop-zone",
    TARGET_DROP_ZONE: "target-drop-zone",
    LEFT: "left",
    RIGHT: "right",
    EDITOR_ROOT_ID: "editor-root",      // The root element ID of the editor.
    DRAG_ACTIVE: "drag-active"
}

export default KEYWORDS;