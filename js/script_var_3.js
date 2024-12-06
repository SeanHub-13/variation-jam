/**
 * Variation Jam - Don't Resist: MKGoosetra
 * Sean Verba
 * 
 * A game where humanity has lost to the geese and you are brainwashed forever
 * 
 * Control's:
 * - Mouse to adjust aim
 * - Left click to fire
 * - Space to attempt to free yourself
 * Uses:
 * p5.js
 * https://p5js.org
 * SAM - Software Automatic Mouth Javascript port
 * https://github.com/discordier/sam
 */

"use strict";

//Next few variables are all undefined image variables in preperation for the preload function
let targetImage = undefined;
let jamImage = undefined;
let buttonImage = undefined;
let buttonPressedImage = undefined;
let spoonImage = undefined;
let gooseUpImage = undefined;
let gooseDownImage = undefined;
let endGooseImage = undefined;
let titleFont = undefined;
let paintSound = undefined;
let explosionSound = undefined;
let gunSound = undefined;
let gooseSound = undefined;
let tingSound = undefined;

//Variables for the grassFront function
let grassFront = {
    x: 0,
    y: 650,
    width: 800,
    height: 150,
    fill: {
        r: 110,
        g: 225,
        b: 160
    }
}

//Variables for the grassBack function
let grassBack = {
    x: 0,
    y: 550,
    width: 800,
    height: 150,
    fill: {
        r: 210,
        g: 225,
        b: 160
    }
}

//Variables for both the drawPlayButton function as well as the drawPressedPlayButton function
let playButton = {
    width: 192,
    height: 72
}

//Variables for the drawRifle function
let rifle = {
    width: 260,
    height: 300
}

//Variables related to the "Art Jam" enemy
let artJam = {
    width: 120,
    height: 168,
    jamRange: undefined
}

//Variables for the evil end goose's size
let endGoose = {
    width: 720,
    height: 324
}

//Holds all information the enemy functions might need
let enemyInfo = {
    //Array holding 2 enemy choices
    enemy: [1, 2],
    //Boolean variable for whether enemyOne is on
    enemyOneBool: false,
    //Boolean variable for whether enemyTwo is on
    enemyTwoBool: false,
    //Variable that later becomes a randomized choice between the two enemies
    enemyJump: undefined,
    //Variable that tells enemies what height to appear at
    artJamRow: 120,
    //Time variable that later defines when enemies spawn
    time: 0
}

//Holds all information the goose functions might need
let gooseInfo = {
    x: 0,
    y: 0,
    width: 120,
    height: 100,
    //The variable that allows for the flapping wings of the goose
    gooseChangingImage: undefined,
    //Is the goose alive right now?
    alive: false,
    //Variable for deciding on whether the goose should be made alive right now
    gooseDecision: undefined,
    //Time variable that later defines when geese spawn
    time: 0
}

//Boolean for whether the user has their mouse down
let hasClicked = false;

//Represents an instance of sam
let sam = null;

//All the info for brainwashing functions
let brainwashingInfo = {
    textX: null,
    textY: null,
    showText: false,
    duckGotThrough: false,
    spacebarPressed: false,
    pickDuckBrainwashing: null,
    pickSpacebarBrainwashing: null
}

//Variable holding the score
let score = 0;

//State variable, currently set to titlescreen on launch
let state = "titlescreen";

let config;
let brainwashing;

/** ----------------------------------------------------------------------------------------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------------------------------- */

