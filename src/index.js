
// import 'babel-polyfill';

import Board from './board';

const board = new Board({width: 9, height: 9, mineCount: 1});

$('body').append(board.$element);
