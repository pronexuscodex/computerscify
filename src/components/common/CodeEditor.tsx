import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef, useMemo } from 'react';
import {
  Copy,
  Check,
  RotateCcw,
  Maximize2,
  Minimize2,
  Wand2,
  FileCode,
  CheckCircle2,
  XCircle,
  Sparkles
} from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-java';

export interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: 'python' | 'javascript' | 'typescript' | 'sql' | 'c' | 'cpp' | 'java' | string;
  onReset?: () => void;
  readOnly?: boolean;
  minHeight?: string;
  maxHeight?: string;
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
  testResults?: {
    passed: boolean;
    totalTests?: number;
    passedTests?: number;
    executionTimeMs?: number;
    isRunning?: boolean;
  } | null;
}

export interface CodeEditorRef {
  focus: () => void;
  setValue: (code: string) => void;
}

export const CodeEditor = forwardRef<CodeEditorRef, CodeEditorProps>(({
  value,
  onChange,
  language,
  onReset,
  readOnly = false,
  minHeight = '300px',
  maxHeight = '600px',
  placeholder = '// Write your code solution here...',
  className = '',
  ariaLabel = 'Code Editor',
  testResults,
}, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [activeLine, setActiveLine] = useState<number>(1);

  useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current?.focus(),
    setValue: (val: string) => onChange(val),
  }));

  // Map language prop to normalized Prism language name & grammar
  const { grammar, langName, displayName } = useMemo(() => {
    let raw = (language || 'python').toLowerCase().trim();
    let lang = 'python';
    let name = 'Python 3';

    if (raw === 'py' || raw === 'python') {
      lang = 'python';
      name = 'Python 3';
    } else if (raw === 'ts' || raw === 'typescript') {
      lang = 'typescript';
      name = 'TypeScript';
    } else if (raw === 'js' || raw === 'javascript') {
      lang = 'javascript';
      name = 'JavaScript (Node)';
    } else if (raw === 'c') {
      lang = 'c';
      name = 'C Language';
    } else if (raw === 'cpp' || raw === 'c++') {
      lang = 'cpp';
      name = 'C++';
    } else if (raw === 'sql') {
      lang = 'sql';
      name = 'SQL';
    } else if (raw === 'java') {
      lang = 'java';
      name = 'Java';
    } else {
      lang = 'javascript';
      name = raw.toUpperCase();
    }

    const g = Prism.languages[lang] || Prism.languages.javascript || Prism.languages.clike;
    return { grammar: g, langName: lang, displayName: name };
  }, [language]);

  // Compute syntax highlighted HTML from Prism
  const highlightedHtml = useMemo(() => {
    let codeStr = value || '';
    // Append space if ends with newline so pre element matches height
    if (codeStr.endsWith('\n')) {
      codeStr += ' ';
    }
    try {
      return Prism.highlight(codeStr, grammar, langName);
    } catch (err) {
      return codeStr
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }
  }, [value, grammar, langName]);

  // Update cursor line & col position
  const updateCursorPosition = () => {
    if (!textareaRef.current) return;
    const text = textareaRef.current.value;
    const selStart = textareaRef.current.selectionStart;

    const lines = text.substring(0, selStart).split('\n');
    const currentLineNumber = lines.length;
    const currentColNumber = lines[lines.length - 1].length + 1;

    setCursorPos({ line: currentLineNumber, col: currentColNumber });
    setActiveLine(currentLineNumber);
  };

  // Synchronize scrolling between textarea, pre highlight overlay, and gutter
  const handleScroll = () => {
    if (!textareaRef.current) return;
    const { scrollTop, scrollLeft } = textareaRef.current;
    if (preRef.current) {
      preRef.current.scrollTop = scrollTop;
      preRef.current.scrollLeft = scrollLeft;
    }
    if (gutterRef.current) {
      gutterRef.current.scrollTop = scrollTop;
    }
  };

  useEffect(() => {
    handleScroll();
  }, [value, language]);

  // Keyboard enhancements: Tab indent, Enter auto-indent & Auto-brackets
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (readOnly || !textareaRef.current) return;

    const textarea = textareaRef.current;
    const { selectionStart, selectionEnd, value: currentVal } = textarea;

    // Handle Tab key
    if (e.key === 'Tab') {
      e.preventDefault();
      const indent = '  '; // 2 spaces

      if (e.shiftKey) {
        // Unindent
        const linesBefore = currentVal.substring(0, selectionStart).split('\n');
        const currentLineIndex = linesBefore.length - 1;
        const allLines = currentVal.split('\n');
        
        if (allLines[currentLineIndex].startsWith(indent)) {
          allLines[currentLineIndex] = allLines[currentLineIndex].substring(indent.length);
          const newVal = allLines.join('\n');
          onChange(newVal);
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = Math.max(0, selectionStart - indent.length);
            updateCursorPosition();
          }, 0);
        }
      } else {
        // Indent
        const newVal = currentVal.substring(0, selectionStart) + indent + currentVal.substring(selectionEnd);
        onChange(newVal);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = selectionStart + indent.length;
          updateCursorPosition();
        }, 0);
      }
      return;
    }

    // Handle Enter key for intelligent auto-indentation
    if (e.key === 'Enter') {
      const linesBefore = currentVal.substring(0, selectionStart).split('\n');
      const currentLine = linesBefore[linesBefore.length - 1];
      const indentMatch = currentLine.match(/^(\s*)/);
      let indent = indentMatch ? indentMatch[1] : '';

      const trimmed = currentLine.trim();
      if (trimmed.endsWith(':') || trimmed.endsWith('{') || trimmed.endsWith('(') || trimmed.endsWith('[')) {
        indent += '  ';
      }

      if (indent.length > 0) {
        e.preventDefault();
        const newVal = currentVal.substring(0, selectionStart) + '\n' + indent + currentVal.substring(selectionEnd);
        onChange(newVal);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = selectionStart + 1 + indent.length;
          updateCursorPosition();
        }, 0);
        return;
      }
    }

    // Auto-close brackets & quotes / text selection wrapping
    const pairs: Record<string, string> = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
      "'": "'",
      '`': '`',
    };

    if (pairs[e.key]) {
      const openBracket = e.key;
      const closeBracket = pairs[e.key];

      // Wrap selected text in brackets/quotes
      if (selectionStart !== selectionEnd) {
        e.preventDefault();
        const selectedText = currentVal.substring(selectionStart, selectionEnd);
        const newVal =
          currentVal.substring(0, selectionStart) +
          openBracket +
          selectedText +
          closeBracket +
          currentVal.substring(selectionEnd);
        onChange(newVal);
        setTimeout(() => {
          textarea.selectionStart = selectionStart + 1;
          textarea.selectionEnd = selectionEnd + 1;
          updateCursorPosition();
        }, 0);
        return;
      }

      const nextChar = currentVal[selectionStart] || '';

      // Step over closing quote/bracket if cursor is right in front of it
      if (nextChar === closeBracket && openBracket === closeBracket) {
        e.preventDefault();
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 1;
        updateCursorPosition();
        return;
      }

      // Auto-close if next char is empty or space or punctuation
      if (!nextChar || /\s|\)|\]|\}|,|;/.test(nextChar)) {
        e.preventDefault();
        const newVal =
          currentVal.substring(0, selectionStart) +
          openBracket +
          closeBracket +
          currentVal.substring(selectionEnd);
        onChange(newVal);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = selectionStart + 1;
          updateCursorPosition();
        }, 0);
        return;
      }
    }

    // Backspace handling for empty bracket pairs
    if (e.key === 'Backspace' && selectionStart === selectionEnd && selectionStart > 0) {
      const charBefore = currentVal[selectionStart - 1];
      const charAfter = currentVal[selectionStart];
      if (pairs[charBefore] && pairs[charBefore] === charAfter) {
        e.preventDefault();
        const newVal = currentVal.substring(0, selectionStart - 1) + currentVal.substring(selectionStart + 1);
        onChange(newVal);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = selectionStart - 1;
          updateCursorPosition();
        }, 0);
      }
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  // Auto-format / cleanup trailing whitespace
  const handleFormat = () => {
    if (readOnly) return;
    const lines = value.split('\n');
    let formatted = lines
      .map((l) => l.trimEnd())
      .join('\n')
      .replace(/\n{3,}/g, '\n\n');
    onChange(formatted);
  };

  const linesCount = Math.max(1, value.split('\n').length);
  const lineNumbers = Array.from({ length: linesCount }, (_, i) => i + 1);

  return (
    <div
      className={`relative font-mono text-xs rounded-2xl border border-stone-800 bg-[#0d0c0c] text-stone-100 overflow-hidden brand-shadow transition-all ${
        isFullscreen ? 'fixed inset-4 z-[999] bg-[#0d0c0c] border-[#BE94F5]' : className
      }`}
    >
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#151313] border-b border-stone-800 select-none">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-[#BE94F5]" />
          <span className="font-bold text-[11px] uppercase tracking-wider text-stone-300">
            {displayName}
          </span>
          <span className="text-[10px] bg-stone-800 text-stone-400 px-2 py-0.5 rounded-full font-sans font-medium">
            UTF-8
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {!readOnly && (
            <button
              type="button"
              onClick={handleFormat}
              title="Format Code"
              className="p-1.5 hover:bg-stone-800 text-stone-400 hover:text-[#BE94F5] rounded-lg transition-colors flex items-center gap-1 text-[11px]"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Format</span>
            </button>
          )}

          {onReset && !readOnly && (
            <button
              type="button"
              onClick={onReset}
              title="Reset to Starter Code"
              className="p-1.5 hover:bg-stone-800 text-stone-400 hover:text-amber-400 rounded-lg transition-colors flex items-center gap-1 text-[11px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopy}
            title="Copy Code"
            className="p-1.5 hover:bg-stone-800 text-stone-400 hover:text-emerald-400 rounded-lg transition-colors flex items-center gap-1 text-[11px]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            className="p-1.5 hover:bg-stone-800 text-stone-400 hover:text-white rounded-lg transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Editor Body with Gutter and Overlay */}
      <div
        className="relative flex w-full overflow-hidden"
        style={{
          height: isFullscreen ? 'calc(100% - 70px)' : 'auto',
          minHeight,
          maxHeight: isFullscreen ? 'none' : maxHeight,
        }}
      >
        {/* Line Numbers Gutter */}
        <div
          ref={gutterRef}
          aria-hidden="true"
          className="select-none py-3 px-2 bg-[#121011] border-r border-stone-800/80 text-stone-600 text-right text-[11px] font-mono leading-relaxed overflow-hidden shrink-0 min-w-[42px]"
        >
          {lineNumbers.map((num) => (
            <div
              key={num}
              className={`transition-colors ${
                num === activeLine ? 'text-[#BE94F5] font-bold bg-[#BE94F5]/10 rounded px-1' : ''
              }`}
            >
              {num}
            </div>
          ))}
        </div>

        {/* Code Content Container */}
        <div
          className="relative flex-1 h-full min-w-0 overflow-hidden bg-[#0d0c0c] cursor-text"
          onClick={() => textareaRef.current?.focus()}
        >
          {/* Syntax Highlighted Code Background Overlay */}
          <pre
            ref={preRef}
            aria-hidden="true"
            className="absolute inset-0 m-0 p-3 pointer-events-none font-mono text-xs leading-relaxed whitespace-pre overflow-hidden bg-transparent select-none z-0"
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              fontSize: '13px',
              lineHeight: '1.625rem',
              tabSize: 2,
              MozTabSize: 2,
            }}
          >
            <code
              className={`language-${langName} text-[#f8f8f2]`}
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />
          </pre>

          {/* Interactive Monospace Code Textarea Input */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              updateCursorPosition();
            }}
            onKeyUp={updateCursorPosition}
            onClick={updateCursorPosition}
            onSelect={updateCursorPosition}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            readOnly={readOnly}
            placeholder={placeholder}
            aria-label={ariaLabel}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            rows={Math.max(10, linesCount)}
            className="code-editor-textarea absolute inset-0 w-full h-full m-0 p-3 font-mono text-xs leading-relaxed bg-transparent resize-none focus:outline-none whitespace-pre overflow-auto z-10"
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              fontSize: '13px',
              lineHeight: '1.625rem',
              tabSize: 2,
              MozTabSize: 2,
            }}
          />
        </div>
      </div>

      {/* Editor Footer Status Bar */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#121011] border-t border-stone-800 text-[10px] text-stone-500 font-mono select-none flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span>
            Ln {cursorPos.line}, Col {cursorPos.col}
          </span>
          <span>{value.length} chars</span>
        </div>
        <div className="flex items-center gap-2">
          {testResults ? (
            testResults.isRunning ? (
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-500/30">
                <Sparkles className="w-3 h-3 animate-spin text-amber-400" />
                Executing Tests...
              </span>
            ) : testResults.passed ? (
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-500/40">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Tests Passed {testResults.totalTests ? `(${testResults.passedTests ?? testResults.totalTests}/${testResults.totalTests})` : ''}
                {testResults.executionTimeMs !== undefined ? ` · ${testResults.executionTimeMs}ms` : ''}
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#FCCC42] bg-[#FCCC42]/10 px-2 py-0.5 rounded-md border border-[#FCCC42]/30">
                <XCircle className="w-3.5 h-3.5 text-[#FCCC42]" />
                Tests Failed {testResults.totalTests ? `(${testResults.passedTests ?? 0}/${testResults.totalTests})` : ''}
                {testResults.executionTimeMs !== undefined ? ` · ${testResults.executionTimeMs}ms` : ''}
              </span>
            )
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Editor Ready</span>
            </>
          )}
        </div>
      </div>

      {/* CSS for Prism Syntax Highlighting Themes, Text Selection Highlight & Placeholder Visibility */}
      <style>{`
        .code-editor-textarea {
          color: transparent !important;
          -webkit-text-fill-color: transparent !important;
          caret-color: #BE94F5 !important;
        }

        .code-editor-textarea::selection {
          background-color: rgba(190, 148, 245, 0.35) !important;
          color: transparent !important;
          -webkit-text-fill-color: transparent !important;
        }

        .code-editor-textarea::-moz-selection {
          background-color: rgba(190, 148, 245, 0.35) !important;
          color: transparent !important;
          -webkit-text-fill-color: transparent !important;
        }

        .code-editor-textarea::placeholder {
          color: #6e6b6b !important;
          -webkit-text-fill-color: #6e6b6b !important;
          opacity: 1 !important;
        }

        /* Syntax highlighting tokens */
        .token.comment, .token.prolog, .token.doctype, .token.cdata { color: #82E0AA; font-style: italic; }
        .token.punctuation { color: #CBD5E1; }
        .token.property, .token.tag, .token.boolean, .token.number, .token.constant, .token.symbol, .token.deleted { color: #FCCC42; font-weight: 600; }
        .token.selector, .token.attr-name, .token.string, .token.char, .token.builtin, .token.inserted { color: #F472B6; }
        .token.operator, .token.entity, .token.url, .language-css .token.string, .style .token.string { color: #A7F3D0; }
        .token.atrule, .token.attr-value, .token.keyword { color: #BE94F5; font-weight: bold; }
        .token.function, .token.class-name { color: #60A5FA; font-weight: bold; }
        .token.regex, .token.important, .token.variable { color: #F87171; }
        .token.type, .token.class { color: #38BDF8; font-weight: 600; }
        .token.important, .token.bold { font-weight: bold; }
        .token.italic { font-style: italic; }
      `}</style>
    </div>
  );
});

CodeEditor.displayName = 'CodeEditor';

