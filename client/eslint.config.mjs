import { defineConfig, globalIgnores } from "eslint/config";
import angular from "angular-eslint";

export default defineConfig([
  globalIgnores([
    "src/build/",
    "src/dist/",
    "src/node_modules/",
    "src/environments",
  ]),
  {
    files: ["**/*.ts"],
    extends: [angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    languageOptions: {
      parserOptions: {
        project: ["**/tsconfig.json"],
      },
    },
    rules: {
      "@angular-eslint/no-output-native": "off",
      "@angular-eslint/no-input-rename": "off",
      "@angular-eslint/no-host-metadata-property": "off",
      // Eager z automatické migrace zachovává dosavadní chování komponent.
      "@angular-eslint/prefer-on-push-component-change-detection": "off",
    },
  },
  {
    files: ["**/*.html"],
    extends: [angular.configs.templateRecommended],
    rules: {
      "@angular-eslint/template/eqeqeq": "off",
    },
  },
]);
