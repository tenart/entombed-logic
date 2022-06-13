import Brickyard from "./classes/Brickyard.js";

// Make new brickyard to edit bricks in.
const brickyard = new Brickyard();

const brickA = brickyard.createBrick("or", {x: 100, y: 100});
const brickB = brickyard.createBrick("and", {x: 120, y: 120});
const brickC = brickyard.createBrick("not", {x: 140, y: 140});

const brickD = brickyard.createBrick("or", {x: 160, y: 160});
const brickE = brickyard.createBrick("and", {x: 180, y: 180});
const brickF = brickyard.createBrick("not", {x: 200, y: 200});

const brickG = brickyard.createBrick("or", {x: 220, y: 220});
const brickH = brickyard.createBrick("and", {x: 240, y: 240});
const brickI = brickyard.createBrick("not", {x: 260, y: 260});

const brickJ = brickyard.createBrick("or", {x: 280, y: 280});
const brickK = brickyard.createBrick("and", {x: 300, y: 300});
const brickL = brickyard.createBrick("not", {x: 320, y: 320});
const brickM = brickyard.createBrick("or", {x: 340, y: 340});

const brickO = brickyard.createBrick("not", {x: 340, y: 340});

// Attaching children directly.
brickA.attachChild(brickB, "left");
brickA.attachChild(brickC, "right");

// Attaching parents directly.
brickE.attachParent(brickD, "left");
brickF.attachParent(brickD, "right");

// Attaching bricks through brickyard.
brickyard.attachBricks(brickG, brickH, "left");
brickyard.attachBricks(brickG, brickI, "right");

// Mixing brick attachment methods.
brickJ.attachChild(brickK, "left");
brickL.attachParent(brickJ, "right");
brickyard.attachBricks(brickL, brickM, "left");

// brickJ.detachChild("right");


brickyard.printAllBrickIDs();
brickyard.printRootBrickIDs();


// testBrickD.remove();