//A function that preloads all the assets used
function preload() {
    //Variables are getting image data
    targetImage = loadImage('assets/images/Target.png');
    jamImage = loadImage('assets/images/Art_Jam_Ultra.png');
    buttonImage = loadImage('assets/images/Art_Jam_Button_1.png');
    buttonPressedImage = loadImage('assets/images/Art_Jam_Button_2.png');
    spoonImage = loadImage('assets/images/Art_Jam_Spoon.png');
    gooseUpImage = loadImage('assets/images/Duck_1.png');
    gooseDownImage = loadImage('assets/images/Duck_2.png');
    endGooseImage = loadImage('assets/images/End_Goose.png');
    titleFont = loadFont('assets/fonts/PressStart2P-Regular.ttf');
    paintSound = loadSound('assets/sounds/paint.mp3');
    explosionSound = loadSound('assets/sounds/explode.mp3');
    gunSound = loadSound('assets/sounds/gun.mp3');
    gooseSound = loadSound('assets/sounds/goose.m4a');
    tingSound = loadSound('assets/sounds/ting.m4a');
    config = loadJSON('js/config.json');
    brainwashing = loadJSON('js/brainwashing.json');
}

//Setup runs code on start-up
function setup() {
    //Creates canvas
    createCanvas(800, 800);
    //Aligns text to the center
    textAlign(CENTER, CENTER);
    //Changes font to the title font
    textFont(titleFont);
    //Makes text white
    fill("white");
    sam = new SamJs(config.saMK);
    gooseInfo.gooseChangingImage = gooseUpImage;
    //Sets an interval that triggers all one second interval dependant things
    setInterval(oneSecondIntervals, 1000);
    //Sets an interval for every 0.25 of a second that makes the goose flap its wings
    setInterval(changeGoose, 250);
}

//Draw runs code every frame
function draw() {
    //Calls the drawBackdrop function
    drawBackdrop();
    //Cursor image didn't fully work with the preload function, seems thats because its a p5 thing maybe?
    //Makes player cursor into a target
    cursor("assets/images/Target_Peace.png", 16, 16);
    isMousePressed();
    //Checks what state the game is supposed to be in and changes it
    if (state === "titlescreen") {
        titleScreen();
    }
    else if (state === "game") {
        game();
    }
    else if (state === "end") {
        end();
    }
}

//On key press
function keyPressed() {
    if (keyCode === 32) {
        //Sets show text to true, activating brainwashing function
        brainwashingInfo.showText = true;
        //Sets the brainwashing to use the spacebar array of choices
        brainwashingInfo.spacebarPressed = true;
        //Sam is turned to the dark side
        sam.speak("Do not resist.");
    }
}

/** ----------------------------------------------------------------------------------------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------------------------------- */

//Draws a backround when called
function drawBackdrop() {
    background(255, 150, 150)
}

//Draws the grass rectangle in the back when called
function drawBackGrass() {
    //Draws back grass based on stored variables
    push();
    noStroke();
    fill(grassBack.fill.r, grassBack.fill.g, grassBack.fill.b)
    rect(grassBack.x, grassBack.y, grassBack.width, grassBack.height)
    pop();
}

//Draws the grass rectangle in the front when called
function drawFrontGrass() {
    //Draws front grass based on stored variables
    push();
    noStroke();
    fill(grassFront.fill.r, grassFront.fill.g, grassFront.fill.b)
    rect(grassFront.x, grassFront.y, grassFront.width, grassFront.height)
    pop();
}

//Draws the evil mean goose that appears after the game ends
function drawEndGoose() {
    image(endGooseImage, 0, height - endGoose.height, endGoose.width, endGoose.height);
}

//Draws the centered title text when called
function titleScreenText() {
    //Changes all text settings to preferred settings for a title, then draws the text based on canvas sizes
    push();
    fill("#ffffff");
    textSize(config.textSizeMultiplier * 38);
    text(".MKGoosetra.", width / 2, height / 3 + 60);
    text("Don't Resist", width / 2, height / 3);
    pop();
}

//Draws the explanation of the game when called
function gameExplainText() {
    //Changes all text settings to preferred settings for an explanation, then draws the text based on canvas sizes
    push();
    fill("#ffffff");
    textSize(config.textSizeMultiplier * 12);
    text("You can't fight this.", width / 2, height - 325);
    text("These ducks are cute and friendly.", width / 2, height - 300);
    text("Let's let them through and take our medicine.", width / 2, height - 275);
    text("We know what’s best.", width / 2, height - 250);
    pop();
}

