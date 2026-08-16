import { CurriculumModule } from '../../types/curriculum';
import { VERIFIED_VIDEOS } from '../verifiedVideoRegistry';

export const phase3CSModules: CurriculumModule[] = [
  {
    id: 'p3-m13',
    phaseId: 3,
    title: 'Data Structures and Algorithmic Analysis',
    slug: 'data-structures-algorithms',
    category: 'cs',
    summary: 'Master asymptotic complexity (Big-O, Big-Omega, Big-Theta), Searching/Sorting, Stacks, Queues, Hash Tables, Trees, Heap Queues, and Graph Algorithms.',
    objective: 'Analyze and implement fundamental data structures and graph algorithms with proven time/space complexity trade-offs.',
    prerequisiteModuleIds: ['p1-m3', 'p2-m8'],
    estimatedHours: 30,
    difficulty: 'intermediate',
    colorAccent: 'lavender',
    capstone: {
      id: 'capstone-p3-m13',
      title: 'High-Performance Graph Routing Engine & Trie Auto-Complete',
      description: 'Implement Dijkstra’s shortest path algorithm using a Min-Heap priority queue, alongside a Trie prefix-tree for sub-millisecond search autocomplete.',
      constraints: ['Pure Python implementation without external graph libraries.'],
      expectedDeliverables: ['Min-Heap priority queue implementation.', 'Dijkstra shortest path router.', 'Trie prefix search tree.'],
      evaluationRubric: [
        { criterion: 'Algorithm Correctness', weight: '50%', description: 'Dijkstra correctly computes shortest path weights.' },
        { criterion: 'Time Complexity Efficiency', weight: '50%', description: 'Min-Heap ensures O((V + E) log V) execution speed.' }
      ]
    },
    topics: [
      {
        id: 'p3-m13-t1',
        moduleId: 'p3-m13',
        title: 'Asymptotic Analysis, Trees, Heaps, and Graph Algorithms',
        slug: 'asymptotic-trees-heaps-graphs',
        summary: 'Explore Big-O notation, Binary Search Trees, Min-Heaps, Breadth-First Search (BFS), Depth-First Search (DFS), and Dijkstra’s Algorithm.',
        order: 1,
        masteryPack: {
          learningObjective: 'Design and evaluate graph algorithms, balanced search trees, and heap priority queues for efficient resource management.',
          prerequisites: ['Discrete mathematics & basic Python'],
          coreConcepts: [
            'Asymptotic Formalism: Big-O Upper Bound, Big-Omega Lower Bound, Big-Theta Tight Bound: Big-O describes the worst-case growth rate of an algorithm\'s running time or space as input size increases (an upper bound), Big-Omega describes a best-case lower bound, and Big-Theta describes a tight bound where the upper and lower bounds match, giving a precise characterization; mastering these lets you compare algorithms independent of hardware or implementation details.',
            'Binary Search Trees (BST) and Self-Balancing Concepts (AVL, Red-Black): a BST keeps every left-subtree value less than its parent and every right-subtree value greater, enabling O(log n) search, insert, and delete when the tree is balanced; self-balancing variants like AVL and Red-Black trees automatically restructure themselves during insertions and deletions to guarantee that logarithmic height even in adversarial input orderings, avoiding the O(n) worst case of a naive BST built from sorted input.',
            'Min-Heap & Max-Heap Priority Queues (Sift-Up, Sift-Down Operations): a heap is a complete binary tree stored compactly in an array that maintains the heap invariant (parent ≤ children for a min-heap), giving O(1) access to the minimum (or maximum) element and O(log n) insertion (sift-up) and removal (sift-down); heaps are the standard implementation of priority queues and are central to efficient graph algorithms like Dijkstra\'s.',
            'Graph Representations: Adjacency List vs Adjacency Matrix: an adjacency list stores, for each vertex, a list of its neighbors, using O(V + E) space and being efficient for sparse graphs; an adjacency matrix stores a V×V grid of edge presence/weight, using O(V²) space but offering O(1) edge-existence checks, making the right choice dependent on graph density and the operations you need to perform frequently.',
            'Graph Traversal & Shortest Path: BFS, DFS, Dijkstra\'s Algorithm: Breadth-First Search explores a graph level by level using a queue and guarantees the shortest path in an unweighted graph, Depth-First Search explores as far as possible along each branch using a stack (or recursion) and is suited to tasks like cycle detection and topological sorting, and Dijkstra\'s algorithm generalizes shortest-path search to weighted graphs with non-negative edges by greedily expanding the closest unvisited vertex using a min-heap priority queue.',
            'Trie (Prefix Tree) Data Structure: a trie stores strings by sharing common prefixes along root-to-node paths, so looking up, inserting, or checking a prefix of a string of length k takes O(k) time regardless of how many other strings are stored, which is why tries power autocomplete and spell-check systems far more efficiently than scanning a list of strings.'
          ],
          primaryLecture: VERIFIED_VIDEOS['p3-m13-t1'] as any,
          primaryText: {
            id: 'book-clrs',
            title: 'Introduction to Algorithms (CLRS Open Materials & Course Notes)',
            authors: ['Thomas H. Cormen', 'Charles E. Leiserson', 'Ronald L. Rivest', 'Clifford Stein'],
            url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/',
        pdfUrl: 'https://opendatastructures.org/ods-python.pdf',
            recommendedChapter: 'Chapter 6: Heapsort & Chapter 22: Elementary Graph Algorithms',
            publisherOrInstitution: 'MIT Press / MIT OCW',
            accessStatus: 'verified'
          },
          recommendedChapter: 'Chapter 22: Graph Algorithms (BFS and DFS)',
          authoritativeResearchSource: {
            id: 'paper-dijkstra-1959',
            title: 'A Note on Two Problems in Connexion with Graphs',
            authors: ['E. W. Dijkstra'],
            year: 1959,
            venue: 'Numerische Mathematik',
            doiOrArxiv: '10.1007/BF01386390',
            openAccessUrl: 'https://opendatastructures.org/ods-python.pdf',
            paperType: 'seminal',
            difficulty: 'intermediate',
            prerequisites: ['Graph definitions'],
            summary: 'The original 3-page classic paper defining Dijkstra’s shortest path algorithm and Minimum Spanning Trees.',
            whyItMatters: 'Powers modern network routing protocols, GPS mapping, and internet packet transport.',
            sectionsToRead: 'Problem 2: Shortest Path Computation',
            readingQuestions: [
              'Why does Dijkstra’s algorithm fail on graphs with negative edge weights?',
              'How does a priority queue reduce Dijkstra’s search step complexity?'
            ],
            relatedTopicIds: ['p3-m13-t1'],
            accessStatus: 'verified'
          },
          practicalExercises: [
            {
              id: 'ex-p3-1',
              question: 'What is the average time complexity of insertion into a Min-Heap containing N elements?',
              options: ['O(log N)', 'O(1)', 'O(N)', 'O(N log N)'],
              correctAnswer: 0,
              explanation: 'In a binary heap of size N, the height is log N. Sift-up takes at most log N comparisons.',
              type: 'multiple-choice'
            },
            {
              id: 'ex-p3-2',
              question: 'Why does Dijkstra\'s algorithm fail to produce correct results on a graph containing a negative edge weight?',
              explanation: 'Dijkstra\'s algorithm greedily finalizes the shortest known distance to a vertex as soon as it is popped from the priority queue, assuming no future path could ever improve on it. This assumption only holds if all edge weights are non-negative, since adding any non-negative edge to a path can never decrease its total length. If a negative edge exists, a longer-looking path discovered later could actually be shorter once that negative edge is added, but Dijkstra has already "locked in" the vertex and will not revisit it, producing an incorrect distance. Algorithms like Bellman-Ford handle negative weights correctly by repeatedly relaxing all edges instead of finalizing distances greedily.',
              type: 'free-response'
            },
            {
              id: 'ex-p3-3',
              question: 'Which traversal algorithm and data structure combination correctly describes Breadth-First Search (BFS)?',
              options: [
                'Uses a stack (or recursion) and explores as deep as possible before backtracking',
                'Uses a queue and explores all neighbors at the current depth before moving deeper',
                'Uses a min-heap and always expands the lowest-cost vertex first',
                'Uses a hash set and explores vertices in arbitrary order'
              ],
              correctAnswer: 1,
              explanation: 'BFS uses a FIFO queue: it visits a vertex, enqueues all its unvisited neighbors, then processes vertices in the order they were enqueued, which naturally explores the graph level by level and guarantees the shortest path (in terms of edge count) on unweighted graphs. DFS is the one that uses a stack or recursion to go as deep as possible before backtracking, and Dijkstra is the one that uses a min-heap to always expand the currently closest vertex.',
              type: 'multiple-choice'
            },
            {
              id: 'ex-p3-4',
              question: 'Write the recurrence relation for the time complexity of binary search on a sorted array of size n, and state its closed-form Big-O complexity.',
              explanation: 'Binary search\'s recurrence is T(n) = T(n/2) + O(1), because each step does constant work (one comparison) and then recurses on a problem half the size. By the Master Theorem (or simply by noting the array size halves each step, so it takes log2(n) steps to reach a single element), this recurrence resolves to O(log n) time complexity.',
              type: 'code-snippet'
            },
            {
              id: 'ex-p3-5',
              question: 'In an adjacency list representation of a graph with V vertices and E edges, what is the space complexity, and why is this typically preferred over an adjacency matrix for sparse graphs?',
              explanation: 'An adjacency list uses O(V + E) space, since it stores one list header per vertex plus one entry per edge (or two for undirected graphs). An adjacency matrix always uses O(V²) space regardless of how many edges actually exist. For a sparse graph, where E is much smaller than V², the adjacency list is dramatically more memory-efficient, at the cost of O(degree(v)) time to check whether a specific edge exists, versus O(1) for a matrix.',
              type: 'free-response'
            }
          ],
          interactiveLab: {
            id: 'lab-p3-1',
            title: 'Min-Heap Priority Queue Implementation',
            type: 'python',
            instructions: 'Write a `MinHeap` class in Python with `insert(val)` and `extract_min()` methods maintaining binary tree heap invariants.',
            starterCode: `class MinHeap:
    def __init__(self):
        self.heap = []

    def insert(self, val):
        self.heap.append(val)
        self._sift_up(len(self.heap) - 1)

    def extract_min(self):
        if not self.heap:
            return None
        if len(self.heap) == 1:
            return self.heap.pop()
        
        min_val = self.heap[0]
        self.heap[0] = self.heap.pop()
        self._sift_down(0)
        return min_val

    def _sift_up(self, idx):
        parent = (idx - 1) // 2
        while idx > 0 and self.heap[idx] < self.heap[parent]:
            self.heap[idx], self.heap[parent] = self.heap[parent], self.heap[idx]
            idx = parent
            parent = (idx - 1) // 2

    def _sift_down(self, idx):
        n = len(self.heap)
        while True:
            smallest = idx
            left = 2 * idx + 1
            right = 2 * idx + 2
            
            if left < n and self.heap[left] < self.heap[smallest]:
                smallest = left
            if right < n and self.heap[right] < self.heap[smallest]:
                smallest = right
                
            if smallest != idx:
                self.heap[idx], self.heap[smallest] = self.heap[smallest], self.heap[idx]
                idx = smallest
            else:
                break

# Testing MinHeap
h = MinHeap()
for v in [5, 3, 8, 1, 4]:
    h.insert(v)

extracted = [h.extract_min() for _ in range(5)]
print("Extracted in sorted order:", extracted)
`,
            testCases: [
              {
                expectedOutput: 'Extracted in sorted order: [1, 3, 4, 5, 8]',
                description: 'Validates min-heap property and extract ordering.'
              }
            ]
          },
          readingQuestions: [
            'Why does BFS guarantee the shortest path on unweighted graphs while DFS does not?',
            'What is the difference between path compression in Disjoint Set Union (DSU) vs tree balancing?',
            'Why must Big-O, Big-Omega, and Big-Theta be understood as separate bounds rather than interchangeable synonyms for "running time"?',
            'How does maintaining the heap invariant during insertion (sift-up) differ from maintaining it during extraction (sift-down)?',
            'Why does an unbalanced Binary Search Tree built by inserting already-sorted data degrade to O(n) search time, and how do self-balancing trees prevent this?',
            'Why does Dijkstra\'s algorithm use a min-heap priority queue rather than a plain queue or a sorted list, in terms of the resulting time complexity?'
          ],
          masteryChecklist: [
            'Implement BFS and DFS graph traversals from scratch.',
            'Derive Big-O bounds for recursive algorithms using the Master Theorem.',
            'Construct a Trie for prefix matching string operations.'
          ],
          capstoneMilestone: 'Milestone 1: Shortest path routing engine implementation.',
          estimatedStudyMinutes: 240,
          difficulty: 'intermediate',
          glossary: [
            { term: 'Heap Invariant', definition: 'In a Min-Heap, every parent node is less than or equal to its child nodes (the reverse for a Max-Heap), a property maintained after every insertion and removal.' },
            { term: 'Adjacency List', definition: 'A space-efficient graph representation mapping each vertex to a list of its connected neighbor vertices, using O(V + E) total space.' },
            { term: 'Big-O Notation', definition: 'A mathematical notation describing the upper-bound growth rate of an algorithm\'s time or space usage as input size approaches infinity, ignoring constant factors and lower-order terms.' },
            { term: 'Binary Search Tree (BST)', definition: 'A binary tree in which every node\'s left subtree contains only smaller values and its right subtree contains only larger values, enabling O(log n) search when balanced.' },
            { term: 'Sift-Up / Sift-Down', definition: 'The two operations used to restore the heap invariant after modifying a heap: sift-up moves a newly inserted element toward the root while it is smaller than its parent, and sift-down moves a newly placed root element toward the leaves while it is larger than a child.' },
            { term: 'Priority Queue', definition: 'An abstract data type that supports efficiently retrieving and removing the element with the highest (or lowest) priority, most commonly implemented using a heap.' },
            { term: 'Adjacency Matrix', definition: 'A graph representation using a V×V grid where cell (i, j) indicates whether (and possibly with what weight) an edge exists between vertex i and vertex j, giving O(1) edge lookups at O(V²) space cost.' },
            { term: 'Trie (Prefix Tree)', definition: 'A tree data structure where each path from the root spells out a prefix of stored strings, allowing prefix search, insertion, and lookup in time proportional to the string length.' },
            { term: 'Disjoint Set Union (DSU)', definition: 'Also called Union-Find, a data structure that tracks a partition of elements into non-overlapping sets, supporting near-constant-time union and find operations when combined with path compression and union by rank.' },
            { term: 'Master Theorem', definition: 'A formula for directly determining the Big-O complexity of divide-and-conquer recurrences of the form T(n) = aT(n/b) + f(n), without manually expanding the recursion tree.' }
          ],
          commonMisconceptions: [
            'Misconception: Hash table lookups are always O(1). Reality: Hash lookups are O(1) on average, but degenerate to O(N) in worst-case hash collisions.',
            'Misconception: Big-O notation describes the exact running time of an algorithm. Reality: Big-O describes the asymptotic growth rate as input size approaches infinity, ignoring constant factors and lower-order terms, so an O(n) algorithm with a large constant factor can run slower than an O(n log n) algorithm for realistic input sizes.',
            'Misconception: A Binary Search Tree always guarantees O(log n) operations. Reality: an unbalanced BST built by inserting elements in sorted order degenerates into a linked list with O(n) height, making search, insert, and delete all O(n); only self-balancing variants like AVL or Red-Black trees guarantee O(log n) in the worst case.',
            'Misconception: DFS and BFS always visit graph vertices in the same order. Reality: their traversal orders differ fundamentally — DFS dives deep along one branch before backtracking (stack-based), while BFS expands outward level by level (queue-based) — and only BFS guarantees the shortest path by edge count on unweighted graphs.',
            'Misconception: Dijkstra\'s algorithm can be used on any graph including those with negative edge weights, as long as you run it carefully. Reality: Dijkstra\'s greedy strategy of permanently finalizing a vertex\'s distance breaks down in the presence of negative edges; algorithms like Bellman-Ford are required for graphs that may contain negative weights.'
          ],
          connectionsToLaterModules: [
            'Foundation for Search indexing and Query optimization in Phase 4',
            'Prerequisite for Neural Network computation graphs in Phase 6'
          ],
          citation: { text: 'Dijkstra, E. W. (1959). A Note on Two Problems in Connexion with Graphs. Numerische Mathematik, 1(1), 269–271.' },
          accessStatus: 'verified'
        }
      }
    ]
  }
];
