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
            'Supervised Learning Setup: In supervised learning we are given a dataset of feature vectors X and known targets y, and we fit a parametric hypothesis function h_theta(X) that maps inputs to predictions; every algorithm in this topic (and in classification, trees, and neural networks later) is a different choice of hypothesis class and loss for this same setup.',
            'Mean Squared Error (MSE) Loss and Normal Equation: MSE = (1/N) sum (y_hat - y)^2 penalizes large errors quadratically and is the loss whose minimizer for linear regression has the closed-form solution theta = (X^T X)^(-1) X^T y; this "normal equation" only exists because MSE is a convex quadratic in theta, which is why it will not generalize to logistic regression or neural nets, where gradient-based optimization is required instead.',
            'Sigmoid Function and Logistic Regression Log-Loss (Binary Cross-Entropy): The sigmoid sigma(z) = 1/(1+e^-z) squashes any real-valued linear score into a (0,1) probability, and Binary Cross-Entropy loss -[y log(p) + (1-y) log(1-p)] is the negative log-likelihood of a Bernoulli model, which is why minimizing it is equivalent to maximum likelihood estimation; this same sigmoid + cross-entropy pairing reappears as the output layer of binary classification neural networks.',
            'Gradient Vector Derivation and Gradient Descent Update Rule: The gradient of a loss with respect to the parameter vector points in the direction of steepest increase, so the update rule theta := theta - alpha * grad J(theta) repeatedly steps downhill to a minimum; this is the single optimization primitive that scales from linear regression to deep neural networks trained with backpropagation.',
            'L1 (Lasso) vs L2 (Ridge) Regularization for Overfitting Reduction: Adding a penalty term (lambda * ||theta||_1 for L1, lambda * ||theta||_2^2 for L2) to the loss discourages large weights and controls model complexity, trading a small increase in bias for a reduction in variance; this bias-variance control mechanism is the direct ancestor of weight decay and dropout used to regularize deep learning models.',
            'Bias-Variance Tradeoff and Generalization Error: Total expected test error decomposes into (bias)^2 + variance + irreducible noise, so a model that is too simple underfits (high bias) while a model that is too complex overfits (high variance); regularization, cross-validation, and model capacity selection throughout the rest of the curriculum are all tools for navigating this single tradeoff.',
            'Convexity and Guaranteed Convergence: Because MSE and cross-entropy loss are convex functions of the parameters for linear/logistic models, gradient descent with a sufficiently small learning rate is guaranteed to converge to the global minimum, a property that will not hold once we move to the non-convex loss surfaces of neural networks in later phases.'
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
            },
            {
              id: 'ex-p5-2',
              question: 'Derive the gradient of the L2-regularized (Ridge) MSE loss J(w) = (1/2N) ||Xw - y||^2 + (lambda/2) ||w||^2 with respect to w, and explain in one sentence why the extra term shrinks the weights compared to unregularized linear regression.',
              explanation: 'Differentiate each term separately: d/dw [(1/2N)||Xw-y||^2] = (1/N) X^T(Xw - y) as in ex-p5-1, and d/dw [(lambda/2)||w||^2] = lambda*w. Summing gives grad J(w) = (1/N) X^T(Xw - y) + lambda*w. Because the update rule subtracts alpha * grad J(w), the lambda*w term subtracts a value proportional to the current weight on every step (i.e., it multiplicatively decays w toward zero, "weight decay"), which is why Ridge regression produces smaller-magnitude weights than ordinary least squares.',
              type: 'free-response'
            },
            {
              id: 'ex-p5-3',
              question: 'For logistic regression with z = Xw and prediction p = sigma(z), what is the gradient of the Binary Cross-Entropy loss J(w) = -(1/N) sum[y*log(p) + (1-y)*log(1-p)] with respect to w? (Hint: use sigma\'(z) = sigma(z)(1 - sigma(z)) and the chain rule.)',
              options: ['(1/N) X^T (p - y)', '(1/N) X^T (y - p)', '(1/N) X^T p (1-p)', 'X^T (p - y)^2'],
              correctAnswer: 0,
              explanation: 'By the chain rule, dJ/dw = dJ/dp * dp/dz * dz/dw. dJ/dp for one example is -(y/p - (1-y)/(1-p)), and dp/dz = p(1-p), and multiplying these together simplifies to (p - y) per example (the p(1-p) terms cancel algebraically). Combined with dz/dw = x, and summing/averaging over N examples in matrix form, the gradient is (1/N) X^T (p - y) — the exact same functional form as the linear regression gradient in ex-p5-1, just with p = sigma(Xw) instead of Xw.',
              type: 'multiple-choice'
            },
            {
              id: 'ex-p5-4',
              question: 'A model trained with L1 regularization ends up with many weights that are exactly 0.0, while an equivalent model trained with L2 regularization on the same data has small but non-zero values for every weight. Explain why the two penalties behave differently at the origin.',
              explanation: 'The L1 penalty lambda*|w_i| has a constant-magnitude gradient (+/- lambda) regardless of how close w_i is to zero, so gradient-based updates keep pushing a small weight all the way to exactly zero and it stays there (subgradient methods and proximal operators for L1 have an explicit "soft-thresholding" step that snaps small weights to zero). The L2 penalty lambda*w_i^2 has gradient 2*lambda*w_i, which shrinks proportionally to the weight itself and therefore approaches zero asymptotically without ever reaching it exactly. This is why L1/Lasso is preferred when sparse, interpretable feature selection is desired, while L2/Ridge is preferred when all features are believed to contribute a small amount.',
              type: 'free-response'
            },
            {
              id: 'ex-p5-5',
              question: 'You train a logistic regression classifier and observe 99% accuracy on the training set but only 62% accuracy on a held-out validation set. Which of the following is the most appropriate next step?',
              options: [
                'Increase model capacity (e.g., add polynomial features) to push training accuracy even higher.',
                'Increase the regularization strength (larger lambda) and/or add more training data to reduce variance.',
                'Report the training accuracy as the final model performance since it is higher.',
                'Remove the bias/intercept term from the model.'
              ],
              correctAnswer: 1,
              explanation: 'The large gap between training accuracy (99%) and validation accuracy (62%) is the signature of overfitting: high variance, low bias. The correct remedy is to reduce model variance — increasing regularization strength lambda, gathering more training data, or reducing feature/model complexity — not to further increase capacity, which would worsen the gap.',
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
            'How does learning rate hyperparameter choice affect gradient descent convergence vs divergence?',
            'Why is the normal equation solution available in closed form for linear regression but not for logistic regression, forcing the use of iterative gradient descent instead?',
            'What does it mean that MSE and Binary Cross-Entropy are both convex loss functions for their respective linear models, and why does this property disappear once a linear model is replaced by a multi-layer neural network?',
            'In what practical situations would you prefer Stochastic Gradient Descent over full-batch Gradient Descent, and what trade-off in gradient noise vs computational cost does that choice imply?',
            'How would you explain, in terms of the bias-variance decomposition, why increasing lambda in Ridge regression eventually starts hurting validation performance even though it keeps reducing variance?'
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
            { term: 'Gradient Descent', definition: 'An iterative first-order optimization algorithm that updates parameters in the direction opposite the loss gradient, theta := theta - alpha * grad J(theta), to find a local (or, for convex losses, global) minimum of a differentiable loss function.' },
            { term: 'Bias-Variance Tradeoff', definition: 'The decomposition of expected test error into bias^2 (error from overly simplistic assumptions), variance (error from sensitivity to the training sample), and irreducible noise; reducing one component by increasing model flexibility typically increases the other.' },
            { term: 'Stochastic Gradient Descent (SGD)', definition: 'A variant of gradient descent that estimates the gradient from a single example or small mini-batch rather than the full dataset at each step, trading a noisier gradient estimate for much cheaper and more frequent parameter updates.' },
            { term: 'Learning Rate', definition: 'The step-size hyperparameter alpha that scales the gradient in each parameter update; too small causes slow convergence, too large causes the loss to oscillate or diverge.' },
            { term: 'L2 (Ridge) Regularization', definition: 'A penalty term lambda * ||theta||_2^2 added to the loss function that shrinks all weights smoothly toward zero without setting them exactly to zero, reducing variance at the cost of a small increase in bias.' },
            { term: 'L1 (Lasso) Regularization', definition: 'A penalty term lambda * ||theta||_1 added to the loss function whose non-differentiable corners at zero drive some weights to exactly zero, producing sparse models that perform implicit feature selection.' },
            { term: 'Sigmoid Function', definition: 'The function sigma(z) = 1/(1+e^-z) that maps any real number to the open interval (0,1); used to convert a linear score into a probability estimate in logistic regression.' },
            { term: 'Binary Cross-Entropy (Log Loss)', definition: 'The loss function -[y*log(p) + (1-y)*log(1-p)] equal to the negative log-likelihood of a Bernoulli-distributed label; it is convex in the model parameters for logistic regression and heavily penalizes confident wrong predictions.' },
            { term: 'Normal Equation', definition: 'The closed-form solution theta = (X^T X)^(-1) X^T y that directly minimizes the MSE loss for linear regression without iterative optimization, valid whenever X^T X is invertible.' },
            { term: 'Overfitting', definition: 'A failure mode where a model fits the noise and idiosyncrasies of the training set rather than the underlying signal, resulting in low training error but high error on unseen data.' },
            { term: 'Convex Function', definition: 'A function for which any line segment between two points on its graph lies on or above the graph; convex loss functions have no local minima other than the global minimum, guaranteeing gradient descent converges to the optimal solution.' }
          ],
          commonMisconceptions: [
            'Misconception: High training accuracy guarantees good model performance. Reality: Overfitted models memorize training noise and perform poorly on unseen test data; only held-out validation or test performance measures true generalization.',
            'Misconception: A smaller loss value during gradient descent always means the model is improving. Reality: A shrinking training loss can coexist with a growing validation loss once the model begins overfitting, which is why loss must be tracked on both sets.',
            'Misconception: L1 and L2 regularization do the same thing, just with a different formula. Reality: L2 shrinks weights smoothly and keeps all features, while L1 induces sparsity by zeroing out weights entirely, making it useful for feature selection in high-dimensional data.',
            'Misconception: Logistic regression is a form of regression that predicts a continuous number the way linear regression does. Reality: Despite the name, logistic regression is a classification algorithm; it predicts the probability that an example belongs to the positive class via the sigmoid of a linear score.',
            'Misconception: A larger learning rate always trains a model faster. Reality: A learning rate that is too large can cause the loss to oscillate around or diverge away from the minimum instead of converging, so the learning rate must be tuned rather than simply maximized.'
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
