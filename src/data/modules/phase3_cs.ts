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
            'Asymptotic Formalism: Big-O Upper Bound, Big-Omega Lower Bound, Big-Theta Tight Bound',
            'Binary Search Trees (BST) and Self-Balancing Concepts (AVL, Red-Black)',
            'Min-Heap & Max-Heap Priority Queues (Sift-Up, Sift-Down Operations)',
            'Graph Representations: Adjacency List vs Adjacency Matrix',
            'Graph Traversal & Shortest Path: BFS, DFS, Dijkstra’s Algorithm'
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
            'What is the difference between path compression in Disjoint Set Union (DSU) vs tree balancing?'
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
            { term: 'Heap Invariant', definition: 'In a Min-Heap, every parent node is less than or equal to its child nodes.' },
            { term: 'Adjacency List', definition: 'A space-efficient graph representation mapping each vertex to a list of its connected neighbor vertices.' }
          ],
          commonMisconceptions: [
            'Misconception: Hash table lookups are always O(1). Reality: Hash lookups are O(1) on average, but degenerate to O(N) in worst-case hash collisions.'
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
