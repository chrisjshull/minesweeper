
const loc = (keyOrNumber, ...args) => {
    if (typeof keyOrNumber === 'number') {
        return keyOrNumber.toLocaleString(loc('lang'), ...args);
    }
    return translations[keyOrNumber];
};

export default loc;

// todo: factor this out to a service.
const translations = {
    lang: "en",
    dir: "ltr",
    title: "Minesweeper",

    // symbol not correctly falling back, have to manually change font
    byline: "<span style='font-family: sans-serif'>©</span> 2016 Chris J. Shull",

    axisLabels: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",

    board: "board",

    newGame: "New Game",
    youWon: "You've won!",
    youLost: "You've lost!",
    startHelp: 'There are 10 mines.',
};
