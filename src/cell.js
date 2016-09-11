import View from './view';

export default class Cell extends View {
    constructor(opts) {
        const {board, x, y} = opts;
        super(opts);

        this._board = board;
        this._x = x;
        this._y = y;
        this.hasMine = false;
        this._revealed = false;
    }

    get _neighbors() {
        const array = [];
        for (let x = this._x - 1; x <= this._x + 1; x++) {
            for (let y = this._y - 1; y <= this._y + 1; y++) {
                if (x === this._x && y === this._y) continue;
                const cell = this._board.cellAt(x, y);
                if (cell) array.push(cell);
            }
        }
        return array;
    }

    get _neighboringMineCount() {
        return this._neighbors.reduce(0, (ct, cell) => ct + cell._hasMine);
    }
}


/*

function* () {
    for (let x = this._x - 1; x <= this._x + 1; x++) {
        for (let y = this._y - 1; y <= this._y + 1; y++) {
            if (x === this._x && y === this._y) continue;
            const cell = this._board.cellAt(x, y);
            if (cell) yield cell;
        }
    }
};

*/
