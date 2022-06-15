/**
 * Index of hardcoded strings for reference.
 */
const KEYWORDS = {
    /**
     * All objects have one of the following types/classes. This is returned when calling getType().
     */
    OBJECTS: {
        DRAGGABLE: "draggable",                 // A default draggable object will have this type. All draggable elements have this class.
        LOGIC_OPERATOR: "logic-operator",       // All logic-operator objects will have this type.
        LOGIC_RULE: "logic-rule"                // All logic-rule objects will have this type.
    },
    /**
     * Logic-operator types. A logic-operator object can have one of the following types/classes.
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
        DEFAULT: "-default",            // A default draggable object with have "draggable-default" as a class.
        OPERATOR: "-operator",          // An "and" logic-operator object with have "and-operator" as a class.
        RULE: "-rule"                   // An "if" logic-rule object will have "if-rule" as a class.
    },
    DROP_SLOT: "drop-slot",
    LEFT: "left",
    RIGHT: "right"
}

export default KEYWORDS;