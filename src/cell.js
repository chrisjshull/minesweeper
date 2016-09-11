import View from './view';
import template from './cell.html';

export default class Cell extends View {
    static get observables() {
        return ['hasMine', 'isRevealed'];
    }

    get template() {
        return template;
    }

    constructor(opts) {
        const {board, x, y} = opts;
        super(opts);

        this._board = board;
        this._x = x;
        this._y = y;
        this.hasMine = false;
        this.isRevealed = false;

        this.$element.on('click', () => {
            this.reveal();
        });

//         board.observe('isReady', isReady => {
//             if (!isReady) return;
//             // this.reveal();
//             return false; // stop observing
//         });
    }

    get _neighbors() {
        return function* () {
            for (let x = this._x - 1; x <= this._x + 1; x++) {
                for (let y = this._y - 1; y <= this._y + 1; y++) {
                    if (x === this._x && y === this._y) continue;
                    const cell = this._board.cellAt(x, y);
                    if (cell) yield cell;
                }
            }
        };
    }

    get _neighboringMineCount() {
        if (this.hasMine) return -1;
        return Array.from(this._neighbors()).reduce((ct, cell) => ct + cell.hasMine, 0);
    }

    reveal() {
        if (this.isRevealed) return;
        this.isRevealed = true;

        this.$element.off('click');

        const toShow = this.hasMine ? '💣' : (this._neighboringMineCount || '');
        this.$element.text(toShow)[0].dataset.shown = toShow;

        if (!toShow) {
            for (const cell of this._neighbors()) {
                cell.reveal();
            }
        }
    }
}

