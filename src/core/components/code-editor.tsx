import { Editor as MonacoEditor } from "@monaco-editor/react";

export const Editor = ({
  height = "100vh",
  theme = "vs-dark",
  language = "yaml",
  value = "",
  onContentChange,
}: {
  height?: string;
  language?: string;
  theme?: string;
  value?: string;
  onContentChange?: (v: string) => void;
}) => {
  const handleEditorDidMount = (_editor: any, monaco: any) => {
    if (monaco) {
      // Keep existing HKR language registration
      monaco.languages.register({ id: "hkr" });
      monaco.languages.setMonarchTokensProvider("hkr", {
        tokenizer: {
          root: [
            [/\b(?:Table|Enum|Ref|TableGroup)\b/, "keyword"],
            [/\b(?:string|integer|boolean|date|float|decimal|text)\b/, "type"],
            [
              /\b(?:one|many|one_to_one|one_to_many|many_to_one|many_to_many)\b/,
              "relation",
            ],
            [/\b(?:true|false)\b/, "literal"],
            [/(".*?"|'.*?')/, "string"],
            [/--+.*/, "comment"],
            [/\/\*/, "comment", "@comment"],
          ],
          comment: [
            [/[^/*]+/, "comment"],
            [/\/\*/, "comment", "@push"],
            ["\\*/", "comment", "@pop"],
            [/[/*]/, "comment"],
          ],
        },
      });
      monaco.languages.setLanguageConfiguration("hkr", {
        comments: {
          lineComment: "--",
          blockComment: ["/*", "*/"],
        },
        brackets: [
          ["{", "}"],
          ["[", "]"],
          ["(", ")"],
        ],
        autoClosingPairs: [
          { open: "{", close: "}" },
          { open: "[", close: "]" },
          { open: "(", close: ")" },
          { open: '"', close: '"', notIn: ["string", "comment"] },
          { open: "'", close: "'", notIn: ["string", "comment"] },
        ],
        surroundingPairs: [
          { open: "{", close: "}" },
          { open: "[", close: "]" },
          { open: "(", close: ")" },
          { open: '"', close: '"' },
          { open: "'", close: "'" },
        ],
      });

      monaco.languages.registerCompletionItemProvider("hkr", {
        provideCompletionItems: (model: any, position: any) => {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };

          return {
            suggestions: [
              {
                label: "Table",
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: "Table",
                range,
              },
              {
                label: "Enum",
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: "Enum",
                range,
              },
              {
                label: "Ref",
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: "Ref",
                range,
              },
              {
                label: "TableGroup",
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: "TableGroup",
                range,
              },
              {
                label: "string",
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: "string",
                range,
              },
              {
                label: "integer",
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: "integer",
                range,
              },
              {
                label: "boolean",
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: "boolean",
                range,
              },
              {
                label: "date",
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: "date",
                range,
              },
              {
                label: "float",
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: "float",
                range,
              },
              {
                label: "decimal",
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: "decimal",
                range,
              },
              {
                label: "text",
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: "text",
                range,
              },
              {
                label: "one",
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: "one",
                range,
              },
              {
                label: "many",
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: "many",
                range,
              },
              {
                label: "one_to_one",
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: "one_to_one",
                range,
              },
              {
                label: "one_to_many",
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: "one_to_many",
                range,
              },
              {
                label: "many_to_one",
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: "many_to_one",
                range,
              },
              {
                label: "many_to_many",
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: "many_to_many",
                range,
              },
            ],
          };
        },
      });

      monaco.editor.defineTheme("hkrTheme", {
        base: "vs-dark",
        inherit: true,
        colors: {
          "editor.foreground": "#F8F8F2",
          "editor.background": "#282A36",
          "editorCursor.foreground": "#F8F8F0",
          "editor.lineHighlightBackground": "#3E4451",
          "editorLineNumber.foreground": "#6272A4",
          "editor.selectionBackground": "#44475A",
          "editor.inactiveSelectionBackground": "#44475A",
          "editorWhitespace.foreground": "#3B3A32",
        },

        rules: [
          { token: "comment", foreground: "059669", fontStyle: "italic" },
          { token: "keyword", foreground: "fb7185", fontStyle: "bold" },
          { token: "type", foreground: "fde047", fontStyle: "bold" },
          { token: "relation", foreground: "5eead4", fontStyle: "bold" },
          { token: "literal", foreground: "5eead4", fontStyle: "bold" },
          { token: "string", foreground: "5eead4" },
        ],
      });
      monaco.editor.setTheme("hkrTheme");
    }
  };

  const handleOnChange = (v: string | undefined) => {
    if (onContentChange && typeof v === "string") {
      onContentChange(v);
    }
  };

  return (
    <MonacoEditor
      onMount={handleEditorDidMount}
      height={height}
      theme={theme}
      language={language}
      value={value}
      onChange={handleOnChange}
    />
  );
};
