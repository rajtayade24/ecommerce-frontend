import js from "@eslint/js";
import globals from "globals";

export default {
  ignores: ["dist"],
  extends: [js.configs.recommended, "plugin:react-hooks/recommended"],
  files: ["**/*.{js,jsx}"],
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    globals: globals.browser,
    ecmaFeatures: { jsx: true },
  },
  plugins: ["react-hooks", "react-refresh"],
  rules: {
    // allow react-refresh rule if plugin is installed
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    // you can add or adjust rules here
  },
};
