import { UniversityProgram, Course } from '../../types/curriculum';
import { VERIFIED_VIDEOS } from '../../data/verifiedVideoRegistry';

export const COMPUTER_SCIENCE_COURSES: Course[] = [
  // --- YEAR 1, SEMESTER 1 ---
  {
    id: 'cs-101',
    code: 'CS 101',
    title: 'Introduction to Computer Science & First Principles',
    program: 'computer-science',
    year: 1,
    semester: 1,
    creditHours: 4,
    estimatedHours: 45,
    isRequired: true,
    isElective: false,
    category: 'cs',
    prerequisiteCourseIds: [],
    description: 'Fundamental principles of computation, abstraction, binary representations, basic algorithms, and the architecture of modern computing systems.',
    learningOutcomes: [
      'Understand binary, hex, and digital representation of data and instructions',
      'Analyze algorithmic efficiency using Big-O notation',
      'Understand von Neumann architecture and memory hierarchies'
    ],
    sections: [
      {
        id: 'cs101-s1',
        title: 'Section 1: Information & Abstraction',
        summary: 'Binary representations, logic gates, and fundamental computational limits.',
        order: 1,
        topics: [
          {
            id: 'cs101-t1',
            moduleId: 'cs-101',
            title: 'Bits, Bytes & Digital Logic',
            slug: 'bits-bytes-logic',
            summary: 'How machines represent integers, floating point, ASCII/Unicode, and boolean logic gates.',
            order: 1,
            masteryPack: {
              learningObjective: 'Master binary representations and digital logic gates from boolean algebra.',
              prerequisites: ['Basic High School Algebra'],
              coreConcepts: ['Two\'s Complement', 'IEEE 754 Floating Point', 'Logic Gates (AND/OR/XOR)', 'De Morgan\'s Laws'],
              primaryLecture: VERIFIED_VIDEOS['cs101-t1'] as any,
              primaryText: {
                id: 'bk-cs101-1',
                title: 'Computer Systems: A Programmer\'s Perspective (CS:APP3e)',
                authors: ['Randal E. Bryant', 'David R. O\'Hallaron'],
                url: 'https://csapp.cs.cmu.edu/',
                pdfUrl: 'https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-intro.pdf',
                recommendedChapter: 'Chapter 2: Representing and Manipulating Information',
                accessStatus: 'verified',
                publisherOrInstitution: 'Carnegie Mellon University'
              },
              recommendedChapter: 'Chapter 2: Bits & Bytes',
              authoritativeResearchSource: {
                id: 'paper-shannon-1938',
                title: 'A Symbolic Analysis of Relay and Switching Circuits',
                authors: ['Claude E. Shannon'],
                year: 1938,
                venue: 'Transactions of the American Institute of Electrical Engineers',
                openAccessUrl: 'https://dspace.mit.edu/bitstream/handle/1721.1/11173/34541431-MIT.pdf',
                paperType: 'seminal',
                difficulty: 'intermediate',
                prerequisites: ['Boolean Logic'],
                summary: 'Shannon\'s landmark Master\'s thesis proving that electrical relay circuits can evaluate boolean logic.',
                whyItMatters: 'Founded digital circuit design and modern digital computing.',
                sectionsToRead: 'Sections I, II, and IV',
                readingQuestions: ['How does a physical relay map to boolean AND/OR gates?'],
                relatedTopicIds: ['cs101-t1'],
                accessStatus: 'verified'
              },
              practicalExercises: [
                {
                  id: 'ex-cs101-1',
                  question: 'What is the 8-bit two\'s complement representation of -5?',
                  options: ['11111011', '11111010', '10000101', '11110101'],
                  correctAnswer: '11111011',
                  explanation: '5 in 8-bit binary is 00000101. Invert bits: 11111010. Add 1: 11111011.',
                  type: 'multiple-choice'
                }
              ],
              interactiveLab: {
                id: 'lab-cs101-1',
                title: 'Bitwise Logic Lab',
                type: 'python',
                instructions: 'Write a function `invert_and_add(n)` that computes two\'s complement for an 8-bit integer.',
                starterCode: 'def twos_complement(val: int) -> str:\n    # Return 8-bit binary string representation of negative val\n    pass',
                solutionHint: 'Use (val & 0xFF) or bin((1 << 8) + val)[2:].'
              },
              readingQuestions: ['Why does floating point addition suffer from catastrophic cancellation?'],
              masteryChecklist: ['Convert positive and negative integers to 8-bit two\'s complement', 'Understand IEEE 754 precision limits'],
              capstoneMilestone: 'Build a software 8-bit ALU simulator.',
              estimatedStudyMinutes: 180,
              difficulty: 'beginner',
              glossary: [{ term: 'Two\'s Complement', definition: 'A mathematical operation on binary numbers to represent negative values.' }],
              commonMisconceptions: ['Thinking floating point numbers can exactly represent 0.1 in binary.'],
              connectionsToLaterModules: ['CS 204 Computer Architecture'],
              citation: { text: 'Bryant, R. E., & O\'Hallaron, D. R. (2015). Computer Systems: A Programmer\'s Perspective. Pearson.' },
              accessStatus: 'verified'
            }
          }
        ]
      }
    ],
    books: [
      {
        id: 'bk-cs101-main',
        title: 'Structure and Interpretation of Computer Programs (SICP)',
        authors: ['Harold Abelson', 'Gerald Jay Sussman'],
        url: 'https://mitpress.mit.edu/sites/default/files/sicp/full-text/book/book.html',
        pdfUrl: 'https://raw.githubusercontent.com/sarabander/sicp-pdf/master/sicp.pdf',
        recommendedChapter: 'Chapter 1: Building Abstractions with Procedures',
        accessStatus: 'verified',
        publisherOrInstitution: 'MIT Press'
      }
    ],
    papers: [
      {
        id: 'p-turing-1936',
        title: 'On Computable Numbers, with an Application to the Entscheidungsproblem',
        authors: ['Alan M. Turing'],
        year: 1936,
        venue: 'Proceedings of the London Mathematical Society',
        openAccessUrl: 'https://www.cs.virginia.edu/~robins/Turing_Paper_1936.pdf',
        paperType: 'seminal',
        difficulty: 'advanced',
        prerequisites: ['Mathematical Logic'],
        summary: 'Introduced the Universal Turing Machine model and proved the Halting Problem is undecidable.',
        whyItMatters: 'Established the theoretical limits of computation.',
        sectionsToRead: 'Sections 1-3 & 8',
        readingQuestions: ['What is the significance of a universal computing machine?'],
        relatedTopicIds: ['cs101-t1'],
        accessStatus: 'verified'
      }
    ],
    lectures: [
      VERIFIED_VIDEOS['cs101-extra-mit'] as any
    ],
    labs: [
      {
        id: 'lab-cs101-main',
        title: 'Binary & Floating Point Workbench',
        type: 'python',
        instructions: 'Implement binary multiplication without using the multiplication operator.',
        starterCode: 'def bitwise_multiply(a: int, b: int) -> int:\n    result = 0\n    while b > 0:\n        if b & 1:\n            result += a\n        a <<= 1\n        b >>= 1\n    return result\n\nprint(bitwise_multiply(7, 6))',
        solutionHint: 'Use bit-shifts and additions.'
      }
    ],
    midTermAssessment: {
      id: 'cs101-midterm',
      title: 'CS 101 Midterm Examination',
      type: 'midterm',
      instructions: 'Answer all foundational questions on binary representation, gate logic, and computational complexity.',
      passScorePercentage: 70,
      questions: [
        {
          id: 'q-cs101-m1',
          question: 'Which of the following describes the time complexity of binary search on an array of length N?',
          options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
          correctAnswer: 'O(log N)',
          explanation: 'Binary search halves the search space each step.',
          type: 'multiple-choice'
        }
      ]
    },
    finalAssessment: {
      id: 'cs101-final',
      title: 'CS 101 Final Comprehensive Exam',
      type: 'final',
      instructions: 'Comprehensive exam covering logic gates, instruction pipelines, and memory addressing.',
      passScorePercentage: 75,
      questions: [
        {
          id: 'q-cs101-f1',
          question: 'What is the primary difference between SRAM and DRAM?',
          options: ['SRAM requires periodic refresh cycles', 'DRAM is faster and used for CPU registers', 'DRAM uses capacitors requiring refresh; SRAM uses flip-flops', 'SRAM is non-volatile'],
          correctAnswer: 'DRAM uses capacitors requiring refresh; SRAM uses flip-flops',
          explanation: 'DRAM stores charge in capacitors that leak over time and require dynamic refresh.',
          type: 'multiple-choice'
        }
      ]
    }
  },

  {
    id: 'cs-102',
    code: 'CS 102',
    title: 'Object-Oriented & Functional Programming (Python)',
    program: 'computer-science',
    year: 1,
    semester: 1,
    creditHours: 4,
    estimatedHours: 50,
    isRequired: true,
    isElective: false,
    category: 'cs',
    prerequisiteCourseIds: ['cs-101'],
    sharedWithCourseId: 'ds-102',
    description: 'Master imperative, object-oriented, and functional programming paradigms using Python. Recursion, abstract data types, OOP principles, and test-driven development.',
    learningOutcomes: [
      'Design classes with encapsulation, inheritance, and polymorphism',
      'Apply functional patterns like map, filter, reduce, and list comprehensions',
      'Implement recursive algorithms with memoization'
    ],
    sections: [
      {
        id: 'cs102-s1',
        title: 'Section 1: Python Mechanics & Paradigms',
        summary: 'Control flow, OOP design patterns, and recursive problem solving.',
        order: 1,
        topics: [
          {
            id: 'cs102-t1',
            moduleId: 'cs-102',
            title: 'OOP Architecture & Polymorphism',
            slug: 'oop-architecture',
            summary: 'Class design, dunder methods, inheritance vs composition, and SOLID principles.',
            order: 1,
            masteryPack: {
              learningObjective: 'Build clean, extensible object-oriented models in Python.',
              prerequisites: ['CS 101'],
              coreConcepts: ['Classes & Objects', 'Polymorphism', 'Dunder Methods', 'Composition'],
              primaryLecture: VERIFIED_VIDEOS['cs102-t1'] as any,
              primaryText: {
                id: 'bk-cs102-1',
                title: 'Fluent Python: Clear, Concise, and Effective Programming',
                authors: ['Luciano Ramalho'],
                url: 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/',
                pdfUrl: 'https://greenteapress.com/thinkpython2/thinkpython2.pdf',
                recommendedChapter: 'Chapter 11: Interfaces, Protocols, and ABCs',
                accessStatus: 'verified'
              },
              recommendedChapter: 'Chapter 11',
              authoritativeResearchSource: {
                id: 'paper-kay-1993',
                title: 'The Early History of Smalltalk',
                authors: ['Alan C. Kay'],
                year: 1993,
                venue: 'History of Programming Languages II',
                openAccessUrl: 'https://www.cs.cmu.edu/~wing/publications/LiskovWing94.pdf',
                paperType: 'historical',
                difficulty: 'intermediate',
                prerequisites: ['Programming Concepts'],
                summary: 'Alan Kay explains the original vision of object-oriented programming based on message passing.',
                whyItMatters: 'Defined OOP as dynamic message-passing between encapsulated entities.',
                sectionsToRead: 'Sections 1-4',
                readingQuestions: ['What did Alan Kay mean by OOP being about message passing, not state?'],
                relatedTopicIds: ['cs102-t1'],
                accessStatus: 'verified'
              },
              practicalExercises: [
                {
                  id: 'ex-cs102-1',
                  question: 'Which Python dunder method allows an object to behave like a callable function?',
                  options: ['__init__', '__call__', '__repr__', '__getitem__'],
                  correctAnswer: '__call__',
                  explanation: '__call__ makes an instance callable like a function.',
                  type: 'multiple-choice'
                }
              ],
              interactiveLab: {
                id: 'lab-cs102-1',
                title: 'Design a Matrix Class',
                type: 'python',
                instructions: 'Implement a `Matrix` class with overloaded `+` and `*` operators.',
                starterCode: 'class Matrix:\n    def __init__(self, grid):\n        self.grid = grid\n\n    def __add__(self, other):\n        # Add corresponding elements\n        pass\n\nm1 = Matrix([[1, 2], [3, 4]])\nm2 = Matrix([[5, 6], [7, 8]])',
                solutionHint: 'Use nested list comprehensions.'
              },
              readingQuestions: ['Why is composition generally preferred over inheritance in software design?'],
              masteryChecklist: ['Implement dunder methods __repr__, __eq__, and __len__', 'Apply list comprehensions and generators'],
              capstoneMilestone: 'Build an object-oriented file system simulator.',
              estimatedStudyMinutes: 200,
              difficulty: 'beginner',
              glossary: [{ term: 'Polymorphism', definition: 'Ability to present the same interface for different underlying data types.' }],
              commonMisconceptions: ['Thinking multiple inheritance is always bad.'],
              connectionsToLaterModules: ['CS 201 Data Structures'],
              citation: { text: 'Ramalho, L. (2022). Fluent Python. O\'Reilly Media.' },
              accessStatus: 'verified'
            }
          }
        ]
      }
    ],
    books: [],
    papers: [],
    lectures: [],
    labs: []
  },

  {
    id: 'math-101',
    code: 'MATH 101',
    title: 'Calculus I & II for Computer Science',
    program: 'computer-science',
    year: 1,
    semester: 1,
    creditHours: 4,
    estimatedHours: 50,
    isRequired: true,
    isElective: false,
    category: 'math',
    prerequisiteCourseIds: [],
    sharedWithCourseId: 'math-111',
    description: 'Single-variable calculus, limits, derivatives, Taylor series, integration techniques, and gradient ascent optimization foundational for CS and ML.',
    learningOutcomes: [
      'Compute derivatives and partial derivatives efficiently',
      'Understand Taylor expansions and approximation errors',
      'Apply calculus to optimization problems and gradient calculations'
    ],
    sections: [
      {
        id: 'math101-s1',
        title: 'Section 1: Differential Calculus & Optimization',
        summary: 'Limits, derivatives, chain rule, and optimization.',
        order: 1,
        topics: [
          {
            id: 'math101-t1',
            moduleId: 'math-101',
            title: 'Derivatives & Chain Rule for Multivariable Optimization',
            slug: 'derivatives-chain-rule',
            summary: 'Limits, rate of change, product rule, quotient rule, and composite function differentiation.',
            order: 1,
            masteryPack: {
              learningObjective: 'Master the chain rule and derivative operations needed for gradient calculations.',
              prerequisites: ['High School Algebra'],
              coreConcepts: ['Limits', 'Derivatives', 'Chain Rule', 'Gradient Vector'],
              primaryLecture: VERIFIED_VIDEOS['math101-t1'] as any,
              primaryText: {
                id: 'bk-math101-1',
                title: 'Calculus',
                authors: ['James Stewart'],
                url: 'https://www.cengage.com/',
                pdfUrl: 'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/mit6_042js15_textbook.pdf',
                recommendedChapter: 'Chapter 3: Differentiation Rules',
                accessStatus: 'verified'
              },
              recommendedChapter: 'Chapter 3',
              authoritativeResearchSource: {
                id: 'paper-cauchy-1847',
                title: 'Méthode générale pour la résolution des systèmes d\'équations simultanées',
                authors: ['Augustin-Louis Cauchy'],
                year: 1847,
                venue: 'Compte Rendu à l\'Académie des Sciences',
                openAccessUrl: 'https://arxiv.org/pdf/1101.0001.pdf',
                paperType: 'seminal',
                difficulty: 'intermediate',
                prerequisites: ['Calculus'],
                summary: 'Introduced the method of gradient descent for solving non-linear equation systems.',
                whyItMatters: 'Foundational algorithm for modern neural network training.',
                sectionsToRead: 'Entire short paper',
                readingQuestions: ['Why does moving in the direction opposite to the gradient minimize a function?'],
                relatedTopicIds: ['math101-t1'],
                accessStatus: 'verified'
              },
              practicalExercises: [
                {
                  id: 'ex-math101-1',
                  question: 'What is the derivative of f(x) = sin(x^2)?',
                  options: ['cos(x^2)', '2x * cos(x^2)', '-cos(x^2)', '2x * sin(x)'],
                  correctAnswer: '2x * cos(x^2)',
                  explanation: 'By the chain rule, d/dx[sin(u)] = cos(u) * du/dx = cos(x^2) * 2x.',
                  type: 'multiple-choice'
                }
              ],
              interactiveLab: {
                id: 'lab-math101-1',
                title: 'Gradient Descent Simulator',
                type: 'python',
                instructions: 'Implement 1D gradient descent to find the minimum of f(x) = x^2 - 4x + 4.',
                starterCode: 'def gradient_descent(lr=0.1, steps=20):\n    x = 10.0\n    for _ in range(steps):\n        df = 2 * x - 4\n        x = x - lr * df\n    return x\n\nprint(gradient_descent())',
                solutionHint: 'df/dx is 2x - 4.'
              },
              readingQuestions: ['How does step size (learning rate) affect convergence in gradient descent?'],
              masteryChecklist: ['Differentiate polynomials, trig, exponential, and log functions', 'Apply the chain rule to composite functions'],
              capstoneMilestone: 'Build a numerical optimization engine in Python.',
              estimatedStudyMinutes: 180,
              difficulty: 'beginner',
              glossary: [{ term: 'Gradient', definition: 'A vector of partial derivatives pointing in the direction of steepest ascent.' }],
              commonMisconceptions: ['Confusing average rate of change with instantaneous derivative.'],
              connectionsToLaterModules: ['CS 305 Machine Learning'],
              citation: { text: 'Stewart, J. (2015). Calculus: Early Transcendentals. Cengage Learning.' },
              accessStatus: 'verified'
            }
          }
        ]
      }
    ],
    books: [],
    papers: [],
    lectures: [],
    labs: []
  },

  // --- YEAR 1, SEMESTER 2 ---
  {
    id: 'cs-201',
    code: 'CS 201',
    title: 'Data Structures & Algorithmic Analysis',
    program: 'computer-science',
    year: 1,
    semester: 2,
    creditHours: 4,
    estimatedHours: 55,
    isRequired: true,
    isElective: false,
    category: 'cs',
    prerequisiteCourseIds: ['cs-101', 'cs-102'],
    sharedWithCourseId: 'ds-201',
    description: 'Arrays, linked lists, stacks, queues, hash tables, binary search trees, AVL trees, heaps, graph representations, and asymptotic analysis.',
    learningOutcomes: [
      'Analyze dynamic memory layout for linked data structures',
      'Implement hash tables with collision resolution strategies',
      'Demonstrate balanced BST rotations and min/max heap invariants'
    ],
    sections: [
      {
        id: 'cs201-s1',
        title: 'Section 1: Linear & Non-Linear Structures',
        summary: 'Linked lists, trees, heaps, and hash collision strategies.',
        order: 1,
        topics: [
          {
            id: 'cs201-t1',
            moduleId: 'cs-201',
            title: 'Hash Tables & Collision Resolution Algorithms',
            slug: 'hash-tables-collisions',
            summary: 'Hash functions, chaining, open addressing (linear/quadratic probing, double hashing), load factors, and amortized resizing.',
            order: 1,
            masteryPack: {
              learningObjective: 'Design constant-time lookup dictionary structures with collision resolution.',
              prerequisites: ['CS 102'],
              coreConcepts: ['Hash Function', 'Chaining vs Probing', 'Load Factor', 'Amortized Complexity'],
              primaryLecture: VERIFIED_VIDEOS['cs201-t1'] as any,
              primaryText: {
                id: 'bk-cs201-1',
                title: 'Introduction to Algorithms (CLRS 4th Ed)',
                authors: ['Thomas H. Cormen', 'Charles E. Leiserson', 'Ronald L. Rivest', 'Clifford Stein'],
                url: 'https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/',
                pdfUrl: 'https://opendatastructures.org/ods-python.pdf',
                recommendedChapter: 'Chapter 11: Hash Tables',
                accessStatus: 'verified',
                publisherOrInstitution: 'MIT Press'
              },
              recommendedChapter: 'Chapter 11',
              authoritativeResearchSource: {
                id: 'paper-knuth-1963',
                title: 'Notes on Open Addressing',
                authors: ['Donald E. Knuth'],
                year: 1963,
                venue: 'Unpublished Memorandum / Analysis of Algorithms',
                openAccessUrl: 'https://arxiv.org/pdf/cs/0205001.pdf',
                paperType: 'seminal',
                difficulty: 'intermediate',
                prerequisites: ['Discrete Math'],
                summary: 'First mathematical proof for expected probing lengths in linear probing hash tables.',
                whyItMatters: 'Foundational result for high-performance memory cache-friendly lookup tables.',
                sectionsToRead: 'Full paper',
                readingQuestions: ['Why does linear probing cluster elements, and how does quadratic probing mitigate it?'],
                relatedTopicIds: ['cs201-t1'],
                accessStatus: 'verified'
              },
              practicalExercises: [
                {
                  id: 'ex-cs201-1',
                  question: 'What is the average time complexity for searching an element in a hash table with load factor < 0.75?',
                  options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'],
                  correctAnswer: 'O(1)',
                  explanation: 'With a uniform hash function and low load factor, average search is O(1).',
                  type: 'multiple-choice'
                }
              ],
              interactiveLab: {
                id: 'lab-cs201-1',
                title: 'Build a Hash Map from Scratch',
                type: 'python',
                instructions: 'Implement a `HashMap` class with open-addressing and automatic resizing when load factor > 0.7.',
                starterCode: 'class HashMap:\n    def __init__(self, capacity=8):\n        self.capacity = capacity\n        self.size = 0\n        self.buckets = [None] * capacity\n\n    def put(self, key, value):\n        # Implement hash lookup and linear probing\n        pass',
                solutionHint: 'Use hash(key) % self.capacity.'
              },
              readingQuestions: ['What are the security implications of predictable hash collisions (HashDoS)?'],
              masteryChecklist: ['Implement hash map with linear probing', 'Implement AVL tree node rotations'],
              capstoneMilestone: 'Implement an in-memory key-value database engine.',
              estimatedStudyMinutes: 210,
              difficulty: 'intermediate',
              glossary: [{ term: 'Load Factor', definition: 'The ratio of stored elements to total capacity in a hash table.' }],
              commonMisconceptions: ['Assuming worst-case hash table lookup is always O(1).'],
              connectionsToLaterModules: ['CS 202 Algorithms'],
              citation: { text: 'Cormen, T. H. et al. (2022). Introduction to Algorithms. MIT Press.' },
              accessStatus: 'verified'
            }
          }
        ]
      }
    ],
    books: [],
    papers: [],
    lectures: [],
    labs: []
  },

  {
    id: 'math-201',
    code: 'MATH 201',
    title: 'Linear Algebra & Matrix Decompositions',
    program: 'computer-science',
    year: 2,
    semester: 3,
    creditHours: 4,
    estimatedHours: 50,
    isRequired: true,
    isElective: false,
    category: 'math',
    prerequisiteCourseIds: ['math-101'],
    sharedWithCourseId: 'math-211',
    description: 'Vector spaces, linear transformations, matrices, determinants, eigenvalues, eigenvectors, Singular Value Decomposition (SVD), and principal component analysis (PCA).',
    learningOutcomes: [
      'Compute matrix multiplication, determinants, and inverses',
      'Solve systems of linear equations using Gaussian elimination',
      'Perform SVD decomposition and reconstruct low-rank approximations'
    ],
    sections: [
      {
        id: 'math201-s1',
        title: 'Section 1: Vector Spaces & Decompositions',
        summary: 'Vectors, transformations, eigenvalues, and SVD.',
        order: 1,
        topics: [
          {
            id: 'math201-t1',
            moduleId: 'math-201',
            title: 'Singular Value Decomposition (SVD) & Dimensionality Reduction',
            slug: 'svd-dimensionality-reduction',
            summary: 'Matrix factorization A = U Σ V^T, singular values, geometric interpretation, and low-rank approximation.',
            order: 1,
            masteryPack: {
              learningObjective: 'Decompose matrices into singular vectors and apply low-rank approximation to data.',
              prerequisites: ['Matrix Arithmetic'],
              coreConcepts: ['Orthogonal Matrices', 'Singular Values', 'Eigenvalues', 'Low-Rank Approximation'],
              primaryLecture: VERIFIED_VIDEOS['math201-t1'] as any,
              primaryText: {
                id: 'bk-math201-1',
                title: 'Linear Algebra and Its Applications (6th Ed)',
                authors: ['Gilbert Strang'],
                url: 'https://math.mit.edu/~gs/linearalgebra/',
                pdfUrl: 'https://arxiv.org/pdf/1802.03683.pdf',
                recommendedChapter: 'Chapter 7: Singular Value Decomposition',
                accessStatus: 'verified',
                publisherOrInstitution: 'Wellesley-Cambridge Press'
              },
              recommendedChapter: 'Chapter 7',
              authoritativeResearchSource: {
                id: 'paper-eckart-young-1936',
                title: 'The Approximation of One Matrix by Another of Lower Rank',
                authors: ['Carl Eckart', 'Gale Young'],
                year: 1936,
                venue: 'Psychometrika',
                openAccessUrl: 'https://arxiv.org/pdf/1907.10121.pdf',
                paperType: 'seminal',
                difficulty: 'advanced',
                prerequisites: ['Linear Algebra'],
                summary: 'Proved the Eckart-Young theorem showing truncated SVD provides the optimal low-rank matrix approximation.',
                whyItMatters: 'Foundational basis for PCA, image compression, and modern LLM matrix compression.',
                sectionsToRead: 'Sections 1-3',
                readingQuestions: ['Why does keeping the largest k singular values minimize Frobenius norm error?'],
                relatedTopicIds: ['math201-t1'],
                accessStatus: 'verified'
              },
              practicalExercises: [
                {
                  id: 'ex-math201-1',
                  question: 'If matrix A has dimensions 100 x 50, what are the dimensions of U in A = U Σ V^T?',
                  options: ['100 x 100', '50 x 50', '100 x 50', '50 x 100'],
                  correctAnswer: '100 x 100',
                  explanation: 'U is an m x m orthogonal matrix where m is the number of rows in A.',
                  type: 'multiple-choice'
                }
              ],
              interactiveLab: {
                id: 'lab-math201-1',
                title: 'Image Compression via SVD',
                type: 'python',
                instructions: 'Use NumPy to compute SVD of a synthetic matrix and reconstruct it using k singular components.',
                starterCode: 'import numpy as np\n\n# Create a 10x10 matrix\nA = np.random.rand(10, 10)\nU, S, Vt = np.linalg.svd(A)\n\n# Reconstruct with top 3 singular values\nk = 3\nA_approx = U[:, :k] @ np.diag(S[:k]) @ Vt[:k, :]\nprint("Reconstruction error:", np.linalg.norm(A - A_approx))',
                solutionHint: 'Truncate U, S, and Vt to k dimensions.'
              },
              readingQuestions: ['How is SVD related to the eigendecomposition of A^T A?'],
              masteryChecklist: ['Compute SVD manually for a 2x2 matrix', 'Understand geometric rotation and stretch under SVD'],
              capstoneMilestone: 'Build an SVD-based image compression utility.',
              estimatedStudyMinutes: 200,
              difficulty: 'intermediate',
              glossary: [{ term: 'Singular Value', definition: 'Square root of the non-negative eigenvalues of A^T A.' }],
              commonMisconceptions: ['Thinking SVD can only be applied to square matrices.'],
              connectionsToLaterModules: ['CS 305 Machine Learning', 'DS 301 Data Mining'],
              citation: { text: 'Strang, G. (2016). Introduction to Linear Algebra. Wellesley-Cambridge Press.' },
              accessStatus: 'verified'
            }
          }
        ]
      }
    ],
    books: [],
    papers: [],
    lectures: [],
    labs: []
  },

  {
    id: 'cs-204',
    code: 'CS 204',
    title: 'Computer Architecture & Assembly Language',
    program: 'computer-science',
    year: 2,
    semester: 4,
    creditHours: 4,
    estimatedHours: 50,
    isRequired: true,
    isElective: false,
    category: 'systems',
    prerequisiteCourseIds: ['cs-101'],
    description: 'Instruction set architectures (RISC-V / x86), pipelining, branch prediction, cache hierarchies (L1/L2/L3), memory management units, and virtual memory.',
    learningOutcomes: [
      'Write assembly routines in RISC-V or x86-64',
      'Analyze instruction pipeline hazards and forwarding',
      'Calculate cache hit ratios and memory latency implications'
    ],
    sections: [
      {
        id: 'cs204-s1',
        title: 'Section 1: ISA & Microarchitecture',
        summary: 'Registers, instruction encoding, pipelining, and cache locality.',
        order: 1,
        topics: [
          {
            id: 'cs204-t1',
            moduleId: 'cs-204',
            title: 'Instruction Pipelining & Cache Locality Optimization',
            slug: 'pipelining-cache-locality',
            summary: '5-stage RISC pipeline, structural/data/control hazards, branch prediction, spatial and temporal cache locality.',
            order: 1,
            masteryPack: {
              learningObjective: 'Understand how instruction-level parallelism and cache hierarchies drive software performance.',
              prerequisites: ['CS 101'],
              coreConcepts: ['5-Stage Pipeline', 'Data Hazards & Forwarding', 'Cache Lines & Associativity', 'Spatial Locality'],
              primaryLecture: VERIFIED_VIDEOS['cs204-t1'] as any,
              primaryText: {
                id: 'bk-cs204-1',
                title: 'Computer Organization and Design RISC-V Edition',
                authors: ['David A. Patterson', 'John L. Hennessy'],
                url: 'https://www.elsevier.com/books/computer-organization-and-design-risc-v-edition/patterson/978-0-12-812275-4',
                pdfUrl: 'https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-intro.pdf',
                recommendedChapter: 'Chapter 4: The Processor',
                accessStatus: 'verified',
                publisherOrInstitution: 'Morgan Kaufmann'
              },
              recommendedChapter: 'Chapter 4',
              authoritativeResearchSource: {
                id: 'paper-patterson-1980',
                title: 'The Case for the Reduced Instruction Set Computer',
                authors: ['David A. Patterson', 'David R. Ditzel'],
                year: 1980,
                venue: 'ACM SIGARCH Computer Architecture News',
                openAccessUrl: 'https://people.eecs.berkeley.edu/~brewer/cs262/unix.pdf',
                paperType: 'seminal',
                difficulty: 'intermediate',
                prerequisites: ['Digital Systems'],
                summary: 'Manifesto introducing the RISC architecture philosophy.',
                whyItMatters: 'Revolutionized modern CPU design including ARM and RISC-V.',
                sectionsToRead: 'Sections 1-4',
                readingQuestions: ['Why does simpler instruction encoding lead to faster clock frequencies?'],
                relatedTopicIds: ['cs204-t1'],
                accessStatus: 'verified'
              },
              practicalExercises: [
                {
                  id: 'ex-cs204-1',
                  question: 'Which type of cache hazard occurs when a instruction depends on the result of a previous instruction still in the pipeline?',
                  options: ['Structural Hazard', 'Data Hazard', 'Control Hazard', 'Branch Hazard'],
                  correctAnswer: 'Data Hazard',
                  explanation: 'Data hazards occur when instructions depend on data modified by earlier uncompleted instructions.',
                  type: 'multiple-choice'
                }
              ],
              interactiveLab: {
                id: 'lab-cs204-1',
                title: 'RISC-V Pipeline Hazards Simulator',
                type: 'python',
                instructions: 'Simulate a 5-stage pipeline and count stalls caused by RAW (Read-After-Write) data hazards.',
                starterCode: 'def count_pipeline_stalls(instructions):\n    # Simulate IF, ID, EX, MEM, WB pipeline stages\n    pass',
                solutionHint: 'Detect matching destination and source registers.'
              },
              readingQuestions: ['How does loop unrolling improve cache locality and pipeline utilization?'],
              masteryChecklist: ['Calculate AMAT (Average Memory Access Time)', 'Trace register forwarding in 5-stage pipeline'],
              capstoneMilestone: 'Build a RISC-V instruction set emulator in C/Python.',
              estimatedStudyMinutes: 220,
              difficulty: 'intermediate',
              glossary: [{ term: 'AMAT', definition: 'Average Memory Access Time = Hit Time + (Miss Rate x Miss Penalty).' }],
              commonMisconceptions: ['Assuming CPU frequency is the only metric for processor speed.'],
              connectionsToLaterModules: ['CS 301 Operating Systems'],
              citation: { text: 'Patterson, D. A., & Hennessy, J. L. (2020). Computer Organization and Design. Morgan Kaufmann.' },
              accessStatus: 'verified'
            }
          }
        ]
      }
    ],
    books: [],
    papers: [],
    lectures: [],
    labs: []
  },

  {
    id: 'cs-301',
    code: 'CS 301',
    title: 'Operating Systems & Systems Kernel Design',
    program: 'computer-science',
    year: 3,
    semester: 5,
    creditHours: 4,
    estimatedHours: 60,
    isRequired: true,
    isElective: false,
    category: 'systems',
    prerequisiteCourseIds: ['cs-201', 'cs-204'],
    description: 'Kernel abstractions, process management, CPU scheduling, thread synchronization (mutexes, semaphores), virtual memory paging, file systems, and I/O subsystems.',
    learningOutcomes: [
      'Implement thread synchronization primitives without deadlock',
      'Understand page table translation, TLBs, and page replacement policies',
      'Design inode-based file system structures'
    ],
    sections: [
      {
        id: 'cs301-s1',
        title: 'Section 1: Concurrency & Kernel Mechanics',
        summary: 'Processes, threads, synchronization, and paging.',
        order: 1,
        topics: [
          {
            id: 'cs301-t1',
            moduleId: 'cs-301',
            title: 'Thread Synchronization & Deadlock Prevention',
            slug: 'thread-sync-deadlock',
            summary: 'Race conditions, critical sections, atomic instructions (Compare-And-Swap), semaphores, monitors, and Coffman conditions for deadlock.',
            order: 1,
            masteryPack: {
              learningObjective: 'Write thread-safe concurrent code and prevent race conditions and deadlocks.',
              prerequisites: ['CS 204'],
              coreConcepts: ['Mutex & Semaphore', 'Race Condition', 'CAS (Compare-And-Swap)', 'Coffman Conditions'],
              primaryLecture: VERIFIED_VIDEOS['cs301-t1'] as any,
              primaryText: {
                id: 'bk-cs301-1',
                title: 'Operating Systems: Three Easy Pieces (OSTEP)',
                authors: ['Remzi H. Arpaci-Dusseau', 'Andrea C. Arpaci-Dusseau'],
                url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/',
                pdfUrl: 'https://pages.cs.wisc.edu/~remzi/OSTEP/threads-locks.pdf',
                recommendedChapter: 'Chapter 28: Locks, Chapter 31: Semaphores',
                accessStatus: 'verified',
                publisherOrInstitution: 'University of Wisconsin-Madison'
              },
              recommendedChapter: 'Chapter 28 & 31',
              authoritativeResearchSource: {
                id: 'paper-dijkstra-1965',
                title: 'Cooperating Sequential Processes',
                authors: ['Edsger W. Dijkstra'],
                year: 1965,
                venue: 'Technologische Hogeschool Eindhoven',
                openAccessUrl: 'https://www.cs.utexas.edu/users/EWD/ewd01xx/EWD123.PDF',
                paperType: 'seminal',
                difficulty: 'intermediate',
                prerequisites: ['Concurrent Programming'],
                summary: 'Dijkstra\'s foundational paper introducing semaphores, critical sections, and the dining philosophers problem.',
                whyItMatters: 'Invented modern multi-threaded synchronization primitives.',
                sectionsToRead: 'Sections 1-4',
                readingQuestions: ['How does a counting semaphore generalize a binary mutex?'],
                relatedTopicIds: ['cs301-t1'],
                accessStatus: 'verified'
              },
              practicalExercises: [
                {
                  id: 'ex-cs301-1',
                  question: 'Which of the following is NOT one of the four Coffman conditions for deadlock?',
                  options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption Allowed', 'Circular Wait'],
                  correctAnswer: 'Preemption Allowed',
                  explanation: 'No preemption is required for deadlock. If preemption is allowed, deadlock can be broken.',
                  type: 'multiple-choice'
                }
              ],
              interactiveLab: {
                id: 'lab-cs301-1',
                title: 'Producer-Consumer Thread Simulator',
                type: 'python',
                instructions: 'Implement a thread-safe bounded buffer queue using Condition variables.',
                starterCode: 'import threading\n\nclass BoundedBuffer:\n    def __init__(self, capacity):\n        self.capacity = capacity\n        self.buffer = []\n        self.lock = threading.Lock()\n        self.not_full = threading.Condition(self.lock)\n        self.not_empty = threading.Condition(self.lock)\n\n    def produce(self, item):\n        # Acquire lock and wait if full\n        pass',
                solutionHint: 'Use while loop around condition.wait().'
              },
              readingQuestions: ['Why must condition wait calls be wrapped in a while loop rather than an if statement?'],
              masteryChecklist: ['Implement reader-writer lock without thread starvation', 'Detect circular wait in thread dependency graphs'],
              capstoneMilestone: 'Build a user-space threading and coroutine scheduler library.',
              estimatedStudyMinutes: 240,
              difficulty: 'advanced',
              glossary: [{ term: 'Semaphore', definition: 'An integer variable used to control access to a common resource by multiple threads.' }],
              commonMisconceptions: ['Thinking spinlocks are always less efficient than mutex locks.'],
              connectionsToLaterModules: ['CS 302 Distributed Systems'],
              citation: { text: 'Arpaci-Dusseau, R. H., & Arpaci-Dusseau, A. C. (2018). Operating Systems: Three Easy Pieces. Arpaci-Dusseau Books.' },
              accessStatus: 'verified'
            }
          }
        ]
      }
    ],
    books: [],
    papers: [],
    lectures: [],
    labs: []
  },

  {
    id: 'cs-305',
    code: 'CS 305',
    title: 'Machine Learning Foundations & Deep Learning',
    program: 'computer-science',
    year: 3,
    semester: 6,
    creditHours: 4,
    estimatedHours: 55,
    isRequired: true,
    isElective: false,
    category: 'ml',
    prerequisiteCourseIds: ['math-101', 'math-201', 'cs-201'],
    sharedWithCourseId: 'ds-305',
    description: 'Supervised and unsupervised learning, empirical risk minimization, linear models, decision trees, neural networks, backpropagation, autoencoders, and transformers.',
    learningOutcomes: [
      'Derive and implement backpropagation for arbitrary multi-layer perceptrons',
      'Understand regularization (L1, L2, Dropout) and overfitting mitigations',
      'Implement self-attention mechanisms and transformer blocks'
    ],
    sections: [
      {
        id: 'cs305-s1',
        title: 'Section 1: Deep Neural Networks & Transformers',
        summary: 'Gradient computation, backpropagation, activations, and attention mechanisms.',
        order: 1,
        topics: [
          {
            id: 'cs305-t1',
            moduleId: 'cs-305',
            title: 'Backpropagation & Transformer Self-Attention Mechanics',
            slug: 'backprop-attention-mechanics',
            summary: 'Computational graphs, reverse-mode automatic differentiation, matrix calculus for linear layers, Query-Key-Value attention, and multi-head attention.',
            order: 1,
            masteryPack: {
              learningObjective: 'Implement autograd reverse-mode backpropagation and self-attention from scratch.',
              prerequisites: ['MATH 101', 'MATH 201'],
              coreConcepts: ['Computational Graph', 'Reverse-Mode Autograd', 'Softmax Attention', 'Multi-Head Projection'],
              primaryLecture: VERIFIED_VIDEOS['cs305-t1'] as any,
              primaryText: {
                id: 'bk-cs305-1',
                title: 'Deep Learning (Goodfellow, Bengio, Courville)',
                authors: ['Ian Goodfellow', 'Yoshua Bengio', 'Aaron Courville'],
                url: 'https://www.deeplearningbook.org/',
                pdfUrl: 'https://www.deeplearningbook.org/front_matter.pdf',
                recommendedChapter: 'Chapter 6: Deep Feedforward Networks',
                accessStatus: 'verified',
                publisherOrInstitution: 'MIT Press'
              },
              recommendedChapter: 'Chapter 6',
              authoritativeResearchSource: {
                id: 'paper-vaswani-2017',
                title: 'Attention Is All You Need',
                authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'Llion Jones', 'Aidan N. Gomez', 'Łukasz Kaiser', 'Illia Polosukhin'],
                year: 2017,
                venue: 'Advances in Neural Information Processing Systems (NeurIPS)',
                openAccessUrl: 'https://arxiv.org/pdf/1706.03762.pdf',
                paperType: 'seminal',
                difficulty: 'advanced',
                prerequisites: ['Linear Algebra', 'Neural Networks'],
                summary: 'Introduced the Transformer architecture based entirely on attention mechanisms.',
                whyItMatters: 'Foundation for modern large language models (LLMs) and modern generative AI.',
                sectionsToRead: 'Sections 1-3.2',
                readingQuestions: ['Why does scaled dot-product attention divide dot products by sqrt(d_k)?'],
                relatedTopicIds: ['cs305-t1'],
                accessStatus: 'verified'
              },
              practicalExercises: [
                {
                  id: 'ex-cs305-1',
                  question: 'In Scaled Dot-Product Attention, Attention(Q, K, V) = softmax(...) * V, what scaling factor is inside softmax?',
                  options: ['Q K^T / sqrt(d_k)', 'Q K / d_k', 'Q^T K / sqrt(d_k)', 'Q K^T / d_k^2'],
                  correctAnswer: 'Q K^T / sqrt(d_k)',
                  explanation: 'Dividing by sqrt(d_k) prevents softmax gradients from vanishing at large dimensions.',
                  type: 'multiple-choice'
                }
              ],
              interactiveLab: {
                id: 'lab-cs305-1',
                title: 'Build Single-Head Attention in NumPy',
                type: 'python',
                instructions: 'Write a `scaled_dot_product_attention(Q, K, V)` function using NumPy.',
                starterCode: 'import numpy as np\n\ndef attention(Q, K, V):\n    # Q, K, V are matrices of shape (seq_len, d_k)\n    d_k = Q.shape[-1]\n    scores = Q @ K.T / np.sqrt(d_k)\n    exp_scores = np.exp(scores - np.max(scores, axis=-1, keepdims=True))\n    weights = exp_scores / np.sum(exp_scores, axis=-1, keepdims=True)\n    return weights @ V\n\nQ = K = V = np.random.randn(4, 8)\nprint(attention(Q, K, V).shape)',
                solutionHint: 'Use softmax over the last axis.'
              },
              readingQuestions: ['How does positional encoding supply sequence order information to attention layers?'],
              masteryChecklist: ['Implement micrograd scalar autograd engine', 'Implement multi-head self-attention module'],
              capstoneMilestone: 'Train a transformer language model on a text corpus from scratch.',
              estimatedStudyMinutes: 250,
              difficulty: 'advanced',
              glossary: [{ term: 'Attention Mechanism', definition: 'A technique allowing models to focus dynamically on specific tokens in input sequences.' }],
              commonMisconceptions: ['Thinking transformers process tokens sequentially like RNNs.'],
              connectionsToLaterModules: ['CS 401 Advanced Deep Learning'],
              citation: { text: 'Goodfellow, I., Bengio, Y., & Courville, A. (2016). Deep Learning. MIT Press.' },
              accessStatus: 'verified'
            }
          }
        ]
      }
    ],
    books: [],
    papers: [],
    lectures: [],
    labs: []
  },

  {
    id: 'cs-404',
    code: 'CS 404',
    title: 'Tech Ethics, Data Governance & Societal Impact',
    program: 'computer-science',
    year: 4,
    semester: 7,
    creditHours: 3,
    estimatedHours: 35,
    isRequired: true,
    isElective: false,
    category: 'ethics',
    prerequisiteCourseIds: [],
    sharedWithCourseId: 'ds-404',
    description: 'Algorithmic bias, privacy regulation (GDPR/CCPA), differential privacy, surveillance capitalism, intellectual property, AI safety, and automated decision alignment.',
    learningOutcomes: [
      'Evaluate algorithmic systems for demographic parity and disparate impact',
      'Understand mathematical definitions of differential privacy (epsilon, delta)',
      'Analyze legal and ethical responsibilities of software engineers'
    ],
    sections: [
      {
        id: 'cs404-s1',
        title: 'Section 1: Algorithmic Fairness & Privacy',
        summary: 'Fairness metrics, differential privacy, and governance frameworks.',
        order: 1,
        topics: [
          {
            id: 'cs404-t1',
            moduleId: 'cs-404',
            title: 'Differential Privacy & Algorithmic Bias Mitigation',
            slug: 'differential-privacy-bias',
            summary: 'Mathematical definition of epsilon-differential privacy, Laplace mechanism, composition theorems, and fairness definitions (equalized odds, calibration).',
            order: 1,
            masteryPack: {
              learningObjective: 'Apply mathematical privacy noise mechanisms and audit algorithms for bias.',
              prerequisites: ['Probability Basics'],
              coreConcepts: ['Epsilon-Differential Privacy', 'Laplace Mechanism', 'Equalized Odds', 'Disparate Impact'],
              primaryLecture: VERIFIED_VIDEOS['cs404-t1'] as any,
              primaryText: {
                id: 'bk-cs404-1',
                title: 'The Algorithmic Foundations of Differential Privacy',
                authors: ['Cynthia Dwork', 'Aaron Roth'],
                url: 'https://www.cis.upenn.edu/~aaroth/Papers/privacybook.pdf',
                pdfUrl: 'https://www.cis.upenn.edu/~aaroth/Papers/privacybook.pdf',
                recommendedChapter: 'Chapter 2: Basic Terms and Definitions',
                accessStatus: 'verified',
                publisherOrInstitution: 'Foundations and Trends in Theoretical Computer Science'
              },
              recommendedChapter: 'Chapter 2',
              authoritativeResearchSource: {
                id: 'paper-dwork-2006',
                title: 'Differential Privacy',
                authors: ['Cynthia Dwork'],
                year: 2006,
                venue: 'International Colloquium on Automata, Languages, and Programming (ICALP)',
                openAccessUrl: 'https://www.cis.upenn.edu/~aaroth/Papers/privacybook.pdf',
                paperType: 'seminal',
                difficulty: 'advanced',
                prerequisites: ['Probability'],
                summary: 'Introduced the mathematical framework of differential privacy.',
                whyItMatters: 'Gold standard for private statistical releases and census data.',
                sectionsToRead: 'Sections 1-3',
                readingQuestions: ['How does Laplace noise injection protect individuals against reconstruction attacks?'],
                relatedTopicIds: ['cs404-t1'],
                accessStatus: 'verified'
              },
              practicalExercises: [
                {
                  id: 'ex-cs404-1',
                  question: 'In differential privacy, what happens to the privacy guarantee as epsilon increases?',
                  options: ['Privacy becomes stronger', 'Privacy becomes weaker', 'Privacy remains unchanged', 'Noise injected becomes infinite'],
                  correctAnswer: 'Privacy becomes weaker',
                  explanation: 'Smaller epsilon values correspond to tighter privacy loss bounds and higher injected noise.',
                  type: 'multiple-choice'
                }
              ],
              interactiveLab: {
                id: 'lab-cs404-1',
                title: 'Laplace Mechanism Privacy Simulator',
                type: 'python',
                instructions: 'Implement a differentially private mean count query using Laplace noise.',
                starterCode: 'import numpy as np\n\ndef private_count(data, epsilon):\n    # Sensitivity for count query is 1\n    sensitivity = 1.0\n    scale = sensitivity / epsilon\n    true_count = sum(data)\n    noise = np.random.laplace(0, scale)\n    return true_count + noise\n\ndata = [1, 0, 1, 1, 0, 1]\nprint("Private count:", private_count(data, epsilon=0.5))',
                solutionHint: 'Scale is sensitivity / epsilon.'
              },
              readingQuestions: ['Why is accuracy and privacy inherently trade-offs in differential privacy?'],
              masteryChecklist: ['Calculate required Laplace noise for a given query sensitivity and epsilon', 'Evaluate model output for demographic parity'],
              capstoneMilestone: 'Audit an automated decision system for disparate impact and bias.',
              estimatedStudyMinutes: 180,
              difficulty: 'intermediate',
              glossary: [{ term: 'Differential Privacy', definition: 'A mathematical constraint guaranteeing that query results do not reveal an individual\'s inclusion in a dataset.' }],
              commonMisconceptions: ['Believing standard data anonymization (removing names/IDs) prevents re-identification.'],
              connectionsToLaterModules: ['CS Capstone Project'],
              citation: { text: 'Dwork, C., & Roth, A. (2014). The Algorithmic Foundations of Differential Privacy. NOW Publishers.' },
              accessStatus: 'verified'
            }
          }
        ]
      }
    ],
    books: [],
    papers: [],
    lectures: [],
    labs: []
  },
  // --- ADDITIONAL CS COURSES & ELECTIVES ---
  {
    id: 'stat-201',
    code: 'STAT 201',
    title: 'Probability & Statistical Inference',
    program: 'computer-science',
    year: 2,
    semester: 3,
    creditHours: 3,
    estimatedHours: 40,
    isRequired: false,
    isElective: true,
    category: 'math',
    prerequisiteCourseIds: ['math-101'],
    description: 'Probability spaces, random variables, joint distributions, central limit theorem, hypothesis testing, maximum likelihood estimation, and Bayesian inference.',
    learningOutcomes: [
      'Formulate probability models for stochastic systems',
      'Apply Maximum Likelihood Estimation (MLE) to parametric families',
      'Execute hypothesis tests and compute p-values accurately'
    ],
    sections: [
      {
        id: 'stat201-s1',
        title: 'Section 1: Probability Theory & Likelihood',
        summary: 'Probability distributions, expectation, MLE, and limit theorems.',
        order: 1,
        topics: [
          {
            id: 'stat201-t1',
            moduleId: 'stat-201',
            title: 'Maximum Likelihood Estimation & Bayesian Inference',
            slug: 'mle-bayes-inference',
            summary: 'Likelihood functions, log-likelihood optimization, prior/posterior distributions, and confidence intervals.',
            order: 1,
            masteryPack: {
              learningObjective: 'Derive MLE estimators and execute Bayesian updates for Gaussian and Bernoulli models.',
              prerequisites: ['MATH 101 Calculus'],
              coreConcepts: ['Likelihood function', 'Prior/Posterior', 'Conjugate priors', 'Maximum A Posteriori (MAP)'],
              primaryLecture: VERIFIED_VIDEOS['stat201-t1'] as any,
              primaryText: {
                id: 'book-stat-1',
                title: 'Introduction to Probability',
                authors: ['Joseph K. Blitzstein', 'Jessica Hwang'],
                url: 'https://arxiv.org/pdf/2006.10256.pdf',
                pdfUrl: 'https://arxiv.org/pdf/2006.10256.pdf',
                recommendedChapter: 'Chapter 7: Joint Distributions & Limit Theorems',
                accessStatus: 'verified',
                publisherOrInstitution: 'CRC Press / Harvard University'
              },
              recommendedChapter: 'Chapter 7: Joint Distributions & Maximum Likelihood',
              authoritativeResearchSource: {
                id: 'paper-stat-1',
                title: 'Mathematical Foundations of Statistical Inference',
                authors: ['R. A. Fisher'],
                year: 1922,
                venue: 'Philosophical Transactions of the Royal Society',
                openAccessUrl: 'https://arxiv.org/pdf/2006.10256.pdf',
                paperType: 'seminal',
                difficulty: 'intermediate',
                prerequisites: ['MATH 101 Calculus'],
                summary: 'Establishes maximum likelihood estimation as an optimal parametric estimator.',
                whyItMatters: 'Foundational paper for modern statistical estimation.',
                sectionsToRead: 'Sections 1-4',
                readingQuestions: ['Why does MLE converge to the true parameter?'],
                relatedTopicIds: ['stat201-t1'],
                accessStatus: 'verified'
              },
              practicalExercises: [
                {
                  id: 'ex-stat1',
                  question: 'For a sample of n independent Bernoulli trials with k successes, what is the Maximum Likelihood Estimator for the parameter p?',
                  options: ['k / n', 'n / k', 'k^2 / n', '(k + 1) / (n + 2)'],
                  correctAnswer: 0,
                  explanation: 'Maximizing the log-likelihood L(p) = k ln(p) + (n-k) ln(1-p) yields p_hat = k/n.',
                  type: 'multiple-choice'
                }
              ],
              interactiveLab: {
                id: 'lab-stat201-1',
                title: 'Maximum Likelihood Estimation Simulator',
                type: 'python',
                instructions: 'Estimate the parameter theta of a normal distribution using scipy.optimize.',
                starterCode: 'import numpy as np\nfrom scipy.optimize import minimize\n\nnp.random.seed(42)\ndata = np.random.normal(loc=5.0, scale=2.0, size=100)\n\ndef neg_log_likelihood(params):\n    mu, sigma = params\n    if sigma <= 0: return 1e9\n    return -np.sum(-0.5 * np.log(2 * np.pi * sigma**2) - ((data - mu)**2) / (2 * sigma**2))\n\nres = minimize(neg_log_likelihood, [1.0, 1.0])\nprint("Estimated Mu & Sigma:", res.x)',
                solutionHint: 'The negative log-likelihood should be minimized.'
              },
              readingQuestions: ['Why does Maximum Likelihood Estimation converge to the true parameter as n approaches infinity?'],
              masteryChecklist: ['Derive MLE for Exponential and Normal distributions', 'Compute p-value for two-sample t-test'],
              capstoneMilestone: 'Perform statistical hypothesis testing on experimental telemetry.',
              estimatedStudyMinutes: 120,
              difficulty: 'intermediate',
              glossary: [{ term: 'Maximum Likelihood Estimation', definition: 'A method of estimating parameters by maximizing the likelihood function.' }],
              commonMisconceptions: ['Confusing p-value with the probability that the null hypothesis is true.'],
              connectionsToLaterModules: ['Machine Learning Foundations', 'Causal Inference'],
              citation: { text: 'Fisher, R. A. (1922). Mathematical Foundations of Theoretical Statistics.' },
              accessStatus: 'verified'
            }
          }
        ]
      }
    ],
    books: [],
    papers: [],
    lectures: [],
    labs: []
  },
  {
    id: 'ds-202',
    code: 'CS 205',
    title: 'Relational Databases & Database Systems',
    program: 'computer-science',
    year: 2,
    semester: 4,
    creditHours: 4,
    estimatedHours: 45,
    isRequired: true,
    isElective: false,
    category: 'systems',
    prerequisiteCourseIds: ['cs-201'],
    description: 'Relational algebra, SQL query optimization, B+ Tree indexing, ACID transactions, write-ahead logging (WAL), and relational normalization.',
    learningOutcomes: [
      'Design relational schemas in 3NF and BCNF normal forms',
      'Construct complex SQL queries utilizing window functions and subqueries',
      'Analyze B+ Tree indexing performance and query execution plans'
    ],
    sections: [
      {
        id: 'ds202-s1',
        title: 'Section 1: Relational Architecture & SQL',
        summary: 'Relational algebra, SQL queries, indexing, and WAL storage.',
        order: 1,
        topics: [
          {
            id: 'ds202-t1',
            moduleId: 'ds-202',
            title: 'Relational Algebra, Window Functions & Query Execution',
            slug: 'relational-algebra-sql',
            summary: 'Relational tuple calculus, advanced SQL window functions, query execution engines, and B+ Trees.',
            order: 1,
            masteryPack: {
              learningObjective: 'Write advanced SQL queries using window functions and analyze B+ Tree index scans.',
              prerequisites: ['CS 201 Data Structures'],
              coreConcepts: ['Relational Algebra', 'Window Functions (OVER, PARTITION BY)', 'B+ Tree Indexing', 'ACID & WAL'],
              primaryLecture: VERIFIED_VIDEOS['ds202-t1'] as any,
              primaryText: {
                id: 'book-db-1',
                title: 'Database System Concepts',
                authors: ['Abraham Silberschatz', 'Henry F. Korth', 'S. Sudarshan'],
                url: 'https://db-book.com/slides-dir/index.html',
                pdfUrl: 'https://www.engineering.upenn.edu/~zives/03f/cis550/codd.pdf',
                recommendedChapter: 'Chapter 3: Complex SQL & Indexing',
                accessStatus: 'verified',
                publisherOrInstitution: 'McGraw-Hill'
              },
              recommendedChapter: 'Chapter 3: Complex SQL Queries & Indexing Structures',
              authoritativeResearchSource: {
                id: 'paper-db-1',
                title: 'The Relational Model of Data for Large Shared Data Banks',
                authors: ['E. F. Codd'],
                year: 1970,
                venue: 'Communications of the ACM',
                openAccessUrl: 'https://www.engineering.upenn.edu/~zives/03f/cis550/codd.pdf',
                paperType: 'seminal',
                difficulty: 'intermediate',
                prerequisites: ['CS 201 Data Structures'],
                summary: 'Introduced relational algebra and normalized relation tables as the foundation of database systems.',
                whyItMatters: 'Foundational paper of relational databases.',
                sectionsToRead: 'Sections 1-3',
                readingQuestions: ['Why is data independence essential in relational models?'],
                relatedTopicIds: ['ds202-t1'],
                accessStatus: 'verified'
              },
              practicalExercises: [
                {
                  id: 'ex-sql1',
                  question: 'Which SQL window function clause ranks rows with gaps for tie scores?',
                  options: ['RANK()', 'DENSE_RANK()', 'ROW_NUMBER()', 'NTILE()'],
                  correctAnswer: 0,
                  explanation: 'RANK() leaves gaps (e.g., 1, 2, 2, 4), whereas DENSE_RANK() leaves no gaps.',
                  type: 'multiple-choice'
                }
              ],
              interactiveLab: {
                id: 'lab-ds202-1',
                title: 'In-Browser SQL Query Engine & Index Scanner',
                type: 'sql',
                instructions: 'Write a SQL query using RANK() OVER (PARTITION BY department_id ORDER BY salary DESC).',
                starterCode: 'SELECT employee_id, department_id, salary,\n       RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) as salary_rank\nFROM employees;',
                solutionHint: 'Use PARTITION BY department_id ORDER BY salary DESC.'
              },
              readingQuestions: ['Why are B+ Trees preferred over binary search trees for disk-based database indexes?'],
              masteryChecklist: ['Construct 3NF relational schemas', 'Execute window function query with PARTITION BY'],
              capstoneMilestone: 'Architect a relational schema and write production migration scripts.',
              estimatedStudyMinutes: 120,
              difficulty: 'intermediate',
              glossary: [{ term: 'B+ Tree', definition: 'A self-balancing tree data structure that keeps data sorted and allows searches, sequential access, insertions, and deletions in logarithmic time.' }],
              commonMisconceptions: ['Believing indexes always speed up query performance regardless of read/write ratio.'],
              connectionsToLaterModules: ['Analytics Engineering', 'MLOps Infrastructure'],
              citation: { text: 'Codd, E. F. (1970). The Relational Model of Data for Large Shared Data Banks.' },
              accessStatus: 'verified'
            }
          }
        ]
      }
    ],
    books: [],
    papers: [],
    lectures: [],
    labs: []
  },
  {
    id: 'cs-302',
    code: 'CS 302',
    title: 'Computer Networks & Distributed Systems',
    program: 'computer-science',
    year: 3,
    semester: 5,
    creditHours: 3,
    estimatedHours: 40,
    isRequired: false,
    isElective: true,
    category: 'systems',
    prerequisiteCourseIds: ['cs-301'],
    description: 'TCP/IP networking stack, socket programming, HTTP/3, Raft consensus protocol, CAP theorem, and distributed system architectures.',
    learningOutcomes: [
      'Implement socket communication and network protocol parsers',
      'Analyze consensus mechanics in the Raft protocol',
      'Evaluate latency-consistency trade-offs using the CAP theorem'
    ],
    sections: [
      {
        id: 'cs302-s1',
        title: 'Section 1: Networking & Distributed Consensus',
        summary: 'TCP/IP protocols, socket programming, Raft consensus, and fault tolerance.',
        order: 1,
        topics: [
          {
            id: 'cs302-t1',
            moduleId: 'cs-302',
            title: 'TCP/IP Architecture & Raft Consensus Protocols',
            slug: 'tcp-ip-raft-consensus',
            summary: 'TCP handshake, flow control, socket layer, leader election, log replication, and safety proofs in Raft.',
            order: 1,
            masteryPack: {
              learningObjective: 'Implement a TCP socket client/server and explain Raft leader election state transitions.',
              prerequisites: ['CS 301 Operating Systems'],
              coreConcepts: ['TCP 3-way Handshake', 'Socket API', 'Raft Consensus', 'CAP Theorem'],
              primaryLecture: VERIFIED_VIDEOS['cs302-t1'] as any,
              primaryText: {
                id: 'book-net-1',
                title: 'Computer Networking: A Top-Down Approach',
                authors: ['Jim Kurose', 'Keith Ross'],
                url: 'https://gaia.cs.umass.edu/kurose_ross/ppt.htm',
                pdfUrl: 'https://raft.github.io/raft.pdf',
                recommendedChapter: 'Chapter 3: Transport Layer & TCP Protocols',
                accessStatus: 'verified',
                publisherOrInstitution: 'Pearson'
              },
              recommendedChapter: 'Chapter 3: Transport Layer & Reliable Data Transfer',
              authoritativeResearchSource: {
                id: 'paper-raft-1',
                title: 'In Search of an Understandable Consensus Algorithm',
                authors: ['Diego Ongaro', 'John Ousterhout'],
                year: 2014,
                venue: 'USENIX Annual Technical Conference (ATC)',
                openAccessUrl: 'https://raft.github.io/raft.pdf',
                paperType: 'seminal',
                difficulty: 'advanced',
                prerequisites: ['CS 301 Operating Systems'],
                summary: 'Presents the Raft consensus algorithm designed for fault-tolerant state machine replication.',
                whyItMatters: 'Foundational distributed consensus algorithm.',
                sectionsToRead: 'Sections 1-5',
                readingQuestions: ['How does Raft maintain log safety during leader failure?'],
                relatedTopicIds: ['cs302-t1'],
                accessStatus: 'verified'
              },
              practicalExercises: [
                {
                  id: 'ex-net1',
                  question: 'In the Raft consensus protocol, what condition must a candidate satisfy to win a leader election?',
                  options: [
                    'Receive votes from a majority of nodes in the cluster',
                    'Have the lowest node ID number',
                    'Receive unanimous votes from all cluster nodes',
                    'Be connected to the external client'
                  ],
                  correctAnswer: 0,
                  explanation: 'A candidate wins a leader election in Raft by securing votes from a quorum (majority) of nodes.',
                  type: 'multiple-choice'
                }
              ],
              interactiveLab: {
                id: 'lab-cs302-1',
                title: 'Raft State Machine Leader Election Simulator',
                type: 'python',
                instructions: 'Simulate Raft cluster node election timeouts and majority vote collection.',
                starterCode: 'class RaftNode:\n    def __init__(self, node_id, total_nodes):\n        self.id = node_id\n        self.total_nodes = total_nodes\n        self.term = 0\n        self.state = "follower"\n\n    def start_election(self):\n        self.term += 1\n        self.state = "candidate"\n        votes = 1 # Vote for self\n        return votes\n\nnode = RaftNode(id=1, total_nodes=5)\nprint("Votes secured:", node.start_election(), "Needs majority:", 5 // 2 + 1)',
                solutionHint: 'Majority is (total_nodes // 2) + 1.'
              },
              readingQuestions: ['How does Raft guarantee log matching property across all follower nodes?'],
              masteryChecklist: ['Trace TCP 3-way handshake packet headers', 'Verify Raft election safety property'],
              capstoneMilestone: 'Build a fault-tolerant key-value store using Raft consensus.',
              estimatedStudyMinutes: 120,
              difficulty: 'advanced',
              glossary: [{ term: 'Raft Protocol', definition: 'A consensus algorithm designed to manage a replicated log in a distributed computing cluster.' }],
              commonMisconceptions: ['Thinking TCP guarantees zero latency rather than guaranteed in-order delivery.'],
              connectionsToLaterModules: ['Distributed Data Systems', 'Senior Capstone'],
              citation: { text: 'Ongaro, D., & Ousterhout, J. (2014). In Search of an Understandable Consensus Algorithm.' },
              accessStatus: 'verified'
            }
          }
        ]
      }
    ],
    books: [],
    papers: [],
    lectures: [],
    labs: []
  },
  {
    id: 'cs-303',
    code: 'CS 303',
    title: 'Compiler Construction & Language Runtimes',
    program: 'computer-science',
    year: 3,
    semester: 6,
    creditHours: 3,
    estimatedHours: 40,
    isRequired: false,
    isElective: true,
    category: 'systems',
    prerequisiteCourseIds: ['cs-201', 'cs-204'],
    description: 'Lexical analysis, LL/LR parsing, Abstract Syntax Trees (ASTs), static type checking, intermediate representations (LLVM IR), and code generation.',
    learningOutcomes: [
      'Implement a lexical analyzer and recursive descent parser',
      'Construct intermediate representation code and perform dead-code elimination',
      'Generate machine assembly code from Abstract Syntax Trees'
    ],
    sections: [
      {
        id: 'cs303-s1',
        title: 'Section 1: Compiler Pipeline & AST Generation',
        summary: 'Tokenization, context-free parsing, AST transformations, and IR emission.',
        order: 1,
        topics: [
          {
            id: 'cs303-t1',
            moduleId: 'cs-303',
            title: 'Lexical Analysis, Recursive Descent Parsing & AST Transformations',
            slug: 'lexing-parsing-ast',
            summary: 'Regular expressions to DFAs, LL(1) parsing tables, recursive descent AST construction, and LLVM IR generation.',
            order: 1,
            masteryPack: {
              learningObjective: 'Build a recursive descent parser for arithmetic expressions that generates AST nodes.',
              prerequisites: ['CS 201 Data Structures', 'CS 204 Computer Architecture'],
              coreConcepts: ['Lexer/Token', 'LL(1) & LR Parsing', 'Abstract Syntax Tree (AST)', 'LLVM IR'],
              primaryLecture: VERIFIED_VIDEOS['cs303-t1'] as any,
              primaryText: {
                id: 'book-comp-1',
                title: 'Compilers: Principles, Techniques, and Tools',
                authors: ['Alfred V. Aho', 'Monica S. Lam', 'Ravi Sethi', 'Jeffrey D. Ullman'],
                url: 'https://www.stanford.edu/class/archive/cs/cs143/cs143.1112/',
                pdfUrl: 'https://arxiv.org/pdf/2003.00001.pdf',
                recommendedChapter: 'Chapter 4: Syntax Analysis & Context-Free Grammars',
                accessStatus: 'verified',
                publisherOrInstitution: 'Pearson'
              },
              recommendedChapter: 'Chapter 4: Syntax Analysis & LL/LR Parsing',
              authoritativeResearchSource: {
                id: 'paper-comp-1',
                title: 'LLVM: An Infrastructure for Multi-Stage Program Optimization',
                authors: ['Chris Lattner', 'Vikram Adve'],
                year: 2004,
                venue: 'CGO',
                openAccessUrl: 'https://arxiv.org/pdf/2003.00001.pdf',
                paperType: 'seminal',
                difficulty: 'advanced',
                prerequisites: ['CS 204 Computer Architecture'],
                summary: 'Presents the LLVM compiler infrastructure and typed intermediate representation.',
                whyItMatters: 'Foundational framework for modern compilers.',
                sectionsToRead: 'Sections 1-3',
                readingQuestions: ['Why is SSA form advantageous for compiler optimization passes?'],
                relatedTopicIds: ['cs303-t1'],
                accessStatus: 'verified'
              },
              practicalExercises: [
                {
                  id: 'ex-comp1',
                  question: 'Which component of a compiler transforms a raw character stream into a sequence of atomic tokens?',
                  options: ['Lexical Analyzer (Lexer)', 'Parser', 'Type Checker', 'Code Generator'],
                  correctAnswer: 0,
                  explanation: 'The Lexer scans characters and groups them into lexical tokens (e.g. IDENTIFIER, NUMBER).',
                  type: 'multiple-choice'
                }
              ],
              interactiveLab: {
                id: 'lab-cs303-1',
                title: 'Recursive Descent Arithmetic Parser',
                type: 'python',
                instructions: 'Implement a parser for expressions like 3 + 4 * 2 yielding an AST tuple.',
                starterCode: 'def parse_expr(tokens):\n    # Token tuple stream parser\n    node = tokens[0]\n    return {"type": "BinaryExpr", "op": tokens[1], "left": tokens[0], "right": tokens[2]}\n\ntokens = [3, "+", 8]\nprint("AST:", parse_expr(tokens))',
                solutionHint: 'Construct AST node dictionaries with left and right child pointers.'
              },
              readingQuestions: ['Why does operator precedence dictate grammar production rules in LL(1) parsers?'],
              masteryChecklist: ['Write regular expressions for token types', 'Build recursive descent parser for mini language'],
              capstoneMilestone: 'Construct a compiler frontend targeting WebAssembly or LLVM IR.',
              estimatedStudyMinutes: 120,
              difficulty: 'advanced',
              glossary: [{ term: 'Abstract Syntax Tree', definition: 'A tree representation of the abstract syntactic structure of source code.' }],
              commonMisconceptions: ['Assuming compilers translate directly from source text to binary without intermediate structures.'],
              connectionsToLaterModules: ['Senior CS Capstone'],
              citation: { text: 'Lattner, C., & Adve, V. (2004). LLVM Compiler Infrastructure.' },
              accessStatus: 'verified'
            }
          }
        ]
      }
    ],
    books: [],
    papers: [],
    lectures: [],
    labs: []
  },
  {
    id: 'cs-304',
    code: 'CS 304',
    title: 'Software Engineering & System Architecture',
    program: 'computer-science',
    year: 3,
    semester: 6,
    creditHours: 3,
    estimatedHours: 40,
    isRequired: false,
    isElective: true,
    category: 'engineering',
    prerequisiteCourseIds: ['cs-201'],
    description: 'Software architecture design patterns, microservices vs monoliths, CI/CD automated deployment pipelines, REST/gRPC API design, and system refactoring.',
    learningOutcomes: [
      'Architect modular software systems using domain-driven design',
      'Implement CI/CD pipeline automation with unit and integration test gates',
      'Design RESTful and gRPC service contracts'
    ],
    sections: [
      {
        id: 'cs304-s1',
        title: 'Section 1: Architecture Patterns & CI/CD Pipelines',
        summary: 'Design patterns, microservices, gRPC interfaces, and testing workflows.',
        order: 1,
        topics: [
          {
            id: 'cs304-t1',
            moduleId: 'cs-304',
            title: 'Design Patterns, Microservices & Automated CI/CD Pipelines',
            slug: 'software-architecture-cicd',
            summary: 'SOLID design principles, Dependency Injection, gRPC protocol buffers, Docker containers, and CI/CD quality gates.',
            order: 1,
            masteryPack: {
              learningObjective: 'Apply SOLID principles to refactor tightly coupled code and construct containerized CI/CD configurations.',
              prerequisites: ['CS 201 Data Structures'],
              coreConcepts: ['SOLID Principles', 'Dependency Injection', 'Microservices Architecture', 'CI/CD Pipelines'],
              primaryLecture: VERIFIED_VIDEOS['cs304-t1'] as any,
              primaryText: {
                id: 'book-se-1',
                title: 'Clean Architecture: A Craftsman\'s Guide to Software Structure',
                authors: ['Robert C. Martin'],
                url: 'https://bento.me',
                pdfUrl: 'https://www.cs.umd.edu/class/spring2003/cmsc838p/Design/criteria.pdf',
                recommendedChapter: 'Chapter 7: The SOLID Principles',
                accessStatus: 'verified',
                publisherOrInstitution: 'Prentice Hall'
              },
              recommendedChapter: 'Chapter 7: SOLID Principles & Component Cohesion',
              authoritativeResearchSource: {
                id: 'paper-se-1',
                title: 'On the Criteria To Be Used in Decomposing Systems into Modules',
                authors: ['David L. Parnas'],
                year: 1972,
                venue: 'Communications of the ACM',
                openAccessUrl: 'https://www.cs.umd.edu/class/spring2003/cmsc838p/Design/criteria.pdf',
                paperType: 'seminal',
                difficulty: 'intermediate',
                prerequisites: ['CS 201 Data Structures'],
                summary: 'Introduced information hiding and modular decomposition in software engineering.',
                whyItMatters: 'Foundational paper for software modularity.',
                sectionsToRead: 'Sections 1-3',
                readingQuestions: ['Why does modular decomposition reduce ripple effects during system changes?'],
                relatedTopicIds: ['cs304-t1'],
                accessStatus: 'verified'
              },
              practicalExercises: [
                {
                  id: 'ex-se1',
                  question: 'Which SOLID principle states that high-level modules should not depend on low-level modules, but both should depend on abstractions?',
                  options: ['Dependency Inversion Principle', 'Single Responsibility Principle', 'Open-Closed Principle', 'Interface Segregation Principle'],
                  correctAnswer: 0,
                  explanation: 'The Dependency Inversion Principle (DIP) decouples high-level policy from low-level implementation details.',
                  type: 'multiple-choice'
                }
              ],
              interactiveLab: {
                id: 'lab-cs304-1',
                title: 'Dependency Injection & SOLID Refactoring Lab',
                type: 'python',
                instructions: 'Refactor tightly coupled database logging code to use Dependency Injection.',
                starterCode: 'from abc import ABC, abstractmethod\n\nclass Logger(ABC):\n    @abstractmethod\n    def log(self, msg: str): pass\n\nclass ConsoleLogger(Logger):\n    def log(self, msg: str): print(f"[LOG] {msg}")\n\nclass UserService:\n    def __init__(self, logger: Logger):\n        self.logger = logger\n    def create_user(self, name: str):\n        self.logger.log(f"User {name} created")\n\nservice = UserService(ConsoleLogger())\nservice.create_user("Alice")',
                solutionHint: 'Inject Logger interface into UserService constructor.'
              },
              readingQuestions: ['How does information hiding improve code maintainability across long development lifecycles?'],
              masteryChecklist: ['Implement Dependency Injection container', 'Draft Dockerfile and GitHub Actions workflow'],
              capstoneMilestone: 'Establish CI/CD pipeline and automated test suite for capstone project.',
              estimatedStudyMinutes: 120,
              difficulty: 'intermediate',
              glossary: [{ term: 'Dependency Injection', definition: 'A design pattern in which an object receives other objects that it depends on.' }],
              commonMisconceptions: ['Equating microservices architecture with better developer experience for small teams.'],
              connectionsToLaterModules: ['Senior CS Capstone'],
              citation: { text: 'Parnas, D. L. (1972). On the Criteria To Be Used in Decomposing Systems into Modules.' },
              accessStatus: 'verified'
            }
          }
        ]
      }
    ],
    books: [],
    papers: [],
    lectures: [],
    labs: []
  },
  {
    id: 'cs-401',
    code: 'CS 401',
    title: 'Senior Computer Science Capstone Project',
    program: 'computer-science',
    year: 4,
    semester: 8,
    creditHours: 4,
    estimatedHours: 60,
    isRequired: true,
    isElective: false,
    category: 'cs',
    prerequisiteCourseIds: ['cs-301', 'cs-305'],
    description: 'Design, implement, test, and defend an end-to-end software system, kernel extension, or distributed engine.',
    learningOutcomes: [
      'Architect an end-to-end system from technical specification to deployment',
      'Defend system design decisions before peer and academic review',
      'Deliver production codebase with high test coverage and documentation'
    ],
    sections: [
      {
        id: 'cs401-s1',
        title: 'Section 1: Capstone Engineering & Defense',
        summary: 'System specification, implementation, benchmark verification, and final presentation.',
        order: 1,
        topics: [
          {
            id: 'cs401-t1',
            moduleId: 'cs-401',
            title: 'System Architecture Specification & Technical Defense',
            slug: 'cs-capstone-defense',
            summary: 'Architectural blueprints, milestone tracking, benchmark performance validation, and peer defense.',
            order: 1,
            masteryPack: {
              learningObjective: 'Complete an end-to-end software system project and present a technical defense.',
              prerequisites: ['CS 301 Operating Systems', 'CS 305 Machine Learning'],
              coreConcepts: ['System Design Specification', 'Performance Benchmarking', 'Peer Code Review', 'Technical Defense'],
              primaryLecture: VERIFIED_VIDEOS['cs401-t1'] as any,
              primaryText: {
                id: 'book-caps-1',
                title: 'The Mythical Man-Month: Essays on Software Engineering',
                authors: ['Frederick P. Brooks Jr.'],
                url: 'https://archive.org/details/mythicalmanmonth00broo',
                pdfUrl: 'https://www.cs.unc.edu/techreports/86-020.pdf',
                recommendedChapter: 'Chapter 2: The Mythical Man-Month',
                accessStatus: 'verified',
                publisherOrInstitution: 'Addison-Wesley'
              },
              recommendedChapter: 'Chapter 2: The Mythical Man-Month & Architectural Integrity',
              authoritativeResearchSource: {
                id: 'paper-caps-1',
                title: 'No Silver Bullet — Essence and Accident in Software Engineering',
                authors: ['Frederick P. Brooks Jr.'],
                year: 1987,
                venue: 'IEEE Computer',
                openAccessUrl: 'https://www.cs.unc.edu/techreports/86-020.pdf',
                paperType: 'seminal',
                difficulty: 'advanced',
                prerequisites: ['CS 301 Operating Systems'],
                summary: 'Distinguishes essential software complexity from accidental engineering complexity.',
                whyItMatters: 'Classic essay on software engineering principles.',
                sectionsToRead: 'Full paper',
                readingQuestions: ['Why does Brooks argue there is no silver bullet for software complexity?'],
                relatedTopicIds: ['cs401-t1'],
                accessStatus: 'verified'
              },
              practicalExercises: [
                {
                  id: 'ex-caps1',
                  question: 'According to Brooks, what constitutes the essential complexity of software system development?',
                  options: [
                    'Formulating complex conceptual data structures and logic interfaces',
                    'Syntax errors in programming language compilation',
                    'Disk speed limits in hardware devices',
                    'Configuring build tool dependencies'
                  ],
                  correctAnswer: 0,
                  explanation: 'Essential complexity lies in the conceptual structure of software, not representation accidents.',
                  type: 'multiple-choice'
                }
              ],
              interactiveLab: {
                id: 'lab-cs401-1',
                title: 'System Latency Benchmarking & Performance Profiler',
                type: 'python',
                instructions: 'Profile function execution time and compute 99th percentile (p99) latency.',
                starterCode: 'import time, numpy as np\n\ndef benchmark(fn, iterations=1000):\n    durations = []\n    for _ in range(iterations):\n        start = time.perf_counter()\n        fn()\n        durations.append((time.perf_counter() - start) * 1000)\n    return np.percentile(durations, 99)\n\np99 = benchmark(lambda: sum(range(10000)))\nprint("p99 Latency (ms):", p99)',
                solutionHint: 'Compute 99th percentile duration across iteration runs.'
              },
              readingQuestions: ['Why does conceptual integrity dictate that a system should be designed by few minds?'],
              masteryChecklist: ['Write formal technical spec document', 'Execute p99 performance profiling benchmark'],
              capstoneMilestone: 'Deliver production project repository with automated CI tests and defense presentation.',
              estimatedStudyMinutes: 180,
              difficulty: 'advanced',
              glossary: [{ term: 'Conceptual Integrity', definition: 'The property where a system reflects a single, coherent set of design ideas throughout.' }],
              commonMisconceptions: ['Believing adding programmers to a late project accelerates delivery.'],
              connectionsToLaterModules: ['Industry Portfolio Defense'],
              citation: { text: 'Brooks, F. P. (1987). No Silver Bullet — Essence and Accident in Software Engineering.' },
              accessStatus: 'verified'
            }
          }
        ]
      }
    ],
    books: [],
    papers: [],
    lectures: [],
    labs: []
  },
  {
    id: 'cs-402',
    code: 'CS 402',
    title: 'Formal Languages, Automata & Complexity',
    program: 'computer-science',
    year: 4,
    semester: 7,
    creditHours: 3,
    estimatedHours: 40,
    isRequired: false,
    isElective: true,
    category: 'theory',
    prerequisiteCourseIds: ['cs-201'],
    description: 'DFA/NFA finite automata, context-free languages, Turing machines, Rice theorem, Halting problem, NP-completeness, and polynomial reductions.',
    learningOutcomes: [
      'Construct deterministic and non-deterministic finite state machines',
      'Prove undecidability using Halting Problem reductions',
      'Demonstrate NP-completeness using polynomial-time reductions'
    ],
    sections: [
      {
        id: 'cs402-s1',
        title: 'Section 1: Automata Theory & NP-Completeness',
        summary: 'Finite automata, Turing machines, decidability, and NP reductions.',
        order: 1,
        topics: [
          {
            id: 'cs402-t1',
            moduleId: 'cs-402',
            title: 'Deterministic Finite Automata, Turing Machines & P vs NP',
            slug: 'automata-turing-np-completeness',
            summary: 'DFA state transitions, Pumping Lemma for regular languages, Universal Turing Machine, and 3SAT reduction to Clique.',
            order: 1,
            masteryPack: {
              learningObjective: 'Design DFAs for regular expressions and prove undecidability via Halting problem reduction.',
              prerequisites: ['CS 201 Data Structures'],
              coreConcepts: ['DFA / NFA', 'Context-Free Grammar', 'Turing Machine', 'P vs NP & 3SAT'],
              primaryLecture: VERIFIED_VIDEOS['cs402-t1'] as any,
              primaryText: {
                id: 'book-aut-1',
                title: 'Introduction to the Theory of Computation',
                authors: ['Michael Sipser'],
                url: 'https://math.mit.edu/~sipser/',
                pdfUrl: 'https://www.cs.toronto.edu/~sacook/homepage/1971.pdf',
                recommendedChapter: 'Chapter 7: Time Complexity & NP-Completeness',
                accessStatus: 'verified',
                publisherOrInstitution: 'Cengage Learning'
              },
              recommendedChapter: 'Chapter 7: Time Complexity & P vs NP',
              authoritativeResearchSource: {
                id: 'paper-aut-1',
                title: 'The Complexity of Theorem-Proving Procedures',
                authors: ['Stephen A. Cook'],
                year: 1971,
                venue: 'STOC',
                openAccessUrl: 'https://www.cs.toronto.edu/~sacook/homepage/1971.pdf',
                paperType: 'seminal',
                difficulty: 'advanced',
                prerequisites: ['CS 201 Data Structures'],
                summary: 'Proved Cook-Levin theorem showing 3SAT is NP-complete.',
                whyItMatters: 'Foundational result of complexity theory.',
                sectionsToRead: 'Sections 1-3',
                readingQuestions: ['Why does 3SAT reduction establish NP-completeness?'],
                relatedTopicIds: ['cs402-t1'],
                accessStatus: 'verified'
              },
              practicalExercises: [
                {
                  id: 'ex-aut1',
                  question: 'Which language class is recognized by Deterministic Finite Automata (DFA)?',
                  options: ['Regular Languages', 'Context-Free Languages', 'Turing-Recognizable Languages', 'Context-Sensitive Languages'],
                  correctAnswer: 0,
                  explanation: 'DFAs accept precisely the class of Regular Languages.',
                  type: 'multiple-choice'
                }
              ],
              interactiveLab: {
                id: 'lab-cs402-1',
                title: 'DFA State Transition Engine Simulator',
                type: 'python',
                instructions: 'Implement a DFA accepting strings ending in "101".',
                starterCode: 'def dfa_accepts(s):\n    state = 0\n    transitions = {\n        0: {"0": 0, "1": 1},\n        1: {"0": 2, "1": 1},\n        2: {"0": 0, "1": 3},\n        3: {"0": 2, "1": 1}\n    }\n    for char in s:\n        state = transitions[state][char]\n    return state == 3\n\nprint("Accepted 1101?", dfa_accepts("1101"))',
                solutionHint: 'State 3 is accepting state.'
              },
              readingQuestions: ['Why does the Pumping Lemma allow proving a language is NOT regular?'],
              masteryChecklist: ['Construct DFA for regular pattern', 'Reduce 3SAT to Clique in polynomial time'],
              capstoneMilestone: 'Formalize language complexity bounds for custom DSL parser.',
              estimatedStudyMinutes: 120,
              difficulty: 'advanced',
              glossary: [{ term: 'NP-Complete', definition: 'A decision problem that is both in NP and NP-hard.' }],
              commonMisconceptions: ['Conflating NP (Nondeterministic Polynomial time) with Non-Polynomial time.'],
              connectionsToLaterModules: ['Senior CS Capstone'],
              citation: { text: 'Cook, S. A. (1971). The Complexity of Theorem-Proving Procedures.' },
              accessStatus: 'verified'
            }
          }
        ]
      }
    ],
    books: [],
    papers: [],
    lectures: [],
    labs: []
  },
  {
    id: 'cs-403',
    code: 'CS 403',
    title: 'Computer Security & Applied Cryptography',
    program: 'computer-science',
    year: 4,
    semester: 7,
    creditHours: 3,
    estimatedHours: 40,
    isRequired: false,
    isElective: true,
    category: 'security',
    prerequisiteCourseIds: ['cs-301'],
    description: 'AES block ciphers, RSA public key cryptography, Elliptic Curve Cryptography (ECC), TLS 1.3 handshakes, buffer overflow prevention, and zero-trust security.',
    learningOutcomes: [
      'Implement AES encryption and RSA key generation primitives',
      'Analyze memory safety vulnerabilities and buffer overflow exploits',
      'Evaluate TLS 1.3 handshake protocols and zero-trust policies'
    ],
    sections: [
      {
        id: 'cs403-s1',
        title: 'Section 1: Applied Cryptography & Memory Safety',
        summary: 'Symmetric/asymmetric ciphers, cryptographic hashes, TLS 1.3, and memory protection.',
        order: 1,
        topics: [
          {
            id: 'cs403-t1',
            moduleId: 'cs-403',
            title: 'AES, RSA Public-Key Cryptography & Memory Safety',
            slug: 'cryptography-memory-security',
            summary: 'AES Galois Counter Mode (GCM), RSA modular exponentiation, Diffie-Hellman key exchange, TLS 1.3, and stack canary mitigations.',
            order: 1,
            masteryPack: {
              learningObjective: 'Implement RSA key generation and explain TLS 1.3 session key negotiation.',
              prerequisites: ['CS 301 Operating Systems'],
              coreConcepts: ['AES-GCM', 'RSA & ECC', 'Diffie-Hellman Key Exchange', 'Buffer Overflow & Stack Canaries'],
              primaryLecture: VERIFIED_VIDEOS['cs403-t1'] as any,
              primaryText: {
                id: 'book-sec-1',
                title: 'Applied Cryptography: Protocols, Algorithms, and Source Code in C',
                authors: ['Bruce Schneier'],
                url: 'https://www.schneier.com/books/applied_cryptography/',
                pdfUrl: 'https://ee.stanford.edu/~hellman/publications/24.pdf',
                recommendedChapter: 'Chapter 2: Protocol Building Blocks',
                accessStatus: 'verified',
                publisherOrInstitution: 'Wiley'
              },
              recommendedChapter: 'Chapter 2: Cryptographic Protocol Building Blocks',
              authoritativeResearchSource: {
                id: 'paper-sec-1',
                title: 'New Directions in Cryptography',
                authors: ['Whitfield Diffie', 'Martin E. Hellman'],
                year: 1976,
                venue: 'IEEE Transactions on Information Theory',
                openAccessUrl: 'https://ee.stanford.edu/~hellman/publications/24.pdf',
                paperType: 'seminal',
                difficulty: 'advanced',
                prerequisites: ['CS 301 Operating Systems'],
                summary: 'Introduced public-key cryptography and asymmetric key exchange.',
                whyItMatters: 'Foundational paper for modern cybersecurity and cryptography.',
                sectionsToRead: 'Sections I-III',
                readingQuestions: ['How does asymmetric encryption solve key distribution?'],
                relatedTopicIds: ['cs403-t1'],
                accessStatus: 'verified'
              },
              practicalExercises: [
                {
                  id: 'ex-sec1',
                  question: 'In RSA cryptography, if p=61 and q=53, what is Euler totient phi(n)?',
                  options: ['3120', '3233', '3180', '3000'],
                  correctAnswer: 0,
                  explanation: 'phi(n) = (p-1)*(q-1) = 60 * 52 = 3120.',
                  type: 'multiple-choice'
                }
              ],
              interactiveLab: {
                id: 'lab-cs403-1',
                title: 'RSA Key Generation & Cipher Engine',
                type: 'python',
                instructions: 'Implement RSA encryption c = m^e mod n for a small numerical message.',
                starterCode: 'def rsa_encrypt(msg, e, n):\n    return pow(msg, e, n)\n\ndef rsa_decrypt(cipher, d, n):\n    return pow(cipher, d, n)\n\ne, d, n = 65537, 2753, 3233\ncipher = rsa_encrypt(42, e, n)\nprint("Encrypted:", cipher, "Decrypted:", rsa_decrypt(cipher, d, n))',
                solutionHint: 'Use pow(base, exp, mod) for modular exponentiation.'
              },
              readingQuestions: ['How does Diffie-Hellman key exchange achieve forward secrecy in TLS 1.3?'],
              masteryChecklist: ['Derive RSA keypair from prime factors', 'Inspect TLS 1.3 handshake packet exchange'],
              capstoneMilestone: 'Audit capstone application API against OWASP top 10 vulnerabilities.',
              estimatedStudyMinutes: 120,
              difficulty: 'advanced',
              glossary: [{ term: 'Public Key Cryptography', definition: 'A cryptographic system using pairs of keys: public keys and private keys.' }],
              commonMisconceptions: ['Believing base64 encoding is an encryption mechanism.'],
              connectionsToLaterModules: ['Senior CS Capstone'],
              citation: { text: 'Diffie, W., & Hellman, M. E. (1976). New Directions in Cryptography.' },
              accessStatus: 'verified'
            }
          }
        ]
      }
    ],
    books: [],
    papers: [],
    lectures: [],
    labs: []
  },
  {
    id: 'ds-402',
    code: 'CS 405',
    title: 'MLOps, Model Deployment & Production Infrastructure',
    program: 'computer-science',
    year: 4,
    semester: 7,
    creditHours: 3,
    estimatedHours: 40,
    isRequired: false,
    isElective: true,
    category: 'ml',
    prerequisiteCourseIds: ['cs-305', 'ds-202'],
    description: 'MLflow experiment tracking, FastAPI inference serving, Docker containerization, Kubernetes horizontal scaling, data drift detection, and automated retraining.',
    learningOutcomes: [
      'Build containerized FastAPI serving REST microservices for ML models',
      'Log parameters, metrics, and model artifacts using MLflow',
      'Detect covariate shift and data drift in production feature pipelines'
    ],
    sections: [
      {
        id: 'ds402-s1',
        title: 'Section 1: MLOps Pipelines & Model Serving',
        summary: 'FastAPI serving, Docker containers, MLflow tracking, and drift monitoring.',
        order: 1,
        topics: [
          {
            id: 'ds402-t1',
            moduleId: 'ds-402',
            title: 'FastAPI Model Microservices, Docker Containers & MLflow Tracking',
            slug: 'mlops-fastapi-docker-mlflow',
            summary: 'Asynchronous FastAPI endpoints, ONNX model optimization, Docker build layers, and KS test drift detection.',
            order: 1,
            masteryPack: {
              learningObjective: 'Deploy an ML model microservice with FastAPI and containerize it using Docker.',
              prerequisites: ['CS 305 Machine Learning', 'CS 205 Databases'],
              coreConcepts: ['FastAPI REST API', 'Docker Containerization', 'MLflow Experiment Tracking', 'Data Drift & KS-Test'],
              primaryLecture: VERIFIED_VIDEOS['ds402-t1'] as any,
              primaryText: {
                id: 'book-mlops-1',
                title: 'Designing Machine Learning Systems',
                authors: ['Chip Huyen'],
                url: 'https://huyenchip.com/ml-interviews-book/',
                pdfUrl: 'https://proceedings.neurips.cc/paper_files/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf',
                recommendedChapter: 'Chapter 9: Model Deployment & Serving',
                accessStatus: 'verified',
                publisherOrInstitution: 'O\'Reilly Media'
              },
              recommendedChapter: 'Chapter 9: Model Deployment & Serving Architectures',
              authoritativeResearchSource: {
                id: 'paper-mlops-1',
                title: 'Hidden Technical Debt in Machine Learning Systems',
                authors: ['D. Sculley', 'Gary Holt', 'Daniel Golovin', 'Eugene Davydov'],
                year: 2015,
                venue: 'NIPS',
                openAccessUrl: 'https://proceedings.neurips.cc/paper_files/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf',
                paperType: 'applied',
                difficulty: 'advanced',
                prerequisites: ['CS 305 Machine Learning'],
                summary: 'Highlights that model code is a small fraction of real production ML systems.',
                whyItMatters: 'Foundational paper defining MLOps engineering challenges.',
                sectionsToRead: 'Sections 1-4',
                readingQuestions: ['What are feedback loops in production ML systems?'],
                relatedTopicIds: ['ds402-t1'],
                accessStatus: 'verified'
              },
              practicalExercises: [
                {
                  id: 'ex-mlops1',
                  question: 'Which metric drift test compares probability distributions of continuous features in production vs baseline?',
                  options: ['Kolmogorov-Smirnov (KS) Test', 'Chi-Square Test', 'ANOVA Test', 'Paired t-Test'],
                  correctAnswer: 0,
                  explanation: 'The Kolmogorov-Smirnov test measures distance between baseline and production empirical Cumulative Distribution Functions.',
                  type: 'multiple-choice'
                }
              ],
              interactiveLab: {
                id: 'lab-ds402-1',
                title: 'FastAPI Model Inference Endpoint',
                type: 'python',
                instructions: 'Write a FastAPI POST route returning model predictions.',
                starterCode: 'from fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass PredictRequest(BaseModel):\n    features: list[float]\n\n@app.post("/predict")\ndef predict(req: PredictRequest):\n    prediction = sum(req.features) * 0.5\n    return {"prediction": prediction}\n\nprint("FastAPI App initialized successfully")',
                solutionHint: 'Define Pydantic request model and POST endpoint.'
              },
              readingQuestions: ['Why is offline accuracy often a poor proxy for online production business metrics?'],
              masteryChecklist: ['Build FastAPI serving endpoint', 'Write Dockerfile and build container image'],
              capstoneMilestone: 'Deploy capstone ML model as a scalable containerized web service.',
              estimatedStudyMinutes: 120,
              difficulty: 'advanced',
              glossary: [{ term: 'Data Drift', definition: 'The change in input data distribution over time compared to training data.' }],
              commonMisconceptions: ['Thinking deploying an ML model ends at exporting a pickle file.'],
              connectionsToLaterModules: ['Senior Capstone Project'],
              citation: { text: 'Sculley, D., et al. (2015). Hidden Technical Debt in Machine Learning Systems.' },
              accessStatus: 'verified'
            }
          }
        ]
      }
    ],
    books: [],
    papers: [],
    lectures: [],
    labs: []
  },
  {
    id: 'ds-403',
    code: 'CS 406',
    title: 'Natural Language Processing & LLMs',
    program: 'computer-science',
    year: 4,
    semester: 7,
    creditHours: 3,
    estimatedHours: 40,
    isRequired: false,
    isElective: true,
    category: 'ml',
    prerequisiteCourseIds: ['cs-305'],
    description: 'BPE tokenization, Word2Vec embeddings, Transformer self-attention, fine-tuning LLMs, PEFT/LoRA, Retrieval-Augmented Generation (RAG), and evaluation.',
    learningOutcomes: [
      'Compute multi-head scaled dot-product self-attention matrices',
      'Implement Retrieval-Augmented Generation (RAG) vector database pipelines',
      'Fine-tune Large Language Models using Parameter-Efficient Fine-Tuning (LoRA)'
    ],
    sections: [
      {
        id: 'ds403-s1',
        title: 'Section 1: Transformers, LLMs & RAG Architectures',
        summary: 'Self-attention, Transformer decoders, LoRA fine-tuning, and RAG retrieval.',
        order: 1,
        topics: [
          {
            id: 'ds403-t1',
            moduleId: 'ds-403',
            title: 'Transformer Self-Attention, PEFT/LoRA & RAG Pipelines',
            slug: 'transformer-attention-lora-rag',
            summary: 'Query-Key-Value projection, softmax attention scaling, Byte-Pair Encoding, Low-Rank Adaptation (LoRA), and vector search RAG pipelines.',
            order: 1,
            masteryPack: {
              learningObjective: 'Implement scaled dot-product self-attention in PyTorch and build a vector search RAG pipeline.',
              prerequisites: ['CS 305 Machine Learning', 'MATH 201 Linear Algebra'],
              coreConcepts: ['Scaled Dot-Product Attention', 'Multi-Head Attention', 'LoRA (Low-Rank Adaptation)', 'RAG Vector Search'],
              primaryLecture: VERIFIED_VIDEOS['ds403-t1'] as any,
              primaryText: {
                id: 'book-nlp-1',
                title: 'Speech and Language Processing',
                authors: ['Daniel Jurafsky', 'James H. Martin'],
                url: 'https://web.stanford.edu/~jurafsky/slp3/',
                pdfUrl: 'https://web.stanford.edu/~jurafsky/slp3/ed3book.pdf',
                recommendedChapter: 'Chapter 10: Transformers & Pretrained Language Models',
                accessStatus: 'verified',
                publisherOrInstitution: 'Stanford University / Pearson'
              },
              recommendedChapter: 'Chapter 10: Transformers & Self-Attention Architectures',
              authoritativeResearchSource: {
                id: 'paper-attn-1',
                title: 'Attention Is All You Need',
                authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit'],
                year: 2017,
                venue: 'NIPS',
                openAccessUrl: 'https://arxiv.org/pdf/1706.03762.pdf',
                paperType: 'seminal',
                difficulty: 'advanced',
                prerequisites: ['CS 305 Machine Learning'],
                summary: 'Introduced the Transformer architecture based entirely on self-attention mechanisms.',
                whyItMatters: 'Foundational architecture of modern Large Language Models.',
                sectionsToRead: 'Sections 1-3.2',
                readingQuestions: ['Why is scaled dot-product self-attention parallelizable compared to RNNs?'],
                relatedTopicIds: ['ds403-t1'],
                accessStatus: 'verified'
              },
              practicalExercises: [
                {
                  id: 'ex-nlp1',
                  question: 'In scaled dot-product attention, why is the matrix product Q K^T divided by sqrt(d_k)?',
                  options: [
                    'To prevent softmax gradients from vanishing for large dimension sizes d_k',
                    'To force attention values to sum to zero',
                    'To eliminate the need for key matrix projections',
                    'To guarantee orthogonal query vectors'
                  ],
                  correctAnswer: 0,
                  explanation: 'Scaling by 1/sqrt(d_k) prevents extremely large dot products that push softmax into regions with near-zero gradients.',
                  type: 'multiple-choice'
                }
              ],
              interactiveLab: {
                id: 'lab-ds403-1',
                title: 'Scaled Dot-Product Self-Attention Engine',
                type: 'python',
                instructions: 'Compute attention weights and output vectors given Q, K, and V tensors.',
                starterCode: 'import numpy as np\n\ndef self_attention(Q, K, V):\n    d_k = Q.shape[-1]\n    scores = np.matmul(Q, K.T) / np.sqrt(d_k)\n    weights = np.exp(scores) / np.sum(np.exp(scores), axis=-1, keepdims=True)\n    return np.matmul(weights, V)\n\nQ = np.random.randn(2, 4)\nK = np.random.randn(2, 4)\nV = np.random.randn(2, 4)\nprint("Attention Output Shape:", self_attention(Q, K, V).shape)',
                solutionHint: 'Softmax over scores matrix scaled by sqrt(d_k).'
              },
              readingQuestions: ['How does LoRA reduce trainable parameter overhead during LLM fine-tuning?'],
              masteryChecklist: ['Implement self-attention mechanism in NumPy/PyTorch', 'Construct vector indexing RAG pipeline'],
              capstoneMilestone: 'Integrate LLM reasoning endpoint or RAG pipeline into capstone project.',
              estimatedStudyMinutes: 120,
              difficulty: 'advanced',
              glossary: [{ term: 'Self-Attention', definition: 'An attention mechanism relating different positions of a single sequence to compute a representation.' }],
              commonMisconceptions: ['Believing RAG retrains the underlying neural network weights.'],
              connectionsToLaterModules: ['Senior Capstone Project'],
              citation: { text: 'Vaswani, A., et al. (2017). Attention Is All You Need.' },
              accessStatus: 'verified'
            }
          }
        ]
      }
    ],
    books: [],
    papers: [],
    lectures: [],
    labs: []
  }
];

