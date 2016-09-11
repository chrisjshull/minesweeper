
const classNameCache = new Map();
export default class View {
    static get template() {
        return "<div></div>";
    }

    static get _classNames() {
        const cached = classNameCache.get(this);
        if (cached) return cached;

        const parent = Object.getPrototypeOf(this);
        let classNames = parent._classNames || [];

        // concat() to be sure to not mutate parent
        // future: hyphenate the name
        classNames = classNames.concat(this.name.toLowerCase());

        classNameCache.set(this, classNames);
        return classNames;
    }

    constructor() {
        const $element = $(this.constructor.template);
        if ($element.length > 1) throw new Error('Templates must have a single root element.');

        this.$element = $element;
        this.$element[0].classList.add(...this.constructor._classNames);
        console.log(this.$element);
    }
}
