import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import shadcnLint from "@shadcn/lint";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      "shadcn": shadcnLint,
    },
    rules: {
      "shadcn/no-arbitrary-values": "warn",
      "shadcn/no-raw-colors": "warn",
      "shadcn/no-inline-styles": "error",
      "shadcn/require-static-classes": "error",
      "shadcn/no-unknown-classes": "error",
      "shadcn/no-restyle": ["warn", {
        allow: ["layout"],
        contracts: [
          { pattern: "^Button$", allow: ["w-full", "mt-*", "mb-*"] },
          { pattern: "^Modal$", allow: ["layout"] }
        ]
      }]
    }
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
