import Base from './base';

const classNameCache = new Map();
const $elementCache = new Map();

// const Obs = Superclass => class extends Superclass {
//     constructor() {
//         super(...arguments);
//         this._observableKeys = new Set();
//     }
//
//     observe(key) {
//
//     }
// };

// mix(Base).with(Obs)

export default class View extends Base {
    static forElement($element) {
        // handle raw DOM too
        const element = $($element).closest('.view')[0];
        if (!element) return;
        return element._view;
    }

    static get _classNames() {
        const cached = classNameCache.get(this);
        if (cached) return cached;

        const parent = Object.getPrototypeOf(this);
        let classNames = parent._classNames || [];

        // new array to be sure to not mutate parent
        // todo: future: hyphenate the name
        classNames = [this.name.toLowerCase(), ...classNames];

        classNameCache.set(this, classNames);
        return classNames;
    }

    get template() {
        return "<div>n/a</div>";
    }

    constructor() {
        super();

        // cache an element to deep cline to avoid
        // html parsing hit over and over
        let $element;
        const $cachedElement = $elementCache.get(this);
        if ($cachedElement) {
            $element = $cachedElement.clone();
        } else {
            $element = $(this.template);
            if ($element.length !== 1) throw new Error('Templates must have a single root element.');

            $element[0].classList.add(...this.constructor._classNames);
            $elementCache.set(this, $element.clone());
        }

        this.$element = $element;
        $element[0]._view = this;
    }
}
