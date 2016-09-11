
// Create a base class since babel borks on `extends Object`
// which you might want for mixin purposes.

export default class Base {
    static get observables() {
        return [];
    }

    static get _observables() {
        return accumulateObservables(this);
    }

    constructor() {

        this._observers = {};

        // todo: future: investigate doing this just once on the prototype
        for (const key of this.constructor._observables) {
            this._observers[key] = new Set();

            if (key in this) {
                // todo
                throw new Error(`Observing properties with accessors not yet supported (key ${key}).`);
            }

            const sym = Symbol(key);
            Object.defineProperty(this, key, {
                enumerable: true,
                get() {
                    return this[sym];
                },
                set(newValue) {
                    const oldValue = this[sym];
                    if (oldValue === newValue) return;

                    this[sym] = newValue;

                    // Always async, for consistency.
                    // This could mean the value has changed again
                    // (but then it will fire again).
                    // In practice this should rarely be an issue
                    // and if so one can always access the property
                    // on the object.
                    setTimeout(() => {
                        this._observers[key].forEach(fcn => {
                            const result = fcn(newValue, oldValue, key, this);
                            if (result === false) this.unobserve(key, fcn);
                        });
                    });
                },
            });
        }
    }

    observe(key, fcn) {
        if (!this.constructor._observables.has(key)) {
            throw new Error(`Cannot observe key "${key}" on ${this}.`);
        }
        this._observers[key].add(fcn);
    }

    unobserve(key, fcn) {
        this._observers[key].delete(fcn);
    }
}

export const staticAccumulator = (baseClass, builder, useCache=true) => {
    const cache = useCache && new Map();
    return function accumulate(fromClass) {
        const cached = cache && cache.get(fromClass);
        if (cached) return cached;

        let parentItems;
        if (fromClass !== baseClass) {
            const parentClass = Object.getPrototypeOf(fromClass);
            parentItems = accumulate(parentClass);
        }
        const items = builder(fromClass, parentItems);

        if (cache) cache.set(fromClass, items);
        return items;
    };
};

const accumulateObservables = staticAccumulator(Base, function (klass, parentItems=new Set()) {
    return new Set([...klass.observables, ...parentItems]);
});
