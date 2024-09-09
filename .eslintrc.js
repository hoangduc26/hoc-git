module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "airbnb",
        "airbnb/hooks",
        "prettier",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: ["react", "react-hooks", "prettier", "@typescript-eslint"],
    settings: {
        "import/resolver": {
            node: {
                extensions: [".ts", ".tsx"],
            },
        },
    },
    overrides: [
        {
            files: ["*.ts", "*.tsx"],
            // Your TypeScript files extension
            parserOptions: {
                project: "./tsconfig.json", // Specify it only for TypeScript files
                tsconfigRootDir: __dirname,
            },
            extends: "airbnb-typescript",
            rules: {
                "no-param-reassign": [2, { props: false }],
                "import/order": [
                    "error",
                    {
                        groups: [["builtin", "external"]],
                        "newlines-between": "never",
                    },
                ],
                "import/no-extraneous-dependencies": [
                    "error",
                    {
                        devDependencies: [
                            "src/setupTests.ts",
                            "src/**/*.test.{ts,tsx}",
                        ],
                    },
                ],
                "react/function-component-definition": 0,
                // indent: "off",
                "no-unused-vars": "off",
                "jsx-a11y/click-events-have-key-events": "off",
                "jsx-a11y/no-noninteractive-element-interactions": "off",
                "import/prefer-default-export": "off",
                "react/jsx-props-no-spreading": "off",
                "react/require-default-props": "off",
                "react/no-unused-prop-types": "off",
                "react/prop-types": "off",
                "jsx-a11y/interactive-supports-focus": "off",
                "@typescript-eslint/no-use-before-define": "off",
                "@typescript-eslint/no-unused-vars": "off",
                "@typescript-eslint/no-explicit-any": "off",
                "@typescript-eslint/no-empty-interface": "off",
                "@typescript-eslint/indent": "off",
                "@typescript-eslint/ban-ts-comment": "off",
                "@typescript-eslint/ban-ts-ignore": "off",
                "@typescript-eslint/quotes": [
                    "error",
                    "single",
                    {
                        allowTemplateLiterals: true,
                    },
                ],
            },
        },
    ],
    rules: {
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "off",
        quotes: [2, "double", { avoidEscape: true }],
        "no-duplicate-imports": "error",
        camelcase: "error",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/ban-ts-ignore": "off",
        "spaced-comment": "error",
        "import/no-extraneous-dependencies": [
            "error",
            {
                devDependencies: ["scripts/**/*"],
            },
        ],
        "import/order": [
            "error",
            {
                groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
                "newlines-between": "always",
            },
        ],
        indent: [0, "tab"],
    },
};
