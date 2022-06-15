import Editor from "./classes/Editor.js";

// Make new editor to edit bricks in.
const editor = new Editor();

const brickA = editor.createObject("logic-operator", {
    operator: "or", 
    position: {x: 100, y: 100}
});
const brickB = editor.createObject("logic-operator", {
    operator: "and", 
    position: {x: 120, y: 120}
});
const brickC = editor.createObject("logic-operator", {
    operator: "not", 
    position: {x: 140, y: 140}
});

const brickD = editor.createObject("logic-operator", {
    operator: "or", 
    position: {x: 160, y: 160}
});
const brickE = editor.createObject("logic-operator", {
    operator: "and", 
    position: {x: 180, y: 180}
});
const brickF = editor.createObject("logic-operator", {
    operator: "not", 
    position: {x: 200, y: 200}
});

const brickG = editor.createObject("logic-operator", {
    operator: "or", 
    position: {x: 220, y: 220}
});
const brickH = editor.createObject("logic-operator", {
    operator: "and", 
    position: {x: 240, y: 240}
});
const brickI = editor.createObject("logic-operator", {
    operator: "not", 
    position: {x: 260, y: 260}
});

const brickJ = editor.createObject("logic-operator", {
    operator: "or", 
    position: {x: 280, y: 280}
});
const brickK = editor.createObject("logic-operator", {
    operator: "and", 
    position: {x: 300, y: 300}
});
const brickL = editor.createObject("logic-operator", {
    operator: "not", 
    position: {x: 320, y: 320}
});
const brickM = editor.createObject("logic-operator", {
    operator: "or", 
    position: {x: 340, y: 340}
});

const brickO = editor.createObject("logic-operator", {
    operator: "not", 
    position: {x: 340, y: 340}
});

// Attaching children directly.
editor.attachLogicOperators(brickA, brickB, "left");
editor.attachLogicOperators(brickA, brickC, "right");
editor.attachLogicOperators(brickD, brickE, "left");
editor.attachLogicOperators(brickD, brickF, "right");
editor.attachLogicOperators(brickG, brickH, "left");
editor.attachLogicOperators(brickG, brickI, "right");
editor.attachLogicOperators(brickJ, brickK, "left");
editor.attachLogicOperators(brickJ, brickL, "right");
editor.attachLogicOperators(brickL, brickM, "left");