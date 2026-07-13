import type { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";

import type { ConsoleLevel } from "./sandbox/bridge";
import { buildGoSandboxSrcDoc } from "./sandbox/go";
import { buildJavaScriptSandboxSrcDoc } from "./sandbox/javascript";
import { buildPhpSandboxSrcDoc } from "./sandbox/php";
import { buildPythonSandboxSrcDoc } from "./sandbox/python";
import { buildRubySandboxSrcDoc } from "./sandbox/ruby";

export type PlaygroundLanguage =
  "javascript" | "typescript" | "python" | "ruby" | "go" | "php";

export type AppendLog = (level: ConsoleLevel, text: string) => void;

interface CompileContext {
  monaco: Monaco;
  model: editor.ITextModel | null;
  appendLog: AppendLog;
}

export interface LanguageConfig {
  monacoLanguage: string;
  /**
   * Only languages that need a transform before running as plain JS in the
   * shared JS sandbox define this (currently just TypeScript). Everything
   * else runs its own source as-is through its own sandbox document.
   */
  compileToJs?: (code: string, ctx: CompileContext) => Promise<string>;
  buildSandboxSrcDoc: (code: string) => string;
}

function markerSeverityToLevel(monaco: Monaco, severity: number): ConsoleLevel {
  return severity >= monaco.MarkerSeverity.Error ? "error" : "warn";
}

export function configureTypeScriptCompilerOptions(monaco: Monaco) {
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2020,
    module: monaco.languages.typescript.ModuleKind.None,
    esModuleInterop: true,
    strict: true
  });
}

async function compileTypeScript(
  code: string,
  { monaco, model, appendLog }: CompileContext
): Promise<string> {
  if (model) {
    const markers = monaco.editor.getModelMarkers({ resource: model.uri });
    for (const marker of markers) {
      const level = markerSeverityToLevel(monaco, marker.severity);
      appendLog(
        level,
        `TypeScript: Line ${marker.startLineNumber}, Col ${marker.startColumn}: ${marker.message}`
      );
    }
  }

  try {
    const ts = await import("typescript");
    const result = ts.transpileModule(code, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2020,
        module: ts.ModuleKind.None
      }
    });
    return result.outputText;
  } catch (error) {
    appendLog(
      "error",
      `Failed to compile TypeScript: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    return "";
  }
}

export const LANGUAGES: Record<PlaygroundLanguage, LanguageConfig> = {
  javascript: {
    monacoLanguage: "javascript",
    buildSandboxSrcDoc: buildJavaScriptSandboxSrcDoc
  },
  typescript: {
    monacoLanguage: "typescript",
    compileToJs: compileTypeScript,
    buildSandboxSrcDoc: buildJavaScriptSandboxSrcDoc
  },
  python: {
    monacoLanguage: "python",
    buildSandboxSrcDoc: buildPythonSandboxSrcDoc
  },
  ruby: {
    monacoLanguage: "ruby",
    buildSandboxSrcDoc: buildRubySandboxSrcDoc
  },
  go: {
    monacoLanguage: "go",
    buildSandboxSrcDoc: buildGoSandboxSrcDoc
  },
  php: {
    monacoLanguage: "php",
    buildSandboxSrcDoc: buildPhpSandboxSrcDoc
  }
};
