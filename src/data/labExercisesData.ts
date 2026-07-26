import { InteractiveLabDefinition } from '../types/curriculum';

export interface LabPath {
  id: string;
  title: string;
  description: string;
  language: 'python' | 'javascript' | 'typescript' | 'sql' | 'html-css';
}

export const LAB_PATHS: LabPath[] = [
  {
    id: 'python-foundations',
    title: 'Python Foundations & Data Analysis',
    description: 'Master Python syntax, data structures, algorithms, and numerical processing from first principles.',
    language: 'python',
  },
  {
    id: 'js-ts-engineering',
    title: 'JavaScript & TypeScript Engineering',
    description: 'Learn async control flow, functional paradigms, type safety, and web performance.',
    language: 'typescript',
  },
  {
    id: 'sql-relational',
    title: 'Relational Database & SQL Engineering',
    description: 'Write declarative queries, joins, aggregations, window functions, and schema designs.',
    language: 'sql',
  },
  {
    id: 'ml-from-scratch',
    title: 'Machine Learning & Mathematics from Scratch',
    description: 'Implement matrix operations, gradient descent, neural networks, and evaluation metrics.',
    language: 'python',
  },
];

export const ALL_LAB_EXERCISES: InteractiveLabDefinition[] = [
  // --- LEVEL 0: First Interaction ---
  {
    id: 'py-level0-first-program',
    title: 'L0: First Python Program',
    type: 'python',
    language: 'python',
    level: 'level-0',
    pathId: 'python-foundations',
    practiceMode: 'guided-lesson',
    estimatedMinutes: 5,
    instructions: 'Welcome to the Computerfy Interactive Lab! Edit the Python code to print "Hello, Computerfy!" to the console.',
    objective: 'Learn to use print(), execute code in Pyodide, and inspect console stdout output.',
    starterCode: `# Level 0: Print your first message
print("Hello, World!")
`,
    solutionCode: `print("Hello, Computerfy!")`,
    solutionHint: 'Change "Hello, World!" to "Hello, Computerfy!" inside the print() call.',
    hints: [
      'Check string casing and spelling exact match.',
      'Make sure to call print("Hello, Computerfy!")',
    ],
    testCases: [
      {
        expectedOutput: 'Hello, Computerfy!',
        description: 'Output contains exact string "Hello, Computerfy!"',
      },
    ],
  },
  {
    id: 'js-level0-first-log',
    title: 'L0: JavaScript First Log',
    type: 'js',
    language: 'javascript',
    level: 'level-0',
    pathId: 'js-ts-engineering',
    practiceMode: 'guided-lesson',
    estimatedMinutes: 5,
    instructions: 'Write a JavaScript program that logs "Computing from First Principles" to console.',
    objective: 'Understand console.log execution and JS worker sandbox.',
    starterCode: `// Level 0: First JavaScript log
console.log("Welcome to JavaScript!");
`,
    solutionCode: `console.log("Computing from First Principles");`,
    solutionHint: 'Replace the string inside console.log with "Computing from First Principles".',
    hints: ['Ensure exact string match for "Computing from First Principles"'],
    testCases: [
      {
        expectedOutput: 'Computing from First Principles',
        description: 'Output logs "Computing from First Principles"',
      },
    ],
  },
  {
    id: 'sql-level0-first-select',
    title: 'L0: SQL Declarative Query',
    type: 'sql',
    language: 'sql',
    level: 'level-0',
    pathId: 'sql-relational',
    practiceMode: 'guided-lesson',
    estimatedMinutes: 5,
    instructions: 'Write a SQL SELECT query that aliases a constant string literal as "greeting".',
    objective: 'Understand SQL SELECT projection syntax.',
    starterCode: `-- Level 0: SQL Select query
SELECT 'Hello, Relational DB' AS greeting;
`,
    solutionCode: `SELECT 'Hello, SQL' AS greeting;`,
    solutionHint: "Use SELECT 'Hello, SQL' AS greeting;",
    hints: ['Alias the output column using AS greeting.'],
    testCases: [
      {
        expectedOutput: 'Hello, SQL',
        description: 'SELECT query returns greeting column with "Hello, SQL"',
      },
    ],
  },

  {
    id: 'c-level1-pointers',
    title: 'L1: C Memory & Pointers',
    type: 'js',
    language: 'c',
    level: 'level-1',
    pathId: 'python-foundations',
    practiceMode: 'guided-lesson',
    estimatedMinutes: 8,
    instructions: 'Examine pointer memory allocation in C. Complete the main function to allocate a variable, set its value to 42, and print it with printf().',
    objective: 'Understand C pointers, memory dereferencing, and printf formatting.',
    starterCode: `#include <stdio.h>

int main() {
    int val = 42;
    int *ptr = &val;
    
    // Print the dereferenced pointer value:
    printf("Value: %d\\n", *ptr);
    return 0;
}`,
    solutionCode: `#include <stdio.h>\n\nint main() {\n    int val = 42;\n    int *ptr = &val;\n    printf("Value: %d\\n", *ptr);\n    return 0;\n}`,
    solutionHint: 'Use %d in printf and dereference ptr with *ptr.',
    hints: ['Make sure main returns 0', 'Dereference ptr using *ptr'],
    testCases: [
      {
        expectedOutput: 'Value: 42',
        description: 'Output contains "Value: 42"',
      },
    ],
  },
  {
    id: 'ts-level1-type-annotations',
    title: 'L1: TypeScript Type Safety',
    type: 'ts',
    language: 'typescript',
    level: 'level-1',
    pathId: 'js-ts-engineering',
    practiceMode: 'guided-lesson',
    estimatedMinutes: 8,
    instructions: 'Write a typed TypeScript function calculateTotal that takes price (number) and taxRate (number) and prints the total.',
    objective: 'Practice TypeScript function parameters, return type annotations, and console output.',
    starterCode: `// Level 1: TypeScript type annotations
interface Product {
  name: string;
  price: number;
}

function calculateTotal(price: number, taxRate: number): number {
  return price * (1 + taxRate);
}

const total = calculateTotal(100, 0.15);
console.log("Total Amount: " + total);
`,
    solutionCode: `function calculateTotal(price: number, taxRate: number): number { return price * (1 + taxRate); }\nconsole.log("Total Amount: 115");`,
    solutionHint: 'calculateTotal(100, 0.15) equals 115.',
    hints: ['Call calculateTotal with price 100 and taxRate 0.15.'],
    testCases: [
      {
        expectedOutput: 'Total Amount: 115',
        description: 'Outputs total amount 115',
      },
    ],
  },

  // --- LEVEL 1: Beginner ---
  {
    id: 'py-level1-[#variables-ops]',
    title: 'L1: Circle Area Calculator',
    type: 'python',
    language: 'python',
    level: 'level-1',
    pathId: 'python-foundations',
    practiceMode: 'independent',
    estimatedMinutes: 10,
    instructions: 'Given radius r = 5 and pi = 3.14159, calculate area = pi * r^2 and print "Area: 78.53975"',
    objective: 'Use floating point arithmetic, variables, and formatted string output.',
    starterCode: `# Level 1: Calculate circle area
radius = 5
pi = 3.14159

# Calculate area and print "Area: <value>"
area = 0 # TODO: Implement formula
print("Area:", area)
`,
    solutionCode: `radius = 5
pi = 3.14159
area = pi * (radius ** 2)
print("Area:", area)
`,
    solutionHint: 'Use radius ** 2 or radius * radius to compute exponentiation.',
    hints: ['Area formula is pi * r^2.', 'In Python, exponentiation is **'],
    testCases: [
      {
        expectedOutput: 'Area: 78.53975',
        description: 'Calculates area 78.53975 correctly',
      },
    ],
  },
  {
    id: 'js-level1-control-flow',
    title: 'L1: Even or Odd Checker',
    type: 'js',
    language: 'javascript',
    level: 'level-1',
    pathId: 'js-ts-engineering',
    practiceMode: 'debugging-challenge',
    estimatedMinutes: 10,
    instructions: 'Fix the function isEven(num) so it returns true if number is even and false if odd. Test with numbers 42 and 7.',
    objective: 'Use modulo operator (%) and conditional logic.',
    starterCode: `function isEven(n) {
  // Bug: Incorrect operator
  return n / 2 === 0;
}

console.log("42 is even:", isEven(42));
console.log("7 is even:", isEven(7));
`,
    solutionCode: `function isEven(n) {
  return n % 2 === 0;
}

console.log("42 is even:", isEven(42));
console.log("7 is even:", isEven(7));
`,
    solutionHint: 'Replace division operator (/) with modulo operator (%).',
    hints: ['The remainder of dividing by 2 is obtained using n % 2.'],
    testCases: [
      {
        expectedOutput: '42 is even: true',
        description: 'isEven(42) returns true',
      },
      {
        expectedOutput: '7 is even: false',
        description: 'isEven(7) returns false',
      },
    ],
  },

  // --- LEVEL 2: Developing ---
  {
    id: 'py-level2-list-stats',
    title: 'L2: Statistical List Summary',
    type: 'python',
    language: 'python',
    level: 'level-2',
    pathId: 'python-foundations',
    practiceMode: 'independent',
    estimatedMinutes: 15,
    instructions: 'Given numbers = [14, 28, 9, 42, 35, 19], compute and print max value and mean value.',
    objective: 'Work with Python lists, sum(), len(), and max().',
    starterCode: `numbers = [14, 28, 9, 42, 35, 19]

# TODO: Compute max_val and average_val
max_val = max(numbers)
average_val = sum(numbers) / len(numbers)

print(f"Max: {max_val}, Mean: {average_val:.2f}")
`,
    solutionCode: `numbers = [14, 28, 9, 42, 35, 19]
max_val = max(numbers)
average_val = sum(numbers) / len(numbers)
print(f"Max: {max_val}, Mean: {average_val:.2f}")
`,
    solutionHint: 'Sum = 147, Len = 6, Mean = 24.50, Max = 42',
    hints: ['Use f-string formatting f"{average_val:.2f}" for two decimal places.'],
    testCases: [
      {
        expectedOutput: 'Max: 42, Mean: 24.50',
        description: 'Calculates Max: 42, Mean: 24.50 correctly',
      },
    ],
  },
  {
    id: 'ts-level2-interface-validation',
    title: 'L2: TypeScript User Record Contract',
    type: 'ts',
    language: 'typescript',
    level: 'level-2',
    pathId: 'js-ts-engineering',
    practiceMode: 'refactoring',
    estimatedMinutes: 15,
    instructions: 'Define an interface UserRecord with id (number), name (string), and role ("admin" | "learner"). Implement validateUser(u) that returns true if valid.',
    objective: 'Practice TypeScript strict typing and runtime guard functions.',
    starterCode: `interface UserRecord {
  id: number;
  name: string;
  role: "admin" | "learner";
}

function validateUser(u: UserRecord): boolean {
  return typeof u.id === 'number' && typeof u.name === 'string' && (u.role === 'admin' || u.role === 'learner');
}

const testUser: UserRecord = { id: 101, name: "Ada Lovelace", role: "learner" };
console.log("User valid:", validateUser(testUser));
`,
    solutionCode: `interface UserRecord {
  id: number;
  name: string;
  role: "admin" | "learner";
}

function validateUser(u: UserRecord): boolean {
  return typeof u.id === 'number' && typeof u.name === 'string' && (u.role === 'admin' || u.role === 'learner');
}

const testUser: UserRecord = { id: 101, name: "Ada Lovelace", role: "learner" };
console.log("User valid:", validateUser(testUser));
`,
    solutionHint: 'Verify types with typeof and strict equality on string literals.',
    hints: ['Check typeof u.id === "number" and typeof u.name === "string"'],
    testCases: [
      {
        expectedOutput: 'User valid: true',
        description: 'Successfully validates Ada Lovelace user record',
      },
    ],
  },

  // --- LEVEL 3: Intermediate ---
  {
    id: 'py-level3-binary-search',
    title: 'L3: O(log N) Binary Search Algorithm',
    type: 'python',
    language: 'python',
    level: 'level-3',
    pathId: 'python-foundations',
    practiceMode: 'independent',
    estimatedMinutes: 20,
    instructions: 'Implement binary_search(arr, target) returning the index of target in sorted list arr, or -1 if not found.',
    objective: 'Master divide-and-conquer binary search technique with O(1) space complexity.',
    starterCode: `def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
            
    return -1

items = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
print("Index of 23:", binary_search(items, 23))
print("Index of 100:", binary_search(items, 100))
`,
    solutionCode: `def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

items = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
print("Index of 23:", binary_search(items, 23))
print("Index of 100:", binary_search(items, 100))
`,
    solutionHint: 'Divide search space in half at each step using integer division (low + high) // 2.',
    hints: ['Update low = mid + 1 if element is greater, high = mid - 1 if smaller.'],
    testCases: [
      {
        expectedOutput: 'Index of 23: 5',
        description: 'Finds index 5 for element 23',
      },
      {
        expectedOutput: 'Index of 100: -1',
        description: 'Returns -1 for absent element 100',
      },
    ],
  },
  {
    id: 'sql-level3-joins-agg',
    title: 'L3: SQL INNER JOIN & Group Aggregation',
    type: 'sql',
    language: 'sql',
    level: 'level-3',
    pathId: 'sql-relational',
    practiceMode: 'independent',
    estimatedMinutes: 20,
    instructions: 'Query total order amount per customer by joining customers and orders tables.',
    objective: 'Write SQL JOIN queries with GROUP BY and SUM().',
    starterCode: `-- Given in-memory tables: customers (id, name), orders (id, customer_id, amount)
SELECT c.name, SUM(o.amount) AS total_spent
FROM customers c
JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name
ORDER BY total_spent DESC;
`,
    solutionCode: `SELECT c.name, SUM(o.amount) AS total_spent
FROM customers c
JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name
ORDER BY total_spent DESC;
`,
    solutionHint: 'Join on c.id = o.customer_id and group by customer name.',
    hints: ['Use SUM(o.amount) to aggregate order totals per customer.'],
    testCases: [
      {
        expectedOutput: 'total_spent',
        description: 'Returns aggregated spends per customer',
      },
    ],
  },

  // --- LEVEL 4: Advanced ---
  {
    id: 'py-level4-dp-fibonacci',
    title: 'L4: Dynamic Programming Fibonacci with Memoization',
    type: 'python',
    language: 'python',
    level: 'level-4',
    pathId: 'python-foundations',
    practiceMode: 'independent',
    estimatedMinutes: 25,
    instructions: 'Implement memoized fibonacci(n) that computes Fib(50) in O(N) time instead of exponential O(2^N).',
    objective: 'Understand top-down dynamic programming, memoization tables, and time complexity bounds.',
    starterCode: `memo = {}

def fibonacci(n):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    
    memo[n] = fibonacci(n - 1) + fibonacci(n - 2)
    return memo[n]

print("Fib(10):", fibonacci(10))
print("Fib(50):", fibonacci(50))
`,
    solutionCode: `memo = {}

def fibonacci(n):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    
    memo[n] = fibonacci(n - 1) + fibonacci(n - 2)
    return memo[n]

print("Fib(10):", fibonacci(10))
print("Fib(50):", fibonacci(50))
`,
    solutionHint: 'Fib(10) is 55, Fib(50) is 12586269025.',
    hints: ['Check memoization dictionary before executing recursive calls.'],
    testCases: [
      {
        expectedOutput: 'Fib(10): 55',
        description: 'Computes Fib(10) = 55',
      },
      {
        expectedOutput: 'Fib(50): 12586269025',
        description: 'Computes Fib(50) = 12586269025 instantaneously',
      },
    ],
  },
  {
    id: 'py-level4-gradient-descent',
    title: 'L4: Machine Learning Linear Regression from Scratch',
    type: 'python',
    language: 'python',
    level: 'level-4',
    pathId: 'ml-from-scratch',
    practiceMode: 'independent',
    estimatedMinutes: 30,
    instructions: 'Implement single-variable Gradient Descent to fit y = m * x + b on dataset x=[1,2,3,4,5], y=[3,5,7,9,11].',
    objective: 'Derive loss gradients with respect to slope m and intercept b from first principles.',
    starterCode: `x = [1, 2, 3, 4, 5]
y = [3, 5, 7, 9, 11] # Exact relationship: y = 2*x + 1

m = 0.0
b = 0.0
lr = 0.02
epochs = 500
n = len(x)

for epoch in range(epochs):
    y_pred = [m * xi + b for xi in x]
    dm = (-2/n) * sum(xi * (yi - ypi) for xi, yi, ypi in zip(x, y, y_pred))
    db = (-2/n) * sum(yi - ypi for yi, ypi in zip(y, y_pred))
    
    m -= lr * dm
    b -= lr * db

print(f"Learned model: y = {m:.1f}*x + {b:.1f}")
`,
    solutionCode: `x = [1, 2, 3, 4, 5]
y = [3, 5, 7, 9, 11]
m = 0.0
b = 0.0
lr = 0.02
epochs = 500
n = len(x)

for epoch in range(epochs):
    y_pred = [m * xi + b for xi in x]
    dm = (-2/n) * sum(xi * (yi - ypi) for xi, yi, ypi in zip(x, y, y_pred))
    db = (-2/n) * sum(yi - ypi for yi, ypi in zip(y, y_pred))
    m -= lr * dm
    b -= lr * db

print(f"Learned model: y = {m:.1f}*x + {b:.1f}")
`,
    solutionHint: 'Gradients update slope m towards 2.0 and intercept b towards 1.0.',
    hints: ['Loss function MSE = (1/N) * sum((y - (m*x + b))^2)'],
    testCases: [
      {
        expectedOutput: 'Learned model: y = 2.0*x + 1.0',
        description: 'Gradient descent converges to m = 2.0 and b = 1.0',
      },
    ],
  },

  // --- LEVEL 5: Professional Practice ---
  {
    id: 'py-level5-refactor-etl-pipeline',
    title: 'L5: Professional Data Pipeline Refactoring & Validation',
    type: 'python',
    language: 'python',
    level: 'level-5',
    pathId: 'python-foundations',
    practiceMode: 'refactoring',
    estimatedMinutes: 35,
    instructions: 'Build a production-style DataPipeline class that ingests raw JSON records, validates required schema keys, cleans null values, and outputs summary analytics.',
    objective: 'Design modular, fault-tolerant Python software with custom exceptions and clean data transformations.',
    starterCode: `import json

class ValidationError(Exception):
    pass

class DataPipeline:
    def __init__(self, required_keys):
        self.required_keys = required_keys

    def process(self, raw_records):
        clean_records = []
        for r in raw_records:
            if not all(k in r for k in self.required_keys):
                continue
            if r.get('value') is not None and r['value'] > 0:
                clean_records.append(r)
        
        total_val = sum(r['value'] for r in clean_records)
        return {
            "processed_count": len(clean_records),
            "total_value": total_val
        }

pipeline = DataPipeline(required_keys=["id", "value"])
data = [
    {"id": 1, "value": 100},
    {"id": 2, "value": -50}, # Filtered out
    {"id": 3, "value": None}, # Filtered out
    {"id": 4, "value": 250}
]

res = pipeline.process(data)
print("Pipeline Output:", res)
`,
    solutionCode: `import json

class ValidationError(Exception):
    pass

class DataPipeline:
    def __init__(self, required_keys):
        self.required_keys = required_keys

    def process(self, raw_records):
        clean_records = []
        for r in raw_records:
            if not all(k in r for k in self.required_keys):
                continue
            if r.get('value') is not None and r['value'] > 0:
                clean_records.append(r)
        
        total_val = sum(r['value'] for r in clean_records)
        return {
            "processed_count": len(clean_records),
            "total_value": total_val
        }

pipeline = DataPipeline(required_keys=["id", "value"])
data = [
    {"id": 1, "value": 100},
    {"id": 2, "value": -50},
    {"id": 3, "value": None},
    {"id": 4, "value": 250}
]

res = pipeline.process(data)
print("Pipeline Output:", res)
`,
    solutionHint: 'DataPipeline cleans invalid/negative records and sums value = 350 across 2 records.',
    hints: ['Check that all required keys exist and value is positive.'],
    testCases: [
      {
        expectedOutput: "Pipeline Output: {'processed_count': 2, 'total_value': 350}",
        description: 'Pipeline produces correct processed_count: 2 and total_value: 350',
      },
    ],
  },
];
