"use client";

import Editor, { type Monaco, type OnMount } from "@monaco-editor/react";
import { Eraser, Play, RotateCcw } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  configureTypeScriptCompilerOptions,
  LANGUAGES,
  type PlaygroundLanguage
} from "@/lib/playground/languages";
import {
  type ConsoleLevel,
  parseSandboxMessage
} from "@/lib/playground/sandbox/bridge";
import { cn } from "@/lib/utils";

interface CodePlaygroundProps {
  language: PlaygroundLanguage;
  storageKey: string;
  defaultCode: string;
  title: string;
  description: string;
}

interface LogEntry {
  id: string;
  level: ConsoleLevel;
  text: string;
}

const LEVEL_CLASS: Record<ConsoleLevel, string> = {
  log: "text-foreground",
  info: "text-blue-600 dark:text-blue-400",
  warn: "text-amber-600 dark:text-amber-400",
  error: "text-destructive"
};

function readStoredCode(storageKey: string, defaultCode: string) {
  if (typeof window === "undefined") {
    return defaultCode;
  }
  return window.localStorage.getItem(storageKey) ?? defaultCode;
}

export function CodePlayground({
  language,
  storageKey,
  defaultCode,
  title,
  description
}: CodePlaygroundProps) {
  const { resolvedTheme } = useTheme();
  const [code, setCode] = React.useState(() =>
    readStoredCode(storageKey, defaultCode)
  );
  const [logs, setLogs] = React.useState<LogEntry[]>([]);
  const [srcDoc, setSrcDoc] = React.useState("");
  const [runKey, setRunKey] = React.useState(0);

  const monacoRef = React.useRef<Monaco | null>(null);
  const editorRef = React.useRef<Parameters<OnMount>[0] | null>(null);
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null);

  const appendLog = React.useCallback((level: ConsoleLevel, text: string) => {
    setLogs((prev) => [...prev, { id: crypto.randomUUID(), level, text }]);
  }, []);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      window.localStorage.setItem(storageKey, code);
    }, 300);
    return () => clearTimeout(timeout);
  }, [code, storageKey]);

  React.useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.source !== iframeRef.current?.contentWindow) return;
      const message = parseSandboxMessage(event.data);
      if (!message) return;
      appendLog(message.level, message.text);
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [appendLog]);

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    if (language === "typescript") {
      configureTypeScriptCompilerOptions(monaco);
    }
  };

  async function resolveCodeToRun(): Promise<string> {
    const config = LANGUAGES[language];
    if (!config.compileToJs) {
      return code;
    }

    const monaco = monacoRef.current;
    if (!monaco) {
      return code;
    }

    return config.compileToJs(code, {
      monaco,
      model: editorRef.current?.getModel() ?? null,
      appendLog
    });
  }

  async function handleRun() {
    setLogs([]);
    const codeToRun = await resolveCodeToRun();
    setSrcDoc(LANGUAGES[language].buildSandboxSrcDoc(codeToRun));
    setRunKey((key) => key + 1);
  }

  function handleReset() {
    setCode(defaultCode);
    window.localStorage.removeItem(storageKey);
    setLogs([]);
    setSrcDoc("");
  }

  function handleClear() {
    setLogs([]);
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-medium">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handleRun}>
            <Play /> Run
          </Button>
          <Button size="sm" variant="outline" onClick={handleClear}>
            <Eraser /> Clear
          </Button>
          <Button size="sm" variant="ghost" onClick={handleReset}>
            <RotateCcw /> Reset
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="overflow-hidden rounded-md border">
          <Editor
            height="65vh"
            language={LANGUAGES[language].monacoLanguage}
            value={code}
            onChange={(value) => setCode(value ?? "")}
            onMount={handleEditorMount}
            theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              scrollBeyondLastLine: false,
              automaticLayout: true
            }}
          />
        </div>

        <div className="flex h-[65vh] flex-col overflow-hidden rounded-md border bg-card">
          <div className="border-b px-3 py-2 text-xs font-medium text-muted-foreground">
            Console
          </div>
          <div className="flex-1 overflow-auto p-3 font-mono text-xs">
            {logs.length === 0 ? (
              <p className="text-muted-foreground">
                Click Run to see output here.
              </p>
            ) : (
              logs.map((entry) => (
                <pre
                  key={entry.id}
                  className={cn(
                    "mb-1 whitespace-pre-wrap",
                    LEVEL_CLASS[entry.level]
                  )}
                >
                  {entry.text}
                </pre>
              ))
            )}
          </div>
        </div>
      </div>

      <iframe
        key={runKey}
        ref={iframeRef}
        srcDoc={srcDoc}
        sandbox="allow-scripts"
        className="hidden"
        title="Sandbox output"
      />
    </div>
  );
}