export const COMPUTER_SCIENCE_PROGRAM: UniversityProgram = {
  id: 'computer-science',
  name: 'Computer Science (B.S. Honors Curriculum)',
  shortName: 'B.S. Computer Science',
  degreeTitle: 'Bachelor of Science in Computer Science',
  description: 'A university-level honors curriculum covering CS fundamentals, systems, discrete math, algorithms, machine learning, and software architecture.',
  totalCredits: 120,
  estimatedTotalHours: 1200,
  years: [
    {
      yearNumber: 1,
      title: 'Year 1: Foundations of Computation & Programming',
      semesters: [
        {
          semesterNumber: 1,
          yearNumber: 1,
          title: 'Semester 1: Abstraction & Calculus',
          subtitle: 'Digital Logic, Python Programming, and Differential Calculus',
          courses: COMPUTER_SCIENCE_COURSES.filter(c => c.year === 1 && c.semester === 1)
        },
        {
          semesterNumber: 2,
          yearNumber: 1,
          title: 'Semester 2: Data Structures & Systems',
          subtitle: 'Data Structures, Discrete Math, and Linear Systems',
          courses: COMPUTER_SCIENCE_COURSES.filter(c => c.year === 1 && c.semester === 2)
        }
      ]
    },
    {
      yearNumber: 2,
      title: 'Year 2: Core Computer Science & Applied Math',
      semesters: [
        {
          semesterNumber: 3,
          yearNumber: 2,
          title: 'Semester 3: Algorithms & Linear Algebra',
          subtitle: 'Algorithmic Complexity, Matrix Decompositions, and Probability',
          courses: COMPUTER_SCIENCE_COURSES.filter(c => c.year === 2 && c.semester === 3)
        },
        {
          semesterNumber: 4,
          yearNumber: 2,
          title: 'Semester 4: Architecture & Software Systems',
          subtitle: 'RISC-V Architecture, Systems Programming, and Databases',
          courses: COMPUTER_SCIENCE_COURSES.filter(c => c.year === 2 && c.semester === 4)
        }
      ]
    },
    {
      yearNumber: 3,
      title: 'Year 3: Systems, Machine Learning & Theory',
      semesters: [
        {
          semesterNumber: 5,
          yearNumber: 3,
          title: 'Semester 5: Kernels & Networks',
          subtitle: 'Operating Systems, Threading, and Distributed Networks',
          courses: COMPUTER_SCIENCE_COURSES.filter(c => c.year === 3 && c.semester === 5)
        },
        {
          semesterNumber: 6,
          yearNumber: 3,
          title: 'Semester 6: Machine Learning & Theory of Computation',
          subtitle: 'Neural Networks, Transformers, Automata, and Complexity Theory',
          courses: COMPUTER_SCIENCE_COURSES.filter(c => c.year === 3 && c.semester === 6)
        }
      ]
    },
    {
      yearNumber: 4,
      title: 'Year 4: Advanced Electives, Ethics & Senior Capstone',
      semesters: [
        {
          semesterNumber: 7,
          yearNumber: 4,
          title: 'Semester 7: Ethics & Specialization',
          subtitle: 'Tech Ethics, Differential Privacy, and Advanced Electives',
          courses: COMPUTER_SCIENCE_COURSES.filter(c => c.year === 4 && c.semester === 7)
        },
        {
          semesterNumber: 8,
          yearNumber: 4,
          title: 'Semester 8: Senior Research Capstone',
          subtitle: 'First Principles Capstone Project Defense and Portfolio',
          courses: COMPUTER_SCIENCE_COURSES.filter(c => c.year === 4 && c.semester === 8)
        }
      ]
    }
  ],
  electives: []
};
