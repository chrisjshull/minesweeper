
// import 'babel-polyfill';

import Board from './board';

const board = new Board({width: 9, height: 9, mineCount: 10});

$('body').append("<h1>Minesweeper</h1>")
    .append(board.$element);
