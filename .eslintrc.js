module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "jquery": true,
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module",
    },
    "rules": {
        "indent": ["error", 4],
        "linebreak-style": ["error", "unix"],
        "semi": ["error", "always"],
        "comma-dangle": ["error", "always-multiline"],
        "space-before-function-paren": ["error", {"anonymous": "always", "named": "never"}],
        "keyword-spacing": ["error", {"before": true, "after": true}],
        "brace-style": ["error", "1tbs"],
        "space-before-blocks": ["error", "always"],
        "comma-spacing": ["error", {"before": false, "after": true}],
        "array-bracket-spacing": ["error", "never"],
        "object-curly-spacing": ["error", "never"],

        // future: these stripped by tools
        "no-console": [0],
        "no-debugger": [0],
    },
};
