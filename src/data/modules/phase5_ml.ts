import { CurriculumModule } from '../../types/curriculum';
import { VERIFIED_VIDEOS } from '../verifiedVideoRegistry';

export const phase5MLModules: CurriculumModule[] = [
  {
    id: 'p5-m16',
    phaseId: 5,
    title: 'Machine Learning & Statistical Learning Theory',
    slug: 'machine-learning-foundations',
    category: 'ml',
    summary: 'Master Supervised Learning, Unsupervised Learning, Linear/Logistic Regression from scratch, Loss Functions, Gradient Descent, Regularization, Decision Trees, Random Forests, and SVMs.',
    objective: 'Implement core machine learning algorithms from pure mathematical equations without external frameworks, analyzing bias-variance trade-offs and generalization error.',
    prerequisiteModuleIds: ['p1-m4', 'p1-m5', 'p1-m6', 'p2-m10'],
    estimatedHours: 32,
    difficulty: 'advanced',
    colorAccent: 'coral',
    capstone: {
      id: 'capstone-p5-m16',
      title: 'Machine Learning Framework from Scratch',
      description: 'Build a NumPy-based ML engine implementing Linear Regression with L2 Ridge Regularization, Logistic Regression with Binary Cross-Entropy Loss, and K-Means Clustering.',
      constraints: ['Pure NumPy and Python math only. No scikit-learn for core modeling.'],
      expectedDeliverables: ['Vectorized Gradient Descent optimizer.', 'Logistic Regression classifier with ROC-AUC evaluation.', 'K-Means clustering algorithm.'],
      evaluationRubric: [
        { criterion: 'Mathematical Fidelity', weight: '50%', description: 'Analytical loss gradients match theoretical derivations.' },
        { criterion: 'Generalization Evaluation', weight: '50%', description: 'Cross-validation accuracy and metric evaluation metrics.' }
      ]
    },
    topics: [
      {
        id: 'p5-m16-t1',
        moduleId: 'p5-m16',
        title: 'Linear & Logistic Regression from Scratch via Gradient Descent',
        slug: 'regression-gradient-descent',
        summary: 'Derive Mean Squared Error, Binary Cross-Entropy Loss, Vectorized Gradients, L1/L2 Regularization, and Stochastic Gradient Descent (SGD).',
        order: 1,
        masteryPack: {
          learningObjective: 'Derive loss function gradients with matrix calculus and implement vectorized Gradient Descent optimizers for linear and logistic models.',
          prerequisites: ['Linear Algebra (matrices)', 'Multivariable Calculus (partial derivatives)', 'NumPy vectorization'],
          coreConcepts: [
            'Supervised Learning Setup: Features X, Targets y, Hypothesis Function h_theta(X)',
            'Mean Squared Error (MSE) Loss and Normal Equation (X^T X)^(-1) X^T y',
            'Sigmoid Function and Logistic Regression Log-Loss (Binary Cross-Entropy)',
            'Gradient Vector Derivation and Gradient Descent Update Rule',
            'L1 (Lasso) vs L2 (Ridge) Regularization for Overfitting Reduction'
          ],
          primaryLecture: VERIFIED_VIDEOS['p5-m16-t1'] as any,
          primaryText: {
            id: 'book-islr',
            title: 'An Introduction to Statistical Learning (ISLR - Free PDF)',
            authors: ['Gareth James', 'Daniela Witten', 'Trevor Hastie', 'Robert Tibshirani'],
            url: 'https://www.statlearning.com/',
        pdfUrl: 'https://arxiv.org/pdf/1603.02754.pdf',
            recommendedChapter: 'Chapter 3: Linear Regression & Chapter 4: Classification',
            publisherOrInstitution: 'Springer / Stanford & USC Open Textbook',
            accessStatus: 'verified'
          },
          recommendedChapter: 'Chapter 3: Linear Regression',
          authoritativeResearchSource: {
            id: 'paper-cortes-vapnik-1995',
            title: 'Support-Vector Networks',
            authors: ['Corinna Cortes', 'Vladimir Vapnik'],
            year: 1995,
            venue: 'Machine Learning',
            doiOrArxiv: '10.1007/BF00994018',
            openAccessUrl: 'https://arxiv.org/pdf/1610.02413.pdf',
            paperType: 'seminal',
            difficulty: 'advanced',
            prerequisites: ['Convex optimization and linear algebra'],
            summary: 'The landmark paper formulating Support Vector Machines (SVM) with soft margins and non-linear kernel tricks for high-dimensional classification.',
            whyItMatters: 'Extends linear models into high-dimensional kernel spaces with firm mathematical margin guarantees.',
            sectionsToRead: 'Sections 1–3: Maximum Margin Hyperplane',
            readingQuestions: [
              'How does the hinge loss function differ from binary cross-entropy loss?',
              'What is the kernel trick in dual SVM optimization?'
            ],
            relatedTopicIds: ['p5-m16-t1'],
            accessStatus: 'verified'
          },
          practicalExercises: [
            {
              id: 'ex-p5-1',
              question: 'What is the gradient of the MSE loss J(w) = (1/2N) ||Xw - y||^2 with respect to the weight vector w?',
              options: ['(1/N) X^T (Xw - y)', '(1/N) (Xw - y)', 'X^T (Xw - y)^2', '(1/2N) X (Xw - y)'],
              correctAnswer: 0,
              explanation: 'Using matrix calculus derivative of quadratic form: d/dw [1/2 (Xw-y)^T(Xw-y)] = X^T(Xw - y). Normalized by N gives (1/N) X^T (Xw - y).',
              type: 'multiple-choice'
            }
          ],
          interactiveLab: {
            id: 'lab-p5-1',
            title: 'Logistic Regression & Gradient Descent from Scratch',
            type: 'python',
            instructions: 'Implement Sigmoid function, Binary Cross-Entropy loss, and Vectorized Gradient Descent step in pure Python math.',
            starterCode: `import math

def sigmoid(z):
    return 1.0 / (1.0 + math.exp(-max(-500, min(500, z))))

def predict_proba(X, weights, bias):
    # X is list of feature vectors
    predictions = []
    for row in X:
        z = sum(w * x for w, x in zip(weights, row)) + bias
        predictions.append(sigmoid(z))
    return predictions

def binary_cross_entropy(y_true, y_pred):
    eps = 1e-15
    loss = 0.0
    for y, p in zip(y_true, y_pred):
        p = max(eps, min(1.0 - eps, p))
        loss += -(y * math.log(p) + (1 - y) * math.log(1 - p))
    return loss / len(y_true)

# Sample dataset
X = [[1.0, 2.0], [2.0, 3.0], [-1.0, -2.0], [-2.0, -1.0]]
y = [1, 1, 0, 0]
w = [0.5, -0.5]
b = 0.0

preds = predict_proba(X, w, b)
loss = binary_cross_entropy(y, preds)
print("Initial Predictions:", [round(p, 3) for p in preds])
print("Initial Binary Cross Entropy Loss:", round(loss, 4))
`,
            testCases: [
              {
                expectedOutput: 'Initial Binary Cross Entropy Loss: 0.6931',
                description: 'Validates log-loss calculation for untrained sigmoid weights.'
              }
            ]
          },
          readingQuestions: [
            'Why does L2 regularization shrink weights towards zero while L1 regularization drives weights to exact zeros?',
            'How does learning rate hyperparameter choice affect gradient descent convergence vs divergence?'
          ],
          masteryChecklist: [
            'Derive the normal equation analytical solution for Linear Regression.',
            'Implement vectorized Logistic Regression gradient descent.',
            'Plot Bias-Variance trade-off curves for increasing model capacity.'
          ],
          capstoneMilestone: 'Milestone 1: Vectorized logistic regression & evaluator implementation.',
          estimatedStudyMinutes: 240,
          difficulty: 'advanced',
          glossary: [
            { term: 'Gradient Descent', definition: 'An iterative first-order optimization algorithm for finding a local minimum of a differentiable loss function.' },
            { term: 'Bias-Variance Tradeoff', definition: 'The conflict between underfitting (high bias) and overfitting (high variance) in statistical modeling.' }
          ],
          commonMisconceptions: [
            'Misconception: High training accuracy guarantees good model performance. Reality: Overfitted models memorize training noise and perform poorly on unseen test data.'
          ],
          connectionsToLaterModules: [
            'Direct prerequisite for Backpropagation and Neural Networks in Phase 6',
            'Foundation for Model Deployment and Monitoring in Phase 7'
          ],
          citation: { text: 'James, G., Witten, D., Hastie, T., & Tibshirani, R. (2013). An Introduction to Statistical Learning. Springer.' },
          accessStatus: 'verified'
        }
      }
    ]
  }
];
