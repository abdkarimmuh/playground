import type { Metadata } from "next";

import { CodePlayground } from "@/components/playground/code-playground";

export const metadata: Metadata = {
  title: "Go"
};

const DEFAULT_CODE = `package main

import "fmt"

func fibonacci(n int) int {
	if n <= 1 {
		return n
	}
	return fibonacci(n-1) + fibonacci(n-2)
}

func main() {
	fmt.Println("Hello, Go!")

	for i := 0; i < 8; i++ {
		fmt.Printf("fibonacci(%d) = %d\\n", i, fibonacci(i))
	}
}
`;

export default function GoPlaygroundPage() {
  return (
    <CodePlayground
      language="go"
      storageKey="playground:go"
      defaultCode={DEFAULT_CODE}
      title="Go Playground"
      description="Write a full Go program (package main + func main), hit Run, and see console output on the right. Runs entirely in your browser via a Go interpreter (Yaegi) compiled to WebAssembly."
    />
  );
}
