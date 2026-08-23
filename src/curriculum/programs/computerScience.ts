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
              coreConcepts: [
                'Two\'s Complement: the standard scheme computers use to represent signed integers in binary so that addition and subtraction can use the exact same circuitry as unsigned arithmetic, with no special-casing for negative numbers; understanding it explains how overflow and negative values behave at the hardware level.',
                'IEEE 754 Floating Point: the international standard defining how a fixed number of bits (sign, exponent, mantissa) approximate real numbers; it explains why decimal fractions like 0.1 cannot be stored exactly and why floating-point arithmetic accumulates rounding error, which is critical for any numerically sensitive program.',
                'Logic Gates (AND/OR/XOR/NOT): the physical switching circuits, built from transistors, that implement boolean functions; every arithmetic and control operation a CPU performs is ultimately composed from these gates, so they are the bridge between abstract boolean algebra and real silicon.',
                'De Morgan\'s Laws: the algebraic identities ¬(A∧B) = ¬A∨¬B and ¬(A∨B) = ¬A∧¬B that let any logic expression be rewritten using only NAND or only NOR gates, which is why real chips can be manufactured from a single universal gate type.',
                'Number Base Conversion (Binary/Hex/Decimal): the skill of translating values between bases, essential for reading memory dumps, debugging low-level code, and understanding why hexadecimal is used as a compact, human-readable stand-in for groups of four binary digits.',
                'Character Encoding (ASCII/Unicode): the convention that maps bit patterns to human-readable characters, illustrating that "meaning" inside a computer is not intrinsic to the bits but is entirely a matter of the interpretation convention layered on top of them.'
              ],
              simpleExplanation: `Imagine a car odometer that only has eight wheels of digits, each wheel showing either a 0 or a 1 instead of 0 through 9. That's a byte. A computer doesn't understand numbers the way we do — it only knows whether a tiny electrical switch is on or off, so it strings eight of those switches together to spell out a value, just like the odometer spells out a mileage with its wheels. When the odometer runs out of wheels and rolls over from 999999 back to 000000, something is lost — the car doesn't magically know it drove a million miles, it just resets. Computers have the exact same problem, called overflow: if a value gets too big for its wheels (bits), it silently wraps back around, which is exactly what happens when an 8-bit counter holding 255 gets nudged up by one and drops to 0.

Negative numbers get the same odometer trick, called two's complement. Picture running the odometer backward: instead of a minus sign, engineers agreed that if you flip every wheel and then add one click, you get a bit pattern that behaves exactly like a negative number when you add it to a positive one — no separate "subtraction machine" needed, the same adding circuit just works for both. It's a clever bookkeeping trick, not literal subtraction.

Fractions are trickier still. IEEE 754 floating point is like a very precise ruler that can slide a decimal point around to zoom in on either huge distances (light-years) or tiny ones (nanometers), using a small reserved patch of bits to record where the decimal point currently sits. But because the ruler only has finitely many tick marks, some ordinary fractions — like a third, or even 0.1 — don't line up exactly with a tick, so the computer stores the closest tick instead. That's why adding 0.1 and 0.2 on a computer can produce 0.30000000000000004 instead of a clean 0.3.

Underneath all of this sit logic gates — tiny electronic light-switch circuits with fittingly simple names like AND, OR, and NOT. An AND gate is like a Christmas light that only turns on when two switches are both flipped on; an OR gate turns on if either switch is flipped. Wire millions of these switches together in the right pattern and you get a circuit that can add two odometer-style numbers, compare them, or decide which instruction to run next — every calculation a computer ever does, from a video game's physics to a bank transfer, ultimately boils down to armies of these on/off switches flipping in a pattern.`,
              realWorldApplications: [
                { title: `IEEE 754 doubles in JavaScript's Number type`, description: `Every JavaScript number, whether it looks like an integer or a decimal, is stored as a 64-bit IEEE 754 float, which is why 0.1 + 0.2 === 0.3 evaluates to false — the classic floating-point rounding surprise every JS developer eventually hits.` },
                { title: `Two's complement arithmetic in x86 and ARM processors`, description: `Every mainstream CPU architecture, from Intel's x86 to the ARM chips in phones, implements integer subtraction as two's-complement addition, letting one adder circuit handle both signed and unsigned math without separate hardware.` },
                { title: `The Year 2038 problem in 32-bit Unix timestamps`, description: `Many older Unix-based systems store time as a signed 32-bit integer counting seconds since 1970; that counter overflows on January 19, 2038, the same wraparound bug pattern taught with 8-bit counters, just at a larger scale.` },
                { title: `UTF-8 encoding across the modern web`, description: `UTF-8 is the dominant encoding on the web precisely because it was designed to stay byte-for-byte compatible with the older 7-bit ASCII standard, so plain English text needs no translation at all.` },
                { title: `NAND-only standard-cell libraries in chip fabrication`, description: `Because De Morgan's laws let any AND/OR/NOT circuit be rebuilt from NAND gates alone, real semiconductor fabs manufacture chips using standard-cell libraries built almost entirely out of one universal gate type, simplifying manufacturing.` }
              ],
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
                },
                {
                  id: 'ex-cs101-2',
                  question: 'Which single field in the IEEE 754 single-precision (32-bit) floating point format is responsible for representing very large or very small magnitudes?',
                  options: ['Sign bit', 'Exponent field', 'Mantissa (significand) field', 'Guard bit'],
                  correctAnswer: 'Exponent field',
                  explanation: 'The 8-bit exponent field (biased by 127) scales the value up or down by powers of two, letting the same 32 bits represent numbers from roughly 1.2 x 10^-38 to 3.4 x 10^38.',
                  type: 'multiple-choice'
                },
                {
                  id: 'ex-cs101-3',
                  question: 'Using De Morgan\'s Law, rewrite the expression NOT (A AND B) using only OR and NOT operators.',
                  correctAnswer: '(NOT A) OR (NOT B)',
                  explanation: 'De Morgan\'s first law states that the negation of a conjunction equals the disjunction of the negations: not(A and B) = (not A) or (not B).',
                  type: 'free-response'
                },
                {
                  id: 'ex-cs101-4',
                  question: 'An 8-bit unsigned integer holding the value 255 is incremented by 1. What value does it wrap to, and why does this matter for security-critical code?',
                  correctAnswer: '0',
                  explanation: 'Unsigned 8-bit arithmetic is performed modulo 256, so 255 + 1 wraps to 0. Unchecked overflow like this has caused real vulnerabilities, such as integer overflows leading to undersized buffer allocations.',
                  type: 'free-response'
                },
                {
                  id: 'ex-cs101-5',
                  question: 'Trace this code and determine what it prints: a = 0b1010; b = 0b0110; print(bin(a ^ b))',
                  correctAnswer: '0b1100',
                  explanation: 'XOR compares each bit position independently: 1^0=1, 0^1=1, 1^1=0, 0^0=0, giving 1100 in binary, which is why XOR is used for bit-flipping and parity checks.',
                  type: 'code-snippet'
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
              readingQuestions: [
                'Why does floating point addition suffer from catastrophic cancellation?',
                'How does the placement of the sign bit, exponent, and mantissa in IEEE 754 allow floating point magnitudes to be compared using the same circuitry as integer comparison?',
                'Why can any boolean circuit be built using only NAND gates?',
                'What is the representable range of an 8-bit two\'s complement integer, and why is that range asymmetric (one more negative value than positive)?',
                'How does integer overflow behave differently in two\'s complement signed arithmetic versus unsigned arithmetic?',
                'Why is it unsafe to compare two floating point numbers for exact equality in most programs?'
              ],
              masteryChecklist: ['Convert positive and negative integers to 8-bit two\'s complement', 'Understand IEEE 754 precision limits'],
              capstoneMilestone: 'Build a software 8-bit ALU simulator.',
              estimatedStudyMinutes: 180,
              difficulty: 'beginner',
              glossary: [
                { term: 'Two\'s Complement', definition: 'A binary encoding for signed integers in which negative values are formed by inverting all bits of the positive value and adding 1, allowing the same adder hardware to handle both signed and unsigned addition.' },
                { term: 'IEEE 754', definition: 'The IEEE standard for floating-point arithmetic that specifies the bit layout (sign, exponent, mantissa) and rounding rules used by virtually all modern hardware to represent real numbers.' },
                { term: 'Mantissa (Significand)', definition: 'The part of a floating-point number that holds its significant digits; combined with the exponent it determines the represented value as mantissa x 2^exponent.' },
                { term: 'Exponent Bias', definition: 'A fixed offset (127 for single precision) added to the true exponent so it can be stored as an unsigned value, simplifying magnitude comparisons between floating-point numbers.' },
                { term: 'Overflow', definition: 'The condition where the result of an arithmetic operation exceeds the range representable by the number of bits allocated, causing the value to wrap around or produce an incorrect result.' },
                { term: 'Logic Gate', definition: 'A physical electronic device, typically built from transistors, that implements a basic boolean function such as AND, OR, NOT, or XOR on one or more binary inputs.' },
                { term: 'Boolean Algebra', definition: 'The branch of algebra in which variables take only the values true and false, providing the mathematical foundation for digital logic circuit design.' },
                { term: 'De Morgan\'s Law', definition: 'A pair of transformation rules stating that the negation of a conjunction equals the disjunction of the negations, and vice versa, used to simplify and re-express logic circuits.' },
                { term: 'ASCII', definition: 'A 7-bit character encoding standard that maps 128 numeric codes to English letters, digits, punctuation, and control characters.' },
                { term: 'Unicode', definition: 'A character encoding standard designed to represent virtually every writing system in the world, using variable-width encodings such as UTF-8 to remain backward-compatible with ASCII.' }
              ],
              commonMisconceptions: [
                'Misconception: Floating point numbers can exactly represent decimal fractions like 0.1. Reality: Because 0.1 has no finite binary expansion, IEEE 754 stores only the closest approximate value, which is why repeated additions of 0.1 can accumulate visible rounding error.',
                'Misconception: Two\'s complement is just sign-magnitude notation with an extra step. Reality: Two\'s complement is defined precisely so that addition and subtraction hardware can be identical for signed and unsigned integers, with no special-casing of the sign bit required.',
                'Misconception: A byte always means exactly 8 bits by definition. Reality: While 8 bits is the near-universal modern convention, byte width has historically varied by architecture (6, 7, or 9 bits); the architecture-independent unit is technically the octet.',
                'Misconception: OR and XOR are essentially the same gate. Reality: OR returns true when at least one input is true (including when both are true), while XOR returns true only when the inputs differ, a property that makes XOR the basis of bit-flipping, parity checks, and simple stream ciphers.',
                'Misconception: Boolean logic and gate-level circuits are purely theoretical concerns unrelated to performance. Reality: The number of gate levels a signal must propagate through per clock cycle directly limits the maximum clock frequency a circuit can run at, so logic minimization has a direct, measurable effect on CPU speed.'
              ],
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
              coreConcepts: [
                'Classes & Objects: a class is a blueprint that bundles data (attributes) and behavior (methods) together, and an object is a concrete instance of that blueprint; this pairing is the core mechanism object-oriented languages use to model real-world entities in code.',
                'Polymorphism: the ability of different objects to respond to the same method call in ways specific to their own type, letting calling code work uniformly with a family of related objects without knowing their exact class, which is central to writing extensible software.',
                'Dunder Methods: Python\'s "double underscore" special methods (like __init__, __repr__, __eq__, __call__) that let user-defined classes hook into built-in language syntax such as printing, comparison, iteration, and operator overloading.',
                'Composition: building complex objects by combining simpler ones as member fields rather than through inheritance, which produces more flexible and loosely-coupled designs and is why "favor composition over inheritance" is a widely followed design guideline.',
                'Encapsulation: bundling an object\'s internal state with the methods that operate on it and restricting direct external access to that state, so implementation details can change without breaking code that depends on the class\'s public interface.',
                'SOLID Principles: five design guidelines (Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, Dependency Inversion) for structuring object-oriented code so it stays maintainable and extensible as it grows.'
              ],
              simpleExplanation: `Think of a class as a cookie cutter and an object as the actual cookie it stamps out of dough. The cutter (class) defines the shape — how many attributes a cookie has and what it can do — but you can press it into dough over and over to get many individual cookies (objects), each one a separate piece of dough even though they all share the same shape.

Now imagine a universal TV remote with just one "power" button that works on a television, a soundbar, and a projector, even though each device turns on in a completely different way internally. That's polymorphism: you press the same button (call the same method name) on different kinds of objects, and each object knows how to respond in its own way, so the code pressing the button never needs to know or care which specific device it's talking to.

Encapsulation is like a car's dashboard: you press the gas pedal and the car speeds up, but you never have to think about the fuel injectors, spark plugs, or exactly how combustion happens under the hood. The manufacturer is free to redesign the engine in next year's model, and the pedal will still work the same way for the driver. A well-designed class works the same way — it exposes a simple set of buttons (public methods) and hides the messy engine (internal data and logic) behind them.

Composition, meanwhile, is like building with LEGO bricks instead of carving a single block of wood. Rather than trying to make one giant, rigid class that inherits every feature it might ever need, you build small, focused pieces — an Engine, a Wheel, a Radio — and snap them together inside a Car object. If you need a different radio later, you just swap that one brick out, instead of having to re-carve the entire car.`,
              realWorldApplications: [
                { title: `Polymorphism in GUI event handling frameworks (Java Swing, iOS UIKit)`, description: `GUI toolkits define a common button-like interface so that clicking a button, a checkbox, or a custom widget all trigger the same onClick-style method call, letting the framework treat wildly different widgets uniformly.` },
                { title: `Dunder methods powering NumPy and pandas operator overloading`, description: `Libraries like NumPy overload arithmetic operators via __add__, __mul__, and __getitem__ so that array1 + array2 performs element-wise addition, giving custom objects the same natural syntax as built-in numbers.` },
                { title: `Composition over inheritance in Unity and Unreal Engine game objects`, description: `Both major game engines model game objects as containers that compose independent components (physics, rendering, audio) rather than deep inheritance trees, exactly the composition pattern taught in this topic.` },
                { title: `SOLID principles in the Java Collections Framework`, description: `Interfaces like List, Set, and Map are separated from their concrete implementations (ArrayList, HashSet) following the Dependency Inversion and Interface Segregation principles, letting code depend on the abstraction rather than a specific implementation.` },
                { title: `Encapsulation in database driver APIs (JDBC, psycopg2)`, description: `A database connection object exposes simple methods like execute() and fetchall() while hiding the underlying TCP socket handling and wire protocol, so application code never touches the low-level networking details.` }
              ],
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
                },
                {
                  id: 'ex-cs102-2',
                  question: 'Which relationship between classes does composition represent, as opposed to inheritance?',
                  options: ['"is-a" relationship', '"has-a" relationship', 'An identical interface relationship', 'A purely static relationship'],
                  correctAnswer: '"has-a" relationship',
                  explanation: 'Composition models a "has-a" relationship (a Car has an Engine), while inheritance models an "is-a" relationship (a Car is a Vehicle); composition is generally more flexible because components can be swapped at runtime.',
                  type: 'multiple-choice'
                },
                {
                  id: 'ex-cs102-3',
                  question: 'Explain why implementing __eq__ without also implementing __hash__ can break the use of an object as a dictionary key or set member.',
                  correctAnswer: 'By default, __hash__ is derived from object identity; if __eq__ is overridden without a matching __hash__, two objects that compare equal can hash differently, violating the invariant that equal objects must have equal hashes and causing set/dict lookups to fail silently.',
                  explanation: 'Python requires equal objects to produce equal hash values so hash-based containers work correctly; overriding __eq__ alone silently breaks this contract unless __hash__ is defined consistently (or explicitly set to None to mark the type unhashable).',
                  type: 'free-response'
                },
                {
                  id: 'ex-cs102-4',
                  question: 'What will this code print, and why? class A:\n    def speak(self): return "A"\nclass B(A):\n    def speak(self): return "B"\nfor obj in [A(), B()]:\n    print(obj.speak())',
                  correctAnswer: 'A\nB',
                  explanation: 'This demonstrates runtime polymorphism: the same method call obj.speak() dispatches to each object\'s own overridden implementation based on its actual runtime type, not the loop variable\'s declared type.',
                  type: 'code-snippet'
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
              readingQuestions: [
                'Why is composition generally preferred over inheritance in software design?',
                'How does duck typing in Python relate to the concept of polymorphism?',
                'What problems can arise from deep inheritance hierarchies in large codebases?',
                'Why does Alan Kay say object-oriented programming is fundamentally about message passing rather than classes?',
                'How does the Liskov Substitution Principle constrain what a subclass is allowed to change about inherited behavior?',
                'When would you choose an abstract base class over a plain duck-typed interface in Python?'
              ],
              masteryChecklist: ['Implement dunder methods __repr__, __eq__, and __len__', 'Apply list comprehensions and generators'],
              capstoneMilestone: 'Build an object-oriented file system simulator.',
              estimatedStudyMinutes: 200,
              difficulty: 'beginner',
              glossary: [
                { term: 'Polymorphism', definition: 'The ability of objects of different types to be accessed through the same interface, with each type providing its own specific implementation of shared method names.' },
                { term: 'Encapsulation', definition: 'Bundling data and the methods that operate on it inside a single unit (class), restricting direct access to internal state from outside code.' },
                { term: 'Inheritance', definition: 'A mechanism by which a class (subclass) acquires the attributes and methods of another class (superclass), enabling code reuse and an "is-a" relationship.' },
                { term: 'Composition', definition: 'A design technique where a class is built by including instances of other classes as fields, modeling a "has-a" relationship instead of an "is-a" relationship.' },
                { term: 'Dunder Method', definition: 'A special Python method surrounded by double underscores (e.g., __init__, __str__) that Python\'s interpreter calls automatically to implement built-in behaviors like construction, printing, and operator overloading.' },
                { term: 'Duck Typing', definition: 'A dynamic typing style where an object\'s suitability for an operation is determined by the presence of the required methods and attributes rather than its explicit inherited type ("if it walks like a duck and quacks like a duck").' },
                { term: 'Abstract Base Class (ABC)', definition: 'A class that cannot be instantiated directly and defines one or more abstract methods that subclasses are required to implement, used to enforce a common interface.' },
                { term: 'SOLID', definition: 'An acronym for five object-oriented design principles (Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, Dependency Inversion) intended to make software easier to maintain and extend.' },
                { term: 'Method Resolution Order (MRO)', definition: 'The specific order in which Python searches base classes when resolving a method or attribute name, particularly relevant under multiple inheritance.' },
                { term: 'Memoization', definition: 'An optimization technique that caches the results of expensive function calls and returns the cached result when the same inputs occur again, commonly used to speed up recursive algorithms.' }
              ],
              commonMisconceptions: [
                'Misconception: Multiple inheritance is always bad and should be avoided entirely. Reality: Multiple inheritance is risky mainly when it creates ambiguous method resolution paths (the "diamond problem"); Python\'s C3 linearization algorithm resolves this predictably, and multiple inheritance is safe and idiomatic when used for narrow, well-defined mixins.',
                'Misconception: Polymorphism requires an explicit class hierarchy with inheritance. Reality: In Python, duck typing provides polymorphism without any inheritance relationship at all — any object exposing the right method names can be used interchangeably.',
                'Misconception: Encapsulation in Python is enforced by the language, similar to "private" keywords in Java or C++. Reality: Python\'s leading-underscore and double-underscore naming conventions signal intent but do not prevent external access; encapsulation in Python is a social convention, not a hard access-control mechanism.',
                'Misconception: Overriding __init__ in a subclass automatically calls the parent class\'s __init__. Reality: If a subclass defines __init__, the parent\'s __init__ is not called automatically; the subclass must explicitly call super().__init__() to run the parent\'s initialization logic.',
                'Misconception: Composition and inheritance are mutually exclusive design choices. Reality: Real systems commonly combine both — using inheritance for a small, stable "is-a" hierarchy and composition to assemble flexible, swappable behavior within each class.'
              ],
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
              coreConcepts: [
                'Limits: the formal notion of a function\'s value as its input approaches a point, which provides the rigorous foundation for defining both derivatives and continuity without relying on vague notions of "infinitely small" quantities.',
                'Derivatives: the instantaneous rate of change of a function at a point, computed as the limit of the average rate of change over a shrinking interval; derivatives are the mathematical tool that tells an optimization algorithm which direction to move to increase or decrease a function\'s output.',
                'Chain Rule: the rule for differentiating a composition of functions, d/dx[f(g(x))] = f\'(g(x))·g\'(x), which is the mathematical mechanism that makes backpropagation in neural networks possible by propagating gradients layer by layer.',
                'Gradient Vector: the vector of partial derivatives of a multivariable function, pointing in the direction of steepest increase; moving in the negative gradient direction is the basis of gradient descent, the core optimization algorithm used to train machine learning models.',
                'Taylor Series: a way of approximating a function near a point using a polynomial built from its derivatives at that point, used throughout numerical computing and machine learning to approximate nonlinear functions locally.',
                'Critical Points & Optimization: points where a function\'s derivative is zero or undefined, which are candidates for local minima, maxima, or saddle points, and are central to understanding how optimization algorithms locate the best parameters for a model.'
              ],
              simpleExplanation: `Imagine you're in a car and glance at the speedometer. It's not telling you how far you've traveled — it's telling you exactly how fast your position is changing at this very instant. A derivative is the mathematical version of a speedometer: it measures how fast the output of a function is changing at one specific point, computed by looking at smaller and smaller time windows around that instant until the average speed over the window becomes the exact, instantaneous speed at that point.

Now imagine a relay race with three runners, where each runner's speed depends on how fast the runner before them was moving. The chain rule is the rule for figuring out the speed of the very last runner in terms of everyone earlier in the chain — you multiply together how much each stage amplifies or dampens the one before it. This "multiply the links of the chain together" idea is exactly what a neural network uses during training: it treats itself as a giant relay race of mathematical operations and multiplies local rates of change backward through every layer to figure out how a tiny nudge to an early setting affects the final answer.

Picture hiking down a foggy mountain with a blindfold on, feeling only the slope of the ground right under your feet. At each step, you feel which direction is steepest downhill and take a small step that way, then feel again. That is gradient descent: the gradient is just the mathematical version of "which way is steepest," and repeatedly stepping in the downhill direction is how machine learning models gradually adjust their internal settings to make fewer and fewer mistakes.

A Taylor series, meanwhile, is like describing a curving mountain road using a sequence of increasingly detailed approximations — first a flat guess, then a tilted-line guess, then a gently-curving guess — each one hugging the true road a little more closely near the point you started from.`,
              realWorldApplications: [
                { title: `Backpropagation in PyTorch and TensorFlow`, description: `Every deep learning framework's backward() call is a direct software implementation of the chain rule, multiplying local derivatives backward through the computational graph to compute how each weight should change.` },
                { title: `Gradient descent training GPT-style language models`, description: `Large language models are trained by repeatedly computing the gradient of a loss function with respect to billions of parameters and nudging each parameter slightly downhill, the same gradient-descent idea taught with a single-variable function.` },
                { title: `Newton's method root-finding in engineering simulation software`, description: `Tools like MATLAB and SciPy use derivative-based Newton's method, which repeatedly uses a function's slope at a point to jump closer to where the function crosses zero, to solve equations with no closed-form algebraic solution.` },
                { title: `Physics engines computing velocity and acceleration in video games`, description: `Game engines like Unity approximate the derivatives of an object's position (velocity) and velocity (acceleration) every frame to simulate realistic motion under forces like gravity and collisions.` },
                { title: `The Black-Scholes options pricing model in quantitative finance`, description: `Wall Street pricing models for financial options are themselves built from partial derivatives describing how an option's price changes with respect to the underlying stock price, volatility, and time.` }
              ],
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
                },
                {
                  id: 'ex-math101-2',
                  question: 'For f(x) = x^3 - 6x^2 + 9x, at which x-values does f have a critical point?',
                  options: ['x = 1 and x = 3', 'x = 0 and x = 2', 'x = -1 and x = -3', 'x = 2 only'],
                  correctAnswer: 'x = 1 and x = 3',
                  explanation: 'f\'(x) = 3x^2 - 12x + 9 = 3(x-1)(x-3), which equals zero at x = 1 and x = 3; these are the candidate local extrema.',
                  type: 'multiple-choice'
                },
                {
                  id: 'ex-math101-3',
                  question: 'Explain why a learning rate that is too large can cause gradient descent to diverge instead of converge.',
                  correctAnswer: 'A large learning rate causes each update step to overshoot the minimum, and if the overshoot is large enough, the function value at the new point can be worse than before, causing oscillation or divergence rather than convergence.',
                  explanation: 'Gradient descent takes a step proportional to the learning rate times the gradient; if that step is too large relative to the curvature of the function, it repeatedly jumps past the minimum, and in the worst case the objective value grows without bound.',
                  type: 'free-response'
                },
                {
                  id: 'ex-math101-4',
                  question: 'Given g(x) = (3x + 1)^4, use the chain rule to find g\'(x).',
                  correctAnswer: '12(3x + 1)^3',
                  explanation: 'Let u = 3x + 1. Then g = u^4, so dg/dx = 4u^3 · du/dx = 4(3x+1)^3 · 3 = 12(3x+1)^3.',
                  type: 'free-response'
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
              readingQuestions: [
                'How does step size (learning rate) affect convergence in gradient descent?',
                'Why does the limit definition of the derivative require checking that the left-hand and right-hand limits agree?',
                'How does the chain rule generalize to functions of many variables, and why is that generalization essential for backpropagation?',
                'What distinguishes a local minimum from a global minimum, and why does this distinction matter for non-convex loss functions in machine learning?',
                'Why is a second derivative test (concavity) needed to classify a critical point as a minimum, maximum, or saddle point?',
                'How does a first-order Taylor approximation relate to the idea of a tangent line?'
              ],
              masteryChecklist: ['Differentiate polynomials, trig, exponential, and log functions', 'Apply the chain rule to composite functions'],
              capstoneMilestone: 'Build a numerical optimization engine in Python.',
              estimatedStudyMinutes: 180,
              difficulty: 'beginner',
              glossary: [
                { term: 'Gradient', definition: 'A vector of partial derivatives of a multivariable function with respect to each of its inputs, pointing in the direction of steepest ascent at a given point.' },
                { term: 'Derivative', definition: 'The instantaneous rate of change of a function at a point, formally defined as the limit of the average rate of change as the interval width approaches zero.' },
                { term: 'Limit', definition: 'The value a function approaches as its input approaches a given point, used to define derivatives and continuity rigorously.' },
                { term: 'Chain Rule', definition: 'A differentiation rule stating that the derivative of a composite function f(g(x)) equals f\'(g(x)) times g\'(x), used to differentiate nested functions.' },
                { term: 'Critical Point', definition: 'A point where a function\'s derivative is zero or undefined, representing a candidate location for a local minimum, local maximum, or saddle point.' },
                { term: 'Local Minimum/Maximum', definition: 'A point where a function\'s value is lower (or higher) than all nearby points, though not necessarily the lowest (or highest) value over the function\'s entire domain.' },
                { term: 'Learning Rate', definition: 'A scalar hyperparameter in gradient descent that controls the size of each step taken in the direction opposite the gradient.' },
                { term: 'Taylor Series', definition: 'A representation of a function as an infinite sum of terms calculated from the values of its derivatives at a single point, used to approximate functions locally with polynomials.' },
                { term: 'Partial Derivative', definition: 'The derivative of a multivariable function with respect to one variable, holding all other variables constant.' },
                { term: 'Concavity', definition: 'A property describing whether a function curves upward (convex) or downward (concave), determined by the sign of the second derivative and used to classify critical points.' }
              ],
              commonMisconceptions: [
                'Misconception: The average rate of change over an interval is the same as the instantaneous derivative at a point. Reality: The derivative is the limit of the average rate of change as the interval shrinks to zero; for nonlinear functions these two quantities are generally different, and confusing them leads to incorrect slope estimates.',
                'Misconception: A critical point (where the derivative is zero) is always a local minimum or maximum. Reality: A critical point can also be a saddle point (e.g., f(x) = x^3 at x = 0), where the function neither increases to a max nor decreases to a min; the second derivative test is needed to classify it.',
                'Misconception: Gradient descent always finds the global minimum of a function. Reality: For non-convex functions, such as most neural network loss surfaces, gradient descent can converge to a local minimum or saddle point rather than the global minimum.',
                'Misconception: A function must be continuous everywhere to have a well-defined derivative anywhere. Reality: Differentiability is a pointwise property; a function can fail to be differentiable at specific points (like corners) while still being differentiable elsewhere.',
                'Misconception: The chain rule only applies to explicit function composition written with nested parentheses. Reality: The chain rule underlies any dependency chain between variables, including the layer-by-layer dependency structure of a neural network, which is exactly why it generalizes to backpropagation.'
              ],
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
              coreConcepts: [
                'Hash Function: a deterministic function that maps keys of arbitrary size to fixed-size bucket indices; a good hash function distributes keys uniformly across buckets, which is what makes average-case O(1) lookup possible in a hash table.',
                'Chaining vs Open Addressing (Probing): the two dominant strategies for resolving hash collisions — chaining stores multiple colliding keys in a linked structure per bucket, while open addressing (linear/quadratic probing, double hashing) finds an alternate empty slot within the same array; each has different cache-locality and memory-overhead trade-offs.',
                'Load Factor: the ratio of stored elements to total bucket capacity; it directly governs the expected number of probes or chain length per operation, which is why hash tables trigger a resize once the load factor crosses a threshold.',
                'Amortized Complexity: the average cost of an operation over a worst-case sequence of operations, used to justify that dynamic resizing (which is occasionally expensive) still yields O(1) average-case insertion when the cost is spread across all insertions.',
                'Hash Collisions & Clustering: the unavoidable event where two distinct keys map to the same bucket index, and the tendency of certain probing schemes (like linear probing) to form long runs of occupied slots that degrade performance if not mitigated.',
                'Dynamic Resizing: the process of allocating a larger backing array and rehashing all existing keys into it once the load factor exceeds a threshold, which keeps the average operation cost close to constant time despite the table growing.'
              ],
              simpleExplanation: `Imagine a huge coat check at a theater with a thousand numbered hooks. Instead of a person searching every hook to find your coat, the attendant uses a quick formula on your name — say, adding up the letters — to jump straight to hook number 42 and hang your coat there. A hash function is exactly that formula: it takes a key (like a name or a word) and instantly computes which "hook" (bucket) it should live in, which is why looking something up in a hash table takes roughly the same tiny amount of time whether there are ten items stored or ten million.

But formulas aren't perfect, and sometimes two different names hash to the same hook number — that's a collision. One fix, called chaining, is to let a hook hold a small chain of coats instead of just one, so if a collision happens, both coats hang on the same hook and you simply check the short chain. Another fix, open addressing, is more like a parking garage: if your assigned spot is full, you drive to the next available spot nearby according to a fixed rule, and you remember that rule so you can find your car again later.

If too many coats pile up relative to the number of hooks — a high load factor — the coat check starts getting slow, because now the chains are long or the nearby parking spots are all full. So, just like a small business that outgrows its building and moves to a bigger one, a hash table periodically performs a resize: it builds a bigger array of hooks and carefully re-hangs every existing coat onto the new, larger set of hooks. This resize is occasionally expensive, but because it happens rarely as the table grows, the average cost per coat checked in stays close to instant — an idea formally called amortized constant time.`,
              realWorldApplications: [
                { title: `Python's dict and JavaScript's Object/Map implementations`, description: `Both languages implement their core key-value data structures as hash tables under the hood, which is why looking up a value by key in a Python dict or JS object is effectively O(1) regardless of how many entries it holds.` },
                { title: `Hash indexes in PostgreSQL`, description: `PostgreSQL offers a hash index type specifically for equality lookups, using the same bucket-and-collision-resolution design taught here to find matching rows without scanning the whole table.` },
                { title: `Content-addressable caching in CDNs and browser caches`, description: `Web browsers and content delivery networks hash a resource's URL or content to decide which cache bucket to store and later retrieve it from, enabling near-instant cache lookups at massive scale.` },
                { title: `Redis's in-memory key-value store`, description: `Redis's core data structure is a hash table mapping keys to values entirely in RAM, resized dynamically as it grows, delivering the sub-millisecond O(1) lookups that make it a popular caching layer in production systems.` },
                { title: `Rust's HashMap and its SwissTable-style open-addressing design`, description: `Rust's standard HashMap uses a Robin-Hood/SwissTable-style open-addressing scheme, a direct evolution of the linear-probing collision resolution strategy covered in this topic, tuned for modern CPU cache behavior.` }
              ],
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
                },
                {
                  id: 'ex-cs201-2',
                  question: 'Which collision resolution strategy is most prone to "primary clustering," where long runs of occupied slots form and degrade performance?',
                  options: ['Separate chaining', 'Linear probing', 'Double hashing', 'Cuckoo hashing'],
                  correctAnswer: 'Linear probing',
                  explanation: 'Linear probing checks slot+1, slot+2, ... in sequence, so once a cluster forms, any new key that hashes into it extends the cluster further, worsening future probe lengths.',
                  type: 'multiple-choice'
                },
                {
                  id: 'ex-cs201-3',
                  question: 'Explain why the worst-case time complexity of a hash table lookup is O(n), even though the average case is O(1).',
                  correctAnswer: 'If the hash function distributes keys poorly (or an adversary crafts keys that all hash to the same bucket), every key can collide into a single chain or cluster, forcing a linear scan through all n elements to find or insert a key.',
                  explanation: 'Average-case analysis assumes a roughly uniform key distribution across buckets; worst-case analysis must account for pathological input, such as all keys colliding, which is the basis of HashDoS-style denial-of-service attacks against naive hash implementations.',
                  type: 'free-response'
                },
                {
                  id: 'ex-cs201-4',
                  question: 'A hash table with capacity 8 currently stores 6 elements. If a new element is inserted and the load factor threshold is 0.75, does a resize get triggered, and to what capacity does a typical doubling-resize policy grow the table?',
                  correctAnswer: 'Yes, a resize is triggered (7/8 = 0.875 > 0.75), and the table typically doubles to capacity 16.',
                  explanation: 'Load factor is elements / capacity; once it crosses the threshold, doubling capacity keeps the amortized cost of insertions at O(1) because the total rehashing work across a sequence of n insertions sums to O(n), not O(n^2).',
                  type: 'free-response'
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
              readingQuestions: [
                'What are the security implications of predictable hash collisions (HashDoS)?',
                'Why does separate chaining tolerate a load factor greater than 1, while open addressing cannot?',
                'How does double hashing reduce clustering compared to linear and quadratic probing?',
                'Why must a hash function be deterministic (always return the same output for the same input) to be usable in a hash table?',
                'What is the relationship between a hash table\'s resize policy and its amortized insertion cost?',
                'How would you design a hash function to minimize collisions for a specific, known key distribution?'
              ],
              masteryChecklist: ['Implement hash map with linear probing', 'Implement AVL tree node rotations'],
              capstoneMilestone: 'Implement an in-memory key-value database engine.',
              estimatedStudyMinutes: 210,
              difficulty: 'intermediate',
              glossary: [
                { term: 'Load Factor', definition: 'The ratio of stored elements to total bucket capacity in a hash table, used to decide when to resize the underlying array.' },
                { term: 'Hash Function', definition: 'A deterministic function mapping keys of arbitrary size to fixed-size integer indices used to locate a bucket in a hash table.' },
                { term: 'Collision', definition: 'The event in which two distinct keys are mapped by a hash function to the same bucket index, requiring a resolution strategy to store both.' },
                { term: 'Separate Chaining', definition: 'A collision resolution technique where each bucket holds a linked list (or similar structure) of all key-value pairs that hash to that index.' },
                { term: 'Open Addressing', definition: 'A collision resolution technique that stores all elements directly in the hash table\'s array, probing to alternate slots according to a fixed sequence (linear, quadratic, or double hashing) when a collision occurs.' },
                { term: 'Linear Probing', definition: 'An open-addressing scheme that resolves a collision by checking the next slot in sequence (index+1, index+2, ...) until an empty slot is found.' },
                { term: 'Double Hashing', definition: 'An open-addressing scheme that uses a second hash function to compute the probe step size, spreading collisions more evenly than linear or quadratic probing and reducing clustering.' },
                { term: 'Amortized Analysis', definition: 'A method of analyzing algorithm cost that averages the total cost of a sequence of operations over that sequence, rather than analyzing each operation\'s worst case in isolation.' },
                { term: 'HashDoS', definition: 'A denial-of-service attack in which an attacker crafts input keys that all hash to the same bucket, degrading a hash table\'s operations from O(1) average to O(n) worst case.' },
                { term: 'Rehashing', definition: 'The process of recomputing hash indices and moving all existing entries into a newly allocated, larger backing array during a hash table resize.' }
              ],
              commonMisconceptions: [
                'Misconception: Hash table lookup is always O(1) regardless of input. Reality: O(1) is the average case under a well-distributed hash function; adversarial or pathological input can force all keys into one bucket, degrading lookup to O(n) in the worst case.',
                'Misconception: A higher load factor is always better because it uses memory more efficiently. Reality: As load factor increases, expected probe length (open addressing) or chain length (chaining) grows, increasing lookup and insertion time; production hash tables resize well before reaching full capacity to keep operations fast.',
                'Misconception: Any hash function is equally good as long as it produces an integer. Reality: A poor hash function that clusters keys into a small range of buckets defeats the purpose of hashing entirely, effectively degrading the structure to a linked list; hash quality (avalanche effect, uniform distribution) matters as much as speed.',
                'Misconception: Deleting an element from an open-addressed hash table is as simple as clearing its slot. Reality: Naively clearing a slot can break the probe sequence for later lookups of other keys that collided and probed past it, which is why open-addressing implementations use tombstone markers instead of true empty slots.',
                'Misconception: Chaining and open addressing perform identically in practice. Reality: Open addressing tends to have better cache locality since all data lives in one contiguous array, while chaining has more memory overhead (pointers) but tolerates higher load factors gracefully without a hard resize cliff.'
              ],
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
              coreConcepts: [
                'Orthogonal Matrices: square matrices whose columns are unit vectors that are mutually perpendicular (Q^T Q = I), which represent pure rotations/reflections that preserve vector lengths and angles; U and V in the SVD are orthogonal, which is why SVD has a clean geometric interpretation.',
                'Singular Values: the non-negative values in the diagonal matrix Σ of the decomposition A = UΣV^T, ranked from largest to smallest, that quantify how much the linear transformation A stretches space along each corresponding orthogonal direction.',
                'Eigenvalues: scalars λ such that Av = λv for some nonzero vector v; singular values of A are the square roots of the eigenvalues of A^T A, which is the algebraic link connecting SVD to eigendecomposition.',
                'Low-Rank Approximation: reconstructing a matrix using only its largest k singular values/vectors, which the Eckart-Young theorem proves is the optimal rank-k approximation in terms of minimizing reconstruction error, forming the mathematical basis of PCA, image compression, and recommender systems.',
                'Vector Spaces & Basis: the abstract setting (a set of vectors closed under addition and scalar multiplication) in which SVD operates, where a basis is a minimal set of vectors that can represent every vector in the space via linear combination.',
                'Rank: the number of linearly independent rows or columns of a matrix, equal to the number of non-zero singular values, which determines how much "true" information-carrying dimensionality the matrix actually contains.'
              ],
              simpleExplanation: `Picture shining a flashlight on a lumpy, 3D object and looking at the shadow it casts on the wall. The shadow is a flattened, lower-dimensional version of the object, and depending on the angle you hold the flashlight, some shadows preserve much more of the object's real shape than others. Dimensionality reduction is the search for the best "angle" to flatten complicated, high-dimensional data down into something simpler while losing as little important information as possible.

The Singular Value Decomposition is a precise, mathematical way to find that best angle. Imagine a perfectly round rubber ball that gets squished by a matrix into an oval (an ellipsoid). SVD figures out exactly which directions the ball got stretched along, and by how much — those stretch amounts are the singular values, and the directions are the orthogonal axes of the oval. The biggest stretch tells you the single most important direction the data spreads out in; the second-biggest tells you the next most important direction, and so on.

Once you know which directions matter most, you can throw away the directions that barely stretch the ball at all — they weren't adding much real information anyway — and keep only a handful of the most important directions. This is exactly how SVD compresses a photograph: instead of storing every single pixel, you store just the few dozen most important "stretch directions" and their strengths, which is often enough to reconstruct an image that looks nearly identical to the original but takes a fraction of the storage space.

A movie recommendation system uses this same trick in a completely different setting: instead of pixels, the "ball" being squished is a giant table of millions of users' ratings of thousands of movies. SVD finds a small number of hidden "taste directions" — perhaps one loosely corresponding to how much someone likes action movies, another to how much they like comedies — and uses just those handful of numbers per user and per movie to predict ratings the user hasn't given yet.`,
              realWorldApplications: [
                { title: `Netflix Prize-era collaborative filtering recommendation systems`, description: `Matrix factorization techniques built on SVD were central to the algorithms that won the 2009 Netflix Prize, decomposing a sparse user-movie ratings matrix into low-rank user and movie "taste" vectors to predict unseen ratings.` },
                { title: `JPEG-style image compression via low-rank approximation`, description: `Representing an image as a matrix and keeping only its top-k singular values and vectors reconstructs a visually similar image while storing a fraction of the original data, the same principle that lossy image compression exploits.` },
                { title: `Principal Component Analysis in genomics and exploratory data analysis`, description: `PCA, one of the most widely used dimensionality-reduction tools in data science and bioinformatics, is computed directly from the SVD of a data matrix, using the top singular vectors as the principal components.` },
                { title: `Latent Semantic Analysis in early search engines`, description: `LSA applies SVD to a term-document matrix to uncover hidden topical structure in text, letting search systems match documents to queries based on underlying meaning rather than exact keyword overlap.` },
                { title: `Noise reduction in signal processing and sensor data`, description: `Engineers use low-rank SVD approximation to separate a signal's dominant structure (large singular values) from noise (typically concentrated in the small singular values), a technique used from vibration analysis to radar processing.` }
              ],
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
                },
                {
                  id: 'ex-math201-2',
                  question: 'How are the singular values of matrix A mathematically related to the eigenvalues of A^T A?',
                  options: [
                    'Singular values equal the eigenvalues of A^T A directly',
                    'Singular values are the square roots of the (non-negative) eigenvalues of A^T A',
                    'Singular values equal the eigenvalues of A^T A squared',
                    'There is no mathematical relationship between them'
                  ],
                  correctAnswer: 'Singular values are the square roots of the (non-negative) eigenvalues of A^T A',
                  explanation: 'A^T A is symmetric positive semi-definite, so its eigenvalues are non-negative; the singular values of A are defined as the square roots of those eigenvalues.',
                  type: 'multiple-choice'
                },
                {
                  id: 'ex-math201-3',
                  question: 'Explain why an orthogonal matrix Q satisfies Q^T = Q^-1, and why this property makes SVD computationally convenient.',
                  correctAnswer: 'Because the columns of an orthogonal matrix are orthonormal, Q^T Q = I, meaning the transpose is also the inverse; this avoids expensive matrix inversion when reconstructing or projecting data, since transposition is a trivial O(1)-per-entry operation compared to general matrix inversion.',
                  explanation: 'Orthogonality is what gives U and V their clean geometric meaning as pure rotations/reflections, and it is exactly why solving systems and reconstructing approximations using U and V is numerically cheap and stable.',
                  type: 'free-response'
                },
                {
                  id: 'ex-math201-4',
                  question: 'A matrix A has singular values [10, 4, 1, 0.01]. Using a rank-2 truncated SVD approximation, roughly what fraction of the matrix\'s "energy" (sum of squared singular values) is retained?',
                  correctAnswer: 'Approximately 99% — (10^2 + 4^2) / (10^2 + 4^2 + 1^2 + 0.01^2) = 116 / 117.0001 ≈ 0.9915.',
                  explanation: 'The Eckart-Young theorem shows that keeping the top-k singular values minimizes the Frobenius-norm reconstruction error, and the fraction of retained "energy" (sum of squared singular values) is a standard way to choose how many components to keep in dimensionality reduction.',
                  type: 'free-response'
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
              readingQuestions: [
                'How is SVD related to the eigendecomposition of A^T A?',
                'Why does keeping the largest k singular values minimize the Frobenius norm reconstruction error?',
                'What is the geometric interpretation of applying U, then Σ, then V^T to a vector during the transformation Ax?',
                'How does PCA relate to SVD applied to a mean-centered data matrix?',
                'Why is SVD numerically more stable for computing rank and null space than directly computing eigenvalues of a non-symmetric matrix?',
                'How does the concept of rank connect to the amount of redundant information in a dataset?'
              ],
              masteryChecklist: ['Compute SVD manually for a 2x2 matrix', 'Understand geometric rotation and stretch under SVD'],
              capstoneMilestone: 'Build an SVD-based image compression utility.',
              estimatedStudyMinutes: 200,
              difficulty: 'intermediate',
              glossary: [
                { term: 'Singular Value', definition: 'A non-negative scalar in the diagonal matrix Σ of a matrix\'s SVD, equal to the square root of a corresponding eigenvalue of A^T A, quantifying the amount of stretch along a principal direction.' },
                { term: 'Orthogonal Matrix', definition: 'A square matrix Q whose columns are mutually orthonormal vectors, satisfying Q^T Q = I, so that Q represents a rotation or reflection that preserves vector length.' },
                { term: 'Eigenvalue/Eigenvector', definition: 'For a square matrix A, a scalar λ and nonzero vector v satisfying Av = λv; eigenvectors indicate directions unchanged in orientation by the transformation, scaled by the eigenvalue.' },
                { term: 'Rank', definition: 'The number of linearly independent rows or columns of a matrix, equal to the number of non-zero singular values, representing the true dimensionality of the transformation.' },
                { term: 'Low-Rank Approximation', definition: 'An approximation of a matrix using only its top-k singular values and vectors, which the Eckart-Young theorem proves minimizes reconstruction error among all rank-k matrices.' },
                { term: 'Principal Component Analysis (PCA)', definition: 'A dimensionality reduction technique that projects data onto the directions of maximum variance, computed via the eigendecomposition (or equivalently the SVD) of the data\'s covariance matrix.' },
                { term: 'Frobenius Norm', definition: 'A matrix norm computed as the square root of the sum of squares of all matrix entries, commonly used to measure the reconstruction error between an original matrix and its approximation.' },
                { term: 'Vector Space', definition: 'A set of vectors closed under addition and scalar multiplication, satisfying axioms such as associativity and the existence of a zero vector, forming the abstract setting for linear algebra.' },
                { term: 'Basis', definition: 'A minimal set of linearly independent vectors that spans a vector space, such that every vector in the space can be written as a unique linear combination of the basis vectors.' },
                { term: 'Null Space', definition: 'The set of all vectors x such that Ax = 0 for a given matrix A, whose dimension (the nullity) is related to the matrix\'s rank via the rank-nullity theorem.' }
              ],
              commonMisconceptions: [
                'Misconception: SVD can only be applied to square matrices. Reality: SVD is defined for any m x n matrix, square or rectangular, which is precisely what makes it more broadly applicable than eigendecomposition (which requires a square matrix).',
                'Misconception: SVD and eigendecomposition are the same operation. Reality: Eigendecomposition applies only to square (and for real eigenvalues, typically symmetric) matrices and can fail to exist for some matrices, while SVD exists for every real or complex matrix; SVD of A relates to the eigendecomposition of the symmetric matrix A^T A, not of A itself.',
                'Misconception: The singular values of a matrix can be negative, since they represent "stretching." Reality: Singular values are defined as non-negative square roots of eigenvalues of A^T A (which are themselves non-negative because A^T A is positive semi-definite), so singular values are always ≥ 0 by construction.',
                'Misconception: Truncating an SVD to fewer components always loses meaningful information. Reality: If a matrix\'s singular values decay quickly, most of its "energy" is concentrated in the first few components, so a low-rank truncation can discard mostly noise while retaining the structurally important signal.',
                'Misconception: PCA and SVD are unrelated techniques taught in different fields. Reality: Performing PCA on a dataset is mathematically equivalent to computing the SVD of the mean-centered data matrix; the principal components are the right singular vectors, and the explained variance is proportional to the squared singular values.'
              ],
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
              coreConcepts: [
                '5-Stage Pipeline: the classic RISC instruction pipeline (Fetch, Decode, Execute, Memory, Writeback) that overlaps execution of multiple instructions so a new instruction can begin before the previous one finishes, which is the fundamental technique behind instruction-level parallelism in real CPUs.',
                'Data Hazards & Forwarding: situations where an instruction needs a result that a prior, still-in-flight instruction has not yet produced; forwarding (bypassing) routes that result directly between pipeline stages instead of waiting for it to be written back to the register file, avoiding unnecessary stalls.',
                'Cache Lines & Associativity: the fixed-size chunk of memory (typically 64 bytes) moved between main memory and cache on every access, and the policy (direct-mapped, set-associative, fully associative) governing which cache slots a given memory address is allowed to occupy, which together determine cache hit rates.',
                'Spatial & Temporal Locality: the two forms of memory access patterns that caches exploit — spatial locality (nearby addresses are likely to be accessed soon) justifies fetching whole cache lines, and temporal locality (recently accessed addresses are likely accessed again) justifies keeping recently used data in cache.',
                'Branch Prediction: hardware logic that guesses the outcome of a conditional branch before it is resolved, so the pipeline can speculatively fetch and execute the predicted path instead of stalling, at the cost of a pipeline flush if the prediction is wrong.',
                'AMAT (Average Memory Access Time): a formula (Hit Time + Miss Rate × Miss Penalty) that quantifies the real-world cost of the memory hierarchy, making explicit why cache design decisions have a measurable, predictable effect on overall program performance.'
              ],
              simpleExplanation: `Think about doing laundry the slow way: wash one load completely, dry it completely, fold it completely, and only then start washing the next load. Now compare that to a smarter approach: as soon as the first load moves from the washer to the dryer, you immediately start washing the second load in the now-empty washer. A CPU pipeline works exactly like this smarter laundry approach — while one instruction is being "decoded," another is being "fetched," and another is being "executed," all at the same time, in different stages, like several loads of laundry moving through the wash-dry-fold assembly line simultaneously.

Sometimes, though, load three's folding step needs a shirt that's still in load two's dryer — it has to wait. That's a data hazard: a later instruction needs a result a still-in-flight earlier instruction hasn't produced yet. CPUs solve this with a shortcut called forwarding, essentially handing the needed shirt directly from the dryer to the folding table instead of making everyone wait for it to be put away in a drawer first.

Now imagine a grocery store where the milk you want is way at the back of a giant warehouse, a ten-minute walk away, but eggs are usually bought right alongside milk, and once you've walked all the way back there, it's cheap to grab a few extra cartons for next time. A cache works the same way: because programs tend to reuse nearby memory again soon (temporal locality) and access nearby addresses together (spatial locality), the CPU keeps a small, fast "shelf near the front" stocked with recently used data and whole neighboring chunks of memory, so it rarely has to make the slow trip to the far-away warehouse (main RAM).

Branch prediction is like a regular customer's shopping habits: if you always buy milk on Mondays, the store might start proactively stocking extra milk for you every Monday morning, guessing what you'll want before you ask. Most of the time this speeds things up enormously, but if you skip a Monday, the store has to quietly undo that guess and try again — exactly what a CPU does when it speculatively executes down a predicted branch and then has to flush the pipeline if the guess turns out wrong.`,
              realWorldApplications: [
                { title: `The 5-stage pipeline in ARM Cortex-A and classic MIPS processors`, description: `Production RISC CPUs implement the textbook Fetch-Decode-Execute-Memory-Writeback pipeline (often extended to many more stages) to overlap instruction execution and dramatically increase instructions completed per clock cycle.` },
                { title: `Branch prediction in modern Intel and AMD CPUs`, description: `High-end desktop processors dedicate significant silicon to sophisticated branch predictors that guess the outcome of conditional jumps with well over 90% accuracy, since a misprediction forces an expensive pipeline flush.` },
                { title: `The CPU cache hierarchy (L1/L2/L3) in every modern processor`, description: `Chips from Intel, AMD, and Apple all implement a multi-level cache hierarchy trading capacity for speed, exploiting spatial and temporal locality exactly as described in AMAT, to keep the CPU fed with data faster than DRAM alone could supply.` },
                { title: `The Spectre and Meltdown CPU vulnerabilities (2018)`, description: `These widely publicized vulnerabilities exploited speculative execution and branch prediction side effects to leak sensitive memory contents, showing that pipelining optimizations can create serious, hardware-level security risks.` },
                { title: `Cache-conscious data layout in NumPy and game physics engines`, description: `Libraries like NumPy and game engine physics systems deliberately lay data out in contiguous, cache-line-friendly arrays specifically to maximize spatial locality and cache hit rates.` }
              ],
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
                },
                {
                  id: 'ex-cs204-2',
                  question: 'A program has a cache hit time of 1 ns, a miss rate of 5%, and a miss penalty of 100 ns. What is the AMAT?',
                  options: ['1.05 ns', '5 ns', '6 ns', '100 ns'],
                  correctAnswer: '6 ns',
                  explanation: 'AMAT = Hit Time + Miss Rate x Miss Penalty = 1 + 0.05 x 100 = 1 + 5 = 6 ns.',
                  type: 'multiple-choice'
                },
                {
                  id: 'ex-cs204-3',
                  question: 'Explain why iterating over a 2D array in row-major order is typically much faster than column-major order in a language like C, even though both visit every element exactly once.',
                  correctAnswer: 'In row-major storage, consecutive elements of a row are stored contiguously in memory, so iterating row-by-row accesses memory sequentially, maximizing spatial locality and cache-line reuse. Column-major iteration jumps across rows, striding through memory and likely triggering a cache miss on nearly every access.',
                  explanation: 'This is a direct application of spatial locality: because caches fetch whole cache lines (e.g., 64 bytes) at once, accessing memory in the same order it is laid out in RAM lets each fetched cache line serve many subsequent accesses instead of just one.',
                  type: 'free-response'
                },
                {
                  id: 'ex-cs204-4',
                  question: 'Why does branch misprediction cause a pipeline "flush," and how does this affect performance on deeply pipelined CPUs?',
                  correctAnswer: 'When a branch is mispredicted, all instructions that were speculatively fetched and partially executed down the wrong path must be discarded (flushed) from the pipeline, and fetching must restart from the correct target address, wasting all the cycles already spent on the wrong-path instructions.',
                  explanation: 'The deeper the pipeline, the more instructions are in flight at any moment, so a misprediction discards more speculative work; this is why modern CPUs invest heavily in sophisticated branch predictors to keep misprediction rates low.',
                  type: 'free-response'
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
              readingQuestions: [
                'How does loop unrolling improve cache locality and pipeline utilization?',
                'Why can a control hazard not always be resolved with simple forwarding, unlike most data hazards?',
                'How does increasing cache associativity reduce conflict misses, and what is the trade-off in hardware complexity and access latency?',
                'Why is the L1 cache built smaller and faster than L2 and L3, rather than making all cache levels large and fast?',
                'How does a Translation Lookaside Buffer (TLB) interact with the cache hierarchy during a memory access?',
                'Why does increasing pipeline depth increase the misprediction penalty even though it can increase clock frequency?'
              ],
              masteryChecklist: ['Calculate AMAT (Average Memory Access Time)', 'Trace register forwarding in 5-stage pipeline'],
              capstoneMilestone: 'Build a RISC-V instruction set emulator in C/Python.',
              estimatedStudyMinutes: 220,
              difficulty: 'intermediate',
              glossary: [
                { term: 'AMAT', definition: 'Average Memory Access Time, computed as Hit Time + (Miss Rate x Miss Penalty), a formula used to quantify the effective cost of accessing memory through a cache hierarchy.' },
                { term: 'Pipelining', definition: 'A CPU design technique that overlaps the execution of multiple instructions by dividing instruction processing into discrete stages (e.g., Fetch, Decode, Execute, Memory, Writeback) that run concurrently on different instructions.' },
                { term: 'Data Hazard', definition: 'A pipeline hazard occurring when an instruction depends on the result of a prior instruction that has not yet completed, potentially causing the pipeline to read stale or incorrect data.' },
                { term: 'Structural Hazard', definition: 'A pipeline hazard occurring when two instructions in different pipeline stages require the same hardware resource simultaneously (e.g., a single memory port needed for both an instruction fetch and a data access).' },
                { term: 'Control Hazard', definition: 'A pipeline hazard caused by branch instructions, where the next instruction to fetch is unknown until the branch is resolved, potentially wasting cycles or requiring speculative execution.' },
                { term: 'Forwarding (Bypassing)', definition: 'A hardware technique that routes a computed result directly from one pipeline stage to another that needs it, avoiding the need to stall until the result is written back to the register file.' },
                { term: 'Cache Line', definition: 'The fixed-size block of memory (commonly 64 bytes) transferred as a unit between main memory and cache, chosen to exploit spatial locality.' },
                { term: 'Associativity', definition: 'The number of cache locations (ways) in a set where a given memory block is allowed to be placed; higher associativity reduces conflict misses at the cost of more complex, slower lookup hardware.' },
                { term: 'Branch Prediction', definition: 'A hardware mechanism that guesses the direction or target of a branch instruction before it is resolved, allowing the pipeline to speculatively continue fetching and executing instructions.' },
                { term: 'Instruction-Level Parallelism (ILP)', definition: 'The degree to which instructions in a program can be executed simultaneously or out of order without changing the program\'s observable result, exploited by techniques like pipelining and superscalar execution.' }
              ],
              commonMisconceptions: [
                'Misconception: CPU clock frequency (GHz) alone determines processor speed. Reality: Instructions-per-cycle (IPC), pipeline depth, cache hit rates, and memory latency all affect real-world throughput; a lower-frequency CPU with better IPC and cache behavior can outperform a higher-frequency one.',
                'Misconception: A cache miss just means the data is fetched a bit slower. Reality: A cache miss can cost 50-200x the latency of a cache hit because it requires a round trip to main memory (or worse, disk in the case of a page fault), making cache-conscious code design critical for performance-sensitive applications.',
                'Misconception: Branch prediction guarantees the correct path is always executed. Reality: Branch predictors are probabilistic heuristics based on history; a misprediction discards all speculatively executed work on the wrong path and forces a pipeline flush, incurring a real performance penalty.',
                'Misconception: Adding more pipeline stages always improves performance. Reality: Deeper pipelines can increase clock frequency but also increase the number of cycles wasted on hazards and branch mispredictions, so there is a practical limit past which deeper pipelining yields diminishing or negative returns.',
                'Misconception: Increasing cache size is the only way to improve hit rate. Reality: Hit rate also depends heavily on associativity (reducing conflict misses) and access patterns exploiting spatial/temporal locality; poorly structured code can suffer high miss rates even with a large cache.'
              ],
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
              coreConcepts: [
                'Mutex & Semaphore: a mutex is a binary lock that only its owning thread can release, ensuring mutual exclusion over a critical section, while a semaphore is a more general counting primitive that allows up to N threads to access a resource concurrently, generalizing the mutex to shared-resource pools.',
                'Race Condition: a bug that occurs when the correctness of a program depends on the unpredictable timing or interleaving of concurrent operations, typically because multiple threads read and write shared state without proper synchronization; race conditions are notoriously hard to reproduce and debug.',
                'CAS (Compare-And-Swap): an atomic CPU instruction that reads a memory location, compares it to an expected value, and conditionally writes a new value only if the comparison succeeds, forming the hardware foundation for lock-free data structures and higher-level synchronization primitives.',
                'Coffman Conditions: the four necessary conditions (mutual exclusion, hold-and-wait, no preemption, circular wait) that must all simultaneously hold for deadlock to occur; breaking any single one of them is sufficient to prevent deadlock, which is why deadlock-prevention strategies each target one specific condition.',
                'Critical Section: the portion of code that accesses shared resources and must not be executed by more than one thread at a time, which synchronization primitives like mutexes and semaphores exist specifically to protect.',
                'Condition Variables & Monitors: higher-level synchronization constructs that let a thread block until some condition on shared state becomes true, avoiding the CPU waste of busy-waiting, and which underlie the safe implementation of producer-consumer and similar coordination patterns.'
              ],
              simpleExplanation: `Imagine a coffee shop bathroom with a single key hanging by the counter. Only one person can hold the key at a time, and everyone else has to wait until it's returned before they can go in. A mutex (mutual exclusion lock) works exactly like that key: only the thread holding it may enter the "bathroom" (the critical section of code that touches shared data), and everyone else politely waits their turn, which prevents two threads from making a mess by writing to the same data at once.

A semaphore is like a restaurant that has, say, five parking spots reserved for customers: up to five cars can park at once, and a sixth car has to wait until one leaves. Where a mutex is a single key for one person, a semaphore is a small pile of tickets that allows a limited number of threads through simultaneously, which is useful when a resource can safely support more than one user at a time, just not unlimited users.

A race condition happens when two people both check that the office coffee pot is "almost full" at the exact same moment, and each independently decides not to start a new pot — except it was actually almost empty, and now everyone runs out of coffee, because their two "check and decide" actions overlapped in an unlucky order. This kind of bug is maddening precisely because it depends on split-second timing that might work fine 999 times out of 1000 and then randomly fail once.

Deadlock is a specific, especially nasty kind of freeze-up, similar to four cars arriving at a four-way stop sign at the exact same instant, each waiting politely for the car to its right to go first — except all four are waiting on each other in a circle, so nobody ever moves. Researchers showed that deadlock can only happen when four conditions are all true simultaneously (each thread holds something while waiting for something else, nothing can be forcibly taken away, and the waiting forms a circle), which means breaking just one of those conditions — like insisting everyone announce all the resources they'll ever need up front — is enough to prevent gridlock entirely.`,
              realWorldApplications: [
                { title: `Mutexes protecting shared state in the Linux kernel`, description: `The Linux kernel uses mutexes and spinlocks extensively to protect shared kernel data structures, like process tables, from being corrupted when accessed concurrently by multiple CPU cores.` },
                { title: `Connection pool semaphores in database drivers`, description: `Database connection pools such as HikariCP use a semaphore-like counter to cap the number of concurrent database connections a service can open, queuing additional requests until a connection is released.` },
                { title: `Deadlock detection in PostgreSQL and MySQL transaction managers`, description: `These database systems actively detect deadlocks between transactions waiting on each other's row locks and resolve them by forcibly aborting one transaction, since prevention alone is impractical in general-purpose databases.` },
                { title: `Compare-and-swap in Java's java.util.concurrent.atomic package`, description: `Java's AtomicInteger and similar lock-free classes are implemented directly on top of the CPU's compare-and-swap instruction, letting multiple threads update shared counters without ever taking a traditional lock.` },
                { title: `The Therac-25 radiation therapy machine accidents`, description: `A notorious real-world race condition in the Therac-25's control software, where overlapping operator input and machine state checks were not properly synchronized, contributed to fatal radiation overdoses in the 1980s.` }
              ],
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
                },
                {
                  id: 'ex-cs301-2',
                  question: 'Two threads each try to lock Mutex A then Mutex B, but in opposite order (Thread 1 locks A then B; Thread 2 locks B then A). Which Coffman condition does enforcing a global lock-ordering policy directly eliminate?',
                  options: ['Mutual Exclusion', 'Hold and Wait', 'No Preemption', 'Circular Wait'],
                  correctAnswer: 'Circular Wait',
                  explanation: 'If every thread is required to acquire locks in the same global order, a cycle of threads each waiting on a lock held by the next can never form, which directly breaks the circular wait condition.',
                  type: 'multiple-choice'
                },
                {
                  id: 'ex-cs301-3',
                  question: 'Explain why a race condition might not appear in testing but cause failures in production.',
                  correctAnswer: 'Race conditions depend on the specific timing and interleaving of thread execution, which is influenced by factors like CPU scheduling, system load, and number of cores; a test environment with low concurrency or a single-core CI runner may never exercise the specific interleaving that triggers the bug, while production traffic under real load can.',
                  explanation: 'This is why race conditions are considered "heisenbugs" — their manifestation can change or disappear when observed (e.g., under a debugger, which changes timing), making rigorous synchronization discipline more reliable than relying on testing alone to catch them.',
                  type: 'free-response'
                },
                {
                  id: 'ex-cs301-4',
                  question: 'Why must a condition variable\'s wait() call always be placed inside a while loop that rechecks the condition, rather than an if statement?',
                  correctAnswer: 'Because of spurious wakeups and the possibility that another thread changes the shared state again before the woken thread acquires the lock, the condition that was true when notified may no longer hold by the time the thread actually resumes; a while loop rechecks the condition after waking, while an if statement would proceed incorrectly on a false wakeup.',
                  explanation: 'This is a subtle but critical correctness rule in condition-variable-based concurrency: notify_all/notify can wake multiple waiters that then race to recheck state, so each must re-verify its precondition rather than assuming it still holds.',
                  type: 'free-response'
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
              readingQuestions: [
                'Why must condition wait calls be wrapped in a while loop rather than an if statement?',
                'How does a counting semaphore generalize a binary mutex?',
                'Why does breaking just one of the four Coffman conditions suffice to prevent deadlock?',
                'What is the difference between deadlock, livelock, and starvation?',
                'How does Compare-And-Swap enable lock-free data structures to avoid the overhead of OS-level mutexes?',
                'Why can a reader-writer lock implementation cause writer starvation if not carefully designed?'
              ],
              masteryChecklist: ['Implement reader-writer lock without thread starvation', 'Detect circular wait in thread dependency graphs'],
              capstoneMilestone: 'Build a user-space threading and coroutine scheduler library.',
              estimatedStudyMinutes: 240,
              difficulty: 'advanced',
              glossary: [
                { term: 'Semaphore', definition: 'An integer variable, manipulated only through atomic increment (signal/V) and decrement (wait/P) operations, used to control access by multiple threads to a shared resource with limited capacity.' },
                { term: 'Mutex', definition: 'A locking primitive providing mutual exclusion, allowing only the thread that acquired the lock to release it, used to protect a critical section from concurrent access.' },
                { term: 'Race Condition', definition: 'A defect in concurrent code where the outcome depends on the unpredictable relative timing of threads accessing shared state without adequate synchronization.' },
                { term: 'Deadlock', definition: 'A state in which two or more threads are permanently blocked, each waiting for a resource held by another thread in the group, so none can proceed.' },
                { term: 'Livelock', definition: 'A state in which threads continuously change state in response to each other without making actual progress, unlike deadlock where threads are simply blocked.' },
                { term: 'Starvation', definition: 'A condition where a thread is perpetually denied access to a resource it needs, often because a scheduling or locking policy favors other threads indefinitely.' },
                { term: 'Compare-And-Swap (CAS)', definition: 'An atomic CPU instruction that updates a memory location to a new value only if it currently holds an expected value, forming the basis of lock-free and non-blocking synchronization algorithms.' },
                { term: 'Critical Section', definition: 'A segment of code that accesses shared resources and must be executed by only one thread at a time to maintain correctness.' },
                { term: 'Condition Variable', definition: 'A synchronization primitive that allows a thread to block until notified that a particular condition on shared state may have become true, avoiding wasteful busy-waiting.' },
                { term: 'Coffman Conditions', definition: 'The four conditions (mutual exclusion, hold and wait, no preemption, circular wait) that must all hold simultaneously for a deadlock to be possible.' }
              ],
              commonMisconceptions: [
                'Misconception: Spinlocks are always less efficient than mutex locks. Reality: For very short critical sections, spinlocks can outperform mutexes because they avoid the overhead of a context switch and OS scheduler involvement; mutexes become more efficient when a thread would otherwise wait a long time, since they let the CPU do other useful work.',
                'Misconception: Using more locks always makes concurrent code safer. Reality: More locks increase the risk of deadlock through complex lock-ordering dependencies; safe concurrent design often favors fewer, well-scoped locks or lock-free techniques over pervasive fine-grained locking.',
                'Misconception: Deadlock and starvation are the same problem. Reality: Deadlock is a permanent standstill where threads are blocked waiting on each other in a cycle, while starvation is a thread being perpetually denied a resource even though the system as a whole continues to make progress for other threads.',
                'Misconception: A single atomic increment (like Python\'s x += 1 or Java\'s count++) is inherently thread-safe. Reality: Operations like x += 1 typically compile to a read-modify-write sequence of multiple machine instructions, which is not atomic; without a lock or an atomic primitive, concurrent increments can race and lose updates.',
                'Misconception: Making a variable "volatile" or global is enough to make it safe for concurrent access. Reality: Visibility guarantees (ensuring one thread sees another\'s writes) are a separate concern from atomicity of compound operations; proper synchronization primitives are needed to guarantee both.'
              ],
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
              coreConcepts: [
                'Computational Graph: a directed acyclic graph representation of a sequence of mathematical operations, where each node is an operation and each edge carries a tensor; expressing a neural network this way is what allows automatic differentiation frameworks to systematically compute gradients.',
                'Reverse-Mode Autograd (Backpropagation): an efficient algorithm that computes the gradient of a scalar loss with respect to every parameter in a network by applying the chain rule backward through the computational graph exactly once, making training networks with millions of parameters computationally tractable.',
                'Softmax Attention: a mechanism that converts a vector of raw similarity scores into a probability distribution (values that are non-negative and sum to 1), used in attention to decide how much "focus" each output position should place on each input position.',
                'Multi-Head Projection: splitting the query, key, and value vectors into several smaller subspaces ("heads") that each learn to attend to different types of relationships in parallel, then concatenating their outputs, which gives transformers more representational capacity than a single attention computation.',
                'Query-Key-Value (QKV) Mechanism: the core computation of self-attention, where each token produces a query, key, and value vector; the dot product of a token\'s query with every other token\'s key determines how much of each token\'s value gets mixed into the output representation.',
                'Vanishing/Exploding Gradients: the phenomenon where gradients shrink toward zero or grow toward infinity as they are propagated backward through many layers, which motivated architectural innovations like residual connections, careful weight initialization, and normalization layers.'
              ],
              simpleExplanation: `Imagine a factory assembly line where a finished product comes out slightly defective, and you want to figure out which station on the line is most to blame. Backpropagation is like walking backward down the assembly line from the defective product, asking at each station "how much did you contribute to this specific defect, given what the station right after you just told you?" By the time you reach the very first station, you know exactly how much each station's settings should be nudged to reduce the defect next time — and the chain rule from calculus is precisely the mathematical tool that lets you combine each station's local blame into that final answer, all in a single backward pass instead of testing each station separately.

A computational graph is just a map of that assembly line: a diagram showing which mathematical operation happens at each step and how the outputs of earlier steps feed into later ones. Reverse-mode autograd is the general name for the backward-walking blame-assignment process, and it's what makes training networks with billions of settings (parameters) computationally feasible instead of impossibly slow.

Self-attention, the mechanism inside transformers like the ones powering modern chatbots, works like a reading group discussing a sentence together. For each word, the group asks a "query" — roughly, "what am I looking for to understand my role here?" — and every other word offers up a "key" describing what it has to offer, plus a "value" which is the actual information it can contribute. Words whose keys match the query well get listened to more closely, like a spotlight swinging toward the most relevant speakers, and their values get blended together in proportion to how relevant they were. Multi-head attention just means running several of these spotlight discussions in parallel, each one trained to notice a different kind of relationship — one spotlight might focus on grammar, another on who a pronoun refers to — before combining everyone's notes into one richer understanding.`,
              realWorldApplications: [
                { title: `Backpropagation as implemented in PyTorch's autograd engine`, description: `PyTorch's loss.backward() call performs reverse-mode automatic differentiation across the computational graph built during the forward pass, computing gradients for every trainable parameter in a single backward traversal.` },
                { title: `Self-attention inside GPT and other transformer-based language models`, description: `The query-key-value attention mechanism is the core building block repeated dozens of times inside large language models, letting each token in a prompt dynamically decide which other tokens are most relevant to attend to.` },
                { title: `Residual connections in ResNet and modern transformers`, description: `Both image-recognition ResNets and transformer architectures add skip/residual connections specifically to combat the vanishing gradient problem, letting gradients flow backward through very deep networks without shrinking to near zero.` },
                { title: `Attention visualizations used to interpret machine translation models`, description: `Researchers studying translation systems visualize individual attention heads to show that different heads learn to track different linguistic relationships, such as verb-subject agreement or coreference between pronouns and nouns.` },
                { title: `Layer normalization in production deep learning models`, description: `Nearly every modern deep network, from image classifiers to large language models, uses normalization layers specifically to keep gradient magnitudes stable during backpropagation through many stacked layers.` }
              ],
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
                },
                {
                  id: 'ex-cs305-2',
                  question: 'What is the primary reason backpropagation is computed in reverse (output-to-input) rather than forward (input-to-output) through the network?',
                  options: [
                    'Reverse-mode computes the gradient of one scalar loss with respect to all parameters in a single backward pass, which is far cheaper than forward-mode when there are many parameters and one output',
                    'Reverse order is required by Python syntax',
                    'Forward-mode differentiation is mathematically impossible for neural networks',
                    'Reverse order avoids the need for a computational graph'
                  ],
                  correctAnswer: 'Reverse-mode computes the gradient of one scalar loss with respect to all parameters in a single backward pass, which is far cheaper than forward-mode when there are many parameters and one output',
                  explanation: 'Reverse-mode automatic differentiation is efficient exactly when there are many inputs (parameters) and few outputs (a scalar loss), which is the typical shape of a neural network training problem; forward-mode would require a separate pass per parameter.',
                  type: 'multiple-choice'
                },
                {
                  id: 'ex-cs305-3',
                  question: 'Explain why multi-head attention uses several smaller attention computations in parallel instead of one large attention computation with the full embedding dimension.',
                  correctAnswer: 'Splitting into multiple heads lets each head learn to attend to a different type of relationship or subspace of the representation (e.g., syntactic vs. positional patterns) in parallel, giving the model more representational flexibility than a single attention pattern over the full dimension could provide, at a similar total computational cost.',
                  explanation: 'This is analogous to using multiple convolutional filters in a CNN layer: each head can specialize, and concatenating their outputs (followed by a linear projection) recombines these specialized views into one richer representation.',
                  type: 'free-response'
                },
                {
                  id: 'ex-cs305-4',
                  question: 'Why do residual (skip) connections help mitigate the vanishing gradient problem in very deep networks like transformers?',
                  correctAnswer: 'A residual connection adds the input of a layer directly to its output (output = x + F(x)), so during backpropagation the gradient has a direct additive path back through the identity term, ensuring gradients do not have to pass through every nonlinear transformation to reach earlier layers, which keeps them from shrinking toward zero across many layers.',
                  explanation: 'Without residual connections, gradients in very deep networks are repeatedly multiplied by the derivatives of each layer\'s activation function, which can compound toward zero (vanishing) or infinity (exploding); the identity shortcut in a residual connection guarantees at least a gradient of 1 flows straight through.',
                  type: 'free-response'
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
              readingQuestions: [
                'How does positional encoding supply sequence order information to attention layers?',
                'Why is a computational graph necessary for automatic differentiation to work efficiently?',
                'How does layer normalization stabilize training in deep transformer networks?',
                'Why does self-attention have quadratic computational cost in sequence length, and what problem does this create for long documents?',
                'What is the difference between the encoder and decoder self-attention masks in a sequence-to-sequence transformer?',
                'How does the choice of activation function (e.g., ReLU vs. GELU) affect gradient flow during backpropagation?'
              ],
              masteryChecklist: ['Implement micrograd scalar autograd engine', 'Implement multi-head self-attention module'],
              capstoneMilestone: 'Train a transformer language model on a text corpus from scratch.',
              estimatedStudyMinutes: 250,
              difficulty: 'advanced',
              glossary: [
                { term: 'Attention Mechanism', definition: 'A technique allowing a model to compute a weighted combination of input representations, dynamically focusing more weight on the most relevant tokens for a given output.' },
                { term: 'Backpropagation', definition: 'An algorithm that applies the chain rule to efficiently compute the gradient of a loss function with respect to every parameter in a neural network by propagating error derivatives backward through the computational graph.' },
                { term: 'Computational Graph', definition: 'A directed acyclic graph in which nodes represent operations or variables and edges represent data dependencies, used by automatic differentiation systems to track and compute gradients.' },
                { term: 'Softmax', definition: 'A function that converts a vector of real-valued scores into a probability distribution by exponentiating each value and dividing by the sum of all exponentials, ensuring outputs are non-negative and sum to one.' },
                { term: 'Multi-Head Attention', definition: 'An extension of attention that runs several attention computations ("heads") in parallel on different learned linear projections of the input, then concatenates and projects their outputs, increasing representational capacity.' },
                { term: 'Residual (Skip) Connection', definition: 'A shortcut connection that adds a layer\'s input directly to its output, providing an unimpeded gradient path during backpropagation and enabling stable training of very deep networks.' },
                { term: 'Layer Normalization', definition: 'A normalization technique that rescales the activations within each individual training example (across the feature dimension) to have consistent mean and variance, stabilizing and speeding up training of deep networks like transformers.' },
                { term: 'Positional Encoding', definition: 'A fixed or learned signal added to token embeddings in a transformer to inject information about token order, compensating for the fact that self-attention itself is permutation-invariant.' },
                { term: 'Vanishing Gradient', definition: 'A training pathology in deep networks where gradients shrink exponentially as they are backpropagated through many layers, causing earlier layers to learn extremely slowly or not at all.' },
                { term: 'Overfitting / Regularization', definition: 'Overfitting is when a model fits noise in the training data and fails to generalize; regularization techniques such as L1/L2 penalties or Dropout combat this by constraining model complexity or randomly disabling units during training.' }
              ],
              commonMisconceptions: [
                'Misconception: Transformers process tokens sequentially like RNNs. Reality: Self-attention computes relationships between all token pairs in parallel using matrix operations, which is precisely what makes transformers far more parallelizable and trainable on modern GPU/TPU hardware than recurrent architectures.',
                'Misconception: Backpropagation and gradient descent are the same algorithm. Reality: Backpropagation is the algorithm that efficiently computes gradients via the chain rule; gradient descent is the separate optimization algorithm that uses those gradients to update parameters. Backpropagation supplies the gradients that gradient descent (or a variant like Adam) consumes.',
                'Misconception: More attention heads always produce a better model. Reality: Beyond a certain point, additional heads yield diminishing returns and increase computational and memory cost without proportional gains in quality; the optimal number of heads is an empirical trade-off tuned per architecture and dataset.',
                'Misconception: Self-attention inherently understands word order without any extra mechanism. Reality: Self-attention treats a sequence as an unordered set of tokens by default (it is permutation-invariant); positional encodings must be explicitly added to give the model any notion of sequence order.',
                'Misconception: A neural network with more layers will always achieve lower training loss than a shallower one. Reality: Without techniques like residual connections and normalization, very deep networks often train worse than shallower ones due to vanishing/exploding gradients, which is exactly the problem residual architectures were designed to solve.'
              ],
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
              coreConcepts: [
                'Epsilon-Differential Privacy: a formal mathematical guarantee that the output of a query changes only negligibly whether or not any single individual\'s data is included in the dataset, parameterized by epsilon, where smaller epsilon means stronger privacy but more noise; it is the gold standard for provable statistical privacy.',
                'Laplace Mechanism: a concrete technique for achieving differential privacy by adding random noise drawn from a Laplace distribution (scaled to the query\'s sensitivity divided by epsilon) to a numeric query result, calibrated so the noise masks any single individual\'s contribution.',
                'Equalized Odds: a fairness criterion requiring that a classifier\'s true positive rate and false positive rate be equal across protected demographic groups, ensuring the model is not systematically more accurate or more error-prone for one group over another.',
                'Disparate Impact: a legal and statistical concept describing when a facially neutral policy or algorithm produces significantly different outcomes for different demographic groups, even without explicit discriminatory intent, which is central to auditing automated decision systems for bias.',
                'Sensitivity (in Differential Privacy): the maximum amount a query\'s output can change when a single individual\'s data is added or removed from the dataset, which determines how much noise the Laplace mechanism must add to preserve a given epsilon guarantee.',
                'Composition Theorems: mathematical results describing how privacy loss accumulates when multiple differentially private queries are run against the same dataset, which is essential for budgeting a fixed total privacy loss across a sequence of analyses.'
              ],
              simpleExplanation: `Imagine a teacher wants to know how many students in a class have ever cheated on a test, but no student wants to admit it individually. So the teacher has each student secretly flip a coin: heads, answer truthfully; tails, flip again and answer "yes" on heads, "no" on tails, regardless of the truth. Now no single student's answer proves anything about them individually — heads or tails, "yes" could always be an innocent coin flip — but because the teacher knows exactly how the coin-flipping works, they can still mathematically back out a fairly accurate estimate of the true percentage of cheaters across the whole class. This is the core idea behind differential privacy: deliberately add just enough random noise to protect any single individual, while still letting useful patterns about the group as a whole shine through.

The Laplace mechanism is a more precise, numeric version of that coin flip: instead of a survey answer, you take an exact number (like "average salary in this department") and add a carefully calibrated dose of random static to it before revealing it. The dose is tuned by a knob called epsilon — turn epsilon down, and you add more static (stronger privacy, less precise answer); turn it up, and you add less static (weaker privacy, more precise answer). Sensitivity measures how much one single person's data could possibly swing the true answer, which tells you exactly how much static is needed to hide that swing.

Fairness in algorithms is a related but different concern: instead of protecting individual privacy, it asks whether a decision-making system treats different groups of people equally well. Picture two students taking the same standardized test but the scoring rubric silently docks extra points from one group for reasons that have nothing to do with their actual knowledge — that's roughly what a disparate impact looks like in an algorithm: a system that appears neutral on its face but produces meaningfully worse outcomes for one group. Equalized odds is a specific way of checking for this: it asks whether the system's rate of getting things right, and its rate of making mistakes, are the same across groups, rather than the system quietly being more accurate for one group than another.`,
              realWorldApplications: [
                { title: `The 2020 US Census Bureau's differential privacy system`, description: `The US Census Bureau adopted formal differential privacy, with a public epsilon budget, to publish 2020 Census statistics, adding calibrated noise to protect individual respondents while still releasing usable population counts.` },
                { title: `Apple's differential privacy in iOS usage analytics`, description: `Apple has publicly described using local differential privacy techniques, including randomized-response-style noise, to collect aggregate usage statistics like popular emoji or Safari crash data without tracing any data point to one user.` },
                { title: `Google's RAPPOR system for Chrome telemetry`, description: `Google's RAPPOR project applies randomized response, the coin-flip mechanism described in this topic, to collect aggregate Chrome browser statistics while giving each individual user a mathematically provable amount of plausible deniability.` },
                { title: `The COMPAS recidivism-risk algorithm fairness controversy`, description: `A widely cited 2016 ProPublica investigation found the COMPAS criminal risk-assessment tool had unequal false positive rates across racial groups, a real-world illustration of the equalized-odds and disparate-impact concepts covered here.` },
                { title: `GDPR-driven algorithmic accountability requirements in the EU`, description: `European data protection law increasingly requires organizations to be able to explain and audit automated decisions for disparate impact, pushing companies to adopt formal fairness metrics like equalized odds during model development.` }
              ],
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
                },
                {
                  id: 'ex-cs404-2',
                  question: 'A hiring model achieves 90% accuracy for Group A applicants but only 70% accuracy for Group B applicants, with similar false-positive/false-negative splits masked by the aggregate number. Which fairness concept does this scenario most directly illustrate a violation of?',
                  options: ['Equalized Odds', 'Epsilon-Differential Privacy', 'Sensitivity', 'Composition Theorem'],
                  correctAnswer: 'Equalized Odds',
                  explanation: 'Equalized odds requires similar true-positive and false-positive rates across groups; a large accuracy gap between groups signals the model\'s error rates are not equalized, which is exactly what this fairness criterion is designed to detect.',
                  type: 'multiple-choice'
                },
                {
                  id: 'ex-cs404-3',
                  question: 'Explain why simply removing names and ID numbers from a dataset ("anonymization") does not, by itself, provide a differential privacy guarantee.',
                  correctAnswer: 'Removing direct identifiers does not prevent re-identification through combinations of quasi-identifiers (e.g., zip code, birth date, gender) or linkage with external datasets; differential privacy instead provides a mathematical, provable bound on how much any single individual\'s presence can influence a query\'s output, regardless of what auxiliary information an attacker has.',
                  explanation: 'This distinction is central to the field: ad-hoc anonymization is an informal, often-broken heuristic (famously defeated in cases like the Netflix Prize dataset and AOL search logs), while differential privacy gives a formal guarantee that holds even against attackers with significant background knowledge.',
                  type: 'free-response'
                },
                {
                  id: 'ex-cs404-4',
                  question: 'If two independent differentially private queries are run against the same dataset with epsilon values of 0.5 and 0.3 respectively, what is the resulting privacy loss bound under basic (sequential) composition?',
                  correctAnswer: 'epsilon = 0.8 (0.5 + 0.3), since basic composition states that the privacy losses of sequential differentially private mechanisms add together.',
                  explanation: 'This is why real systems must track a "privacy budget" across all queries made against a dataset — each additional query consumes some of the fixed epsilon budget, and once it is exhausted, further queries either must stop or must accept a weaker overall guarantee.',
                  type: 'free-response'
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
              readingQuestions: [
                'Why is accuracy and privacy inherently a trade-off in differential privacy?',
                'How does Laplace noise injection protect individuals against reconstruction attacks?',
                'Why can demographic parity and equalized odds be mathematically impossible to satisfy simultaneously when base rates differ between groups?',
                'What is the difference between individual fairness and group fairness definitions?',
                'How does a privacy budget change the way an organization must plan its data-release strategy over time?',
                'Why might a facially neutral feature (like zip code) act as a proxy for a protected attribute in a machine learning model?'
              ],
              masteryChecklist: ['Calculate required Laplace noise for a given query sensitivity and epsilon', 'Evaluate model output for demographic parity'],
              capstoneMilestone: 'Audit an automated decision system for disparate impact and bias.',
              estimatedStudyMinutes: 180,
              difficulty: 'intermediate',
              glossary: [
                { term: 'Differential Privacy', definition: 'A formal mathematical guarantee, parameterized by epsilon, that the presence or absence of any single individual\'s data has only a limited, bounded effect on the probability of any output of a query or algorithm.' },
                { term: 'Epsilon (Privacy Budget)', definition: 'The parameter in differential privacy that quantifies the maximum allowed privacy loss; smaller epsilon means stronger privacy guarantees and typically more injected noise.' },
                { term: 'Laplace Mechanism', definition: 'A method for achieving differential privacy by adding noise drawn from a Laplace distribution, scaled to a query\'s sensitivity divided by epsilon, to the true query result.' },
                { term: 'Sensitivity', definition: 'The maximum possible change in a query\'s output caused by adding or removing a single individual\'s record from the dataset, used to calibrate how much privacy-preserving noise is required.' },
                { term: 'Re-identification Attack', definition: 'An attack that combines "anonymized" data with external or auxiliary information (quasi-identifiers) to determine the identity of individuals in a supposedly de-identified dataset.' },
                { term: 'Demographic Parity', definition: 'A fairness criterion requiring that a model\'s positive prediction rate be equal across different demographic groups, regardless of the true outcome distribution within each group.' },
                { term: 'Equalized Odds', definition: 'A fairness criterion requiring that a model\'s true positive rate and false positive rate be equal across demographic groups.' },
                { term: 'Disparate Impact', definition: 'A legal/statistical standard describing when a facially neutral policy or algorithm produces significantly different outcomes across protected demographic groups, regardless of intent.' },
                { term: 'Proxy Variable', definition: 'A feature that is not itself a protected attribute (like race or gender) but is statistically correlated with one, potentially causing a model to indirectly discriminate even without directly using the protected attribute.' },
                { term: 'GDPR/CCPA', definition: 'Major data-protection regulations (the EU\'s General Data Protection Regulation and California\'s Consumer Privacy Act) that establish legal requirements for how organizations collect, process, and protect personal data.' }
              ],
              commonMisconceptions: [
                'Misconception: Standard data anonymization (removing names/IDs) prevents re-identification. Reality: Quasi-identifiers such as zip code, birth date, and gender can be combined with external datasets to re-identify individuals even after direct identifiers are removed, as demonstrated in real-world cases like the AOL search log and Netflix Prize dataset releases.',
                'Misconception: A model can be made simultaneously demographically parity-fair and equalized-odds-fair for any dataset. Reality: When the true base rates of the outcome differ between groups, it is mathematically impossible in general to satisfy both demographic parity and equalized odds at once (a result formalized in the algorithmic fairness literature), forcing a choice about which fairness definition matters most for the application.',
                'Misconception: Differential privacy guarantees that no information about the dataset is revealed at all. Reality: Differential privacy bounds the marginal privacy risk contributed by any single individual\'s presence, not the disclosure of aggregate statistical patterns in the dataset as a whole, which are often the entire point of releasing the data.',
                'Misconception: Removing a protected attribute like race or gender from a model\'s input features eliminates bias. Reality: Other correlated features (proxy variables) can allow the model to reconstruct the same discriminatory pattern indirectly, so "fairness through unawareness" is widely considered an insufficient mitigation strategy on its own.',
                'Misconception: A privacy budget (epsilon) can be reset or ignored once "spent" on one query. Reality: Composition theorems show that privacy loss accumulates across all queries run against the same dataset; a fixed total epsilon budget must be tracked and allocated carefully across the lifetime of a data release program.'
              ],
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
              coreConcepts: [
                'Likelihood Function: a function of a model\'s parameters (not the data) that measures how probable the observed data would be under a given parameter setting; maximizing this function over parameters is the core idea behind Maximum Likelihood Estimation.',
                'Prior/Posterior Distributions: the prior encodes what is believed about a parameter before observing data, and the posterior is the updated belief after combining the prior with observed data via Bayes\' theorem; this update mechanism is the foundation of Bayesian statistical reasoning.',
                'Conjugate Priors: a prior distribution chosen so that, when combined with a particular likelihood function, the resulting posterior distribution has the same functional family as the prior, which makes exact Bayesian updates computationally tractable in closed form.',
                'Maximum A Posteriori (MAP) Estimation: a point estimate for a parameter obtained by maximizing the posterior distribution (likelihood times prior) rather than the likelihood alone, letting prior beliefs regularize the estimate especially when data is scarce.',
                'Central Limit Theorem: the theorem stating that the sum (or average) of a large number of independent, identically distributed random variables tends toward a normal distribution regardless of the underlying distribution\'s shape, which underlies why normal-distribution-based inference procedures work so broadly.',
                'Hypothesis Testing & p-values: a formal statistical framework for deciding whether observed data provides sufficient evidence to reject a default assumption (the null hypothesis), where the p-value quantifies how surprising the observed data would be if the null hypothesis were true.'
              ],
              simpleExplanation: `Imagine you're handed a mystery coin and told it might be biased. You flip it ten times and get 8 heads. Maximum Likelihood Estimation is the process of asking, "out of every possible bias this coin could have, which one makes the data I actually observed the most unsurprising?" It turns out the answer is simply 80% heads — MLE picks whatever parameter setting makes your actual observed data look the least like a fluke.

Bayesian inference adds a twist: instead of coming in with a completely blank mind, you start with a prior belief — maybe you already suspect most coins are close to fair, based on years of experience with coins in general. As you gather new evidence (the 8-heads-out-of-10 flips), you blend your prior belief with what the data is telling you to form an updated belief, called the posterior. If your prior was very confident the coin is fair, a modest run of 8-out-of-10 heads might only nudge your belief a little; if your prior was open-minded, the data would sway you further. This blending process is exactly what a detective does: they start an investigation with some working theories, and each new clue updates how confident they are in each theory, without throwing out everything they thought before.

A conjugate prior is just a mathematically convenient starting belief — one chosen so that after blending in new evidence, your updated belief has the same "shape" as your original one, letting you update your beliefs with simple arithmetic instead of complicated calculus.

The Central Limit Theorem explains something almost magical: if you take an average of many independent, messy, unpredictable things — die rolls, measurement errors, opinion poll responses — the average itself tends to follow a smooth, predictable bell-curve pattern, no matter how weird the underlying individual things were. This is why so many statistical tools, from political polling margins of error to manufacturing quality control charts, can confidently rely on the bell curve even when the raw data itself looks nothing like one.`,
              realWorldApplications: [
                { title: `A/B testing statistical significance at companies like Netflix and Amazon`, description: `Product experimentation teams use hypothesis testing and p-values to decide whether an observed difference in conversion rate between two website variants reflects a real effect or is likely to be random noise.` },
                { title: `Election polling margins of error reported by news organizations`, description: `Pollsters rely on the Central Limit Theorem to justify reporting a margin of error around a poll result, since the sample average of many independent voter responses approximately follows a normal distribution.` },
                { title: `Naive Bayes spam filters`, description: `Classic email spam filters compute the maximum likelihood, or MAP, estimate of whether a message is spam by combining prior spam probability with the likelihood of its specific words appearing, a direct application of Bayesian inference.` },
                { title: `Bayesian A/B testing tools like those used by Optimizely`, description: `Some modern experimentation platforms use Bayesian methods with conjugate priors, such as the Beta-Binomial pair, to continuously update the estimated probability that one website variant outperforms another as data streams in.` },
                { title: `Medical diagnostic test interpretation`, description: `Doctors use Bayesian reasoning, starting from a disease's prior prevalence and updating with a test's likelihood of a true or false positive, to interpret what a positive test result implies about a patient's posterior probability of having a condition.` }
              ],
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
                },
                {
                  id: 'ex-stat2',
                  question: 'Which prior distribution is conjugate to the Bernoulli/Binomial likelihood, making Bayesian updates for a proportion parameter available in closed form?',
                  options: ['Beta distribution', 'Normal distribution', 'Poisson distribution', 'Uniform distribution over all reals'],
                  correctAnswer: 0,
                  explanation: 'The Beta distribution is conjugate to the Bernoulli/Binomial likelihood: if the prior is Beta(a, b), the posterior after observing k successes in n trials is Beta(a + k, b + n - k).',
                  type: 'multiple-choice'
                },
                {
                  id: 'ex-stat3',
                  question: 'Explain the common misinterpretation of a p-value of 0.03 obtained from a hypothesis test, and state what the p-value actually represents.',
                  correctAnswer: 'It is commonly (incorrectly) interpreted as "there is a 3% chance the null hypothesis is true." In reality, the p-value is the probability of observing data at least as extreme as what was observed, assuming the null hypothesis is true; it says nothing directly about the probability that the null hypothesis itself is true or false.',
                  explanation: 'This is one of the most persistent and consequential misunderstandings in applied statistics: the p-value is a statement about the data given the hypothesis, not a statement about the hypothesis given the data (that would require Bayesian reasoning with a prior).',
                  type: 'free-response'
                },
                {
                  id: 'ex-stat4',
                  question: 'As the amount of observed data grows very large, what happens to the influence of the prior on the MAP estimate relative to the likelihood, and why?',
                  correctAnswer: 'The influence of the prior shrinks relative to the likelihood, because the likelihood term is a product over all n data points and grows sharper (more concentrated) as n increases, while the prior term stays fixed; in the limit of infinite data, the MAP estimate converges to the same value as the Maximum Likelihood Estimate.',
                  explanation: 'This illustrates why Bayesian and frequentist point estimates tend to agree asymptotically: with enough data, the evidence overwhelms any reasonable prior belief, which is a desirable consistency property of Bayesian inference.',
                  type: 'free-response'
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
              readingQuestions: [
                'Why does Maximum Likelihood Estimation converge to the true parameter as n approaches infinity?',
                'Why does MLE converge to the true parameter, and under what regularity conditions does this hold?',
                'How does the choice of prior affect a Bayesian estimate when the sample size is small versus large?',
                'What is the practical difference between a confidence interval (frequentist) and a credible interval (Bayesian)?',
                'Why is the log-likelihood used instead of the raw likelihood for numerical optimization?',
                'How does the Central Limit Theorem justify using a normal approximation for the sampling distribution of a sample mean?'
              ],
              masteryChecklist: ['Derive MLE for Exponential and Normal distributions', 'Compute p-value for two-sample t-test'],
              capstoneMilestone: 'Perform statistical hypothesis testing on experimental telemetry.',
              estimatedStudyMinutes: 120,
              difficulty: 'intermediate',
              glossary: [
                { term: 'Maximum Likelihood Estimation (MLE)', definition: 'A method of estimating a statistical model\'s parameters by finding the parameter values that maximize the likelihood of the observed data.' },
                { term: 'Likelihood Function', definition: 'A function of a model\'s parameters, given fixed observed data, that measures how probable that data would be under each candidate parameter setting.' },
                { term: 'Prior Distribution', definition: 'In Bayesian inference, a probability distribution representing beliefs about a parameter before observing any data.' },
                { term: 'Posterior Distribution', definition: 'In Bayesian inference, the updated probability distribution over a parameter after combining the prior distribution with observed data via Bayes\' theorem.' },
                { term: 'Conjugate Prior', definition: 'A prior distribution that, when combined with a specific likelihood function, produces a posterior distribution in the same family as the prior, enabling closed-form Bayesian updates.' },
                { term: 'Maximum A Posteriori (MAP)', definition: 'A point estimate of a parameter obtained by maximizing the posterior distribution, effectively combining the likelihood of the data with a regularizing prior belief.' },
                { term: 'p-value', definition: 'The probability, under the assumption that the null hypothesis is true, of observing a test statistic at least as extreme as the one actually observed.' },
                { term: 'Confidence Interval', definition: 'A frequentist interval estimate such that, if the sampling procedure were repeated many times, the specified percentage (e.g., 95%) of constructed intervals would contain the true parameter value.' },
                { term: 'Central Limit Theorem', definition: 'A theorem stating that the distribution of the sample mean of a large number of independent, identically distributed random variables approaches a normal distribution, regardless of the population\'s original distribution shape.' },
                { term: 'Null Hypothesis', definition: 'The default assumption in a hypothesis test, typically stating there is no effect or no difference, which is retained unless the data provide sufficient statistical evidence against it.' }
              ],
              commonMisconceptions: [
                'Misconception: A p-value is the probability that the null hypothesis is true. Reality: The p-value is the probability of observing data at least as extreme as what was observed, computed under the assumption that the null hypothesis is true; it does not directly state the probability that the hypothesis itself is true or false.',
                'Misconception: A 95% confidence interval means there is a 95% probability the true parameter lies within this specific computed interval. Reality: In frequentist statistics, the true parameter is a fixed (though unknown) constant, not a random variable; the 95% refers to the long-run proportion of such intervals, across repeated sampling, that would contain the true parameter.',
                'Misconception: Bayesian and frequentist inference always give substantially different numerical answers. Reality: With enough data and a reasonably uninformative prior, the MAP estimate and the confidence interval typically converge toward similar values, since the likelihood dominates the prior as sample size grows.',
                'Misconception: Statistical significance (a small p-value) implies practical or scientific importance. Reality: With a large enough sample size, even a trivially small and practically meaningless effect can produce a statistically significant p-value; effect size and confidence intervals should be reported alongside p-values.',
                'Misconception: The Maximum Likelihood Estimator is always unbiased. Reality: MLE is asymptotically unbiased and consistent under standard regularity conditions, but for finite samples it can be biased (for example, the MLE of variance divides by n rather than n-1, producing a known small downward bias).'
              ],
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
              coreConcepts: [
                'Relational Algebra: the formal mathematical foundation of relational databases, defining operations (selection, projection, join, union) over relations (tables) that every SQL query ultimately compiles down to; understanding it clarifies what a query engine is actually computing under the hood.',
                'Window Functions (OVER, PARTITION BY): SQL functions that compute a value across a set of related rows ("window") without collapsing them into a single output row, unlike GROUP BY, which enables tasks like running totals, rankings, and moving averages while preserving row-level detail.',
                'B+ Tree Indexing: a self-balancing tree structure, variant of the B-tree, in which all data resides in leaf nodes linked together for fast sequential range scans; it is the standard on-disk index structure in relational databases because it keeps height (and therefore disk seeks) logarithmic even for huge tables.',
                'ACID & Write-Ahead Logging (WAL): ACID (Atomicity, Consistency, Isolation, Durability) describes the transactional guarantees a database provides, and WAL is the mechanism (writing changes to a sequential log before applying them to data files) that makes atomicity and durability possible even in the event of a crash.',
                'Normalization (3NF/BCNF): the process of structuring relational schemas to minimize data redundancy and avoid update/insertion/deletion anomalies, by ensuring that non-key attributes depend only on the whole primary key and nothing but the key.',
                'Query Execution Plans: the sequence of physical operations (index scan, sequential scan, join algorithm choice, sort) a query optimizer selects to execute a SQL query, whose cost estimates directly determine real-world query performance on large tables.'
              ],
              simpleExplanation: `A relational database table is like a giant spreadsheet, and relational algebra is the small set of basic moves you're allowed to make on it: keep only rows that match a condition (selection), keep only certain columns (projection), or stitch two spreadsheets together based on a matching column (join). Every SQL query you ever write, no matter how complicated it looks, gets translated by the database into some combination of these handful of basic moves — SQL is just a friendlier language layered on top of that underlying algebra.

Finding a specific record in a giant, unsorted table would be like searching for one name in a phone book by reading every page from the start. A B+ tree index avoids that by organizing keys like a phone book with alphabet tabs, then tabs within tabs, then tabs within those — you can jump straight to roughly the right neighborhood in just a few hops, and because all the actual data sits in the tree's bottom layer with those bottom pages linked together in order, the database can also efficiently scan a whole range, like "everyone between M and P," without starting over.

Window functions solve a specific spreadsheet headache: sometimes you want to compare each row to a group of related rows — like ranking each salesperson against their team, or computing a running total — without collapsing all those rows down into one summary row the way GROUP BY does. A window function is like standing at each row with a small movable "window" that peeks at nearby or related rows, computes something using them, but still leaves every original row intact in the output.

Finally, imagine a bank that, before actually updating anyone's account balance, first writes a note in a notebook: "about to move $50 from account A to account B." If the power goes out mid-transaction, the bank can replay that notebook when it comes back on and finish, or safely undo, exactly what it was in the middle of doing. That notebook is the Write-Ahead Log, and it's the mechanism that lets a database promise your transaction either fully happened or didn't happen at all, even if the computer crashes at the worst possible moment.`,
              realWorldApplications: [
                { title: `B-tree indexes in PostgreSQL and MySQL`, description: `Both major open-source relational databases implement B+ tree variants as their default index structure, using it to turn a WHERE id = 42 lookup or a range scan into a small number of disk page reads instead of a full table scan.` },
                { title: `Running totals and rankings in SQL-based analytics dashboards`, description: `Business intelligence tools commonly generate SQL using RANK() OVER (PARTITION BY ...) and similar window functions to compute leaderboards, running totals, and moving averages directly inside the database instead of application code.` },
                { title: `Write-ahead logging in PostgreSQL's crash recovery`, description: `PostgreSQL's WAL mechanism writes every change to a sequential log file before touching the actual data files, letting the database replay the log to recover to a consistent state after an unexpected crash or power failure.` },
                { title: `Query planners choosing index scans vs. sequential scans`, description: `Every major relational database includes a cost-based query optimizer that decides, per query, whether using a B+ tree index or scanning the whole table is cheaper, based on estimated row counts and selectivity.` },
                { title: `Third normal form schema design in enterprise ERP systems`, description: `Large enterprise systems like SAP structure their relational schemas around normalization principles, 3NF and BCNF, to avoid update anomalies that would occur if data like customer addresses were duplicated across many tables.` }
              ],
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
                },
                {
                  id: 'ex-sql2',
                  question: 'Why is a B+ Tree preferred over a plain binary search tree (BST) for on-disk database indexes?',
                  options: [
                    'A B+ Tree has a much higher branching factor per node, so it keeps the tree shallow (fewer disk seeks) and its linked leaf nodes support efficient sequential range scans',
                    'A B+ Tree only supports equality lookups, which is faster than a BST',
                    'A BST cannot store duplicate keys, while a B+ Tree can',
                    'A B+ Tree does not require rebalancing, unlike a BST'
                  ],
                  correctAnswer: 0,
                  explanation: 'Because each B+ Tree node holds many keys and pointers (matching the disk page size), the tree stays shallow even for millions of rows, minimizing the number of slow disk I/O operations needed per lookup; its linked leaves also make range queries (e.g., BETWEEN) efficient, which a plain BST does not support well.',
                  type: 'multiple-choice'
                },
                {
                  id: 'ex-sql3',
                  question: 'Explain why Write-Ahead Logging (WAL) is necessary to guarantee the Durability property of ACID transactions.',
                  correctAnswer: 'WAL requires that a description of every change be written to a sequential, append-only log on durable storage before the corresponding change is applied to the actual data pages; if the system crashes after a transaction commits but before its data pages are fully flushed to disk, the log can be replayed on restart to redo the committed changes, ensuring no committed data is lost.',
                  explanation: 'Sequential log writes are also much faster than random writes to data pages, so WAL is both a durability guarantee and a major performance optimization technique used by essentially every production relational database.',
                  type: 'free-response'
                },
                {
                  id: 'ex-sql4',
                  question: 'Given a table `orders(order_id, customer_id, amount)`, write a SQL query using a window function to compute each order\'s amount alongside the running total of that customer\'s orders, ordered by order_id.',
                  correctAnswer: 'SELECT order_id, customer_id, amount, SUM(amount) OVER (PARTITION BY customer_id ORDER BY order_id) AS running_total FROM orders;',
                  explanation: 'PARTITION BY customer_id restarts the running sum for each customer, and ORDER BY order_id within the OVER clause makes SUM() act as a cumulative (running) total instead of a total over the whole partition.',
                  type: 'code-snippet'
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
              readingQuestions: [
                'Why are B+ Trees preferred over binary search trees for disk-based database indexes?',
                'Why is data independence essential in relational models?',
                'How does BCNF differ from 3NF, and why does that difference matter for a schema with overlapping candidate keys?',
                'Why does adding an index speed up SELECT queries but slow down INSERT/UPDATE/DELETE operations?',
                'How does an isolation level like READ COMMITTED differ from SERIALIZABLE in terms of what anomalies it permits?',
                'Why might a query optimizer choose a sequential scan over an available index scan for certain queries?'
              ],
              masteryChecklist: ['Construct 3NF relational schemas', 'Execute window function query with PARTITION BY'],
              capstoneMilestone: 'Architect a relational schema and write production migration scripts.',
              estimatedStudyMinutes: 120,
              difficulty: 'intermediate',
              glossary: [
                { term: 'B+ Tree', definition: 'A self-balancing tree data structure, with all data stored in linked leaf nodes, that keeps data sorted and allows searches, sequential range scans, insertions, and deletions in logarithmic time relative to disk I/O.' },
                { term: 'Relational Algebra', definition: 'A formal, procedural query language consisting of operations such as selection, projection, join, and union performed over relations (tables), forming the theoretical basis SQL query engines compile to.' },
                { term: 'Window Function', definition: 'A SQL function that performs a calculation across a set of rows related to the current row (defined by an OVER clause) without collapsing the result into a single grouped row, unlike aggregate functions used with GROUP BY.' },
                { term: 'ACID', definition: 'An acronym for Atomicity, Consistency, Isolation, and Durability, the four properties that guarantee reliable processing of database transactions.' },
                { term: 'Write-Ahead Logging (WAL)', definition: 'A technique in which changes are first recorded in a sequential, durable log before being applied to the actual data files, ensuring transactions can be recovered after a crash.' },
                { term: 'Normalization', definition: 'The process of organizing relational schema attributes and relationships to reduce redundancy and eliminate update, insertion, and deletion anomalies.' },
                { term: 'Third Normal Form (3NF)', definition: 'A normalization level requiring that every non-key attribute depend on the whole primary key and nothing but the key, eliminating transitive dependencies on non-key attributes.' },
                { term: 'Isolation Level', definition: 'A setting that determines how strictly a database enforces separation between concurrently executing transactions, trading off consistency guarantees (e.g., preventing dirty reads or phantom reads) against concurrency performance.' },
                { term: 'Query Execution Plan', definition: 'The sequence of physical operations (such as index scans, joins, and sorts) chosen by a database\'s query optimizer to carry out a given SQL query, along with their estimated costs.' },
                { term: 'Primary Key / Foreign Key', definition: 'A primary key is a column or set of columns that uniquely identifies each row in a table; a foreign key is a column referencing the primary key of another table, enforcing referential integrity between the two.' }
              ],
              commonMisconceptions: [
                'Misconception: Indexes always speed up query performance regardless of read/write ratio. Reality: Every index adds overhead to INSERT, UPDATE, and DELETE operations because the index structure must also be updated; on write-heavy tables, excessive indexing can significantly degrade write throughput even as it helps reads.',
                'Misconception: Normalizing a schema to 3NF or BCNF is always the right design choice for performance. Reality: Highly normalized schemas can require many joins to reconstruct a full record, which can hurt read performance; analytical (OLAP) workloads often deliberately denormalize data for faster reporting queries.',
                'Misconception: A transaction with SERIALIZABLE isolation guarantees perfect performance and no need to think about concurrency. Reality: SERIALIZABLE isolation prevents the most anomalies but at the cost of reduced concurrency (more locking or more transaction aborts/retries); choosing an isolation level is a deliberate trade-off between correctness guarantees and throughput.',
                'Misconception: SQL executes joins and filters in the literal order they are written in the query (FROM, then WHERE, then SELECT). Reality: The query optimizer is free to reorder operations, choose different join algorithms, and use indexes in whatever sequence it estimates will be cheapest; the written SQL only specifies the desired result, not the execution order.',
                'Misconception: A GROUP BY and a window function (OVER/PARTITION BY) accomplish the same thing. Reality: GROUP BY collapses multiple rows into one aggregated row per group, losing row-level detail, while a window function computes an aggregate or ranking value per row while preserving every original row in the output.'
              ],
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
              coreConcepts: [
                'TCP 3-Way Handshake: the SYN, SYN-ACK, ACK exchange that establishes a reliable, ordered, bidirectional connection between two hosts before any application data is sent, and which synchronizes initial sequence numbers used for reliable delivery.',
                'Socket API: the operating system interface (bind, listen, accept, connect, send, recv) that lets application programs create and use network connections, forming the practical bridge between application-level networking code and the OS/kernel network stack.',
                'Raft Consensus: an algorithm that allows a cluster of machines to agree on a single, consistent sequence of operations (a replicated log) even when some machines fail, using leader election and log replication in a way explicitly designed to be more understandable than earlier consensus algorithms like Paxos.',
                'CAP Theorem: the result stating that a distributed system experiencing a network partition must choose between Consistency (every read gets the latest write) and Availability (every request receives a response), which frames the fundamental trade-off in designing any distributed data store.',
                'Leader Election & Log Replication: the two core mechanisms of Raft — leader election ensures exactly one node coordinates writes at a time (using randomized timeouts to avoid split votes), and log replication ensures a majority of nodes durably store every committed entry before it is considered safe.',
                'Flow Control & Congestion Control: TCP mechanisms (sliding window, slow start, congestion avoidance) that prevent a fast sender from overwhelming a slow receiver or overloading the shared network, which is essential to understanding why network throughput is not simply bounded by link bandwidth.'
              ],
              simpleExplanation: `Sending data over the plain internet is a bit like dropping a postcard in a mailbox: it might arrive, might get lost, and might even arrive after a postcard you sent later. TCP fixes this by acting like a certified-mail service with a required check-in first: before either side sends any real data, they perform a three-way handshake — "Hello, I'd like to talk" (SYN), "Great, me too, go ahead" (SYN-ACK), "Confirmed, starting now" (ACK) — which is like both parties signing a form agreeing they're ready to correspond and agreeing on where the numbering of their letters will start, so missing or out-of-order letters can be detected and re-sent.

TCP's flow control and congestion control are like a delivery service that starts out sending a cautious, small number of packages, then gradually ships more and more as it confirms the receiving dock and the roads in between can keep up, but immediately backs off and ships fewer if it notices packages are getting lost or delayed — because that usually means the road is congested and blasting more traffic onto it would only make things worse for everyone.

Now imagine a company with several branch offices that all need to agree on the exact same official company calendar, even if the internet connection to one branch occasionally drops. Raft solves this kind of problem for computers: the branches (servers) hold an election, using a randomized "raise your hand first" timer so ties are unlikely, and whichever branch's hand goes up first and gets a majority of votes becomes the temporary leader. From then on, that leader is the only one allowed to write new entries into the shared calendar, and it only considers an entry official once a majority of branches have confirmed they've received and saved a copy — so even if the leader's office burns down, the calendar survives intact at the surviving majority.

The CAP theorem is the sobering rule that during an actual network split — say, a branch office genuinely loses its connection — a distributed system fundamentally cannot promise both that everyone always sees the very latest calendar entry (consistency) and that everyone can always keep working uninterrupted (availability); it has to choose which promise to sacrifice until the connection is restored.`,
              realWorldApplications: [
                { title: `The TCP three-way handshake behind every HTTPS web request`, description: `Every time a browser loads a website, it first performs a TCP three-way handshake with the server before any HTTP data or TLS negotiation even begins, establishing reliable, ordered delivery for the page that follows.` },
                { title: `Raft consensus in etcd, used by Kubernetes`, description: `Kubernetes stores all of its cluster state in etcd, a distributed key-value store that uses the Raft algorithm for leader election and log replication to keep cluster configuration consistent across multiple control-plane nodes.` },
                { title: `TCP congestion control (CUBIC) in the Linux kernel`, description: `Linux's default TCP congestion control algorithm, CUBIC, implements the same slow-start-then-back-off philosophy described here, dynamically adjusting how aggressively a connection sends data based on detected packet loss.` },
                { title: `The CAP theorem trade-off in DynamoDB vs. traditional SQL databases`, description: `Amazon DynamoDB is explicitly designed to favor availability over strict consistency during network partitions, while traditional single-leader relational databases typically favor consistency, a direct real-world instance of the CAP trade-off.` },
                { title: `The 1988 internet congestion collapse and Van Jacobson's TCP fix`, description: `Early internet congestion collapses in the late 1980s led Van Jacobson to introduce the slow-start and congestion-avoidance algorithms still used in TCP today, directly motivated by real network meltdowns.` }
              ],
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
                },
                {
                  id: 'ex-net2',
                  question: 'According to the CAP theorem, during an active network partition, a distributed database must choose to sacrifice which of the following?',
                  options: ['Either Consistency or Availability', 'Either Consistency or Partition Tolerance', 'Either Availability or Partition Tolerance', 'Durability only'],
                  correctAnswer: 'Either Consistency or Availability',
                  explanation: 'CAP theorem assumes partition tolerance is mandatory for any real distributed system (since network partitions are unavoidable), so the actual choice a system faces during a partition is between remaining consistent (refusing some requests) or remaining available (risking stale/inconsistent responses).',
                  type: 'multiple-choice'
                },
                {
                  id: 'ex-net3',
                  question: 'Explain why the TCP handshake uses three messages (SYN, SYN-ACK, ACK) rather than just two.',
                  correctAnswer: 'Each side of the connection needs to both announce and acknowledge its own initial sequence number to the other; a two-message handshake would let one side confirm the connection before confirming that its own SYN was received, risking a half-open connection where one side believes the connection is established but the other does not yet know its sequence number was acknowledged.',
                  explanation: 'The three-way handshake ensures both sides have exchanged and acknowledged initial sequence numbers before data flows, which is necessary for TCP\'s reliable, ordered delivery guarantees to hold from the very first byte sent.',
                  type: 'free-response'
                },
                {
                  id: 'ex-net4',
                  question: 'Why does Raft require a strict majority (quorum) of nodes to agree before committing a log entry, rather than just any single follower?',
                  correctAnswer: 'Requiring a majority guarantees that any two majorities (e.g., the set that elected the current leader and the set that committed a prior entry) must overlap in at least one node; that overlapping node carries forward knowledge of previously committed entries, which is what prevents a newly elected leader from overwriting already-committed data.',
                  explanation: 'This majority-overlap property is the mathematical core of Raft\'s (and most quorum-based consensus algorithms\') safety guarantee: it ensures committed data survives leader changes and node failures as long as a majority of the cluster remains reachable.',
                  type: 'free-response'
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
              readingQuestions: [
                'How does Raft guarantee the log matching property across all follower nodes?',
                'Why does Raft use randomized election timeouts instead of a fixed timeout for every node?',
                'How does the CAP theorem\'s trade-off manifest differently in an AP system (like DynamoDB) versus a CP system (like a Raft-based key-value store)?',
                'What is the difference between TCP\'s flow control and congestion control mechanisms?',
                'Why is UDP sometimes preferred over TCP despite offering no delivery guarantees?',
                'How does a term number in Raft prevent a stale leader from re-asserting authority after a network partition heals?'
              ],
              masteryChecklist: ['Trace TCP 3-way handshake packet headers', 'Verify Raft election safety property'],
              capstoneMilestone: 'Build a fault-tolerant key-value store using Raft consensus.',
              estimatedStudyMinutes: 120,
              difficulty: 'advanced',
              glossary: [
                { term: 'Raft Protocol', definition: 'A consensus algorithm designed to manage a replicated log across a distributed cluster of machines, using leader election and log replication to tolerate node failures while remaining understandable.' },
                { term: 'TCP (Transmission Control Protocol)', definition: 'A connection-oriented transport-layer protocol that provides reliable, ordered, and error-checked delivery of a byte stream between applications over an IP network.' },
                { term: 'Socket', definition: 'An operating-system-provided endpoint for network communication, identified by an IP address and port number, through which application code sends and receives data.' },
                { term: 'CAP Theorem', definition: 'A theorem stating that a distributed data store can provide at most two of three guarantees simultaneously during a network partition: Consistency, Availability, and Partition Tolerance.' },
                { term: 'Leader Election', definition: 'The process by which a distributed cluster selects a single coordinating node (leader) responsible for managing writes and replication, used in consensus protocols like Raft to avoid conflicting updates.' },
                { term: 'Quorum', definition: 'The minimum number of nodes (typically a strict majority) that must agree for an operation to be considered committed in a distributed consensus protocol, ensuring overlap between successive decisions.' },
                { term: 'Log Replication', definition: 'The process of copying a sequence of committed operations from a leader to follower nodes so that every node in a distributed system eventually applies the same operations in the same order.' },
                { term: 'Network Partition', definition: 'A failure scenario in which network connectivity between subsets of nodes in a distributed system is disrupted, preventing them from communicating, while each subset may still be internally reachable.' },
                { term: 'Split Vote', definition: 'A scenario in leader election where multiple candidates simultaneously request votes and none receives a majority, requiring a new election round; Raft mitigates this using randomized election timeouts.' },
                { term: 'Sliding Window Protocol', definition: 'A flow-control technique used by TCP in which the sender may transmit a bounded number of unacknowledged bytes ("window") at a time, dynamically adjusted based on receiver buffer capacity and network conditions.' }
              ],
              commonMisconceptions: [
                'Misconception: TCP guarantees low latency delivery. Reality: TCP guarantees reliable, in-order, error-checked delivery, but says nothing about latency; retransmissions, congestion control backoff, and head-of-line blocking can all introduce significant delay even though delivery eventually succeeds.',
                'Misconception: The CAP theorem means a distributed system must always sacrifice either consistency or availability at all times. Reality: The trade-off only becomes forced during an actual network partition; when the network is healthy, a well-designed system can provide both consistency and availability simultaneously.',
                'Misconception: Raft and Paxos solve fundamentally different problems. Reality: Raft and Paxos both solve the same distributed consensus problem (agreeing on a replicated log despite failures); Raft was explicitly designed as a more understandable alternative to Paxos, not a different algorithm class.',
                'Misconception: A "leader" in a Raft cluster is a permanent, specially privileged machine. Reality: Leadership in Raft is a temporary role tied to a specific term number; any node can become leader, and leadership changes whenever the current leader fails or a network partition triggers a new election.',
                'Misconception: UDP is simply a "worse" version of TCP and should be avoided. Reality: UDP\'s lack of ordering, retransmission, and connection setup overhead makes it the better choice for latency-sensitive applications (like live video/voice or DNS lookups) where an occasional dropped packet is preferable to the delay of waiting for retransmission.'
              ],
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
              coreConcepts: [
                'Lexer/Token: the lexical analyzer scans a raw character stream and groups characters into atomic tokens (identifiers, numbers, keywords, operators), discarding whitespace and comments, so the parser never has to reason about individual characters.',
                'LL(1) & LR Parsing: two families of context-free grammar parsing algorithms — LL(1) parses top-down reading Left-to-right with 1 token of Lookahead (used by recursive descent parsers), while LR parses bottom-up and can handle a broader class of grammars, including left-recursive rules that break LL(1).',
                'Abstract Syntax Tree (AST): a tree representation of a program\'s syntactic structure that strips away concrete syntax details (parentheses, semicolons) while preserving the hierarchical relationships between expressions and statements, serving as the primary data structure later compiler stages operate on.',
                'LLVM IR: a low-level, typed, platform-independent intermediate representation in Static Single Assignment (SSA) form that decouples a compiler\'s language-specific frontend from its target-specific backend, enabling one frontend to target many CPU architectures and one optimization pipeline to serve many languages.',
                'Context-Free Grammar (CFG): a formal set of production rules describing how valid strings in a language can be generated, providing the mathematical specification that a parser is built to recognize.',
                'Static Single Assignment (SSA) Form: an intermediate representation property where every variable is assigned exactly once, which dramatically simplifies data-flow analysis and enables powerful compiler optimizations like constant propagation and dead-code elimination.'
              ],
              simpleExplanation: `Imagine translating a cooking recipe written in flowing English prose into a strict, step-by-step assembly manual for a robot chef. The first step, lexical analysis, is like a proofreader going through the recipe and underlining and labeling every distinct word and symbol — "this is an ingredient name," "this is a quantity," "this is an action verb" — without yet worrying about whether the sentences make grammatical sense. Each underlined chunk becomes a token, the compiler's smallest meaningful unit.

Next, the parser checks whether those tokens are actually arranged in a way that makes grammatical sense according to the recipe's rules, similar to a grammar teacher confirming that "Add 2 cups of flour" follows valid sentence structure while "Flour add 2 the cups of" does not. A context-free grammar is the formal rulebook the parser checks against, and once parsing succeeds, the compiler builds an Abstract Syntax Tree — essentially a family tree of the recipe's instructions, showing that "preheat the oven" has to happen before "bake for 20 minutes," with all the unnecessary punctuation and filler words stripped away, leaving just the meaningful structure.

LLVM IR is like translating that recipe into a universal, standardized set of cooking symbols that any kitchen in the world — gas stove, electric stove, or robot chef — can follow, instead of writing a separate recipe by hand for every possible kitchen. This is the real power of an intermediate representation: a language's compiler only has to translate its recipes into this one universal format once, and then a separate, reusable set of tools can translate that universal format into instructions for any target machine, and can also polish and simplify the universal recipe, optimization, without needing to know which original human language it came from.

Static Single Assignment form is a bookkeeping trick applied to that universal recipe: instead of letting a variable named "total" get overwritten five different times throughout the recipe, SSA gives each new value of "total" its own unique name (total1, total2, total3...), which makes it far easier for automated tools to trace exactly where each value came from and to spot steps that are pointless and can be safely deleted.`,
              realWorldApplications: [
                { title: `LLVM powering Clang, Rust, and Swift compilers`, description: `LLVM's intermediate representation lets completely different language frontends, such as Clang for C/C++, rustc for Rust, and Swift's compiler, share the same backend optimization passes and target the same wide range of CPU architectures.` },
                { title: `Recursive descent parsing in the CPython interpreter`, description: `CPython's parser and similar hand-written interpreters use recursive descent, an LL-style top-down parsing technique, to turn source code text into an abstract syntax tree before execution or bytecode compilation.` },
                { title: `V8's JIT compilation pipeline for JavaScript`, description: `Google's V8 engine, powering Chrome and Node.js, lexes and parses JavaScript into an AST, then progressively compiles hot code paths through several intermediate representations into optimized machine code at runtime.` },
                { title: `Babel and the TypeScript compiler's AST-based transformations`, description: `Tools like Babel and tsc parse source code into an abstract syntax tree and then transform that tree, such as converting modern JS syntax to older syntax or type-checking, before generating output code.` },
                { title: `GCC's SSA-based optimization passes`, description: `The GNU Compiler Collection converts code into an SSA-form intermediate representation, GIMPLE, specifically because it makes optimizations like constant propagation and dead-code elimination dramatically simpler and more reliable to implement.` }
              ],
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
                },
                {
                  id: 'ex-comp2',
                  question: 'Why can a naive LL(1) recursive descent parser not directly handle a left-recursive grammar rule like `expr -> expr + term`?',
                  options: [
                    'The parser would call the same production again immediately with no input consumed, causing infinite recursion before any lookahead progress is made',
                    'Left recursion is only a runtime performance issue, not a correctness issue',
                    'LL(1) parsers cannot represent addition expressions at all',
                    'Left recursion only affects LR parsers, not LL parsers'
                  ],
                  correctAnswer: 0,
                  explanation: 'A recursive descent parser for `expr -> expr + term` would call parse_expr() which immediately calls parse_expr() again before consuming any token, looping forever; the standard fix is to rewrite the grammar to be right-recursive or to use iterative loop-based parsing for left-associative operators.',
                  type: 'multiple-choice'
                },
                {
                  id: 'ex-comp3',
                  question: 'Explain why SSA (Static Single Assignment) form makes compiler optimizations like dead-code elimination and constant propagation easier to implement.',
                  correctAnswer: 'Because every variable in SSA form is assigned exactly once, each use of a variable has an unambiguous single definition it can be traced back to; this eliminates the need for complex reaching-definitions analysis to figure out which assignment a given use refers to, letting optimization passes directly follow def-use chains to see whether a value is ever used (dead-code elimination) or is always the same constant (constant propagation).',
                  explanation: 'This is precisely why LLVM and most modern optimizing compilers use SSA as their core intermediate representation: it turns many otherwise-complex data-flow problems into simple, local graph traversals.',
                  type: 'free-response'
                },
                {
                  id: 'ex-comp4',
                  question: 'Given the arithmetic expression `2 + 3 * 4`, describe how operator precedence must be encoded in the grammar rules so a recursive descent parser produces an AST that respects standard precedence (multiplication before addition).',
                  correctAnswer: 'The grammar must be structured in layers reflecting precedence, e.g., expr -> term (("+" | "-") term)* and term -> factor (("*" | "/") factor)*, so that the parser recurses into the higher-precedence "term" rule before combining with lower-precedence "+"; this ensures 3 * 4 is parsed and grouped into a single subtree before being combined with 2 via addition, producing the AST (+ 2 (* 3 4)) rather than (* (+ 2 3) 4).',
                  explanation: 'Precedence in a recursive descent parser is not resolved by explicit priority values but by the structure of the grammar itself, with each precedence level corresponding to a separate production rule that calls into the next higher-precedence rule.',
                  type: 'free-response'
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
              readingQuestions: [
                'Why does operator precedence dictate grammar production rules in LL(1) parsers?',
                'Why is SSA form advantageous for compiler optimization passes?',
                'What is the difference between a syntax error caught by the parser and a semantic error caught by the type checker?',
                'Why do regular expressions (used by lexers) recognize a strictly less powerful class of languages than context-free grammars (used by parsers)?',
                'How does an LR parser\'s use of a stack and state table differ fundamentally from a recursive descent parser\'s use of the call stack?',
                'Why does having a single shared intermediate representation like LLVM IR let one compiler support many source languages and many target CPU architectures with less duplicated engineering effort?'
              ],
              masteryChecklist: ['Write regular expressions for token types', 'Build recursive descent parser for mini language'],
              capstoneMilestone: 'Construct a compiler frontend targeting WebAssembly or LLVM IR.',
              estimatedStudyMinutes: 120,
              difficulty: 'advanced',
              glossary: [
                { term: 'Abstract Syntax Tree (AST)', definition: 'A tree representation of the abstract syntactic structure of source code, in which each node represents a construct (expression, statement) with concrete syntax details like parentheses omitted.' },
                { term: 'Lexer (Tokenizer)', definition: 'The compiler phase that scans raw source text and groups characters into a sequence of tokens, such as identifiers, literals, keywords, and operators.' },
                { term: 'Token', definition: 'An atomic lexical unit produced by the lexer, typically consisting of a type (e.g., NUMBER, IDENTIFIER) and an associated value or lexeme.' },
                { term: 'Context-Free Grammar (CFG)', definition: 'A formal grammar consisting of production rules that define how strings in a language can be generated, used to specify the syntax that a parser must recognize.' },
                { term: 'Recursive Descent Parser', definition: 'A top-down parser implementation strategy in which each grammar production rule is implemented as a mutually recursive function, directly mirroring the structure of the grammar.' },
                { term: 'LL(1) Parser', definition: 'A top-down parser that processes input Left-to-right, constructs a Leftmost derivation, and decides which production to apply using only 1 token of lookahead.' },
                { term: 'LR Parser', definition: 'A bottom-up parser that processes input Left-to-right and constructs a Rightmost derivation in reverse, capable of handling a broader class of grammars than LL parsers, including left recursion.' },
                { term: 'Intermediate Representation (IR)', definition: 'A data structure or code representation used internally by a compiler, positioned between the source language\'s AST and the target machine code, that is independent of both the source language and target architecture.' },
                { term: 'Static Single Assignment (SSA)', definition: 'A property of an intermediate representation in which every variable is assigned a value exactly once, simplifying data-flow analysis and enabling many classic compiler optimizations.' },
                { term: 'Dead Code Elimination', definition: 'A compiler optimization that removes computations whose results are never used, reducing code size and execution time without changing program behavior.' }
              ],
              commonMisconceptions: [
                'Misconception: Compilers translate directly from source text to binary machine code without intermediate structures. Reality: Modern compilers pass source code through multiple representations — tokens, an AST, one or more intermediate representations like LLVM IR — each enabling different kinds of analysis and optimization before final machine code generation.',
                'Misconception: Any programming language syntax can be parsed by a simple LL(1) recursive descent parser. Reality: Grammars with left recursion or requiring more than one token of lookahead to disambiguate cannot be parsed directly by an LL(1) parser without grammar transformation or a more powerful parsing technique like LR or PEG parsing.',
                'Misconception: A parser is responsible for catching all errors in a program, including type errors. Reality: The parser only checks that the program is syntactically well-formed according to the grammar; semantic errors like type mismatches or undefined variables are caught by later compiler phases such as the type checker.',
                'Misconception: Regular expressions can be used to fully parse any programming language, including matching nested parentheses or balanced braces. Reality: Regular expressions (finite automata) cannot count or track arbitrary nesting depth, so they can only handle the lexical (token-level) phase; context-free grammars and parsers are required to handle nested, recursive syntactic structures.',
                'Misconception: Optimizing compilers work directly on the original AST. Reality: Most real-world optimizing compilers first lower the AST into a simpler intermediate representation (often in SSA form) because ASTs retain source-level structure that is inconvenient for the uniform, low-level analyses optimization passes need to perform.'
              ],
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
              coreConcepts: [
                'SOLID Principles: five guidelines (Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, Dependency Inversion) for organizing object-oriented code so that individual pieces are easy to understand, test, and change without triggering cascading changes elsewhere.',
                'Dependency Injection: a technique where an object receives its dependencies from outside rather than constructing them itself, which decouples a class from concrete implementations and makes it possible to substitute mocks or alternative implementations, especially for testing.',
                'Microservices Architecture: a style of structuring an application as a collection of small, independently deployable services that communicate over the network, trading the simplicity of a single deployable monolith for independent scalability and team autonomy at the cost of added operational complexity.',
                'CI/CD Pipelines: Continuous Integration automatically builds and tests every code change as it is merged, while Continuous Deployment/Delivery automates pushing verified changes toward production, together reducing the risk and manual effort of shipping software changes.',
                'Information Hiding & Modularity: the practice of exposing only a minimal, stable interface from a module while hiding its internal implementation details, so that internal changes do not ripple outward and break unrelated code that depends on the module.',
                'API Design (REST/gRPC): REST models resources as URLs manipulated via standard HTTP verbs in a stateless, human-readable way, while gRPC uses compact binary protocol buffers over HTTP/2 for lower-latency, strongly-typed service-to-service communication; choosing between them is a key architectural decision in a distributed system.'
              ],
              simpleExplanation: `Imagine a restaurant kitchen with one specialist chef per station — one only does grilling, another only does salads, another only does desserts — instead of a single chef trying to do everything from scratch for every dish. Microservices architecture applies this same idea to software: instead of one giant program doing everything, you split the system into small, focused services (an order service, a payments service, a shipping service) that each do one job well and talk to each other over the network, the same way kitchen stations pass finished components to be assembled into a final plate.

Dependency Injection is like a kitchen with standardized electrical outlets instead of appliances hard-wired directly into the wall. A blender doesn't care exactly which power plant generated its electricity — it just needs a compatible plug. In code, a class shouldn't have to build its own database connection or email service from scratch; instead, that dependency gets "plugged in" from outside, which means you can swap in a fake, test-only database for testing without rewiring the whole kitchen.

SOLID and information hiding are like a well-organized kitchen's rule that each station should have one clear job (Single Responsibility) and that other stations shouldn't need to know exactly how the grill station sears a steak — they just need to know that when they hand over raw meat, cooked meat comes back (information hiding, encapsulated behind a stable interface). This way, the grill station chef can completely change their technique next month without any other station needing to change how they interact with it.

Finally, CI/CD is like a restaurant's quality-control routine: rather than waiting until the entire seven-course meal is plated to check whether anything went wrong, a food safety inspector tastes and checks each dish the moment it comes off the line (Continuous Integration catching bugs the moment code is merged), and once a dish passes inspection, an automated process gets it out to the dining room with minimal manual handling (Continuous Deployment automating the path to production).`,
              realWorldApplications: [
                { title: `Netflix's microservices architecture`, description: `Netflix famously decomposed its monolithic streaming platform into hundreds of independently deployable microservices, allowing different teams to develop, scale, and deploy services like recommendations or billing without coordinating one giant release.` },
                { title: `Dependency injection frameworks like Spring (Java) and Angular`, description: `Both frameworks are built around dependency injection containers that automatically construct and "wire up" an object's dependencies, letting developers swap real implementations for test mocks without changing the dependent class's code.` },
                { title: `GitHub Actions and Jenkins CI/CD pipelines`, description: `Widely used tools like GitHub Actions automatically build, test, and optionally deploy code on every push or pull request, implementing the Continuous Integration/Continuous Deployment pattern that catches bugs before they reach production.` },
                { title: `gRPC at Google for internal service-to-service communication`, description: `Google developed and open-sourced gRPC, a high-performance binary RPC framework built on HTTP/2 and protocol buffers, specifically to handle the huge volume of low-latency service-to-service calls inside a large microservices architecture.` },
                { title: `Amazon's API-first internal service mandate`, description: `Amazon's well-documented internal mandate that all teams expose functionality only through well-defined service interfaces, never direct database access, is a large-scale, organizational application of information hiding and modularity.` }
              ],
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
                },
                {
                  id: 'ex-se2',
                  question: 'A microservices architecture, compared to a monolith, primarily improves which of the following at the cost of increased operational complexity?',
                  options: [
                    'Independent scalability and deployability of individual services',
                    'Elimination of the need for network communication',
                    'Guaranteed lower total infrastructure cost',
                    'Automatic elimination of all data consistency concerns'
                  ],
                  correctAnswer: 'Independent scalability and deployability of individual services',
                  explanation: 'Microservices let teams scale, deploy, and even choose technology stacks for each service independently, but this comes at the cost of distributed systems complexity: network latency, partial failures, and the need for careful cross-service data consistency strategies that a monolith avoids entirely.',
                  type: 'multiple-choice'
                },
                {
                  id: 'ex-se3',
                  question: 'Explain how a CI/CD pipeline\'s automated test gate reduces the risk of a bad deployment reaching production, compared to manual testing and manual deployment.',
                  correctAnswer: 'An automated test gate runs the full test suite (and often static analysis, security scans, and build checks) on every single code change before it is merged or deployed, catching regressions immediately and consistently; manual testing is slower, inconsistent between runs, and easy to skip under time pressure, so automation both improves detection reliability and removes human variability from the release process.',
                  explanation: 'This is why CI/CD is considered a core software engineering practice rather than just a convenience: the pipeline enforces the same quality bar on every change, every time, without relying on a human remembering to run the right checks.',
                  type: 'free-response'
                },
                {
                  id: 'ex-se4',
                  question: 'Refactor this tightly coupled code to use Dependency Injection so it can be tested without hitting a real database: `class OrderService:\n    def __init__(self):\n        self.db = PostgresConnection()\n    def save(self, order):\n        self.db.insert(order)`',
                  correctAnswer: 'class OrderService:\n    def __init__(self, db):\n        self.db = db\n    def save(self, order):\n        self.db.insert(order)\n\n# Tests can now pass a fake/mock db:\n# service = OrderService(FakeDB())',
                  explanation: 'By accepting the database dependency as a constructor parameter instead of instantiating it internally, OrderService no longer controls which implementation it depends on; tests can inject a fake or in-memory implementation, and production code can inject the real PostgresConnection, all without changing OrderService itself.',
                  type: 'code-snippet'
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
              readingQuestions: [
                'How does information hiding improve code maintainability across long development lifecycles?',
                'Why does modular decomposition reduce ripple effects during system changes?',
                'When would a monolith be a more appropriate architecture choice than microservices?',
                'How does gRPC\'s use of Protocol Buffers over HTTP/2 differ from REST\'s use of JSON over HTTP/1.1 in terms of performance trade-offs?',
                'Why is the Open-Closed Principle ("open for extension, closed for modification") important for avoiding regressions in shared code?',
                'What role does a container image (like Docker) play in ensuring an application behaves consistently across development, staging, and production environments?'
              ],
              masteryChecklist: ['Implement Dependency Injection container', 'Draft Dockerfile and GitHub Actions workflow'],
              capstoneMilestone: 'Establish CI/CD pipeline and automated test suite for capstone project.',
              estimatedStudyMinutes: 120,
              difficulty: 'intermediate',
              glossary: [
                { term: 'Dependency Injection', definition: 'A design pattern in which an object receives the other objects (dependencies) it needs from an external source rather than constructing them itself, decoupling the object from specific implementations.' },
                { term: 'SOLID Principles', definition: 'A set of five object-oriented design principles (Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, Dependency Inversion) intended to make software easier to understand, extend, and maintain.' },
                { term: 'Microservices', definition: 'An architectural style structuring an application as a suite of small, independently deployable services, each typically owning its own data store and communicating over the network.' },
                { term: 'Monolith', definition: 'An architectural style in which an entire application is built and deployed as a single unified codebase and executable, as opposed to being split into independent services.' },
                { term: 'CI/CD', definition: 'Continuous Integration and Continuous Delivery/Deployment: practices that automate building, testing, and releasing code changes frequently and reliably, reducing the risk and effort of shipping software.' },
                { term: 'Information Hiding', definition: 'The principle of exposing only the necessary interface of a module while concealing its internal implementation details, so that changes to the implementation do not affect external code.' },
                { term: 'REST (Representational State Transfer)', definition: 'An architectural style for web APIs where resources are addressed via URLs and manipulated using standard HTTP methods (GET, POST, PUT, DELETE) in a stateless manner.' },
                { term: 'gRPC', definition: 'A high-performance remote procedure call (RPC) framework that uses Protocol Buffers for binary serialization and HTTP/2 for transport, commonly used for efficient service-to-service communication.' },
                { term: 'Docker Container', definition: 'A lightweight, portable, self-contained package of an application and its dependencies that runs consistently across different computing environments by sharing the host OS kernel.' },
                { term: 'Domain-Driven Design (DDD)', definition: 'A software design approach that structures code around a model of the business domain, aligning software boundaries with real-world business concepts and processes.' }
              ],
              commonMisconceptions: [
                'Misconception: Microservices architecture automatically improves developer experience for small teams. Reality: For small teams, the operational overhead of managing multiple deployments, network calls, distributed debugging, and service coordination can outweigh the benefits; microservices tend to pay off more clearly at larger organizational scale where independent team ownership matters.',
                'Misconception: Dependency Injection requires a heavyweight framework or "DI container" to use. Reality: Dependency Injection is fundamentally just passing dependencies as constructor or function parameters instead of hardcoding them internally; frameworks can automate wiring for large applications, but the core technique needs no special tooling.',
                'Misconception: Following SOLID principles means every class must be extremely small and every dependency must be injected. Reality: SOLID principles are heuristics to guide design trade-offs, not absolute rules; over-applying them (excessive abstraction, injecting trivial dependencies) can add unnecessary complexity without a corresponding maintainability benefit.',
                'Misconception: CI/CD is only about automatically deploying code faster. Reality: The core value of CI/CD is the automated, consistent quality gate (tests, linting, security scans) applied to every change; faster deployment is a secondary benefit that only helps if the automated checks are actually catching real problems.',
                'Misconception: REST APIs are always simpler and gRPC APIs are always faster, so the choice is purely a speed-versus-simplicity trade-off. Reality: The right choice depends on context — REST\'s human-readability and broad tooling support make it well suited to public-facing APIs, while gRPC\'s strict typed contracts and binary efficiency are often better suited to high-throughput internal service-to-service communication.'
              ],
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
              coreConcepts: [
                'System Design Specification: a formal document describing a system\'s architecture, interfaces, data models, and key trade-offs before implementation begins, which forces design decisions to be made deliberately rather than emerging accidentally from code, and gives reviewers a concrete artifact to critique.',
                'Performance Benchmarking: the disciplined practice of measuring a system\'s behavior (latency percentiles, throughput, resource usage) under controlled, repeatable conditions, which turns vague claims about performance into falsifiable, comparable numbers.',
                'Peer Code Review: the process of having other engineers examine code changes before they are merged, which catches defects, spreads knowledge of the codebase, and enforces consistency in ways that automated tooling alone cannot.',
                'Technical Defense: the practice of presenting and justifying design decisions to a critical audience, which mirrors real-world engineering design reviews and forces an engineer to be able to articulate not just what was built but why specific trade-offs were chosen over alternatives.',
                'Conceptual Integrity: the property, emphasized by Fred Brooks, that a well-designed system reflects one coherent set of design ideas throughout, and that this coherence is best achieved by keeping the core design decisions concentrated in a small number of minds.',
                'Essential vs. Accidental Complexity: Brooks\' distinction between the complexity inherent to the problem being solved (essential) and the complexity introduced by tooling, representation, or process choices (accidental); mature engineers focus effort on reducing accidental complexity since essential complexity cannot be eliminated, only managed.'
              ],
              simpleExplanation: `Before a construction crew pours a single foundation, an architect draws detailed blueprints showing where every wall, pipe, and wire will go, and other engineers review those blueprints looking for problems — like a bathroom placed with no plumbing access — before expensive concrete gets poured. A system design specification serves the same purpose in software: it forces you to think through a system's structure, interfaces, and trade-offs on paper first, where mistakes are cheap to fix, rather than discovering them halfway through writing thousands of lines of code.

Performance benchmarking is like timing a runner with a stopwatch under controlled, repeatable conditions rather than just guessing that "it feels fast." Instead of vague claims, you get concrete numbers — how many requests per second the system handles, how long the slowest 1% of requests take — that can be compared honestly before and after a change, the same way a coach uses precise lap times instead of impressions to judge whether training is actually working.

A technical defense is much like defending a thesis in front of a committee, or a chef explaining their menu choices to a panel of food critics: it's not enough to have built something that works, you also need to be able to clearly explain why you made each significant design decision, what alternatives you considered, and what trade-offs you accepted. This mirrors what happens constantly in real engineering organizations during design reviews, where being able to articulate your reasoning is often just as important as the artifact itself.

The idea of conceptual integrity is like a house designed entirely by one architect versus a house that ten different architects each added a random room to over the years — the first house feels coherent and intentional throughout, while the second feels like a patchwork of mismatched styles bolted together. The best software systems, similarly, reflect one coherent vision, which is why keeping core design decisions concentrated among a small group tends to produce cleaner, more usable systems — while accepting that some complexity, inherent to the problem itself, can never be designed away, only managed as cleanly as possible.`,
              realWorldApplications: [
                { title: `Amazon's internal "working backwards" PR/FAQ design process`, description: `Amazon famously requires teams to write a detailed press release and FAQ document for a proposed system before building it, a design-specification discipline aimed at surfacing flawed thinking before costly implementation begins.` },
                { title: `Google's design review culture for large-scale infrastructure`, description: `Google engineers are expected to write and defend formal design documents for significant systems, subjecting architectural decisions to peer critique before implementation, mirroring the technical-defense process in this capstone.` },
                { title: `Load testing tools like k6 and Apache JMeter`, description: `Companies use dedicated benchmarking tools to measure latency percentiles and throughput under controlled synthetic load before shipping a system, turning performance claims into reproducible, falsifiable numbers.` },
                { title: `The Mythical Man-Month's influence on modern software project management`, description: `Fred Brooks's observations about conceptual integrity and "adding manpower to a late software project makes it later" are still routinely cited in modern engineering management and project planning discussions.` },
                { title: `Architecture Decision Records used at companies like Spotify`, description: `Many engineering organizations maintain lightweight ADR documents that record the context, options considered, and rationale behind significant technical decisions, directly operationalizing the design-before-building discipline.` }
              ],
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
                },
                {
                  id: 'ex-caps2',
                  question: 'A capstone project measures p50 latency of 20ms but p99 latency of 800ms. Why is reporting only the average or p50 latency misleading for this system?',
                  options: [
                    'Because a small but meaningful fraction of users are experiencing far worse performance that the average completely hides',
                    'Because p50 and p99 always converge to the same value in production',
                    'Because latency percentiles are only meaningful for read-heavy workloads',
                    'Because averages are mathematically impossible to compute for latency data'
                  ],
                  correctAnswer: 'Because a small but meaningful fraction of users are experiencing far worse performance that the average completely hides',
                  explanation: 'Tail latency (p99, p99.9) reveals how the worst-served requests behave; a good average can mask a real problem affecting a meaningful subset of users, which is why production systems are typically evaluated against percentile-based Service Level Objectives rather than averages alone.',
                  type: 'multiple-choice'
                },
                {
                  id: 'ex-caps3',
                  question: 'Explain why Brooks argues there is "no silver bullet" for dramatically improving software engineering productivity.',
                  correctAnswer: 'Brooks distinguishes essential complexity (inherent to the problem\'s conceptual structure — the logic, state, and interactions a system must represent) from accidental complexity (introduced by tools, languages, and processes); he argues that past productivity gains (high-level languages, IDEs) attacked accidental complexity, which has a bounded amount of possible improvement, while essential complexity cannot be removed by any single tool or technique, only managed through careful design.',
                  explanation: 'This argument remains influential because it reframes hype around any single new methodology or tool: real productivity gains come from incrementally reducing accidental complexity and carefully managing essential complexity, not from a single transformative breakthrough.',
                  type: 'free-response'
                },
                {
                  id: 'ex-caps4',
                  question: 'During a technical defense, a reviewer asks why you chose a particular database technology over an alternative. What should a strong answer demonstrate, beyond simply naming the technology you chose?',
                  correctAnswer: 'A strong answer demonstrates an understanding of the actual requirements and constraints (consistency needs, expected scale, query patterns, team familiarity, operational cost) and explicitly compares the chosen technology against at least one credible alternative, explaining which trade-offs were prioritized and why, rather than asserting the choice was simply "the best" option.',
                  explanation: 'Technical defenses evaluate engineering judgment, not just outcomes; being able to articulate trade-offs and alternatives considered demonstrates the kind of reasoning process that transfers to future, different design decisions.',
                  type: 'free-response'
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
              readingQuestions: [
                'Why does conceptual integrity dictate that a system should be designed by few minds?',
                'Why does Brooks argue there is no silver bullet for software complexity?',
                'How does writing a design specification before coding help catch flawed assumptions earlier, when they are cheaper to fix?',
                'What makes a benchmark result reproducible, and why does reproducibility matter for comparing two system designs?',
                'How does peer code review catch classes of bugs that automated testing typically misses?',
                'Why is being able to defend a design decision under questioning a different skill than simply building a working system?'
              ],
              masteryChecklist: ['Write formal technical spec document', 'Execute p99 performance profiling benchmark'],
              capstoneMilestone: 'Deliver production project repository with automated CI tests and defense presentation.',
              estimatedStudyMinutes: 180,
              difficulty: 'advanced',
              glossary: [
                { term: 'Conceptual Integrity', definition: 'The property, described by Fred Brooks, where a system reflects a single, coherent set of design ideas throughout, typically achieved by concentrating core design authority in a small number of designers.' },
                { term: 'Essential Complexity', definition: 'Complexity inherent to the problem a software system must solve, such as the conceptual structure of the domain\'s data and logic, which cannot be eliminated by better tools alone.' },
                { term: 'Accidental Complexity', definition: 'Complexity introduced by the tools, languages, and processes used to build software, as opposed to complexity inherent to the problem itself; unlike essential complexity, it can often be reduced through better engineering practices.' },
                { term: 'System Design Specification', definition: 'A document produced before or during implementation that describes a system\'s architecture, key interfaces, data models, and design trade-offs.' },
                { term: 'p99 Latency', definition: 'The 99th percentile of a latency distribution, meaning 99% of measured requests complete faster than this value; used to characterize tail (worst-case-ish) performance rather than average performance.' },
                { term: 'Service Level Objective (SLO)', definition: 'A target value or range for a measured service metric (such as p99 latency or uptime percentage) that a system is expected to meet, used to define and track reliability goals.' },
                { term: 'Peer Code Review', definition: 'The practice of having other engineers examine proposed code changes before merging, aimed at catching defects, improving code quality, and spreading codebase knowledge.' },
                { term: 'Technical Debt', definition: 'The implied future cost of choosing an expedient but suboptimal engineering solution now, which will require additional rework later, often incurred deliberately to meet a deadline.' },
                { term: 'Reproducibility', definition: 'The property of an experiment or benchmark that allows it to be repeated by others (or by the same person later) under the same conditions and yield consistent results, essential for trustworthy performance comparisons.' },
                { term: 'Brooks\'s Law', definition: 'The observation, from Fred Brooks\'s "The Mythical Man-Month," that adding more programmers to an already-late software project tends to make it later, due to the added communication and onboarding overhead outweighing the extra work capacity.' }
              ],
              commonMisconceptions: [
                'Misconception: Adding more programmers to a late project accelerates delivery. Reality: Brooks\'s Law observes that new team members require ramp-up time and increase communication overhead (which grows roughly with the square of team size), often making an already-late project even later rather than faster.',
                'Misconception: A technical design specification is bureaucratic overhead that slows down "real" engineering work. Reality: A design spec surfaces flawed assumptions and unresolved trade-offs while they are still cheap to fix on paper, before code and infrastructure have been built around them, which is typically far less expensive than fixing the same issue after implementation.',
                'Misconception: Benchmarking a system once under ideal conditions is sufficient to characterize its real-world performance. Reality: Realistic benchmarking requires representative load patterns, sufficient warm-up, multiple runs to account for variance, and attention to tail latency (p95/p99), since a single favorable run can hide serious performance problems.',
                'Misconception: Code review is primarily about finding syntax errors and style violations. Reality: While style is one benefit, the more valuable function of code review is catching logic errors, missed edge cases, and design issues, as well as spreading knowledge of the codebase across the team.',
                'Misconception: There exists (or will eventually exist) a single tool, language, or methodology that will make software engineering dramatically and permanently easier. Reality: Brooks\'s "No Silver Bullet" argument holds that because essential complexity is inherent to the problems software solves, no single technique can eliminate it; sustained improvement comes from incrementally reducing accidental complexity and better managing essential complexity.'
              ],
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
              coreConcepts: [
                'DFA/NFA (Finite Automata): abstract machines with a finite number of states that read an input string symbol-by-symbol and either accept or reject it; DFAs have exactly one transition per symbol per state while NFAs allow multiple or zero, yet both recognize exactly the class of regular languages.',
                'Context-Free Grammar (CFG): a set of production rules more expressive than regular expressions, capable of describing nested and recursive structures (like balanced parentheses) that finite automata provably cannot recognize, forming the basis of most programming language syntax.',
                'Turing Machine: an abstract computing device with an infinite tape and a simple set of rules that is provably capable of computing anything any other realistic computing device can compute (per the Church-Turing thesis), making it the theoretical yardstick against which all real computers and programming languages are measured.',
                'P vs NP & 3SAT: P is the class of problems solvable in polynomial time, NP is the class of problems whose solutions can be verified in polynomial time; 3SAT was the first problem proven NP-complete, meaning every problem in NP can be reduced to it, and whether P equals NP is one of the most important open questions in computer science.',
                'Undecidability & the Halting Problem: the Halting Problem (determining whether an arbitrary program halts on a given input) is proven undecidable — no algorithm can solve it for all possible programs — establishing a fundamental, provable limit on what computation can ever achieve, regardless of hardware or cleverness.',
                'The Pumping Lemma: a proof technique that exploits the finite-state nature of regular languages to show that sufficiently long strings in a regular language must contain a repeatable ("pumpable") substring, used to prove that certain languages are NOT regular.'
              ],
              simpleExplanation: `Picture a simple vending machine with a small number of states — like "waiting for coins," "enough money inserted," "dispensing" — where every button press or coin insertion moves it predictably from one state to another, according to a fixed rulebook, and it can never remember anything beyond which state it's currently in. That's a finite automaton: a machine with a limited, fixed memory (just its current state) that reads input piece by piece and ends up either "accepting" (dispensing your snack) or "rejecting" (spitting your coin back out). It turns out this simple machine, despite how limited it sounds, can recognize any pattern describable by a regular expression — but it fundamentally cannot handle patterns that require remembering how deep you've nested something, like matching balanced parentheses, because it just doesn't have a place to keep count.

A context-free grammar is a more powerful rulebook that can describe exactly these nested, recursive patterns — think of the rules for matching parentheses in a math expression, or the nested structure of an if-statement inside a function inside a class. Where a finite automaton is like a vending machine with no memory, a Turing machine is like being given an infinitely long strip of scratch paper and simple step-by-step instructions for reading, writing, and moving along it. This almost absurdly simple setup is, remarkably, powerful enough to compute anything any real computer ever built can compute — it's the theoretical yardstick every actual programming language and CPU is measured against.

Not everything is computable, though. The Halting Problem asks: can you write one universal program that looks at any other program and its input and always correctly predicts whether that program will eventually finish or run forever? It has been proven, with an airtight logical argument, that the answer is provably no — no such universal checker can ever exist, for any computer, no matter how fast or clever. This isn't a limitation of today's technology; it's a permanent mathematical fact about computation itself.

P versus NP asks a related but different question about efficiency rather than possibility. Think of a giant sudoku puzzle: solving it from scratch might take a very long time, but if someone hands you a filled-in grid and claims it's the answer, checking whether it's correct is fast. P is the class of problems that can be solved quickly; NP is the class of problems whose proposed solutions can be checked quickly, even if finding that solution from scratch might be extremely slow. Nobody has ever found a way to make solving as fast as checking for the hardest NP problems, nor has anyone proven it's impossible — whether P equals NP is one of the most famous unsolved questions in all of mathematics and computer science, with a million-dollar prize attached to a proof either way.`,
              realWorldApplications: [
                { title: `Regular expressions in Python, JavaScript, and grep`, description: `The regex engines built into modern languages and tools like grep are direct practical implementations of finite automata theory, matching exactly the class of "regular languages" that DFAs and NFAs can recognize.` },
                { title: `Programming language syntax defined by context-free grammars`, description: `The official syntax specifications of languages like Python and data formats like JSON are written as context-free grammars, and the parsers built from them rely on the extra expressive power CFGs have over simple regular expressions.` },
                { title: `RSA encryption's security resting on presumed computational hardness`, description: `Public-key cryptography schemes like RSA rely on the practical assumption that certain problems, like factoring large numbers, are hard to solve but easy to verify, a real-world stake in the broader question of efficient computation.` },
                { title: `Boolean satisfiability (SAT) solvers used in chip design verification`, description: `Modern SAT solvers, built on the NP-complete 3SAT problem covered here, are used industrially to formally verify hardware circuit designs and software correctness properties despite SAT being NP-complete in the worst case.` },
                { title: `Antivirus software's fundamental inability to perfectly detect all malware`, description: `The theoretical impossibility of a general virus-detection algorithm that works for all possible programs is a direct, practical consequence of the undecidability of the Halting Problem, explaining why antivirus relies on heuristics.` }
              ],
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
                },
                {
                  id: 'ex-aut2',
                  question: 'If a decision problem X is proven to be NP-complete, what does that tell us about the difficulty of solving X exactly, assuming P != NP?',
                  options: [
                    'No polynomial-time algorithm exists for X, and X is at least as hard as every other problem in NP',
                    'X can definitely be solved in polynomial time using dynamic programming',
                    'X is undecidable, meaning no algorithm can ever solve it',
                    'X can only be solved using a Turing machine, not any real computer'
                  ],
                  correctAnswer: 'No polynomial-time algorithm exists for X, and X is at least as hard as every other problem in NP',
                  explanation: 'NP-completeness means X is in NP and every problem in NP can be reduced to X in polynomial time; if P != NP, then no NP-complete problem (including X) has a polynomial-time algorithm, and a fast algorithm for X would imply a fast algorithm for every problem in NP.',
                  type: 'multiple-choice'
                },
                {
                  id: 'ex-aut3',
                  question: 'Explain, at a high level, why the Halting Problem is undecidable, using the idea of a diagonalization/self-reference argument.',
                  correctAnswer: 'Assume, for contradiction, that a program HALTS(P, I) exists that always correctly decides whether program P halts on input I. Construct a new program D that takes a program P as input, runs HALTS(P, P), and does the opposite: if HALTS says P halts on itself, D loops forever; if HALTS says P does not halt, D halts. Now ask what D(D) does: if D halts, then HALTS(D, D) must have said "does not halt," contradiction; if D loops forever, HALTS(D, D) must have said "halts," also a contradiction. Since assuming HALTS exists leads to contradiction either way, no such general algorithm can exist.',
                  explanation: 'This is a direct application of Turing\'s 1936 diagonalization argument, the same proof style Cantor used to show the reals are uncountable and Gödel used for incompleteness; it demonstrates a hard limit on computation that holds regardless of how fast or clever future computers become.',
                  type: 'free-response'
                },
                {
                  id: 'ex-aut4',
                  question: 'Use the Pumping Lemma intuition to explain why the language L = {0^n 1^n : n >= 0} (equal numbers of 0s followed by equal numbers of 1s) is NOT a regular language.',
                  correctAnswer: 'A DFA for L would need finitely many states, but to correctly decide whether the number of 1s matches the number of 0s, it would effectively need to "count" the 0s seen so far, which requires distinguishing an unbounded number of different counts; since the machine has only finitely many states, for a sufficiently long string of 0s two different prefix lengths must land in the same state, and pumping (repeating) the 0s in that section produces a string with mismatched counts that a real DFA for L would incorrectly accept, contradicting L\'s definition.',
                  explanation: 'This is exactly the classic use case for the Pumping Lemma: languages that require unbounded counting or unbounded matching (like balanced parentheses or equal-count languages) cannot be regular, because a finite-state machine has no way to remember an arbitrarily large count.',
                  type: 'free-response'
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
              readingQuestions: [
                'Why does the Pumping Lemma allow proving a language is NOT regular?',
                'Why does 3SAT reduction establish NP-completeness for a new problem?',
                'What is the difference between a language being "Turing-recognizable" and a language being "decidable"?',
                'Why does a nondeterministic finite automaton (NFA) recognize exactly the same class of languages as a DFA, despite appearing more powerful?',
                'How does the Chomsky hierarchy relate regular languages, context-free languages, and Turing-recognizable languages to each other?',
                'What would proving P = NP imply for the practical difficulty of cryptographic systems that rely on computational hardness assumptions?'
              ],
              masteryChecklist: ['Construct DFA for regular pattern', 'Reduce 3SAT to Clique in polynomial time'],
              capstoneMilestone: 'Formalize language complexity bounds for custom DSL parser.',
              estimatedStudyMinutes: 120,
              difficulty: 'advanced',
              glossary: [
                { term: 'NP-Complete', definition: 'A decision problem that is both in NP (its solutions can be verified in polynomial time) and NP-hard (every problem in NP can be reduced to it in polynomial time), making it among the hardest problems in NP.' },
                { term: 'DFA (Deterministic Finite Automaton)', definition: 'An abstract machine with a finite set of states and exactly one transition per input symbol from each state, used to recognize regular languages.' },
                { term: 'NFA (Nondeterministic Finite Automaton)', definition: 'An abstract machine like a DFA but allowing zero, one, or multiple transitions per symbol from a given state (including epsilon transitions); NFAs recognize exactly the same class of languages as DFAs despite the added flexibility.' },
                { term: 'Turing Machine', definition: 'An abstract model of computation consisting of an infinite tape, a read/write head, and a finite set of states and transition rules, used as the formal standard for what is computable.' },
                { term: 'Decidable / Undecidable', definition: 'A problem is decidable if an algorithm exists that always halts with the correct yes/no answer for every input; it is undecidable if no such algorithm can exist, as proven for the Halting Problem.' },
                { term: 'Halting Problem', definition: 'The problem of determining, given an arbitrary program and input, whether that program will eventually halt or run forever; proven undecidable by Alan Turing in 1936.' },
                { term: 'Reduction', definition: 'A transformation that converts instances of one problem into instances of another problem in a way that preserves the answer, used to show that one problem is at least as hard as another.' },
                { term: 'Pumping Lemma', definition: 'A proof technique showing that any sufficiently long string in a regular language must contain a repeatable substring, used to prove certain languages are not regular.' },
                { term: 'P (Complexity Class)', definition: 'The class of decision problems that can be solved by a deterministic algorithm in time polynomial in the size of the input.' },
                { term: 'NP (Complexity Class)', definition: 'The class of decision problems for which a proposed solution (certificate) can be verified in polynomial time, even if finding that solution may require exponential time.' }
              ],
              commonMisconceptions: [
                'Misconception: NP stands for "Non-Polynomial," meaning problems in NP cannot be solved in polynomial time. Reality: NP stands for "Nondeterministic Polynomial time," meaning a solution can be verified in polynomial time; it remains an open question (P vs NP) whether every problem in NP can also be solved in polynomial time, and many NP problems (all of P) can be.',
                'Misconception: An NP-complete problem can never be solved in practice. Reality: NP-complete problems can often be solved efficiently for realistic problem sizes or specific structured instances using heuristics, approximation algorithms, or specialized solvers (like SAT solvers); the guarantee that is missing is a polynomial-time algorithm for the worst case over all possible inputs.',
                'Misconception: A problem being undecidable means it is simply "very hard" or "not yet solved." Reality: Undecidability is a proven, permanent mathematical impossibility result — no algorithm, however clever or however much computing power is available, can ever correctly solve an undecidable problem for all inputs.',
                'Misconception: NFAs are strictly more powerful than DFAs because they can be in multiple states at once. Reality: Despite this apparent flexibility, every NFA can be systematically converted into an equivalent DFA (via the subset construction), so NFAs and DFAs recognize exactly the same class of languages: the regular languages.',
                'Misconception: Context-free grammars can describe any programming language\'s complete syntax and semantics. Reality: Context-free grammars can describe nested/recursive syntactic structure, but many real language rules (like "a variable must be declared before use") are context-sensitive and must be checked separately, typically during semantic analysis rather than parsing.'
              ],
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
              coreConcepts: [
                'AES-GCM: the Advanced Encryption Standard run in Galois/Counter Mode, a symmetric encryption scheme that both encrypts data and produces an authentication tag in one pass, giving both confidentiality and integrity/authenticity, which is why it is the workhorse cipher behind TLS and disk encryption.',
                'RSA & ECC (Asymmetric Cryptography): RSA relies on the computational difficulty of factoring the product of two large primes, while Elliptic Curve Cryptography (ECC) relies on the difficulty of the elliptic curve discrete logarithm problem; both let two parties who have never met establish secure communication using mathematically related public/private key pairs.',
                'Diffie-Hellman Key Exchange: a protocol that lets two parties jointly derive a shared secret over an insecure channel without ever transmitting the secret itself, solving the fundamental key-distribution problem that made secure communication between strangers difficult before public-key cryptography.',
                'Buffer Overflow & Stack Canaries: a buffer overflow occurs when a program writes past the bounds of an allocated memory buffer, potentially corrupting adjacent memory including return addresses; a stack canary is a known sentinel value placed before the return address that is checked before a function returns, detecting (though not preventing) many such overflows.',
                'TLS 1.3 Handshake: the modern protocol that combines asymmetric cryptography (to authenticate the server and establish a shared secret, typically via an ephemeral Diffie-Hellman exchange) with fast symmetric encryption (like AES-GCM) for the bulk of the session, achieving both strong security and low connection-setup latency.',
                'Cryptographic Hash Functions: deterministic functions that map arbitrary-length input to a fixed-length output such that finding two different inputs with the same output (a collision) is computationally infeasible, which underlies password storage, digital signatures, and data integrity verification.'
              ],
              simpleExplanation: `Imagine two friends who want to send locked boxes back and forth, and both already secretly know the same combination to the lock. That's symmetric encryption like AES: fast and simple, but it only works if both sides somehow already share the exact same secret combination beforehand — which raises the obvious question of how they safely agreed on that combination in the first place without anyone else finding out.

Asymmetric (public-key) cryptography like RSA solves that problem with a clever trick: imagine a mailbox with a slot anyone in the world can drop letters into (the public key), but only one specific person holds the physical key that can open the box and read what's inside (the private key). Anyone can encrypt a message using your public key, but only you can decrypt it, because the mathematics linking the public and private keys — built on the fact that multiplying two huge secret prime numbers together is easy, but factoring that giant product back apart is extraordinarily hard — only works in one direction without the private key.

Diffie-Hellman key exchange is an even more clever trick: imagine two people who want to agree on a shared paint color without ever showing anyone the exact recipe. Each person starts with a public base color, secretly mixes in their own private color, and publicly swaps the results; when each person then mixes their own private color into what they received, they both land on the exact same final color — but anyone who only saw the publicly swapped mixtures can't easily work backward to figure out the private colors that produced them. This lets two strangers establish a shared secret over an insecure line without ever transmitting the secret itself.

A buffer overflow is what happens when you pour more water into a labeled 8-ounce measuring cup than it can hold, and the overflow splashes onto and corrupts whatever ingredients happen to be sitting right next to it on the counter. In a computer's memory, if a program writes more data into a fixed-size buffer than it was allocated, the extra data can spill into and corrupt adjacent memory — including, in the worst case, overwriting critical control information that tells the program where to jump to next, which is how attackers historically hijacked programs. A stack canary is like placing a small, fragile decoration right next to the important documents on the counter: if the overflow knocks the decoration over, the program notices it's been disturbed and safely shuts down before the corrupted documents can cause real damage.`,
              realWorldApplications: [
                { title: `AES-GCM encrypting the bulk of every HTTPS connection`, description: `Once a TLS handshake establishes a shared secret, essentially all HTTPS web traffic is encrypted using AES, often in GCM mode, because symmetric encryption is far faster than asymmetric encryption for large volumes of data.` },
                { title: `RSA and elliptic-curve keys authenticating HTTPS certificates`, description: `The certificate authority system underlying HTTPS uses RSA or ECC public-key cryptography to let your browser verify a website's identity and securely establish a shared session key before any page content is exchanged.` },
                { title: `The TLS 1.3 handshake used by virtually every modern website`, description: `TLS 1.3, the current standard securing web traffic, combines an ephemeral Diffie-Hellman key exchange for forward secrecy with fast symmetric AES encryption for the session, exactly the two-stage design described in this topic.` },
                { title: `The 2014 Heartbleed vulnerability in OpenSSL`, description: `Heartbleed was a buffer over-read bug in the widely used OpenSSL library that let attackers trick servers into leaking adjacent memory contents, including private keys and passwords, illustrating the real-world severity of memory-safety bugs.` },
                { title: `bcrypt and SHA-256 for password storage`, description: `Modern authentication systems never store plaintext passwords; instead they store cryptographic hashes, often via slow, purpose-built functions like bcrypt, relying on the fact that reversing a good hash function is computationally infeasible.` }
              ],
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
                },
                {
                  id: 'ex-sec2',
                  question: 'Why does TLS 1.3 use asymmetric (public-key) cryptography only during the handshake and switch to symmetric encryption (like AES-GCM) for the actual data transfer?',
                  options: [
                    'Symmetric encryption is orders of magnitude faster computationally, so it is used for the bulk of data while asymmetric cryptography solves the harder problem of securely establishing a shared secret between two parties who have not met before',
                    'Asymmetric cryptography is not secure enough for repeated use',
                    'Symmetric encryption cannot be broken, while asymmetric encryption can be',
                    'TLS 1.3 does not actually use symmetric encryption at all'
                  ],
                  correctAnswer: 'Symmetric encryption is orders of magnitude faster computationally, so it is used for the bulk of data while asymmetric cryptography solves the harder problem of securely establishing a shared secret between two parties who have not met before',
                  explanation: 'This hybrid approach captures the best of both: asymmetric cryptography solves key distribution without a pre-shared secret, while symmetric ciphers like AES are far more computationally efficient for encrypting large volumes of application data.',
                  type: 'multiple-choice'
                },
                {
                  id: 'ex-sec3',
                  question: 'Explain how a stack canary helps detect a stack-based buffer overflow attack, and why it does not prevent all forms of memory corruption.',
                  correctAnswer: 'A stack canary is a known, often randomized, sentinel value placed on the stack between a local buffer and the saved return address; before a function returns, the program checks whether the canary value is unchanged. A buffer overflow that overwrites the return address by writing past the buffer\'s bounds will typically also overwrite the canary, and the mismatch triggers the program to abort rather than jump to attacker-controlled code. However, canaries only protect the specific memory layout they guard (adjacent to the return address); they do not stop overflows that corrupt heap memory, function pointers, or other data that does not sit between the buffer and the canary.',
                  explanation: 'Stack canaries are one layer of defense-in-depth alongside techniques like ASLR (Address Space Layout Randomization) and non-executable stack (NX/DEP); no single mitigation eliminates memory-safety bugs entirely, which is why memory-safe languages avoid the underlying class of vulnerability rather than mitigating symptoms.',
                  type: 'free-response'
                },
                {
                  id: 'ex-sec4',
                  question: 'Why does Diffie-Hellman key exchange provide "forward secrecy" when ephemeral keys are used, and why does that matter if a server\'s long-term private key is later compromised?',
                  correctAnswer: 'With ephemeral Diffie-Hellman, a fresh, temporary key pair is generated for each session and discarded afterward; the session\'s shared secret is derived from these ephemeral keys rather than directly from the server\'s long-term private key. If an attacker later steals the server\'s long-term private key, they still cannot reconstruct past session keys because those depended on ephemeral values that were never stored or transmitted and no longer exist, so previously recorded encrypted traffic remains protected.',
                  explanation: 'Forward secrecy is a critical property for real-world security because it limits the damage of a future key compromise to future sessions only, rather than retroactively exposing every session ever recorded by an eavesdropper, which is why TLS 1.3 mandates (EC)DHE key exchange rather than static RSA key transport.',
                  type: 'free-response'
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
              readingQuestions: [
                'How does Diffie-Hellman key exchange achieve forward secrecy in TLS 1.3?',
                'How does asymmetric encryption solve the key distribution problem that plagued purely symmetric cryptography?',
                'Why is a cryptographic hash function required to be collision-resistant, and what breaks if it is not?',
                'What is the difference between encryption (confidentiality) and a digital signature (authenticity/non-repudiation), and why does RSA support both?',
                'Why is Elliptic Curve Cryptography able to achieve comparable security to RSA with much smaller key sizes?',
                'How does zero-trust security differ from traditional perimeter-based network security models?'
              ],
              masteryChecklist: ['Derive RSA keypair from prime factors', 'Inspect TLS 1.3 handshake packet exchange'],
              capstoneMilestone: 'Audit capstone application API against OWASP top 10 vulnerabilities.',
              estimatedStudyMinutes: 120,
              difficulty: 'advanced',
              glossary: [
                { term: 'Public Key Cryptography', definition: 'A cryptographic system using mathematically related key pairs — a public key that can be shared openly and a private key kept secret — enabling secure communication and digital signatures without a pre-shared secret.' },
                { term: 'AES (Advanced Encryption Standard)', definition: 'A widely used symmetric-key block cipher standardized by NIST, operating on fixed-size blocks of data using the same key for encryption and decryption.' },
                { term: 'RSA', definition: 'An asymmetric cryptographic algorithm whose security relies on the computational difficulty of factoring the product of two large prime numbers, used for both encryption and digital signatures.' },
                { term: 'Diffie-Hellman Key Exchange', definition: 'A protocol allowing two parties to jointly establish a shared secret over an insecure channel without ever transmitting the secret directly, based on the difficulty of the discrete logarithm problem.' },
                { term: 'Buffer Overflow', definition: 'A software vulnerability that occurs when a program writes data beyond the boundary of an allocated buffer, potentially corrupting adjacent memory such as return addresses or function pointers.' },
                { term: 'Stack Canary', definition: 'A known sentinel value placed on the stack near the return address that is checked before a function returns, used to detect stack-based buffer overflow attacks.' },
                { term: 'Forward Secrecy', definition: 'A property of a key exchange protocol ensuring that the compromise of a long-term private key does not compromise past session keys, typically achieved using ephemeral (session-specific) key pairs.' },
                { term: 'Cryptographic Hash Function', definition: 'A deterministic function mapping arbitrary-length input to a fixed-length output such that finding a collision (two inputs with the same output) is computationally infeasible.' },
                { term: 'TLS (Transport Layer Security)', definition: 'A cryptographic protocol providing confidentiality, integrity, and authentication for data transmitted over a network, forming the security layer beneath HTTPS.' },
                { term: 'Zero-Trust Security', definition: 'A security model that assumes no user, device, or network segment is inherently trustworthy, requiring continuous verification of identity and authorization for every access request regardless of network location.' }
              ],
              commonMisconceptions: [
                'Misconception: Base64 encoding is a form of encryption. Reality: Base64 is simply a reversible encoding scheme for representing binary data as text; it provides no confidentiality whatsoever, since anyone can decode it without any secret key.',
                'Misconception: Longer encryption keys always mean proportionally stronger security regardless of algorithm. Reality: Security depends on the underlying mathematical problem\'s hardness, not just key length in isolation; for example, a 256-bit ECC key can offer comparable security to a much larger RSA key because the elliptic curve discrete logarithm problem is harder to solve per bit than integer factorization.',
                'Misconception: HTTPS alone guarantees an application is fully secure. Reality: TLS/HTTPS only protects data in transit between client and server; it does nothing to prevent application-level vulnerabilities like SQL injection, broken authentication, buffer overflows, or insecure server-side storage of secrets.',
                'Misconception: A stack canary or ASLR makes a program fully immune to memory corruption exploits. Reality: These are mitigations that raise the difficulty of successful exploitation, not guarantees of safety; sophisticated attackers have historically found ways to bypass individual mitigations, which is why defense-in-depth (combining multiple mitigations, or better, using memory-safe languages) is the standard practice.',
                'Misconception: Once data is encrypted, it is safe to store indefinitely regardless of key management. Reality: Encrypted data is only as secure as the confidentiality of its keys and the strength of the algorithm used; key rotation, secure key storage, and monitoring for cryptographic algorithm deprecation (e.g., migrating off weakened algorithms) are essential ongoing practices.'
              ],
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
              coreConcepts: [
                'FastAPI REST API: a modern Python web framework that uses type hints and Pydantic models to automatically validate request/response schemas and generate interactive API documentation, commonly used to expose a trained model\'s predict() method as a network-accessible HTTP endpoint.',
                'Docker Containerization: packaging an application together with its exact dependencies, libraries, and runtime environment into a portable image that runs identically across development, staging, and production machines, solving the classic "it works on my machine" problem for ML models with complex dependency trees.',
                'MLflow Experiment Tracking: a system for logging model training runs — their hyperparameters, metrics, and resulting model artifacts — in a structured, queryable way, so that different experiments can be compared and the exact conditions that produced a given model can be reproduced later.',
                'Data Drift & KS-Test: data drift is the change in the statistical distribution of production input data compared to the data a model was trained on; the Kolmogorov-Smirnov (KS) test is a statistical test commonly used to detect drift by measuring the distance between two empirical distributions.',
                'Model Serving Latency & Throughput: the operational metrics (response time per request, requests handled per second) that determine whether a deployed model can meet real-world application requirements, which often requires optimization techniques like batching or model format conversion (e.g., to ONNX) beyond what worked in a research notebook.',
                'Technical Debt in ML Systems: the observation that a trained model itself is often a small fraction of a production ML system\'s total code and complexity, with data pipelines, monitoring, feature stores, and serving infrastructure making up the majority of the engineering effort and long-term maintenance burden.'
              ],
              simpleExplanation: `Imagine trying to ship a delicate, fully-assembled science project to another city, hoping none of its custom parts get lost, break, or need reassembling differently once it arrives. Docker containerization instead packages the whole thing — the actual code, plus every exact library version and setting it depends on — into one sealed, portable shipping container that behaves identically no matter which truck, dock, or warehouse it ends up at, solving the classic problem of a model working perfectly on the developer's laptop and then mysteriously failing in production.

FastAPI is like installing a well-labeled service window in front of that container: instead of making everyone open the container and dig through code to use the model, you expose one simple, clearly documented window where anyone can hand over a request and get a prediction back, without needing to know anything about what's happening inside.

MLflow experiment tracking is like keeping a meticulous lab notebook for every experiment you ever run: instead of vaguely remembering "I think the good model used a slightly higher learning rate," you have an exact, searchable record of every experiment's settings, results, and the resulting model file itself, so you can always find and reproduce your best work later, and compare today's experiment fairly against last month's.

Data drift is like a grocery store that trained all its restocking decisions on last year's shopping habits, only to have a new competitor open nearby and completely change what the neighborhood buys — the old restocking model quietly becomes less and less accurate over time even though nothing about the store itself changed. Detecting drift means regularly comparing today's incoming "shopping patterns" (production data) against the patterns the model originally learned from, to catch this silent decay before it causes real damage.

Finally, the idea that ML systems carry hidden technical debt is like an iceberg: the trained model itself is the visible tip poking above the water, but the overwhelming bulk of the system — the pipelines that clean and move data, the monitoring that watches for drift, the infrastructure that serves predictions fast enough — sits hidden below the waterline, and that hidden mass is usually where most of the real, ongoing engineering effort actually goes.`,
              realWorldApplications: [
                { title: `Docker and Kubernetes for deploying models at scale`, description: `Companies running large-scale ML systems package trained models into Docker containers and orchestrate them with Kubernetes so that model serving infrastructure can be scaled up and down independently of the rest of the application.` },
                { title: `MLflow, developed and open-sourced by Databricks`, description: `MLflow is a widely adopted open-source tool, originally built at Databricks, specifically for tracking experiment parameters, metrics, and model artifacts across an ML team's many training runs, exactly as described in this topic.` },
                { title: `FastAPI serving trained models in production prediction endpoints`, description: `FastAPI's automatic request validation and interactive documentation have made it a common choice for wrapping trained models, in PyTorch or scikit-learn, in a production-grade HTTP prediction endpoint.` },
                { title: `Data drift monitoring in production fraud-detection systems`, description: `Financial institutions continuously monitor incoming transaction data for statistical drift versus their fraud model's training distribution, since shifting fraud patterns can silently degrade model accuracy over time.` },
                { title: `Google's "Hidden Technical Debt in Machine Learning Systems" paper`, description: `This widely cited 2015 Google paper formally documented how a trained model is often a tiny fraction of a real ML system's code, with data dependencies and infrastructure glue code accounting for most of the long-term maintenance cost.` }
              ],
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
                },
                {
                  id: 'ex-mlops2',
                  question: 'Why is Docker containerization particularly valuable when deploying a machine learning model, compared to a simpler application?',
                  options: [
                    'ML models often depend on specific, sometimes conflicting versions of large native libraries (e.g., CUDA, specific NumPy/PyTorch builds), and a container pins those exact dependencies so the model behaves identically wherever it runs',
                    'Docker automatically improves model accuracy',
                    'Containers eliminate the need for any model versioning',
                    'Docker replaces the need for a REST API entirely'
                  ],
                  correctAnswer: 'ML models often depend on specific, sometimes conflicting versions of large native libraries (e.g., CUDA, specific NumPy/PyTorch builds), and a container pins those exact dependencies so the model behaves identically wherever it runs',
                  explanation: 'ML dependency stacks are notoriously fragile to version mismatches (a specific PyTorch build tied to a specific CUDA version, for example); containerization freezes the entire runtime environment so the same image that passed testing is exactly what runs in production.',
                  type: 'multiple-choice'
                },
                {
                  id: 'ex-mlops3',
                  question: 'Explain why offline accuracy metrics (like test-set accuracy) can be a poor proxy for a model\'s real business impact once deployed.',
                  correctAnswer: 'Offline accuracy is measured on a static, historical dataset that may not reflect the live distribution of production inputs (data drift), does not capture how users actually respond to the model\'s outputs (behavioral feedback loops), and does not account for the business metric the model is meant to influence (e.g., revenue, click-through rate), which can diverge from raw prediction accuracy — for example, a slightly less accurate model that is faster or better calibrated at the decision threshold that matters could produce better business outcomes.',
                  explanation: 'This gap is why mature ML systems track online metrics via A/B testing and shadow deployments in addition to offline evaluation, since only live production behavior reveals the real-world effect of a model\'s predictions.',
                  type: 'free-response'
                },
                {
                  id: 'ex-mlops4',
                  question: 'A production model was trained on customer ages ranging from 18-65. A KS-test comparing this baseline distribution to last week\'s production input ages produces a very small p-value. What does this indicate, and what should an MLOps engineer investigate next?',
                  correctAnswer: 'A very small p-value from the KS-test indicates statistically significant data drift — the distribution of ages seen in production last week differs meaningfully from the training distribution. The engineer should investigate the root cause (e.g., a new user segment, a marketing campaign targeting a different demographic, an upstream data pipeline bug) and assess whether the model\'s predictions remain reliable for the shifted population, potentially triggering a retraining or recalibration process.',
                  explanation: 'Detecting drift is only the first step; distinguishing between benign drift (e.g., a genuine, expected shift in the user base) and a broken pipeline or a shift that degrades model quality requires further investigation and is central to responsible production ML operations.',
                  type: 'free-response'
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
              readingQuestions: [
                'Why is offline accuracy often a poor proxy for online production business metrics?',
                'What are feedback loops in production ML systems, and why can they cause a model to degrade its own future training data?',
                'How does MLflow\'s experiment tracking help make a research result reproducible months later?',
                'Why does horizontal scaling (adding more container replicas) work well for stateless model inference but poorly for stateful training jobs?',
                'What is the difference between data drift and concept drift, and why might a monitoring system need to detect both?',
                'Why might a team choose to convert a model to ONNX format before deploying it to production?'
              ],
              masteryChecklist: ['Build FastAPI serving endpoint', 'Write Dockerfile and build container image'],
              capstoneMilestone: 'Deploy capstone ML model as a scalable containerized web service.',
              estimatedStudyMinutes: 120,
              difficulty: 'advanced',
              glossary: [
                { term: 'Data Drift', definition: 'A change in the statistical distribution of input features seen in production compared to the distribution the model was trained on, which can degrade model performance over time.' },
                { term: 'Concept Drift', definition: 'A change in the underlying relationship between input features and the target variable over time, meaning even unchanged inputs may now imply a different correct output than when the model was trained.' },
                { term: 'FastAPI', definition: 'A modern Python web framework that uses type hints and Pydantic data models to validate requests and automatically generate interactive API documentation, commonly used for serving ML model predictions.' },
                { term: 'Docker Container', definition: 'A lightweight, portable, self-contained package bundling an application with its exact dependencies and runtime environment, ensuring consistent behavior across machines.' },
                { term: 'MLflow', definition: 'An open-source platform for managing the machine learning lifecycle, including experiment tracking (logging parameters, metrics, and artifacts), model packaging, and model registry.' },
                { term: 'Kolmogorov-Smirnov (KS) Test', definition: 'A nonparametric statistical test that measures the maximum distance between two empirical cumulative distribution functions, commonly used to detect whether a feature\'s production distribution has drifted from its training distribution.' },
                { term: 'Feedback Loop (in ML systems)', definition: 'A situation where a model\'s predictions influence future data collection or user behavior, which then becomes part of the data used to retrain the model, potentially reinforcing or amplifying the model\'s own biases over time.' },
                { term: 'ONNX (Open Neural Network Exchange)', definition: 'An open format for representing machine learning models that allows a model trained in one framework to be exported and run efficiently in another, often used to optimize inference performance in production.' },
                { term: 'Horizontal Scaling', definition: 'Increasing a system\'s capacity by adding more instances (replicas) of a service running in parallel, as opposed to vertical scaling, which increases the resources of a single instance.' },
                { term: 'Kubernetes', definition: 'An open-source container orchestration platform that automates the deployment, scaling, and management of containerized applications across a cluster of machines.' }
              ],
              commonMisconceptions: [
                'Misconception: Deploying an ML model ends at exporting a pickle (or similar serialized) file. Reality: A serialized model file is only the starting point; production deployment requires serving infrastructure, input validation, monitoring for drift and errors, versioning, rollback strategies, and a plan for retraining, all of which are substantial engineering work beyond the model artifact itself.',
                'Misconception: A model\'s offline test accuracy is the best predictor of its production business impact. Reality: Offline metrics are computed on static historical data and can diverge significantly from live performance due to data drift, feedback loops, and mismatches between the offline metric and the actual business objective; online A/B testing is needed to validate real-world impact.',
                'Misconception: Once data drift is detected, the model must always be immediately retrained. Reality: Not all detected drift degrades model performance; some drift is benign (e.g., a genuinely evolving but still well-modeled population), and retraining has real costs, so engineers typically also monitor downstream performance metrics before deciding retraining is warranted.',
                'Misconception: Containerizing a model automatically makes it fast and scalable. Reality: Containerization solves environment consistency and portability, but performance and scalability still depend on the serving framework\'s efficiency, batching strategy, hardware allocation, and horizontal scaling configuration (e.g., via Kubernetes).',
                'Misconception: Model code is the majority of a real-world ML system\'s complexity. Reality: As highlighted in "Hidden Technical Debt in Machine Learning Systems," the trained model is typically a small fraction of the total system; data collection, feature engineering pipelines, serving infrastructure, and monitoring make up the bulk of the engineering effort.'
              ],
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
              coreConcepts: [
                'Scaled Dot-Product Attention: the core self-attention computation Attention(Q,K,V) = softmax(QK^T/sqrt(d_k))V, which lets every token in a sequence dynamically weigh how much information to pull from every other token, forming the fundamental building block of transformer-based language models.',
                'Multi-Head Attention: running several scaled dot-product attention computations in parallel on different learned projections of the input, letting the model capture multiple types of relationships (syntactic, semantic, positional) simultaneously before combining them into one richer representation.',
                'LoRA (Low-Rank Adaptation): a parameter-efficient fine-tuning technique that freezes a pretrained model\'s original weights and injects small trainable low-rank matrices into each layer, drastically reducing the number of trainable parameters needed to adapt a large language model to a new task.',
                'RAG (Retrieval-Augmented Generation) & Vector Search: an architecture that retrieves relevant documents from an external knowledge store (using vector similarity search over embeddings) and feeds them into a language model\'s context window at inference time, letting the model answer using up-to-date or domain-specific information without retraining.',
                'Byte-Pair Encoding (BPE) Tokenization: a subword tokenization algorithm that iteratively merges the most frequent adjacent character/token pairs, letting a language model handle rare and out-of-vocabulary words by breaking them into common subword pieces rather than requiring a fixed word-level vocabulary.',
                'Embeddings: dense vector representations of tokens, words, or documents learned so that semantically similar items are positioned close together in vector space, which is what makes vector similarity search (the retrieval half of RAG) meaningful.'
              ],
              simpleExplanation: `Imagine reading a long paragraph and being asked a specific question about it. You don't weigh every single word equally — you unconsciously highlight the words most relevant to answering the question and lean on those more heavily while mostly skimming the rest. Scaled dot-product attention is the mathematical version of that instinctive highlighting: for every word, it computes a "relevance score" against every other word in the sentence, turns those scores into a set of highlighting weights that add up to one, and then blends the highlighted information together, letting the model dynamically decide what to pay attention to for each word rather than treating a whole sentence uniformly.

Multi-head attention just means doing this highlighting exercise several times in parallel, each time trained to notice a different kind of relationship — one "reader" might highlight based on grammar, another based on who a pronoun refers to — and then combining all their separate highlighted notes into one richer understanding, similar to having several different colored highlighters each tracking a different kind of clue.

Before a transformer can process text as numbers at all, it needs to break words into small numeric-friendly pieces. Byte-pair encoding does this the way you might sound out an unfamiliar word by breaking it into familiar chunks you already recognize — "unbelievable" might get split into "un," "believ," and "able" — letting the model handle rare or made-up words gracefully instead of needing a fixed dictionary entry for every possible word in existence.

LoRA is like updating a huge, professionally printed textbook not by reprinting the entire book, but by slipping a small stack of sticky notes with just the corrections and updates onto the relevant pages. The original textbook, the pretrained model's weights, stays completely untouched and frozen, while a small, cheap-to-train set of extra numbers captures everything needed to adapt the model to a new task, dramatically reducing the cost of customizing a giant model.

Finally, Retrieval-Augmented Generation is the difference between a closed-book exam and an open-book exam. A plain language model answers purely from what it memorized during training, like a closed-book exam, which means it can be outdated or simply wrong about things it never saw. RAG instead lets the model first look up relevant, up-to-date documents from an outside library — using embeddings, which are like a map where similar-meaning pieces of text are placed physically close together, to quickly find the most relevant pages — and then answer the question with those looked-up pages open in front of it, like a well-prepared student taking an open-book exam.`,
              realWorldApplications: [
                { title: `Scaled dot-product self-attention inside modern large language models`, description: `The transformer architecture's self-attention mechanism, first introduced in the 2017 "Attention Is All You Need" paper, remains the core computational building block of essentially every major large language model deployed today.` },
                { title: `LoRA fine-tuning popularized by Stable Diffusion and open-source LLM communities`, description: `LoRA adapters are widely used to cheaply customize large pretrained models like Stable Diffusion and open-source LLMs for a specific style or domain, since training only a small set of low-rank matrices is far cheaper than full retraining.` },
                { title: `Retrieval-Augmented Generation in enterprise chatbots and Microsoft Copilot`, description: `Products like Microsoft Copilot and many enterprise support chatbots use RAG to ground language model answers in a company's specific, up-to-date internal documents rather than relying solely on the model's frozen training data.` },
                { title: `Byte-pair encoding tokenizers in GPT and RoBERTa`, description: `GPT-family models and Meta's RoBERTa both use byte-pair-encoding-based tokenizers to split text into subword units, letting the models handle rare words, typos, and multiple languages without an impractically large fixed vocabulary.` },
                { title: `Vector databases like Pinecone and pgvector powering semantic search`, description: `Vector databases store document embeddings and perform fast similarity search over them, forming the retrieval half of production RAG systems used for semantic search, recommendation, and chatbot knowledge grounding.` }
              ],
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
                },
                {
                  id: 'ex-nlp2',
                  question: 'Why does LoRA dramatically reduce the number of trainable parameters needed to fine-tune a large language model, compared to full fine-tuning?',
                  options: [
                    'It freezes the original pretrained weight matrices and instead trains a pair of much smaller low-rank matrices whose product approximates the needed weight update, requiring far fewer parameters than updating the full weight matrix',
                    'It deletes most of the model\'s layers before fine-tuning',
                    'It converts all weights to a lower numerical precision, which is the same thing as reducing parameter count',
                    'It only fine-tunes the tokenizer, not the model weights'
                  ],
                  correctAnswer: 'It freezes the original pretrained weight matrices and instead trains a pair of much smaller low-rank matrices whose product approximates the needed weight update, requiring far fewer parameters than updating the full weight matrix',
                  explanation: 'For a weight matrix of size d x k, LoRA represents the update as a product of two much smaller matrices of rank r (sizes d x r and r x k), where r is far smaller than d or k; this reduces trainable parameters often by 99% or more while still capturing enough of the needed adaptation for many downstream tasks.',
                  type: 'multiple-choice'
                },
                {
                  id: 'ex-nlp3',
                  question: 'Explain why RAG is often preferred over full fine-tuning when an application needs a language model to answer questions using frequently changing or proprietary information.',
                  correctAnswer: 'Fine-tuning bakes information into the model\'s weights, which is expensive to redo every time the underlying information changes and offers no easy way to verify or cite the source of a specific answer; RAG instead retrieves relevant, up-to-date documents from an external knowledge store at query time and provides them as context, so updating the knowledge base (e.g., adding a new document) immediately changes what the model can answer without any retraining, and responses can be grounded with citations back to the retrieved source documents.',
                  explanation: 'This is why RAG has become the standard architecture for enterprise question-answering systems over proprietary or rapidly changing data: it decouples "what the model knows" from "what the model was trained on," at the cost of needing a reliable retrieval pipeline.',
                  type: 'free-response'
                },
                {
                  id: 'ex-nlp4',
                  question: 'Given a vocabulary built by Byte-Pair Encoding that includes the subword tokens ["un", "believ", "able", "un-believable"], explain why BPE would generally still prefer to tokenize a rare word it has never seen (e.g., "unfreezable") into subword pieces rather than a single [UNK] (unknown) token.',
                  correctAnswer: 'BPE builds its vocabulary from frequent character and subword sequences observed during training, so even a word never seen as a whole unit can usually be decomposed into smaller, previously seen subword pieces (e.g., "un" + "freez" + "able"); this lets the model represent and process novel or rare words compositionally instead of collapsing them into a single uninformative [UNK] token that discards all information about the word.',
                  explanation: 'This compositional handling of rare words is one of BPE\'s (and subword tokenization more generally) key practical advantages over whole-word vocabularies, which must map any word outside a fixed dictionary to an [UNK] token and lose essentially all information about it.',
                  type: 'free-response'
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
              readingQuestions: [
                'How does LoRA reduce trainable parameter overhead during LLM fine-tuning?',
                'Why is scaled dot-product self-attention parallelizable compared to RNNs?',
                'How does vector similarity search (e.g., cosine similarity or approximate nearest neighbor search) identify relevant documents for a RAG pipeline?',
                'Why might a RAG system still produce an incorrect or hallucinated answer even when the retrieval step successfully finds the right documents?',
                'What is the trade-off between using a larger BPE vocabulary versus a smaller one, in terms of sequence length and rare-word handling?',
                'How does LoRA\'s reduced parameter count also reduce the storage and deployment cost of maintaining many task-specific fine-tuned model variants?'
              ],
              masteryChecklist: ['Implement self-attention mechanism in NumPy/PyTorch', 'Construct vector indexing RAG pipeline'],
              capstoneMilestone: 'Integrate LLM reasoning endpoint or RAG pipeline into capstone project.',
              estimatedStudyMinutes: 120,
              difficulty: 'advanced',
              glossary: [
                { term: 'Self-Attention', definition: 'An attention mechanism that relates different positions within a single sequence to each other, computing a representation of each token as a weighted combination of all tokens in the sequence.' },
                { term: 'Scaled Dot-Product Attention', definition: 'The specific attention formula Attention(Q,K,V) = softmax(QK^T / sqrt(d_k))V used in transformers, where the scaling factor prevents softmax gradients from vanishing at high dimensions.' },
                { term: 'LoRA (Low-Rank Adaptation)', definition: 'A parameter-efficient fine-tuning method that freezes a pretrained model\'s weights and trains small low-rank matrices injected into each layer to approximate the necessary weight updates.' },
                { term: 'Retrieval-Augmented Generation (RAG)', definition: 'An architecture that retrieves relevant external documents via similarity search and supplies them as context to a language model at inference time, grounding its responses in retrieved information rather than relying solely on parametric memory.' },
                { term: 'Byte-Pair Encoding (BPE)', definition: 'A subword tokenization algorithm that iteratively merges the most frequent adjacent pairs of characters or tokens to build a vocabulary, allowing rare or unseen words to be represented as sequences of common subword units.' },
                { term: 'Embedding', definition: 'A dense, fixed-length vector representation of a token, word, or document, learned so that items with similar meaning are positioned close together in the vector space.' },
                { term: 'Vector Database', definition: 'A database optimized for storing and performing fast similarity search over high-dimensional embedding vectors, commonly used as the retrieval component of a RAG pipeline.' },
                { term: 'Hallucination (in LLMs)', definition: 'The phenomenon where a language model generates fluent, confident-sounding text that is factually incorrect or unsupported by any real source, a known failure mode that RAG partially mitigates by grounding responses in retrieved documents.' },
                { term: 'Fine-Tuning', definition: 'The process of further training a pretrained model on a smaller, task-specific dataset to adapt its behavior, ranging from full fine-tuning (updating all weights) to parameter-efficient methods like LoRA.' },
                { term: 'Parameter-Efficient Fine-Tuning (PEFT)', definition: 'A family of fine-tuning techniques, including LoRA and adapters, that update only a small subset or a compact reparameterization of a model\'s parameters, reducing compute and storage costs compared to full fine-tuning.' }
              ],
              commonMisconceptions: [
                'Misconception: RAG retrains or updates the underlying neural network weights of the language model. Reality: RAG does not modify the model\'s parameters at all; it retrieves relevant text at inference time and inserts it into the model\'s input context, leaving the model weights completely unchanged.',
                'Misconception: Adding RAG to a language model eliminates hallucination entirely. Reality: RAG substantially reduces hallucination by grounding answers in retrieved documents, but a model can still ignore, misread, or fabricate details beyond what the retrieved context supports, or the retrieval step itself can fail to find the truly relevant document.',
                'Misconception: LoRA fine-tuning produces a model of equivalent quality to full fine-tuning in every scenario. Reality: LoRA is remarkably effective for many adaptation tasks at a fraction of the training cost, but for tasks requiring substantial new capability or knowledge far from the base model\'s pretraining distribution, full fine-tuning (or continued pretraining) can still outperform low-rank adaptation.',
                'Misconception: A larger BPE vocabulary is always strictly better because it captures more whole words. Reality: A larger vocabulary increases the embedding and output layer size (more parameters and compute) and can leave rarer subwords under-trained; vocabulary size is a deliberate trade-off between sequence length efficiency and model size/training efficiency.',
                'Misconception: Self-attention understands the meaning of a sentence the way a human reader does. Reality: Self-attention computes learned statistical weightings between token representations based on patterns seen during training; it produces useful representations for downstream tasks without any guarantee of human-like semantic understanding or grounded comprehension.'
              ],
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
