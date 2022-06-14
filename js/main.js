import Editor from "./classes/Editor.js";
import Draggable from "./classes/Draggable.js";

// Make new editor to edit bricks in.
const editor = new Editor();

const brickA = editor.createBrick("or", {x: 100, y: 100});
const brickB = editor.createBrick("and", {x: 120, y: 120});
const brickC = editor.createBrick("not", {x: 140, y: 140});

const brickD = editor.createBrick("or", {x: 160, y: 160});
const brickE = editor.createBrick("and", {x: 180, y: 180});
const brickF = editor.createBrick("not", {x: 200, y: 200});

const brickG = editor.createBrick("or", {x: 220, y: 220});
const brickH = editor.createBrick("and", {x: 240, y: 240});
const brickI = editor.createBrick("not", {x: 260, y: 260});

const brickJ = editor.createBrick("or", {x: 280, y: 280});
const brickK = editor.createBrick("and", {x: 300, y: 300});
const brickL = editor.createBrick("not", {x: 320, y: 320});
const brickM = editor.createBrick("or", {x: 340, y: 340});

const brickO = editor.createBrick("not", {x: 340, y: 340});

// Attaching children directly.
brickA.attachChild(brickB, "left");
brickA.attachChild(brickC, "right");

// Attaching parents directly.
brickE.attachParent(brickD, "left");
brickF.attachParent(brickD, "right");

// Attaching bricks through editor.
editor.attachBricks(brickG, brickH, "left");
editor.attachBricks(brickG, brickI, "right");

// Mixing brick attachment methods.
brickJ.attachChild(brickK, "left");
brickL.attachParent(brickJ, "right");
editor.attachBricks(brickL, brickM, "left");

// brickJ.detachChild("right");





const defaultDraggableA = editor.createBrick();
const defaultDraggableB = editor.createBrick();

// const draggableBrickA = editor.createNewTestBrick("and", {x: 40, y: 200});
// const draggableBrickB = editor.createNewTestBrick("not", {x: 40, y: 220});
// const draggableBrickC = editor.createNewTestBrick("or", {x: 40, y: 240});

// draggableBrickA.attachChild(draggableBrickB, "left");

editor.printAllObjectIDs();
editor.printRootBrickIDs();
// const defaultDraggableB = new DraggableElement(undefined, {x: 10, y: 10}, undefined);

// testBrickD.remove();


