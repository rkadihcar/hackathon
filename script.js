let canvas = document.getElementById("myCanvas");
// Définir un contexte de dessin en 2D
let ctx = canvas.getContext("2d");
// Diametre de la balle
let ballRadius = 10;
// définition de la position de départ et du rebon
let x = canvas.width / 2;
let y = canvas.height - 30;
//check later
let dx = 2;
let dy = -2;
// définition taille, largeur et position de dép de la raquette
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
// touche gauche et droite par défaut en false 
let rightPressed = false;
let leftPressed = false;

let brickRowCount = 5; //nombre de brique en ligne
let brickColumnCount = 3;//nombre de brique en column
// hauteur, largeur et espacement entre les briques
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
// position des briques par rapport au canvas 
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

let score = 0;
let lives = 3;

// c=column et r=row 
// Création et affichage des lignes et colonnes 
let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

// Création d'une function afin de détecter les touches pressées : left, right 
//la propriété "key" permet de retourner la valeur de la touche pressée(universel)
function keyDownHandler(event) {
    if (event.key == "Right" || event.key == "ArrowRight") {
        rightPressed = true;
    }
    else if (event.key == "Left" || event.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(event) {
    if (event.key == "Right" || event.key == "ArrowRight") {
        rightPressed = false;
    }
    else if (event.key == "Left" || event.key == "ArrowLeft") {
        leftPressed = false;
    }
}
//mouseMove=event se déclenche lorsque le pointeur se déplace sur la page

function mouseMoveHandler(event) {
    //var relative X = la position du départ de la souris - l'espace gauche du canvas
    let relativeX = event.clientX - canvas.offsetLeft;
    //si relativeX est stricement sup à 0 ET strictement inférieur à la largeur du canvas
    if (relativeX > 0 && relativeX < canvas.width) {
        //la position de la raquette = relativeX - la largeur de la raquette/2
        paddleX = relativeX - paddleWidth / 2;
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status == 1) { //permet l'affichage des row et column
                // x > b.x = la position de x de la balle est > à la position x de la brique.
                // x < b.x + brickWidth = la position x de la balle est < à la position x de la brique plus sa largeur.
                // y > b.y = la position y de la balle est > à la position y de la brique.
                //y < b.y + brickHeight =la position y de la balle est < à la position y de la brique plus sa hauteur.
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    //si ttes les conditions sont executées : collision + brique disparait (0) + score est ++
                    dy = -dy;
                    b.status = 0;
                    score++;
                    // si le score = nombre total de briques alors "you win"
                    if (score == brickRowCount * brickColumnCount) {
                        alert("YOU WIN, CONGRATS!");
                        document.location.reload();//Recharger la page
                    }
                }
            }
        }
    }
}
//définition param de la balle et du Paddle

function drawBall() {
    ctx.beginPath();//point de départ de la trajectoire 
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);//dessin de la courbe
    ctx.fillStyle = "#0095DD";//la couleur de la balle
    ctx.fill();//
    ctx.closePath();
}
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
//Vérifier la valeur de la propriété "status" de chaque brique dans la fonction drawBricks() avant de la dessiner. Si status == 1, la brique sera dessinée, mais si status == 0, la balle a été touchée et ne sera pas visible à l'écran

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                let brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
//affichage du score et style
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);//les coordonnées du score par rapport au canvas
}
//affichage du live et style
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}
//rappel de toutes les functions
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);//initialisation du canvas
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

//on vérifie que la taille de la balle ne dépasse pas la taille du paddle + les trajectoires de la balle ne dépassent pas l'espace canvas
//
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    }
    else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if (!lives) { //si 0 vie 
                alert("GAME OVER");
                document.location.reload();
            }
            else {//initialisation du canvas
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }
// si la touche droite est enfoncée et le paddle est < à la largeur du canvas-la largeur du paddle
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 6;//pn peut déplacer le paddle à droite de 6 px
    }
    else if (leftPressed && paddleX > 0) {
        paddleX -= 6;
    }
//permet de mettre la balle en mouvement
    x += dx;
    y += dy;
    requestAnimationFrame(draw); //signaler au navigateur qu'on utilise une animation
}

draw();