//Draws the text that displays player score when called
function scoreText() {
    //Changes all text settings to preferred settings for a scoreboard, then draws the text based on canvas sizes
    push();
    fill("#ffffff");
    textSize(config.textSizeMultiplier * 24);
    text("Score: " + score, width / 2, height / 3);
    pop();
}

//Draws the end text when called
function endText() {
    //Changes all text settings to preferred settings for a finishing message, then draws the text based on canvas sizes
    push();
    fill("#ffffff");
    textSize(config.textSizeMultiplier * 24);
    text("Don't. Touch. The. Ducks.", width / 2, height / 4);
    pop();
}

//This function is called in draw() so that if showText is ever true it triggers
function drawRandomBrainwashing() {
    //If showText is true and a duck got through
    if (brainwashingInfo.showText === true && brainwashingInfo.duckGotThrough === true) {
        randomBrainwashing();
        push();
        fill(255);
        textSize(24);
        text(brainwashingInfo.pickDuckBrainwashing, brainwashingInfo.textX, brainwashingInfo.textY);
        pop();
    }
    //If showText is true and the player pressed space
    else if (brainwashingInfo.showText === true && brainwashingInfo.spacebarPressed === true) {
        randomBrainwashing();
        push();
        fill(255);
        textSize(24);
        text(brainwashingInfo.pickSpacebarBrainwashing, brainwashingInfo.textX, brainwashingInfo.textY);
        pop();
    }
}

//The main brainwashing function, only activated by the one in draw when a "brainwash" is needed
function randomBrainwashing() {
    //Picks random quotes from the json files duck missing section
    brainwashingInfo.pickDuckBrainwashing = random(brainwashing.ducksMissed);
    //Picks random quotes from the json files spacebar section
    brainwashingInfo.pickSpacebarBrainwashing = random(brainwashing.spacebarTriggered);
    //Gets random X positions for the text while giving it a small border
    brainwashingInfo.textX = random(30, width - 30);
    //Gets random Y positions for the text while giving it a small border
    brainwashingInfo.textY = random(30, height - 30);
    //Timeout that resets every boolean that messes with the brainwashing
    setTimeout(() => { brainwashingInfo.showText = false, brainwashingInfo.duckGotThrough = false, brainwashingInfo.spacebarPressed = false }, 3000);
}

//Draws a rifle on the right end of the screen when called
function drawRifle() {
    // Maps position of mouse from normal height to half the normal height
    let rifleRange = map(mouseY, 0, height, 0, height / 4);
    let rifleImageHeight = rifleRange + height - rifle.height - 50;
    //Won't let the rifle go above this value since that the end of the rifle image
    if (rifleImageHeight < 500) {
        rifleImageHeight = 500;
    }
    image(spoonImage, width - rifle.width, rifleImageHeight, rifle.width, rifle.height);
}

function isMousePressed() {
    if (mouseIsPressed) {
        if (hasClicked === false) {
            hasClicked = true;
            shootHandler();
        }
    }
    else {
        hasClicked = false;
    }
}

function shootHandler() {
    if (state === "game") {

        //Checks if mouse is over the goose
        if ((mouseX > gooseInfo.x - gooseInfo.width) &&
            (mouseX < gooseInfo.x) &&
            (mouseY > gooseInfo.y) &&
            (mouseY < gooseInfo.y + gooseInfo.height)) {
            gooseInfo.alive = false;
            gooseInfo.x = 0;
            sam.speak("Give, in.")
            //Just changing the state to end here
            state = "end";
        }
        //Checks if mouse is over the jam
        else if ((mouseX > width / 3 - artJam.width) &&
            (mouseX < width / 3) &&
            (mouseY > height - artJam.height - enemyInfo.artJamRow + artJam.jamRange) &&
            (mouseY < height - grassFront.height) &&
            enemyInfo.enemyOneBool === true) {
            //Turns off the enemy
            enemyInfo.enemyOneBool = false;
            //Adds 1 to the score
            score++;
            tingSound.setVolume(0.15);
            tingSound.play();
        }
        else if ((mouseX > width / 3 + width / 2 - artJam.width) &&
            (mouseX < width / 3 + width / 2) &&
            (mouseY > height - artJam.height - enemyInfo.artJamRow + artJam.jamRange) &&
            (mouseY < height - grassFront.height) &&
            enemyInfo.enemyTwoBool === true) {
            enemyInfo.enemyTwoBool = false;
            score++;
            tingSound.setVolume(config.volumeMultiplier * 0.15);
            tingSound.play();
        }
    }
}

