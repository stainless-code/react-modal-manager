import antfu from "@antfu/eslint-config";

export default antfu({
  react: true,
  stylistic: false,
  ignores: ["README.md"],
  rules: {
    "jsonc/sort-keys": 0,
    "no-console": 0,
    "node/prefer-global/process": 0,
    "react-refresh/only-export-components": 0,
  },
});
