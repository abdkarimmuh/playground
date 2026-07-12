import type { Metadata } from "next";

import { CodePlayground } from "@/components/playground/code-playground";

export const metadata: Metadata = {
  title: "Typescript"
};

const DEFAULT_CODE = `interface User {
  name: string
  age: number
}

function greet(user: User): string {
  return \`Hello, \${user.name}! You are \${user.age} years old.\`
}

const user: User = { name: "Ada", age: 32 }

console.log(greet(user))

// Try changing a value below to see TypeScript's type checking in action:
// const invalid: User = { name: "Bug", age: "not a number" }
`;

export default function TypeScriptPlaygroundPage() {
  return (
    <CodePlayground
      language="typescript"
      storageKey="playground:ts"
      defaultCode={DEFAULT_CODE}
      title="TypeScript Playground"
      description="Write TypeScript with full type-checking, hit Run to transpile and execute it, and see console output on the right."
    />
  );
}
