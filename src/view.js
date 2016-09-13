import Base, {staticAccumulator} from './base';

const $elementCache = new Map();

export default class View extends Base {
    static forElement($element) {
        // handle raw DOM too
        const element = $($element).closest('.view')[0];
        if (!element) return;
        return element._view;
    }

    static get _classNames() {
        return accumulateClassNames(this);
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

const accumulateClassNames = staticAccumulator(View, function (klass, parentItems=[]) {
    // new array to be sure to not mutate parent
    // future: hyphenate the name
    return [klass.name.toLowerCase(), ...parentItems];
});
