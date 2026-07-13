import { buildConsoleBridgeScript } from "./bridge";

const WASM_WASI_VERSION = "2.9.3-2.9.4";
const RUBY_WASM_VERSION = "2.9.3-2.9.4";
const RUBY_VM_MODULE_URL = `https://cdn.jsdelivr.net/npm/@ruby/wasm-wasi@${WASM_WASI_VERSION}/dist/browser/+esm`;
const RUBY_WASM_BINARY_URL = `https://cdn.jsdelivr.net/npm/@ruby/3.4-wasm-wasi@${RUBY_WASM_VERSION}/dist/ruby+stdlib.wasm`;

export function buildRubySandboxSrcDoc(code: string) {
  return `<!doctype html>
<html>
<head><meta charset="utf-8" /></head>
<body>
<script type="module">
${buildConsoleBridgeScript()}

// ruby.wasm's DefaultRubyVM defaults to printing stdout via console.log and
// stderr via console.warn (see @ruby/wasm-wasi's consolePrinter). The bridge
// above already routes console.log/warn/error into our postMessage channel,
// so Ruby output is captured with zero extra plumbing — we only remap
// console.warn to the "error" level here, since in this sandbox it's only
// ever used for Ruby's stderr.
console.warn = function () {
  post("error", arguments);
};

(async function () {
  post("log", ["Loading Ruby runtime\\u2026 (first run only, cached after)"]);
  try {
    const { DefaultRubyVM } = await import("${RUBY_VM_MODULE_URL}");
    const response = await fetch("${RUBY_WASM_BINARY_URL}");
    const module = await WebAssembly.compile(await response.arrayBuffer());
    const { vm } = await DefaultRubyVM(module);
    await vm.evalAsync(${JSON.stringify(code)});
  } catch (err) {
    post("error", [String(err)]);
  }
})();
</script>
</body>
</html>`;
}
