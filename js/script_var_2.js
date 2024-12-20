/**
 * Variation Jam - Fear The: Termigeese
 * Sean Verba
 * 
 * A game where you shoot cans of Art Jam (paint) and robot geese motherships in a sad attempt to save the last of humanity
 * 
 * Control's:
 * - Mouse to adjust aim
 * - Left click to fire
 * - Spacebar to swap weapon damage modes
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
let jamScaredImage = undefined;
let buttonImage = undefined;
let buttonPressedImage = undefined;
let railgunMinImage = undefined;
let railgunMidImage = undefined;
let railgunMaxImage = undefined;
let railgunImage = undefined;
let gooseUpImage = undefined;
let gooseDownImage = undefined;
let gooseBossUpImage = undefined;
let gooseBossDownImage = undefined;
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

//Same as gooseInfo but for the boss
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
    //Stores max health
    maxHealth: null
}

//Boolean for whether the user has their mouse down
let hasClicked = false;

//Tracks maximum ammo
let maxAmmo = null;

//Tracks the current damage the player does
let currentDamage = null;

//Represents an instance of sam
let sam = null;

//Represents another instance of sam but for the boss goose's voice
let bossQuack = null;

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
    railgunMinImage = loadImage('assets/images/Art_Jam_Railgun_1.png');
    railgunMidImage = loadImage('assets/images/Art_Jam_Railgun_2.png');
    railgunMaxImage = loadImage('assets/images/Art_Jam_Railgun_3.png');
    gooseUpImage = loadImage('assets/images/Goose_1.png');
    gooseDownImage = loadImage('assets/images/Goose_2.png');
    gooseBossUpImage = loadImage('assets/images/Goose_Boss_1.png');
    gooseBossDownImage = loadImage('assets/images/Goose_Boss_2.png');
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
    //Defines the sam with his attributes
    sam = new SamJs(config.sam);
    bossQuack = new SamJs(config.bossGooseInfo.bossQuack);
    //Sets starting damage at min
    currentDamage = config.minDamage;
    gooseInfo.gooseChangingImage = gooseUpImage;
    bossGooseInfo.bossGooseChangingImage = gooseBossUpImage;
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

//On key press
function keyPressed() {
    //If the key pressed is the spacebar key and currentDamage is set to min
    if (keyCode === 32 && currentDamage === config.minDamage) {
        //Set currentDamage to mid
        currentDamage = config.midDamage;
        //Change the railgun image to match
        railgunImage = railgunMidImage;
        //Sam talks
        sam.speak("Damage: Me-dium");
    }
    else if (keyCode === 32 && currentDamage === config.midDamage) {
        currentDamage = config.maxDamage;
        railgunImage = railgunMaxImage;
        sam.speak("Damage: Maximum");
    }
    else if (keyCode === 32 && currentDamage === config.maxDamage) {
        currentDamage = config.minDamage;
        railgunImage = railgunMinImage;
        sam.speak("Damage: Minimum");
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
    text("!Termigeese!", width / 2, height / 3 + 60);
    text("Fear The", width / 2, height / 3);
    pop();
}

//Draws the explanation of the game when called
function gameExplainText() {
    //Changes all text settings to preferred settings for an explanation, then draws the text based on canvas sizes
    push();
    fill("#ffffff");
    textSize(config.textSizeMultiplier * 12);
    text("You travelled far into the apocalyptic future!", width / 2, height - 325);
    text("Defend the last survivors with your railgun!", width / 2, height - 300);
    text("The railgun has 3 damage modes, swap with spacebar.", width / 2, height - 275);
    text("They each take as much ammo as they do damage.", width / 2, height - 250);
    text("Luckily, you have S.A.M to assist you!", width / 2, height - 225);
    text("But beware the Termigoose, a terror with 6 health!", width / 2, height - 200);
    text("(Sam and Termigoose are a little loud)", width / 2, height - 175);
    pop();
}

//Draws the text that displays player score when called
function scoreText() {
    //Changes all text settings to preferred settings for a scoreboard, then draws the text based on canvas sizes
    push();
    fill("#5fc9df");
    textSize(config.textSizeMultiplier * 24);
    text("Score: " + score, width / 2, height / 3);
    pop();
}

//Draws the text that displays player ammo when called
function ammoText() {
    push();
    fill("#5fc9df");
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
    text("You let the geese destroy earth.", width / 2, height / 4);
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
    image(railgunImage, width - rifle.width, rifleImageHeight, rifle.width, rifle.height);
}

//Backbone of the mouse press re-work
function isMousePressed() {
    //If the mouse is pressed
    if (mouseIsPressed) {
        //If hasClicked is set to false
        if (hasClicked === false) {
            //Set hasClicked to true
            hasClicked = true;
            //Then activate the shootHandler function
            shootHandler();
        }
    }
    //Otherwise, switch hasClicked to false
    else {
        hasClicked = false;
    }
}

//Secondary part of the mouse press re-work
function shootHandler() {
    gunSound.setVolume(config.volumeMultiplier * 0.25);
    gunSound.play();
    //If the player is in the "game" state
    if (state === "game") {
        //If ammo - currentDamage is more or equal to 0 (stops player from using more ammo than available)
        if (config.ammo - currentDamage >= 0) {
            //Remove currentDamage from the ammo
            config.ammo = config.ammo - currentDamage;
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
            //Checks if mouse is over the boss goose
            else if ((mouseX > bossGooseInfo.x - bossGooseInfo.width) &&
                (mouseX < bossGooseInfo.x) &&
                (mouseY > bossGooseInfo.y) &&
                (mouseY < bossGooseInfo.y + bossGooseInfo.height)) {
                //Damage the boss based on currentDamage
                config.bossGooseInfo.health = config.bossGooseInfo.health - currentDamage;
                //If the boss's health is less than or equal to 0
                if (config.bossGooseInfo.health <= 0) {
                    bossGooseInfo.alive = false;
                    config.bossGooseInfo.health = bossGooseInfo.maxHealth;
                    bossGooseInfo.x = 0;
                    tingSound.setVolume(config.volumeMultiplier * 0.2);
                    tingSound.play();
                    score = score + 6;
                }
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
        else {
            //Sam reminds the player that they don't have enough ammo
            sam.speak("Ammo!");
        }
    }
}

//Function that sets the maximum amount of ammo
function maxAmmoSet() {
    maxAmmo = config.ammo;
}

//Function to add ammo
function addAmmo() {
    //If the state is "game" and the config.ammo is less than maximum
    if (state === "game" && config.ammo < maxAmmo) {
        config.ammo++;
    }
}

//New function to condense all one second intervals
function oneSecondIntervals() {
    enemyTimeUpdate();
    gooseTimeUpdate();
    addAmmo();
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
    //Draws the boss goose
    image(bossGooseInfo.bossGooseChangingImage, bossGooseInfo.x - bossGooseInfo.width, height / 6, bossGooseInfo.width, bossGooseInfo.height);
    //If the boss goose reaches the end of the canvas, end the game
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
    //Same deal with the boss
    if (bossGooseInfo.bossGooseDecision === 1 && bossGooseInfo.alive === false) {
        bossGooseInfo.alive = true;
        //Big goose, big quack
        bossQuack.speak("QUAAAAAAACK");
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
            railgunImage = railgunMinImage;
            config.ammo = maxAmmo;
            bossGooseInfo.maxHealth = config.bossGooseInfo.health;
            sam.speak("SAM, on-line.");
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