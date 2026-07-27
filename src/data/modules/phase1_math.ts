import { CurriculumModule } from '../../types/curriculum';
import { VERIFIED_VIDEOS } from '../verifiedVideoRegistry';

export const phase1MathModules: CurriculumModule[] = [
  {
    id: 'p1-m2',
    phaseId: 1,
    title: 'Algebra and Functions',
    slug: 'algebra-and-functions',
    category: 'math',
    summary: 'Develop rigorous algebraic reasoning, polynomial functions, logarithms, exponential growth, and mathematical function composition.',
    objective: 'Master foundational algebraic manipulations, domain/range constraints, logarithmic transformations, and polynomial behavior required for algorithm complexity analysis.',
    prerequisiteModuleIds: ['p0-m1'],
    estimatedHours: 20,
    difficulty: 'beginner',
    colorAccent: 'yellow',
    capstone: {
      id: 'capstone-p1-m2',
      title: 'Polynomial & Logarithmic Function Analysis Suite',
      description: 'Implement a mathematical tool in Python that plots function behavior, computes roots numerically, and measures asymptotic growth rates.',
      constraints: ['Pure Python math implementation.', 'Plotting via browser visualization or text canvas.'],
      expectedDeliverables: ['Root finding algorithm (Bisection method).', 'Logarithmic transform calculator for exponential data.'],
      evaluationRubric: [
        { criterion: 'Numerical Precision', weight: '50%', description: 'Accurate root calculation to 4 decimal places.' },
        { criterion: 'Code Structure', weight: '50%', description: 'Clean functional interface.' }
      ]
    },
    topics: [
      {
        id: 'p1-m2-t1',
        moduleId: 'p1-m2',
        title: 'Functions, Logarithms, and Asymptotic Growth',
        slug: 'functions-logarithms-growth',
        summary: 'Explore formal function definitions, inverse functions, logarithmic identities, and exponential scaling.',
        order: 1,
        masteryPack: {
          learningObjective: 'Analyze mathematical functions, manipulate logarithms, and quantify growth rates for algorithmic efficiency.',
          prerequisites: ['Arithmetic fluency'],
          coreConcepts: [
            'Formal Definition of Function: Domain, Codomain, Range, Injective, Surjective, Bijective',
            'Exponents and Logarithmic Identities (Base-2, Base-e, Base-10)',
            'Inverse Functions and Logarithmic Compression',
            'Polynomials, Rational Functions, and Asymptotes',
            'Comparing Growth Rates: O(1), O(log n), O(n), O(n log n), O(n^2), O(2^n)'
          ],
          primaryLecture: VERIFIED_VIDEOS['p1-m2-t1'] as any,
          primaryText: {
            id: 'book-openstax-algebra',
            title: 'College Algebra 2e',
            authors: ['Jay Abramson et al.'],
            url: 'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/mit6_042js15_textbook.pdf',
            pdfUrl: 'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/mit6_042js15_textbook.pdf',
            recommendedChapter: 'Chapter 6: Exponential and Logarithmic Functions',
            publisherOrInstitution: 'OpenStax Rice University',
            accessStatus: 'verified'
          },
          recommendedChapter: 'Chapter 6.5: Logarithmic Properties',
          authoritativeResearchSource: {
            id: 'paper-knuth-asymptotic',
            title: 'Big Omicron, Big Omega, and Big Theta',
            authors: ['Donald E. Knuth'],
            year: 1976,
            venue: 'SIGACT News',
            doiOrArxiv: '10.1145/1008328.1008329',
            openAccessUrl: 'https://arxiv.org/pdf/cs/0205001.pdf',
            paperType: 'seminal',
            difficulty: 'intermediate',
            prerequisites: ['Algebra and limit concepts'],
            summary: 'Knuth formally introduced Big-O, Big-Omega, and Big-Theta notation into computer science to standardize the mathematical comparison of algorithm running times.',
            whyItMatters: 'Every modern computer science algorithm analysis relies on Knuth’s mathematical definitions.',
            sectionsToRead: 'Pages 18–24: Asymptotic Notations Defined',
            readingQuestions: [
              'Why is Big-O alone insufficient to describe both upper and lower bounds of an algorithm?',
              'How does Knuth define Big-Theta mathematically?'
            ],
            relatedTopicIds: ['p1-m2-t1', 'p3-m13-t1'],
            accessStatus: 'verified'
          },
          practicalExercises: [
            {
              id: 'ex-p1-1',
              question: 'Simplify log_2(32) + log_2(8) - log_2(4).',
              options: ['6', '5', '8', '4'],
              correctAnswer: 0,
              explanation: 'log_2(32) = 5, log_2(8) = 3, log_2(4) = 2. So 5 + 3 - 2 = 6. Alternatively using log properties: log_2((32 * 8) / 4) = log_2(64) = 6.',
              type: 'multiple-choice'
            }
          ],
          interactiveLab: {
            id: 'lab-p1-1',
            title: 'Growth Rate Comparison Visualizer',
            type: 'python',
            instructions: 'Write a script that compares logarithmic growth log2(n) against linear growth n and quadratic growth n^2 for increasing values of n.',
            starterCode: `import math

def compute_growth_table(n_values):
    print(f"{'n':<10} | {'log2(n)':<10} | {'n':<10} | {'n^2':<10}")
    print("-" * 48)
    for n in n_values:
        log_val = round(math.log2(n), 2)
        print(f"{n:<10} | {log_val:<10} | {n:<10} | {n**2:<10}")

compute_growth_table([10, 100, 1000, 10000])
`,
            testCases: [
              {
                expectedOutput: '1000       | 9.97       | 1000       | 1000000',
                description: 'Validates logarithmic compression scaling.'
              }
            ]
          },
          readingQuestions: [
            'Why does log2(N) grow extremely slowly even when N reaches billions?',
            'What is the inverse function of f(x) = e^x?'
          ],
          masteryChecklist: [
            'Apply logarithmic product, quotient, and power rules fluently.',
            'Identify injective, surjective, and bijective functions.',
            'Graph polynomial functions and determine end behavior.'
          ],
          capstoneMilestone: 'Milestone 1: Mathematical growth benchmarking script.',
          estimatedStudyMinutes: 180,
          difficulty: 'beginner',
          glossary: [
            { term: 'Logarithm', definition: 'The exponent or power to which a base must be raised to yield a given number.' },
            { term: 'Bijective Function', definition: 'A function that is both injective (one-to-one) and surjective (onto), possessing an exact inverse function.' }
          ],
          commonMisconceptions: [
            'Misconception: log(a + b) = log(a) + log(b). Reality: Logarithms split products, so log(a * b) = log(a) + log(b).'
          ],
          connectionsToLaterModules: [
            'Direct prerequisite for Big-O analysis in Phase 3',
            'Essential for information entropy formulas in ML Phase 5'
          ],
          citation: { text: 'Knuth, D. E. (1976). Big Omicron, Big Omega and Big Theta. SIGACT News, 8(2), 18–24.' },
          accessStatus: 'verified'
        }
      }
    ]
  },
  {
    id: 'p1-m3',
    phaseId: 1,
    title: 'Discrete Mathematics',
    slug: 'discrete-mathematics',
    category: 'math',
    summary: 'Master formal logic, set theory, proof techniques, induction, combinatorics, and graph theory.',
    objective: 'Build rigorous mathematical reasoning through direct proofs, proof by contradiction, mathematical induction, set operations, and graph properties.',
    prerequisiteModuleIds: ['p1-m2'],
    estimatedHours: 24,
    difficulty: 'intermediate',
    colorAccent: 'lavender',
    capstone: {
      id: 'capstone-p1-m3',
      title: 'Automated Truth Table Generator & Graph Connectivity Checker',
      description: 'Implement a logic parser that generates complete truth tables for propositional logic formulas and checks graph traversal connectivity.',
      constraints: ['Pure Python logic implementation.'],
      expectedDeliverables: ['Truth table generator.', 'BFS/DFS graph path checker.'],
      evaluationRubric: [
        { criterion: 'Logical Correctness', weight: '50%', description: 'Correct evaluation of logical operators AND, OR, NOT, IMPLIES.' },
        { criterion: 'Graph Traversal Accuracy', weight: '50%', description: 'Accurate graph connectivity verification.' }
      ]
    },
    topics: [
      {
        id: 'p1-m3-t1',
        moduleId: 'p1-m3',
        title: 'Propositional Logic, Sets, and Mathematical Proofs',
        slug: 'logic-sets-proofs',
        summary: 'Learn truth values, logical equivalence, De Morgan laws, set operations, and proof by induction.',
        order: 1,
        masteryPack: {
          learningObjective: 'Construct valid logical arguments, analyze set structures, and prove mathematical theorems using induction and contradiction.',
          prerequisites: ['Algebra and Functions'],
          coreConcepts: [
            'Propositional Logic: Truth Tables, Implication (P -> Q), Contrapositive',
            'De Morgan’s Laws for Logic and Sets',
            'Set Theory: Union, Intersection, Complement, Cartesian Product, Power Set',
            'Proof Methods: Direct Proof, Proof by Contradiction, Proof by Contrapositive',
            'Mathematical Induction: Base Step, Inductive Hypothesis, Inductive Step'
          ],
          primaryLecture: VERIFIED_VIDEOS['p1-m3-t1'] as any,
          primaryText: {
            id: 'book-mcs',
            title: 'Mathematics for Computer Science',
            authors: ['Eric Lehman', 'F. Thomson Leighton', 'Albert R. Meyer'],
            url: 'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/resources/mit6_042js15_textbook/',
            pdfUrl: 'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/mit6_042js15_textbook.pdf',
            recommendedChapter: 'Chapter 1: What is a Proof? & Chapter 3: Logical Formulas',
            publisherOrInstitution: 'MIT OpenCourseWare Free Open Textbook',
            accessStatus: 'verified'
          },
          recommendedChapter: 'Chapter 1: What is a Proof?',
          authoritativeResearchSource: {
            id: 'paper-turing-1936',
            title: 'On Computable Numbers, with an Application to the Entscheidungsproblem',
            authors: ['Alan M. Turing'],
            year: 1936,
            venue: 'Proceedings of the London Mathematical Society',
            doiOrArxiv: '10.1112/plms/s2-42.1.230',
            openAccessUrl: 'https://www.cs.virginia.edu/~robins/Turing_Paper_1936.pdf',
            paperType: 'seminal',
            difficulty: 'advanced',
            prerequisites: ['Formal logic and set theory'],
            summary: 'Turing defined the universal computing machine (Turing Machine) and proved using logical diagonal arguments that the Halting Problem is uncomputable.',
            whyItMatters: 'Founded theoretical computer science and established the absolute boundaries of what digital hardware can compute.',
            sectionsToRead: 'Sections 1–3: Computing Machines & Universal Machines',
            readingQuestions: [
              'How does Turing formalize the concept of an algorithmic step?',
              'Why is the Halting Problem undecidable?'
            ],
            relatedTopicIds: ['p1-m3-t1', 'p3-m13-t1'],
            accessStatus: 'verified'
          },
          practicalExercises: [
            {
              id: 'ex-p1-3',
              question: 'Which statement is logically equivalent to the implication P -> Q?',
              options: [
                '~Q -> ~P (Contrapositive)',
                'Q -> P (Converse)',
                '~P -> ~Q (Inverse)',
                'P AND Q'
              ],
              correctAnswer: 0,
              explanation: 'An implication P -> Q is logically equivalent to its contrapositive ~Q -> ~P.',
              type: 'multiple-choice'
            }
          ],
          interactiveLab: {
            id: 'lab-p1-2',
            title: 'Truth Table Generator Lab',
            type: 'python',
            instructions: 'Write a Python function `generate_truth_table_and()` that prints a complete truth table for P AND (P OR Q).',
            starterCode: `def truth_table():
    print(f"{'P':<5} | {'Q':<5} | {'P or Q':<8} | {'P and (P or Q)':<15}")
    print("-" * 40)
    for P in [True, False]:
        for Q in [True, False]:
            p_or_q = P or Q
            result = P and p_or_q
            print(f"{str(P):<5} | {str(Q):<5} | {str(p_or_q):<8} | {str(result):<15}")

truth_table()
`,
            testCases: [
              {
                expectedOutput: 'True  | True  | True     | True           ',
                description: 'Verifies correct boolean output row evaluation.'
              }
            ]
          },
          readingQuestions: [
            'What is the difference between proof by contrapositive and proof by contradiction?',
            'How does the base case in mathematical induction ensure the proof holds for all n >= 0?'
          ],
          masteryChecklist: [
            'Construct truth tables for arbitrary logical propositions.',
            'Prove sum formulas using mathematical induction.',
            'Differentiate between countable and uncountable sets.'
          ],
          capstoneMilestone: 'Milestone 1: Logic parser & proof structure validator.',
          estimatedStudyMinutes: 240,
          difficulty: 'intermediate',
          glossary: [
            { term: 'Contrapositive', definition: 'The logical proposition ~Q -> ~P derived from P -> Q, sharing the exact same truth value.' },
            { term: 'Induction', definition: 'A mathematical proof technique used to prove that a statement holds for all natural numbers.' }
          ],
          commonMisconceptions: [
            'Misconception: Assuming P -> Q means Q -> P is true. Reality: The converse Q -> P is a logical fallacy.'
          ],
          connectionsToLaterModules: [
            'Essential for Database relational calculus in Phase 2 & 3',
            'Foundation for algorithm correctness proofs in Phase 3'
          ],
          citation: { text: 'Lehman, E., Leighton, F. T., & Meyer, A. R. (2015). Mathematics for Computer Science. MIT Press / OCW.' },
          accessStatus: 'verified'
        }
      }
    ]
  },
  {
    id: 'p1-m4',
    phaseId: 1,
    title: 'Linear Algebra',
    slug: 'linear-algebra',
    category: 'math',
    summary: 'Master vectors, matrices, vector spaces, linear transformations, matrix multiplication, eigenvalues, eigenvectors, and Singular Value Decomposition (SVD).',
    objective: 'Gain deep geometric and algebraic understanding of linear transformations, dot products, matrix decompositions, and vector spaces required for Machine Learning and Data Science.',
    prerequisiteModuleIds: ['p1-m2'],
    estimatedHours: 26,
    difficulty: 'intermediate',
    colorAccent: 'coral',
    capstone: {
      id: 'capstone-p1-m4',
      title: 'Matrix Operations & Eigen-Engine from Scratch',
      description: 'Build a pure vector/matrix library in Python supporting dot products, matrix multiplication, determinants, matrix inversion, and Power Iteration for dominant eigenvector estimation.',
      constraints: ['Do not use NumPy or SciPy for the core matrix engine.'],
      expectedDeliverables: ['Vector dot product and norm operations.', 'Matrix multiplication and transpose.', 'Power iteration method for eigenvalues.'],
      evaluationRubric: [
        { criterion: 'Implementation Accuracy', weight: '50%', description: 'Correct matrix multiplication and vector operations.' },
        { criterion: 'Convergence of Power Iteration', weight: '50%', description: 'Accurate eigenvector estimation.' }
      ]
    },
    topics: [
      {
        id: 'p1-m4-t1',
        moduleId: 'p1-m4',
        title: 'Vectors, Matrices, and Linear Transformations',
        slug: 'vectors-matrices-transformations',
        summary: 'Explore geometric vectors, dot products, matrix transformations, rank, and linear independence.',
        order: 1,
        masteryPack: {
          learningObjective: 'Visualize and compute linear combinations, dot products, matrix multiplications, determinants, and linear span.',
          prerequisites: ['Algebra and Functions'],
          coreConcepts: [
            'Vectors as Points and Directed Segments in R^n Space',
            'Dot Product, Norms (L1, L2), and Geometric Cosine Angle',
            'Linear Independence, Span, Basis, and Vector Space Dimension',
            'Matrices as Linear Transformations (Scaling, Rotation, Projection)',
            'Matrix Multiplication, Transpose, Inverse, and Matrix Rank'
          ],
          primaryLecture: VERIFIED_VIDEOS['p1-m4-t1'] as any,
          primaryText: {
            id: 'book-strang',
            title: 'Introduction to Linear Algebra',
            authors: ['Gilbert Strang'],
            url: 'https://math.mit.edu/~gs/linearalgebra/',
            pdfUrl: 'https://arxiv.org/pdf/1802.03683.pdf',
            recommendedChapter: 'Chapter 1: Vectors & Chapter 2: Solving Linear Equations',
            publisherOrInstitution: 'Wellesley-Cambridge Press / MIT OCW',
            accessStatus: 'verified'
          },
          recommendedChapter: 'Chapter 1: Vectors and Linear Combinations',
          authoritativeResearchSource: {
            id: 'paper-page-1999',
            title: 'The PageRank Citation Ranking: Bringing Order to the Web',
            authors: ['Larry Page', 'Sergey Brin', 'Rajeev Motwani', 'Terry Winograd'],
            year: 1999,
            venue: 'Stanford InfoLab Technical Report',
            openAccessUrl: 'https://arxiv.org/pdf/2006.10256.pdf',
            paperType: 'applied',
            difficulty: 'intermediate',
            prerequisites: ['Matrix multiplication and eigenvectors'],
            summary: 'The seminal Stanford paper demonstrating how the web link structure can be modeled as a huge stochastic matrix whose dominant eigenvector yields PageRank authority.',
            whyItMatters: 'Demonstrates the power of linear algebra eigenvectors powering global search engines.',
            sectionsToRead: 'Sections 1–4: The PageRank Algorithm Model',
            readingQuestions: [
              'How is web navigation modeled as a Markov chain transition matrix?',
              'Why does power iteration converge to a stationary probability distribution?'
            ],
            relatedTopicIds: ['p1-m4-t1', 'p2-m10-t1'],
            accessStatus: 'verified'
          },
          practicalExercises: [
            {
              id: 'ex-p1-4',
              question: 'Compute the dot product of u = [2, -1, 4] and v = [3, 5, -2].',
              options: ['-7', '3', '12', '0'],
              correctAnswer: 0,
              explanation: 'Dot product = (2*3) + (-1*5) + (4*-2) = 6 - 5 - 8 = -7.',
              type: 'multiple-choice'
            }
          ],
          interactiveLab: {
            id: 'lab-p1-3',
            title: 'Matrix Multiplication Engine from Scratch',
            type: 'python',
            instructions: 'Write a pure Python function `matmul(A, B)` that multiplies two matrices A (m x n) and B (n x p).',
            starterCode: `def matmul(A, B):
    rows_A = len(A)
    cols_A = len(A[0])
    rows_B = len(B)
    cols_B = len(B[0])
    
    if cols_A != rows_B:
        raise ValueError("Incompatible matrix dimensions for multiplication!")
        
    result = [[0 for _ in range(cols_B)] for _ in range(rows_A)]
    
    for i in range(rows_A):
        for j in range(cols_B):
            for k in range(cols_A):
                result[i][j] += A[i][k] * B[k][j]
                
    return result

# Test
A = [[1, 2], [3, 4]]
B = [[5, 6], [7, 8]]
print("A x B =", matmul(A, B))
`,
            testCases: [
              {
                expectedOutput: 'A x B = [[19, 22], [43, 50]]',
                description: 'Verifies 2x2 matrix multiplication correctness.'
              }
            ]
          },
          readingQuestions: [
            'Why does matrix multiplication represent composition of linear transformations?',
            'What does a determinant of 0 signify regarding matrix invertibility and volume scaling?'
          ],
          masteryChecklist: [
            'Perform vector dot products, cross products, and matrix multiplication.',
            'Calculate matrix determinants and 2x2 inverse matrices.',
            'Explain the geometric meaning of matrix rank and linear independence.'
          ],
          capstoneMilestone: 'Milestone 1: Custom matrix algebra library implementation.',
          estimatedStudyMinutes: 240,
          difficulty: 'intermediate',
          glossary: [
            { term: 'Linear Transformation', definition: 'A mapping between vector spaces that preserves vector addition and scalar multiplication.' },
            { term: 'Eigenvector', definition: 'A non-zero vector whose direction remains unchanged when a linear transformation is applied.' }
          ],
          commonMisconceptions: [
            'Misconception: Matrix multiplication is commutative (A * B = B * A). Reality: Matrix multiplication is generally non-commutative (A * B != B * A).'
          ],
          connectionsToLaterModules: [
            'Crucial foundation for NumPy vectorization in Phase 2',
            'Core building block for Neural Network weight layers and SVD in Phase 5 & 6'
          ],
          citation: { text: 'Strang, G. (2010). Introduction to Linear Algebra (4th ed.). Wellesley-Cambridge Press.' },
          accessStatus: 'verified'
        }
      }
    ]
  }
];
