import type { Metadata } from "next";

import { CodePlayground } from "@/components/playground/code-playground";

export const metadata: Metadata = {
  title: "Python"
};

const DEFAULT_CODE = `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print("Hello, Python!")

for i in range(8):
    print(f"fibonacci({i}) =", fibonacci(i))
`;

export default function PythonPlaygroundPage() {
  return (
    <CodePlayground
      language="python"
      storageKey="playground:py"
      defaultCode={DEFAULT_CODE}
      title="Python Playground"
      description="Write Python, hit Run, and see console output on the right. Runs entirely in your browser via Pyodide (first run downloads the runtime, then it's cached)."
    />
  );
}
