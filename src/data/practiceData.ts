import {
  PracticeProblem,
  StudyPlan,
  ContestDefinition,
  SpacedReviewCard
} from '../types/practice';

const createPracticeProblem = (
  problem: Omit<
    PracticeProblem,
    'timeLimitMs' | 'relatedLessons' | 'nextProblems' | 'authoringSource'
  > &
    Partial<
      Pick<
        PracticeProblem,
        'timeLimitMs' | 'relatedLessons' | 'nextProblems' | 'authoringSource'
      >
    >
): PracticeProblem => ({
  timeLimitMs: 1000,
  relatedLessons: [],
  nextProblems: [],
  authoringSource: 'ComputerSciFy Expanded Practice Bank',
  ...problem,
});

export const PRACTICE_PROBLEMS: PracticeProblem[] = [
  // --- FOUNDATION & IMPLEMENTATION ---
  {
    id: 'prob-f1-two-sum-linear',
    slug: 'two-sum-hash-map',
    title: 'Two-Sum Array Indices (Hash Table O(N))',
    track: 'cs',
    topics: ['Arrays', 'Hashing', 'Implementation'],
    difficulty: 'easy',
    estimatedMinutes: 15,
    prerequisites: ['Hash Table Basics', 'Array Iteration'],
    statement: 'Given an array of integers `nums` and an integer `target`, return the 0-based indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    inputFormat: 'First line: space-separated integers for nums. Second line: target integer.',
    outputFormat: 'Two space-separated indices [i, j] sorted ascending.',
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9'],
    examples: [
      {
        input: '2 7 11 15\n9',
        output: '0 1',
        explanation: 'nums[0] + nums[1] = 2 + 7 = 9.'
      },
      {
        input: '3 2 4\n6',
        output: '1 2',
        explanation: 'nums[1] + nums[2] = 2 + 4 = 6.'
      }
    ],
    starterCodeByLanguage: {
      python: `def solve(nums, target):
    # TODO: Use a hash map to find pair indices in O(N) time
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return f"{seen[diff]} {i}"
        seen[num] = i
    return ""

if __name__ == "__main__":
    import sys
    lines = sys.stdin.read().splitlines()
    if len(lines) >= 2:
        nums = list(map(int, lines[0].split()))
        target = int(lines[1])
        print(solve(nums, target))
`,
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');
if (input.length >= 2) {
  const nums = input[0].trim().split(/\\s+/).map(Number);
  const target = Number(input[1]);
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (seen.has(diff)) {
      console.log(\`\${seen.get(diff)} \${i}\`);
      process.exit(0);
    }
    seen.set(nums[i], i);
  }
}
`,
      sql: `SELECT id FROM table;`
    },
    visibleTests: [
      {
        input: '2 7 11 15\n9',
        expectedOutput: '0 1',
        description: 'Standard positive array target 9'
      },
      {
        input: '3 2 4\n6',
        expectedOutput: '1 2',
        description: 'Unsorted array pair target 6'
      }
    ],
    hiddenTests: [
      {
        input: '3 3\n6',
        expectedOutput: '0 1',
        description: 'Duplicate values',
        isHidden: true
      },
      {
        input: '-1 -2 -3 -4 -5\n-8',
        expectedOutput: '2 4',
        description: 'Negative values',
        isHidden: true
      }
    ],
    timeLimitMs: 1000,
    hints: [
      'A brute force nested loop takes O(N^2) time. Can you store complement values in a hash map for O(1) lookups?',
      'As you iterate through the array, check if target - current_value is already present in your map.'
    ],
    editorial: {
      coreInsight: 'Instead of searching for a matching pair by looping over all remaining elements, store previously seen elements in a hash map key -> index. For each element, check if (target - num) exists in the map.',
      bruteForceApproach: 'Nested loops checking all pairs (i, j). Time Complexity O(N^2), Space Complexity O(1).',
      optimalApproach: 'Single pass with Hash Map. Time Complexity O(N), Space Complexity O(N).',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)',
      commonMistakes: [
        'Using the same element twice (e.g. nums[i] + nums[i] = target).',
        'Not handling negative target values or duplicate numbers.'
      ],
      referenceCodeByLanguage: {
        python: `def solve(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return f"{seen[complement]} {i}"\n        seen[num] = i\n    return ""`
      }
    },
    relatedLessons: ['p1-m1-t1', 'p1-m2-t1'],
    nextProblems: ['prob-f2-binary-search-bounds'],
    authoringSource: 'ComputerSciFy First Principles Problem Bank'
  },

  // --- BINARY SEARCH ---
  {
    id: 'prob-f2-binary-search-bounds',
    slug: 'binary-search-first-last-position',
    title: 'First and Last Position in Sorted Array (O(log N))',
    track: 'cs',
    topics: ['Binary Search', 'Arrays', 'Two Pointers'],
    difficulty: 'intermediate',
    estimatedMinutes: 20,
    prerequisites: ['Binary Search Fundamentals'],
    statement: 'Given an array of integers `nums` sorted in non-decreasing order, find the starting and ending position of a given `target` value. If `target` is not found, return `-1 -1`. You must write an algorithm with `O(log N)` runtime complexity.',
    inputFormat: 'First line: space-separated integers for nums. Second line: target integer.',
    outputFormat: 'Two space-separated integers representing start and end 0-based indices.',
    constraints: ['0 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9', 'nums is sorted in non-decreasing order.'],
    examples: [
      {
        input: '5 7 7 8 8 10\n8',
        output: '3 4',
        explanation: '8 appears at indices 3 and 4.'
      },
      {
        input: '5 7 7 8 8 10\n6',
        output: '-1 -1',
        explanation: '6 is not in the array.'
      }
    ],
    starterCodeByLanguage: {
      python: `def find_bound(nums, target, is_first):
    low, high = 0, len(nums) - 1
    ans = -1
    while low <= high:
        mid = (low + high) // 2
        if nums[mid] == target:
            ans = mid
            if is_first:
                high = mid - 1
            else:
                low = mid + 1
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return ans

def solve(nums, target):
    if not nums:
        return "-1 -1"
    first = find_bound(nums, target, True)
    if first == -1:
        return "-1 -1"
    last = find_bound(nums, target, False)
    return f"{first} {last}"

if __name__ == "__main__":
    import sys
    lines = sys.stdin.read().splitlines()
    if len(lines) >= 2 and lines[0].strip():
        nums = list(map(int, lines[0].split()))
        target = int(lines[1])
        print(solve(nums, target))
    else:
        print("-1 -1")
`,
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');
function findBound(nums, target, isFirst) {
  let low = 0, high = nums.length - 1, ans = -1;
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    if (nums[mid] === target) {
      ans = mid;
      if (isFirst) high = mid - 1;
      else low = mid + 1;
    } else if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return ans;
}
if (input.length >= 2 && input[0].trim()) {
  const nums = input[0].trim().split(/\\s+/).map(Number);
  const target = Number(input[1]);
  const first = findBound(nums, target, true);
  if (first === -1) console.log("-1 -1");
  else console.log(\`\${first} \${findBound(nums, target, false)}\`);
} else {
  console.log("-1 -1");
}
`
    },
    visibleTests: [
      {
        input: '5 7 7 8 8 10\n8',
        expectedOutput: '3 4',
        description: 'Element with multiple occurrences'
      },
      {
        input: '5 7 7 8 8 10\n6',
        expectedOutput: '-1 -1',
        description: 'Absent element'
      }
    ],
    hiddenTests: [
      {
        input: '1\n1',
        expectedOutput: '0 0',
        description: 'Single element array',
        isHidden: true
      },
      {
        input: '2 2 2 2 2\n2',
        expectedOutput: '0 4',
        description: 'All elements identical to target',
        isHidden: true
      }
    ],
    timeLimitMs: 1000,
    hints: [
      'Run binary search twice: once to find the leftmost boundary (high = mid - 1 when match found) and once to find the rightmost boundary (low = mid + 1 when match found).'
    ],
    editorial: {
      coreInsight: 'Standard binary search stops at any match. To find the first occurrence, continue searching in the left half after recording mid. To find the last, continue searching in the right half.',
      bruteForceApproach: 'Linear scan to find start and end. Time O(N), Space O(1).',
      optimalApproach: 'Dual binary search runs. Time O(log N), Space O(1).',
      timeComplexity: 'O(log N)',
      spaceComplexity: 'O(1)',
      commonMistakes: [
        'Infinite loop when high/low pointers are not updated correctly on match.'
      ],
      referenceCodeByLanguage: {
        python: `def solve(nums, target):\n    # Dual binary search\n    pass`
      }
    },
    relatedLessons: ['p1-m1-t2'],
    nextProblems: ['prob-f3-longest-increasing-subsequence'],
    authoringSource: 'ComputerSciFy First Principles Problem Bank'
  },

  // --- DYNAMIC PROGRAMMING ---
  {
    id: 'prob-f3-longest-increasing-subsequence',
    slug: 'longest-increasing-subsequence',
    title: 'Longest Increasing Subsequence (DP & Patient Sorting)',
    track: 'cs',
    topics: ['Dynamic Programming', 'Binary Search', 'Arrays'],
    difficulty: 'advanced',
    estimatedMinutes: 25,
    prerequisites: ['Dynamic Programming Fundamentals', 'Binary Search'],
    statement: 'Given an integer array `nums`, return the length of the longest strictly increasing subsequence. A subsequence is a sequence that can be derived from an array by deleting some or no elements without changing the order of the remaining elements.',
    inputFormat: 'First line: space-separated integers for nums.',
    outputFormat: 'Single integer representing the length of the longest strictly increasing subsequence.',
    constraints: ['1 <= nums.length <= 2500', '-10^4 <= nums[i] <= 10^4'],
    examples: [
      {
        input: '10 9 2 5 3 7 101 18',
        output: '4',
        explanation: 'The longest increasing subsequence is [2, 3, 7, 101] or [2, 5, 7, 101], length 4.'
      },
      {
        input: '0 1 0 3 2 3',
        output: '4',
        explanation: 'The longest increasing subsequence is [0, 1, 2, 3], length 4.'
      }
    ],
    starterCodeByLanguage: {
      python: `import bisect

def solve(nums):
    # O(N log N) Patient Sorting approach
    tails = []
    for x in nums:
        idx = bisect.bisect_left(tails, x)
        if idx == len(tails):
            tails.append(x)
        else:
            tails[idx] = x
    return len(tails)

if __name__ == "__main__":
    import sys
    lines = sys.stdin.read().splitlines()
    if lines and lines[0].strip():
        nums = list(map(int, lines[0].split()))
        print(solve(nums))
`,
      javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');
if (input.length > 0 && input[0].trim()) {
  const nums = input[0].trim().split(/\\s+/).map(Number);
  const tails = [];
  for (const x of nums) {
    let low = 0, high = tails.length;
    while (low < high) {
      let mid = Math.floor((low + high) / 2);
      if (tails[mid] < x) low = mid + 1;
      else high = mid;
    }
    if (low === tails.length) tails.push(x);
    else tails[low] = x;
  }
  console.log(tails.length);
}
`
    },
    visibleTests: [
      {
        input: '10 9 2 5 3 7 101 18',
        expectedOutput: '4',
        description: 'Standard LIS length 4'
      },
      {
        input: '7 7 7 7 7 7',
        expectedOutput: '1',
        description: 'All equal elements require strictly increasing LIS of length 1'
      }
    ],
    hiddenTests: [
      {
        input: '4 10 4 3 8 9',
        expectedOutput: '3',
        description: 'LIS [3, 8, 9] or [4, 8, 9]',
        isHidden: true
      }
    ],
    timeLimitMs: 1000,
    hints: [
      'O(N^2) DP uses state dp[i] = length of LIS ending at i. Can you optimize to O(N log N) using a tails array where tails[i] stores the smallest tail of all increasing subsequences of length i+1?'
    ],
    editorial: {
      coreInsight: 'Maintain an array tails where tails[i] is the smallest tail of all LIS found so far of length i+1. For each number x in nums, binary search for its position in tails and either update or append.',
      bruteForceApproach: 'Recursive search testing all 2^N subsequences. Time O(2^N).',
      optimalApproach: 'Patience sorting with binary search. Time O(N log N), Space O(N).',
      timeComplexity: 'O(N log N)',
      spaceComplexity: 'O(N)',
      commonMistakes: [
        'Confusing non-decreasing with strictly increasing (use bisect_left for strictly increasing).'
      ],
      referenceCodeByLanguage: {
        python: `import bisect\ndef solve(nums):\n    tails = []\n    for x in nums:\n        idx = bisect.bisect_left(tails, x)\n        if idx == len(tails): tails.append(x)\n        else: tails[idx] = x\n    return len(tails)`
      }
    },
    relatedLessons: ['p1-m2-t2'],
    nextProblems: ['prob-f4-sql-window-rank'],
    authoringSource: 'ComputerSciFy First Principles Problem Bank'
  },

  // --- SQL & DATA ENGINEERING ---
  {
    id: 'prob-f4-sql-window-rank',
    slug: 'sql-second-highest-salary-window',
    title: 'Department Top 2 Salaries (SQL Window Functions)',
    track: 'ds',
    topics: ['SQL', 'Window Functions', 'Data Engineering'],
    difficulty: 'intermediate',
    estimatedMinutes: 20,
    prerequisites: ['SQL JOINs', 'SQL DENSE_RANK'],
    statement: 'Write a SQL query to find the employees who earn the top 2 highest distinct salaries in each department. Return department name, employee name, and salary ordered by department name and salary descending.',
    inputFormat: 'SQLite in-memory schema with tables Employee (id, name, salary, departmentId) and Department (id, name).',
    outputFormat: 'Table of Department, Employee, Salary.',
    constraints: ['Each department has at least 1 employee.', 'Salaries are positive integers.'],
    examples: [
      {
        input: 'Employee: [(1, "Joe", 85000, 1), (2, "Henry", 80000, 2), (3, "Sam", 60000, 2), (4, "Max", 90000, 1), (5, "Janet", 69000, 1)]\nDepartment: [(1, "IT"), (2, "Sales")]',
        output: 'IT Max 90000\nIT Joe 85000\nSales Henry 80000\nSales Sam 60000',
        explanation: 'Max and Joe are top 2 in IT; Henry and Sam are top 2 in Sales.'
      }
    ],
    starterCodeByLanguage: {
      sql: `WITH RankedSalaries AS (
    SELECT 
        d.name AS Department,
        e.name AS Employee,
        e.salary AS Salary,
        DENSE_RANK() OVER (PARTITION BY e.departmentId ORDER BY e.salary DESC) AS rnk
    FROM Employee e
    JOIN Department d ON e.departmentId = d.id
)
SELECT Department, Employee, Salary
FROM RankedSalaries
WHERE rnk <= 2
ORDER BY Department ASC, Salary DESC;
`,
      python: `# Python equivalent for testing tabular logic
import pandas as pd

def solve(emp_df, dept_df):
    merged = emp_df.merge(dept_df, left_on='departmentId', right_on='id', suffixes=('', '_dept'))
    merged['rnk'] = merged.groupby('departmentId')['salary'].rank(method='dense', ascending=False)
    top2 = merged[merged['rnk'] <= 2].sort_values(['name_dept', 'salary'], ascending=[True, False])
    return top2[['name_dept', 'name', 'salary']].to_string(index=False)
`
    },
    visibleTests: [
      {
        input: 'Default IT & Sales dataset',
        expectedOutput: 'IT Max 90000\nIT Joe 85000\nSales Henry 80000\nSales Sam 60000',
        description: 'Ranks top 2 distinct salaries per department correctly'
      }
    ],
    hiddenTests: [
      {
        input: 'Tied salaries in same department',
        expectedOutput: 'Handles tied dense ranks appropriately',
        description: 'DENSE_RANK handles duplicate salary ranks',
        isHidden: true
      }
    ],
    timeLimitMs: 1000,
    hints: [
      'Use DENSE_RANK() OVER (PARTITION BY departmentId ORDER BY salary DESC) in a Common Table Expression (CTE) or subquery, then filter WHERE rnk <= 2.'
    ],
    editorial: {
      coreInsight: 'DENSE_RANK ensures tied salaries share the same rank without skipping rank numbers, providing correct top-N ranking per department.',
      bruteForceApproach: 'Correlated subqueries counting higher distinct salaries per employee. Time O(N^2).',
      optimalApproach: 'Single-pass window function aggregation over partitioned data. Time O(N log N).',
      timeComplexity: 'O(N log N)',
      spaceComplexity: 'O(N)',
      commonMistakes: [
        'Using RANK() instead of DENSE_RANK(), which skips ranks on ties.'
      ],
      referenceCodeByLanguage: {
        sql: `WITH Ranked AS (SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary, DENSE_RANK() OVER (PARTITION BY e.departmentId ORDER BY e.salary DESC) AS rnk FROM Employee e JOIN Department d ON e.departmentId = d.id) SELECT Department, Employee, Salary FROM Ranked WHERE rnk <= 2 ORDER BY Department, Salary DESC;`
      }
    },
    relatedLessons: ['p1-m3-t1'],
    nextProblems: ['prob-f5-ml-linear-regression-from-scratch'],
    authoringSource: 'ComputerSciFy First Principles Problem Bank'
  },

  // --- MACHINE LEARNING FROM SCRATCH ---
  {
    id: 'prob-f5-ml-linear-regression-from-scratch',
    slug: 'multivariate-linear-regression-gradient-descent',
    title: 'Multivariate Linear Regression with L2 Regularization (NumPy)',
    track: 'ml',
    topics: ['ML from scratch', 'Linear Algebra', 'Optimization'],
    difficulty: 'advanced',
    estimatedMinutes: 30,
    prerequisites: ['Vectorization & Broadcasting', 'Gradient Descent Mechanics'],
    statement: 'Implement multivariate linear regression with L2 Ridge Regularization from first principles in NumPy. Compute weights w and bias b using mini-batch gradient descent.',
    inputFormat: 'Feature matrix X of shape (N, D), target vector y of shape (N, 1), learning rate lr, alpha L2 penalty, epochs.',
    outputFormat: 'Trained weights w array and bias scalar b.',
    constraints: ['10 <= N <= 1000', '1 <= D <= 20', '0.001 <= lr <= 0.1'],
    examples: [
      {
        input: 'X shape (100, 2), y = 3.0 * x1 - 2.0 * x2 + 1.5 + noise',
        output: 'Weights approximately [3.0, -2.0], Bias approximately 1.5',
        explanation: 'Gradient descent minimizes MSE loss + alpha * ||w||^2.'
      }
    ],
    starterCodeByLanguage: {
      python: `import numpy as np

class RidgeRegressionFromScratch:
    def __init__(self, lr=0.01, alpha=0.1, epochs=200):
        self.lr = lr
        self.alpha = alpha
        self.epochs = epochs
        self.w = None
        self.b = 0.0

    def fit(self, X, y):
        N, D = X.shape
        self.w = np.zeros((D, 1))
        self.b = 0.0
        
        for _ in range(self.epochs):
            y_pred = np.dot(X, self.w) + self.b
            errors = y_pred - y
            
            # Gradient with L2 regularization on weights
            dw = (1 / N) * np.dot(X.T, errors) + (self.alpha / N) * self.w
            db = (1 / N) * np.sum(errors)
            
            self.w -= self.lr * dw
            self.b -= self.lr * db

    def predict(self, X):
        return np.dot(X, self.w) + self.b

if __name__ == "__main__":
    np.random.seed(42)
    X = np.random.randn(100, 2)
    true_w = np.array([[3.0], [-2.0]])
    y = np.dot(X, true_w) + 1.5 + np.random.randn(100, 1) * 0.05
    
    model = RidgeRegressionFromScratch(lr=0.1, alpha=0.01, epochs=500)
    model.fit(X, y)
    print("Learned W:", np.round(model.w.flatten(), 1))
    print("Learned B:", round(model.b, 1))
`,
      javascript: `// JS implementation of multivariate linear regression
class RidgeRegression {
  constructor(lr = 0.01, alpha = 0.1, epochs = 200) {
    this.lr = lr;
    this.alpha = alpha;
    this.epochs = epochs;
    this.w = [];
    this.b = 0;
  }
}
`
    },
    visibleTests: [
      {
        input: 'Synthetic linear dataset with 2 features',
        expectedOutput: 'Learned W: [3. -2.]\nLearned B: 1.5',
        description: 'Converges to true underlying parameters'
      }
    ],
    hiddenTests: [
      {
        input: 'Multivariate dataset with noise',
        expectedOutput: 'Regularization prevents weight explosion',
        description: 'L2 regularization stabilizes gradient updates',
        isHidden: true
      }
    ],
    timeLimitMs: 1500,
    hints: [
      'MSE Loss = (1 / 2N) * ||X w + b - y||^2 + (alpha / 2N) * ||w||^2. Gradient wrt w is (1/N) X^T (y_pred - y) + (alpha/N) w.'
    ],
    editorial: {
      coreInsight: 'Vectorizing the residual predictions (y_pred - y) allows calculating exact gradient steps using single matrix transpose multiplications X^T @ errors.',
      bruteForceApproach: 'Explicit nested Python loops for dot products. Slow and inefficient for larger N.',
      optimalApproach: 'NumPy vectorized matrix algebra. Fast CPU SIMD execution.',
      timeComplexity: 'O(epochs * N * D)',
      spaceComplexity: 'O(N * D)',
      commonMistakes: [
        'Applying L2 penalty to bias parameter b (bias should NOT be regularized).'
      ],
      referenceCodeByLanguage: {
        python: `dw = (1 / N) * np.dot(X.T, y_pred - y) + (self.alpha / N) * self.w`
      }
    },
    relatedLessons: ['p1-m4-t1'],
    nextProblems: [],
    authoringSource: 'ComputerSciFy First Principles Problem Bank'
  },
  {
    id: 'prob-f6-valid-parentheses-stack',
    slug: 'valid-parentheses-stack',
    title: 'Valid Parentheses & Bracket Matching (Stack O(N))',
    track: 'cs',
    topics: ['Stack', 'Strings', 'Data Structures'],
    difficulty: 'easy',
    estimatedMinutes: 15,
    prerequisites: ['Stack Data Structure', 'String Processing'],
    statement: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets, in the exact matching order.',
    inputFormat: 'First line: string `s`.',
    outputFormat: 'Print `True` if valid, otherwise `False`.',
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only ()[]{}'],
    examples: [
      {
        input: '()[]{}',
        output: 'True',
        explanation: 'All brackets are matched and closed in order.'
      },
      {
        input: '(]',
        output: 'False',
        explanation: 'Mismatched closing bracket type.'
      }
    ],
    starterCodeByLanguage: {
      python: `def isValid(s: str) -> bool:
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping:
            top_element = stack.pop() if stack else '#'
            if mapping[char] != top_element:
                return False
        else:
            stack.append(char)
    return not stack

if __name__ == "__main__":
    import sys
    line = sys.stdin.read().strip()
    print(isValid(line))
`,
      javascript: `const fs = require('fs');
const s = fs.readFileSync(0, 'utf-8').trim();
function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (let char of s) {
    if (map[char]) {
      if (stack.pop() !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}
console.log(isValid(s) ? 'True' : 'False');
`,
      sql: `SELECT 'True' AS is_valid;`
    },
    visibleTests: [
      {
        input: '()[]{}',
        expectedOutput: 'True',
        description: 'Multiple matching pairs'
      },
      {
        input: '([{}])',
        expectedOutput: 'True',
        description: 'Nested valid brackets'
      }
    ],
    hiddenTests: [
      {
        input: '([)]',
        expectedOutput: 'False',
        description: 'Interleaved invalid brackets',
        isHidden: true
      },
      {
        input: '(((',
        expectedOutput: 'False',
        description: 'Unclosed open brackets',
        isHidden: true
      }
    ],
    timeLimitMs: 1000,
    hints: [
      'Use a stack to keep track of expected closing brackets. When you see an opening bracket, push it onto the stack. When you see a closing bracket, pop and verify matching type.'
    ],
    editorial: {
      coreInsight: 'Last-In, First-Out (LIFO) stack property naturally matches nested scopes like brackets or compiler parse trees.',
      bruteForceApproach: 'Repeatedly replace empty pairs () {} [] in the string until no changes occur. O(N^2) time complexity.',
      optimalApproach: 'Single linear scan using a stack. O(N) time and space complexity.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)',
      commonMistakes: [
        'Popping from an empty stack when encountering an unexpected closing bracket.'
      ],
      referenceCodeByLanguage: {
        python: `if mapping[char] != (stack.pop() if stack else '#'): return False`
      }
    },
    relatedLessons: ['p0-m1-t1', 'p2-m1-t2'],
    nextProblems: ['prob-f10-lru-cache-doubly-linked'],
    authoringSource: 'ComputerSciFy Core Data Structures'
  },
  {
    id: 'prob-f7-binary-tree-inorder',
    slug: 'binary-tree-inorder-traversal',
    title: 'Binary Tree Inorder Traversal (DFS Left-Root-Right)',
    track: 'cs',
    topics: ['Binary Tree', 'DFS', 'Recursion', 'Stack'],
    difficulty: 'intermediate',
    estimatedMinutes: 20,
    prerequisites: ['Binary Trees', 'Depth First Search'],
    statement: 'Given the root of a binary tree represented as an array in level-order, return the 0-based list of node values in its inorder traversal (Left -> Root -> Right).',
    inputFormat: 'First line: space-separated integers or null values representing binary tree nodes in level order.',
    outputFormat: 'Space-separated integers in inorder traversal sequence.',
    constraints: ['0 <= node count <= 100', '-100 <= node.val <= 100'],
    examples: [
      {
        input: '1 null 2 3',
        output: '1 3 2',
        explanation: 'Inorder traversal visits node 1, then left child of 2 (which is 3), then node 2.'
      }
    ],
    starterCodeByLanguage: {
      python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorderTraversal(root):
    res, stack = [], []
    curr = root
    while curr or stack:
        while curr:
            stack.append(curr)
            curr = curr.left
        curr = stack.pop()
        res.append(str(curr.val))
        curr = curr.right
    return " ".join(res)

if __name__ == "__main__":
    # Test stub for 1 -> right: 2 -> left: 3
    root = TreeNode(1, None, TreeNode(2, TreeNode(3), None))
    print(inorderTraversal(root))
`,
      javascript: `class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}
function inorderTraversal(root) {
  const res = [];
  function dfs(node) {
    if (!node) return;
    dfs(node.left);
    res.push(node.val);
    dfs(node.right);
  }
  dfs(root);
  return res.join(' ');
}
const root = new TreeNode(1, null, new TreeNode(2, new TreeNode(3), null));
console.log(inorderTraversal(root));
`,
      sql: `SELECT '1 3 2' AS inorder;`
    },
    visibleTests: [
      {
        input: '1 null 2 3',
        expectedOutput: '1 3 2',
        description: 'Standard right-leaning tree'
      }
    ],
    hiddenTests: [
      {
        input: '4 2 5 1 3',
        expectedOutput: '1 2 3 4 5',
        description: 'Complete Binary Search Tree',
        isHidden: true
      }
    ],
    timeLimitMs: 1000,
    hints: [
      'For a Binary Search Tree (BST), inorder traversal produces node values in strictly sorted ascending order.'
    ],
    editorial: {
      coreInsight: 'DFS with Left-Root-Right order guarantees processing left subtrees completely before processing parent node values.',
      bruteForceApproach: 'Recursion with helper stack frames. O(N) time and auxiliary call stack space O(H).',
      optimalApproach: 'Iterative stack or Morris Traversal for O(1) space.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(H) where H is tree height',
      commonMistakes: [
        'Forgetting to traverse the right subtree after visiting the root node.'
      ],
      referenceCodeByLanguage: {
        python: `dfs(node.left); res.append(node.val); dfs(node.right)`
      }
    },
    relatedLessons: ['p3-m2-t1'],
    nextProblems: [],
    authoringSource: 'ComputerSciFy First Principles Algorithms'
  },
  {
    id: 'prob-f8-softmax-loss-vectorized',
    slug: 'softmax-cross-entropy-loss',
    title: 'Numerically Stable Softmax & Cross-Entropy Loss (Vectorized ML)',
    track: 'ds',
    topics: ['Deep Learning', 'Machine Learning', 'Linear Algebra', 'Loss Functions'],
    difficulty: 'intermediate',
    estimatedMinutes: 25,
    prerequisites: ['NumPy Vectorization', 'Matrix Algebra', 'Softmax Formula'],
    statement: 'Given raw logits array `z = [2.0, 1.0, 0.1]`, compute the numerically stable Softmax probabilities `p_i = exp(z_i - max(z)) / sum(exp(z - max(z)))` and round probabilities to 2 decimal places.',
    inputFormat: 'First line: space-separated logit floats.',
    outputFormat: 'Space-separated probability floats rounded to 2 decimals.',
    constraints: ['1 <= len(logits) <= 1000', '-100.0 <= logits[i] <= 100.0'],
    examples: [
      {
        input: '2.0 1.0 0.1',
        output: '0.66 0.24 0.10',
        explanation: 'Exp normalized with max-subtraction to avoid floating point overflow.'
      }
    ],
    starterCodeByLanguage: {
      python: `import numpy as np

def softmax(logits):
    exps = np.exp(logits - np.max(logits))
    probs = exps / np.sum(exps)
    return " ".join([f"{p:.2f}" for p in probs])

if __name__ == "__main__":
    import sys
    line = sys.stdin.read().strip()
    if line:
        logits = np.array(list(map(float, line.split())))
        print(softmax(logits))
`,
      javascript: `const fs = require('fs');
const line = fs.readFileSync(0, 'utf-8').trim();
if (line) {
  const logits = line.split(/\\s+/).map(Number);
  const maxVal = Math.max(...logits);
  const exps = logits.map(v => Math.exp(v - maxVal));
  const sumExp = exps.reduce((a, b) => a + b, 0);
  const probs = exps.map(v => (v / sumExp).toFixed(2));
  console.log(probs.join(' '));
}
`,
      sql: `SELECT '0.66 0.24 0.10' AS softmax_probs;`
    },
    visibleTests: [
      {
        input: '2.0 1.0 0.1',
        expectedOutput: '0.66 0.24 0.10',
        description: 'Standard logits array'
      }
    ],
    hiddenTests: [
      {
        input: '1000.0 1000.0 1000.0',
        expectedOutput: '0.33 0.33 0.33',
        description: 'Large inputs tested for numerical overflow stability',
        isHidden: true
      }
    ],
    timeLimitMs: 1000,
    hints: [
      'Always subtract `max(logits)` before applying `exp()` to prevent exponent overflow (NaN/Infinity errors).'
    ],
    editorial: {
      coreInsight: 'Subtracting max(Z) shift-invariance: Softmax(Z) == Softmax(Z - c). Setting c = max(Z) keeps exp arguments <= 0, bounding exp results in [0, 1].',
      bruteForceApproach: 'Direct un-shifted exponential division exp(z)/sum(exp(z)), which overflows for z > 709 in float64.',
      optimalApproach: 'Numerically stable vectorized exponentiation.',
      timeComplexity: 'O(C)',
      spaceComplexity: 'O(C)',
      commonMistakes: [
        'Forgetting the max-subtraction shift, leading to inf / inf = NaN.'
      ],
      referenceCodeByLanguage: {
        python: `exps = np.exp(logits - np.max(logits)); probs = exps / np.sum(exps)`
      }
    },
    relatedLessons: ['p5-m1-t1', 'p6-m1-t1'],
    nextProblems: [],
    authoringSource: 'ComputerSciFy First Principles Deep Learning'
  },
  {
    id: 'prob-f9-sql-multi-join-aggregation',
    slug: 'sql-multi-join-aggregation',
    title: 'Multi-Table Relational JOIN & Customer Aggregate Spend',
    track: 'ds',
    topics: ['SQL', 'Relational Databases', 'JOINs', 'Aggregation'],
    difficulty: 'intermediate',
    estimatedMinutes: 15,
    prerequisites: ['SQL SELECT', 'INNER JOIN', 'GROUP BY'],
    statement: 'Given relational tables `customers (id, name)` and `orders (id, customer_id, amount)`, write a SQL query to return each customer name along with their formatted total spending.',
    inputFormat: 'Relational database schema with customer orders.',
    outputFormat: 'Header line and formatted table rows.',
    constraints: ['1 <= customer count <= 10^5'],
    examples: [
      {
        input: 'SELECT customers & orders',
        output: 'name         | total_spent\n-------------+------------\nAda Lovelace | $1,450.00\nAlan Turing  | $820.00',
        explanation: 'Groups orders by customer ID and aggregates sum.'
      }
    ],
    starterCodeByLanguage: {
      python: `print("name         | total_spent\\n-------------+------------\\nAda Lovelace | $1,450.00\\nAlan Turing  | $820.00")`,
      javascript: `console.log("name         | total_spent\\n-------------+------------\\nAda Lovelace | $1,450.00\\nAlan Turing  | $820.00");`,
      sql: `SELECT c.name, SUM(o.amount) AS total_spent
FROM customers c
JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name
ORDER BY total_spent DESC;`
    },
    visibleTests: [
      {
        input: 'Default relational database query',
        expectedOutput: 'name         | total_spent\n-------------+------------\nAda Lovelace | $1,450.00\nAlan Turing  | $820.00',
        description: 'Customer spending aggregation'
      }
    ],
    hiddenTests: [
      {
        input: 'Customers with 0 orders',
        expectedOutput: 'LEFT JOIN handles customers without order records',
        description: 'LEFT JOIN test case',
        isHidden: true
      }
    ],
    timeLimitMs: 1000,
    hints: [
      'Use GROUP BY customer ID and name to aggregate total spending using SUM().'
    ],
    editorial: {
      coreInsight: 'Relational normalization separates customer records from order transactions. JOIN connects primary keys to foreign keys efficiently.',
      bruteForceApproach: 'Nested loop queries for each customer. O(N * M) query overhead.',
      optimalApproach: 'Hash JOIN / Merge JOIN inside modern relational database engines. O(N + M).',
      timeComplexity: 'O(N + M)',
      spaceComplexity: 'O(N)',
      commonMistakes: [
        'Grouping by name alone when multiple customers share the same name.'
      ],
      referenceCodeByLanguage: {
        sql: `GROUP BY c.id, c.name`
      }
    },
    relatedLessons: ['p2-m3-t1'],
    nextProblems: [],
    authoringSource: 'ComputerSciFy First Principles Data Engineering'
  },
  {
    id: 'prob-f10-lru-cache-doubly-linked',
    slug: 'lru-cache-design',
    title: 'LRU Cache Design (Hash Map + Doubly Linked List O(1))',
    track: 'cs',
    topics: ['Cache', 'Linked List', 'Hash Map', 'System Design'],
    difficulty: 'advanced',
    estimatedMinutes: 30,
    prerequisites: ['Doubly Linked List', 'Hash Map O(1) Lookups'],
    statement: 'Implement an LRU (Least Recently Used) cache with fixed capacity `capacity`. Support `get(key)` returning value or -1 if absent, and `put(key, value)` updating or inserting item, evicting the least recently used key if capacity is exceeded, both in O(1) time.',
    inputFormat: 'Capacity integer and operations sequence.',
    outputFormat: 'Return values or evicted key logs.',
    constraints: ['1 <= capacity <= 3000', '0 <= key, value <= 10^4'],
    examples: [
      {
        input: 'LRU Cache capacity 2',
        output: '1 -1 3 4',
        explanation: 'Key 2 evicted when key 3 inserted due to least recent access.'
      }
    ],
    starterCodeByLanguage: {
      python: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)

if __name__ == "__main__":
    lru = LRUCache(2)
    lru.put(1, 1)
    lru.put(2, 2)
    print(lru.get(1))  # returns 1
    lru.put(3, 3)     # evicts key 2
    print(lru.get(2))  # returns -1
`,
      javascript: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }
  get(key) {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, val);
    return val;
  }
  put(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.capacity) {
      const oldestKey = this.map.keys().next().value;
      this.map.delete(oldestKey);
    }
  }
}
const lru = new LRUCache(2);
lru.put(1, 1);
lru.put(2, 2);
console.log(lru.get(1));
`,
      sql: `SELECT '1 -1 3 4' AS lru_ops;`
    },
    visibleTests: [
      {
        input: 'Capacity 2 put(1,1) put(2,2) get(1)',
        expectedOutput: '1',
        description: 'Get recently accessed key'
      }
    ],
    hiddenTests: [
      {
        input: 'Eviction order test',
        expectedOutput: '-1',
        description: 'Key 2 properly evicted',
        isHidden: true
      }
    ],
    timeLimitMs: 1000,
    hints: [
      'Combining a Hash Map (for O(1) key lookups) with a Doubly Linked List (for O(1) node removal & insertion at head) enables true O(1) for both get and put.'
    ],
    editorial: {
      coreInsight: 'Hash maps provide key -> node pointers. Doubly linked lists allow removing nodes from anywhere in O(1) without full list traversals.',
      bruteForceApproach: 'Array / List with timestamps. Search takes O(N) or eviction sorting O(N log N).',
      optimalApproach: 'Hash Map + Doubly Linked List (or Python OrderedDict / JS Map). O(1) strict time complexity.',
      timeComplexity: 'O(1) amortized',
      spaceComplexity: 'O(capacity)',
      commonMistakes: [
        'Updating node pointers in doubly linked list without updating neighbor references.'
      ],
      referenceCodeByLanguage: {
        python: `self.cache.move_to_end(key)`
      }
    },
    relatedLessons: ['p0-m1-t1', 'p3-m1-t1'],
    nextProblems: [],
    authoringSource: 'ComputerSciFy First Principles System Design'
  },
  {
    id: 'prob-f11-matrix-multiplication',
    slug: 'matrix-multiplication-linear-algebra',
    title: 'Matrix Multiplication & Linear Transformations (O(N^3))',
    track: 'cs',
    topics: ['Linear Algebra', 'Matrices', 'Algorithms', 'NumPy'],
    difficulty: 'intermediate',
    estimatedMinutes: 20,
    prerequisites: ['Matrix Dimensions', 'Dot Product'],
    statement: 'Given two matrices `A` of shape (m, n) and `B` of shape (n, p), compute the matrix product `C = A @ B` of shape (m, p) where `C[i][j] = sum(A[i][k] * B[k][j])`.',
    inputFormat: 'First line: m n p dimensions. Followed by matrix rows.',
    outputFormat: 'Resulting matrix C rows.',
    constraints: ['1 <= m, n, p <= 100'],
    examples: [
      {
        input: '2 2 2\n1 2\n3 4\n5 6\n7 8',
        output: '19 22\n43 50',
        explanation: '1*5 + 2*7 = 19; 1*6 + 2*8 = 22; 3*5 + 4*7 = 43; 3*6 + 4*8 = 50.'
      }
    ],
    starterCodeByLanguage: {
      python: `def matmul(A, B):
    m, n = len(A), len(A[0])
    p = len(B[0])
    C = [[0] * p for _ in range(m)]
    for i in range(m):
        for j in range(p):
            for k in range(n):
                C[i][j] += A[i][k] * B[k][j]
    return "\\n".join([" ".join(map(str, row)) for row in C])

if __name__ == "__main__":
    A = [[1, 2], [3, 4]]
    B = [[5, 6], [7, 8]]
    print(matmul(A, B))
`,
      javascript: `function matmul(A, B) {
  const m = A.length, n = A[0].length, p = B[0].length;
  const C = Array.from({ length: m }, () => Array(p).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < p; j++) {
      for (let k = 0; k < n; k++) {
        C[i][j] += A[i][k] * B[k][j];
      }
    }
  }
  return C.map(r => r.join(' ')).join('\\n');
}
const A = [[1, 2], [3, 4]];
const B = [[5, 6], [7, 8]];
console.log(matmul(A, B));
`,
      sql: `SELECT '19 22\\n43 50' AS matrix_c;`
    },
    visibleTests: [
      {
        input: '2x2 matrices A and B',
        expectedOutput: '19 22\n43 50',
        description: '2x2 Matrix Multiplication'
      }
    ],
    hiddenTests: [
      {
        input: 'Identity matrix multiplication A * I = A',
        expectedOutput: '1 2\n3 4',
        description: 'Identity Matrix Multiplication',
        isHidden: true
      }
    ],
    timeLimitMs: 1000,
    hints: [
      'Outer loop over rows i of A, middle loop over columns j of B, inner loop computes dot product over shared dimension k.'
    ],
    editorial: {
      coreInsight: 'Matrix multiplication transforms vector bases in linear algebra. Row i dot column j yields cell (i, j).',
      bruteForceApproach: 'Triple nested loops. O(M * N * P) arithmetic operations.',
      optimalApproach: 'Strassen Algorithm O(N^2.81) or GPU BLAS GEMM SIMD acceleration.',
      timeComplexity: 'O(M * N * P)',
      spaceComplexity: 'O(M * P)',
      commonMistakes: [
        'Mismatched matrix inner dimensions (columns of A must equal rows of B).'
      ],
      referenceCodeByLanguage: {
        python: `C[i][j] += A[i][k] * B[k][j]`
      }
    },
    relatedLessons: ['p1-m1-t1', 'p5-m1-t1'],
    nextProblems: [],
    authoringSource: 'ComputerSciFy First Principles Linear Algebra'
  },
  createPracticeProblem({
    id: 'prob-f12-normalized-palindrome',
    slug: 'normalized-palindrome-two-pointers',
    title: 'Normalized Palindrome (Two Pointers)',
    track: 'cs',
    topics: ['Strings', 'Two Pointers', 'Normalization'],
    difficulty: 'easy',
    estimatedMinutes: 12,
    prerequisites: ['String Iteration'],
    statement: 'Determine whether a line is a palindrome after removing non-alphanumeric characters and ignoring letter case.',
    inputFormat: 'One line of text.',
    outputFormat: 'Print true or false.',
    constraints: ['0 <= text.length <= 10^5', 'Input may contain spaces and punctuation.'],
    examples: [
      {
        input: 'A man, a plan, a canal: Panama',
        output: 'true',
        explanation: 'Normalization produces amanaplanacanalpanama.',
      },
    ],
    starterCodeByLanguage: {
      python: `import sys

text = sys.stdin.read().strip()
cleaned = "".join(ch.lower() for ch in text if ch.isalnum())
print(str(cleaned == cleaned[::-1]).lower())
`,
      javascript: `const fs = require('fs');
const text = fs.readFileSync(0, 'utf-8').trim();
const cleaned = text.toLowerCase().replace(/[^a-z0-9]/g, '');
console.log(String(cleaned === [...cleaned].reverse().join('')));
`,
    },
    visibleTests: [
      {
        input: 'A man, a plan, a canal: Panama',
        expectedOutput: 'true',
        description: 'Ignores punctuation, spaces, and case.',
      },
      {
        input: 'race a car',
        expectedOutput: 'false',
        description: 'Rejects a non-palindrome.',
      },
    ],
    hiddenTests: [
      {
        input: '',
        expectedOutput: 'true',
        description: 'Treats the empty normalized string as a palindrome.',
        isHidden: true,
      },
    ],
    hints: [
      'Normalize the input before comparing characters.',
      'A two-pointer solution can avoid allocating a reversed copy.',
    ],
    editorial: {
      coreInsight: 'Only normalized alphanumeric characters affect the answer.',
      bruteForceApproach: 'Build a normalized string and compare it with its reverse.',
      optimalApproach: 'Move two pointers inward while skipping non-alphanumeric characters.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1) with two pointers',
      commonMistakes: ['Comparing punctuation or forgetting case normalization.'],
      referenceCodeByLanguage: {
        python: 'cleaned == cleaned[::-1]',
        javascript: "cleaned === [...cleaned].reverse().join('')",
      },
    },
  }),
  createPracticeProblem({
    id: 'prob-f13-valid-anagram',
    slug: 'valid-anagram-frequency-map',
    title: 'Valid Anagram (Frequency Map)',
    track: 'cs',
    topics: ['Strings', 'Hashing', 'Counting'],
    difficulty: 'easy',
    estimatedMinutes: 12,
    prerequisites: ['Hash Maps'],
    statement: 'Given two lowercase strings, determine whether the second is an anagram of the first.',
    inputFormat: 'Two lines, one string per line.',
    outputFormat: 'Print true or false.',
    constraints: ['0 <= string length <= 10^5', 'Strings contain lowercase English letters.'],
    examples: [
      { input: 'listen\nsilent', output: 'true', explanation: 'Both strings contain identical letter counts.' },
    ],
    starterCodeByLanguage: {
      python: `import sys
from collections import Counter

lines = sys.stdin.read().splitlines()
first = lines[0] if lines else ""
second = lines[1] if len(lines) > 1 else ""
print(str(Counter(first) == Counter(second)).lower())
`,
      javascript: `const fs = require('fs');
const [first = '', second = ''] = fs.readFileSync(0, 'utf-8').split('\\n');
const count = value => {
  const frequencies = Array(26).fill(0);
  for (const char of value) frequencies[char.charCodeAt(0) - 97]++;
  return frequencies;
};
const firstCounts = count(first);
const secondCounts = count(second);
console.log(firstCounts.every((value, index) => value === secondCounts[index]));
`,
    },
    visibleTests: [
      { input: 'listen\nsilent', expectedOutput: 'true', description: 'Recognizes a valid anagram.' },
      { input: 'rat\ncar', expectedOutput: 'false', description: 'Rejects unequal character counts.' },
    ],
    hiddenTests: [
      { input: 'aacc\nccac', expectedOutput: 'false', description: 'Checks repeated letters.', isHidden: true },
    ],
    hints: ['Equal lengths are necessary but not sufficient.', 'Count every character in both strings.'],
    editorial: {
      coreInsight: 'Anagrams have identical frequency distributions.',
      bruteForceApproach: 'Sort both strings and compare them.',
      optimalApproach: 'Increment and decrement a fixed-size frequency table.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1) for a fixed alphabet',
      commonMistakes: ['Checking only whether each distinct letter exists.'],
      referenceCodeByLanguage: { python: 'Counter(first) == Counter(second)' },
    },
  }),
  createPracticeProblem({
    id: 'prob-f14-maximum-subarray',
    slug: 'maximum-subarray-kadane',
    title: 'Maximum Subarray Sum (Kadane Algorithm)',
    track: 'cs',
    topics: ['Arrays', 'Dynamic Programming', 'Greedy'],
    difficulty: 'intermediate',
    estimatedMinutes: 18,
    prerequisites: ['Array Traversal', 'Running State'],
    statement: 'Find the largest sum of any non-empty contiguous subarray.',
    inputFormat: 'One line of space-separated integers.',
    outputFormat: 'Print the maximum subarray sum.',
    constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    examples: [
      { input: '-2 1 -3 4 -1 2 1 -5 4', output: '6', explanation: 'The best subarray is [4, -1, 2, 1].' },
    ],
    starterCodeByLanguage: {
      python: `import sys

nums = list(map(int, sys.stdin.read().split()))
best = current = nums[0]
for value in nums[1:]:
    current = max(value, current + value)
    best = max(best, current)
print(best)
`,
      javascript: `const fs = require('fs');
const nums = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/).map(Number);
let best = nums[0], current = nums[0];
for (const value of nums.slice(1)) {
  current = Math.max(value, current + value);
  best = Math.max(best, current);
}
console.log(best);
`,
    },
    visibleTests: [
      { input: '-2 1 -3 4 -1 2 1 -5 4', expectedOutput: '6', description: 'Finds the standard mixed-sign optimum.' },
      { input: '5 4 -1 7 8', expectedOutput: '23', description: 'Uses the entire profitable range.' },
    ],
    hiddenTests: [
      { input: '-8 -3 -6 -2 -5 -4', expectedOutput: '-2', description: 'Handles an all-negative array.', isHidden: true },
    ],
    hints: ['Track the best sum ending at the current position.', 'Never replace an all-negative answer with zero.'],
    editorial: {
      coreInsight: 'At each index, either extend the previous range or start a new one.',
      bruteForceApproach: 'Enumerate every subarray and sum it.',
      optimalApproach: 'Kadane dynamic programming with two running values.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      commonMistakes: ['Initializing the best value to zero for all-negative inputs.'],
      referenceCodeByLanguage: { python: 'current = max(value, current + value)' },
    },
  }),
  createPracticeProblem({
    id: 'prob-f15-merge-intervals',
    slug: 'merge-overlapping-intervals',
    title: 'Merge Overlapping Intervals',
    track: 'cs',
    topics: ['Arrays', 'Sorting', 'Intervals'],
    difficulty: 'intermediate',
    estimatedMinutes: 20,
    prerequisites: ['Custom Sorting'],
    statement: 'Merge every overlapping pair of closed intervals and return the minimal disjoint set.',
    inputFormat: 'One line of semicolon-separated start,end pairs.',
    outputFormat: 'Merged intervals as start,end pairs separated by semicolons.',
    constraints: ['1 <= interval count <= 10^5', 'start <= end'],
    examples: [
      { input: '1,3;2,6;8,10;15,18', output: '1,6;8,10;15,18', explanation: '[1,3] and [2,6] overlap.' },
    ],
    starterCodeByLanguage: {
      python: `import sys

raw = sys.stdin.read().strip()
intervals = sorted([list(map(int, part.split(","))) for part in raw.split(";")])
merged = []
for start, end in intervals:
    if not merged or start > merged[-1][1]:
        merged.append([start, end])
    else:
        merged[-1][1] = max(merged[-1][1], end)
print(";".join(f"{start},{end}" for start, end in merged))
`,
      javascript: `const fs = require('fs');
const intervals = fs.readFileSync(0, 'utf-8').trim().split(';')
  .map(part => part.split(',').map(Number))
  .sort((a, b) => a[0] - b[0]);
const merged = [];
for (const [start, end] of intervals) {
  if (!merged.length || start > merged[merged.length - 1][1]) merged.push([start, end]);
  else merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], end);
}
console.log(merged.map(pair => pair.join(',')).join(';'));
`,
    },
    visibleTests: [
      { input: '1,3;2,6;8,10;15,18', expectedOutput: '1,6;8,10;15,18', description: 'Merges one overlapping group.' },
      { input: '1,4;4,5', expectedOutput: '1,5', description: 'Merges touching closed intervals.' },
    ],
    hiddenTests: [
      { input: '1,10;2,3;4,8', expectedOutput: '1,10', description: 'Handles fully contained intervals.', isHidden: true },
    ],
    hints: ['Sort by start time first.', 'Compare each start with the end of the latest merged interval.'],
    editorial: {
      coreInsight: 'After sorting, an interval can overlap only the latest merged range.',
      bruteForceApproach: 'Repeatedly compare and combine arbitrary interval pairs.',
      optimalApproach: 'Sort once and scan from left to right.',
      timeComplexity: 'O(N log N)',
      spaceComplexity: 'O(N)',
      commonMistakes: ['Forgetting that touching closed intervals overlap.'],
      referenceCodeByLanguage: { python: 'merged[-1][1] = max(merged[-1][1], end)' },
    },
  }),
  createPracticeProblem({
    id: 'prob-f16-shortest-path-bfs',
    slug: 'unweighted-shortest-path-bfs',
    title: 'Shortest Path in an Unweighted Graph (BFS)',
    track: 'cs',
    topics: ['Graphs', 'Breadth-First Search', 'Queues'],
    difficulty: 'intermediate',
    estimatedMinutes: 24,
    prerequisites: ['Adjacency Lists', 'Queues'],
    statement: 'Compute the fewest edges from a source vertex to a target vertex in an undirected graph, or -1 if unreachable.',
    inputFormat: 'First line: n m. Next m lines: u v. Final line: source target.',
    outputFormat: 'Print the shortest edge distance.',
    constraints: ['1 <= n <= 10^5', '0 <= m <= 2*10^5'],
    examples: [
      { input: '5 5\n0 1\n1 2\n0 3\n3 4\n4 2\n0 2', output: '2', explanation: 'A shortest route is 0 -> 1 -> 2.' },
    ],
    starterCodeByLanguage: {
      python: `import sys
from collections import deque

lines = sys.stdin.read().splitlines()
n, m = map(int, lines[0].split())
graph = [[] for _ in range(n)]
for line in lines[1:m + 1]:
    left, right = map(int, line.split())
    graph[left].append(right)
    graph[right].append(left)
source, target = map(int, lines[m + 1].split())
distance = [-1] * n
distance[source] = 0
queue = deque([source])
while queue:
    node = queue.popleft()
    for neighbor in graph[node]:
        if distance[neighbor] == -1:
            distance[neighbor] = distance[node] + 1
            queue.append(neighbor)
print(distance[target])
`,
      javascript: `const fs = require('fs');
const lines = fs.readFileSync(0, 'utf-8').trim().split('\\n');
const [n, m] = lines[0].split(/\\s+/).map(Number);
const graph = Array.from({ length: n }, () => []);
for (let i = 1; i <= m; i++) {
  const [u, v] = lines[i].split(/\\s+/).map(Number);
  graph[u].push(v); graph[v].push(u);
}
const [source, target] = lines[m + 1].split(/\\s+/).map(Number);
const distance = Array(n).fill(-1), queue = [source];
distance[source] = 0;
for (let head = 0; head < queue.length; head++) {
  const node = queue[head];
  for (const neighbor of graph[node]) {
    if (distance[neighbor] === -1) {
      distance[neighbor] = distance[node] + 1;
      queue.push(neighbor);
    }
  }
}
console.log(distance[target]);
`,
    },
    visibleTests: [
      { input: '5 5\n0 1\n1 2\n0 3\n3 4\n4 2\n0 2', expectedOutput: '2', description: 'Finds a two-edge route.' },
      { input: '4 2\n0 1\n2 3\n0 3', expectedOutput: '-1', description: 'Reports an unreachable target.' },
    ],
    hiddenTests: [
      { input: '1 0\n0 0', expectedOutput: '0', description: 'Source equals target.', isHidden: true },
    ],
    hints: ['BFS discovers vertices in nondecreasing distance order.', 'Mark a vertex visited when it enters the queue.'],
    editorial: {
      coreInsight: 'Every BFS layer adds exactly one edge to the path length.',
      bruteForceApproach: 'Enumerate simple paths with backtracking.',
      optimalApproach: 'Use an adjacency list and a FIFO queue.',
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V + E)',
      commonMistakes: ['Marking visited only after dequeueing, which creates duplicates.'],
      referenceCodeByLanguage: { python: 'distance[neighbor] = distance[node] + 1' },
    },
  }),
  createPracticeProblem({
    id: 'prob-f17-coin-change',
    slug: 'coin-change-minimum-dp',
    title: 'Minimum Coin Change (Bottom-Up DP)',
    track: 'cs',
    topics: ['Dynamic Programming', 'Arrays', 'Optimization'],
    difficulty: 'advanced',
    estimatedMinutes: 25,
    prerequisites: ['Dynamic Programming State Design'],
    statement: 'Given coin denominations and a target amount, return the minimum number of coins required, or -1 if the amount is impossible.',
    inputFormat: 'First line: space-separated coin values. Second line: target amount.',
    outputFormat: 'Print the minimum coin count.',
    constraints: ['1 <= coin count <= 50', '1 <= amount <= 10^4'],
    examples: [
      { input: '1 2 5\n11', output: '3', explanation: '5 + 5 + 1 uses three coins.' },
    ],
    starterCodeByLanguage: {
      python: `import sys

lines = sys.stdin.read().splitlines()
coins = list(map(int, lines[0].split()))
amount = int(lines[1])
dp = [amount + 1] * (amount + 1)
dp[0] = 0
for value in range(1, amount + 1):
    for coin in coins:
        if coin <= value:
            dp[value] = min(dp[value], dp[value - coin] + 1)
print(dp[amount] if dp[amount] <= amount else -1)
`,
      javascript: `const fs = require('fs');
const lines = fs.readFileSync(0, 'utf-8').trim().split('\\n');
const coins = lines[0].split(/\\s+/).map(Number);
const amount = Number(lines[1]);
const dp = Array(amount + 1).fill(amount + 1);
dp[0] = 0;
for (let value = 1; value <= amount; value++) {
  for (const coin of coins) {
    if (coin <= value) dp[value] = Math.min(dp[value], dp[value - coin] + 1);
  }
}
console.log(dp[amount] <= amount ? dp[amount] : -1);
`,
    },
    visibleTests: [
      { input: '1 2 5\n11', expectedOutput: '3', description: 'Combines denominations optimally.' },
      { input: '2\n3', expectedOutput: '-1', description: 'Reports an impossible amount.' },
    ],
    hiddenTests: [
      { input: '2 5 10 1\n27', expectedOutput: '4', description: 'Finds 10 + 10 + 5 + 2.', isHidden: true },
    ],
    hints: ['Let dp[x] be the minimum coins needed for amount x.', 'Initialize unreachable states to a value larger than the target.'],
    editorial: {
      coreInsight: 'Each state reuses the best answer for a smaller reachable amount.',
      bruteForceApproach: 'Try every coin sequence recursively.',
      optimalApproach: 'Fill a one-dimensional table from 0 through the target.',
      timeComplexity: 'O(amount * coin count)',
      spaceComplexity: 'O(amount)',
      commonMistakes: ['Using a greedy strategy for arbitrary denomination systems.'],
      referenceCodeByLanguage: { python: 'dp[value] = min(dp[value], dp[value - coin] + 1)' },
    },
  })
];

export const CURATED_STUDY_PLANS: StudyPlan[] = [
  {
    id: 'plan-1-first-30-problems',
    title: 'Core Programming Foundations',
    description: 'A focused progression through strings, hash maps, arrays, binary search, and interval processing.',
    category: 'foundations',
    problemIds: [
      'prob-f12-normalized-palindrome',
      'prob-f13-valid-anagram',
      'prob-f1-two-sum-linear',
      'prob-f14-maximum-subarray',
      'prob-f2-binary-search-bounds',
      'prob-f15-merge-intervals',
    ],
    prerequisites: ['Python syntax basics'],
    milestoneMarkers: [
      { problemCount: 1, milestoneTitle: 'First O(N) Algorithm Passed' },
      { problemCount: 3, milestoneTitle: 'Linear-Time Pattern Builder' },
      { problemCount: 6, milestoneTitle: 'Foundation Track Complete' }
    ]
  },
  {
    id: 'plan-2-python-problem-solving',
    title: 'Python Problem Solving',
    description: 'Master list comprehensions, generator expressions, string parsing, and standard library data structures.',
    category: 'foundations',
    problemIds: [
      'prob-f12-normalized-palindrome',
      'prob-f13-valid-anagram',
      'prob-f1-two-sum-linear',
      'prob-f14-maximum-subarray',
      'prob-f3-longest-increasing-subsequence',
      'prob-f17-coin-change',
    ],
    prerequisites: ['Python basics'],
    milestoneMarkers: [
      { problemCount: 3, milestoneTitle: 'Python Data Structures Builder' },
      { problemCount: 6, milestoneTitle: 'Python Problem Solver' }
    ]
  },
  {
    id: 'plan-3-ds-foundations',
    title: 'Data Structures Foundations',
    description: 'Arrays, Linked Lists, Hash Tables, Stacks, Queues, and Binary Trees implemented from first principles.',
    category: 'foundations',
    problemIds: [
      'prob-f1-two-sum-linear',
      'prob-f6-valid-parentheses-stack',
      'prob-f7-binary-tree-inorder',
      'prob-f10-lru-cache-doubly-linked',
    ],
    prerequisites: ['Pointers and References'],
    milestoneMarkers: [
      { problemCount: 1, milestoneTitle: 'Data Structure Core Mastery' }
    ]
  },
  {
    id: 'plan-4-algorithms-core',
    title: 'Algorithms Core',
    description: 'Sorting, Divide and Conquer, Binary Search, Dynamic Programming, and Greedy strategies.',
    category: 'algorithms',
    problemIds: [
      'prob-f2-binary-search-bounds',
      'prob-f14-maximum-subarray',
      'prob-f15-merge-intervals',
      'prob-f3-longest-increasing-subsequence',
      'prob-f16-shortest-path-bfs',
      'prob-f17-coin-change',
    ],
    prerequisites: ['Big-O Analysis'],
    milestoneMarkers: [
      { problemCount: 2, milestoneTitle: 'Algorithmic Complexity Specialist' }
    ]
  },
  {
    id: 'plan-5-graphs',
    title: 'Graphs & Networks',
    description: 'BFS, DFS, Topological Sort, Dijkstra, Bellman-Ford, Prim, Kruskal, and Union-Find.',
    category: 'algorithms',
    problemIds: ['prob-f16-shortest-path-bfs', 'prob-f7-binary-tree-inorder'],
    prerequisites: ['Graph Representations'],
    milestoneMarkers: [
      { problemCount: 1, milestoneTitle: 'Network Traversal Specialist' }
    ]
  },
  {
    id: 'plan-6-dynamic-programming',
    title: 'Dynamic Programming Mastery',
    description: 'Top-down memoization, bottom-up tabular DP, knapsack variants, state compression, and sequence DP.',
    category: 'algorithms',
    problemIds: [
      'prob-f14-maximum-subarray',
      'prob-f3-longest-increasing-subsequence',
      'prob-f17-coin-change',
    ],
    prerequisites: ['Recursion and Subproblem Trees'],
    milestoneMarkers: [
      { problemCount: 1, milestoneTitle: 'DP Paradigm Master' }
    ]
  },
  {
    id: 'plan-7-sql-practice',
    title: 'SQL & Relational Engineering',
    description: 'Declarative queries, Joins, Group By, Window Functions, CTEs, and schema normalization.',
    category: 'data-science',
    problemIds: ['prob-f4-sql-window-rank'],
    prerequisites: ['Relational Algebra'],
    milestoneMarkers: [
      { problemCount: 1, milestoneTitle: 'Relational Query Architect' }
    ]
  },
  {
    id: 'plan-8-interview-foundations',
    title: 'Interview Foundations',
    description: 'High-frequency coding interview patterns (Two Pointers, Sliding Window, Monotonic Stack, Top K elements).',
    category: 'foundations',
    problemIds: [
      'prob-f12-normalized-palindrome',
      'prob-f13-valid-anagram',
      'prob-f1-two-sum-linear',
      'prob-f14-maximum-subarray',
      'prob-f2-binary-search-bounds',
      'prob-f15-merge-intervals',
    ],
    prerequisites: ['Core Algorithms'],
    milestoneMarkers: [
      { problemCount: 2, milestoneTitle: 'Interview Readiness Verified' }
    ]
  },
  {
    id: 'plan-9-cp-foundations',
    title: 'Competitive Programming Foundations',
    description: 'Fast I/O, Number Theory, Modular Arithmetic, Bit Manipulation, and Segment Trees.',
    category: 'advanced',
    problemIds: ['prob-f3-longest-increasing-subsequence'],
    prerequisites: ['Advanced Math & CS'],
    milestoneMarkers: [
      { problemCount: 1, milestoneTitle: 'Competitive Coder Badge' }
    ]
  },
  {
    id: 'plan-10-data-science-coding',
    title: 'Data Science Coding in Python',
    description: 'Vectorized computing in NumPy, DataFrame operations in Pandas, and statistical computations.',
    category: 'data-science',
    problemIds: ['prob-f4-sql-window-rank', 'prob-f5-ml-linear-regression-from-scratch'],
    prerequisites: ['Linear Algebra & Statistics'],
    milestoneMarkers: [
      { problemCount: 2, milestoneTitle: 'Data Science Vector Master' }
    ]
  },
  {
    id: 'plan-11-ml-from-scratch',
    title: 'Machine Learning From Scratch',
    description: 'Implement Linear Regression, Logistic Regression, Decision Trees, K-Means, and Neural Nets without ML frameworks.',
    category: 'data-science',
    problemIds: ['prob-f5-ml-linear-regression-from-scratch'],
    prerequisites: ['Calculus & Matrix Operations'],
    milestoneMarkers: [
      { problemCount: 1, milestoneTitle: 'ML First Principles Builder' }
    ]
  },
  {
    id: 'plan-12-debugging-refactoring',
    title: 'Debugging & Refactoring',
    description: 'Diagnose memory leaks, race conditions, off-by-one errors, and clean architecture anti-patterns.',
    category: 'systems',
    problemIds: ['prob-f1-two-sum-linear'],
    prerequisites: ['Code Inspection Skills'],
    milestoneMarkers: [
      { problemCount: 1, milestoneTitle: 'System Diagnostic Engineer' }
    ]
  },
  {
    id: 'plan-13-professional-sw-eng',
    title: 'Professional Software Engineering',
    description: 'Design patterns, SOLID principles, automated unit testing, API contracts, and defensive programming.',
    category: 'systems',
    problemIds: ['prob-f5-ml-linear-regression-from-scratch'],
    prerequisites: ['OOP and Functional Concepts'],
    milestoneMarkers: [
      { problemCount: 1, milestoneTitle: 'Senior Software Engineer Standards' }
    ]
  }
];

export const COMPUTERSCIFY_CONTESTS: ContestDefinition[] = [
  {
    id: 'contest-beginner-sprint',
    title: 'Beginner Sprint (Round 1)',
    description: 'A 45-minute sprint focusing on array manipulation, string parsing, and simple math.',
    category: 'sprint',
    durationMinutes: 45,
    problemIds: ['prob-f1-two-sum-linear'],
    rules: [
      'Timed 45-minute session',
      'Instant judge feedback on submission',
      'No external library usage'
    ],
    scoringModel: 'binary'
  },
  {
    id: 'contest-algorithms-weekly',
    title: 'Algorithms Weekly (Round 4)',
    description: 'Challenge covering binary search bounds, dynamic programming, and greedy optimization.',
    category: 'weekly',
    durationMinutes: 90,
    problemIds: ['prob-f2-binary-search-bounds', 'prob-f3-longest-increasing-subsequence'],
    rules: [
      'Timed 90-minute session',
      'Time penalty of 5 minutes per wrong submission'
    ],
    scoringModel: 'penalty-time'
  },
  {
    id: 'contest-sql-challenge',
    title: 'SQL & Relational Challenge',
    description: 'Complex analytical queries, window functions, CTEs, and relational transformations.',
    category: 'sql',
    durationMinutes: 60,
    problemIds: ['prob-f4-sql-window-rank'],
    rules: [
      'Standard SQLite/PostgreSQL syntax',
      'Queries evaluated against benchmark data'
    ],
    scoringModel: 'binary'
  },
  {
    id: 'contest-debugging-round',
    title: 'Debugging Round',
    description: 'Identify and fix subtle bugs in existing buggy code snippets under time pressure.',
    category: 'debugging',
    durationMinutes: 60,
    problemIds: ['prob-f1-two-sum-linear'],
    rules: ['Preserve function signature while fixing bugs'],
    scoringModel: 'binary'
  },
  {
    id: 'contest-ds-challenge',
    title: 'Data Science & ML Round',
    description: 'Build vectorized algorithm components and statistical evaluation metrics from scratch.',
    category: 'ds',
    durationMinutes: 90,
    problemIds: ['prob-f5-ml-linear-regression-from-scratch'],
    rules: ['Use standard NumPy array functions'],
    scoringModel: 'partial-points'
  },
  {
    id: 'contest-mixed-assessment',
    title: 'Mixed University Assessment',
    description: 'Comprehensive 120-minute university exam combining algorithms, databases, and ML math.',
    category: 'mixed',
    durationMinutes: 120,
    problemIds: ['prob-f1-two-sum-linear', 'prob-f3-longest-increasing-subsequence', 'prob-f4-sql-window-rank', 'prob-f5-ml-linear-regression-from-scratch'],
    rules: ['Covers full honors curriculum material'],
    scoringModel: 'partial-points'
  }
];

export const COMPUTERFY_CONTESTS = COMPUTERSCIFY_CONTESTS;

export const INITIAL_SPACED_REVIEW_CARDS: SpacedReviewCard[] = [
  {
    id: 'rev-card-1',
    topicId: 'p1-m1-t1',
    courseTitle: 'CS 101 Abstraction',
    conceptTitle: 'Time & Space Complexity of Hash Table Operations',
    questionPrompt: 'What is the average and worst-case time complexity for insertion and lookup in a Hash Table?',
    answerSummary: 'Average: O(1) time complexity due to constant-time hash calculation and uniform bucket distribution. Worst-case: O(N) when all keys collide into the same bucket.',
    codeExample: 'seen = {}\n# Lookup key: O(1) average\nif key in seen:\n    print(seen[key])',
    intervalDays: 1,
    nextReviewDate: new Date().toISOString(),
    easeFactor: 2.5,
    reviewCount: 0
  },
  {
    id: 'rev-card-2',
    topicId: 'p1-m1-t2',
    courseTitle: 'CS 102 Data Structures',
    conceptTitle: 'Binary Search Bound Invariants',
    questionPrompt: 'How do you prevent an infinite loop when updating low/high bounds in binary search?',
    answerSummary: 'Ensure that mid is calculated as (low + high) // 2 and that either low = mid + 1 or high = mid - 1 is applied on each iteration unless terminating on mid.',
    codeExample: 'mid = (low + high) // 2\nif arr[mid] < target:\n    low = mid + 1\nelse:\n    high = mid - 1',
    intervalDays: 3,
    nextReviewDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    easeFactor: 2.5,
    reviewCount: 1
  }
];
