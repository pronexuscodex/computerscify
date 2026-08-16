import { GlossaryItem } from '../types/curriculum';

export const GLOSSARY_ITEMS: GlossaryItem[] = [
  {
    id: 'g-bit',
    term: 'Bit',
    category: 'cs',
    definition: 'The fundamental unit of digital information in computing, taking a binary value of 0 or 1.',
    relatedTopicIds: ['p0-m1-t1']
  },
  {
    id: 'g-twos-complement',
    term: 'Two’s Complement',
    category: 'cs',
    definition: 'A mathematical scheme for representing signed integers in binary where negative numbers are formed by inverting bits and adding 1.',
    relatedTopicIds: ['p0-m1-t1']
  },
  {
    id: 'g-big-o',
    term: 'Big-O Notation',
    category: 'math',
    definition: 'A mathematical notation describing the asymptotic upper bound on the time or space growth rate of an algorithm.',
    relatedTopicIds: ['p1-m2-t1', 'p3-m13-t1']
  },
  {
    id: 'g-dot-product',
    term: 'Dot Product',
    category: 'math',
    definition: 'An algebraic operation taking two equal-length sequences of numbers and returning a single scalar, representing geometric alignment.',
    relatedTopicIds: ['p1-m4-t1']
  },
  {
    id: 'g-vectorization',
    term: 'Vectorization',
    category: 'ds',
    definition: 'The process of rewriting scalar loop operations into single SIMD array instructions operating on whole memory buffers at once.',
    relatedTopicIds: ['p2-m10-t1']
  },
  {
    id: 'g-relational-model',
    term: 'Relational Model',
    category: 'ds',
    definition: 'A database management model based on first-order predicate logic, organizing data into relations (tables) of tuples (rows).',
    relatedTopicIds: ['p2-m11-t1']
  },
  {
    id: 'g-gradient-descent',
    term: 'Gradient Descent',
    category: 'ml',
    definition: 'An optimization algorithm that iteratively updates model parameter weights in the direction of steepest descent of the loss function.',
    relatedTopicIds: ['p5-m16-t1']
  },
  {
    id: 'g-self-attention',
    term: 'Self-Attention',
    category: 'ml',
    definition: 'An attention mechanism that relates different positions of a single sequence to compute a contextually weighted representation.',
    relatedTopicIds: ['p6-m17-t1']
  },
  {
    id: 'g-psi',
    term: 'Population Stability Index (PSI)',
    category: 'engineering',
    definition: 'A statistical metric that quantifies how much a feature distribution has shifted between baseline training data and live production traffic.',
    relatedTopicIds: ['p7-m18-t1']
  },
  {
    id: 'g-raft',
    term: 'Raft Consensus',
    category: 'cs',
    definition: 'A fault-tolerant distributed consensus protocol designed around leader election, log replication, and safety invariants.',
    relatedTopicIds: ['p8-m19-t1']
  },
  {
    id: 'g-array',
    term: 'Array',
    category: 'cs',
    definition: 'A data structure that stores elements of the same type in contiguous memory locations, allowing constant-time access to any element via its index.',
    relatedTopicIds: []
  },
  {
    id: 'g-linked-list',
    term: 'Linked List',
    category: 'cs',
    definition: 'A linear data structure of nodes where each node stores a value and a reference (pointer) to the next node, allowing efficient insertion and deletion without shifting elements.',
    relatedTopicIds: []
  },
  {
    id: 'g-stack',
    term: 'Stack',
    category: 'cs',
    definition: 'A linear data structure that follows Last-In-First-Out (LIFO) ordering, supporting push and pop operations at one end in constant time.',
    relatedTopicIds: []
  },
  {
    id: 'g-queue',
    term: 'Queue',
    category: 'cs',
    definition: 'A linear data structure that follows First-In-First-Out (FIFO) ordering, supporting enqueue at one end and dequeue at the other in constant time.',
    relatedTopicIds: []
  },
  {
    id: 'g-hash-table',
    term: 'Hash Table',
    category: 'cs',
    definition: 'A data structure that maps keys to values using a hash function to compute an index into an array of buckets, giving average-case constant-time lookup, insertion, and deletion.',
    relatedTopicIds: []
  },
  {
    id: 'g-binary-search-tree',
    term: 'Binary Search Tree',
    category: 'cs',
    definition: 'A binary tree in which every node satisfies the ordering property that all values in its left subtree are smaller and all values in its right subtree are larger, enabling O(log n) search in balanced cases.',
    relatedTopicIds: []
  },
  {
    id: 'g-heap',
    term: 'Heap',
    category: 'cs',
    definition: 'A complete binary tree satisfying the heap property, where each parent node is ordered relative to its children (min-heap or max-heap), commonly used to implement priority queues.',
    relatedTopicIds: []
  },
  {
    id: 'g-graph-data-structure',
    term: 'Graph',
    category: 'cs',
    definition: 'A data structure consisting of a set of vertices (nodes) and a set of edges connecting pairs of vertices, used to model networks, relationships, and paths.',
    relatedTopicIds: []
  },
  {
    id: 'g-recursion',
    term: 'Recursion',
    category: 'cs',
    definition: 'A technique in which a function solves a problem by calling itself on smaller subproblems, terminating at a base case.',
    relatedTopicIds: []
  },
  {
    id: 'g-dynamic-programming',
    term: 'Dynamic Programming',
    category: 'cs',
    definition: 'An algorithmic technique for solving problems by breaking them into overlapping subproblems, solving each subproblem once, and storing (memoizing) results to avoid redundant computation.',
    relatedTopicIds: []
  },
  {
    id: 'g-greedy-algorithm',
    term: 'Greedy Algorithm',
    category: 'cs',
    definition: 'An algorithmic approach that builds a solution incrementally by always choosing the locally optimal option at each step, without reconsidering earlier choices.',
    relatedTopicIds: []
  },
  {
    id: 'g-divide-and-conquer',
    term: 'Divide and Conquer',
    category: 'cs',
    definition: 'An algorithm design paradigm that recursively splits a problem into smaller independent subproblems, solves each subproblem, and combines their results into a final solution.',
    relatedTopicIds: []
  },
  {
    id: 'g-binary-search',
    term: 'Binary Search',
    category: 'cs',
    definition: 'A search algorithm that finds the position of a target value within a sorted array by repeatedly halving the search interval, running in O(log n) time.',
    relatedTopicIds: []
  },
  {
    id: 'g-quicksort',
    term: 'Quicksort',
    category: 'cs',
    definition: 'A divide-and-conquer sorting algorithm that partitions an array around a pivot element and recursively sorts the resulting subarrays, with average-case O(n log n) time complexity.',
    relatedTopicIds: []
  },
  {
    id: 'g-merge-sort',
    term: 'Merge Sort',
    category: 'cs',
    definition: 'A divide-and-conquer sorting algorithm that recursively splits an array in half, sorts each half, and merges the sorted halves, guaranteeing O(n log n) time complexity.',
    relatedTopicIds: []
  },
  {
    id: 'g-depth-first-search',
    term: 'Depth-First Search (DFS)',
    category: 'cs',
    definition: 'A graph or tree traversal algorithm that explores as far as possible along each branch before backtracking, typically implemented with a stack or recursion.',
    relatedTopicIds: []
  },
  {
    id: 'g-breadth-first-search',
    term: 'Breadth-First Search (BFS)',
    category: 'cs',
    definition: 'A graph or tree traversal algorithm that explores all neighbors at the current depth before moving to nodes at the next depth level, typically implemented with a queue.',
    relatedTopicIds: []
  },
  {
    id: 'g-trie',
    term: 'Trie',
    category: 'cs',
    definition: 'A tree-based data structure used to store a dynamic set of strings, where each path from the root represents a prefix, enabling fast prefix lookups.',
    relatedTopicIds: []
  },
  {
    id: 'g-hash-collision',
    term: 'Hash Collision',
    category: 'cs',
    definition: 'A situation in which two distinct keys are mapped to the same slot by a hash function, resolved through techniques such as chaining or open addressing.',
    relatedTopicIds: []
  },
  {
    id: 'g-amortized-analysis',
    term: 'Amortized Analysis',
    category: 'cs',
    definition: 'A method for analyzing the average time complexity of a sequence of operations, showing that occasional expensive operations are offset by many cheap ones.',
    relatedTopicIds: []
  },
  {
    id: 'g-pointer',
    term: 'Pointer',
    category: 'cs',
    definition: 'A variable that stores the memory address of another variable or data structure, enabling indirect access to and manipulation of that data.',
    relatedTopicIds: []
  },
  {
    id: 'g-abstract-data-type',
    term: 'Abstract Data Type (ADT)',
    category: 'cs',
    definition: 'A mathematical model for a data structure defined by its behavior (the operations that can be performed on it) rather than its concrete implementation.',
    relatedTopicIds: []
  },
  {
    id: 'g-memoization',
    term: 'Memoization',
    category: 'cs',
    definition: 'An optimization technique that caches the results of expensive function calls and returns the cached result when the same inputs occur again.',
    relatedTopicIds: []
  },
  {
    id: 'g-topological-sort',
    term: 'Topological Sort',
    category: 'cs',
    definition: 'An ordering of the vertices of a directed acyclic graph such that for every directed edge from vertex u to vertex v, u comes before v in the ordering.',
    relatedTopicIds: []
  },
  {
    id: 'g-dijkstras-algorithm',
    term: "Dijkstra's Algorithm",
    category: 'cs',
    definition: 'A graph algorithm that finds the shortest paths from a single source vertex to all other vertices in a weighted graph with non-negative edge weights.',
    relatedTopicIds: []
  },
  {
    id: 'g-matrix',
    term: 'Matrix',
    category: 'math',
    definition: 'A rectangular array of numbers arranged in rows and columns, used to represent linear transformations and systems of linear equations.',
    relatedTopicIds: []
  },
  {
    id: 'g-eigenvalue',
    term: 'Eigenvalue',
    category: 'math',
    definition: 'A scalar λ such that a linear transformation applied to a nonzero vector v (its eigenvector) yields a scaled version of that same vector: Av = λv.',
    relatedTopicIds: []
  },
  {
    id: 'g-eigenvector',
    term: 'Eigenvector',
    category: 'math',
    definition: 'A nonzero vector whose direction is unchanged by a given linear transformation, only scaled by a corresponding eigenvalue.',
    relatedTopicIds: []
  },
  {
    id: 'g-derivative',
    term: 'Derivative',
    category: 'math',
    definition: 'A measure of how a function’s output changes with respect to an infinitesimal change in its input, geometrically the slope of the tangent line at a point.',
    relatedTopicIds: []
  },
  {
    id: 'g-partial-derivative',
    term: 'Partial Derivative',
    category: 'math',
    definition: 'The derivative of a multivariable function with respect to one variable, holding all other variables constant.',
    relatedTopicIds: []
  },
  {
    id: 'g-gradient',
    term: 'Gradient',
    category: 'math',
    definition: 'A vector of partial derivatives of a scalar-valued function with respect to each of its input variables, pointing in the direction of steepest increase.',
    relatedTopicIds: []
  },
  {
    id: 'g-chain-rule',
    term: 'Chain Rule',
    category: 'math',
    definition: 'A calculus rule for computing the derivative of a composite function, stating that the derivative equals the product of the derivatives of its composed functions.',
    relatedTopicIds: []
  },
  {
    id: 'g-integral',
    term: 'Integral',
    category: 'math',
    definition: 'A mathematical operation that computes the accumulated area under a curve, or the antiderivative of a function, over a given interval.',
    relatedTopicIds: []
  },
  {
    id: 'g-probability-distribution',
    term: 'Probability Distribution',
    category: 'math',
    definition: 'A mathematical function that describes the likelihood of different outcomes of a random variable, assigning probabilities across its possible values.',
    relatedTopicIds: []
  },
  {
    id: 'g-random-variable',
    term: 'Random Variable',
    category: 'math',
    definition: 'A variable whose possible values are numerical outcomes of a random phenomenon, formally a function mapping outcomes in a sample space to real numbers.',
    relatedTopicIds: []
  },
  {
    id: 'g-bayes-theorem',
    term: "Bayes' Theorem",
    category: 'math',
    definition: 'A formula describing how to update the probability of a hypothesis given new evidence, computed as P(A|B) = P(B|A)P(A) / P(B).',
    relatedTopicIds: []
  },
  {
    id: 'g-conditional-probability',
    term: 'Conditional Probability',
    category: 'math',
    definition: 'The probability of an event occurring given that another event has already occurred, denoted P(A|B).',
    relatedTopicIds: []
  },
  {
    id: 'g-expected-value',
    term: 'Expected Value',
    category: 'math',
    definition: 'The long-run average value of a random variable, computed as the probability-weighted sum (or integral) of all its possible outcomes.',
    relatedTopicIds: []
  },
  {
    id: 'g-variance',
    term: 'Variance',
    category: 'math',
    definition: 'A measure of how far a set of values is spread out from its mean, computed as the expected value of the squared deviation from the mean.',
    relatedTopicIds: []
  },
  {
    id: 'g-standard-deviation',
    term: 'Standard Deviation',
    category: 'math',
    definition: 'A measure of the dispersion of a dataset relative to its mean, computed as the square root of the variance, expressed in the same units as the data.',
    relatedTopicIds: []
  },
  {
    id: 'g-covariance',
    term: 'Covariance',
    category: 'math',
    definition: 'A measure of how two random variables change together, positive when they tend to increase together and negative when one increases as the other decreases.',
    relatedTopicIds: []
  },
  {
    id: 'g-correlation',
    term: 'Correlation',
    category: 'math',
    definition: 'A normalized measure, typically ranging from -1 to 1, of the strength and direction of the linear relationship between two variables.',
    relatedTopicIds: []
  },
  {
    id: 'g-combinatorics',
    term: 'Combinatorics',
    category: 'math',
    definition: 'The branch of mathematics concerned with counting, arrangement, and combination of discrete objects, including permutations and combinations.',
    relatedTopicIds: []
  },
  {
    id: 'g-set-theory',
    term: 'Set Theory',
    category: 'math',
    definition: 'The branch of mathematical logic that studies collections of objects (sets) and the relationships and operations between them, such as union, intersection, and complement.',
    relatedTopicIds: []
  },
  {
    id: 'g-linear-transformation',
    term: 'Linear Transformation',
    category: 'math',
    definition: 'A function between vector spaces that preserves vector addition and scalar multiplication, representable as multiplication by a matrix.',
    relatedTopicIds: []
  },
  {
    id: 'g-determinant',
    term: 'Determinant',
    category: 'math',
    definition: 'A scalar value computed from a square matrix that encodes properties such as invertibility and the factor by which the matrix scales volume.',
    relatedTopicIds: []
  },
  {
    id: 'g-vector-space',
    term: 'Vector Space',
    category: 'math',
    definition: 'A set of vectors closed under vector addition and scalar multiplication, satisfying axioms such as associativity, distributivity, and the existence of an identity element.',
    relatedTopicIds: []
  },
  {
    id: 'g-norm',
    term: 'Norm',
    category: 'math',
    definition: 'A function that assigns a non-negative length or size to a vector, satisfying positivity, scalability, and the triangle inequality; common examples include the L1 and L2 norms.',
    relatedTopicIds: []
  },
  {
    id: 'g-convex-function',
    term: 'Convex Function',
    category: 'math',
    definition: 'A function whose line segment between any two points on its graph lies on or above the graph, guaranteeing that any local minimum is also a global minimum.',
    relatedTopicIds: []
  },
  {
    id: 'g-matrix-multiplication',
    term: 'Matrix Multiplication',
    category: 'math',
    definition: 'An operation that combines two matrices by computing the dot products of the rows of the first matrix with the columns of the second, producing a new matrix.',
    relatedTopicIds: []
  },
  {
    id: 'g-normal-distribution',
    term: 'Normal Distribution',
    category: 'math',
    definition: 'A continuous probability distribution characterized by a symmetric bell-shaped curve, fully described by its mean and standard deviation.',
    relatedTopicIds: []
  },
  {
    id: 'g-exploratory-data-analysis',
    term: 'Exploratory Data Analysis (EDA)',
    category: 'ds',
    definition: 'The process of investigating a dataset through summary statistics and visualizations to uncover patterns, anomalies, and relationships before formal modeling.',
    relatedTopicIds: []
  },
  {
    id: 'g-data-cleaning',
    term: 'Data Cleaning',
    category: 'ds',
    definition: 'The process of detecting and correcting (or removing) corrupt, inaccurate, duplicate, or inconsistent records from a dataset.',
    relatedTopicIds: []
  },
  {
    id: 'g-missing-data-imputation',
    term: 'Missing Data Imputation',
    category: 'ds',
    definition: 'The process of replacing missing values in a dataset with substituted values, such as the mean, median, or a model-predicted estimate, to preserve dataset completeness.',
    relatedTopicIds: []
  },
  {
    id: 'g-outlier',
    term: 'Outlier',
    category: 'ds',
    definition: 'A data point that differs significantly from other observations in a dataset, potentially indicating variability, measurement error, or a novel phenomenon.',
    relatedTopicIds: []
  },
  {
    id: 'g-feature-scaling',
    term: 'Feature Scaling',
    category: 'ds',
    definition: 'The process of transforming numeric features to a common scale, such as via min-max normalization or standardization, so that no single feature dominates a model due to its magnitude.',
    relatedTopicIds: []
  },
  {
    id: 'g-feature-engineering',
    term: 'Feature Engineering',
    category: 'ds',
    definition: 'The process of using domain knowledge to create, transform, or select input variables (features) that improve the performance of a machine learning model.',
    relatedTopicIds: []
  },
  {
    id: 'g-data-wrangling',
    term: 'Data Wrangling',
    category: 'ds',
    definition: 'The process of transforming and mapping raw data from its original form into a structured, usable format for analysis.',
    relatedTopicIds: []
  },
  {
    id: 'g-dataframe',
    term: 'DataFrame',
    category: 'ds',
    definition: 'A two-dimensional, labeled tabular data structure with columns of potentially different types, as implemented in libraries such as pandas.',
    relatedTopicIds: []
  },
  {
    id: 'g-sql-join',
    term: 'SQL Join',
    category: 'ds',
    definition: 'A SQL operation that combines rows from two or more tables based on a related column between them, such as with INNER JOIN, LEFT JOIN, or FULL OUTER JOIN.',
    relatedTopicIds: []
  },
  {
    id: 'g-primary-key',
    term: 'Primary Key',
    category: 'ds',
    definition: 'A column or set of columns in a relational database table that uniquely identifies each row and cannot contain null values.',
    relatedTopicIds: []
  },
  {
    id: 'g-foreign-key',
    term: 'Foreign Key',
    category: 'ds',
    definition: 'A column or set of columns in one table that references the primary key of another table, enforcing referential integrity between the two tables.',
    relatedTopicIds: []
  },
  {
    id: 'g-database-normalization',
    term: 'Database Normalization',
    category: 'ds',
    definition: 'The process of organizing relational database tables to reduce data redundancy and improve data integrity by decomposing tables according to normal forms.',
    relatedTopicIds: []
  },
  {
    id: 'g-histogram',
    term: 'Histogram',
    category: 'ds',
    definition: 'A graphical representation of the distribution of numerical data, grouping values into bins and displaying the frequency of observations in each bin as bars.',
    relatedTopicIds: []
  },
  {
    id: 'g-box-plot',
    term: 'Box Plot',
    category: 'ds',
    definition: 'A standardized visualization that summarizes a distribution’s median, quartiles, and potential outliers using a box and whiskers.',
    relatedTopicIds: []
  },
  {
    id: 'g-scatter-plot',
    term: 'Scatter Plot',
    category: 'ds',
    definition: 'A visualization that displays individual data points on a two-dimensional plane using two variables as coordinates, commonly used to reveal correlation or clustering.',
    relatedTopicIds: []
  },
  {
    id: 'g-sampling',
    term: 'Sampling',
    category: 'ds',
    definition: 'The process of selecting a subset of individuals or observations from a larger population to estimate characteristics of the whole population.',
    relatedTopicIds: []
  },
  {
    id: 'g-central-limit-theorem',
    term: 'Central Limit Theorem',
    category: 'ds',
    definition: 'A statistical theorem stating that the distribution of sample means approaches a normal distribution as sample size increases, regardless of the population’s underlying distribution.',
    relatedTopicIds: []
  },
  {
    id: 'g-hypothesis-testing',
    term: 'Hypothesis Testing',
    category: 'ds',
    definition: 'A statistical method for deciding whether there is enough evidence in a sample to reject a null hypothesis in favor of an alternative hypothesis.',
    relatedTopicIds: []
  },
  {
    id: 'g-p-value',
    term: 'p-value',
    category: 'ds',
    definition: 'The probability of observing a result at least as extreme as the one measured, assuming the null hypothesis is true; small p-values are taken as evidence against the null hypothesis.',
    relatedTopicIds: []
  },
  {
    id: 'g-confidence-interval',
    term: 'Confidence Interval',
    category: 'ds',
    definition: 'A range of values, derived from sample data, that is likely to contain the true value of an unknown population parameter with a specified level of confidence.',
    relatedTopicIds: []
  },
  {
    id: 'g-ab-testing',
    term: 'A/B Testing',
    category: 'ds',
    definition: 'A controlled experiment that compares two variants (A and B) by randomly assigning users or samples to each group and measuring differences in an outcome metric.',
    relatedTopicIds: []
  },
  {
    id: 'g-skewness',
    term: 'Skewness',
    category: 'ds',
    definition: 'A measure of the asymmetry of a probability distribution around its mean; positive skew indicates a longer right tail and negative skew a longer left tail.',
    relatedTopicIds: []
  },
  {
    id: 'g-time-series',
    term: 'Time Series',
    category: 'ds',
    definition: 'A sequence of data points indexed in chronological order, typically analyzed to identify trends, seasonality, and autocorrelation over time.',
    relatedTopicIds: []
  },
  {
    id: 'g-cpu',
    term: 'CPU (Central Processing Unit)',
    category: 'systems',
    definition: 'The primary processing hardware in a computer that executes instructions by performing arithmetic, logic, control, and input/output operations.',
    relatedTopicIds: []
  },
  {
    id: 'g-cache-memory',
    term: 'Cache',
    category: 'systems',
    definition: 'A small, fast layer of memory situated close to the CPU that stores copies of frequently accessed data to reduce average access time to main memory.',
    relatedTopicIds: []
  },
  {
    id: 'g-pipelining',
    term: 'Pipelining',
    category: 'systems',
    definition: 'A CPU design technique that overlaps the execution of multiple instructions by splitting instruction processing into sequential stages that execute concurrently.',
    relatedTopicIds: []
  },
  {
    id: 'g-instruction-set-architecture',
    term: 'Instruction Set Architecture (ISA)',
    category: 'systems',
    definition: 'The abstract interface between a computer’s hardware and its software, defining the set of instructions, registers, and addressing modes a processor supports.',
    relatedTopicIds: []
  },
  {
    id: 'g-virtual-memory',
    term: 'Virtual Memory',
    category: 'systems',
    definition: 'A memory management technique that gives each process the illusion of a large, contiguous address space by mapping virtual addresses to physical memory or disk.',
    relatedTopicIds: []
  },
  {
    id: 'g-process-os',
    term: 'Process',
    category: 'systems',
    definition: 'An instance of a running program, including its own memory space, program counter, and system resources, managed and scheduled by the operating system.',
    relatedTopicIds: []
  },
  {
    id: 'g-thread',
    term: 'Thread',
    category: 'systems',
    definition: 'The smallest unit of execution within a process, sharing the process’s memory space with other threads but maintaining its own program counter and stack.',
    relatedTopicIds: []
  },
  {
    id: 'g-context-switch',
    term: 'Context Switch',
    category: 'systems',
    definition: 'The process by which an operating system saves the state of a running process or thread and loads the state of another, enabling multitasking on a single CPU core.',
    relatedTopicIds: []
  },
  {
    id: 'g-deadlock',
    term: 'Deadlock',
    category: 'systems',
    definition: 'A state in which two or more processes are each waiting for a resource held by another, resulting in none of them ever proceeding.',
    relatedTopicIds: []
  },
  {
    id: 'g-semaphore',
    term: 'Semaphore',
    category: 'systems',
    definition: 'A synchronization primitive that uses a counter to control access to a shared resource by multiple processes or threads, preventing race conditions.',
    relatedTopicIds: []
  },
  {
    id: 'g-mutex',
    term: 'Mutex',
    category: 'systems',
    definition: 'A synchronization primitive that allows only one thread to access a critical section or shared resource at a time, ensuring mutual exclusion.',
    relatedTopicIds: []
  },
  {
    id: 'g-scheduling-algorithm',
    term: 'Scheduling Algorithm',
    category: 'systems',
    definition: 'An operating system algorithm that determines the order in which processes or threads are granted access to the CPU, such as round-robin or shortest-job-first.',
    relatedTopicIds: []
  },
  {
    id: 'g-file-system',
    term: 'File System',
    category: 'systems',
    definition: 'A method and data structure that an operating system uses to organize, name, store, and retrieve files and directories on a storage device.',
    relatedTopicIds: []
  },
  {
    id: 'g-tcp-ip',
    term: 'TCP/IP',
    category: 'systems',
    definition: 'A suite of communication protocols that governs how data is packetized, addressed, transmitted, routed, and received across networks, forming the basis of the internet.',
    relatedTopicIds: []
  },
  {
    id: 'g-dns',
    term: 'DNS (Domain Name System)',
    category: 'systems',
    definition: 'A hierarchical, distributed naming system that translates human-readable domain names into the numerical IP addresses needed to locate computer services.',
    relatedTopicIds: []
  },
  {
    id: 'g-http',
    term: 'HTTP',
    category: 'systems',
    definition: 'An application-layer protocol used for transmitting hypermedia documents, such as HTML, that forms the foundation of data communication on the World Wide Web.',
    relatedTopicIds: []
  },
  {
    id: 'g-load-balancer',
    term: 'Load Balancer',
    category: 'systems',
    definition: 'A system component that distributes incoming network traffic across multiple servers to maximize throughput, minimize response time, and avoid overloading any single server.',
    relatedTopicIds: []
  },
  {
    id: 'g-sharding',
    term: 'Sharding',
    category: 'systems',
    definition: 'A database partitioning technique that splits a large dataset across multiple machines (shards), each holding a subset of the data, to improve scalability.',
    relatedTopicIds: []
  },
  {
    id: 'g-replication',
    term: 'Replication',
    category: 'systems',
    definition: 'The process of maintaining copies of the same data on multiple servers to improve availability, fault tolerance, and read throughput.',
    relatedTopicIds: []
  },
  {
    id: 'g-cap-theorem',
    term: 'CAP Theorem',
    category: 'systems',
    definition: 'A principle stating that a distributed data store can provide at most two of three guarantees simultaneously: Consistency, Availability, and Partition tolerance.',
    relatedTopicIds: []
  },
  {
    id: 'g-microservices',
    term: 'Microservices',
    category: 'systems',
    definition: 'An architectural style that structures an application as a collection of small, independently deployable services, each responsible for a specific business capability.',
    relatedTopicIds: []
  },
  {
    id: 'g-message-queue',
    term: 'Message Queue',
    category: 'systems',
    definition: 'A middleware component that enables asynchronous communication between services by storing messages sent by producers until they are processed by consumers.',
    relatedTopicIds: []
  },
  {
    id: 'g-latency',
    term: 'Latency',
    category: 'systems',
    definition: 'The time delay between a request being initiated and the corresponding response being received, typically measured in milliseconds.',
    relatedTopicIds: []
  },
  {
    id: 'g-throughput',
    term: 'Throughput',
    category: 'systems',
    definition: 'The rate at which a system processes requests or data over a given period of time, such as requests per second or bytes per second.',
    relatedTopicIds: []
  },
  {
    id: 'g-kernel',
    term: 'Kernel',
    category: 'systems',
    definition: 'The core component of an operating system that manages hardware resources, process scheduling, memory, and communication between hardware and software.',
    relatedTopicIds: []
  },
  {
    id: 'g-ram',
    term: 'RAM (Random Access Memory)',
    category: 'systems',
    definition: 'Volatile computer memory that stores data and machine code currently in use, providing fast read and write access at any location without sequential traversal.',
    relatedTopicIds: []
  },
  {
    id: 'g-ci-cd',
    term: 'CI/CD',
    category: 'engineering',
    definition: 'Continuous Integration and Continuous Delivery/Deployment, a set of practices that automate building, testing, and releasing code changes frequently and reliably.',
    relatedTopicIds: []
  },
  {
    id: 'g-version-control',
    term: 'Version Control',
    category: 'engineering',
    definition: 'A system that records changes to files over time, allowing developers to track history, collaborate, and revert to previous versions when necessary.',
    relatedTopicIds: []
  },
  {
    id: 'g-git-branch',
    term: 'Git Branch',
    category: 'engineering',
    definition: 'A movable pointer to a sequence of commits in a Git repository, allowing developers to work on features or fixes in isolation before merging changes.',
    relatedTopicIds: []
  },
  {
    id: 'g-containerization',
    term: 'Containerization',
    category: 'engineering',
    definition: 'A lightweight virtualization method that packages an application with its dependencies into an isolated, portable unit (container) that runs consistently across environments.',
    relatedTopicIds: []
  },
  {
    id: 'g-kubernetes',
    term: 'Kubernetes',
    category: 'engineering',
    definition: 'An open-source container orchestration platform that automates the deployment, scaling, and management of containerized applications across clusters of machines.',
    relatedTopicIds: []
  },
  {
    id: 'g-api',
    term: 'API (Application Programming Interface)',
    category: 'engineering',
    definition: 'A defined set of rules and protocols that allows one software component to request services or data from another software component.',
    relatedTopicIds: []
  },
  {
    id: 'g-rest',
    term: 'REST (Representational State Transfer)',
    category: 'engineering',
    definition: 'An architectural style for designing networked applications that uses stateless HTTP requests and standard verbs to manipulate resources identified by URLs.',
    relatedTopicIds: []
  },
  {
    id: 'g-data-pipeline',
    term: 'Data Pipeline',
    category: 'engineering',
    definition: 'A series of automated steps that move data from one or more sources through transformation stages to a destination, such as a data warehouse or model.',
    relatedTopicIds: []
  },
  {
    id: 'g-etl',
    term: 'ETL (Extract, Transform, Load)',
    category: 'engineering',
    definition: 'A data integration process that extracts data from source systems, transforms it into a consistent format, and loads it into a target data store.',
    relatedTopicIds: []
  },
  {
    id: 'g-data-orchestration',
    term: 'Data Orchestration',
    category: 'engineering',
    definition: 'The automated coordination, scheduling, and monitoring of interdependent data processing tasks across a pipeline, often managed by tools like Airflow or Dagster.',
    relatedTopicIds: []
  },
  {
    id: 'g-data-warehouse',
    term: 'Data Warehouse',
    category: 'engineering',
    definition: 'A centralized repository that stores structured, integrated data from multiple sources, optimized for analytical querying and business intelligence.',
    relatedTopicIds: []
  },
  {
    id: 'g-data-lake',
    term: 'Data Lake',
    category: 'engineering',
    definition: 'A centralized repository that stores large volumes of raw data in its native format, structured or unstructured, until it is needed for processing or analysis.',
    relatedTopicIds: []
  },
  {
    id: 'g-batch-processing',
    term: 'Batch Processing',
    category: 'engineering',
    definition: 'A data processing method that collects and processes data in large groups (batches) at scheduled intervals, rather than as individual records in real time.',
    relatedTopicIds: []
  },
  {
    id: 'g-stream-processing',
    term: 'Stream Processing',
    category: 'engineering',
    definition: 'A data processing method that continuously ingests, transforms, and analyzes data in near real time as it arrives, rather than waiting for a complete batch.',
    relatedTopicIds: []
  },
  {
    id: 'g-model-deployment',
    term: 'Model Deployment',
    category: 'engineering',
    definition: 'The process of integrating a trained machine learning model into a production environment so it can receive input and serve predictions to real users or systems.',
    relatedTopicIds: []
  },
  {
    id: 'g-model-monitoring',
    term: 'Model Monitoring',
    category: 'engineering',
    definition: 'The ongoing tracking of a deployed model’s performance, input data distributions, and prediction quality to detect degradation, drift, or failures over time.',
    relatedTopicIds: []
  },
  {
    id: 'g-feature-store',
    term: 'Feature Store',
    category: 'engineering',
    definition: 'A centralized system for storing, managing, and serving curated machine learning features consistently across training and production inference pipelines.',
    relatedTopicIds: []
  },
  {
    id: 'g-model-registry',
    term: 'Model Registry',
    category: 'engineering',
    definition: 'A centralized system for versioning, storing, and tracking the lifecycle of trained machine learning models, including metadata and deployment status.',
    relatedTopicIds: []
  },
  {
    id: 'g-canary-deployment',
    term: 'Canary Deployment',
    category: 'engineering',
    definition: 'A release strategy that rolls out a new version of software or a model to a small subset of users or traffic before a full rollout, to limit the impact of failures.',
    relatedTopicIds: []
  },
  {
    id: 'g-infrastructure-as-code',
    term: 'Infrastructure as Code (IaC)',
    category: 'engineering',
    definition: 'The practice of managing and provisioning computing infrastructure through machine-readable configuration files rather than manual processes.',
    relatedTopicIds: []
  },
  {
    id: 'g-model-drift',
    term: 'Model Drift',
    category: 'engineering',
    definition: 'The degradation of a deployed model’s predictive performance over time, typically caused by changes in the statistical properties of input data (data drift) or the target relationship (concept drift).',
    relatedTopicIds: []
  },
  {
    id: 'g-idempotency',
    term: 'Idempotency',
    category: 'engineering',
    definition: 'A property of an operation such that performing it multiple times produces the same result as performing it once, important for safe retries in distributed systems.',
    relatedTopicIds: []
  },
  {
    id: 'g-webhook',
    term: 'Webhook',
    category: 'engineering',
    definition: 'A mechanism by which an application automatically sends an HTTP callback to another application when a specific event occurs, enabling event-driven integrations.',
    relatedTopicIds: []
  },
  {
    id: 'g-supervised-learning',
    term: 'Supervised Learning',
    category: 'ml',
    definition: 'A machine learning paradigm in which a model is trained on labeled input-output pairs, learning to map inputs to correct outputs.',
    relatedTopicIds: []
  },
  {
    id: 'g-unsupervised-learning',
    term: 'Unsupervised Learning',
    category: 'ml',
    definition: 'A machine learning paradigm in which a model learns patterns or structure from unlabeled data, such as through clustering or dimensionality reduction.',
    relatedTopicIds: []
  },
  {
    id: 'g-reinforcement-learning',
    term: 'Reinforcement Learning',
    category: 'ml',
    definition: 'A machine learning paradigm in which an agent learns to make sequential decisions by interacting with an environment and receiving reward or penalty signals.',
    relatedTopicIds: []
  },
  {
    id: 'g-overfitting',
    term: 'Overfitting',
    category: 'ml',
    definition: 'A modeling error in which a model learns the noise and idiosyncrasies of its training data too closely, resulting in poor generalization to new, unseen data.',
    relatedTopicIds: []
  },
  {
    id: 'g-underfitting',
    term: 'Underfitting',
    category: 'ml',
    definition: 'A modeling error in which a model is too simple to capture the underlying structure of the data, resulting in poor performance on both training and test data.',
    relatedTopicIds: []
  },
  {
    id: 'g-regularization',
    term: 'Regularization',
    category: 'ml',
    definition: 'A set of techniques that add a penalty to a model’s loss function to discourage overly complex parameter values, reducing overfitting and improving generalization.',
    relatedTopicIds: []
  },
  {
    id: 'g-l1-regularization',
    term: 'L1 Regularization (Lasso)',
    category: 'ml',
    definition: 'A regularization technique that adds the sum of the absolute values of model weights to the loss function, encouraging sparsity by driving some weights to exactly zero.',
    relatedTopicIds: []
  },
  {
    id: 'g-l2-regularization',
    term: 'L2 Regularization (Ridge)',
    category: 'ml',
    definition: 'A regularization technique that adds the sum of the squared model weights to the loss function, shrinking weights toward zero without necessarily eliminating them.',
    relatedTopicIds: []
  },
  {
    id: 'g-cross-validation',
    term: 'Cross-Validation',
    category: 'ml',
    definition: 'A model evaluation technique that partitions data into multiple folds, training on some folds and testing on the remaining fold repeatedly, to estimate generalization performance.',
    relatedTopicIds: []
  },
  {
    id: 'g-bias-variance-tradeoff',
    term: 'Bias-Variance Tradeoff',
    category: 'ml',
    definition: 'The tension between a model’s error from overly simplistic assumptions (bias) and its error from sensitivity to fluctuations in the training data (variance), where reducing one often increases the other.',
    relatedTopicIds: []
  },
  {
    id: 'g-loss-function',
    term: 'Loss Function',
    category: 'ml',
    definition: 'A function that quantifies the difference between a model’s predictions and the true target values, which optimization algorithms seek to minimize during training.',
    relatedTopicIds: []
  },
  {
    id: 'g-backpropagation',
    term: 'Backpropagation',
    category: 'ml',
    definition: 'An algorithm for training neural networks that computes the gradient of the loss function with respect to each weight by applying the chain rule backward through the network’s layers.',
    relatedTopicIds: []
  },
  {
    id: 'g-activation-function',
    term: 'Activation Function',
    category: 'ml',
    definition: 'A non-linear function applied to a neuron’s weighted input in a neural network, enabling the network to model complex, non-linear relationships.',
    relatedTopicIds: []
  },
  {
    id: 'g-relu',
    term: 'ReLU (Rectified Linear Unit)',
    category: 'ml',
    definition: 'An activation function defined as f(x) = max(0, x), widely used in deep neural networks for its computational simplicity and ability to mitigate vanishing gradients.',
    relatedTopicIds: []
  },
  {
    id: 'g-sigmoid-function',
    term: 'Sigmoid Function',
    category: 'ml',
    definition: 'An S-shaped activation function that maps any real-valued input to a value between 0 and 1, commonly used for binary classification outputs.',
    relatedTopicIds: []
  },
  {
    id: 'g-softmax',
    term: 'Softmax',
    category: 'ml',
    definition: 'A function that converts a vector of raw scores (logits) into a probability distribution over multiple classes, with all outputs summing to one.',
    relatedTopicIds: []
  },
  {
    id: 'g-neural-network',
    term: 'Neural Network',
    category: 'ml',
    definition: 'A computational model composed of layers of interconnected nodes (neurons) that transform input data through weighted connections and non-linear activations to learn complex patterns.',
    relatedTopicIds: []
  },
  {
    id: 'g-convolutional-neural-network',
    term: 'Convolutional Neural Network (CNN)',
    category: 'ml',
    definition: 'A neural network architecture that uses convolutional layers with shared weights to detect spatial patterns, widely used for image and grid-structured data.',
    relatedTopicIds: []
  },
  {
    id: 'g-recurrent-neural-network',
    term: 'Recurrent Neural Network (RNN)',
    category: 'ml',
    definition: 'A neural network architecture designed for sequential data, where connections form cycles that allow information from previous time steps to persist in a hidden state.',
    relatedTopicIds: []
  },
  {
    id: 'g-lstm',
    term: 'LSTM (Long Short-Term Memory)',
    category: 'ml',
    definition: 'A recurrent neural network variant with gating mechanisms that regulate the flow of information, allowing it to learn long-range dependencies while mitigating vanishing gradients.',
    relatedTopicIds: []
  },
  {
    id: 'g-transformer',
    term: 'Transformer',
    category: 'ml',
    definition: 'A neural network architecture that relies entirely on attention mechanisms, rather than recurrence, to model relationships between elements in a sequence, forming the basis of modern large language models.',
    relatedTopicIds: []
  },
  {
    id: 'g-embedding',
    term: 'Embedding',
    category: 'ml',
    definition: 'A learned, dense vector representation of discrete data, such as words, entities, or items, that captures semantic relationships in a continuous vector space.',
    relatedTopicIds: []
  },
  {
    id: 'g-tokenization',
    term: 'Tokenization',
    category: 'ml',
    definition: 'The process of splitting raw text into smaller units (tokens), such as words, subwords, or characters, that serve as the input units for a language model.',
    relatedTopicIds: []
  },
  {
    id: 'g-decision-tree',
    term: 'Decision Tree',
    category: 'ml',
    definition: 'A supervised learning model that predicts outcomes by recursively splitting data based on feature values, forming a tree of decision rules ending in leaf predictions.',
    relatedTopicIds: []
  },
  {
    id: 'g-random-forest',
    term: 'Random Forest',
    category: 'ml',
    definition: 'An ensemble learning method that combines predictions from many decision trees, each trained on a random subset of data and features, to improve accuracy and reduce overfitting.',
    relatedTopicIds: []
  },
  {
    id: 'g-support-vector-machine',
    term: 'Support Vector Machine (SVM)',
    category: 'ml',
    definition: 'A supervised learning model that finds the hyperplane maximizing the margin between classes, optionally using kernel functions to handle non-linearly separable data.',
    relatedTopicIds: []
  },
  {
    id: 'g-k-means-clustering',
    term: 'K-Means Clustering',
    category: 'ml',
    definition: 'An unsupervised learning algorithm that partitions data into k clusters by iteratively assigning points to the nearest cluster centroid and recomputing centroids.',
    relatedTopicIds: []
  },
  {
    id: 'g-k-nearest-neighbors',
    term: 'K-Nearest Neighbors (KNN)',
    category: 'ml',
    definition: 'A non-parametric supervised learning algorithm that classifies or predicts a data point based on the majority label or average value of its k closest neighbors in feature space.',
    relatedTopicIds: []
  },
  {
    id: 'g-naive-bayes',
    term: 'Naive Bayes',
    category: 'ml',
    definition: 'A family of probabilistic classifiers based on Bayes’ theorem that assumes conditional independence between features given the class label.',
    relatedTopicIds: []
  },
  {
    id: 'g-logistic-regression',
    term: 'Logistic Regression',
    category: 'ml',
    definition: 'A statistical model that predicts the probability of a binary outcome by applying the sigmoid function to a linear combination of input features.',
    relatedTopicIds: []
  },
  {
    id: 'g-linear-regression',
    term: 'Linear Regression',
    category: 'ml',
    definition: 'A statistical model that predicts a continuous target variable as a weighted linear combination of input features, fit by minimizing squared prediction error.',
    relatedTopicIds: []
  },
  {
    id: 'g-ensemble-learning',
    term: 'Ensemble Learning',
    category: 'ml',
    definition: 'A machine learning technique that combines predictions from multiple models to produce a result that is typically more accurate and robust than any single model.',
    relatedTopicIds: []
  },
  {
    id: 'g-boosting',
    term: 'Boosting',
    category: 'ml',
    definition: 'An ensemble technique that trains models sequentially, with each new model focusing on correcting the errors made by previously trained models.',
    relatedTopicIds: []
  },
  {
    id: 'g-bagging',
    term: 'Bagging (Bootstrap Aggregating)',
    category: 'ml',
    definition: 'An ensemble technique that trains multiple models independently on random bootstrap samples of the training data and aggregates their predictions to reduce variance.',
    relatedTopicIds: []
  },
  {
    id: 'g-hyperparameter',
    term: 'Hyperparameter',
    category: 'ml',
    definition: 'A configuration value for a machine learning algorithm, such as learning rate or tree depth, that is set before training rather than learned from the data.',
    relatedTopicIds: []
  },
  {
    id: 'g-confusion-matrix',
    term: 'Confusion Matrix',
    category: 'ml',
    definition: 'A table that summarizes the performance of a classification model by cross-tabulating predicted labels against true labels, showing true/false positives and negatives.',
    relatedTopicIds: []
  },
  {
    id: 'g-precision-recall',
    term: 'Precision and Recall',
    category: 'ml',
    definition: 'Two classification metrics: precision measures the proportion of positive predictions that are correct, while recall measures the proportion of actual positives that are correctly identified.',
    relatedTopicIds: []
  },
  {
    id: 'g-f1-score',
    term: 'F1 Score',
    category: 'ml',
    definition: 'A classification metric that combines precision and recall into a single value using their harmonic mean, useful when class distributions are imbalanced.',
    relatedTopicIds: []
  },
  {
    id: 'g-roc-curve',
    term: 'ROC Curve',
    category: 'ml',
    definition: 'A graphical plot that illustrates a binary classifier’s diagnostic ability by plotting the true positive rate against the false positive rate at various classification thresholds.',
    relatedTopicIds: []
  },
  {
    id: 'g-batch-normalization',
    term: 'Batch Normalization',
    category: 'ml',
    definition: 'A neural network technique that normalizes layer inputs across a mini-batch to have zero mean and unit variance, stabilizing and accelerating training.',
    relatedTopicIds: []
  },
  {
    id: 'g-dropout',
    term: 'Dropout',
    category: 'ml',
    definition: 'A regularization technique for neural networks that randomly deactivates a fraction of neurons during each training step, reducing overfitting by preventing co-adaptation.',
    relatedTopicIds: []
  },
  {
    id: 'g-learning-rate',
    term: 'Learning Rate',
    category: 'ml',
    definition: 'A hyperparameter that controls the step size taken during each iteration of gradient-based optimization, balancing convergence speed against training stability.',
    relatedTopicIds: []
  },
  {
    id: 'g-epoch',
    term: 'Epoch',
    category: 'ml',
    definition: 'One complete pass of a training algorithm through the entire training dataset during the iterative training of a model.',
    relatedTopicIds: []
  },
  {
    id: 'g-large-language-model',
    term: 'Large Language Model (LLM)',
    category: 'ml',
    definition: 'A neural network, typically transformer-based and trained on massive text corpora, capable of generating and understanding natural language across a broad range of tasks.',
    relatedTopicIds: []
  },
  {
    id: 'g-prompt-engineering',
    term: 'Prompt Engineering',
    category: 'ml',
    definition: 'The practice of designing and refining input instructions given to a language model to elicit more accurate, relevant, or reliable outputs.',
    relatedTopicIds: []
  },
  {
    id: 'g-retrieval-augmented-generation',
    term: 'Retrieval-Augmented Generation (RAG)',
    category: 'ml',
    definition: 'An architecture that enhances a language model’s output by first retrieving relevant documents or passages from an external knowledge source and conditioning generation on that retrieved context.',
    relatedTopicIds: []
  },
  {
    id: 'g-fine-tuning',
    term: 'Fine-Tuning',
    category: 'ml',
    definition: 'The process of further training a pretrained model on a smaller, task-specific dataset to adapt its parameters to a new task or domain.',
    relatedTopicIds: []
  },
  {
    id: 'g-transfer-learning',
    term: 'Transfer Learning',
    category: 'ml',
    definition: 'A machine learning technique in which knowledge gained while solving one task or trained on one dataset is reused as the starting point for a related task or dataset.',
    relatedTopicIds: []
  },
  {
    id: 'g-generative-adversarial-network',
    term: 'Generative Adversarial Network (GAN)',
    category: 'ml',
    definition: 'A generative model architecture consisting of a generator that creates synthetic data and a discriminator that distinguishes real from synthetic data, trained jointly in an adversarial process.',
    relatedTopicIds: []
  },
  {
    id: 'g-autoencoder',
    term: 'Autoencoder',
    category: 'ml',
    definition: 'A neural network trained to reconstruct its input by first compressing it into a lower-dimensional latent representation (encoder) and then reconstructing it (decoder).',
    relatedTopicIds: []
  },
  {
    id: 'g-encryption',
    term: 'Encryption',
    category: 'security',
    definition: 'The process of converting readable data (plaintext) into an encoded form (ciphertext) using an algorithm and key, so that only authorized parties can access the original information.',
    relatedTopicIds: []
  },
  {
    id: 'g-symmetric-encryption',
    term: 'Symmetric Encryption',
    category: 'security',
    definition: 'An encryption scheme in which the same secret key is used for both encrypting and decrypting data, requiring the key to be securely shared between parties.',
    relatedTopicIds: []
  },
  {
    id: 'g-asymmetric-encryption',
    term: 'Asymmetric Encryption',
    category: 'security',
    definition: 'An encryption scheme that uses a mathematically linked key pair, a public key for encryption and a private key for decryption, eliminating the need to share a secret key.',
    relatedTopicIds: []
  },
  {
    id: 'g-public-key-infrastructure',
    term: 'Public Key Infrastructure (PKI)',
    category: 'security',
    definition: 'A framework of policies, roles, and technologies that manages the creation, distribution, and revocation of digital certificates binding public keys to identities.',
    relatedTopicIds: []
  },
  {
    id: 'g-cryptographic-hash-function',
    term: 'Cryptographic Hash Function',
    category: 'security',
    definition: 'A one-way function that maps input data of any size to a fixed-size output (digest), designed to be collision-resistant and computationally infeasible to reverse.',
    relatedTopicIds: []
  },
  {
    id: 'g-digital-signature',
    term: 'Digital Signature',
    category: 'security',
    definition: 'A cryptographic mechanism that uses a signer’s private key to produce a value verifiable with their public key, proving the authenticity and integrity of a message.',
    relatedTopicIds: []
  },
  {
    id: 'g-tls',
    term: 'TLS (Transport Layer Security)',
    category: 'security',
    definition: 'A cryptographic protocol that provides encrypted, authenticated communication over a network, commonly used to secure HTTP traffic as HTTPS.',
    relatedTopicIds: []
  },
  {
    id: 'g-sql-injection',
    term: 'SQL Injection',
    category: 'security',
    definition: 'A code injection attack in which malicious SQL statements are inserted into an application’s input fields to manipulate or extract data from its underlying database.',
    relatedTopicIds: []
  },
  {
    id: 'g-cross-site-scripting',
    term: 'Cross-Site Scripting (XSS)',
    category: 'security',
    definition: 'A web security vulnerability that allows an attacker to inject malicious client-side scripts into web pages viewed by other users.',
    relatedTopicIds: []
  },
  {
    id: 'g-firewall',
    term: 'Firewall',
    category: 'security',
    definition: 'A network security system that monitors and controls incoming and outgoing traffic based on predetermined security rules, forming a barrier between trusted and untrusted networks.',
    relatedTopicIds: []
  },
  {
    id: 'g-vpn',
    term: 'VPN (Virtual Private Network)',
    category: 'security',
    definition: 'A technology that creates an encrypted tunnel over a public network, allowing users to transmit data as if their devices were directly connected to a private network.',
    relatedTopicIds: []
  },
  {
    id: 'g-man-in-the-middle-attack',
    term: 'Man-in-the-Middle Attack',
    category: 'security',
    definition: 'An attack in which an adversary secretly intercepts and potentially alters communications between two parties who believe they are communicating directly with each other.',
    relatedTopicIds: []
  },
  {
    id: 'g-zero-day-vulnerability',
    term: 'Zero-Day Vulnerability',
    category: 'security',
    definition: 'A software security flaw that is unknown to the vendor and has no available patch, leaving systems exposed until it is discovered and fixed.',
    relatedTopicIds: []
  },
  {
    id: 'g-denial-of-service-attack',
    term: 'Denial-of-Service (DoS) Attack',
    category: 'security',
    definition: 'An attack that aims to make a system or network resource unavailable to legitimate users by overwhelming it with excessive traffic or requests.',
    relatedTopicIds: []
  },
  {
    id: 'g-salting',
    term: 'Salting',
    category: 'security',
    definition: 'The practice of adding random data (a salt) to a password before hashing it, preventing attackers from using precomputed tables to reverse identical hashed passwords.',
    relatedTopicIds: []
  },
  {
    id: 'g-two-factor-authentication',
    term: 'Two-Factor Authentication (2FA)',
    category: 'security',
    definition: 'An authentication method that requires two independent forms of verification, typically something the user knows and something the user possesses, to confirm identity.',
    relatedTopicIds: []
  },
  {
    id: 'g-least-privilege',
    term: 'Principle of Least Privilege',
    category: 'security',
    definition: 'A security design principle stating that a user, process, or system should be granted only the minimum access rights necessary to perform its function.',
    relatedTopicIds: []
  },
  {
    id: 'g-phishing',
    term: 'Phishing',
    category: 'security',
    definition: 'A social engineering attack in which an adversary impersonates a trusted entity, typically via email or messaging, to trick victims into revealing sensitive information.',
    relatedTopicIds: []
  },
  {
    id: 'g-buffer-overflow',
    term: 'Buffer Overflow',
    category: 'security',
    definition: 'A vulnerability that occurs when a program writes more data to a fixed-size memory buffer than it can hold, potentially overwriting adjacent memory and enabling code execution.',
    relatedTopicIds: []
  },
  {
    id: 'g-turing-machine',
    term: 'Turing Machine',
    category: 'theory',
    definition: 'An abstract mathematical model of computation consisting of an infinite tape and a read/write head that transitions between states according to a set of rules, used to formally define computability.',
    relatedTopicIds: []
  },
  {
    id: 'g-halting-problem',
    term: 'Halting Problem',
    category: 'theory',
    definition: 'The problem of determining, from a description of a program and its input, whether the program will eventually halt or run forever; proven by Alan Turing to be undecidable.',
    relatedTopicIds: []
  },
  {
    id: 'g-np-completeness',
    term: 'NP-Completeness',
    category: 'theory',
    definition: 'A classification for decision problems that are both in NP (verifiable in polynomial time) and NP-hard (every problem in NP can be reduced to them in polynomial time).',
    relatedTopicIds: []
  },
  {
    id: 'g-p-vs-np',
    term: 'P vs NP',
    category: 'theory',
    definition: 'One of the most important open problems in computer science, asking whether every problem whose solution can be verified quickly (NP) can also be solved quickly (P).',
    relatedTopicIds: []
  },
  {
    id: 'g-finite-state-automaton',
    term: 'Finite State Automaton',
    category: 'theory',
    definition: 'An abstract computational model consisting of a finite number of states, transitions between states triggered by input symbols, and designated start and accepting states.',
    relatedTopicIds: []
  },
  {
    id: 'g-regular-expression',
    term: 'Regular Expression',
    category: 'theory',
    definition: 'A sequence of characters that defines a search pattern, formally corresponding to a regular language recognizable by a finite automaton, used for string matching and manipulation.',
    relatedTopicIds: []
  },
  {
    id: 'g-computability',
    term: 'Computability',
    category: 'theory',
    definition: 'The branch of theoretical computer science concerned with determining which problems can, in principle, be solved by an algorithm on a computational model such as a Turing machine.',
    relatedTopicIds: []
  },
  {
    id: 'g-church-turing-thesis',
    term: 'Church-Turing Thesis',
    category: 'theory',
    definition: 'A foundational hypothesis in computability theory asserting that any function computable by an effective procedure can be computed by a Turing machine.',
    relatedTopicIds: []
  },
  {
    id: 'g-algorithmic-bias',
    term: 'Algorithmic Bias',
    category: 'ethics',
    definition: 'Systematic and unfair discrimination in the outputs of an algorithm or model, often arising from biased training data, flawed assumptions, or skewed feature representation.',
    relatedTopicIds: []
  },
  {
    id: 'g-fairness-ml',
    term: 'Fairness (in Machine Learning)',
    category: 'ethics',
    definition: 'The property of a model or system treating individuals or groups equitably, typically formalized through metrics such as demographic parity or equalized odds across protected attributes.',
    relatedTopicIds: []
  },
  {
    id: 'g-explainability',
    term: 'Explainability',
    category: 'ethics',
    definition: 'The degree to which the internal mechanics or reasoning of a machine learning model can be described in human-understandable terms, often via post-hoc techniques like SHAP or LIME.',
    relatedTopicIds: []
  },
  {
    id: 'g-interpretability',
    term: 'Interpretability',
    category: 'ethics',
    definition: 'The extent to which a human can understand the cause of a model’s decision directly from its structure, such as with inherently transparent models like decision trees.',
    relatedTopicIds: []
  },
  {
    id: 'g-data-privacy',
    term: 'Data Privacy',
    category: 'ethics',
    definition: 'The practice of protecting individuals’ personal information from unauthorized collection, use, or disclosure, encompassing legal, technical, and organizational safeguards.',
    relatedTopicIds: []
  },
  {
    id: 'g-differential-privacy',
    term: 'Differential Privacy',
    category: 'ethics',
    definition: 'A mathematical framework for quantifying and limiting the privacy risk to individuals when their data is included in a statistical analysis, typically by adding calibrated noise to results.',
    relatedTopicIds: []
  },
  {
    id: 'g-informed-consent',
    term: 'Informed Consent',
    category: 'ethics',
    definition: 'The principle that individuals must be given clear information about how their data will be collected and used, and must voluntarily agree, before that data is gathered.',
    relatedTopicIds: []
  },
  {
    id: 'g-model-accountability',
    term: 'Model Accountability',
    category: 'ethics',
    definition: 'The responsibility of individuals or organizations that build and deploy a model to answer for its decisions, impacts, and failures, including mechanisms for auditing and redress.',
    relatedTopicIds: []
  },
  {
    id: 'g-disparate-impact',
    term: 'Disparate Impact',
    category: 'ethics',
    definition: 'A form of discrimination in which a facially neutral policy or model disproportionately harms a particular protected group, regardless of intent.',
    relatedTopicIds: []
  },
  {
    id: 'g-ai-alignment',
    term: 'AI Alignment',
    category: 'ethics',
    definition: 'The research problem of ensuring that an AI system’s goals, behaviors, and outputs remain consistent with human values and intentions, especially as system capability increases.',
    relatedTopicIds: []
  }
];
