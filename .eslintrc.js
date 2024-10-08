module.exports = {
  parser: "@babel/eslint-parser",
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
    es2021: true
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended"
  ],
  plugins: [
    "react",
    "react-hooks",
    "jsx-a11y",
  ],
  rules: {
    strict: 0,
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  },
  settings: {
    react: {
      version: "detect"
    }
  }
}