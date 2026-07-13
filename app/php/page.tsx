import type { Metadata } from "next";

import { CodePlayground } from "@/components/playground/code-playground";

export const metadata: Metadata = {
  title: "PHP"
};

const DEFAULT_CODE = `<?php

function fibonacci($n) {
    if ($n <= 1) return $n;
    return fibonacci($n - 1) + fibonacci($n - 2);
}

echo "Hello, PHP!\\n";

for ($i = 0; $i < 8; $i++) {
    echo "fibonacci($i) = " . fibonacci($i) . "\\n";
}
`;

export default function PhpPlaygroundPage() {
  return (
    <CodePlayground
      language="php"
      storageKey="playground:php"
      defaultCode={DEFAULT_CODE}
      title="PHP Playground"
      description="Write PHP, hit Run, and see console output on the right. Runs entirely in your browser via php-wasm (first run downloads the runtime, then it's cached)."
    />
  );
}
