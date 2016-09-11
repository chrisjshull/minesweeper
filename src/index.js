
// import 'babel-polyfill';

import Board from './board';

const newGame = () => {
    $alert.css('color', null).text('There are 10 mines.');
    const board = new Board({width: 9, height: 9, mineCount: 10});

    board.observe('winState', winState => {
        // shouldn't need ot focus(), but screen reader doesn't always say without it
        // (it's also nice to bring focus close to the new game button
        $alert.text(winState === 'win' ? "You've won!" : "You've lost!");
        $alert.css('color', winState === 'win' ? "hsl(100, 46%, 35%)" : "hsl(11, 93%, 40%)");
        $alert.focus();
        return false;
    });

    $boardContainer.html('').append(board.$element);
};


const $boardContainer = $("<div>");
const $alert = $("<div tabindex='-1' role='alert'>");
const $newGameButton = $("<button>").text('New Game').on('click', newGame);

$('body').append(
    "<h1>Minesweeper</h1>",
    $('<div class="toolbar">').append($alert, $newGameButton),
    $boardContainer,
    // symbol not correctly falling back, have to manually change font
    "<footer><span style='font-family: sans-serif'>©</span> 2016 <a href='mailto:chrisjshull@gmail.com'>Chris J. Shull</a></footer>"
);

newGame();


