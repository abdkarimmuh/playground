import { buildConsoleBridgeScript } from "./bridge";

const WASI_SHIM_VERSION = "0.4.2";
const WASI_SHIM_MODULE_URL = `https://cdn.jsdelivr.net/npm/@bjorn3/browser_wasi_shim@${WASI_SHIM_VERSION}/+esm`;

/**
 * Runs Go source through our own `yaegi-runner.wasm` (public/wasm/), a Go
 * interpreter (github.com/traefik/yaegi) compiled with GOOS=wasip1. A fresh
 * WASI instance is created per Run — matching a wasip1 module's single-shot
 * `_start` semantics instead of the classic GOOS=js "block forever, poll for
 * a global" pattern. See wasm/yaegi-runner/main.go.
 */
export function buildGoSandboxSrcDoc(code: string) {
  return `<!doctype html>
<html>
<head><meta charset="utf-8" /></head>
<body>
<script type="module">
${buildConsoleBridgeScript()}

(async function () {
  try {
    const { WASI, File, OpenFile, ConsoleStdout } = await import("${WASI_SHIM_MODULE_URL}");
    const response = await fetch("/wasm/yaegi-runner.wasm");
    const module = await WebAssembly.compile(await response.arrayBuffer());

    const fds = [
      new OpenFile(new File([])),
      ConsoleStdout.lineBuffered((line) => post("log", [line])),
      ConsoleStdout.lineBuffered((line) => post("error", [line]))
    ];
    const wasi = new WASI(["yaegi-runner", ${JSON.stringify(code)}], [], fds);

    const instance = await WebAssembly.instantiate(module, {
      wasi_snapshot_preview1: wasi.wasiImport
    });
    wasi.start(instance);
  } catch (err) {
    post("error", [String(err)]);
  }
})();
</script>
</body>
</html>`;
}
