import { defineConfig, globalIgnores } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores([
    "src/build/",
    "src/dist/",
    "src/node_modules/",
    "src/environments",
  ]),
  {
    files: ["**/*.ts"],

    extends: compat.extends(
      "plugin:@angular-eslint/recommended",
      "plugin:@angular-eslint/template/process-inline-templates",
    ),

    languageOptions: {
      ecmaVersion: 5,
      sourceType: "script",

      parserOptions: {
        project: ["**/tsconfig.json"],
        createDefaultProgram: true,
      },
    },

    rules: {
      "@angular-eslint/no-output-native": "off",
      "@angular-eslint/no-input-rename": "off",
      "@angular-eslint/no-host-metadata-property": "off",
    },
  },
  {
    files: ["**/*.html"],
    extends: compat.extends("plugin:@angular-eslint/template/recommended"),

    rules: {
      "@angular-eslint/template/eqeqeq": "off",
    },
  },
]);
