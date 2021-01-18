'use strict';

class Puzzle {
  constructor() {
    this.remember_time = 5; // 5 seconds
    this.game_size = 16;
    this.game_intro = document.querySelector('.game-intro');
    this.game_finished = document.querySelector('.game-finished');
    this.game_board = document.querySelector('.game-board');
    this.game_items_container = document.querySelector('.game-items');
    this.remember_timer = document.getElementById('remember-timer');
    this.remember_title = document.getElementById('remember-title');
    this.started_title = document.getElementById('started-title');
    this.guess_src = './assets/images/guess.png';
    this.solved = 0;
    this.choice_one = null;
    this.choice_two = null;
  }

  createBoard(items) {
    this.game_items_container.innerHTML = items;
  }

  createItem(n) {
    return `
      <div class="item">
        <img data-unique="${n}-${Math.random()}" data-match="${n}" src="./assets/images/animal-${n}.png" alt="item">
      </div>
    `;
  }

  createRandom() {
    var arr = [];
    var loop = 1;
    do {
      for (var i = 1; i <= this.game_size / 2; i++) {
        arr.push(i);
      }
      loop += 1;
    } while (loop === this.game_size / (this.game_size / 2));
    return arr.sort(() => Math.random() - 0.5);
  }

  addItemsToBoard() {
    var html = '';
    var random = this.createRandom();
    for (var i = 0; i < this.game_size; i++) {
      html += this.createItem(random[i]);
    }
    this.createBoard(html);
  }

  convertItemsToGuess() {
    var items = document.querySelectorAll('.game-items > .item > img');
    for (var i = 0; i < items.length; i++) {
      items[i].src = this.guess_src;
    }
    this.remember_title.classList.add('none');
    this.started_title.classList.remove('none');
    this.makeItemsClickable();
  }

  rememberTimeout() {
    if (this.remember_time === -1) {
      this.remember_time = 5;
      this.convertItemsToGuess();
    } else {
      setTimeout(() => {
        this.remember_timer.innerText = `(${this.remember_time})`;
        this.remember_time -= 1;
        this.rememberTimeout();
      }, 1000);
    }
  }

  makeItemsClickable() {
    var items = document.querySelectorAll('.game-items > .item > img');
    for (var i = 0; i < items.length; i++) {
      items[i].onclick = (e) => game.itemSelected(e);
    }
  }

  compareItems() {
    var itemOne = document.querySelector(`img[data-unique="${this.choice_one.unique}"]`);
    var itemTwo = document.querySelector(`img[data-unique="${this.choice_two.unique}"]`);
    if (this.choice_one.match === this.choice_two.match) {
      itemOne.classList.add('done');
      itemOne.onclick = '';
      itemTwo.classList.add('done');
      itemTwo.onclick = '';
      this.checkHasFinished()
    } else {
      itemOne.src = this.guess_src;
      itemTwo.src = this.guess_src;
    }
    this.choice_one = null;
    this.choice_two = null;
  }

  itemSelected(e) {
    var elm = e.target;
    var match = elm.dataset.match;
    var unique = elm.dataset.unique;
    elm.src = e.target.src.replace('guess', `animal-${match}`);
    if (this.choice_one === null && this.choice_two === null) {
      this.choice_one = {
        match: match,
        unique: unique
      }
    } else if (this.choice_one !== null && this.choice_two === null) {
      this.choice_two = {
        match: match,
        unique: unique
      }
      setTimeout(() => {
        this.compareItems();
      }, 1000);
    }
  }

  checkHasFinished() {
    var state = false;
    var items = document.querySelectorAll('.game-items > .item > img');
    for (var i = 0; i < items.length; i++) {
      if (items[i].getAttribute('class') === 'done') {
        state += 1;
      }
    }
    if (state === this.game_size) {
      this.game_board.classList.add('none');
      this.game_finished.classList.remove('none');
    }
  }

  startGame() {
    this.game_intro.classList.add('none');
    this.game_board.classList.remove('none');
    this.game_finished.classList.add('none');
    this.remember_title.classList.remove('none');
    this.started_title.classList.add('none');
    this.addItemsToBoard();
    this.rememberTimeout();
  }
}

var game = new Puzzle();
