import { CurriculumModule } from '../../types/curriculum';
import { VERIFIED_VIDEOS } from '../verifiedVideoRegistry';

export const phase2ProgrammingModules: CurriculumModule[] = [
  {
    id: 'p2-m8',
    phaseId: 2,
    title: 'Python Fundamentals',
    slug: 'python-fundamentals',
    category: 'cs',
    summary: 'Master Python syntax, core data types, control structures, functions, modular code design, file I/O, and error handling.',
    objective: 'Write readable, performant Python code using idiomatic patterns, strong type hinting, data structures (lists, dicts, sets, tuples), and defensive exception handling.',
    prerequisiteModuleIds: ['p0-m1'],
    estimatedHours: 22,
    difficulty: 'beginner',
    colorAccent: 'mint',
    capstone: {
      id: 'capstone-p2-m8',
      title: 'Command-Line Log Analyzer & Data Processor',
      description: 'Build a Python command-line utility that parses structured log files, calculates statistical metrics, handles corrupt entries gracefully, and outputs formatted JSON/CSV reports.',
      constraints: ['Pure Python standard library (json, csv, re, argparse).', 'Must handle large file streaming line-by-line.'],
      expectedDeliverables: ['Streaming file reader.', 'CLI argument parser.', 'Exception logger and report generator.'],
      evaluationRubric: [
        { criterion: 'Streaming Efficiency', weight: '40%', description: 'Processes log files without loading the full file into memory at once.' },
        { criterion: 'Error Resilience', weight: '30%', description: 'Gracefully skips corrupted lines with warning logging.' },
        { criterion: 'Code Quality & Typing', weight: '30%', description: 'Uses Python 3 type annotations and clean PEP 8 formatting.' }
      ]
    },
    topics: [
      {
        id: 'p2-m8-t1',
        moduleId: 'p2-m8',
        title: 'Python Syntax, Data Structures, and Control Flow',
        slug: 'python-syntax-structures',
        summary: 'Learn Python variable scope, list comprehensions, dictionary hash lookups, functions, and string formatting.',
        order: 1,
        masteryPack: {
          learningObjective: 'Utilize Python primitives, list/dict comprehensions, functions with keyword arguments, and error handling for problem solving.',
          prerequisites: ['Basic digital foundations'],
          coreConcepts: [
            'Dynamic Typing, Type Hinting, and Mutability vs Immutability: Python resolves a variable\'s type at runtime rather than at compile time, so the same name can be rebound to different types over its lifetime; optional type hints (e.g. `def add(a: int, b: int) -> int`) let tools like mypy catch type errors early without changing runtime behavior, and understanding which built-in types are mutable (lists, dicts, sets) versus immutable (ints, strings, tuples) is essential for predicting how data behaves when passed around.',
            'Core Collections: Lists, Tuples, Dictionaries (Hash Maps), and Sets: these four built-in container types are the backbone of nearly all Python programs — lists for ordered mutable sequences, tuples for ordered immutable records, dictionaries for fast key-based lookup via hashing, and sets for uniqueness and membership testing — and choosing the right one directly determines the performance and correctness of the log-analyzer capstone.',
            'Control Flow: If-Else, For/While Loops, List/Dict Comprehensions: conditional branching and iteration let a program make decisions and repeat work, while comprehensions provide a compact, often faster, functional-style syntax for building new lists, dicts, or sets from existing iterables in a single readable expression.',
            'Functions: Parameters, *args, **kwargs, Return Types, and Scope (LEGB Rule): functions package reusable logic behind a name; `*args` and `**kwargs` let a function accept a variable number of positional or keyword arguments, and the LEGB (Local, Enclosing, Global, Built-in) rule defines the order Python searches when resolving a variable name, which explains many "why doesn\'t this variable exist here" bugs.',
            'Exception Handling: Try-Except-Else-Finally and Custom Exceptions: wrapping risky operations (file access, parsing, network calls) in try-except blocks lets a program fail gracefully instead of crashing, the optional else clause runs only when no exception occurred, finally always runs for cleanup, and custom exception classes let you signal domain-specific error conditions clearly — directly needed for the capstone\'s "skip corrupted lines with warning logging" requirement.',
            'Modules and the Standard Library: Python ships with batteries-included modules such as `re`, `json`, `csv`, and `argparse` that provide regular expressions, structured data serialization, tabular file parsing, and command-line argument parsing respectively, so idiomatic Python leans on these before reaching for third-party packages.'
          ],
          simpleExplanation: `Think of a variable as a sticky note you attach to something — a number, a word, a list of things. In Python, you can peel that sticky note off a number and stick it onto a word instead, whenever you want. That's what "dynamic typing" means: the note doesn't lock in what kind of thing it can point at. This is different from languages where you have to pre-label a box as "only for numbers, forever."

Once you're storing lots of stuff, you need good containers. A list is like a numbered locker row — item 1 in locker 1, item 2 in locker 2 — and you can add or remove lockers as you like. A dictionary is more like a library's card catalog: instead of hunting through every book to find the Python section, you look up "Python" in the catalog and it points you straight to the right shelf, instantly, because the catalog is organized by a clever indexing trick (a "hash") rather than by walking through every card one at a time. A set is like a guest list at a party — it only cares whether someone's on the list or not, and it refuses to write the same name twice.

Control flow is just the recipe your program follows: "if the oven is hot, put in the cookies, otherwise wait" is an if-else, and "keep stirring until the batter is smooth" is a loop. Exception handling is your kitchen's smoke detector: instead of the whole house burning down when something goes wrong — like a recipe calling for an ingredient you don't have — Python's try-except lets you say "attempt this risky step, and if it fails in this specific way, calmly run the backup plan instead."

Functions are recipe cards you can write once and hand to a friend: "here's how to make lemonade," and from then on you just say "make lemonade" instead of rewriting the whole recipe every time. Some recipe cards let you bring along however many extra ingredients you want — that's what *args and **kwargs are for — and Python follows a very specific set of rules (called LEGB) to figure out which "lemonade" recipe you meant if there happen to be several with the same name nested inside each other.`,
          realWorldApplications: [
            {
              title: "Instagram's Django backend",
              description: "One of the largest production Python codebases in the world leans heavily on Python dictionaries (hash tables) to cache and look up objects like sessions and feed data in close to O(1) time, the same mechanism taught here as dict lookups."
            },
            {
              title: "Dropbox's original desktop sync client",
              description: "Built substantially in Python, it used try/except exception handling extensively so that a single failed file upload or download wouldn't crash the whole sync process, only that one operation."
            },
            {
              title: "Reddit's comment-rendering pipeline",
              description: "Reddit's backend was originally written in Python and relies on list and dict comprehensions to transform raw comment data into nested comment trees quickly and readably."
            },
            {
              title: "The `argparse`, `json`, and `csv` standard-library modules",
              description: "These ship with every Python install and are the exact tools this topic's capstone log-analyzer uses — the same modules real engineers reach for to parse CLI arguments and structured log data without adding external dependencies."
            }
          ],
          primaryLecture: VERIFIED_VIDEOS['p2-m8-t1'] as any,
          primaryText: {
            id: 'book-python-tutorial',
            title: 'The Official Python 3 Documentation & Tutorial',
            authors: ['Guido van Rossum', 'Python Software Foundation'],
            url: 'https://docs.python.org/3/tutorial/',
        pdfUrl: 'https://greenteapress.com/thinkpython2/thinkpython2.pdf',
            recommendedChapter: 'Chapter 3: An Informal Introduction & Chapter 4: More Control Flow Tools',
            publisherOrInstitution: 'Python Software Foundation',
            accessStatus: 'verified'
          },
          recommendedChapter: 'Chapter 5: Data Structures',
          authoritativeResearchSource: {
            id: 'paper-vanrossum-1991',
            title: 'Python Reference Manual',
            authors: ['Guido van Rossum'],
            year: 1991,
            venue: 'CWI Report CS-R9525',
            openAccessUrl: 'https://raw.githubusercontent.com/sarabander/sicp-pdf/master/sicp.pdf',
            paperType: 'historical',
            difficulty: 'beginner',
            prerequisites: ['Basic programming concepts'],
            summary: 'The original technical specification of Python emphasizing explicit readability, clean syntax indentation, and multi-paradigm flexibility.',
            whyItMatters: 'Defined the core Zen of Python design principles that made Python the premier language for ML, AI, and Data Science.',
            sectionsToRead: 'Execution Model & Data Model Overview',
            readingQuestions: [
              'What does "explicit is better than implicit" mean in Python design?',
              'How does Python manage object references and mutability?'
            ],
            relatedTopicIds: ['p2-m8-t1'],
            accessStatus: 'verified'
          },
          practicalExercises: [
            {
              id: 'ex-p2-1',
              question: 'What is the output of `[x**2 for x in range(5) if x % 2 == 0]` in Python?',
              options: ['[0, 4, 16]', '[1, 9]', '[0, 1, 4, 9, 16]', '[4, 16]'],
              correctAnswer: 0,
              explanation: 'range(5) gives 0, 1, 2, 3, 4. Even numbers are 0, 2, 4. Their squares are 0, 4, 16.',
              type: 'multiple-choice'
            },
            {
              id: 'ex-p2-4',
              question: 'What will `def f(x, items=[]): items.append(x); return items` produce if you call `f(1)` and then `f(2)` with no second argument each time?',
              options: ['[1] then [2]', '[1] then [1, 2]', 'TypeError on second call', '[2] then [1, 2]'],
              correctAnswer: 1,
              explanation: 'Default mutable arguments are evaluated once when the function is defined, not on every call. The same list object persists across calls, so it accumulates: `f(1)` returns [1], and `f(2)` appends to the same list, returning [1, 2]. This is a classic Python pitfall — mutable defaults should be avoided in favor of `items=None` with a check inside the function.',
              type: 'multiple-choice'
            },
            {
              id: 'ex-p2-5',
              question: 'Explain the LEGB rule and give an example of a bug it helps you diagnose.',
              explanation: 'LEGB stands for Local, Enclosing, Global, Built-in — the order in which Python searches scopes to resolve a name. Python first checks the current function\'s local scope, then any enclosing function scopes (for nested functions/closures), then the module\'s global scope, and finally Python\'s built-in namespace. A common bug this explains: referencing a variable inside a function before it is locally assigned raises `UnboundLocalError` even if a global of the same name exists, because Python decides at compile time that the name is local (since it is assigned somewhere in the function body) and therefore does not fall back to the global scope.',
              type: 'free-response'
            },
            {
              id: 'ex-p2-6',
              question: 'Write a Python function `safe_divide(a: float, b: float) -> float | None` that returns the division result, or None and prints a warning if dividing by zero, using try-except.',
              explanation: 'A correct solution: `def safe_divide(a: float, b: float) -> float | None:\\n    try:\\n        return a / b\\n    except ZeroDivisionError:\\n        print("Warning: division by zero")\\n        return None`. This demonstrates catching a specific exception type (rather than a bare `except:`), which avoids accidentally swallowing unrelated bugs like `TypeError` from bad input types.',
              type: 'code-snippet'
            },
            {
              id: 'ex-p2-7',
              question: 'Which of the following is true about Python sets?',
              options: [
                'Sets preserve insertion order and allow duplicate elements',
                'Sets are unordered collections of unique, hashable elements with average O(1) membership testing',
                'Sets can contain mutable elements like lists',
                'Sets support indexing with `set[0]`'
              ],
              correctAnswer: 1,
              explanation: 'A `set` in Python is an unordered collection of unique elements, implemented with a hash table internally, so membership testing (`x in my_set`) is O(1) on average, much faster than the O(n) scan required for a list. Sets can only contain hashable (effectively immutable) elements, so lists cannot be added to a set, and sets do not support positional indexing since they have no defined order.',
              type: 'multiple-choice'
            }
          ],
          interactiveLab: {
            id: 'lab-p2-1',
            title: 'Word Frequency Analyzer in Python',
            type: 'python',
            instructions: 'Write a Python function `word_frequencies(text)` that takes a string paragraph, normalizes punctuation and case, and returns a dict mapping words to count.',
            starterCode: `import re

def word_frequencies(text: str) -> dict[str, int]:
    # Remove punctuation and convert to lowercase
    cleaned = re.sub(r'[^\w\s]', '', text.lower())
    words = cleaned.split()
    
    freq = {}
    for w in words:
        freq[w] = freq.get(w, 0) + 1
    return freq

# Test text
sample = "ComputerSciFy is rigorous. ComputerSciFy makes computing first principles!"
print(word_frequencies(sample))
`,
            testCases: [
              {
                expectedOutput: "{'computerscify': 2, 'is': 1, 'rigorous': 1, 'makes': 1, 'computing': 1, 'first': 1, 'principles': 1}",
                description: 'Validates case normalization and dictionary aggregation.'
              }
            ]
          },
          readingQuestions: [
            'Why are dictionary key lookups in Python O(1) average time complexity?',
            'What is the difference between shallow copy and deep copy in Python lists?',
            'Why does Python raise `UnboundLocalError` if you assign to a variable inside a function without first declaring it `global`, even when a same-named global variable exists?',
            'How do `*args` and `**kwargs` differ, and when would you use each when designing a function signature?',
            'Why is it considered bad practice to use a bare `except:` clause, and what should you use instead?',
            'How does Python\'s garbage collector know when it is safe to free the memory used by an object?'
          ],
          masteryChecklist: [
            'Use dict comprehensions and list slicing fluently.',
            'Write clean type hints for Python functions.',
            'Handle exceptions with try-except blocks without using bare `except:`.'
          ],
          capstoneMilestone: 'Milestone 1: Streaming log file parser implementation.',
          estimatedStudyMinutes: 200,
          difficulty: 'beginner',
          glossary: [
            { term: 'List Comprehension', definition: 'A concise syntax in Python for constructing a new list by applying an expression to each item in an iterable, of the form `[expression for item in iterable if condition]`.' },
            { term: 'Hash Table', definition: 'The underlying data structure powering Python dictionaries and sets, mapping keys to array slots via a hash function to enable O(1) average-case lookup, insertion, and deletion.' },
            { term: 'Mutability', definition: 'A property describing whether an object\'s internal state can be changed after creation; lists, dicts, and sets are mutable, while ints, floats, strings, and tuples are immutable.' },
            { term: 'Type Hint', definition: 'Optional syntax (e.g. `x: int`, `-> str`) that annotates expected variable and return types for documentation and static analysis tools like mypy, without enforcing types at runtime.' },
            { term: 'LEGB Rule', definition: 'The order Python uses to resolve a variable name: Local scope, then Enclosing function scope, then Global (module) scope, then Built-in scope.' },
            { term: '*args / **kwargs', definition: 'Special function parameters that collect an arbitrary number of extra positional arguments into a tuple (`*args`) or extra keyword arguments into a dictionary (`**kwargs`).' },
            { term: 'Exception', definition: 'An object raised to signal that an error or unusual condition occurred during program execution, which can be caught and handled with try-except blocks instead of crashing the program.' },
            { term: 'Shallow Copy', definition: 'A copy of a container object where the container itself is duplicated but nested mutable objects inside it still reference the same underlying objects as the original.' },
            { term: 'Standard Library', definition: 'The collection of modules (such as `re`, `json`, `csv`, `argparse`) that ship with Python itself, requiring no external installation.' },
            { term: 'PEP 8', definition: 'The official Python style guide specifying naming conventions, indentation, and formatting recommendations for writing readable, consistent Python code.' }
          ],
          commonMisconceptions: [
            'Misconception: Modifying a list parameter inside a function does not affect the caller. Reality: Python passes object references; mutating mutable parameters affects caller objects.',
            'Misconception: Python variables have a fixed type once assigned, like in statically typed languages. Reality: Python variables are just names bound to objects; the same name can be rebound to an object of a completely different type at any time.',
            'Misconception: A default mutable argument like `def f(x, cache=[])` creates a fresh empty list on every call. Reality: default argument values are evaluated exactly once at function definition time, so a mutable default persists and accumulates state across calls unless explicitly reset.',
            'Misconception: `except:` with no exception type is just a shorter, equivalent way to write `except Exception:`. Reality: a bare `except:` also catches `SystemExit` and `KeyboardInterrupt`, which can prevent a program from being cleanly terminated with Ctrl+C.',
            'Misconception: Tuples are just "immutable lists" and therefore always faster and safer to use. Reality: tuples are immutable and hashable (so usable as dict keys), but a tuple containing a mutable element like a list is itself unhashable and can still have that inner element changed.'
          ],
          connectionsToLaterModules: [
            'Prerequisite for Object-Oriented Python in Module 9',
            'Foundation for NumPy and pandas data processing in Module 10'
          ],
          citation: { text: 'van Rossum, G. (1991). The Python Language Reference Manual. CWI.' },
          accessStatus: 'verified'
        }
      }
    ]
  },
  {
    id: 'p2-m10',
    phaseId: 2,
    title: 'NumPy and pandas for Data Science',
    slug: 'numpy-pandas-data-science',
    category: 'ds',
    summary: 'Master multi-dimensional array vectorization with NumPy and tabular data manipulation, joins, aggregations, and cleaning with pandas.',
    objective: 'Eliminate slow Python loops by leveraging NumPy contiguous C-array vectorization and pandas DataFrame indexing, grouping, and transformations.',
    prerequisiteModuleIds: ['p2-m8', 'p1-m4'],
    estimatedHours: 24,
    difficulty: 'intermediate',
    colorAccent: 'softblue',
    capstone: {
      id: 'capstone-p2-m10',
      title: 'Exploratory Data Analysis & Feature Transformation Engine',
      description: 'Build a complete data cleaning, feature engineering, and statistical aggregation pipeline using NumPy and pandas on a real multi-column dataset.',
      constraints: ['Must use vectorized operations without Python for-loops.'],
      expectedDeliverables: ['Missing data imputation module.', 'Vectorized Z-score outlier detector.', 'Groupby aggregation and pivot table output.'],
      evaluationRubric: [
        { criterion: 'Vectorization Discipline', weight: '50%', description: 'Zero explicit Python loops for data transformations.' },
        { criterion: 'Data Pipeline Robustness', weight: '50%', description: 'Handles missing values and outliers cleanly.' }
      ]
    },
    topics: [
      {
        id: 'p2-m10-t1',
        moduleId: 'p2-m10',
        title: 'NumPy Array Vectorization & Broadcasting',
        slug: 'numpy-vectorization-broadcasting',
        summary: 'Understand memory layouts, Strides, Universal Functions (ufuncs), Slicing, and Broadcasting rules.',
        order: 1,
        masteryPack: {
          learningObjective: 'Construct 1D, 2D, and N-dimensional ndarrays, apply broadcasting rules, and perform fast linear algebra computations.',
          prerequisites: ['Python Fundamentals', 'Linear Algebra basics'],
          coreConcepts: [
            'The ndarray Memory Structure: Contiguous Memory Buffers and Dtypes: a NumPy array stores its elements in one contiguous block of memory, all sharing a single fixed data type (dtype) such as `int64` or `float32`, unlike a Python list of objects scattered across the heap; this uniform, packed layout is what makes bulk numerical operations fast and cache-friendly.',
            'Vectorization vs Python For-Loops (C-speed Execution): vectorization means expressing an operation as a single call that applies to an entire array at once (e.g. `a + b`) rather than looping element-by-element in Python; the loop is pushed down into pre-compiled C code inside NumPy, eliminating the per-iteration overhead of the Python interpreter and often yielding order-of-magnitude speedups.',
            'Broadcasting Rules across Dimensions: broadcasting lets NumPy perform arithmetic between arrays of different but compatible shapes by conceptually "stretching" the smaller array along dimensions of size 1, without actually copying data — understanding its two rules (align shapes from the right, and dimensions match if equal or one of them is 1) is essential for combining arrays without writing manual loops.',
            'Array Slicing, Fancy Indexing, and Boolean Masking: basic slicing (`a[1:3]`) returns a view into the same memory, fancy indexing (`a[[0, 2, 4]]`) selects arbitrary elements by an array of indices and returns a copy, and boolean masking (`a[a > 5]`) filters elements using a condition array — these three techniques together cover nearly every way you select subsets of data in NumPy and pandas.',
            'Matrix Operations: Dot Products, Transposes, and Aggregations: the dot product (`np.dot` or `@`) computes matrix multiplication central to linear algebra and machine learning, the transpose (`.T`) flips an array\'s axes without copying data, and aggregation functions (`sum`, `mean`, `max`) can be applied along a specific `axis` to collapse rows or columns independently.',
            'The `axis` Parameter and Reduction Operations: many NumPy functions accept an `axis` argument that controls which dimension is collapsed during a reduction — `axis=0` reduces down the rows (producing a per-column result) and `axis=1` reduces across the columns (producing a per-row result), a distinction that is a frequent source of bugs for beginners.'
          ],
          simpleExplanation: `Picture two ways of making 1,000 paper airplanes. In the first way, you make one airplane completely — fold, fold, throw — then start the next one from scratch, one at a time. That's what a plain Python loop does: it handles one number fully before moving to the next, with a little bit of overhead every single time. The second way is an assembly line: one person does all 1,000 first folds in a row, then all 1,000 second folds, then all 1,000 throws. That's vectorization — NumPy hands the whole batch of numbers to fast, pre-compiled code that processes all of them in one sweep, instead of asking the slower Python interpreter to handle each number individually.

This works so well partly because of how NumPy stores its numbers. A Python list is like a junk drawer — it holds pointers to things scattered all over the house, and each thing could be a different size or type. A NumPy array is more like a carton of eggs: every slot is the exact same size, they're all lined up right next to each other, and the "picker" (the CPU) doesn't have to run around checking what's in each slot — it just slides down the carton grabbing eggs at a steady rhythm. That uniform, packed layout is what "dtype" and "contiguous memory" mean in practice.

Broadcasting is what lets you combine a small array with a big one without writing a loop yourself. Imagine a giant spreadsheet of prices for 100 products across 12 months, and you want to add one "shipping fee" to every single cell. Instead of physically copy-pasting the fee into all 1,200 cells, broadcasting is like telling the spreadsheet "just act as if that one fee were repeated everywhere" — the small array is conceptually stretched to match the big one's shape, but no extra memory is actually spent storing all those copies.

Slicing and the "axis" parameter are about which numbers you're looking at, and which direction you're squashing them. Basic slicing is like looking through a window: it shows a live view of the same underlying data, so if that view changes, the original changes too. A boolean mask is more like circling only the spreadsheet rows where a condition is true (say, "price over $50") and pulling just those out as a brand-new, separate copy. And "axis" simply answers "am I summing down each column, or across each row?" — axis=0 walks down the rows to give one number per column, and axis=1 walks across the columns to give one number per row.`,
          realWorldApplications: [
            {
              title: 'PyTorch and TensorFlow tensor operations',
              description: "Both deep-learning libraries model their core tensor type on NumPy's ndarray and reuse its exact broadcasting rules, so an operation like adding a bias vector to a batch of neural-network activations works the same way as broadcasting a small NumPy array onto a large one."
            },
            {
              title: "pandas DataFrames",
              description: 'Every column in a pandas DataFrame is stored internally as a NumPy array, which is why operations like adding a discount column across millions of rows run at vectorized C speed instead of looping in Python.'
            },
            {
              title: "scikit-learn's numerical routines",
              description: 'Widely used machine learning algorithms in scikit-learn (like computing distances or gradients) are implemented as vectorized NumPy operations under the hood rather than explicit Python loops, which is a large part of why they scale to large datasets.'
            },
            {
              title: 'Scientific imaging pipelines, such as those used to process the first black hole image (Event Horizon Telescope)',
              description: "Projects like this rely on Python's scientific computing stack, built on NumPy arrays, to process and combine enormous grids of telescope data through vectorized numerical operations rather than element-by-element loops."
            }
          ],
          primaryLecture: VERIFIED_VIDEOS['p2-m10-t1'] as any,
          primaryText: {
            id: 'book-numpy-guide',
            title: 'Guide to NumPy',
            authors: ['Travis E. Oliphant'],
            url: 'https://numpy.org/doc/stable/',
        pdfUrl: 'https://arxiv.org/pdf/2006.10256.pdf',
            recommendedChapter: 'Array Objects & Vectorized Operations',
            publisherOrInstitution: 'NumPy Developers Open Book',
            accessStatus: 'verified'
          },
          recommendedChapter: 'Broadcasting and Array Mechanics',
          authoritativeResearchSource: {
            id: 'paper-harris-2020',
            title: 'Array programming with NumPy',
            authors: ['Charles R. Harris', 'K. Jarrod Millman', 'Stéfan J. van der Walt et al.'],
            year: 2020,
            venue: 'Nature',
            doiOrArxiv: '10.1038/s41586-020-2649-2',
            openAccessUrl: 'https://arxiv.org/pdf/1907.10121.pdf',
            paperType: 'seminal',
            difficulty: 'intermediate',
            prerequisites: ['Array operations'],
            summary: 'The landmark Nature paper presenting NumPy as the universal array standard underpinning the entire modern Python scientific ecosystem (PyTorch, TensorFlow, SciPy, pandas).',
            whyItMatters: 'Explains how NumPy array protocols bridge high-level Python code with hardware SIMD vector units.',
            sectionsToRead: 'Sections: Array Structure & Ecosystem Integrations',
            readingQuestions: [
              'How does contiguous memory buffer layout enable SIMD hardware acceleration in NumPy?',
              'What are the 3 rules of NumPy broadcasting?'
            ],
            relatedTopicIds: ['p2-m10-t1', 'p5-m16-t1'],
            accessStatus: 'verified'
          },
          practicalExercises: [
            {
              id: 'ex-p2-2',
              question: 'When broadcasting an array of shape (3, 1) with an array of shape (1, 4), what is the resulting shape?',
              options: ['(3, 4)', '(1, 1)', 'Incompatible shapes', '(3, 3)'],
              correctAnswer: 0,
              explanation: 'Dimensions are stretched along singletons: 3 stretches to 3, 1 stretches to 4 -> resulting in (3, 4).',
              type: 'multiple-choice'
            },
            {
              id: 'ex-p2-8',
              question: 'Given `a = np.array([[1, 2, 3], [4, 5, 6]])`, what does `a.sum(axis=0)` return?',
              options: ['array([6, 15])', 'array([5, 7, 9])', '21', 'array([1, 2, 3, 4, 5, 6])'],
              correctAnswer: 1,
              explanation: 'axis=0 collapses along the rows (down each column), summing column-wise: column 0 is 1+4=5, column 1 is 2+5=7, column 2 is 3+6=9, giving array([5, 7, 9]). axis=1 would instead sum each row, giving array([6, 15]).',
              type: 'multiple-choice'
            },
            {
              id: 'ex-p2-9',
              question: 'Explain why `b = a[2:5]` and `c = a[2:5].copy()` behave differently when you later modify `b[0]` versus `c[0]`, in terms of memory.',
              explanation: 'Basic slicing in NumPy (`a[2:5]`) returns a view — a new array object that shares the same underlying data buffer as `a`, just with different strides/offset metadata. Modifying `b[0]` therefore also changes the corresponding element in `a`. Calling `.copy()` explicitly allocates a new, independent memory buffer and copies the values into it, so modifying `c[0]` leaves `a` untouched. This distinction matters for avoiding subtle bugs where an "independent" array turns out to alias the original.',
              type: 'free-response'
            },
            {
              id: 'ex-p2-10',
              question: 'Write a NumPy expression (no explicit Python for-loop) that computes the element-wise squared difference between two 1D arrays `x` and `y` of the same length, then returns their mean (i.e., the Mean Squared Error).',
              explanation: 'A correct vectorized solution: `mse = np.mean((x - y) ** 2)`. This subtracts the arrays element-wise, squares each difference, and averages the result — all performed as compiled C loops under the hood rather than an explicit Python `for` loop, which is the vectorization pattern used throughout scientific computing and machine learning loss functions.',
              type: 'code-snippet'
            },
            {
              id: 'ex-p2-11',
              question: 'Why can a NumPy array only hold elements of a single dtype, unlike a Python list?',
              explanation: 'A NumPy array stores its elements in one contiguous block of raw memory where every element occupies the same fixed number of bytes determined by its dtype (e.g., 8 bytes for int64). This uniformity is what allows NumPy to compute element addresses with simple pointer arithmetic and process the whole buffer with tight, vectorized C loops. A Python list, by contrast, stores pointers to heterogeneous Python objects scattered in memory, which is flexible but far slower for numeric computation because each element requires a pointer dereference and type check.',
              type: 'free-response'
            }
          ],
          interactiveLab: {
            id: 'lab-p2-2',
            title: 'Vectorized Euclidean Distance Matrix',
            type: 'python',
            instructions: 'Write a vectorized Python script calculating pairwise Euclidean distances between N points without explicit loops.',
            starterCode: `import math

# Simulating array vectorized distance logic in pure Python math lists
def pairwise_distances(points):
    # points is list of (x, y)
    N = len(points)
    dist_matrix = []
    for i in range(N):
        row = []
        for j in range(N):
            dx = points[i][0] - points[j][0]
            dy = points[i][1] - points[j][1]
            row.append(round(math.sqrt(dx*dx + dy*dy), 2))
        dist_matrix.append(row)
    return dist_matrix

pts = [(0, 0), (3, 4), (1, 1)]
print("Distance Matrix:", pairwise_distances(pts))
`,
            testCases: [
              {
                expectedOutput: 'Distance Matrix: [[0.0, 5.0, 1.41], [5.0, 0.0, 3.61], [1.41, 3.61, 0.0]]',
                description: 'Validates Euclidean distance matrix calculations.'
              }
            ]
          },
          readingQuestions: [
            'Why is a NumPy array operation up to 100x faster than an equivalent Python list loop?',
            'What happens in memory when you create a slice view `b = a[2:5]` versus a copy `b = a[2:5].copy()`?',
            'What are the two rules NumPy uses to decide whether two array shapes are compatible for broadcasting?',
            'Why does fancy indexing (`a[[0, 2, 4]]`) always return a copy while basic slicing (`a[0:4]`) returns a view?',
            'How do SIMD (Single Instruction, Multiple Data) hardware instructions relate to why vectorized NumPy code runs faster than a Python loop?',
            'When would you choose `axis=0` versus `axis=1` in an aggregation, and how does that choice depend on whether your data is organized as rows-are-observations or columns-are-observations?'
          ],
          masteryChecklist: [
            'Apply broadcasting rules to arrays of differing dimensions.',
            'Use boolean masking to filter array rows efficiently.',
            'Compute array aggregations along specific axes (axis=0, axis=1).'
          ],
          capstoneMilestone: 'Milestone 1: Vectorized data preprocessing module.',
          estimatedStudyMinutes: 210,
          difficulty: 'intermediate',
          glossary: [
            { term: 'Broadcasting', definition: 'The mechanism that allows NumPy to perform arithmetic operations on arrays of different but compatible shapes by conceptually stretching dimensions of size 1, without copying data.' },
            { term: 'Vectorization', definition: 'Structuring calculations to operate on whole arrays simultaneously via pre-compiled, low-level loops rather than looping over individual elements in Python.' },
            { term: 'ndarray', definition: 'NumPy\'s core N-dimensional array object: a fixed-size, single-dtype, contiguous (or strided) block of memory with an associated shape describing its dimensions.' },
            { term: 'dtype', definition: 'The data type shared by every element of a NumPy array, such as `int32`, `float64`, or `bool`, which determines how many bytes each element occupies in memory.' },
            { term: 'View', definition: 'A NumPy array object that shares its underlying data buffer with another array (commonly produced by basic slicing), so modifying one affects the other.' },
            { term: 'Fancy Indexing', definition: 'Indexing a NumPy array with a list or array of integer indices (or a boolean mask) instead of a single index or slice, which always returns a new copy of the selected data.' },
            { term: 'Boolean Masking', definition: 'Filtering an array\'s elements using a same-shaped array of True/False values, typically produced by a comparison like `a > 5`, to select only the elements where the mask is True.' },
            { term: 'ufunc (Universal Function)', definition: 'A NumPy function, such as `np.add` or `np.sqrt`, that operates element-wise on arrays and supports broadcasting, implemented in compiled C for speed.' },
            { term: 'Stride', definition: 'The number of bytes to step in memory to move to the next element along a given axis of an array; strides let NumPy represent views like transposes and slices without copying data.' },
            { term: 'Axis', definition: 'A specific dimension of a multi-dimensional array (axis=0 is typically rows, axis=1 is typically columns) along which an operation like sum or mean can be applied.' }
          ],
          commonMisconceptions: [
            'Misconception: Slicing a NumPy array creates a new array in memory. Reality: Array slicing creates a memory view sharing the underlying buffer.',
            'Misconception: Broadcasting physically duplicates the smaller array\'s data in memory to match the larger array\'s shape. Reality: NumPy computes broadcasting results without materializing the expanded array in memory; it uses stride tricks to iterate as if the array were stretched.',
            'Misconception: NumPy arrays can freely mix types the way Python lists can, such as storing both integers and strings together with no performance cost. Reality: a NumPy array has one dtype for all elements; mixing types forces NumPy to fall back to a generic, slow `object` dtype that loses the vectorization speed advantage.',
            'Misconception: `a * b` for two NumPy arrays always performs matrix multiplication like in linear algebra. Reality: `*` performs element-wise multiplication; true matrix multiplication requires `np.dot(a, b)` or the `@` operator.',
            'Misconception: A vectorized NumPy operation is always faster no matter the array size. Reality: for very small arrays, the fixed overhead of calling into NumPy can make a plain Python loop comparably fast or even faster; vectorization\'s advantage grows with array size.'
          ],
          connectionsToLaterModules: [
            'Direct prerequisite for Machine Learning from scratch in Phase 5',
            'Foundation for PyTorch Tensors in Deep Learning Phase 6'
          ],
          citation: { text: 'Harris, C. R., et al. (2020). Array programming with NumPy. Nature, 585(7825), 357–362.' },
          accessStatus: 'verified'
        }
      }
    ]
  },
  {
    id: 'p2-m11',
    phaseId: 2,
    title: 'SQL and Database Fundamentals',
    slug: 'sql-database-fundamentals',
    category: 'ds',
    summary: 'Master Relational Algebra, SQL queries (SELECT, JOIN, GROUP BY, HAVING, Window Functions), and Relational Database Schema Normalization.',
    objective: 'Design normalized 3NF relational schemas, write complex multi-table SQL queries, optimize indexes, and understand ACID transaction properties.',
    prerequisiteModuleIds: ['p0-m1', 'p1-m3'],
    estimatedHours: 22,
    difficulty: 'intermediate',
    colorAccent: 'yellow',
    capstone: {
      id: 'capstone-p2-m11',
      title: 'Relational E-Commerce Analytics Database & SQL Query Engine',
      description: 'Design a 3NF relational database schema for an e-commerce platform and craft analytical queries using window functions and aggregations.',
      constraints: ['SQLite compiled Wasm / sql.js environment.'],
      expectedDeliverables: ['3NF DDL schema table definitions.', 'Window function analytical queries (Customer Lifetime Value, Rolling Averages).'],
      evaluationRubric: [
        { criterion: 'Schema Normalization', weight: '50%', description: 'Tables conform to 3rd Normal Form with proper primary/foreign keys.' },
        { criterion: 'Query Accuracy', weight: '50%', description: 'Analytical SQL queries return precise aggregation results.' }
      ]
    },
    topics: [
      {
        id: 'p2-m11-t1',
        moduleId: 'p2-m11',
        title: 'Relational Data Model, SQL Queries, and Window Functions',
        slug: 'relational-model-sql-window-functions',
        summary: 'Learn Relational Algebra, Inner/Outer Joins, Grouping, Subqueries, and Advanced Window Functions (OVER, PARTITION BY).',
        order: 1,
        masteryPack: {
          learningObjective: 'Write SQL queries using joins, aggregations, subqueries, and window functions to answer complex business and analytical questions.',
          prerequisites: ['Set theory fundamentals'],
          coreConcepts: [
            'The Relational Model: Tables, Tuples, Primary Keys, Foreign Keys: data is organized into tables (relations) made up of rows (tuples) and columns (attributes); a primary key uniquely identifies each row within a table, and a foreign key references a primary key in another table to model relationships, forming the structural backbone that lets a schema be normalized and queried consistently.',
            'SQL Data Query Language: SELECT, WHERE, GROUP BY, HAVING, ORDER BY: these clauses form the standard pipeline for retrieving and shaping data — SELECT chooses columns, WHERE filters individual rows before aggregation, GROUP BY collapses rows sharing a value into summary groups, HAVING filters those aggregated groups, and ORDER BY sorts the final result — and understanding their logical execution order is essential to writing correct analytical queries.',
            'Join Mechanics: INNER JOIN, LEFT OUTER JOIN, RIGHT JOIN, FULL JOIN: joins combine rows from two or more tables based on a related column; an INNER JOIN keeps only matching rows, a LEFT JOIN keeps all rows from the left table (filling unmatched right-side columns with NULL), a RIGHT JOIN does the mirror image, and a FULL JOIN keeps all rows from both sides regardless of match, which together let you reconstruct any relationship across normalized tables.',
            'Subqueries, Common Table Expressions (CTEs - WITH clause): a subquery is a query nested inside another query used to compute an intermediate result, and a CTE (defined with `WITH name AS (...)`) names that intermediate result so it can be referenced like a temporary table, making complex multi-step analytical queries far more readable and maintainable than deeply nested subqueries.',
            'Window Functions: ROW_NUMBER(), RANK(), DENSE_RANK(), SUM() OVER (PARTITION BY ... ORDER BY ...): unlike GROUP BY, which collapses rows, window functions compute a value across a "window" of related rows (defined by PARTITION BY) while still returning one row per input row, enabling calculations like running totals, per-category rankings, and moving averages that are central to real-world analytics.',
            'Schema Normalization and ACID Transactions: normalization (1NF, 2NF, 3NF) is the process of organizing tables to eliminate redundant data and update anomalies by ensuring each fact is stored in exactly one place, while ACID (Atomicity, Consistency, Isolation, Durability) properties guarantee that database transactions complete reliably even under concurrent access or system failure.'
          ],
          simpleExplanation: `Think of a relational database as a set of very disciplined spreadsheets, called tables. Each row is one "thing" — one customer, one order — and every row gets a primary key, which works like a fingerprint or a library card number: no two rows are allowed to share one, and it's how the database tells rows apart even if everything else looks identical. A foreign key is a sticky note on one row that says "for more details about this, go look at row #47 over in the other spreadsheet" — it's how two tables stay connected without copying each other's information. Keeping every fact stored in exactly one place like this is called normalization, and it's the difference between updating a customer's address in one spot versus having to hunt down and fix every repeated copy of it.

A JOIN is what happens when the information you need is split across two of these spreadsheets — say a "customers" sheet and an "orders" sheet — and you want to line them up by matching a shared column, like a customer ID that appears in both. An INNER JOIN only keeps the rows where both sides have a match, like the overlapping middle of a Venn diagram. A LEFT JOIN is more generous: it keeps every row from the first sheet no matter what, leaving blanks (NULLs) where the second sheet has nothing to offer — useful for something like "show me every customer, even the ones who've never ordered anything."

GROUP BY is like sorting a big pile of mail into labeled bins, one bin per zip code, and then, instead of handing you every letter, just telling you how many letters ended up in each bin. WHERE decides which letters even make it into the sorting room in the first place, filtering individual rows before any bin exists, while HAVING looks at the finished bins afterward and throws out any bin that doesn't meet some condition, like "only show me zip codes with more than 10 letters."

A window function is a different trick: instead of collapsing rows into bins like GROUP BY does, it hands every letter back to its sender, but first stamps each one with extra context — "you're letter #3 of 12 from this zip code" or "here's the running total from your zip code so far." Nothing gets merged away; every original row survives, just with a computed value attached. And underneath all of this, the database makes a promise called ACID: a change either fully happens or doesn't happen at all, even if the power goes out midway through — like a bank transfer where money is never left half-deducted from one account without appearing in the other.`,
          realWorldApplications: [
            {
              title: "Stripe's payment ledger",
              description: 'Payment processors rely on ACID transactional guarantees so that charging a customer and recording the corresponding ledger entry either both succeed together or both fail together, never leaving the books half-updated.'
            },
            {
              title: "Amazon's order history page",
              description: 'Showing "all customers, including ones who have never ordered" is the textbook use case for a LEFT JOIN between a customers table and an orders table, keeping every customer row even when there is no matching order.'
            },
            {
              title: "Spotify Wrapped-style listening analytics",
              description: "Ranking each listener's top artists or tracks without collapsing their individual play events is the kind of calculation window functions like RANK() OVER (PARTITION BY user_id) are built for, in analytics pipelines built on SQL-like query engines."
            },
            {
              title: "GitHub's repository/issue database schema",
              description: 'Repositories, issues, and pull requests are linked through foreign keys (an issue belongs to exactly one repository), a textbook example of the normalized, join-based relational design this topic teaches.'
            }
          ],
          primaryLecture: VERIFIED_VIDEOS['p2-m11-t1'] as any,
          primaryText: {
            id: 'book-database-concepts',
            title: 'Database System Concepts (Free Educational Materials)',
            authors: ['Abraham Silberschatz', 'Henry F. Korth', 'S. Sudarshan'],
            url: 'https://www.db-book.com/',
        pdfUrl: 'https://www.engineering.upenn.edu/~zives/03f/cis550/codd.pdf',
            recommendedChapter: 'Chapter 3: Introduction to SQL & Chapter 4: Intermediate SQL',
            publisherOrInstitution: 'McGraw-Hill / Yale & IIT Bombay Open Slides',
            accessStatus: 'verified'
          },
          recommendedChapter: 'Chapter 3: SQL Fundamentals',
          authoritativeResearchSource: {
            id: 'paper-codd-1970',
            title: 'A Relational Model of Data for Large Shared Data Banks',
            authors: ['E. F. Codd'],
            year: 1970,
            venue: 'Communications of the ACM',
            doiOrArxiv: '10.1145/362384.362685',
            openAccessUrl: 'https://www.seas.upenn.edu/~zives/03f/cis550/codd.pdf',
            paperType: 'seminal',
            difficulty: 'intermediate',
            prerequisites: ['First-order predicate logic and sets'],
            summary: 'The Turing-Award-winning paper that created the relational database industry, introducing mathematical relational tuples, predicate normalization, and relational algebra.',
            whyItMatters: 'Transformed data management from messy hierarchical graphs into mathematically sound relational database systems.',
            sectionsToRead: 'Sections 1–2: Relational Model and Normalization',
            readingQuestions: [
              'What advantages does Codd’s relational model offer over hierarchical data representations?',
              'How does relational algebra ensure mathematical independence between physical storage and query logic?'
            ],
            relatedTopicIds: ['p2-m11-t1', 'p4-m15-t1'],
            accessStatus: 'verified'
          },
          practicalExercises: [
            {
              id: 'ex-p2-3',
              question: 'Which SQL keyword is used to filter aggregated rows AFTER a GROUP BY clause?',
              options: ['HAVING', 'WHERE', 'ORDER BY', 'OVER'],
              correctAnswer: 0,
              explanation: 'WHERE filters individual rows before grouping; HAVING filters aggregated groups after grouping.',
              type: 'multiple-choice'
            },
            {
              id: 'ex-p2-12',
              question: 'Given a `customers` table and an `orders` table, what is the difference between `INNER JOIN` and `LEFT JOIN` when some customers have placed no orders?',
              explanation: 'An INNER JOIN only returns customers that have at least one matching row in orders, so customers with zero orders are excluded entirely from the result. A LEFT JOIN returns every row from customers regardless of whether a match exists in orders; for customers with no orders, the order-related columns are filled with NULL. LEFT JOIN is the right choice whenever you need to report on "all customers, including those with no activity."',
              type: 'free-response'
            },
            {
              id: 'ex-p2-13',
              question: 'Write a SQL query using a window function to compute, for each row in a `sales(id, region, amount, sale_date)` table, a running total of `amount` within each `region` ordered by `sale_date`.',
              explanation: 'A correct query: `SELECT id, region, amount, sale_date, SUM(amount) OVER (PARTITION BY region ORDER BY sale_date) AS running_total FROM sales;`. PARTITION BY region resets the running total for each region independently, and ORDER BY sale_date within the OVER clause makes SUM() accumulate progressively row by row rather than summing the whole partition at once.',
              type: 'code-snippet'
            },
            {
              id: 'ex-p2-14',
              question: 'What is the key difference between RANK() and DENSE_RANK() when two rows tie for the same rank?',
              options: [
                'They behave identically in all cases',
                'RANK() leaves a gap in the ranking sequence after a tie; DENSE_RANK() does not',
                'DENSE_RANK() can only be used with PARTITION BY',
                'RANK() requires an ORDER BY clause but DENSE_RANK() does not'
              ],
              correctAnswer: 1,
              explanation: 'If two rows tie for rank 2, RANK() assigns both rows rank 2 and then skips to rank 4 for the next row (leaving a gap), while DENSE_RANK() assigns both rows rank 2 and continues with rank 3 for the next row with no gap. Both require an ORDER BY inside the OVER() clause to define the ranking order.',
              type: 'multiple-choice'
            },
            {
              id: 'ex-p2-15',
              question: 'Why does designing a table in Third Normal Form (3NF) reduce the risk of data inconsistency compared to a single denormalized table?',
              explanation: 'In 3NF, every non-key attribute depends on the primary key, the whole key, and nothing but the key — meaning each fact is stored in exactly one place. A denormalized table that repeats, say, a customer\'s address on every order row risks update anomalies: if the address changes, every repeated row must be updated consistently, and missing even one creates contradictory data. Normalizing into separate customers and orders tables, linked by a foreign key, means the address is stored once and referenced everywhere, eliminating that class of inconsistency at the cost of requiring joins to reassemble the data.',
              type: 'free-response'
            }
          ],
          interactiveLab: {
            id: 'lab-p2-3',
            title: 'SQL Window Function & CTE Query Lab',
            type: 'sql',
            instructions: 'Write a SQL query using a Window Function `RANK() OVER (PARTITION BY category ORDER BY price DESC)` to find top priced products per category.',
            starterCode: `-- Sample SQL Table Setup and Query Simulation
CREATE TABLE products (
    id INT,
    name TEXT,
    category TEXT,
    price DECIMAL
);

INSERT INTO products VALUES 
(1, 'Laptop', 'Tech', 1200),
(2, 'Phone', 'Tech', 800),
(3, 'Desk', 'Furniture', 350),
(4, 'Chair', 'Furniture', 150);

-- Querying Ranked Products
SELECT 
    name, 
    category, 
    price,
    RANK() OVER (PARTITION BY category ORDER BY price DESC) as rnk
FROM products;
`,
            testCases: [
              {
                expectedOutput: 'Laptop | Tech | 1200 | 1',
                description: 'Validates SQL window function ranking execution.'
              }
            ]
          },
          readingQuestions: [
            'What is the difference between RANK() and DENSE_RANK() in SQL window functions?',
            'How do foreign keys enforce referential integrity across relational tables?',
            'Why does SQL evaluate WHERE before GROUP BY, but HAVING after GROUP BY — and what does that ordering prevent you from doing in a WHERE clause?',
            'How does a Common Table Expression (CTE) improve query readability compared to deeply nested subqueries, without changing what the query computes?',
            'What distinguishes a window function from a GROUP BY aggregation in terms of how many rows the query returns?',
            'Why can a table satisfy Second Normal Form (2NF) but still violate Third Normal Form (3NF)?'
          ],
          masteryChecklist: [
            'Write queries combining multiple JOIN statements.',
            'Utilize Common Table Expressions (CTEs) for readable modular SQL.',
            'Compute running totals using SQL OVER (ORDER BY ...) clauses.'
          ],
          capstoneMilestone: 'Milestone 1: E-commerce SQL schema & analytics query benchmark.',
          estimatedStudyMinutes: 210,
          difficulty: 'intermediate',
          glossary: [
            { term: '3NF (Third Normal Form)', definition: 'A database schema standard where all non-key attributes are dependent solely on the primary key, eliminating redundancy and transitive dependencies.' },
            { term: 'ACID', definition: 'Atomicity, Consistency, Isolation, Durability — the required guarantees for reliable database transactions, ensuring they complete fully or not at all, leave the database valid, run as if isolated from other transactions, and survive crashes once committed.' },
            { term: 'Primary Key', definition: 'A column or set of columns whose value uniquely identifies each row in a table; no two rows may share the same primary key value, and it cannot be NULL.' },
            { term: 'Foreign Key', definition: 'A column in one table that references the primary key of another table, used to enforce referential integrity so that relationships between tables remain valid.' },
            { term: 'JOIN', definition: 'A SQL operation that combines rows from two or more tables based on a related column, such as a foreign key matching a primary key.' },
            { term: 'Common Table Expression (CTE)', definition: 'A named temporary result set defined with a `WITH` clause that can be referenced within the main query, improving readability for multi-step queries.' },
            { term: 'Window Function', definition: 'A SQL function that performs a calculation across a set of rows related to the current row (defined via PARTITION BY and ORDER BY inside an OVER() clause) while still returning one output row per input row.' },
            { term: 'GROUP BY', definition: 'A SQL clause that collapses rows sharing the same value(s) in specified columns into a single summary row per group, typically used alongside aggregate functions like SUM() or COUNT().' },
            { term: 'NULL', definition: 'A special marker in SQL representing missing or unknown data; comparisons involving NULL follow three-valued logic and evaluate to UNKNOWN rather than TRUE or FALSE.' },
            { term: 'Relational Algebra', definition: 'The formal mathematical foundation of the relational model, defining operations like selection, projection, and join that SQL queries are ultimately translated into and optimized against.' }
          ],
          commonMisconceptions: [
            'Misconception: NULL in SQL is equal to empty string or zero. Reality: NULL represents missing/unknown state and behaves according to three-valued logic (TRUE, FALSE, UNKNOWN), so `NULL = NULL` evaluates to UNKNOWN, not TRUE.',
            'Misconception: WHERE and HAVING are interchangeable and can be used in either order. Reality: WHERE filters individual rows before any grouping happens and cannot reference aggregate functions like SUM(); HAVING filters after GROUP BY has produced aggregated groups and is the only clause that can filter on aggregate results.',
            'Misconception: A LEFT JOIN and an INNER JOIN return the same rows as long as there happens to be a match for every row. Reality: they only produce identical results when every row on the left side has at least one match on the right; as soon as any left-side row lacks a match, a LEFT JOIN still includes it (with NULLs) while an INNER JOIN drops it — so the choice affects correctness, not just style.',
            'Misconception: Normalizing a database into more tables always improves performance. Reality: normalization primarily improves data integrity and reduces redundancy; heavily normalized schemas can require more joins for reads, which is why analytical (OLAP) systems sometimes intentionally denormalize for query speed.',
            'Misconception: A window function with PARTITION BY behaves just like GROUP BY. Reality: GROUP BY collapses each group into a single output row, while a window function retains one output row per original input row, simply attaching a computed value (like a rank or running total) to each row.'
          ],
          connectionsToLaterModules: [
            'Prerequisite for Data Warehouses and Analytics Engineering in Phase 4',
            'Foundation for Backend Database ORMs in Phase 7'
          ],
          citation: { text: 'Codd, E. F. (1970). A Relational Model of Data for Large Shared Data Banks. Communications of the ACM, 13(6), 377–387.' },
          accessStatus: 'verified'
        }
      }
    ]
  }
];
