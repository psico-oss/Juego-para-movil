var canvas = document.getElementById("myCanvas");
var secreto = 0;
var nivelActual = null;
var perdiste = 0;
var nivelG = "";
const $menu = document.getElementById("menu");
const $game = document.getElementById("game");
const $jugar = document.getElementById("jugar");
const $restart = document.querySelector("#reintentar");
const $gameOver = document.querySelector("#gameOver");
const $win = document.querySelector("#win");
const $reintentarW = document.querySelector("#reintentarW");
const $jugarP = document.querySelector("#jugarP");
const $jugarM = document.querySelector("#jugarM");
const $jugarB = document.querySelector("#jugarB");
const $nivelP = document.querySelector("#nivelP");
const $nivelM = document.querySelector("#nivelM");
const $nivelB = document.querySelector("#nivelB");
const $controles = document.getElementById("controles");
//creacion sonido
var sonidov = 0;
const $sonido = document.querySelector("#sonido");
const $sonidooff = document.querySelector("#sonidooff");
const fondo = document.createElement("audio");
const choque = document.createElement("audio");
const comienzo = document.createElement("audio");
const comienzo2 = document.createElement("audio");
const bonusnivel = document.createElement("audio");
const gameover = document.createElement("audio");
const inicio = document.createElement("audio");
fondo.src = "musica/chill.mp3";
choque.src = "musica/choque.mp3";
comienzo.src = "musica/nivel1.mp3";
bonusnivel.src = "musica/bonusnivel.mp3";
gameover.src = "musica/gameover.mp3";
inicio.src = "musica/inicio.ogg";
//declaracion de controles
const $izquierda = document.querySelector("#izquierda");
const $derecha = document.querySelector("#derecha");
//declaracion de variable para ver si paso de nivel
var ganador = 0;
//declaracion de imagen
var img = new Image();
var fondo2 = new Image();
var fondob = new Image();
var personaje = new Image();
var ladrilloa = new Image();
var ladrillor = new Image();
var ladrillob = new Image();
img.src = "imagenes/fondoi.jpg";
fondo2.src = "imagenes/fondo2.jpg";
fondob.src = "imagenes/fondob.jpg";
personaje.src = "imagenes/personajend.png";
ladrilloa.src = "imagenes/ladrilloa.png";
ladrillor.src = "imagenes/ladrillor.png";
ladrillob.src = "imagenes/ladrilloav.png";
fondo.play();
//declaracion de los parametros que le damos a los diferentes elementos del canvas

var ctx = canvas.getContext("2d");
var bola = 10;
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var PaletaAltura = 10;
var PaletaAnchura = 100;
var paddleX = (canvas.width - PaletaAnchura) / 2;
//aca declaramos las variables de los ladrillos y un padding para que no se toque entre ellos y ni los bordes
var ladrillos = [];
var ladrillos2 = [];
var ladrillosB = [];
var ladrilloFila = 9;
var ladrilloColumna = 4;
var ladrilloColumna2 = 5;
var ladrilloColumnaB = 6;
var ladrilloAncho = 65;
var ladrilloAltura = 20;
var ladrilloPadding = 5;
var ladrilloOffsetTop = 30;
var ladrilloOffsetLeft = 13;
//declaracion de variable de puntos y vidas
var score = 0;
var vidas = 5;

//creacion de fuente

