import { buildConsoleBridgeScript } from "./bridge";

const PYODIDE_VERSION = "314.0.2";
const PYODIDE_BASE_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

export function buildPythonSandboxSrcDoc(code: string) {
  return `<!doctype html>
<html>
<head><meta charset="utf-8" /></head>
<body>
<script>
${buildConsoleBridgeScript()}
</script>
<script src="${PYODIDE_BASE_URL}pyodide.js"></script>
<script>
(async function () {
  post("log", ["Loading Python runtime\\u2026 (first run only, cached after)"]);
  try {
    const pyodide = await loadPyodide({ indexURL: "${PYODIDE_BASE_URL}" });
    pyodide.setStdout({ batched: (line) => post("log", [line]) });
    pyodide.setStderr({ batched: (line) => post("error", [line]) });
    await pyodide.runPythonAsync(${JSON.stringify(code)});
  } catch (err) {
    post("error", [String(err)]);
  }
})();
</script>
</body>
</html>`;
}
