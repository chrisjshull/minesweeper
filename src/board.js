import Cell from './cell';
import View from './view';

export const thText = i => i >= 0 ? String.fromCharCode(i + 65) : '';

export default class Board extends View {
    static get observables() {
        return ['isReady'];
    }

    get template() {
        return '<div role="grid"></div>';
    }

    constructor(opts) {
        const {width, height, mineCount} = opts;
        super(opts);

        this._mineCount = mineCount;
        this._width = width;
        this._height = height;
        this.isReady = false;
        this._isOver = false;

        this._rows = this._generateRows(width, height);
        this._plantMines();

        // Normally we'd want some role="columnheader" role="rowheader"
        // but we've added labels to the cells/buttons that cover that need (better)
        this.$element.append(
            $('<div aria-hidden="true">').append(
                ...arrayGenerate(width + 1, x => $('<div aria-hidden="true">').text(thText(x-1)))
            ),
            ...this._rows.map((row, y) => {
                return $('<div role="row">').append(
                    $('<div aria-hidden="true">').text(thText(y)),
                    ...row.map(cell => cell.$element)
                );
            })
        );


        for (const cell of this._eachCell()) {
            cell.observe('isRevealed', isRevealed => {
                if (!isRevealed) return;

                if (cell.hasMine) {
                    this._gameOver(false);
                } else {
                    this._checkForWin();
                }

                return false;
            });
        }

        this.isReady = true;
    }

    _checkForWin() {
        // Clicking a mine triggers game over, so all we have to do here is check if
        // the unrevealed cell count === the mine count.
        let unrevealedCellCount = 0;
        for (const cell of this._eachCell()) {
            if (!cell.isRevealed) unrevealedCellCount++;
            if (unrevealedCellCount > this._mineCount) return;
        }

        this._gameOver(true);
    }

    _gameOver(hasWon) {
        if (this._isOver) return;
        this._isOver = true;
        // todo: remove all listeners

        alert(hasWon);
    }

    get _eachCell() {
        return function* () {
            for (const row of this._rows) {
                for (const cell of row) yield cell;
            }
        };
    }

    cellAt(x, y) {
        if (x < 0 || x >= this._width || y < 0 || y >= this._height) return null;
        return this._rows[y][x];
    }

    _plantMines() {
        const cells = [...this._eachCell()];
        let minesNeeded = this._mineCount;
        if (minesNeeded >= cells.length) {
            throw new Error(`Invalid number of mines (${minesNeeded}) requested for number of cells (${cells.length}).`);
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
