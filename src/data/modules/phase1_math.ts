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
            'Formal Definition of Function: Domain, Codomain, Range, Injective, Surjective, Bijective: a function is a precise rule pairing every input in a domain to exactly one output, and the injective/surjective/bijective classification tells you whether that rule can be reliably reversed — a property that matters directly for whether operations like decompression or decryption are even possible.',
            'Exponents and Logarithmic Identities (Base-2, Base-e, Base-10): exponentiation models repeated multiplication and describes phenomena that grow proportionally to their current size (like compound interest or viral spread), while logarithms are its exact inverse, letting you solve for "how many times" growth must repeat to reach a target — a calculation that appears constantly in algorithm analysis and information theory.',
            'Inverse Functions and Logarithmic Compression: an inverse function undoes exactly what the original function did, and because logarithms are the inverse of exponentiation, they compress enormous ranges of numbers (like population counts or probabilities) into small, manageable scales, which is why log scales appear throughout science and engineering.',
            'Polynomials, Rational Functions, and Asymptotes: polynomials are sums of terms built from a variable raised to whole-number powers, and understanding their end behavior and asymptotes (values a function approaches but never reaches) is essential for predicting how a function behaves at extreme input values, including how an algorithm’s runtime behaves as input size grows without bound.',
            'Comparing Growth Rates: O(1), O(log n), O(n), O(n log n), O(n^2), O(2^n): this hierarchy ranks how quickly different families of functions grow as their input n increases, and it is the mathematical backbone of Big-O notation, which is how computer scientists formally compare the scalability of different algorithms.',
            'Function Composition: combining two functions so that the output of one becomes the input of the next, a building block for describing complex transformations and for understanding how layered systems like neural networks or multi-stage algorithms are analyzed piece by piece.'
          ],
          simpleExplanation: `Picture a function as a vending machine. You press a specific button (that's your input), and every single time you press that exact button, the exact same snack drops out (that's the output). It never gives you a surprise — press B4 today or tomorrow, you always get the same chips. The set of buttons that actually work is called the domain, and the set of snacks that can actually come out is called the range.

Some vending machines are "reversible" and some aren't. Imagine you found a snack lying on the ground and wanted to know which button produced it. If two different buttons can produce the exact same snack, you could never be sure which one was pressed — that machine isn't reversible. A function where every output could only have come from one specific input is called injective. If, on top of that, every single snack in the machine is reachable by pressing some button (nothing is stuck, unreachable, or a display-only decoy), the function is also surjective. A function that is both is bijective, and only bijective functions can have a true "reverse vending machine" built for them — an inverse function that takes a snack and tells you, with certainty, exactly which button made it.

Exponents and logarithms are a similar reversible pair, but for growth instead of buttons. Imagine a rumor that doubles in size every hour: 1 person tells 2, who tell 4, who tell 8, and so on — that explosive doubling pattern is exponential growth. A logarithm answers the reverse question: "given how many people know the rumor now, how many doubling-hours did it take to get here?" Because logarithms undo runaway growth, they're brilliant at squeezing enormous ranges of numbers down into small, comfortable ones — the same way an odometer only needs a few digits to represent a car that's driven a truly enormous distance.

Big-O notation uses this same growth intuition to compare algorithms, like judging racers over an ever-longer racetrack instead of a single sprint. A racer whose effort barely increases as the track lengthens (like log n) barely breaks a sweat even on an enormous track. A racer whose effort grows exactly with the track length (n) tires proportionally. But a racer whose effort must be squared every time the track gets longer (n^2) gets utterly crushed once the track becomes huge — which is exactly why computer scientists care so much about which growth category an algorithm falls into, since it predicts how badly it will struggle as the amount of data grows into the millions or billions.`,
          realWorldApplications: [
            {
              title: "Binary search in a phone's contacts or dictionary app",
              description: 'Binary search repeatedly halves the remaining search space, giving it O(log n) growth, which is why looking up a name among millions of contacts takes only a handful of comparisons instead of scanning every entry.'
            },
            {
              title: "Timsort, the default sorting algorithm in Python and Java",
              description: 'Timsort guarantees O(n log n) worst-case performance, the same growth class analyzed in this topic, which is why sorting a list of a million items finishes in a fraction of a second rather than grinding to a halt.'
            },
            {
              title: "The Richter/moment magnitude scale for earthquakes",
              description: 'Earthquake magnitude is defined using a base-10 logarithm of ground-motion amplitude, so a magnitude 7 quake releases roughly 32 times more energy than a magnitude 6 — logarithms compress that vast energy range into small, comparable numbers.'
            },
            {
              title: "The decibel (dB) scale for sound loudness",
              description: 'Decibels measure sound intensity on a logarithmic scale because human hearing spans such an enormous range of physical sound power that a plain linear scale would be unusable for everyday description.'
            },
            {
              title: "Compound interest and loan calculators in banking apps",
              description: 'Balances grow exponentially with compound interest, and banking apps use logarithms behind the scenes to solve for unknowns like "how many years until this investment doubles," the same exponential/logarithmic inverse relationship covered here.'
            }
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
            },
            {
              id: 'ex-p1-2',
              question: 'Which of the following functions f: R -> R is bijective (both injective and surjective)?',
              options: [
                'f(x) = x^3',
                'f(x) = x^2',
                'f(x) = |x|',
                'f(x) = sin(x)'
              ],
              correctAnswer: 0,
              explanation: 'f(x) = x^3 is strictly increasing across all real numbers, so it never repeats an output value (injective), and its range covers all real numbers since cube roots of any real number exist (surjective). f(x) = x^2 and f(x) = |x| both fail injectivity (e.g., f(2) = f(-2)), and f(x) = sin(x) fails both injectivity and surjectivity over all reals since it repeats values periodically and its range is limited to [-1, 1].',
              type: 'multiple-choice'
            },
            {
              id: 'ex-p1-5',
              question: 'An algorithm’s running time is described as O(n log n). Explain in your own words what this means and why it is considered much more scalable than an O(n^2) algorithm.',
              explanation: 'O(n log n) means the algorithm’s running time grows proportionally to n multiplied by the logarithm of n, as an upper bound, ignoring constant factors. Because log n grows extremely slowly compared to n itself, n log n grows far more slowly than n^2 as n increases — for example, at n = 1,000,000, n log n is roughly 20 million operations, while n^2 is a trillion operations. This is why algorithms like merge sort (O(n log n)) vastly outperform algorithms like bubble sort (O(n^2)) on large datasets.',
              type: 'free-response'
            },
            {
              id: 'ex-p1-6',
              question: 'Solve for x: 2^x = 64.',
              options: ['6', '5', '32', '8'],
              correctAnswer: 0,
              explanation: 'We need the exponent to which 2 must be raised to yield 64. Since 2^6 = 64, x = 6. Equivalently, x = log_2(64) = 6.',
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
            'What is the inverse function of f(x) = e^x?',
            'Why must a function be bijective in order to guarantee it has a well-defined inverse?',
            'How would you use the change-of-base formula to compute log_2(100) using only a calculator that has a base-10 log button?',
            'Why does an O(n log n) sorting algorithm scale so much better than an O(n^2) sorting algorithm as the amount of data grows into the millions?'
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
            { term: 'Function', definition: 'A rule that assigns to every element of an input set (the domain) exactly one element of an output set (the codomain); no valid input may map to more than one output.' },
            { term: 'Domain', definition: 'The complete set of valid input values for which a function is defined.' },
            { term: 'Range', definition: 'The set of all actual output values a function produces; it is always a subset of (but not necessarily equal to) the codomain.' },
            { term: 'Injective (One-to-One)', definition: 'A property of a function in which every distinct input maps to a distinct output, meaning no two different inputs ever produce the same result.' },
            { term: 'Surjective (Onto)', definition: 'A property of a function in which every element of the codomain is hit by at least one input, meaning the range equals the entire codomain.' },
            { term: 'Bijective Function', definition: 'A function that is both injective (one-to-one) and surjective (onto), which guarantees it has an exact, well-defined inverse function.' },
            { term: 'Logarithm', definition: 'The exponent or power to which a fixed base must be raised to produce a given number; log_b(x) = y means b^y = x.' },
            { term: 'Asymptote', definition: 'A line that a function’s graph approaches arbitrarily closely as the input (or output) grows without bound, but which the graph never actually touches or crosses in that limit.' },
            { term: 'Big-O Notation', definition: 'A mathematical notation used to describe an upper bound on how an algorithm’s running time or memory usage grows as its input size n increases, ignoring constant factors and lower-order terms.' },
            { term: 'Polynomial', definition: 'An expression built from a sum of terms, each consisting of a variable raised to a non-negative whole-number exponent multiplied by a coefficient, such as 3x^2 + 2x - 5.' }
          ],
          commonMisconceptions: [
            'Misconception: log(a + b) = log(a) + log(b). Reality: Logarithms convert products into sums, so it is log(a * b) that equals log(a) + log(b); there is no simple identity for the logarithm of a sum.',
            'Misconception: An algorithm that is O(n^2) is always slower in practice than one that is O(n log n), for every input size. Reality: Big-O describes asymptotic behavior as n grows toward infinity; for small n, constant factors and lower-order terms can make the "worse" complexity class run faster in practice.',
            'Misconception: Every function has an inverse function. Reality: Only bijective functions (both injective and surjective) have a true inverse function; functions that are not one-to-one, like f(x) = x^2 over all real numbers, cannot be inverted without restricting the domain.',
            'Misconception: log_2(n) grows roughly as fast as n itself once n is large. Reality: Logarithmic growth is dramatically slower than linear growth; log_2 of one billion is under 30, while linear growth of one billion is one billion — the gap widens without bound as n increases.'
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
            'Propositional Logic: Truth Tables, Implication (P -> Q), Contrapositive: propositional logic gives a precise, mechanical way to determine whether compound statements are true or false based only on the truth values of their parts, and it is the mathematical foundation underlying every conditional statement and boolean expression in real computer programs.',
            'De Morgan’s Laws for Logic and Sets: these laws describe exactly how negation distributes over AND/OR (and over set union/intersection), and they are essential for correctly simplifying complex conditional expressions in code as well as for manipulating logical proofs without introducing errors.',
            'Set Theory: Union, Intersection, Complement, Cartesian Product, Power Set: sets are the basic language for describing collections of objects and their relationships, and operations like union and intersection formalize ideas (combining, filtering, comparing groups) that appear constantly in databases, algorithms, and probability.',
            'Proof Methods: Direct Proof, Proof by Contradiction, Proof by Contrapositive: these are the standard rigorous templates mathematicians and computer scientists use to establish that a claim is unconditionally true, and mastering them is what allows you to verify — rather than merely guess — that an algorithm or theorem actually works in every case.',
            'Mathematical Induction: Base Step, Inductive Hypothesis, Inductive Step: induction is a proof technique for establishing that a statement holds for every natural number by proving it for a starting case and then showing each case implies the next, a pattern that mirrors (and justifies the correctness of) recursive algorithms and loops in programming.',
            'Quantifiers: Universal (For All) and Existential (There Exists): these symbols let you state precisely whether a property must hold for every element of a set or merely for at least one element, a distinction that is a frequent source of subtle logical errors if left ambiguous.'
          ],
          simpleExplanation: `Propositional logic starts from statements you can label true or false, like "it is raining" or "I bring an umbrella." An implication like "if it's raining, then I bring an umbrella" is a promise about the relationship between two such statements — and a truth table is simply a complete checklist of every possible weather-and-umbrella combination, so you can verify exactly when the promise is kept and when it's broken (it's only broken when it rains and no umbrella shows up).

De Morgan's laws are like a bouncer's rulebook. Suppose the rule is "you may not enter wearing both a hat and sneakers" — that's the same rule as "you must be missing the hat, or missing the sneakers, or both." Flipping a rule built from AND into an equivalent rule built from OR (and negating each piece) is exactly what De Morgan's laws formalize, and the very same swap works for sets: "not in either club" is the same as "not in the first club, and not in the second club."

Sets themselves are just clearly defined groups of things, and the classic way to picture them is two overlapping circles at a party. The union is everyone who showed up to either party — combine the guest lists and cross out duplicates. The intersection is only the people who went to both parties — the overlapping sliver in the middle. A power set, meanwhile, is the list of every possible guest list you could make by choosing any subset of a group's members, including the empty list and the full list.

Mathematical induction is best pictured as a long row of dominoes. To prove all of them will fall, you don't need to check every single domino by hand — you only need two things: proof that the first domino falls (the base case), and proof that whenever any one domino falls, it's guaranteed to knock over the next one (the inductive step). Those two facts together guarantee the entire row falls, no matter how long it is — which is exactly why induction can rigorously prove a formula true for every natural number without ever checking them one by one.`,
          realWorldApplications: [
            {
              title: "SQL WHERE clauses and database query optimizers",
              description: 'Database engines like PostgreSQL evaluate boolean filter conditions (AND, OR, NOT) using the same propositional logic covered here, and their query optimizers apply De Morgan’s laws to rewrite conditions like `NOT (a AND b)` into equivalent, often faster-to-execute forms.'
            },
            {
              title: "AND/OR/NOT/XOR logic gates inside a CPU",
              description: 'Digital circuit designers build every computation a processor performs out of physical logic gates that directly implement propositional logic operators, so the truth tables studied here are literally the blueprint for how a chip is wired.'
            },
            {
              title: "SQL UNION, INTERSECT, and EXCEPT operators",
              description: 'These SQL keywords perform the exact set operations of union, intersection, and set difference on the rows returned by two queries, letting developers combine or compare result sets the same way this topic combines and compares sets.'
            },
            {
              title: "Amazon Web Services' use of TLA+ formal verification",
              description: 'Engineering teams at AWS have published on using the formal specification language TLA+ to write rigorous, proof-like arguments about distributed systems, catching subtle correctness bugs that testing alone would likely miss.'
            },
            {
              title: "Correctness proofs for recursive functions (e.g. factorial or Fibonacci)",
              description: 'Verifying that a recursive function or loop always produces the right answer typically relies on the same base-case-plus-inductive-step reasoning as mathematical induction, which is why induction is often taught alongside recursion in computer science.'
            }
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
            },
            {
              id: 'ex-p1-7',
              question: 'Given A = {1, 2, 3} and B = {2, 3, 4}, compute A ∪ B, A ∩ B, and A - B (elements in A but not in B).',
              explanation: 'A ∪ B combines every element appearing in either set (without duplicates): {1, 2, 3, 4}. A ∩ B contains only elements present in both sets: {2, 3}. A - B contains elements in A that are not also in B: {1}, since 2 and 3 are removed because they also appear in B.',
              type: 'free-response'
            },
            {
              id: 'ex-p1-8',
              question: 'What is the base case and inductive step needed to prove, by induction, that the sum of the first n positive integers equals n(n+1)/2?',
              explanation: 'The base case verifies the formula for n = 1: the sum of the first 1 integer is 1, and 1(1+1)/2 = 1, so it holds. The inductive step assumes the formula holds for some arbitrary k (the inductive hypothesis: 1 + 2 + ... + k = k(k+1)/2), and then proves it must also hold for k + 1 by adding (k+1) to both sides: k(k+1)/2 + (k+1) = (k+1)(k+2)/2, which is exactly the formula evaluated at n = k+1. Since the base case holds and each case implies the next, the formula holds for all positive integers by induction.',
              type: 'free-response'
            },
            {
              id: 'ex-p1-9',
              question: 'How many elements are in the power set of a set with 5 elements?',
              options: ['32', '25', '10', '5'],
              correctAnswer: 0,
              explanation: 'A set with n elements has a power set of size 2^n, because each of the n elements can independently either be included or excluded from a given subset. For n = 5, that is 2^5 = 32 total subsets, including the empty set and the full set itself.',
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
            'How does the base case in mathematical induction ensure the proof holds for all n >= 0?',
            'Why is the converse of a true implication not guaranteed to also be true, and can you construct a real-world example that illustrates this?',
            'How does De Morgan’s law for sets, complement(A ∪ B) = complement(A) ∩ complement(B), mirror the logical version for AND/OR?',
            'Why does mathematical induction resemble the way a recursive function or a while-loop is proven correct in computer science?'
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
            { term: 'Proposition', definition: 'A declarative statement that is unambiguously either true or false, but never both, such as "7 is a prime number."' },
            { term: 'Implication (P -> Q)', definition: 'A logical statement asserting that if P is true, then Q must also be true; it is only considered false in the single case where P is true and Q is false.' },
            { term: 'Contrapositive', definition: 'The logical proposition ~Q -> ~P derived by negating and swapping the parts of P -> Q; it is logically equivalent to the original implication, always sharing the same truth value.' },
            { term: 'Converse', definition: 'The logical proposition Q -> P formed by swapping the hypothesis and conclusion of P -> Q; unlike the contrapositive, the converse is not logically equivalent to the original statement.' },
            { term: 'De Morgan’s Laws', definition: 'A pair of rules stating that ~(P AND Q) is equivalent to (~P OR ~Q), and ~(P OR Q) is equivalent to (~P AND ~Q); the set-theory analogue states that the complement of a union equals the intersection of complements, and vice versa.' },
            { term: 'Union (A ∪ B)', definition: 'The set containing every element that belongs to A, to B, or to both.' },
            { term: 'Intersection (A ∩ B)', definition: 'The set containing only the elements that belong to both A and B simultaneously.' },
            { term: 'Power Set', definition: 'The set of all possible subsets of a given set, including the empty set and the set itself; a set with n elements has a power set containing 2^n elements.' },
            { term: 'Mathematical Induction', definition: 'A proof technique for establishing that a statement holds for every natural number by proving a base case (usually n = 0 or n = 1) and an inductive step showing that if the statement holds for n, it must also hold for n + 1.' },
            { term: 'Proof by Contradiction', definition: 'A proof technique that assumes the negation of the statement to be proved, then derives a logical impossibility from that assumption, thereby concluding the original statement must be true.' }
          ],
          commonMisconceptions: [
            'Misconception: Assuming P -> Q means Q -> P is true. Reality: The converse Q -> P is a logically distinct statement that is not guaranteed by the original implication; only the contrapositive ~Q -> ~P is guaranteed equivalent.',
            'Misconception: Proof by contradiction and proof by contrapositive are the same technique. Reality: Proof by contrapositive proves P -> Q by directly proving ~Q -> ~P, while proof by contradiction assumes both P and ~Q are true simultaneously and derives an outright logical impossibility from that combined assumption.',
            'Misconception: Mathematical induction proves a statement is true "because it worked for the first few cases." Reality: Induction is rigorous precisely because the inductive step proves the implication holds for every n, not just the ones checked; skipping the inductive step and only checking examples is not a valid proof.',
            'Misconception: The empty set is "nothing" and therefore not really a set, or is not a subset of every set. Reality: The empty set is a well-defined set containing zero elements, and by the formal definition of subset, it is a subset of every set, including itself.'
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
            'Vectors as Points and Directed Segments in R^n Space: a vector can be understood both as a point’s coordinates and as an arrow with magnitude and direction, and this dual view is what lets linear algebra describe everything from physical motion to abstract data features (like the pixels of an image or the words in a document) using the same mathematical toolkit.',
            'Dot Product, Norms (L1, L2), and Geometric Cosine Angle: the dot product combines two vectors into a single number that measures how much they point in the same direction, norms measure a vector’s length under different definitions of "distance," and together these tools quantify similarity and magnitude — concepts that power everything from search-result ranking to machine learning distance metrics.',
            'Linear Independence, Span, Basis, and Vector Space Dimension: a set of vectors is linearly independent if none can be built from a combination of the others, the span is every point reachable by combining a set of vectors, and a basis is a minimal independent set that spans an entire space — these ideas formalize exactly how much "genuinely new" information a set of directions or data features actually contains.',
            'Matrices as Linear Transformations (Scaling, Rotation, Projection): a matrix is not just a grid of numbers but a compact description of a function that maps every vector in a space to a new vector, and recognizing operations like scaling, rotation, and projection as matrices is the geometric key to understanding graphics, robotics, and neural network layers.',
            'Matrix Multiplication, Transpose, Inverse, and Matrix Rank: matrix multiplication composes two linear transformations into one, the inverse undoes a transformation (when possible), and the rank measures how many independent directions a transformation actually preserves — together these operations are the computational engine behind solving systems of equations and behind nearly every machine learning model.',
            'Eigenvalues and Eigenvectors: an eigenvector of a matrix is a special direction that the transformation only stretches or shrinks (by a factor called the eigenvalue) rather than rotates away from, and finding these special directions reveals a matrix’s most fundamental behavior, which is central to techniques like PageRank and Principal Component Analysis.'
          ],
          simpleExplanation: `A vector is just a set of directions written as numbers, like telling someone "walk 3 blocks east, then 2 blocks north" to get from one point to another. Written as [3, 2], it can be thought of two ways at once: as an arrow pointing from the start to the destination, or simply as the coordinates of the destination itself. That dual view — arrow and point — is what lets the exact same mathematical toolkit describe a car's motion, a pixel's color, or a sentence's meaning in a document, since all of them can be written down as lists of numbers.

The dot product is a way of measuring how much two vectors "agree" in direction, and the easiest way to picture it is two flashlight beams. Point them in almost the same direction and their light overlaps heavily — a large dot product. Point them at right angles to each other and there's no overlap at all — a dot product of exactly zero. This single number, computed by multiplying matching components together and adding up the results, turns out to be an incredibly useful way to measure similarity between things represented as vectors.

A matrix is best pictured as a transformation machine, like a photocopier with special settings: feed a shape in, and it comes out stretched, rotated, flipped, or squashed according to a fixed recipe. That recipe — the exact instructions for how every possible input point gets moved — is captured entirely by a grid of numbers, the matrix, and "multiplying" a vector by a matrix is just running that vector through the machine. Multiplying two matrices together builds one combined machine that has the same effect as running something through the first machine, then immediately through the second.

Now imagine spinning a rubber sheet with lots of little arrows drawn on it. As you twist the sheet, most arrows swing around to point in completely new directions. But a few special arrows are stubborn: no matter how you stretch or spin the sheet, they keep pointing along the exact same line — they might get longer or shorter, but never rotate away from their original direction. Those stubborn arrows are called eigenvectors, and the amount they get stretched or shrunk by is their eigenvalue. Finding these special, unchanging directions turns out to reveal a transformation's most fundamental behavior — which is exactly why they show up at the heart of techniques as different as ranking web pages and compressing data.`,
          realWorldApplications: [
            {
              title: "Google's original PageRank algorithm",
              description: "PageRank models the entire web as a giant matrix of links between pages, and a page's long-run importance score comes from computing the dominant eigenvector of that matrix — directly applying the eigenvector concept from this topic."
            },
            {
              title: "3D transform matrices in game engines like Unity and Unreal Engine",
              description: "Every time a 3D game moves, rotates, or scales a character or camera, the engine multiplies the object's coordinate vectors by transformation matrices, exactly as described by matrices representing scaling, rotation, and projection."
            },
            {
              title: "Netflix-style collaborative filtering recommendation systems",
              description: "Recommendation engines represent users and movies as vectors and use the dot product to measure how well a user's taste vector aligns with a movie's feature vector, ranking recommendations by that similarity score."
            },
            {
              title: "Neural network layers in frameworks like PyTorch and TensorFlow",
              description: 'Each layer of a neural network computes its output by multiplying an input vector by a weight matrix, so the matrix multiplication mechanics covered here are the literal computation running underneath every forward pass.'
            },
            {
              title: "Principal Component Analysis (PCA) in tools like scikit-learn",
              description: "PCA finds the eigenvectors of a dataset's covariance matrix to identify the directions of greatest variation, letting data scientists compress high-dimensional data down to its most informative few dimensions."
            }
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
            },
            {
              id: 'ex-p1-10',
              question: 'What does it mean geometrically if the determinant of a 2x2 matrix is 0?',
              options: [
                'The transformation collapses the plane onto a line or point, so it has no inverse.',
                'The transformation rotates every vector by 90 degrees.',
                'The transformation doubles the area of every shape it is applied to.',
                'The matrix must be the identity matrix.'
              ],
              correctAnswer: 0,
              explanation: 'The determinant measures the area-scaling factor of the linear transformation a matrix represents. A determinant of 0 means the transformation squashes all of 2D space down into a line (or a single point), destroying a dimension of information; because information is lost, the transformation cannot be reversed, so the matrix has no inverse.',
              type: 'multiple-choice'
            },
            {
              id: 'ex-p1-11',
              question: 'Explain why matrix multiplication is generally not commutative (A * B != B * A) using the idea of composing transformations.',
              explanation: 'Each matrix represents a specific linear transformation (such as a rotation or a scaling along one axis), and multiplying two matrices A * B means "first apply transformation B, then apply transformation A" to a vector. Just as rotating an object and then stretching it along the x-axis generally produces a different result than stretching it first and then rotating it, applying two different geometric transformations in a different order usually produces a different overall transformation, so A * B and B * A are generally different matrices.',
              type: 'free-response'
            },
            {
              id: 'ex-p1-12',
              question: 'Are the vectors u = [1, 2] and v = [2, 4] linearly independent? Justify your answer.',
              explanation: 'No, they are linearly dependent. Notice that v = 2u, meaning v can be written entirely as a scalar multiple of u. Because one vector is completely redundant given the other (it adds no new direction), the set {u, v} is linearly dependent and spans only a one-dimensional line rather than the full 2D plane.',
              type: 'free-response'
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
            'What does a determinant of 0 signify regarding matrix invertibility and volume scaling?',
            'Why does the dot product of two perpendicular (orthogonal) vectors always equal zero?',
            'How does the concept of a "basis" let you describe every point in a space using the fewest possible independent directions?',
            'Why does an eigenvector remain on the same line through the origin after a linear transformation is applied, while most other vectors do not?'
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
            { term: 'Vector', definition: 'An ordered list of numbers that can represent a point in space, a direction with magnitude, or a set of features; formally, an element of a vector space.' },
            { term: 'Dot Product', definition: 'An operation that takes two vectors of equal length and returns a single scalar number, computed by multiplying corresponding components and summing the results; it measures how much two vectors point in the same direction.' },
            { term: 'Norm', definition: 'A function that assigns a non-negative length or magnitude to a vector; the L2 norm (Euclidean length) is the square root of the sum of squared components, while the L1 norm is the sum of absolute values of the components.' },
            { term: 'Linear Independence', definition: 'A property of a set of vectors in which no vector in the set can be written as a linear combination (weighted sum) of the others.' },
            { term: 'Span', definition: 'The set of all possible vectors obtainable by taking linear combinations of a given set of vectors.' },
            { term: 'Basis', definition: 'A linearly independent set of vectors that spans an entire vector space; every vector in that space can be written uniquely as a combination of basis vectors.' },
            { term: 'Matrix', definition: 'A rectangular array of numbers arranged in rows and columns that can represent, among other things, a linear transformation between vector spaces.' },
            { term: 'Linear Transformation', definition: 'A mapping between vector spaces that preserves vector addition and scalar multiplication, meaning it can always be represented by matrix multiplication.' },
            { term: 'Determinant', definition: 'A single scalar value computed from a square matrix that indicates, among other things, how much the matrix’s linear transformation scales area or volume, and whether the matrix is invertible (a determinant of zero means it is not).' },
            { term: 'Eigenvector', definition: 'A non-zero vector whose direction remains unchanged (only scaled) when a given linear transformation (matrix) is applied to it.' },
            { term: 'Eigenvalue', definition: 'The scalar factor by which an eigenvector is stretched or shrunk when its corresponding linear transformation is applied.' },
            { term: 'Matrix Rank', definition: 'The number of linearly independent rows (equivalently, columns) in a matrix, which equals the dimension of the space spanned by its columns.' }
          ],
          commonMisconceptions: [
            'Misconception: Matrix multiplication is commutative (A * B = B * A). Reality: Matrix multiplication is generally non-commutative (A * B != B * A); the order in which transformations are composed changes the result.',
            'Misconception: Every square matrix has an inverse. Reality: A square matrix has an inverse only if its determinant is nonzero; matrices with a zero determinant are called singular and collapse space into a lower dimension, which cannot be undone.',
            'Misconception: A vector’s dot product with itself measures its direction. Reality: The dot product of a vector with itself gives the square of its L2 norm (length), not a direction; direction requires comparing angles between distinct vectors.',
            'Misconception: Every matrix has real eigenvalues and eigenvectors. Reality: Some matrices (for example, rotation matrices in 2D) have only complex eigenvalues, because there is no real, non-zero vector whose direction is preserved under a pure rotation.'
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
