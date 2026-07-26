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
  }
];
