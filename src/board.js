import Cell from './cell';
import View from './view';

export const thText = i => i >= 0 ? String.fromCharCode(i + 65) : '';

export default class Board extends View {
    static get observables() {
        return ['isReady', 'winState'];
    }

    get template() {
        // Set tabindex so there's always a way for the non-screenreader
        // keyboard user to focus the table (and get access to arrow controls).
        return '<div tabindex="0" role="grid"></div>';
    }

    constructor(opts) {
        const {width, height, mineCount} = opts;
        super(opts);

        this._mineCount = mineCount;
        this._width = width;
        this._height = height;
        this.isReady = false;
        this.winState = null;

        this._rows = this._generateRows(width, height);
        this._setupCells();

        this._addListeners();

        this.isReady = true;
    }

    _setupCells() {
        this._plantMines();

        // watch for possible gameover triggers
        for (const cell of this._eachCell()) {
            cell.observe('isRevealed', () => {
                if (cell.hasMine) {
                    this._gameOver(false);
                } else {
                    this._checkForWin();
                }

                return false;
            });
        }

        // set up DOM
        // Normally we'd want some role="columnheader" role="rowheader"
        // but we've added labels to the cells/buttons that cover that need (better)
        this.$element.append(
            $('<div aria-hidden="true">').append(
                ...arrayGenerate(this._width + 1, x => $('<div aria-hidden="true">').text(thText(x-1)))
            ),
            ...this._rows.map((row, y) => {
                return $('<div role="row">').append(
                    $('<div aria-hidden="true">').text(thText(y)),
                    ...row.map(cell => cell.$element)
                );
            })
        );

    }

    _addListeners() {
        this.$element.on('keydown', evt => {
            const isRTL = $('html[dir="rtl"]').length;

            const moveBy = (x, y) => {
                const view = View.forElement(document.activeElement);
                let newCell;
                if (view === this) {
                    newCell = this._rows[0][0];
                } else if (view instanceof Cell) {
                    newCell = this.cellAt(view.x + x, view.y + y, true);
                } else {
                    return;
                }
                newCell.focus();

                evt.preventDefault();
            };

            switch (evt.which) {
            case 37: // left
                moveBy(isRTL ? 1 : -1, 0);
                break;
            case 39: // right
                moveBy(isRTL ? -1 : 1, 0);
                break;
            case 38: // up
                moveBy(0, -1);
                break;
            case 40: // down
                moveBy(0, 1);
                break;
            }
        });
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
        if (this.winState) return;
        this.winState = hasWon ? 'win' : 'lose';

        for (const cell of this._eachCell()) {
            if (cell.hasMine) cell.reveal();
        }
    }

    get _eachCell() {
        return function* () {
            for (const row of this._rows) {
                for (const cell of row) yield cell;
            }
        };
    }

    cellAt(x, y, wrap=false) {
        if (wrap) {
            x = (x + this._width) % this._width;
            y = (y + this._height) % this._height;
        } else if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
            return null;
        }
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
