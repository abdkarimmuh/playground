import { buildConsoleBridgeScript, escapeClosingScriptTag } from "./bridge";

/** Used for both `javascript` and post-transpile `typescript` output. */
export function buildJavaScriptSandboxSrcDoc(code: string) {
  return `<!doctype html>
<html>
<head><meta charset="utf-8" /></head>
<body>
<script>
(function () {
${buildConsoleBridgeScript()}

  try {
    ${escapeClosingScriptTag(code)}
  } catch (err) {
    post("error", [err]);
  }
})();
</script>
</body>
</html>`;
}
