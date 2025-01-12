import eslint from '@eslint/js';
import stylisticTs from '@stylistic/eslint-plugin-ts';
import tsParser from '@typescript-eslint/parser';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';
import airbnbConfig from 'eslint-config-airbnb-base';
export default [
  {
    ignores: [
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
    ]
  },
    eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    files: ["**/*.js", "**/*.ts", "**/*.tsx", "**/*.jsx"],
    plugins: {
      "@stylistic/ts": stylisticTs,
      "simple-import-sort": simpleImportSort,
      airbnbConfig: airbnbConfig,
    },

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
      "simple-import-sort/exports": "error",
      "airbnb-base/arrow-body-style": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  

];
