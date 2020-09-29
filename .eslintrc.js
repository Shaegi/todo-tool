module.exports = {
  extends: "erb/typescript",
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    "import/no-extraneous-dependencies": "off",
    "react/prop-types": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "import/no-cycle": "off",
    "jsx-a11y/accessible-emoji": "warn",
    "react-hooks/exhaustive-deps": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "react/destructuring-assignment": "off",
    "jsx-a11y/label-has-associated-control": "warn",
    "jsx-a11y/no-noninteractive-element-interactions": "off",
    "jsx-a11y/click-events-have-key-events": "warn",
    "@typescript-eslint/ban-types": "off",
    "no-shadow": "off",
    "react/jsx-curly-newline": "off",
    "react/jsx-one-expression-per-line": "off",
    "no-restricted-globals": "off",
    "react/state-in-constructor": "off",
    "no-nested-ternary": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "react/jsx-props-no-spreading": "off",
    "no-param-reassign": "off",
    "no-plusplus": "off",
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  settings: {
    "import/resolver": {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve("./configs/webpack.config.eslint.js"),
      },
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
  },
}
