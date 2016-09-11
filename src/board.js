import Cell from './cell';
import View from './view';
import template from './board.html';

export default class Board extends View {
    static get template() {
        return template;
    }

    constructor(opts) {
        const {width, height, mineCount} = opts;
        super(opts);

        this._mineCount = mineCount;
        this._width = width;
        this._height = height;

        this._rows = this._generateRows(width, height);
        this._plantMines();
    }

    _plantMines() {
        const cells = flattened(this._rows);
        let minesNeeded = this._mineCount;
        if (minesNeeded > cells.length) {
            throw new Error(`More mines (${minesNeeded}) requested than cells (${cells.length}).`);
        }

        while (minesNeeded--) {
            const randomIndex = Math.floor(Math.random() * cells.length);
            const cell = cells[randomIndex];
            cell.hasMine = true;

            // Efficiently whittle down the pool of possible cells.
            // (This methodology avoids running the - albeit unlikely - risk
            // of randomly selecting the same item over and over.)
            // And cover the case where we just mined the last cell.
            if (cell.length === randomIndex - 1) {
                cells.pop();
            } else {
                cells[randomIndex] = cells.pop();
            }
        }
    }

    _generateRows(width, height) {
        let y = 0;
        return arrayGenerate(height, () => {
            const row = arrayGenerate(width, x => {
                return new Cell({board: this, x, y});
            });
            y++;
            return row;
        });
    }

    _logDebug() {
        console.table(this._rows.map(cells => {
            return cells.map(cell => cell.hasMine);
        }));
    }
}

const arrayGenerate = (len, cb) => {
    const array = new Array(len);
    for (let i = 0; i < len; i++) array[i] = cb(i);
    return array;
};

const flattened = array => {
    return [].concat(...array);
};
