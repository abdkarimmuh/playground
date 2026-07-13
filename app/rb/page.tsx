import type { Metadata } from "next";

import { CodePlayground } from "@/components/playground/code-playground";

export const metadata: Metadata = {
  title: "Ruby"
};

const DEFAULT_CODE = `def fibonacci(n)
  return n if n <= 1
  fibonacci(n - 1) + fibonacci(n - 2)
end

puts "Hello, Ruby!"

(0..7).each do |i|
  puts "fibonacci(#{i}) = #{fibonacci(i)}"
end
`;

export default function RubyPlaygroundPage() {
  return (
    <CodePlayground
      language="ruby"
      storageKey="playground:rb"
      defaultCode={DEFAULT_CODE}
      title="Ruby Playground"
      description="Write Ruby, hit Run, and see console output on the right. Runs entirely in your browser via ruby.wasm (first run downloads the runtime, then it's cached)."
    />
  );
}
