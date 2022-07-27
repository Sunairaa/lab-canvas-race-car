var audio = new Audio('./music/bg.mp3');

const canvas = document.querySelector("canvas");
canvas.style.border = "2px solid grey";
let ctx = canvas.getContext("2d");
let startScreen = document.querySelector(".game-intro");
let gameOverScreen = document.querySelector(".game-over");
let intervalId = 0;
let isGameOver = false;
let score = 0;
let background = new Image();
background.src = "./images/road.png";

let carWidth = 80;
let carLength = 130;

class Car {
  constructor(image, xPosition, yPosition) {
    this.image = image;
    this.xPosition = xPosition;
    this.yPosition = yPosition;
  }
}
let carImage = new Image();
carImage.src = "./images/car.png";
const myCar = new Car(carImage, 210, 400)

const obstacleCars = [];
for(let a = 1; a < 4; a++) {
  let image = new Image();
  image.src = "./images/car2.png";
  let xPosition = Math.floor(Math.random() * (canvas.width - 100 - 2*carWidth)) + 50 + carWidth;
  let yPosition = -400 * a;
  //obstacle car
  let obCar = new Car(image, xPosition, yPosition);
  obstacleCars.push(obCar); 
}


window.onload = () => {
  canvas.style.display = "none";
  gameOverScreen.style.display = "none";
  document.getElementById("start-button").onclick = () => {
    audio.play()
    startGame();
  };

  // left right movement of my car
  document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowRight" && myCar.xPosition + carWidth < canvas.width - 50) {
      myCar.xPosition += 4;
    } else if (event.code === "ArrowLeft" && myCar.xPosition > 50) {
      myCar.xPosition -= 4;
    } else if (event.code === "ArrowUp" && myCar.yPosition > 0) {
      myCar.yPosition -= 4;
    } else if (event.code === "ArrowDown" && myCar.yPosition + carLength < canvas.height) {
      myCar.yPosition += 4;
    }
  });
  
  function startGame() {
    canvas.style.display = "block";
    startScreen.style.display = "none";
    gameOverScreen.style.display = "none";
    //drawing the background and the cars
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(myCar.image, myCar.xPosition, myCar.yPosition, carWidth, carLength);
    for(let i = 0; i < obstacleCars.length; i++) {
      ctx.drawImage(obstacleCars[i].image, obstacleCars[i].xPosition, obstacleCars[i].yPosition, carWidth, carLength);
      //obCar movement
      obstacleCars[i].yPosition += 2;
      if(obstacleCars[i].yPosition > canvas.height) {
        obstacleCars[i].yPosition = -400;
        score++;
      }

      //collision with cars
      if (
        myCar.yPosition < obstacleCars[i].yPosition + carLength &&
        myCar.xPosition < obstacleCars[i].xPosition + carWidth - 5 &&
        myCar.xPosition + carWidth > obstacleCars[i].xPosition &&
        myCar.yPosition + carLength > obstacleCars[i].yPosition
      ) {
        isGameOver = true;
      }
    }

    //scoreboard
    ctx.font = "30px Georgia";
    ctx.fillText(`Score:${score}`, 100, 40);
    intervalId = requestAnimationFrame(startGame);
    if (isGameOver) {
      cancelAnimationFrame(intervalId);
      canvas.style.display = "none";
      startScreen.style.display = "none";
      gameOverScreen.style.display = "block";
      audio.muted();
    }
  }
};