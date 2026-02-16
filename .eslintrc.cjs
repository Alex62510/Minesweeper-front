module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: ["react", "@typescript-eslint", "prettier", "react-hooks"],
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended"
    ],
    rules: {
        "prettier/prettier": ["error", { endOfLine: "auto" }],
        "react/react-in-jsx-scope": "off",
    },
    settings: {
        react: {
            version: "detect",
        },
    },
};