function oneSecondIntervals() {
    enemyTimeUpdate();
    gooseTimeUpdate();
}

/** ----------------------------------------------------------------------------------------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------------------------------- */

//Draws a goose that heads from left to right on the screen when called, and can be shot for 3 points
function drawGoose() {
    gooseInfo.y = height / 8;
    //Draws the goose
    image(gooseInfo.gooseChangingImage, gooseInfo.x - gooseInfo.width, height / 8, gooseInfo.width, gooseInfo.height);
    //If the goose reaches the end of the canvas, end the game
    if (gooseInfo.x > width + gooseInfo.width) {
        gooseInfo.alive = false;
        gooseInfo.x = 0;
        score = score + 3;
        tingSound.setVolume(config.volumeMultiplier * 0.15);
        tingSound.play();
        brainwashingInfo.showText = true;
        brainwashingInfo.duckGotThrough = true;
    }
}

//This function decides whether a new goose should spawn
function gooseSpawnDecide() {
    //Checks whether enough time has past for another attempt
    if (gooseInfo.time >= 1) {
        //Randomized pick from an array of 10 choices, worked better for me than a number randomizer
        gooseInfo.gooseDecision = Math.floor(random(1, config.gooseInfo.geeseChance));
        //Checks if the choice made is 1 AND the goose is not alive
        if (gooseInfo.gooseDecision === 1 && gooseInfo.alive === false) {
            gooseInfo.alive = true;
            gooseSound.setVolume(config.volumeMultiplier * 0.25);
            gooseSound.play();
        }
    }
    //Checks if the choice made is anything but 1 AND the goose is not alive
    else if (gooseInfo.gooseDecision != 1 && gooseInfo.alive === false) {
        gooseInfo.alive = false;
    }
    //Resets the time
    gooseInfo.time = 0;
}


//Swaps between the goose images
function changeGoose() {
    if (gooseInfo.gooseChangingImage === gooseUpImage) {
        gooseInfo.gooseChangingImage = gooseDownImage
    }
    else {
        gooseInfo.gooseChangingImage = gooseUpImage
    }
}

//Adds 1 to the goose time variable when called
function gooseTimeUpdate() {
    gooseInfo.time++;
}

/** ----------------------------------------------------------------------------------------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------------------------------- */

//Enemy function one, draws the left-most enemy when called
function enemyOne() {
    //Draws the jam in accordance to any movements and surrounding objects
    image(jamImage, width / 3 - artJam.width, height - artJam.height - enemyInfo.artJamRow + artJam.jamRange, artJam.width, artJam.height);
    if ((mouseX > width / 3 - artJam.width) &&
        (mouseX < width / 3) &&
        (mouseY > height - artJam.height - enemyInfo.artJamRow + artJam.jamRange) &&
        (mouseY < height - grassFront.height)) {
    }
}

//Enemy function two, draws the right-most enemy when called
//Won't comment the rest, its the same as the one above with slight differences
function enemyTwo() {
    image(jamImage, width / 3 + width / 2 - artJam.width, height - artJam.height - enemyInfo.artJamRow + artJam.jamRange, artJam.width, artJam.height);
    if ((mouseX > width / 3 + width / 2 - artJam.width) &&
        (mouseX < width / 3 + width / 2) &&
        (mouseY > height - artJam.height - enemyInfo.artJamRow + artJam.jamRange) &&
        (mouseY < height - grassFront.height)) {
    }
}