// cancelar animacion window.cancelAnimationFrame(myReq);
$sonido.onclick = function () {
  fondo.pause();
  sonidov = 1;
  $sonido.classList.add("ocultar");
  $sonidooff.classList.remove("ocultar");
};
$sonidooff.onclick = function () {
  fondo.play();
  sonidov = 0;
  $sonido.classList.remove("ocultar");
  $sonidooff.classList.add("ocultar");
};
$jugar.onclick = function () {
  fondo.pause();
  $menu.classList.add("ocultar");
  $nivelP.classList.remove("ocultar");
};
$jugarP.onclick = function () {
  //comienzo.play();
  if (sonidov === 0) {
    comienzo.play();
  }

  $game.classList.remove("ocultar");
  $nivelP.classList.add("ocultar");
  canvas.style.display = "block";
  $controles.style.display = "block";
  for (var c = 0; c < ladrilloColumna; c++) {
    ladrillos[c] = [];
    for (var r = 0; r < ladrilloFila; r++) {
      ladrillos[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
  level();
};
//funcion para mover la tabla tactil
var moverBarra = null;
$izquierda.addEventListener("touchstart", moverBarraiz, false);
$izquierda.addEventListener("touchend", nomoverBarraiz, false);
$derecha.addEventListener("touchstart", moverBarradr, false);
$derecha.addEventListener("touchend", nomoverBarradr, false);
function moverBarraiz() {
  if (paddleX > 0) {
    moverBarra = setInterval(function () {
      paddleX -= 12;
      if (paddleX < 0) {
        clearInterval(moverBarra);
      }
    }, 50);
  }
}
function nomoverBarraiz() {
  clearInterval(moverBarra);
}
function moverBarradr() {
  if (paddleX < canvas.width - PaletaAnchura) {
    moverBarra = setInterval(function () {
      paddleX += 12;
      if (paddleX > canvas.width - PaletaAnchura) {
        clearInterval(moverBarra);
      }
    }, 50);
  }
}
function nomoverBarradr() {
  clearInterval(moverBarra);
}
//funcion para mover la tabla con el mouse

$izquierda.onmousedown = function (event) {
  moverBarra = setInterval(function () {
    if (paddleX > 0) {
      paddleX -= 12;
    }
  }, 50);
};

$izquierda.onmouseup = function (event) {
  clearInterval(moverBarra);
};

$derecha.onmousedown = function (event) {
  moverBarra = setInterval(function () {
    if (paddleX < canvas.width - PaletaAnchura) {
      paddleX += 12;
    }
  }, 50);
};

$derecha.onmouseup = function (event) {
  clearInterval(moverBarra);
};

//funcion para detectar colisiones
function colisiones(ladrillos) {
  for (var c = 0; c < ladrilloColumna; c++) {
    for (var r = 0; r < ladrilloFila; r++) {
      var b = ladrillos[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + ladrilloAncho &&
          y > b.y &&
          y < b.y + ladrilloAltura
        ) {
          dy = -dy;
          b.status = 2;
          score++;
          if (sonidov === 0) {
            choque.play();
          }
          if (score === ladrilloFila * ladrilloColumna) {
            if (sonidov === 0) {
              comienzo.pause();
            }
            nivelG = "pause";
            canvas.style.display = "none";
            $nivelM.classList.remove("ocultar");
            $jugarM.onclick = function () {
              ganador = 1;
              canvas.style.display = "block";
              $nivelM.classList.add("ocultar");
              for (var t = 0; t < ladrilloColumna2; t++) {
                ladrillos2[t] = [];
                for (var l = 0; l < ladrilloFila; l++) {
                  ladrillos2[t][l] = { x: 0, y: 0, status: 1 };
                }
              }
              if (sonidov === 0) {
                inicio.play();
              }
            };
          }
        }
      }
    }
  }
}

function colisiones2(ladrillos2) {
  for (var t = 0; t < ladrilloColumna2; t++) {
    for (var l = 0; l < ladrilloFila; l++) {
      var b = ladrillos2[t][l];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + ladrilloAncho &&
          y > b.y &&
          y < b.y + ladrilloAltura
        ) {
          dy = -dy;
          b.status = 2;
          score++;
          if (sonidov === 0) {
            choque.play();
          }
          if (score === 81) {
            if (vidas === 2) {
              secreto = 1;
            }
            if (secreto === 1) {
              nivelG = "ganaste";
              if (sonidov === 0) {
                inicio.pause();
              }
              canvas.style.display = "none";
              $nivelB.classList.remove("ocultar");
              $jugarB.onclick = function () {
                if (sonidov === 0) {
                  bonusnivel.play();
                }
                canvas.style.display = "block";
                $nivelB.classList.add("ocultar");
                for (var q = 0; q < ladrilloColumnaB; q++) {
                  ladrillosB[q] = [];
                  for (var m = 0; m < ladrilloFila; m++) {
                    ladrillosB[q][m] = { x: 0, y: 0, status: 1 };
                  }
                }

                ganador = 1;
              };
            } else {
              perdiste = 1;
              nivelG = "ganaste";
              inicio.pause();
              canvas.style.display = "none";
              $win.classList.remove("ocultar");
              document.getElementById("puntosW").innerHTML = score;
              $reintentarW.onclick = function () {
                document.location.reload();
              };
            }
          }
        }
      }
    }
  }
}

