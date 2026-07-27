export interface JavaScriptSandboxResult {
  stdout: string;
  returnValue?: string;
  error?: string;
}

const SANDBOX_MESSAGE_TYPE = 'computerfy-js-sandbox';

function createSandboxDocument(): string {
  const script = `
    const MESSAGE_TYPE = ${JSON.stringify(SANDBOX_MESSAGE_TYPE)};

    function stringify(value) {
      if (value === undefined) return undefined;
      if (typeof value === 'string') return value;
      try {
        return JSON.stringify(value);
      } catch {
        return String(value);
      }
    }

    window.addEventListener('message', (event) => {
      const payload = event.data;
      if (!payload || payload.type !== MESSAGE_TYPE) return;

      const logs = [];
      const sandboxConsole = {
        log: (...args) => logs.push(args.map(stringify).join(' ')),
        error: (...args) => logs.push('ERROR: ' + args.map(stringify).join(' ')),
        warn: (...args) => logs.push('WARN: ' + args.map(stringify).join(' ')),
        info: (...args) => logs.push(args.map(stringify).join(' ')),
      };
      const mockFs = {
        readFileSync: () => payload.inputData,
      };
      const mockProcess = {
        exit: (code = 0) => {
          throw { __computerfyProcessExit: true, exitCode: code };
        },
        stdin: {
          on: (name, callback) => {
            if (name === 'data') callback(payload.inputData);
            if (name === 'end') callback();
          },
        },
      };
      const mockRequire = (moduleName) => moduleName === 'fs' ? mockFs : {};

      try {
        const evaluator = new Function(
          'console',
          'require',
          'process',
          'fs',
          'inputData',
          'input',
          '"use strict";\\n' + payload.code
        );
        const value = evaluator(
          sandboxConsole,
          mockRequire,
          mockProcess,
          mockFs,
          payload.inputData,
          payload.inputData
        );
        parent.postMessage({
          type: MESSAGE_TYPE,
          token: payload.token,
          stdout: logs.join('\\n'),
          returnValue: stringify(value),
        }, '*');
      } catch (error) {
        if (error && error.__computerfyProcessExit) {
          parent.postMessage({
            type: MESSAGE_TYPE,
            token: payload.token,
            stdout: logs.join('\\n'),
          }, '*');
          return;
        }
        parent.postMessage({
          type: MESSAGE_TYPE,
          token: payload.token,
          stdout: logs.join('\\n'),
          error: error && error.message ? error.message : String(error),
        }, '*');
      }
    });
  `;

  return `<!doctype html><html><body><script>${script.replace(/<\/script/gi, '<\\/script')}<\/script></body></html>`;
}

export function runJavaScriptInSandbox(
  code: string,
  inputData = '',
  timeoutMs = 3000
): Promise<JavaScriptSandboxResult> {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe');
    const token = crypto.randomUUID();
    let settled = false;

    iframe.setAttribute('sandbox', 'allow-scripts');
    iframe.setAttribute('aria-hidden', 'true');
    iframe.tabIndex = -1;
    iframe.style.display = 'none';
    iframe.srcdoc = createSandboxDocument();

    const cleanup = () => {
      window.removeEventListener('message', handleMessage);
      iframe.remove();
    };

    const finish = (callback: () => void) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      cleanup();
      callback();
    };

    const handleMessage = (event: MessageEvent) => {
      if (
        event.source !== iframe.contentWindow ||
        !event.data ||
        event.data.type !== SANDBOX_MESSAGE_TYPE ||
        event.data.token !== token
      ) {
        return;
      }

      finish(() =>
        resolve({
          stdout: typeof event.data.stdout === 'string' ? event.data.stdout : '',
          returnValue:
            typeof event.data.returnValue === 'string' ? event.data.returnValue : undefined,
          error: typeof event.data.error === 'string' ? event.data.error : undefined,
        })
      );
    };

    const timeoutId = window.setTimeout(() => {
      finish(() => reject(new Error(`Time Limit Exceeded (${timeoutMs} ms)`)));
    }, timeoutMs);

    window.addEventListener('message', handleMessage);
    iframe.addEventListener(
      'load',
      () => {
        iframe.contentWindow?.postMessage(
          {
            type: SANDBOX_MESSAGE_TYPE,
            token,
            code,
            inputData,
          },
          '*'
        );
      },
      { once: true }
    );
    document.body.appendChild(iframe);
  });
}
