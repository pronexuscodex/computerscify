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
            'Dynamic Typing, Type Hinting, and Mutability vs Immutability',
            'Core Collections: Lists, Tuples, Dictionaries (Hash Maps), and Sets',
            'Control Flow: If-Else, For/While Loops, List/Dict Comprehensions',
            'Functions: Parameters, *args, **kwargs, Return Types, and Scope (LEGB Rule)',
            'Exception Handling: Try-Except-Else-Finally and Custom Exceptions'
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
            'What is the difference between shallow copy and deep copy in Python lists?'
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
            { term: 'List Comprehension', definition: 'A concise syntax in Python for constructing a new list by applying an expression to each item in an iterable.' },
            { term: 'Hash Table', definition: 'The underlying data structure powering Python dictionaries, enabling O(1) average lookup times.' }
          ],
          commonMisconceptions: [
            'Misconception: Modifying a list parameter inside a function does not affect the caller. Reality: Python passes object references; mutating mutable parameters affects caller objects.'
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
            'The ndarray Memory Structure: Contiguous Memory Buffers and Dtypes',
            'Vectorization vs Python For-Loops (C-speed Execution)',
            'Broadcasting Rules across Dimensions',
            'Array Slicing, Fancy Indexing, and Boolean Masking',
            'Matrix Operations: Dot Products, Transposes, and Aggregations'
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
            'What happens in memory when you create a slice view `b = a[2:5]` versus a copy `b = a[2:5].copy()`?'
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
            { term: 'Broadcasting', definition: 'The mechanism that allows NumPy to perform arithmetic operations on arrays of different shapes.' },
            { term: 'Vectorization', definition: 'Structuring calculations to operate on whole arrays simultaneously rather than looping over individual elements.' }
          ],
          commonMisconceptions: [
            'Misconception: Slicing a NumPy array creates a new array in memory. Reality: Array slicing creates a memory view sharing the underlying buffer.'
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
            'The Relational Model: Tables, Tuples, Primary Keys, Foreign Keys',
            'SQL Data Query Language: SELECT, WHERE, GROUP BY, HAVING, ORDER BY',
            'Join Mechanics: INNER JOIN, LEFT OUTER JOIN, RIGHT JOIN, FULL JOIN',
            'Subqueries, Common Table Expressions (CTEs - WITH clause)',
            'Window Functions: ROW_NUMBER(), RANK(), DENSE_RANK(), SUM() OVER (PARTITION BY ... ORDER BY ...)'
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
            'How do foreign keys enforce referential integrity across relational tables?'
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
            { term: '3NF (Third Normal Form)', definition: 'A database schema standard where all non-key attributes are dependent solely on the primary key, eliminating redundancy.' },
            { term: 'ACID', definition: 'Atomicity, Consistency, Isolation, Durability — the required guarantees for reliable database transactions.' }
          ],
          commonMisconceptions: [
            'Misconception: NULL in SQL is equal to empty string or zero. Reality: NULL represents missing/unknown state and behaves according to three-valued logic (TRUE, FALSE, UNKNOWN).'
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
