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
        "indent": [
            "error",
            4,
        ],
        "linebreak-style": [
            "error",
            "unix",
        ],
        "semi": [
            "error",
            "always",
        ],
        "comma-dangle": [
            "error",
            "always-multiline",
        ],

        // these stripped by tools
        "no-console": [0],
        "no-debugger": [0],
    },
};
