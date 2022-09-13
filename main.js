const rows = 15;
const columns = 20;
const snake_lenth = 5;
const initial_direction = "right"; // right top botton left;

class Main {
  constructor() {
    this.start_matriz();
    this.display = new Display(this.matriz);
    this.snake = new Snake(snake_lenth);
    this.apple = new Apple(this.snake.corpo);
    this.state_loop();
    this.snake_direction();
  }
  state_loop() {
    const loop = setInterval(() => {
      this.reset_matriz();
      this.snake.to_forward();
      let state_apple = this.apple.position;
      let state_snake = this.snake.corpo;
      const head = state_snake[state_snake.length - 1];
      if (this.snake.grow_up) {
        state_apple = this.apple.to_emerge(state_snake);
        this.snake.grow_up = false;
      }
      if (head[0] === state_apple[0]
        && head[1] === state_apple[1]) {
        this.snake.grow_up = true;
      }
      if (this.snake.dead) {
        clearInterval(loop);
        console.error("Dead!")
        return;
      }
      state_snake.map((e) => { // insere a snake na matriz.
        this.matriz[e[0]].splice(e[1], 1, 1);
      });
      this.matriz[state_apple[0]].splice(state_apple[1], 1, 2); // insere a apple na matriz.
      this.display.update_display(this.matriz);
    }, 200);
  }
  snake_direction() {
    document.addEventListener('keydown', (event) => {
      if (event.key === "ArrowUp" || event.key === "w") {
        this.snake.top();
      } else if (event.key === "ArrowDown" || event.key === "s") {
        this.snake.botton();
      } else if (event.key === "ArrowRight" || event.key === "d") {
        this.snake.right();
      } else if (event.key === "ArrowLeft" || event.key === "a") {
        this.snake.left();
      }
    })
  }
  reset_matriz() {
    this.start_matriz();
  }
  start_matriz() {
    this.matriz = new Array(rows);
    for (let index_row = 0; index_row < rows; index_row++) {
      this.matriz[index_row] = [];
      for (let index_column = 0; index_column < columns; index_column++) {
        this.matriz[index_row][index_column] = 0;
      }
    }
  }
}

class Snake {
  constructor(length) {
    this.dead = false;
    this.direction = initial_direction; // + / - plano cartesiano;
    this.corpo = new Array();
    for (let i = 0; i < length; i++) {
      this.corpo.push([0, i]);
    }

    this.grow_up = false;
  }
  to_forward() {
    let head = this.corpo[this.corpo.length - 1];
    for (let index in this.corpo) {
      index = Number(index); // :-|
      if (this.corpo[index][0] === head[0]
        && this.corpo[index][1] === head[1]
        && index !== this.corpo.length - 1) {
        this.dead = true;
      }
    }
    if (!this.grow_up) {
      this.corpo.shift();
    }
    switch (this.direction) {
      case "right":
        if (head[1] === columns - 1) {
          this.corpo.push([
            head[0],
            0
          ]);
        } else {
          this.corpo.push([
            head[0],
            head[1] + 1
          ]);
        }
        break;
      case "left":
        if (head[1] === 0) {
          this.corpo.push([
            head[0],
            columns - 1
          ]);
        } else {
          this.corpo.push([
            head[0],
            head[1] - 1
          ]);
        }
        break;
      case "top":
        if (head[0] === 0) {
          this.corpo.push([
            rows - 1,
            head[1]
          ]);
        } else {
          this.corpo.push([
            head[0] - 1,
            head[1]
          ]);
        }
        break;
      case "botton":
        if (head[0] === rows - 1) {
          this.corpo.push([
            0,
            head[1]
          ]);
        } else {
          this.corpo.push([
            head[0] + 1,
            head[1]
          ]);
        }
        break;
      default:
        break;
    }
    return [...this.corpo]
  }
  top() {
    if (this.direction !== "botton") {
      this.direction = "top";
    }
  }
  botton() {
    if (this.direction !== "top") {
      this.direction = "botton";
    }
  }
  right() {
    if (this.direction !== "left") {
      this.direction = "right";
    }
  }
  left() {
    if (this.direction !== "right") {
      this.direction = "left";
    }
  }
}

class Apple {
  constructor(snake) {
    this.to_emerge(snake);
  }
  to_emerge(snake) {
    let found = false;
    do {
      this.position = this.position_random();
      for (let iten of snake) {
        if (iten[0] === this.position[0] && iten[1] === this.position[1]) {
          found = false;
          break;
        }
      }
      found = true;
    } while (!found);
    return [...this.position];
  }
  position_random() {
    return [Number((Math.random() * (rows - 1)).toFixed(0)),
    Number((Math.random() * (columns - 1)).toFixed(0))];
  }
}

class Display {
  constructor(matriz) {
    this.update_display(matriz);
  }
  update_display(matriz) {
    let display = document.querySelector('.tela');
    display.innerHTML = null;
    for (let row of matriz) {
      for (let iten_row of row) {
        let pixel = this.gera_pixel(iten_row);
        display.appendChild(pixel)
      }
    }
    // this.refreshCSS();
  }
  refreshCSS = () => {
    let links = document.getElementsByTagName('link');
    for (let i = 0; i < links.length; i++) {
      if (links[i].getAttribute('rel') == 'stylesheet') {
        let href = links[i].getAttribute('href')
          .split('?')[0];
        let data = new Date();
        let newHref = href + '?version='
          + data.getHours()
          + "."
          + data.getMinutes()
          + "."
          + data.getSeconds()
          + "."
          + data.getMilliseconds();

        links[i].setAttribute('href', newHref);
      }
    }
  }
  gera_pixel(key) {
    const div = document.createElement("div");
    div.classList.add("pixel");
    switch (key) {
      case 1:
        div.classList.add("pixel_on");
        break;
      case 2:
        div.classList.add("pixel_apple");
        break;
      default:
        break;
    }
    return div;
  }
}

const main = new Main();