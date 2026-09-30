import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTypeScript,
  { ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"] },
  {
    files: [
      "src/components/ResponseParagraphAssistant.tsx",
      "src/components/ThemeToggle.tsx",
    ],
    // These effects restore browser-only localStorage state after SSR hydration.
    rules: { "react-hooks/set-state-in-effect": "off" },
  },
];

export default eslintConfig;
