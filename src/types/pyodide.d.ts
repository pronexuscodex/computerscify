interface PyodideStreamOptions {
  batched?: (text: string) => void;
  write?: (buffer: ArrayBuffer | string) => number;
}

interface PyodideApi {
  runPythonAsync(code: string): Promise<unknown>;
  setStdin(options: { isatty: boolean; error: boolean; read: () => string }): void;
  setStdout(options: PyodideStreamOptions): void;
  setStderr(options: PyodideStreamOptions): void;
}

interface Window {
  loadPyodide?: (options?: { indexURL?: string }) => Promise<PyodideApi>;
}