//When called, checks if time is right for an enemy spawn, then randomly chooses enemy and changes their boolean variable to true, causing their enemyOne/enemyTwo function to trigger for as long as the boolean stays true
function enemyStart() {
    //Maps the jam's movements to the mouse, while making them much slower than the rifle
    artJam.jamRange = map(mouseY, 0, height, 0, height / 24);
    //Checks if the enemy time is over or equal to 1
    if (enemyInfo.time >= 1) {
        //Picks a random value from an array and assigns it to enemyJump
        enemyInfo.enemyJump = random(enemyInfo.enemy);
        //Checks if enemyjump is 1 AND enemyOneBool is false
        if (enemyInfo.enemyJump === 1 && enemyInfo.enemyOneBool === false) {
            enemyInfo.enemyOneBool = true;
        }
        //Checks if enemyjump is 2 AND enemyTwoBool is false
        else if (enemyInfo.enemyJump === 2 && enemyInfo.enemyTwoBool === false) {
            enemyInfo.enemyTwoBool = true;
        }
        //Resets enemy time
        enemyInfo.time = 0;
    }
}

//Adds 1 to the enemy time variable when called
function enemyTimeUpdate() {
    enemyInfo.time++;
}

/** ----------------------------------------------------------------------------------------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------------------------------- */

//Draws the play button
function drawPlayButton() {
    // width & height is calculated like this because I want the button to be truly centered, and the image is 192 x 72
    image(buttonImage, width / 2 - 96, height / 2 - 36, playButton.width, playButton.height);
    text("PLAY", width / 2, height / 2);
    textSize(config.textSizeMultiplier * 12);
}

//Draws the pressed version of the play button
function drawPressedPlayButton() {
    // width & height is calculated like this because I want the button to be truly centered, and the image is 192 x 72
    image(buttonPressedImage, width / 2 - 96, height / 2 - 36, playButton.width, playButton.height);
    text("PLAY", width / 2, height / 2);
    textSize(config.textSizeMultiplier * 12);
}

//Checks if the mouse is one the play button, then changes the state to game if clicked
function playButtonInput() {
    // If the mouse is between these values then
    if ((mouseX > width / 2 - 96) &&
        (mouseX < width / 2 + 96) &&
        (mouseY > height / 2 - 36) &&
        (mouseY < height / 2 + 36)) {
        //If mouse hovers over the button, draw the pressed version
        drawPressedPlayButton();
        //Checks if the button is left clicked
        if (mouseIsPressed) {
            //Resets score
            score = 0;
            state = "game";
        }
    }
}

/** ----------------------------------------------------------------------------------------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------------------------------- */

//Displays all title screen related functions
function titleScreen() {
    titleScreenText();
    drawPlayButton();
    playButtonInput();
    gameExplainText();
}

/** ----------------------------------------------------------------------------------------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------------------------------- */

//Displays all title screen related functions and checks if enemyOne/enemyTwo needs to be displayed
function game() {
    drawBackGrass();
    //Checks if any enemies are alive and triggers their functions
    if (enemyInfo.enemyOneBool === true) {
        enemyOne();
    }
    if (enemyInfo.enemyTwoBool === true) {
        enemyTwo();
    }
    //Checks if a goose is alive and triggers its function
    if (gooseInfo.alive === true) {
        gooseInfo.x = gooseInfo.x + 7;
        drawGoose();
    }
    drawFrontGrass();
    drawRifle();
    gooseSpawnDecide()
    enemyStart();
    scoreText();
    drawRandomBrainwashing();
}

/** ----------------------------------------------------------------------------------------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------------------------------- */

function end() {
    endText();
    scoreText();
    drawPlayButton();
    playButtonInput();
    drawEndGoose();
}