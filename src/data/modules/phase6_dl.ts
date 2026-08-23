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
            'Multi-Layer Perceptrons (MLP) and Non-Linear Activation Functions (ReLU, GELU, Sigmoid): An MLP stacks alternating linear (weight matrix + bias) layers with non-linear activation functions to approximate arbitrarily complex functions — without the non-linearity, stacking linear layers would collapse into a single linear transform, so these activations are what give deep networks their expressive power to separate non-linearly-separable data.',
            'The Backpropagation Algorithm: Multivariate Chain Rule on Computational Graphs: Backpropagation turns a forward pass through a network into a reusable graph of local derivatives, then walks that graph backward applying the multivariate chain rule to compute the gradient of the loss with respect to every weight in a single, efficient pass — it is the computational engine that makes training networks with millions of parameters practically feasible.',
            'Cross-Entropy Loss Gradient with Softmax Output Layers: Pairing softmax activation with cross-entropy loss is the standard choice for classification because their combined gradient collapses to the elegant expression (predicted_probabilities - true_labels), avoiding numerically unstable derivative chains and giving a gradient signal that scales naturally with how wrong a prediction is.',
            'Vanishing and Exploding Gradient Problem & Layer Normalization: As gradients are multiplied backward through many layers via the chain rule, repeated multiplication by small or large values can shrink them toward zero or blow them up toward infinity, stalling or destabilizing training — careful weight initialization, residual connections, and layer normalization rescale activations at each layer to keep gradients well-behaved through very deep or very long networks.',
            'Scaled Dot-Product Self-Attention: Attention(Q, K, V) = softmax((Q K^T) / sqrt(d_k)) V: Self-attention lets every position in a sequence compute a weighted combination of every other position\'s value vector, where the weights come from how well each position\'s query matches every other position\'s key — the 1/sqrt(d_k) scaling keeps the dot products (and the softmax gradient) from saturating as key dimension grows, which is what makes Transformers trainable at scale while replacing sequential recurrence with parallel computation.',
            'Multi-Head Attention and Positional Encoding: Multi-head attention runs several scaled dot-product attention operations in parallel with different learned projections, letting the model attend to different types of relationships (e.g., syntactic vs. semantic) simultaneously; because attention itself has no notion of order, positional encodings are added to input embeddings so the model can still distinguish the first token from the last.',
            'Residual (Skip) Connections and Layer Normalization in Transformer Blocks: Each Transformer sub-layer wraps its output in a residual connection (output = x + Sublayer(x)) followed by layer normalization, giving gradients an unimpeded path directly back to earlier layers and stabilizing the distribution of activations — together these are what make it possible to stack dozens of Transformer blocks without the network becoming untrainable.'
          ],
          simpleExplanation: `Imagine a machine built entirely out of knobs — thousands, then millions of them — each one nudging a number up or down by a tiny amount. You feed a picture or a sentence in one end, the knobs combine and recombine the numbers as it flows through, and something comes out the other end: a guess. At first the knobs are set randomly, so the guesses are terrible. The whole game of training a neural network is turning the right knobs by the right amount so the guesses get better.

But how do you know which knobs to turn, and by how much? This is where backpropagation comes in, and the best analogy is a chef tasting a ruined dish and tracing the blame backward. Suppose a soup tastes too salty. You didn't dump in all the salt at once — you added a little during the base, a splash of soy sauce halfway through, and a sprinkle at the end. To fix the recipe, you work backward from the final taste, asking at each stage "how much did this step contribute to the saltiness?" Backpropagation does exactly this with math: starting from the network's final wrong answer, it walks backward through every layer asking "how much did this knob's setting contribute to the error?" using a calculus shortcut called the chain rule. Every knob gets its own personalized nudge, all worked out in one efficient backward sweep.

Some of the networks in this topic are also given a peculiar new sense: attention. Picture a group project where, to write one sentence of a shared report, each person is allowed to peek at everyone else's notes and decide how much weight to give each one before writing their own line. That is self-attention: every word in a sentence looks at every other word, decides which ones matter most to it right now (a pronoun like "it" pays a lot of attention to whichever noun it's standing in for), and blends their information together accordingly. Doing this for every word at once, instead of reading left to right one word at a time the way older networks did, is what makes modern language models both fast to train and good at connecting words that are far apart in a paragraph.

Stack many of these attention layers on top of each other, and give each one a shortcut path that lets information skip straight past it when needed — so instructions don't get garbled like a whisper passed down a long hallway — and you get a Transformer, the architecture behind essentially every major AI language model built since 2017.`,
          realWorldApplications: [
            {
              title: 'ChatGPT and the GPT model family (OpenAI)',
              description: 'ChatGPT is built from dozens of stacked Transformer blocks that use multi-head self-attention to weigh the relevance of every prior word when predicting the next one, with all of its billions of parameters tuned through backpropagation during training.'
            },
            {
              title: "Google's BERT in Search ranking",
              description: 'Google incorporated the Transformer-based BERT model into search ranking so queries and page content are understood using self-attention, letting the system weigh how each word in a query relates to the others rather than reading it in strict left-to-right isolation.'
            },
            {
              title: "DeepMind's AlphaFold protein structure predictor",
              description: 'AlphaFold uses attention-based neural network modules to weigh relationships between pairs of amino acids when predicting how a protein chain folds into its 3D shape, a problem that stumped biologists for decades.'
            },
            {
              title: "Tesla Autopilot's camera vision networks",
              description: "Tesla's driving-assistance networks are deep multi-layer networks trained via backpropagation on millions of miles of camera footage, adjusting internal weights so the model recognizes lanes, vehicles, and pedestrians from raw pixels."
            },
            {
              title: 'GitHub Copilot code completion',
              description: "Copilot's underlying model is a Transformer that applies self-attention over the code already open in your editor, deciding which earlier lines and variable names are most relevant before suggesting the next line."
            }
          ],
          primaryLecture: VERIFIED_VIDEOS['p6-m17-t1'] as any,
          primaryText: {
            id: 'book-deep-learning',
            title: 'Deep Learning Textbook (Free Online Book)',
            authors: ['Ian Goodfellow', 'Yoshua Bengio', 'Aaron Courville'],
            url: 'https://www.deeplearningbook.org/',
        pdfUrl: 'https://www.deeplearningbook.org/front_matter.pdf',
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
            },
            {
              id: 'ex-p6-2',
              question: 'Given softmax output p = softmax(z) and one-hot true label vector y, derive the gradient of the cross-entropy loss L = -Σ y_i log(p_i) with respect to the pre-softmax logits z. Show your steps.',
              explanation: 'dL/dz_i = p_i - y_i. Derivation: L = -Σ_j y_j log(p_j), and the softmax Jacobian gives dp_j/dz_i = p_j(δ_ij - p_i). Applying the chain rule, dL/dz_i = -Σ_j y_j(δ_ij - p_i) = -y_i + p_i Σ_j y_j = p_i - y_i, using Σ_j y_j = 1 since y is one-hot. This is why softmax + cross-entropy gradients reduce to the simple form "predicted minus actual."',
              type: 'free-response'
            },
            {
              id: 'ex-p6-3',
              question: 'Which of the following is the primary mathematical reason deep sigmoid networks suffer from vanishing gradients?',
              options: [
                'Sigmoid derivatives are bounded by 0.25, so multiplying many such derivatives together during backpropagation shrinks the gradient toward zero exponentially with depth',
                'Sigmoid functions are not differentiable',
                'The chain rule does not apply to sigmoid activations',
                'Cross-entropy loss cannot be combined with sigmoid activations'
              ],
              correctAnswer: 0,
              explanation: 'The sigmoid derivative σ\'(x) = σ(x)(1-σ(x)) has a maximum value of 0.25 at x=0. Backpropagation multiplies these derivatives layer by layer via the chain rule, so through L layers the gradient can shrink by a factor as small as 0.25^L, vanishing rapidly as depth increases. This motivated ReLU-family activations and normalization/residual techniques.',
              type: 'multiple-choice'
            },
            {
              id: 'ex-p6-4',
              question: 'You are processing a sequence of length N=10,000 tokens with standard scaled dot-product self-attention. How does the compute and memory cost of the attention matrix scale as N grows, and what design implication does this have for long-document Transformers?',
              explanation: 'Computing Q K^T produces an N x N score matrix, so both compute and memory scale as O(N^2 * d_k). At N=10,000 this quadratic term dominates the cost, which is why long-context Transformer variants use techniques like sparse attention, sliding-window attention, or linear-attention approximations to avoid the full N^2 blowup in compute and memory.',
              type: 'free-response'
            },
            {
              id: 'ex-p6-5',
              question: 'Why do Transformers use multiple attention heads instead of a single attention operation with a larger d_k?',
              options: [
                'Each head learns its own Q/K/V projections, allowing the model to attend to different types of relationships (e.g., syntax vs. long-range dependency) in different representation subspaces simultaneously',
                'Multiple heads are required because a single head cannot compute a softmax',
                'Multiple heads reduce the total number of parameters compared to one large head',
                'Multiple heads eliminate the need for positional encoding'
              ],
              correctAnswer: 0,
              explanation: 'Multi-head attention projects Q, K, V into several lower-dimensional subspaces in parallel, letting each head specialize in different relational patterns; the outputs are concatenated and linearly projected back. This generally improves representational power versus a single attention operation of the same total dimensionality.',
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
            'What is the computational complexity of self-attention with respect to sequence length N?',
            'How does the chain rule let backpropagation compute gradients for a network with millions of parameters in roughly the same time as a single forward pass?',
            'Why does combining softmax activation with cross-entropy loss simplify the backward pass compared to using softmax with mean-squared-error loss?',
            'What role do residual connections play in allowing Transformers to be stacked to dozens of layers without vanishing gradients?',
            'How would you empirically verify that an implemented backpropagation gradient is correct using numerical (finite-difference) gradient checking?'
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
            { term: 'Backpropagation', definition: 'The efficient algorithm for calculating gradients of a scalar loss function with respect to all neural network weights by propagating error signals backward through the computational graph using the chain rule.' },
            { term: 'Self-Attention', definition: 'An attention mechanism that relates different positions within a single sequence to each other, producing for each position a weighted combination of all other positions\' representations.' },
            { term: 'Chain Rule', definition: 'The calculus rule stating that the derivative of a composite function equals the product of the derivatives of its parts; it is the mathematical foundation that lets backpropagation decompose an end-to-end gradient into a product of simple, local per-layer derivatives.' },
            { term: 'Computational Graph', definition: 'A directed acyclic graph representation of a sequence of mathematical operations, where nodes are operations or variables and edges show data dependencies; frameworks build one during the forward pass so gradients can be computed by traversing it in reverse (automatic differentiation).' },
            { term: 'Vanishing / Exploding Gradient Problem', definition: 'The phenomenon where gradients shrink toward zero or grow toward infinity as they are backpropagated through many layers or time steps, because the chain rule multiplies many partial derivatives together; it prevents early layers of very deep or recurrent networks from learning effectively.' },
            { term: 'Layer Normalization', definition: 'A normalization technique that rescales the activations of each individual training example across its feature dimension to have zero mean and unit variance, independent of batch size; used pervasively in Transformers to stabilize and speed up training.' },
            { term: 'Multi-Head Attention', definition: 'An extension of self-attention that runs several attention operations ("heads") in parallel, each with its own learned Q/K/V projection matrices, so the model can jointly attend to information from different representation subspaces at different positions.' },
            { term: 'Positional Encoding', definition: 'A fixed or learned vector added to each input embedding to inject information about a token\'s position in the sequence, compensating for the fact that self-attention itself is permutation-invariant and has no inherent sense of order.' },
            { term: 'Residual (Skip) Connection', definition: 'A shortcut connection that adds a layer\'s input directly to its output (output = x + F(x)), giving gradients an unobstructed path back to earlier layers and mitigating vanishing gradients in very deep networks.' },
            { term: 'Softmax Function', definition: 'A function that converts a vector of real-valued scores into a probability distribution by exponentiating each value and dividing by the sum of all exponentials, ensuring outputs are non-negative and sum to one.' }
          ],
          commonMisconceptions: [
            'Misconception: Transformers require recurrent loops like RNNs to process text sequences. Reality: Transformers process all tokens in parallel using self-attention plus positional encodings to represent order, which is exactly what makes them far more parallelizable and faster to train than RNNs.',
            'Misconception: Adding more layers to a neural network always improves accuracy. Reality: Beyond a certain depth, plain networks without normalization or residual connections suffer from vanishing/exploding gradients and can degrade in both training and test accuracy; depth only helps when paired with techniques (residual connections, normalization, careful initialization) that keep gradients well-behaved.',
            'Misconception: Backpropagation computes each weight\'s gradient independently of the others. Reality: Backpropagation reuses shared intermediate derivatives (via the chain rule) across many weights in a single backward pass — that reuse is precisely what makes it efficient (roughly linear in the number of graph edges) compared to computing each gradient from scratch with finite differences.',
            'Misconception: Self-attention scales the same way with sequence length as recurrent processing does. Reality: Self-attention computes a full N x N score matrix, so its time and memory cost grow quadratically with sequence length N, whereas a plain RNN\'s cost grows linearly — this quadratic cost is a major reason long-context Transformers need specialized attention variants.',
            'Misconception: The softmax and cross-entropy gradients must be derived and applied as two separate, chained steps during backpropagation. Reality: When softmax feeds directly into cross-entropy loss, the two gradients combine algebraically into the simple expression (predicted probabilities - true one-hot labels), which is both what is actually implemented in practice and numerically more stable than chaining the two derivatives separately.'
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
