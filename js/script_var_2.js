/**
 * Art Jam Shootout (also evil geese)
 * Sean Verba
 * 
 * A game where you shoot cans of Art Jam (paint) and protect Canada from a goose invasion
 * 
 * Control's:
 * - Mouse to adjust aim
 * - Left click to fire
 * Uses:
 * p5.js
 * https://p5js.org
 */

"use strict";

//Next few variables are all undefined image variables in preperation for the preload function
let targetImage = undefined;
let jamImage = undefined;
let jamScaredImage = undefined;
let buttonImage = undefined;
let buttonPressedImage = undefined;
let explosionSmallImage = undefined;
let explosionMediumImage = undefined;
let explosionLargeImage = undefined;
let crossbowImage = undefined;
let gooseUpImage = undefined;
let gooseDownImage = undefined;
let gooseBossUpImage = undefined;
let gooseBossDownImage = undefined;
let gooseForceImage = undefined;
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
        r: 122,
        g: 120,
        b: 82
    }
}

//Variables for the grassBack function
let grassBack = {
    x: 0,
    y: 550,
    width: 800,
    height: 150,
    fill: {
        r: 140,
        g: 138,
        b: 92
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

//Variables that tell the explosion at the cursor what size to be  (currently not really functional)
let explosion = {
    width: 48,
    height: 38
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

let bossGooseInfo = {
    x: 0,
    y: 0,
    width: 120,
    height: 100,
    //The variable that allows for the flapping wings of the goose
    bossGooseChangingImage: undefined,
    //Is the goose alive right now?
    alive: false,
    //Variable for deciding on whether the goose should be made alive right now
    bossGooseDecision: undefined,
}

let hasClicked = false;

let maxAmmo = null;

//Variable holding the score
let score = 0;

//State variable, currently set to titlescreen on launch
let state = "titlescreen";

let config;

/** ----------------------------------------------------------------------------------------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------------------------------- */

//A function that preloads all the assets used
function preload() {
    //Variables are getting image data
    targetImage = loadImage('assets/images/Target.png');
    jamImage = loadImage('assets/images/Art_Jam.png');
    jamScaredImage = loadImage('assets/images/Art_Jam_Scared.png');
    buttonImage = loadImage('assets/images/Art_Jam_Button_1.png');
    buttonPressedImage = loadImage('assets/images/Art_Jam_Button_2.png');
    explosionSmallImage = loadImage('assets/images/Repurposed_Art_Jam_Explosion_1.png');
    explosionMediumImage = loadImage('assets/images/Repurposed_Art_Jam_Explosion_2.png');
    explosionLargeImage = loadImage('assets/images/Repurposed_Art_Jam_Explosion_3.png');
    crossbowImage = loadImage('assets/images/Art_Jam_Crossbow.png');
    gooseUpImage = loadImage('assets/images/Goose_1.png');
    gooseDownImage = loadImage('assets/images/Goose_2.png');
    gooseBossUpImage = loadImage('assets/images/Goose_Boss_1.png');
    gooseBossDownImage = loadImage('assets/images/Goose_Boss_2.png');
    gooseForceImage = loadImage('assets/images/Goose_Force.png');
    endGooseImage = loadImage('assets/images/End_Goose.png');
    titleFont = loadFont('assets/fonts/PressStart2P-Regular.ttf');
    paintSound = loadSound('assets/sounds/paint.mp3');
    explosionSound = loadSound('assets/sounds/explode.mp3');
    gunSound = loadSound('assets/sounds/gun.mp3');
    gooseSound = loadSound('assets/sounds/goose.m4a');
    tingSound = loadSound('assets/sounds/ting.m4a');
    config = loadJSON('js/config.json');
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
    gooseInfo.gooseChangingImage = gooseUpImage;
    bossGooseInfo.bossGooseChangingImage = gooseBossUpImage;
    //Sets an interval for every 1 second that triggers the enemy time update function
    setInterval(enemyTimeUpdate, 1000);
    //Sets an interval for every 1 second that triggers the goose time update function
    setInterval(gooseTimeUpdate, 1000);
    //Sets an interval for every 0.25 of a second that makes the goose flap its wings
    setInterval(changeGoose, 250);
}


//Draw runs code every frame
function draw() {
    //Calls the drawBackdrop function
    drawBackdrop();
    //Cursor image didn't fully work with the preload function, seems thats because its a p5 thing maybe?
    //Makes player cursor into a target
    cursor("assets/images/Target.png", 16, 16);
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

/** ----------------------------------------------------------------------------------------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------------------------------- */
/** ----------------------------------------------------------------------------------------------------------------------------- */

//Draws a backround when called
function drawBackdrop() {
    background(139, 0, 0)
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
    text("!Goose Shootout!", width / 2, height / 3 + 60);
    text("Ye Olde", width / 2, height / 3);
    pop();
}

//Draws the explanation of the game when called
function gameExplainText() {
    //Changes all text settings to preferred settings for an explanation, then draws the text based on canvas sizes
    push();
    fill("#ffffff");
    textSize(config.textSizeMultiplier * 12);
    text("You travelled far into the past!", width / 2, height - 325);
    text("Defend Canada with your trusty crossbow!", width / 2, height - 300);
    text("Your crossbow aims lower than your cursor, and watch your ammo!", width / 2, height - 275);
    text("Armoured geese take 2 hits to defeat!", width / 2, height - 250);
    text("Scoring doesn't reduce ammo (you grab the bolts)!", width / 2, height - 225);
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

//Draws the text that displays player score when called
function ammoText() {
    //Changes all text settings to preferred settings for a scoreboard, then draws the text based on canvas sizes
    push();
    fill("#ffffff");
    textSize(config.textSizeMultiplier * 24);
    text("Ammo: " + config.ammo, width / 8, height / 1.1);
    pop();
}

//Draws the end text when called
function endText() {
    //Changes all text settings to preferred settings for a finishing message, then draws the text based on canvas sizes
    push();
    fill("#ffffff");
    textSize(config.textSizeMultiplier * 24);
    text("You let the geese invade Canada", width / 2, height / 4);
    pop();
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
    image(crossbowImage, width - rifle.width, rifleImageHeight, rifle.width, rifle.height);
}

function isMousePressed() {
    if (mouseIsPressed) {
        if (hasClicked === false) {
            hasClicked = true;
            // console.log("test")
            shootHandler();
        }
    }
    else {
        hasClicked = false;
    }
}

function shootHandler() {
    gunSound.setVolume(config.volumeMultiplier * 0.25);
    gunSound.play();
    if (state === "game") {
        if (config.ammo > 0) {
            //Checks if mouse is over the goose
            if ((mouseX > gooseInfo.x - gooseInfo.width) &&
                (mouseX < gooseInfo.x) &&
                (mouseY > gooseInfo.y) &&
                (mouseY < gooseInfo.y + gooseInfo.height)) {
                gooseInfo.alive = false;
                gooseInfo.x = 0;
                tingSound.setVolume(config.volumeMultiplier * 0.2);
                tingSound.play();
                score = score + 3;

            }
            else if ((mouseX > bossGooseInfo.x - bossGooseInfo.width) &&
                (mouseX < bossGooseInfo.x) &&
                (mouseY > bossGooseInfo.y) &&
                (mouseY < bossGooseInfo.y + bossGooseInfo.height)) {
                bossGooseInfo.alive = false;
                bossGooseInfo.x = 0;
                tingSound.setVolume(config.volumeMultiplier * 0.2);
                tingSound.play();
                score = score + 6;

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
                // config.bossGooseInfo.health = config.bossGooseInfo.health - currentDamage;
                enemyInfo.enemyTwoBool = false;
                score++;
                tingSound.setVolume(config.volumeMultiplier * 0.15);
                tingSound.play();
            }
            else {
                config.ammo = config.ammo - 1;
            }
            // console.log("Ammo = " + config.ammo);
        }
        else {

        }
    }
}

function maxAmmoSet() {
    maxAmmo = config.ammo;
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
        explosionSound.setVolume(config.volumeMultiplier * 0.25);
        explosionSound.play();
        //Just changing the state to end here
        state = "end";
    }
}

//Draws a goose that heads from left to right on the screen when called, and can be shot for 3 points
function drawBossGoose() {
    bossGooseInfo.y = height / 6;
    //Draws the goose
    image(bossGooseInfo.bossGooseChangingImage, bossGooseInfo.x - bossGooseInfo.width, height / 6, bossGooseInfo.width, bossGooseInfo.height);
    //If the goose reaches the end of the canvas, end the game
    if (bossGooseInfo.x > width + bossGooseInfo.width) {
        bossGooseInfo.alive = false;
        bossGooseInfo.x = 0;
        explosionSound.setVolume(config.volumeMultiplier * 0.25);
        explosionSound.play();
        //Just changing the state to end here
        state = "end";
    }
}

//This function decides whether a new goose should spawn
function gooseSpawnDecide() {
    //Checks whether enough time has past for another attempt
    if (gooseInfo.time >= 1) {
        //Randomized pick from an array of 10 choices, worked better for me than a number randomizer
        gooseInfo.gooseDecision = Math.floor(random(1, config.gooseInfo.geeseChance));
        bossGooseInfo.bossGooseDecision = Math.floor(random(1, config.bossGooseInfo.bossGeeseChance));
        console.log("Boss Decision = " + bossGooseInfo.bossGooseDecision);
        // console.log("Goose Decision = " + gooseInfo.gooseDecision);
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
        //console.log("Dead");
    }
    if (bossGooseInfo.bossGooseDecision === 1 && bossGooseInfo.alive === false) {
        bossGooseInfo.alive = true;
        gooseSound.setVolume(config.volumeMultiplier * 0.25);
        gooseSound.play();
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
    if (bossGooseInfo.bossGooseChangingImage === gooseBossUpImage) {
        bossGooseInfo.bossGooseChangingImage = gooseBossDownImage
    }
    else {
        bossGooseInfo.bossGooseChangingImage = gooseBossUpImage
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
        //Draws a scared jam picture if hovered over
        image(jamScaredImage, width / 3 - artJam.width, height - artJam.height - enemyInfo.artJamRow + artJam.jamRange, artJam.width, artJam.height);
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
        image(jamScaredImage, width / 3 + width / 2 - artJam.width, height - artJam.height - enemyInfo.artJamRow + artJam.jamRange, artJam.width, artJam.height);
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
            //Triggers the "paintSound"
            paintSound.setVolume(config.volumeMultiplier * 0.1);
            paintSound.play();
        }
        //Checks if enemyjump is 2 AND enemyTwoBool is false
        else if (enemyInfo.enemyJump === 2 && enemyInfo.enemyTwoBool === false) {
            enemyInfo.enemyTwoBool = true;
            //Triggers the "paintSound"
            paintSound.setVolume(config.volumeMultiplier * 0.1);
            paintSound.play();
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
            config.ammo = maxAmmo;
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
    maxAmmoSet();
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
    if (bossGooseInfo.alive === true) {
        bossGooseInfo.x = bossGooseInfo.x + 3;
        drawBossGoose();
    }
    drawFrontGrass();
    drawRifle();
    gooseSpawnDecide()
    enemyStart();
    ammoText();
    scoreText();
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