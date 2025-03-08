import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import tsParser from '@typescript-eslint/parser';

export default [
    {
    ignores: [
      "drizzle.config.ts",
      "**/node_modules/*",
      "**/test-results/*",
      "**/coverage/*",
      "eslint.config.mjs",
      "tsconfig.json",
      "**/test/*",
      "**/dist/*",
      "**/build/*",
      // "**/test/*.spec.ts",
      "*.spec.ts",
      "*.e2e-spec.ts",
      "**/test/*.e2e-spec.ts",
      "**/test/**/*.e2e-spec.ts",
      "**/test/**/*.spec.ts",
      "**/test/**"
    ],
  },
  // { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
   {
    files: ["**/*.js", "**/*.ts", "**/*.tsx", "**/*.jsx"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "script",
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      "prettier/prettier": [
        "error",
        {},
        {
          "usePrettierrc": true,
        }
      ],
      "no-unused-vars": "off",
      // "no-undef": "off",
      "simple-import-sort/exports": "off",
      "airbnb-base/arrow-body-style": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];