import { CurriculumModule } from '../../types/curriculum';
import { VERIFIED_VIDEOS } from '../verifiedVideoRegistry';

export const phase6DLModules: CurriculumModule[] = [
  {
    id: 'p6-m17',
    phaseId: 6,
    title: 'Deep Learning & Neural Architectures',
    slug: 'deep-learning-neural-networks',
    category: 'ml',
    summary: 'Master Feedforward Neural Networks, Backpropagation calculus from scratch, Convolutional Neural Networks (CNNs), Recurrent Networks, Attention Mechanisms, and Transformer Architectures.',
    objective: 'Implement computational graph forward/backward passes from scratch, understand multi-head self-attention, and construct modern deep learning models.',
    prerequisiteModuleIds: ['p1-m4', 'p1-m5', 'p5-m16'],
    estimatedHours: 36,
    difficulty: 'advanced',
    colorAccent: 'lavender',
    capstone: {
      id: 'capstone-p6-m17',
      title: 'Neural Network Engine & Self-Attention Matrix Calculator from Scratch',
      description: 'Build a multi-layer neural network auto-differentiation computational graph and a Scaled Dot-Product Self-Attention module in pure Python/NumPy.',
      constraints: ['Pure NumPy and Python array math. No PyTorch or TensorFlow for core auto-grad calculation.'],
      expectedDeliverables: ['Dense layer forward and backward pass equations.', 'ReLU / Softmax activation backward gradients.', 'Scaled Dot-Product Attention function: Softmax(QK^T / sqrt(d_k)) V.'],
      evaluationRubric: [
        { criterion: 'Backpropagation Gradient Accuracy', weight: '50%', description: 'Analytical gradients match numerical finite difference checks.' },
        { criterion: 'Self-Attention Implementation', weight: '50%', description: 'Correct attention matrix soft-max scaling and weighted sum projection.' }
      ]
    },
    topics: [
      {
        id: 'p6-m17-t1',
        moduleId: 'p6-m17',
        title: 'Backpropagation and Transformer Self-Attention',
        slug: 'backpropagation-transformers',
        summary: 'Master Chain Rule multi-layer gradient computation, Activation Functions (ReLU, GELU), Softmax, and Transformer Self-Attention mechanism.',
        order: 1,
        masteryPack: {
          learningObjective: 'Derive backpropagation gradients for multi-layer perceptrons and compute Query-Key-Value scaled dot-product attention matrices.',
          prerequisites: ['Multivariable Calculus partial derivatives', 'Matrix multiplication', 'Machine Learning foundations'],
          coreConcepts: [
            'Multi-Layer Perceptrons (MLP) and Non-Linear Activation Functions (ReLU, GELU, Sigmoid)',
            'The Backpropagation Algorithm: Multivariate Chain Rule on Computational Graphs',
            'Cross-Entropy Loss Gradient with Softmax Output Layers',
            'Vanishing and Exploding Gradient Problem & Layer Normalization',
            'Scaled Dot-Product Self-Attention: Attention(Q, K, V) = softmax((Q K^T) / sqrt(d_k)) V'
          ],
          primaryLecture: VERIFIED_VIDEOS['p6-m17-t1'] as any,
          primaryText: {
            id: 'book-deep-learning',
            title: 'Deep Learning Textbook (Free Online Book)',
            authors: ['Ian Goodfellow', 'Yoshua Bengio', 'Aaron Courville'],
            url: 'https://www.deeplearningbook.org/',
            recommendedChapter: 'Chapter 6: Deep Feedforward Networks & Chapter 10: Sequence Modeling',
            publisherOrInstitution: 'MIT Press Open Book',
            accessStatus: 'verified'
          },
          recommendedChapter: 'Chapter 6: Deep Feedforward Networks',
          authoritativeResearchSource: {
            id: 'paper-vaswani-2017',
            title: 'Attention Is All You Need',
            authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'Llion Jones', 'Aidan N. Gomez', 'Łukasz Kaiser', 'Illia Polosukhin'],
            year: 2017,
            venue: 'Advances in Neural Information Processing Systems (NeurIPS)',
            doiOrArxiv: 'arXiv:1706.03762',
            openAccessUrl: 'https://arxiv.org/pdf/1706.03762.pdf',
            paperType: 'seminal',
            difficulty: 'advanced',
            prerequisites: ['Matrix operations and deep learning fundamentals'],
            summary: 'The landmark Google paper introducing the Transformer architecture, replacing recurrent networks with parallel multi-head self-attention mechanisms powering modern Large Language Models (LLMs).',
            whyItMatters: 'The single most influential paper in modern AI, forming the architecture behind Gemini, ChatGPT, and BERT.',
            sectionsToRead: 'Section 3: Model Architecture (3.1 & 3.2 Attention details)',
            readingQuestions: [
              'Why is scaling by 1/sqrt(d_k) essential in scaled dot-product attention?',
              'How do Positional Encodings inject sequence order information into parallel Transformer inputs?'
            ],
            relatedTopicIds: ['p6-m17-t1'],
            accessStatus: 'verified'
          },
          practicalExercises: [
            {
              id: 'ex-p6-1',
              question: 'In Scaled Dot-Product Attention, what are Q, K, and V matrices derived from?',
              options: [
                'Linear projections of input embeddings X multiplied by weight matrices W_q, W_k, W_v',
                'Random Gaussian noise vectors',
                'Identity matrices',
                'One-hot encoded target labels'
              ],
              correctAnswer: 0,
              explanation: 'Q = X W_q, K = X W_k, V = X W_v where X is the sequence embedding matrix.',
              type: 'multiple-choice'
            }
          ],
          interactiveLab: {
            id: 'lab-p6-1',
            title: 'Scaled Dot-Product Self-Attention Simulator',
            type: 'python',
            instructions: 'Write a Python function `self_attention(Q, K, V)` that computes Attention(Q, K, V) = softmax(Q K^T / sqrt(d_k)) V in pure Python math.',
            starterCode: `import math

def softmax(vector):
    max_val = max(vector)
    exp_vals = [math.exp(v - max_val) for v in vector]
    sum_exp = sum(exp_vals)
    return [e / sum_exp for e in exp_vals]

def self_attention_single(q_vec, K_matrix, V_matrix):
    d_k = len(q_vec)
    scale = math.sqrt(d_k)
    
    # 1. Dot product scores Q * K^T / sqrt(d_k)
    scores = []
    for k_vec in K_matrix:
        dot = sum(q * k for q, k in zip(q_vec, k_vec))
        scores.append(dot / scale)
        
    # 2. Softmax normalization
    weights = softmax(scores)
    
    # 3. Weighted sum over V_matrix
    output_dim = len(V_matrix[0])
    context = [0.0] * output_dim
    for w, v_vec in zip(weights, V_matrix):
        for i in range(output_dim):
            context[i] += w * v_vec[i]
            
    return context, weights

# Example Query, Keys, Values
q = [1.0, 0.5]
K = [[1.0, 0.0], [0.0, 1.0], [1.0, 1.0]]
V = [[10, 0], [0, 20], [10, 20]]

context, weights = self_attention_single(q, K, V)
print("Attention Weights:", [round(w, 3) for w in weights])
print("Output Context Vector:", [round(c, 2) for c in context])
`,
            testCases: [
              {
                expectedOutput: 'Output Context Vector:',
                description: 'Validates soft-max attention weight scaling and output context projection.'
              }
            ]
          },
          readingQuestions: [
            'Why does multi-head attention allow the network to attend to information from different representation subspaces simultaneously?',
            'What is the computational complexity of self-attention with respect to sequence length N?'
          ],
          masteryChecklist: [
            'Derive backpropagation gradients for a 2-layer neural network with ReLU activations.',
            'Compute single-head and multi-head self-attention by hand for small matrices.',
            'Explain residual skip connections and Layer Normalization in Transformer blocks.'
          ],
          capstoneMilestone: 'Milestone 1: Computational graph auto-differentiation & Transformer block implementation.',
          estimatedStudyMinutes: 240,
          difficulty: 'advanced',
          glossary: [
            { term: 'Backpropagation', definition: 'The efficient algorithm for calculating gradients of a scalar loss function with respect to all neural network weights using the chain rule.' },
            { term: 'Self-Attention', definition: 'An attention mechanism relating different positions of a single sequence to compute a representation of the sequence.' }
          ],
          commonMisconceptions: [
            'Misconception: Transformers require recurrent loops like RNNs to process text sequences. Reality: Transformers process all tokens in parallel using positional encodings.'
          ],
          connectionsToLaterModules: [
            'Essential for Fine-Tuning and Model Serving in MLOps Phase 7',
            'Foundation for Natural Language Processing Specializations in Phase 8'
          ],
          citation: { text: 'Vaswani, A., et al. (2017). Attention Is All You Need. NeurIPS 2017.' },
          accessStatus: 'verified'
        }
      }
    ]
  }
];
