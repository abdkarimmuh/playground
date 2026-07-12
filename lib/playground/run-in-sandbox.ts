export type ConsoleLevel = "log" | "info" | "warn" | "error";

export interface SandboxLogMessage {
  level: ConsoleLevel;
  text: string;
}

const SANDBOX_SOURCE = "playground-sandbox";

export function parseSandboxMessage(data: unknown): SandboxLogMessage | null {
  if (typeof data !== "object" || data === null) {
    return null;
  }

  const record = data as Record<string, unknown>;

  if (
    record.source !== SANDBOX_SOURCE ||
    typeof record.text !== "string" ||
    typeof record.level !== "string"
  ) {
    return null;
  }

  if (
    record.level !== "log" &&
    record.level !== "info" &&
    record.level !== "warn" &&
    record.level !== "error"
  ) {
    return null;
  }

  return { level: record.level, text: record.text };
}

function escapeClosingScriptTag(code: string) {
  return code.replace(/<\/script/gi, "<\\/script");
}

export function buildSandboxSrcDoc(code: string) {
  return `<!doctype html>
<html>
<head><meta charset="utf-8" /></head>
<body>
<script>
(function () {
  function serialize(value, seen) {
    if (typeof value === "string") return value;
    if (typeof value === "function") {
      return "ƒ " + (value.name || "anonymous") + "()";
    }
    if (typeof value === "bigint") return value.toString() + "n";
    if (value instanceof Error) {
      return value.stack || value.name + ": " + value.message;
    }
    if (value === null || typeof value !== "object") return String(value);

    seen = seen || new WeakSet();
    if (seen.has(value)) return "[Circular]";
    seen.add(value);

    try {
      return JSON.stringify(
        value,
        function (key, val) {
          if (typeof val === "function") {
            return "ƒ " + (val.name || "anonymous") + "()";
          }
          if (typeof val === "bigint") return val.toString() + "n";
          if (typeof val === "object" && val !== null) {
            if (val !== value && seen.has(val)) return "[Circular]";
            seen.add(val);
          }
          return val;
        },
        2
      );
    } catch (err) {
      return String(value);
    }
  }

  function post(level, args) {
    var text = Array.prototype.map
      .call(args, function (arg) {
        return serialize(arg);
      })
      .join(" ");
    parent.postMessage({ source: "${SANDBOX_SOURCE}", level: level, text: text }, "*");
  }

  console.log = function () {
    post("log", arguments);
  };
  console.info = function () {
    post("info", arguments);
  };
  console.warn = function () {
    post("warn", arguments);
  };
  console.error = function () {
    post("error", arguments);
  };

  window.addEventListener("error", function (event) {
    post("error", [event.error || event.message]);
    event.preventDefault();
  });
  window.addEventListener("unhandledrejection", function (event) {
    post("error", ["Uncaught (in promise) " + serialize(event.reason)]);
  });

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
