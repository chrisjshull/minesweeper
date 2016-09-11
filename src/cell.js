import View from './view';

import {thText} from './board';

export default class Cell extends View {
    static get observables() {
        return ['hasMine', 'isRevealed'];
    }

    get template() {
        return '<div role="gridcell" tabindex="-1"><button></button></div>';
    }

    constructor(opts) {
        const {board, x, y} = opts;
        super(opts);

        this._board = board;
        this.x = x;
        this.y = y;
        this.hasMine = false;
        this.isRevealed = false;

        // for spoken consistency, apply the label to both elements
        this.$element.find('button').add(this.$element).attr('aria-label', `${thText(x)} × ${thText(y)}`);

        this.$element.on('click', () => {
            this.reveal();

            if (this.hasMine) return; // no need to force focus on lose

            // force refocus to tickle screen reader
            setTimeout(() => {
                document.activeElement.blur();
                setTimeout(() => {
                    this.$element.focus();
                });
            });
        });

        board.observe('winState', () => {
            this.$element.find('button').attr('disabled', true);
        });
    }

    get _neighbors() {
        return function* () {
            for (let x = this.x - 1; x <= this.x + 1; x++) {
                for (let y = this.y - 1; y <= this.y + 1; y++) {
                    if (x === this.x && y === this.y) continue;
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

    focus() {
        if (!this.isRevealed) {
            this.$element.find('button').focus();
        } else {
            this.$element.focus();
        }
    }
}

