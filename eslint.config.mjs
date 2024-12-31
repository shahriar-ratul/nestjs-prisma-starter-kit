import eslint from '@eslint/js';
import stylisticTs from '@stylistic/eslint-plugin-ts';
import tsParser from '@typescript-eslint/parser';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';
import airbnbConfig from 'eslint-config-airbnb-base';
export default [
    eslint.configs.recommended,
  ...tseslint.configs.recommended,
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
    ],
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
      ...eslintPluginPrettier.configs.recommended.rules,
      "simple-import-sort/exports": "error",
      "airbnb-base/arrow-body-style": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "prettier/prettier": [
        "error",
        {
         
        },
        {
          usePrettierrc: true,
        }
      ],
 
    },
  },

];
