import { CodePlayground } from "@/components/playground/code-playground";

const DEFAULT_CODE = `function fibonacci(n) {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}

console.log("Hello, JavaScript!")

for (let i = 0; i < 8; i++) {
  console.log(\`fibonacci(\${i}) =\`, fibonacci(i))
}

console.warn("This is a warning")
console.error("This is an error")
`;

export default function JavaScriptPlaygroundPage() {
  return (
    <CodePlayground
      language="javascript"
      storageKey="playground:js"
      defaultCode={DEFAULT_CODE}
      title="JavaScript Playground"
      description="Write JavaScript, hit Run, and see console output on the right. Your code runs entirely in your browser."
    />
  );
}
