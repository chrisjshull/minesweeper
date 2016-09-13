import loc from './loc';
import Board from './board';

const newGame = () => {
    $alert.css('color', '').text(loc('startHelp'));
    const board = new Board({width: 9, height: 9, mineCount: 10});

    board.observe('winState', winState => {
        const isWin = winState === 'win';
        // shouldn't need ot focus(), but screen reader doesn't always say without it
        // (it's also nice to bring focus close to the new game button
        $alert.text(isWin ? loc('youWon') : loc('youLost'));
        $alert.css('color', isWin ? "hsl(100, 46%, 35%)" : "hsl(11, 93%, 40%)");
        $alert.focus();

        if (!isWin) {
            $birds.addClass('show');
            setTimeout(() => {
                $birds.removeClass('show');
            }, 1000);
        }

        return false;
    });

    $boardContainer.html('').append(board.$element);
};


const $boardContainer = $("<div>");
const $alert = $("<div tabindex='-1' role='alert'>");
const $newGameButton = $("<button>").text(loc('newGame')).on('click', newGame);
const $birds = $("<img class='birds' src='img/mine.gif' alt=''>"); // no alt, just presentational


document.title = loc('title');
$('html').attr({
    lang: loc('lang'),
    dir: loc('dir'),
});
$('body').append(
    `<h1>${loc('title')}</h1>`,
    $('<div class="toolbar">').append($alert, $newGameButton),
    $boardContainer,
    `<footer>${loc('byline')}</footer>`,
    $birds
);


newGame();