function colisionesB(ladrillosB) {
  for (var t = 0; t < ladrilloColumnaB; t++) {
    for (var l = 0; l < ladrilloFila; l++) {
      var b = ladrillosB[t][l];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + ladrilloAncho &&
          y > b.y &&
          y < b.y + ladrilloAltura
        ) {
          dy = -dy;
          b.status = 2;
          score++;
          choque.play();
          if (score === 135) {
            perdiste = 1;
            bonusnivel.pause();
            canvas.style.display = "none";
            $win.classList.remove("ocultar");
            document.getElementById("puntosW").innerHTML = score;
            $reintentarW.onclick = function () {
              document.location.reload();
            };
          }
        }
      }
    }
  }
}

//funcion para dibujar la bola en el canvas
function dibujarBola() {
  ctx.beginPath();
  ctx.arc(x, y, bola, 0, Math.PI * 2);
  ctx.fillStyle = "#80ffff";
  ctx.fill();
  ctx.closePath();
}

//funcion para dibujar la tabla en el canvas
function dibujarTabla() {
  ctx.beginPath();
  ctx.drawImage(personaje, paddleX, canvas.height - PaletaAltura, 100, 15);
  ctx.fill();
  ctx.closePath();
}

//funcion para dibujar los ladrillos en el canvas y a la imagen que tiene detras
function dibujarLadrillos(ladrillos) {
  ctx.drawImage(img, 0, 0, 650, 400);
  for (var c = 0; c < ladrilloColumna; c++) {
    for (var r = 0; r < ladrilloFila; r++) {
      if (ladrillos[c][r].status === 1) {
        var brickX = r * (ladrilloAncho + ladrilloPadding) + ladrilloOffsetLeft;
        var brickY = c * (ladrilloAltura + ladrilloPadding) + ladrilloOffsetTop;
        ladrillos[c][r].x = brickX;
        ladrillos[c][r].y = brickY;
        ctx.beginPath();
        ctx.drawImage(ladrilloa, brickX, brickY, ladrilloAncho, ladrilloAltura);
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function dibujarLadrillos2(ladrillos2) {
  ctx.drawImage(fondo2, 0, 0, 650, 400);
  for (var t = 0; t < ladrilloColumna2; t++) {
    for (var l = 0; l < ladrilloFila; l++) {
      if (ladrillos2[t][l].status === 1) {
        var brickX = l * (ladrilloAncho + ladrilloPadding) + ladrilloOffsetLeft;
        var brickY = t * (ladrilloAltura + ladrilloPadding) + ladrilloOffsetTop;
        ladrillos2[t][l].x = brickX;
        ladrillos2[t][l].y = brickY;
        ctx.beginPath();
        ctx.drawImage(ladrillor, brickX, brickY, ladrilloAncho, ladrilloAltura);
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function dibujarLadrillosB(ladrillosB) {
  ctx.drawImage(fondob, 0, 0, 650, 400);
  for (var t = 0; t < ladrilloColumnaB; t++) {
    for (var l = 0; l < ladrilloFila; l++) {
      if (ladrillosB[t][l].status === 1) {
        var brickX = l * (ladrilloAncho + ladrilloPadding) + ladrilloOffsetLeft;
        var brickY = t * (ladrilloAltura + ladrilloPadding) + ladrilloOffsetTop;
        ladrillosB[t][l].x = brickX;
        ladrillosB[t][l].y = brickY;
        ctx.beginPath();
        ctx.drawImage(ladrillob, brickX, brickY, ladrilloAncho, ladrilloAltura);
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

//funcion para mostrar el score mientras se juega en el canvas
function dibujarScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("Puntos: " + score, 8, 20);
}

//funcion para mostrar la vida mientras se juega en el canvas
function dibujarVidas() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("Vidas: " + vidas, canvas.width - 70, 20);
}

//funcion que llama a las demas funciones para que se dibujen , mueve la paleta , detecta si perdiste
function level() {
  if (nivelG === "pause") {
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  dibujarLadrillos(ladrillos);
  dibujarBola();
  dibujarTabla();
  dibujarScore();
  dibujarVidas();
  colisiones(ladrillos);

  if (x + dx > canvas.width - bola || x + dx < bola) {
    dx = -dx;
  }

  if (y + dy < bola) {
    dy = -dy;
  } else if (y + dy > canvas.height - bola) {
    if (x > paddleX && x < paddleX + PaletaAnchura && y > PaletaAltura) {
      dy = -dy;
    } else {
      vidas--;
      if (!vidas) {
        if (perdiste === 0) {
          if (sonidov === 0) {
            comienzo.pause();
            gameover.play();
          }
          nivelG = "pause";
          canvas.style.display = "none";
          $gameOver.classList.remove("ocultar");
          document.getElementById("puntos").innerHTML = score;
          $restart.onclick = function () {
            document.location.reload();
          };
        }
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 3;
        dy = -3;
        paddleX = (canvas.width - PaletaAnchura) / 2;
      }
    }
  }

  x += dx;
  y += dy;
  nivelActual = requestAnimationFrame(level);
}

function level2() {
  if (nivelG === "ganaste") {
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  dibujarLadrillos2(ladrillos2);
  dibujarBola();
  dibujarTabla();
  dibujarScore();
  dibujarVidas();
  colisiones2(ladrillos2);

  if (x + dx > canvas.width - bola || x + dx < bola) {
    dx = -dx;
  }
  if (y + dy < bola) {
    dy = -dy;
  } else if (y + dy > canvas.height - bola) {
    if (x > paddleX && x < paddleX + PaletaAnchura && y > PaletaAltura) {
      dy = -dy;
    } else {
      vidas--;
      if (!vidas) {
        if (perdiste === 0) {
          if (sonidov === 0) {
            inicio.pause();
            gameover.play();
          }
          nivelG = "ganaste";
          canvas.style.display = "none";
          $gameOver.classList.remove("ocultar");
          document.getElementById("puntos").innerHTML = score;
          $restart.onclick = function () {
            document.location.reload();
          };
        }
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 3;
        dy = -3;
        paddleX = (canvas.width - PaletaAnchura) / 2;
      }
    }
  }
  x += dx;
  y += dy;
  requestAnimationFrame(level2);
}

function levelB() {
  if (nivelG === "pause2") {
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  dibujarLadrillosB(ladrillosB);
  dibujarBola();
  dibujarTabla();
  dibujarScore();
  dibujarVidas();
  colisionesB(ladrillosB);

  if (x + dx > canvas.width - bola || x + dx < bola) {
    dx = -dx;
  }
  if (y + dy < bola) {
    dy = -dy;
  } else if (y + dy > canvas.height - bola) {
    if (x > paddleX && x < paddleX + PaletaAnchura) {
      dy = -dy;
    } else {
      vidas--;
      if (!vidas) {
        if (perdiste === 0) {
          if (sonidov === 0) {
            bonusnivel.pause();
            gameover.play();
          }
          nivelG = "pause2";
          canvas.style.display = "none";
          $gameOver.classList.remove("ocultar");
          document.getElementById("puntos").innerHTML = score;
          $restart.onclick = function () {
            document.location.reload();
          };
        }
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 3;
        dy = -3;
        paddleX = (canvas.width - PaletaAnchura) / 2;
      }
    }
  }
  x += dx;
  y += dy;
  requestAnimationFrame(levelB);
}
//funcion que va validando si pasaste de nivel te lleva al nivel 2
const nivel2 = setInterval(function () {
  if (ganador === 1) {
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = 3;
    dy = -3;
    paddleX = (canvas.width - PaletaAnchura) / 2;
    comienzo2.play();
    level2();
    clearInterval(nivel2);
  }
}, 50);
const nivelB = setInterval(function () {
  if (secreto === 1) {
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = 3;
    dy = -3;
    bonusnivel.play();
    levelB();
    clearInterval(nivelB);
  }
}, 50);
