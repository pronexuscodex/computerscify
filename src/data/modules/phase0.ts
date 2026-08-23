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
            'Binary (Base-2) and Hexadecimal (Base-16) Number Systems: computers only ever manipulate electrical states with two stable levels, so every number, instruction, and character is ultimately a string of 0s and 1s; hexadecimal is a human-friendly shorthand because each hex digit maps cleanly onto exactly 4 bits, making long binary strings far easier to read and write.',
            'Bitwise Operations (AND, OR, XOR, NOT, Bit-Shifts): these are the primitive logical operations the CPU performs directly on individual bits, and they underlie everything from setting hardware flags to fast multiplication/division by powers of two, so understanding them is a prerequisite for reasoning about how any higher-level operation is actually executed.',
            'Two’s Complement Representation for Signed Integers: this is the near-universal scheme hardware uses to represent negative numbers, because it lets the same binary adder circuit perform both addition and subtraction without any special-casing for sign, which is essential to explaining how real CPUs are built cheaply and efficiently.',
            'IEEE 754 Floating-Point Standard (Sign, Exponent, Mantissa): this standard defines how computers approximate real numbers (like 3.14 or 0.1) using a fixed number of bits split into a sign bit, an exponent field, and a mantissa (fraction) field, and understanding its structure explains why floating-point arithmetic is inherently imprecise.',
            'Character Encodings: ASCII vs UTF-8 Variable-Length Encoding: text must ultimately be stored as numbers, and the mapping chosen between numbers and characters determines whether a program can correctly represent every human language or only a narrow subset, which is why encoding choice has real-world correctness consequences.',
            'Bit-Shift Arithmetic and Its Relationship to Multiplication: shifting a binary number left or right by k positions is mathematically equivalent to multiplying or dividing by 2^k, a shortcut that connects the abstract number system to concrete, fast hardware operations.'
          ],
          simpleExplanation: `Imagine a computer is really just a giant wall of light switches, and every single switch can only be off or on — there's no dimmer setting, no "sort of on." Each switch is called a bit, and computers build literally everything — numbers, letters, photos, songs — out of long rows of these switches. A byte is just a bundle of 8 switches at a time. Writing out long strings of 0s and 1s gets exhausting for humans to read, so engineers invented hexadecimal: a shorthand where every group of 4 switches gets replaced by one symbol (0-9, then A-F), so a whole byte can be written as just two characters instead of eight.

Now, how do you represent a negative number using only on/off switches? Think of a car's odometer with a fixed number of digits — say it shows 000 to 999 and then wraps back around to 000. If you could drive it backward past zero, it wouldn't display a minus sign; it would roll around to 999. Computers use this exact same "rolling around" trick, called two's complement, to represent negative numbers: instead of storing a separate minus sign, a negative number is stored as a big positive number that has wrapped past zero. The beautiful payoff is that the same simple adding circuit that computes 5 + 3 can also compute 5 - 3, because subtracting is secretly just adding this wrapped-around version — no separate subtraction machinery is needed inside the chip.

Fractions are trickier still. Computers store them the way scientists write very large or very small numbers — like 6.02 x 10^23 — using a movable decimal point instead of a fixed one. This is the idea behind IEEE 754 floating point: it splits a number's switches into a sign, an "exponent" that acts like the zoom level of a ruler, and a "mantissa" that holds the actual significant digits. Because only a fixed number of digit-switches exist, most fractions — even a simple one like 0.1 — can only be approximated, the same way you can never finish writing out 1/3 as a decimal (0.333...). That's why a computer can sometimes claim 0.1 + 0.2 isn't quite 0.3.

Finally, text is stored the same way as everything else: as numbers. Think of it like a phone book that maps a number to a name — ASCII maps the numbers 0 through 127 to English letters, digits, and punctuation. But English isn't the only language on Earth, so UTF-8 extends this idea: common characters still use just one switch-byte (staying compatible with old ASCII software), while rarer characters and emoji quietly use two, three, or four bytes stitched together, all without breaking programs that only expect the simple, old-fashioned one-byte case.`,
          realWorldApplications: [
            {
              title: "x86 and ARM CPU arithmetic circuits",
              description: 'Every processor in a laptop or phone uses two’s complement so its adder circuit can perform both addition and subtraction instructions without needing a separate, dedicated subtraction unit.'
            },
            {
              title: "The 0.1 + 0.2 rounding quirk in JavaScript and Python",
              description: 'Both languages store decimal numbers using IEEE 754 double-precision floats, so a fraction like 0.1 cannot be stored exactly in binary, which is why `0.1 + 0.2 === 0.3` famously evaluates to false in JavaScript.'
            },
            {
              title: "UTF-8 as the dominant encoding of the World Wide Web",
              description: 'The vast majority of web pages declare UTF-8 as their character encoding because it stays byte-for-byte compatible with old ASCII text while still being able to represent every language and emoji on the internet.'
            },
            {
              title: "CSS hex color codes (e.g. #FF5733)",
              description: 'Web developers write colors as three hexadecimal byte pairs — one each for red, green, and blue intensity — because two hex digits map exactly onto one 8-bit byte, making 0-255 color values compact to read and write.'
            },
            {
              title: "PNG and JPEG file signature bytes",
              description: 'Operating systems and image libraries identify a file’s true type by checking a fixed sequence of bytes (often shown in hex, like PNG’s 89 50 4E 47) at the very start of the file, regardless of its filename extension.'
            }
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
            },
            {
              id: 'ex-p0-4',
              question: 'Explain, in your own words, why Two’s Complement lets a CPU use the exact same binary adder circuit for both addition and subtraction.',
              explanation: 'In Two’s Complement, subtracting B from A is defined as computing A + (-B), where -B is obtained by inverting B’s bits and adding 1. Because the negative representation is produced before the addition step, the ALU never needs a separate subtraction circuit; it always just adds, feeding in the Two’s Complement negation when subtraction is requested. This is a major reason Two’s Complement won out over sign-magnitude and One’s Complement representations in real hardware.',
              type: 'free-response'
            },
            {
              id: 'ex-p0-5',
              question: 'A left bit-shift of a binary number by 3 positions (x << 3) is equivalent to which arithmetic operation?',
              options: [
                'Multiplying x by 2^3 (i.e., by 8)',
                'Dividing x by 2^3 (i.e., by 8)',
                'Adding 3 to x',
                'Squaring x'
              ],
              correctAnswer: 0,
              explanation: 'Each left shift moves every bit one place of greater significance, doubling the value represented — exactly the effect of multiplying by 2. Shifting left by 3 positions therefore multiplies by 2 x 2 x 2 = 8, assuming no bits are lost to overflow.',
              type: 'multiple-choice'
            },
            {
              id: 'ex-p0-6',
              question: 'Why can the IEEE 754 double-precision format represent very large numbers like 10^300 and very small numbers like 10^-300, but not represent every integer in between exactly?',
              explanation: 'IEEE 754 uses a floating exponent, similar to scientific notation, which lets a fixed number of mantissa bits be rescaled to cover an enormous range of magnitudes. However, only a finite number of mantissa bits (52 for double precision) are available to encode the significant digits, so as numbers grow larger the gap between two representable values grows too — meaning large integers can no longer all be represented exactly, only approximated to the nearest representable float.',
              type: 'free-response'
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
            'How does bit-shifting to the left by k positions relate to multiplication by 2^k?',
            'Why can UTF-8 safely coexist with legacy ASCII-only software, while UTF-16 generally cannot?',
            'If you only had 4 bits to represent a signed integer in Two’s complement, what would the range of representable values be, and why is it asymmetric (one more negative value than positive)?',
            'Why do engineers describe floating-point numbers as having a fixed relative precision rather than a fixed absolute precision?'
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
            { term: 'Bit', definition: 'The smallest unit of digital information, taking a value of either 0 or 1. Physically, a bit corresponds to one of two distinguishable states, such as a high or low voltage level in a transistor.' },
            { term: 'Byte', definition: 'A group of 8 bits, capable of representing 2^8 = 256 distinct values (0 through 255 unsigned). The byte is the standard addressable unit of memory in nearly all modern computer architectures.' },
            { term: 'Nibble', definition: 'Half a byte, consisting of 4 bits. A single hexadecimal digit represents exactly one nibble, which is why two hex digits are always enough to represent one full byte.' },
            { term: 'Two’s Complement', definition: 'A method for representing signed (positive and negative) integers in binary in which negative numbers are formed by inverting all bits of the positive value and adding 1. It allows addition and subtraction to be performed with the same hardware circuitry regardless of sign.' },
            { term: 'IEEE 754', definition: 'The international standard that specifies how floating-point numbers are stored in binary, dividing the available bits into a sign bit, an exponent field, and a mantissa (significand) field to approximate real numbers.' },
            { term: 'Mantissa (Significand)', definition: 'The part of a floating-point number that holds its significant digits of precision, analogous to the digits after the decimal point in scientific notation (e.g., the 1.5 in 1.5 x 10^3).' },
            { term: 'ASCII', definition: 'American Standard Code for Information Interchange: a 7-bit character encoding that maps the numbers 0–127 to English letters, digits, punctuation, and control characters.' },
            { term: 'UTF-8', definition: 'A variable-width character encoding capable of representing all 1,114,112 valid Unicode code points using 1 to 4 bytes per character, while remaining fully backward compatible with 7-bit ASCII.' },
            { term: 'Overflow', definition: 'A condition that occurs when the result of an arithmetic operation requires more bits than are available in the fixed-width representation being used, producing an incorrect wrapped-around value.' },
            { term: 'Hexadecimal', definition: 'A base-16 number system using digits 0–9 and letters A–F, commonly used as compact, human-readable shorthand for binary values because each hex digit corresponds exactly to 4 bits.' }
          ],
          commonMisconceptions: [
            'Misconception: Computers store text as letters. Reality: Computers store only numeric byte values which are rendered as glyphs using font mapping tables; the letter "A" is really just the number 65 interpreted through an encoding convention.',
            'Misconception: Floating point numbers are exact real numbers. Reality: Floats are binary scientific approximations with finite mantissa precision, so many decimal fractions (like 0.1) cannot be represented exactly and accumulate rounding error.',
            'Misconception: Two’s complement negative numbers are computed by simply flipping the sign bit. Reality: The entire value must be bitwise inverted and then have 1 added to it; flipping only the leading bit produces a completely different (and incorrect) number under most interpretations.',
            'Misconception: A byte always represents 8 bits of the same thing everywhere, so file sizes and character counts are always equal. Reality: Under variable-length encodings like UTF-8, a single visible character can occupy anywhere from 1 to 4 bytes, so byte count and character count often diverge.',
            'Misconception: Hexadecimal is a different kind of number from binary, requiring separate reasoning. Reality: Hexadecimal is purely a compact notation for binary; each hex digit is a direct, mechanical substitution for a 4-bit group, with no new mathematics involved.'
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
            'Kernel vs User Space and System Calls: the kernel is the privileged core of the OS that alone can directly touch hardware, while ordinary applications run in a restricted user space and must request hardware access through system calls, a boundary that exists to keep one buggy or malicious program from crashing the whole machine.',
            'Processes, Threads, and CPU Scheduling: a process is an isolated running program with its own memory space, while threads are lighter-weight units of execution within a process that share that memory; the OS scheduler decides which of the many competing processes and threads gets access to the CPU at any instant, which is how a single-core machine can feel like it runs many programs "at once."',
            'Virtual Memory, Paging, and Page Faults: virtual memory gives every process the illusion of having its own private, contiguous block of memory even though physical RAM is shared and fragmented, using a page table to translate virtual addresses to physical ones; a page fault occurs when that translation points to data not currently resident in RAM, forcing the OS to fetch it.',
            'Filesystem Structure: Inodes, Directories, and File Descriptors: the filesystem organizes persistent storage into a hierarchy of directories and files, where an inode stores a file’s metadata and location on disk while a file descriptor is the small integer handle a running process uses to reference an open file, understanding which clarifies how programs read, write, and share files safely.',
            'Standard Streams (stdin, stdout, stderr) and Process I/O: nearly every process is automatically connected to three default communication channels for input and output, and understanding this convention explains how command-line tools can be chained together (piped) to build larger workflows from small, single-purpose programs.',
            'Context Switching: the mechanism by which the CPU saves the complete state of one process or thread and loads the state of another, which is what makes multitasking possible but also carries a real performance cost that grows with how often it happens.'
          ],
          simpleExplanation: `Think of an operating system like the superintendent of a big apartment building. The superintendent (the kernel) is the only one with a master key to the boiler room, the electrical panel, and the front gate. Tenants (ordinary programs) are never handed those master keys directly — if they need something done with the building's shared systems, like turning up the heat, they have to submit a request at the front desk. That front-desk request is exactly what a system call is: a controlled, safe way for a program to ask the privileged kernel to do something on its behalf, so that one careless or malicious tenant can't accidentally set fire to the whole building.

Inside that analogy, a process is like a fully separate apartment: its own furniture, its own fridge, walled off from every other apartment so residents can't see or touch each other's stuff. A thread is more like a roommate sharing that exact same apartment — several roommates can work on different chores at once, and they all share the same fridge and living room (the process's memory), even though each is doing their own thing and keeping their own personal to-do list (a private call stack). Since there's usually only one "elevator" (a CPU core) but many apartments wanting to use it, the OS scheduler acts like a very fast, fair receptionist deciding, moment to moment, exactly whose turn it is to ride — and the act of pausing one rider and letting the next one on is called a context switch.

Now imagine every tenant believes they have their own enormous, private storage warehouse with boxes numbered 1, 2, 3, and so on forever — even though the real warehouse is shared among everyone and its shelves are scattered and limited. That illusion is virtual memory. Behind the scenes, a ledger called a page table quietly translates each tenant's "box number" into wherever that box actually sits in the real, shared warehouse (physical RAM). If a tenant asks for a box that isn't currently sitting in the easily-reachable front room, the warehouse staff has to fetch it from deep storage (the disk) before handing it over — and that little delay-and-fetch moment is called a page fault.

Finally, files on a disk work like a filing cabinet: an index card called an inode records everything about a file — its size, its permissions, where its pages physically live — while the file's name is really just a label taped to a drawer pointing at that index card. When a program opens a file, it doesn't carry the whole card around; it's handed a small ticket number, called a file descriptor, that it shows whenever it wants to read or write. And nearly every program automatically starts with three such tickets already in hand — one for typed-in input (stdin), one for normal output (stdout), and one just for error messages (stderr) — which is exactly why you can chain small command-line tools together like a factory conveyor belt, piping the output of one straight into the input of the next.`,
          realWorldApplications: [
            {
              title: "Linux kernel system calls (read, write, open)",
              description: 'Every Linux program, from a text editor to a web server, must ask the kernel via system calls to read a file or send network data, because only the kernel is trusted to touch the disk and hardware directly.'
            },
            {
              title: "Google Chrome's one-process-per-tab architecture",
              description: 'Chrome runs each browser tab as its own OS process with its own isolated virtual memory space, so that a crash or security bug in one tab cannot directly corrupt the memory of another tab or the browser itself.'
            },
            {
              title: "Virtual memory paging in Windows and macOS",
              description: 'When physical RAM fills up, both operating systems move rarely-used memory pages out to a page file or swap file on disk and load them back on demand, using the same page-table translation and page-fault mechanism used to explain virtual memory generally.'
            },
            {
              title: "Unix shell pipes (e.g. `ls | grep report | sort`)",
              description: 'This command chains three small programs by connecting one program’s stdout directly to the next program’s stdin, letting complex tasks be built by composing simple, single-purpose command-line tools.'
            },
            {
              title: "Docker containers",
              description: 'Docker relies on Linux kernel features (namespaces and cgroups) that give each container the illusion of having its own isolated processes and filesystem, building on the same process-isolation ideas the kernel already uses to separate ordinary programs.'
            }
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
            },
            {
              id: 'ex-p0-7',
              question: 'What is the key difference between a process and a thread?',
              options: [
                'A process has its own isolated memory space, while threads within the same process share that memory space but have separate stacks.',
                'A thread always runs on a different CPU core than its parent process.',
                'A process cannot be scheduled by the OS, but a thread can.',
                'There is no meaningful difference; the terms are interchangeable.'
              ],
              correctAnswer: 0,
              explanation: 'Processes are isolated from each other by the OS for safety, each getting its own virtual address space. Threads exist inside a process specifically to share that process’s memory (heap, global variables, open files) for efficient cooperation, while each thread still keeps its own private stack and CPU register state so it can be scheduled independently.',
              type: 'multiple-choice'
            },
            {
              id: 'ex-p0-8',
              question: 'Explain what happens, step by step, when a running program accesses a virtual memory address whose page is not currently loaded in physical RAM.',
              explanation: 'The CPU’s memory management unit fails to find a valid mapping for that virtual page in the page table and raises a page fault, a hardware interrupt that transfers control to the OS kernel. The kernel’s page fault handler determines where the needed data lives (for example, on disk), locates a free physical frame (evicting another page if necessary), loads the data into that frame, updates the page table with the new mapping, and then resumes the interrupted program, which retries the memory access — this time succeeding.',
              type: 'free-response'
            },
            {
              id: 'ex-p0-9',
              question: 'In a UNIX-like shell, what do stdin, stdout, and stderr represent, and why does separating stdout from stderr matter in practice?',
              explanation: 'stdin, stdout, and stderr are the three standard I/O streams automatically opened for nearly every process: stdin supplies input, stdout carries normal output, and stderr carries error/diagnostic messages. Keeping stdout and stderr separate lets a user or script redirect normal output (say, into a file or another program via a pipe) while still seeing error messages printed to the terminal, or vice versa — without one stream’s content polluting the other.',
              type: 'free-response'
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
            'What happens during a page fault at the hardware and kernel level?',
            'Why does the "everything is a file" philosophy in UNIX-like systems make it easier to write general-purpose tools like pipes and redirection?',
            'Why is it dangerous, from a security standpoint, for user-space programs to access hardware directly without going through the kernel?',
            'How would you explain, to someone with no CS background, why an operating system needs both a scheduler and a memory manager?'
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
            { term: 'Kernel', definition: 'The core component of an operating system that has complete, privileged control over system memory, CPU scheduling, and hardware devices, mediating all access requested by user-space programs.' },
            { term: 'Process', definition: 'An instance of a running program, including its own private virtual address space, program counter, and set of OS-managed resources such as open file descriptors.' },
            { term: 'Thread', definition: 'A lightweight, independently schedulable sequence of execution that exists within a process and shares that process’s memory (heap and code) with any sibling threads, while keeping its own call stack and register state.' },
            { term: 'System Call', definition: 'A controlled entry point that lets a user-space program request a privileged service, such as reading a file or allocating memory, from the kernel.' },
            { term: 'Virtual Memory', definition: 'A memory management technique that gives each process the illusion of a large, contiguous, private address space, which the OS and hardware transparently map onto the machine’s actual, shared physical RAM.' },
            { term: 'Page Fault', definition: 'A hardware-triggered interrupt that occurs when a running program accesses a virtual memory page that is not currently mapped into physical RAM, prompting the OS to load it from disk or elsewhere.' },
            { term: 'Page Table', definition: 'A per-process data structure maintained by the operating system that records the mapping from virtual page numbers to physical frame numbers, used by the CPU’s memory management unit to translate addresses.' },
            { term: 'Inode', definition: 'A data structure on a filesystem that stores metadata about a file (size, permissions, timestamps, and pointers to its data blocks) but not the file’s name, which is stored separately in a directory entry.' },
            { term: 'File Descriptor', definition: 'A small non-negative integer that a process uses as a handle to refer to an open file, socket, or other I/O resource when making system calls.' },
            { term: 'Context Switch', definition: 'The act of the operating system saving the complete execution state of one process or thread and restoring the state of another so it can run, enabling a single CPU core to appear to run multiple tasks concurrently.' }
          ],
          commonMisconceptions: [
            'Misconception: Threads share no memory. Reality: Threads within the same process share the same heap and code space, but each maintains its own private call stack and register state.',
            'Misconception: Virtual memory is the same thing as swap space or disk-based "extra RAM." Reality: Virtual memory is primarily an addressing abstraction that maps every process into its own address space; swapping pages out to disk is only one mechanism the OS may use when physical RAM is scarce.',
            'Misconception: A process with more threads always runs proportionally faster. Reality: More threads only improve throughput when there is genuine parallel work and enough CPU cores; beyond that point, added threads increase context-switching and synchronization overhead without speeding up the program.',
            'Misconception: Closing a file just means the data stops being written. Reality: Closing a file releases the process’s file descriptor and typically flushes buffered data, and failing to close file descriptors can exhaust the finite number a process is allowed to hold open.'
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
