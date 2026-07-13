import { buildConsoleBridgeScript } from "./bridge";

const PHP_WASM_VERSION = "0.1.0";
const PHP_WEB_MODULE_URL = `https://cdn.jsdelivr.net/npm/php-wasm@${PHP_WASM_VERSION}/PhpWeb.mjs`;

export function buildPhpSandboxSrcDoc(code: string) {
  return `<!doctype html>
<html>
<head><meta charset="utf-8" /></head>
<body>
<script type="module">
${buildConsoleBridgeScript()}

// php-wasm's PhpWeb buffers stdout/stderr and flushes them as line-buffered
// "output"/"error" CustomEvents whose detail is a one-element [line] array
// (see php-wasm's OutputBuffer) — the same batched-line shape as Pyodide's
// setStdout/setStderr, so we just remap both into the shared bridge's post().
//
// PhpWeb._enqueue unconditionally wraps every run in
// navigator.locks.request('php-wasm-fs-lock', ...) to serialize filesystem
// access — but the Web Locks API throws a SecurityError in a sandboxed
// srcDoc iframe's opaque origin. A single ephemeral sandbox never has
// concurrent PHP runs to serialize, so we stub it out to just invoke the
// callback directly rather than loosening the iframe sandbox to fix it.
if (navigator.locks) {
  navigator.locks.request = function (name, optionsOrCallback, maybeCallback) {
    var callback = typeof optionsOrCallback === "function" ? optionsOrCallback : maybeCallback;
    return Promise.resolve(callback ? callback({ name: name, mode: "exclusive" }) : undefined);
  };
}

(async function () {
  post("log", ["Loading PHP runtime\\u2026 (first run only, cached after)"]);
  try {
    const { PhpWeb } = await import("${PHP_WEB_MODULE_URL}");
    const php = new PhpWeb();
    php.addEventListener("output", (event) => post("log", [event.detail[0]]));
    php.addEventListener("error", (event) => post("error", [event.detail[0]]));
    await php.run(${JSON.stringify(code)});
  } catch (err) {
    post("error", [String(err)]);
  }
})();
</script>
</body>
</html>`;
}
