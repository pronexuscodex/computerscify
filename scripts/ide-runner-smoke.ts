import {
  analyzeCodeSyntax,
  runCCode,
  runCodeByLanguage,
  transpileTypeScriptForSandbox,
} from '../src/services/codeRunner';
import { PRACTICE_PROBLEMS } from '../src/data/practiceData';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function runIdeSmokeTests() {
  const missingColon = analyzeCodeSyntax('if ready # explain the condition', 'python');
  assert(
    missingColon.hasError && missingColon.errorType === 'MissingColon',
    'Python inline comments must not hide a missing block colon.'
  );

  const commentBrackets = analyzeCodeSyntax(
    'value = 1 # unmatched symbols in a comment: ([{',
    'python'
  );
  assert(!commentBrackets.hasError, 'Brackets inside comments must not trigger syntax errors.');

  const transpiled = transpileTypeScriptForSandbox(`
interface Product {
  price: number;
}
const product: Product = { price: 4 };
console.log(product.price);
`);
  assert(!transpiled.includes('interface Product'), 'TypeScript interfaces must be erased.');
  assert(
    transpiled.includes('{ price: 4 }'),
    'TypeScript transpilation must preserve object-literal properties.'
  );

  const cResult = await runCCode(
    'int main() { int value = 42; int *pointer = &value; printf("Value: %d\\n", *pointer); }',
    [{ expectedOutput: 'Value: 42', description: 'resolves a pointer-backed integer' }]
  );
  assert(cResult.stdout === 'Value: 42', 'The C preview must resolve printf integer arguments.');
  assert(cResult.testCaseResults?.[0]?.passed, 'The C preview output must satisfy its test case.');

  const emptyResult = await runCodeByLanguage('python', '   ');
  assert(emptyResult.stderr.includes('Code editor is empty'), 'Empty code must show a diagnostic.');

  const unsupportedResult = await runCodeByLanguage('java', 'class Main {}');
  assert(
    unsupportedResult.stderr.includes('Unsupported language'),
    'Unsupported languages must not be executed as JavaScript.'
  );

  const problemIds = PRACTICE_PROBLEMS.map((problem) => problem.id);
  assert(PRACTICE_PROBLEMS.length >= 17, 'The expanded practice bank must include 17 exercises.');
  assert(
    new Set(problemIds).size === problemIds.length,
    'Every practice exercise must have a unique ID.'
  );
  for (const problem of PRACTICE_PROBLEMS) {
    assert(problem.visibleTests.length > 0, `${problem.id} must include a visible test.`);
    assert(problem.hiddenTests.length > 0, `${problem.id} must include a hidden test.`);
    assert(
      Object.values(problem.starterCodeByLanguage).some((starter) => starter?.trim()),
      `${problem.id} must include at least one writable starter.`
    );
  }

  console.log('IDE runner smoke tests passed.');
}

void runIdeSmokeTests();
