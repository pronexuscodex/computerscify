import { CurriculumModule } from '../../types/curriculum';
import { VERIFIED_VIDEOS } from '../verifiedVideoRegistry';

export const phase0Modules: CurriculumModule[] = [
  {
    id: 'p0-m1',
    phaseId: 0,
    title: 'Digital and Computational Foundations',
    slug: 'digital-foundations',
    category: 'cs',
    summary: 'Master how computers represent information, execute instructions, manage memory, and process text and data from absolute first principles.',
    objective: 'Develop a foundational mental model of digital information representation, binary arithmetic, computer hardware organization, operating systems, internet protocols, and effective self-directed technical learning habits.',
    prerequisiteModuleIds: [],
    estimatedHours: 18,
    difficulty: 'beginner',
    colorAccent: 'softblue',
    capstone: {
      id: 'capstone-p0-m1',
      title: 'First Principles Computer Diagnostics & Binary Encoder',
      description: 'Design and build a pure binary-to-text encoder and decoder from scratch, documenting the exact representation of integers, negative numbers (Two’s Complement), and IEEE 754 floating point numbers.',
      constraints: [
        'Must run completely inside the browser using Python or JavaScript.',
        'Must not use external library conversions (e.g. no built-in bin() or hex() helpers for the core algorithm).',
        'Must handle 8-bit unsigned, 8-bit Two’s Complement signed integers, and ASCII string encoding.'
      ],
      expectedDeliverables: [
        'Pure binary conversion functions for integers and Two’s Complement.',
        'Bitwise operator implementations (AND, OR, XOR, SHIFT).',
        'Written explanation of how floating point loss-of-precision occurs.',
        'Documented test suite validating edge cases like zero, max positive, and min negative.'
      ],
      evaluationRubric: [
        {
          criterion: 'Correctness of Bit Representation',
          weight: '40%',
          description: 'Accurately converts positive and negative integers using bitwise logic without external library shortcuts.'
        },
        {
          criterion: 'Edge Case Handling',
          weight: '30%',
          description: 'Correctly handles zero, boundary overflow, and character encoding maps.'
        },
        {
          criterion: 'Technical Explanation',
          weight: '30%',
          description: 'Clear, mathematically sound explanation of two’s complement and floating point representations.'
        }
      ]
    },
    topics: [
      {
        id: 'p0-m1-t1',
        moduleId: 'p0-m1',
        title: 'Information Representation: Bits, Bytes, and Encodings',
        slug: 'information-representation',
        summary: 'Explore how physical voltage levels translate to binary digits (bits), hexadecimal notation, ASCII, and UTF-8 Unicode.',
        order: 1,
        masteryPack: {
          learningObjective: 'Understand how discrete physical states represent numbers, text, images, and audio in modern computers.',
          prerequisites: ['Basic arithmetic fluency (addition, subtraction, multiplication)'],
          coreConcepts: [
            'Binary (Base-2) and Hexadecimal (Base-16) Number Systems',
            'Bitwise Operations (AND, OR, XOR, NOT, Bit-Shifts)',
            'Two’s Complement Representation for Signed Integers',
            'IEEE 754 Floating-Point Standard (Sign, Exponent, Mantissa)',
            'Character Encodings: ASCII vs UTF-8 Variable-Length Encoding'
          ],
          primaryLecture: VERIFIED_VIDEOS['p0-m1-t1'] as any,
          primaryText: {
            id: 'book-nand2tetris',
            title: 'The Elements of Computing Systems: Building a Modern Computer from First Principles (Nand2Tetris)',
            authors: ['Noam Nisan', 'Shimon Schocken'],
            url: 'https://www.nand2tetris.org/course',
            pdfUrl: 'https://www.cs.virginia.edu/~robins/Turing_Paper_1936.pdf',
            recommendedChapter: 'Chapter 1: Boolean Logic & Chapter 2: Boolean Arithmetic',
            publisherOrInstitution: 'MIT Press / NAND2Tetris Open Course',
            accessStatus: 'verified'
          },
          recommendedChapter: 'Chapter 1: Boolean Logic (Pages 1–25)',
          authoritativeResearchSource: {
            id: 'paper-shannon-1948',
            title: 'A Mathematical Theory of Communication',
            authors: ['Claude E. Shannon'],
            year: 1948,
            venue: 'Bell System Technical Journal',
            doiOrArxiv: '10.1002/j.1538-7305.1948.tb01338.x',
            openAccessUrl: 'https://dspace.mit.edu/bitstream/handle/1721.1/11173/34541431-MIT.pdf',
            paperType: 'seminal',
            difficulty: 'intermediate',
            prerequisites: ['Basic discrete probability concepts'],
            summary: 'The foundational paper that birthed Information Theory. Shannon defined the "bit" as the fundamental unit of information measurement and derived fundamental limits on communications channel capacity and data compression.',
            whyItMatters: 'Shannon replaced vague engineering intuitions about signal processing with an exact mathematical measure of information entropy.',
            sectionsToRead: 'Section 1: Discrete Noiseless Systems (Pages 1–10)',
            readingQuestions: [
              'How does Shannon mathematically define the amount of information in a message?',
              'What is the physical meaning of entropy in communication channels?',
              'Why is binary log (base 2) used to measure information units?'
            ],
            relatedTopicIds: ['p0-m1-t1', 'p1-m6-t1'],
            accessStatus: 'verified'
          },
          modernSurveyOrTutorial: {
            id: 'paper-unicode-standard',
            title: 'The Unicode Standard: Architecture & Encoding Formats',
            authors: ['The Unicode Consortium'],
            year: 2023,
            venue: 'Unicode Consortium Technical Report',
            openAccessUrl: 'https://www.unicode.org/versions/Unicode15.0.0/ch02.pdf',
            paperType: 'applied',
            difficulty: 'beginner',
            prerequisites: ['Basic binary & hexadecimal understanding'],
            summary: 'An authoritative specification detailing how code points map to bytes in UTF-8, UTF-16, and UTF-32.',
            whyItMatters: 'Global software engineering requires understanding how multi-byte characters prevent data corruption across languages.',
            sectionsToRead: 'Section 2.5: Encoding Forms (UTF-8 details)',
            readingQuestions: [
              'How does UTF-8 remain backwards compatible with ASCII?',
              'How many bytes does UTF-8 use to encode code points outside the ASCII range?'
            ],
            relatedTopicIds: ['p0-m1-t1'],
            accessStatus: 'verified'
          },
          practicalExercises: [
            {
              id: 'ex-p0-1',
              question: 'Convert the decimal number 157 into binary (8-bit) and hexadecimal.',
              options: [
                '10011101_2 and 0x9D',
                '10101101_2 and 0xAD',
                '01111101_2 and 0x7D',
                '10011111_2 and 0x9F'
              ],
              correctAnswer: 0,
              explanation: '157 = 128 + 16 + 8 + 4 + 1 = 10011101_2. Grouping 4 bits: 1001 = 9, 1101 = D (13 in hex). Thus 0x9D.',
              type: 'multiple-choice'
            },
            {
              id: 'ex-p0-2',
              question: 'What is the 8-bit Two’s Complement representation of -18?',
              options: [
                '11101110',
                '11101101',
                '00010010',
                '10010010'
              ],
              correctAnswer: 0,
              explanation: 'Positive 18 in binary is 00010010. Invert all bits: 11101101. Add 1: 11101110.',
              type: 'multiple-choice'
            }
          ],
          interactiveLab: {
            id: 'lab-p0-1',
            title: 'Bitwise Representation Lab',
            type: 'python',
            instructions: 'Write a Python function `int_to_bits(n, bit_count=8)` that converts an integer `n` into an 8-bit binary string representation without using built-in `bin()`.',
            starterCode: `def int_to_bits(n: int, bit_count: int = 8) -> str:
    # Handle two's complement for negative numbers
    if n < 0:
        n = (1 << bit_count) + n
    
    bits = []
    for i in range(bit_count - 1, -1, -1):
        bit = (n >> i) & 1
        bits.append(str(bit))
    return "".join(bits)

# Test cases
print("-18 in 8 bits:", int_to_bits(-18, 8))
print("157 in 8 bits:", int_to_bits(157, 8))
`,
            testCases: [
              {
                expectedOutput: '-18 in 8 bits: 11101110',
                description: 'Validates negative number conversion using bitwise shift and mask.'
              }
            ]
          },
          readingQuestions: [
            'Why does Two’s complement have only one representation for zero, unlike One’s complement?',
            'What causes floating point precision errors like 0.1 + 0.2 != 0.3 in IEEE 754 float representation?',
            'How does bit-shifting to the left by k positions relate to multiplication by 2^k?'
          ],
          masteryChecklist: [
            'Convert decimal numbers to binary, octal, and hexadecimal fluently.',
            'Perform 8-bit two’s complement addition and detect overflow.',
            'Explain how UTF-8 variable-length character encoding functions.',
            'Differentiate between fixed-point integer arithmetic and IEEE 754 floating-point arithmetic.'
          ],
          capstoneMilestone: 'Milestone 1: Implement custom bit-packing and Two’s Complement encoder module.',
          estimatedStudyMinutes: 240,
          difficulty: 'beginner',
          glossary: [
            { term: 'Bit', definition: 'The smallest unit of digital information, taking a value of either 0 or 1.' },
            { term: 'Byte', definition: 'A group of 8 bits capable of storing 256 distinct values.' },
            { term: 'Two’s Complement', definition: 'A mathematical operation on binary numbers used to represent signed integers in computing.' },
            { term: 'UTF-8', definition: 'A variable-width character encoding capable of encoding all 1,114,112 valid code points in Unicode.' }
          ],
          commonMisconceptions: [
            'Misconception: Computers store text as letters. Reality: Computers store only numeric byte values which are rendered as glyphs using font mapping tables.',
            'Misconception: Floating point numbers are exact real numbers. Reality: Floats are binary scientific approximations with finite mantissa precision.'
          ],
          connectionsToLaterModules: [
            'Essential for Assembly language and CPU Architecture in Phase 3',
            'Prerequisite for Bitwise algorithms and Cryptography in Phase 3'
          ],
          citation: {
            text: 'Shannon, C. E. (1948). A Mathematical Theory of Communication. Bell System Technical Journal, 27(3), 379–423.'
          },
          accessStatus: 'verified'
        }
      },
      {
        id: 'p0-m1-t2',
        moduleId: 'p0-m1',
        title: 'Operating Systems, Memory, and File Abstractions',
        slug: 'operating-systems-memory',
        summary: 'Understand the role of the operating system kernel, processes, threads, virtual memory, and the hierarchical filesystem.',
        order: 2,
        masteryPack: {
          learningObjective: 'Grasp how operating systems manage hardware resources (CPU, RAM, storage) and present clean software abstractions to applications.',
          prerequisites: ['Bit & byte representation fundamentals'],
          coreConcepts: [
            'Kernel vs User Space and System Calls',
            'Processes, Threads, and CPU Scheduling',
            'Virtual Memory, Paging, and Page Faults',
            'Filesystem Structure: Inodes, Directories, and File Descriptors',
            'Standard Streams (stdin, stdout, stderr) and Process I/O'
          ],
          primaryLecture: VERIFIED_VIDEOS['p0-m1-t2'] as any,
          primaryText: {
            id: 'book-ostep',
            title: 'Operating Systems: Three Easy Pieces (OSTEP)',
            authors: ['Remzi H. Arpaci-Dusseau', 'Andrea C. Arpaci-Dusseau'],
            url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/',
            pdfUrl: 'https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-intro.pdf',
            recommendedChapter: 'Chapter 4: Processes & Chapter 13: Virtual Memory',
            publisherOrInstitution: 'University of Wisconsin-Madison (Free Online Book)',
            accessStatus: 'verified'
          },
          recommendedChapter: 'Chapter 4: The Abstraction: The Process',
          authoritativeResearchSource: {
            id: 'paper-ritchie-1974',
            title: 'The UNIX Time-Sharing System',
            authors: ['Dennis M. Ritchie', 'Ken L. Thompson'],
            year: 1974,
            venue: 'Communications of the ACM',
            doiOrArxiv: '10.1145/361011.361061',
            openAccessUrl: 'https://www.cs.berkeley.edu/~brewer/cs262/unix.pdf',
            paperType: 'historical',
            difficulty: 'beginner',
            prerequisites: ['Basic OS concepts'],
            summary: 'The landmark paper presenting UNIX, its hierarchical file system, shell piping, and treat-everything-as-a-file paradigm.',
            whyItMatters: 'Modern operating systems (Linux, macOS, iOS, Android) are direct descendants of UNIX architectural concepts.',
            sectionsToRead: 'Sections 1–4: File System and Process Management',
            readingQuestions: [
              'What is the significance of the "everything is a file" UNIX philosophy?',
              'How does UNIX fork() and exec() create new processes?'
            ],
            relatedTopicIds: ['p0-m1-t2'],
            accessStatus: 'verified'
          },
          practicalExercises: [
            {
              id: 'ex-p0-3',
              question: 'What is the primary purpose of Virtual Memory in modern operating systems?',
              options: [
                'To give each process its own isolated address space and protect memory safety.',
                'To make the CPU run twice as fast.',
                'To permanently store files when the power is turned off.',
                'To compress hard drive space automatically.'
              ],
              correctAnswer: 0,
              explanation: 'Virtual memory isolates processes into virtual address spaces, preventing one faulty application from overwriting memory used by another application or the OS kernel.',
              type: 'multiple-choice'
            }
          ],
          interactiveLab: {
            id: 'lab-p0-2',
            title: 'Virtual Memory & Page Table Simulation',
            type: 'python',
            instructions: 'Simulate a simple page table translation mechanism mapping Virtual Page Numbers (VPN) to Physical Frame Numbers (PFN).',
            starterCode: `# Simple 4KB Page Table Translation Simulation
PAGE_SIZE = 4096  # 4KB pages

page_table = {
    0: 5,  # Virtual Page 0 maps to Physical Frame 5
    1: 2,  # Virtual Page 1 maps to Physical Frame 2
    2: 8,  # Virtual Page 2 maps to Physical Frame 8
}

def translate_address(virtual_address: int) -> int:
    vpn = virtual_address // PAGE_SIZE
    offset = virtual_address % PAGE_SIZE
    
    if vpn not in page_table:
        raise MemoryError(f"Page Fault! Virtual Page {vpn} not in page table.")
        
    pfn = page_table[vpn]
    physical_address = (pfn * PAGE_SIZE) + offset
    return physical_address

# Test translation
v_addr = 5000  # Page 1, offset 904
print(f"Virtual Address {v_addr} -> Physical Address {translate_address(v_addr)}")
`,
            testCases: [
              {
                expectedOutput: 'Virtual Address 5000 -> Physical Address 9096',
                description: 'Verifies VPN and offset translation calculation.'
              }
            ]
          },
          readingQuestions: [
            'What is the difference between a context switch between threads in the same process vs context switch between different processes?',
            'What happens during a page fault at the hardware and kernel level?'
          ],
          masteryChecklist: [
            'Explain process lifecycle states (Ready, Running, Blocked).',
            'Understand how page tables translate virtual addresses to physical addresses.',
            'Describe how standard I/O redirection and piping work in a command line shell.'
          ],
          capstoneMilestone: 'Milestone 2: Process & memory allocation simulation model.',
          estimatedStudyMinutes: 210,
          difficulty: 'beginner',
          glossary: [
            { term: 'Kernel', definition: 'The core component of an operating system with complete control over system memory and hardware.' },
            { term: 'Virtual Memory', definition: 'A memory management technique that creates an abstraction of storage resources for each process.' },
            { term: 'Page Fault', definition: 'An interrupt triggered when a program accesses a page mapped into virtual address space that is not currently loaded in physical RAM.' }
          ],
          commonMisconceptions: [
            'Misconception: Threads share no memory. Reality: Threads within the same process share the same heap and code space, but have separate call stacks.'
          ],
          connectionsToLaterModules: [
            'Prerequisite for Operating Systems & Networking in Phase 3',
            'Foundation for Cloud Containerization (Docker) in Phase 7'
          ],
          citation: {
            text: 'Ritchie, D. M., & Thompson, K. (1974). The UNIX Time-Sharing System. Communications of the ACM, 17(7), 365–375.'
          },
          accessStatus: 'verified'
        }
      }
    ]
  }
];
