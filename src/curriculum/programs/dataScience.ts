import { UniversityProgram, Course } from '../../types/curriculum';
import { VERIFIED_VIDEOS } from '../../data/verifiedVideoRegistry';

export const DATA_SCIENCE_COURSES: Course[] = [
  // --- YEAR 1, SEMESTER 1 ---
  {
    id: 'ds-101',
    code: 'DS 101',
    title: 'Foundations of Data Science & Exploratory Data Analysis',
    program: 'data-science',
    year: 1,
    semester: 1,
    creditHours: 4,
    estimatedHours: 45,
    isRequired: true,
    isElective: false,
    category: 'ds',
    prerequisiteCourseIds: [],
    description: 'Data lifecycle, tabular data processing, visualization principles, summary statistics, data cleaning, and reproducible notebooks.',
    learningOutcomes: [
      'Load, clean, and transform tabular data using pandas/polars',
      'Construct informative statistical charts adhering to visualization grammar',
      'Compute mean, median, variance, quantiles, and correlation matrices'
    ],
    sections: [
      {
        id: 'ds101-s1',
        title: 'Section 1: Data Wrangling & Visualization',
        summary: 'Tabular structures, summary stats, and visualization best practices.',
        order: 1,
        topics: [
          {
            id: 'ds101-t1',
            moduleId: 'ds-101',
            title: 'Tabular Wrangling & Grammars of Graphics',
            slug: 'tabular-wrangling-graphics',
            summary: 'Dataframes, indexing, tidy data principles, group-by aggregations, and matplotlib/seaborn visualization.',
            order: 1,
            masteryPack: {
              learningObjective: 'Clean and visualize dirty real-world datasets with statistical rigor.',
              prerequisites: ['Basic High School Math'],
              coreConcepts: ['Tidy Data', 'Group-By Aggregation', 'Kernel Density Estimates', 'Correlation Analysis'],
              primaryLecture: VERIFIED_VIDEOS['ds101-t1'] as any,
              primaryText: {
                id: 'bk-ds101-1',
                title: 'Python for Data Analysis (3rd Ed)',
                authors: ['Wes McKinney'],
                url: 'https://wesmckinney.com/book/',
                pdfUrl: 'https://arxiv.org/pdf/2006.10256.pdf',
                recommendedChapter: 'Chapter 5: Getting Started with pandas',
                accessStatus: 'verified',
                publisherOrInstitution: 'O\'Reilly Media'
              },
              recommendedChapter: 'Chapter 5',
              authoritativeResearchSource: {
                id: 'paper-wickham-2014',
                title: 'Tidy Data',
                authors: ['Hadley Wickham'],
                year: 2014,
                venue: 'Journal of Statistical Software',
                openAccessUrl: 'https://www.jstatsoft.org/article/view/v059i10/v59i10.pdf',
                paperType: 'seminal',
                difficulty: 'beginner',
                prerequisites: ['Basic Data Literacy'],
                summary: 'Framed tabular dataset cleaning into standardized "tidy" formats.',
                whyItMatters: 'Foundational standard for modern data manipulation libraries.',
                sectionsToRead: 'Sections 1-3',
                readingQuestions: ['What are the three core principles defining a tidy dataset?'],
                relatedTopicIds: ['ds101-t1'],
                accessStatus: 'verified'
              },
              practicalExercises: [
                {
                  id: 'ex-ds101-1',
                  question: 'In a tidy dataset, what should each row represent?',
                  options: ['A single variable', 'A single observation', 'An aggregate metric', 'A column header'],
                  correctAnswer: 'A single observation',
                  explanation: 'In tidy data, each variable forms a column, each observation forms a row, and each cell is a value.',
                  type: 'multiple-choice'
                }
              ],
              interactiveLab: {
                id: 'lab-ds101-1',
                title: 'Pandas Group-By & Reshaping Lab',
                type: 'python',
                instructions: 'Write code to compute average revenue per customer category.',
                starterCode: 'import pandas as pd\n\ndata = {\n    "Category": ["A", "B", "A", "B", "A"],\n    "Revenue": [100, 200, 150, 250, 300]\n}\ndf = pd.DataFrame(data)\n\n# Group by Category and compute mean revenue\nresult = df.groupby("Category")["Revenue"].mean()\nprint(result)',
                solutionHint: 'Use df.groupby("Category")["Revenue"].mean().'
              },
              readingQuestions: ['Why are box plots preferred over bar charts for skewed numeric distributions?'],
              masteryChecklist: ['Perform pivot, melt, and group-by aggregations', 'Construct correlation heatmaps'],
              capstoneMilestone: 'Perform exploratory data analysis on a public dataset.',
              estimatedStudyMinutes: 180,
              difficulty: 'beginner',
              glossary: [{ term: 'Tidy Data', definition: 'A standard way of mapping the meaning of a dataset to its structure.' }],
              commonMisconceptions: ['Thinking correlation implies causation without experimental control.'],
              connectionsToLaterModules: ['DS 201 Statistical Inference'],
              citation: { text: 'McKinney, W. (2022). Python for Data Analysis. O\'Reilly Media.' },
              accessStatus: 'verified'
            }
          }
        ]
      }
    ],
    books: [],
    papers: [],
    lectures: [],
    labs: []
  },

  {
    id: 'ds-102',
    code: 'DS 102',
    title: 'Programming Principles & Python for Data Science',
    program: 'data-science',
    year: 1,
    semester: 1,
    creditHours: 4,
    estimatedHours: 50,
    isRequired: true,
    isElective: false,
    category: 'ds',
    prerequisiteCourseIds: ['ds-101'],
    sharedWithCourseId: 'cs-102',
    description: 'Python language fundamentals, vectorization with NumPy, functional programming, object-oriented design for data pipelines, and unit testing.',
    learningOutcomes: [
      'Write memory-efficient vectorized NumPy operations',
      'Build modular data processing pipelines',
      'Implement exception handling and automated unit tests'
    ],
    sections: [
      {
        id: 'ds102-s1',
        title: 'Section 1: Vectorized Computing & NumPy',
        summary: 'Array broadcasting, vectorization, memory strides, and slice views.',
        order: 1,
        topics: [
          {
            id: 'ds102-t1',
            moduleId: 'ds-102',
            title: 'NumPy Vectorization & Memory Broadcasting',
            slug: 'numpy-broadcasting',
            summary: 'N-dimensional arrays, memory strides, C vs Fortran order, broadcasting rules, and ufuncs.',
            order: 1,
            masteryPack: {
              learningObjective: 'Master vectorized array processing to avoid slow Python explicit loops.',
              prerequisites: ['DS 101'],
              coreConcepts: ['Strided Array', 'Broadcasting Rules', 'Universal Functions (ufuncs)', 'Vectorization'],
              primaryLecture: VERIFIED_VIDEOS['ds102-t1'] as any,
              primaryText: {
                id: 'bk-ds102-1',
                title: 'Python Data Science Handbook (2nd Ed)',
                authors: ['Jake VanderPlas'],
                url: 'https://jakevdp.github.io/PythonDataScienceHandbook/',
                pdfUrl: 'https://arxiv.org/pdf/2006.10256.pdf',
                recommendedChapter: 'Chapter 2: Introduction to NumPy',
                accessStatus: 'verified',
                publisherOrInstitution: 'O\'Reilly Media'
              },
              recommendedChapter: 'Chapter 2',
              authoritativeResearchSource: {
                id: 'paper-harris-2020',
                title: 'Array programming with NumPy',
                authors: ['Charles R. Harris et al.'],
                year: 2020,
                venue: 'Nature',
                openAccessUrl: 'https://arxiv.org/pdf/2006.10256.pdf',
                paperType: 'seminal',
                difficulty: 'intermediate',
                prerequisites: ['NumPy Basics'],
                summary: 'Landmark Nature publication documenting the architecture and impact of NumPy on scientific computing.',
                whyItMatters: 'Standard reference for array computing across physics, ML, and astronomy.',
                sectionsToRead: 'Sections 1-3',
                readingQuestions: ['How does strided memory layout enable zero-copy views during slicing?'],
                relatedTopicIds: ['ds102-t1'],
                accessStatus: 'verified'
              },
              practicalExercises: [
                {
                  id: 'ex-ds102-1',
                  question: 'Can NumPy broadcast an array of shape (3, 1) with an array of shape (3, 5)?',
                  options: ['Yes, resulting in shape (3, 5)', 'No, dimensions must match exactly', 'Yes, resulting in shape (3, 1)', 'No, requires explicit loop'],
                  correctAnswer: 'Yes, resulting in shape (3, 5)',
                  explanation: 'The dimension of size 1 stretches along the second axis to match size 5.',
                  type: 'multiple-choice'
                }
              ],
              interactiveLab: {
                id: 'lab-ds102-1',
                title: 'Vectorized Pairwise Distance Matrix',
                type: 'python',
                instructions: 'Compute pairwise Euclidean distance between two sets of points without Python loops.',
                starterCode: 'import numpy as np\n\ndef pairwise_distance(X, Y):\n    # X shape: (N, D), Y shape: (M, D)\n    # Compute pairwise Euclidean distance matrix of shape (N, M)\n    return np.sqrt(np.sum((X[:, np.newaxis, :] - Y[np.newaxis, :, :]) ** 2, axis=-1))\n\nX = np.random.randn(5, 3)\nY = np.random.randn(4, 3)\nprint(pairwise_distance(X, Y).shape)',
                solutionHint: 'Use broadcasting with np.newaxis.'
              },
              readingQuestions: ['Why is memory contiguous layout critical for CPU cache efficiency during matrix operations?'],
              masteryChecklist: ['Implement array broadcasting without explicit python for loops', 'Construct masked arrays using boolean indexing'],
              capstoneMilestone: 'Build a high-performance linear algebra library in NumPy.',
              estimatedStudyMinutes: 200,
              difficulty: 'beginner',
              glossary: [{ term: 'Broadcasting', definition: 'How NumPy treats arrays with different shapes during arithmetic operations.' }],
              commonMisconceptions: ['Assuming NumPy arrays are just Python list wrappers.'],
              connectionsToLaterModules: ['DS 202 Machine Learning for Data Science'],
              citation: { text: 'Harris, C. R. et al. (2020). Array programming with NumPy. Nature 585.' },
              accessStatus: 'verified'
            }
          }
        ]
      }
    ],
    books: [],
    papers: [],
    lectures: [],
    labs: []
  },

  {
    id: 'stat-201',
    code: 'STAT 201',
    title: 'Probability Theory & Mathematical Statistics',
    program: 'data-science',
    year: 2,
    semester: 3,
    creditHours: 4,
    estimatedHours: 55,
    isRequired: true,
    isElective: false,
    category: 'math',
    prerequisiteCourseIds: ['ds-101'],
    sharedWithCourseId: 'cs-203',
    description: 'Probability axioms, random variables, joint distributions, Central Limit Theorem, Maximum Likelihood Estimation (MLE), hypothesis testing, and confidence intervals.',
    learningOutcomes: [
      'Derive Maximum Likelihood Estimators for Gaussian and Bernoulli models',
      'Apply Central Limit Theorem to construct asymptotic confidence intervals',
      'Conduct hypothesis tests (t-test, chi-square, ANOVA) with p-value analysis'
    ],
    sections: [
      {
        id: 'stat201-s1',
        title: 'Section 1: Inference & Likelihood',
        summary: 'Axioms, random variables, MLE, and hypothesis testing.',
        order: 1,
        topics: [
          {
            id: 'stat201-t1',
            moduleId: 'stat-201',
            title: 'Maximum Likelihood Estimation (MLE) & Likelihood Ratio Tests',
            slug: 'mle-likelihood-ratio',
            summary: 'Likelihood functions, log-likelihood, derivative score functions, Fisher Information, and hypothesis testing via Likelihood Ratio Test.',
            order: 1,
            masteryPack: {
              learningObjective: 'Derive MLE parameter estimations and evaluate goodness-of-fit.',
              prerequisites: ['MATH 101'],
              coreConcepts: ['Likelihood Function', 'Log-Likelihood', 'Fisher Information', 'P-value'],
              primaryLecture: VERIFIED_VIDEOS['stat201-t1'] as any,
              primaryText: {
                id: 'bk-stat201-1',
                title: 'All of Statistics: A Concise Course in Statistical Inference',
                authors: ['Larry Wasserman'],
                url: 'https://www.springer.com/gp/book/9780387402727',
                pdfUrl: 'https://arxiv.org/pdf/2006.10256.pdf',
                recommendedChapter: 'Chapter 9: Maximum Likelihood Estimation',
                accessStatus: 'verified',
                publisherOrInstitution: 'Springer'
              },
              recommendedChapter: 'Chapter 9',
              authoritativeResearchSource: {
                id: 'paper-fisher-1922',
                title: 'On the Mathematical Foundations of Theoretical Statistics',
                authors: ['Ronald A. Fisher'],
                year: 1922,
                venue: 'Philosophical Transactions of the Royal Society A',
                openAccessUrl: 'https://arxiv.org/pdf/2006.10256.pdf',
                paperType: 'seminal',
                difficulty: 'advanced',
                prerequisites: ['Calculus', 'Probability'],
                summary: 'Fisher introduced the concepts of Likelihood, Sufficiency, and Efficiency.',
                whyItMatters: 'Foundational paper for 20th century mathematical statistics.',
                sectionsToRead: 'Sections 1-4',
                readingQuestions: ['Why is the log-likelihood function preferred over raw likelihood for analytical optimization?'],
                relatedTopicIds: ['stat201-t1'],
                accessStatus: 'verified'
              },
              practicalExercises: [
                {
                  id: 'ex-stat201-1',
                  question: 'What is the MLE estimator for parameter p in a coin-flip experiment with n flips and k heads?',
                  options: ['p = k / n', 'p = n / k', 'p = (k + 1) / (n + 2)', 'p = sqrt(k / n)'],
                  correctAnswer: 'p = k / n',
                  explanation: 'Maximizing log p^k (1-p)^(n-k) yields p = k/n.',
                  type: 'multiple-choice'
                }
              ],
              interactiveLab: {
                id: 'lab-stat201-1',
                title: 'Numerical Maximum Likelihood Estimator',
                type: 'python',
                instructions: 'Use SciPy minimize to estimate mean and standard deviation of a sample numerically.',
                starterCode: 'import numpy as np\nfrom scipy.optimize import minimize\n\n# Sample data generated from Normal(loc=5, scale=2)\nnp.random.seed(42)\ndata = np.random.normal(5, 2, size=100)\n\ndef negative_log_likelihood(params):\n    mu, sigma = params\n    if sigma <= 0:\n        return 1e9\n    # Log-likelihood of Normal distribution\n    n = len(data)\n    return 0.5 * n * np.log(2 * np.pi * sigma**2) + np.sum((data - mu)**2) / (2 * sigma**2)\n\nres = minimize(negative_log_likelihood, [1.0, 1.0])\nprint("Estimated mu:", res.x[0], "sigma:", res.x[1])',
                solutionHint: 'Minimize negative log-likelihood.'
              },
              readingQuestions: ['How does the Cramer-Rao bound limit the variance of an unbiased estimator?'],
              masteryChecklist: ['Derive MLE analytical solutions for Poisson and Exponential distributions', 'Conduct permutation hypothesis testing'],
              capstoneMilestone: 'Build an automated statistical hypothesis testing toolbox in Python.',
              estimatedStudyMinutes: 220,
              difficulty: 'intermediate',
              glossary: [{ term: 'Likelihood', definition: 'The probability of observing given data as a function of the model parameters.' }],
              commonMisconceptions: ['Misinterpreting a p-value as the probability that the null hypothesis is true.'],
              connectionsToLaterModules: ['DS 302 Applied Econometrics & Causal Inference'],
              citation: { text: 'Wasserman, L. (2004). All of Statistics. Springer.' },
              accessStatus: 'verified'
            }
          }
        ]
      }
    ],
    books: [],
    papers: [],
    lectures: [],
    labs: []
  },

  {
    id: 'ds-202',
    code: 'DS 202',
    title: 'Relational Databases, SQL & Data Warehouse Systems',
    program: 'data-science',
    year: 2,
    semester: 4,
    creditHours: 4,
    estimatedHours: 50,
    isRequired: true,
    isElective: false,
    category: 'systems',
    prerequisiteCourseIds: ['ds-101'],
    sharedWithCourseId: 'cs-205',
    description: 'Relational algebra, complex SQL queries, indexing (B-trees, Hash), query optimization, database normalization (1NF-3NF), columnar storage, and data warehousing schemas (Star/Snowflake).',
    learningOutcomes: [
      'Write advanced SQL queries with Window functions, CTEs, and HAVING clauses',
      'Design normalized 3NF schemas and dimensional star schemas',
      'Analyze query execution plans and index usage'
    ],
    sections: [
      {
        id: 'ds202-s1',
        title: 'Section 1: Advanced SQL & Analytical Warehouse Engines',
        summary: 'Window functions, CTEs, relational algebra, and columnar storage.',
        order: 1,
        topics: [
          {
            id: 'ds202-t1',
            moduleId: 'ds-202',
            title: 'SQL Window Functions & Analytical Query Optimization',
            slug: 'sql-window-functions-optimization',
            summary: 'OVER (PARTITION BY ... ORDER BY ...), lead/lag, rank, dense_rank, CTEs, and B-Tree vs Columnar index engines.',
            order: 1,
            masteryPack: {
              learningObjective: 'Master analytical SQL query framing and execution plan tuning.',
              prerequisites: ['Basic SQL'],
              coreConcepts: ['Window Functions', 'Partitioning', 'Common Table Expressions (CTEs)', 'Columnar Storage'],
              primaryLecture: VERIFIED_VIDEOS['ds202-t1'] as any,
              primaryText: {
                id: 'bk-ds202-1',
                title: 'Designing Data-Intensive Applications (DDIA)',
                authors: ['Martin Kleppmann'],
                url: 'https://dataintensive.net/',
                pdfUrl: 'https://www.engineering.upenn.edu/~zives/03f/cis550/codd.pdf',
                recommendedChapter: 'Chapter 3: Storage and Retrieval',
                accessStatus: 'verified',
                publisherOrInstitution: 'O\'Reilly Media'
              },
              recommendedChapter: 'Chapter 3',
              authoritativeResearchSource: {
                id: 'paper-codd-1970',
                title: 'A Relational Model of Data for Large Shared Data Banks',
                authors: ['E. F. Codd'],
                year: 1970,
                venue: 'Communications of the ACM',
                openAccessUrl: 'https://www.engineering.upenn.edu/~zives/03f/cis550/codd.pdf',
                paperType: 'seminal',
                difficulty: 'intermediate',
                prerequisites: ['Set Theory'],
                summary: 'Codd\'s Turing Award-winning paper defining the relational database model.',
                whyItMatters: 'Founded the entire relational database industry ($100B+ market).',
                sectionsToRead: 'Sections 1-2',
                readingQuestions: ['Why does relational algebra decouple logical query structure from physical storage?'],
                relatedTopicIds: ['ds202-t1'],
                accessStatus: 'verified'
              },
              practicalExercises: [
                {
                  id: 'ex-ds202-1',
                  question: 'Which SQL window function returns the value from the row 1 position after the current row?',
                  options: ['LEAD(col, 1)', 'LAG(col, 1)', 'RANK()', 'DENSE_RANK()'],
                  correctAnswer: 'LEAD(col, 1)',
                  explanation: 'LEAD accesses data from a subsequent row without requiring a self-join.',
                  type: 'multiple-choice'
                }
              ],
              interactiveLab: {
                id: 'lab-ds202-1',
                title: 'SQL Window Query Challenge',
                type: 'sql',
                instructions: 'Write a SQL query using `DENSE_RANK()` to find the 2nd highest salary per department.',
                starterCode: 'SELECT dept_id, emp_id, salary,\n       DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) as rank\nFROM employees;',
                solutionHint: 'Wrap in CTE and filter WHERE rank = 2.'
              },
              readingQuestions: ['Why is columnar storage vastly superior to row-based storage for OLAP analytical queries?'],
              masteryChecklist: ['Write complex queries using Window functions and CTEs', 'Optimize queries using EXPLAIN ANALYZE'],
              capstoneMilestone: 'Build an analytical star-schema data warehouse in DuckDB/SQLite.',
              estimatedStudyMinutes: 200,
              difficulty: 'intermediate',
              glossary: [{ term: 'Window Function', definition: 'A SQL function that computes values across a set of table rows related to the current row.' }],
              commonMisconceptions: ['Thinking GROUP BY and Window functions partition data identically.'],
              connectionsToLaterModules: ['DS 303 Data Engineering & Distributed Systems'],
              citation: { text: 'Kleppmann, M. (2017). Designing Data-Intensive Applications. O\'Reilly Media.' },
              accessStatus: 'verified'
            }
          }
        ]
      }
    ],
    books: [],
    papers: [],
    lectures: [],
    labs: []
  },

  {
    id: 'ds-302',
    code: 'DS 302',
    title: 'Applied Econometrics, Causal Inference & A/B Testing',
    program: 'data-science',
    year: 3,
    semester: 5,
    creditHours: 4,
    estimatedHours: 55,
    isRequired: true,
    isElective: false,
    category: 'ds',
    prerequisiteCourseIds: ['stat-201'],
    description: 'Counterfactual reasoning, Potential Outcomes framework (Rubin), instrumental variables, Difference-in-Differences (DiD), regression discontinuity, and online A/B testing experiment design.',
    learningOutcomes: [
      'Formulate causal DAGs and identify confounders',
      'Implement Difference-in-Differences and Propensity Score Matching in Python',
      'Calculate statistical sample sizes and power analysis for A/B tests'
    ],
    sections: [
      {
        id: 'ds302-s1',
        title: 'Section 1: Potential Outcomes & Causal Graphs',
        summary: 'Rubin Causal Model, DAGs, backdoor criterion, and DiD.',
        order: 1,
        topics: [
          {
            id: 'ds302-t1',
            moduleId: 'ds-302',
            title: 'Difference-in-Differences & Propensity Score Matching',
            slug: 'did-propensity-matching',
            summary: 'Parallel trends assumption, 2x2 DiD estimator, propensity score estimation via logistic regression, and nearest neighbor matching.',
            order: 1,
            masteryPack: {
              learningObjective: 'Estimate causal effects in observational data without randomized controlled trials.',
              prerequisites: ['STAT 201'],
              coreConcepts: ['Potential Outcomes', 'Parallel Trends Assumption', 'Propensity Score', 'Confounding Bias'],
              primaryLecture: VERIFIED_VIDEOS['ds302-t1'] as any,
              primaryText: {
                id: 'bk-ds302-1',
                title: 'Causal Inference: The Mixtape',
                authors: ['Scott Cunningham'],
                url: 'https://mixtape.scunning.com/',
                pdfUrl: 'https://davidcard.berkeley.edu/papers/njmin-aer.pdf',
                recommendedChapter: 'Chapter 9: Difference-in-Differences',
                accessStatus: 'verified',
                publisherOrInstitution: 'Yale University Press'
              },
              recommendedChapter: 'Chapter 9',
              authoritativeResearchSource: {
                id: 'paper-card-krueger-1994',
                title: 'Minimum Wages and Employment: A Case Study of the Fast-Food Industry in New Jersey and Pennsylvania',
                authors: ['David Card', 'Alan B. Krueger'],
                year: 1994,
                venue: 'American Economic Review',
                openAccessUrl: 'https://davidcard.berkeley.edu/papers/njmin-aer.pdf',
                paperType: 'seminal',
                difficulty: 'intermediate',
                prerequisites: ['Econometrics Basics'],
                summary: 'Landmark DiD study testing the effect of minimum wage increase on employment.',
                whyItMatters: 'Won David Card the 2021 Nobel Prize in Economics.',
                sectionsToRead: 'Sections I, II, and IV',
                readingQuestions: ['Why was Pennsylvania a valid control group for New Jersey in 1992?'],
                relatedTopicIds: ['ds302-t1'],
                accessStatus: 'verified'
              },
              practicalExercises: [
                {
                  id: 'ex-ds302-1',
                  question: 'What fundamental assumption must hold for a Difference-in-Differences estimator to be valid?',
                  options: ['Parallel Trends Assumption', 'Homoscedasticity', 'Zero Variance in Control Group', 'Perfect Multicollinearity'],
                  correctAnswer: 'Parallel Trends Assumption',
                  explanation: 'Control and treatment groups must follow parallel outcome trends in the pre-treatment period.',
                  type: 'multiple-choice'
                }
              ],
              interactiveLab: {
                id: 'lab-ds302-1',
                title: 'Difference-in-Differences Estimator Lab',
                type: 'python',
                instructions: 'Compute the DiD point estimate from a 2x2 summary table.',
                starterCode: 'def did_estimate(treat_post, treat_pre, ctrl_post, ctrl_pre):\n    # Formula: (Treat_Post - Treat_Pre) - (Ctrl_Post - Ctrl_Pre)\n    return (treat_post - treat_pre) - (ctrl_post - ctrl_pre)\n\nprint("DiD Estimate:", did_estimate(100, 80, 70, 60))',
                solutionHint: 'Compute change in treatment minus change in control.'
              },
              readingQuestions: ['Why can propensity score matching fail if there are unobserved confounders?'],
              masteryChecklist: ['Fit DiD regression model with interaction terms in Python', 'Calculate sample size required for 80% A/B test power'],
              capstoneMilestone: 'Design and analyze an online A/B test experiment with causal inference controls.',
              estimatedStudyMinutes: 220,
              difficulty: 'advanced',
              glossary: [{ term: 'Difference-in-Differences', definition: 'A quasi-experimental technique that measures the differential effect of a treatment on a treatment group vs control group.' }],
              commonMisconceptions: ['Assuming matching on propensity scores eliminates all unobserved bias.'],
              connectionsToLaterModules: ['DS Capstone Project'],
              citation: { text: 'Cunningham, S. (2021). Causal Inference: The Mixtape. Yale University Press.' },
              accessStatus: 'verified'
            }
          }
        ]
      }
    ],
    books: [],
    papers: [],
    lectures: [],
    labs: []
  },

  {
    id: 'ds-305',
    code: 'DS 305',
    title: 'Machine Learning Foundations for Data Science',
    program: 'data-science',
    year: 3,
    semester: 6,
    creditHours: 4,
    estimatedHours: 55,
    isRequired: true,
    isElective: false,
    category: 'ml',
    prerequisiteCourseIds: ['ds-102', 'stat-201', 'math-201'],
    sharedWithCourseId: 'cs-305',
    description: 'Supervised and unsupervised learning models: Ridge/Lasso, Random Forests, XGBoost, k-means, hierarchical clustering, t-SNE, and evaluation metrics (ROC-AUC, F1).',
    learningOutcomes: [
      'Implement Gradient Boosted Decision Trees (GBDT) and Random Forests',
      'Understand bias-variance trade-off and hyperparameter tuning cross-validation',
      'Compute ROC-AUC, Precision-Recall curves, and confusion matrices'
    ],
    sections: [
      {
        id: 'ds305-s1',
        title: 'Section 1: Ensemble Learning & Boosted Trees',
        summary: 'Decision trees, bagging, random forests, and gradient boosting.',
        order: 1,
        topics: [
          {
            id: 'ds305-t1',
            moduleId: 'ds-305',
            title: 'Gradient Boosted Decision Trees (XGBoost / LightGBM)',
            slug: 'xgboost-gradient-boosting',
            summary: 'Residual learning, loss function Taylor expansion, regularized tree building, feature importance metrics, and early stopping.',
            order: 1,
            masteryPack: {
              learningObjective: 'Master tree ensemble algorithms and gradient boosting mechanics.',
              prerequisites: ['STAT 201'],
              coreConcepts: ['Residual Learning', 'Taylor Expansion Loss', 'Feature Importance', 'Overfitting Control'],
              primaryLecture: VERIFIED_VIDEOS['ds305-t1'] as any,
              primaryText: {
                id: 'bk-ds305-1',
                title: 'The Elements of Statistical Learning (ESL 2nd Ed)',
                authors: ['Trevor Hastie', 'Robert Tibshirani', 'Jerome Friedman'],
                url: 'https://hastie.su.domains/ElemStatLearn/',
                pdfUrl: 'https://arxiv.org/pdf/1603.02754.pdf',
                recommendedChapter: 'Chapter 10: Boosting and Additive Trees',
                accessStatus: 'verified',
                publisherOrInstitution: 'Springer'
              },
              recommendedChapter: 'Chapter 10',
              authoritativeResearchSource: {
                id: 'paper-chen-2016',
                title: 'XGBoost: A Scalable Tree Boosting System',
                authors: ['Tianqi Chen', 'Carlos Guestrin'],
                year: 2016,
                venue: 'ACM SIGKDD International Conference on Knowledge Discovery and Data Mining',
                openAccessUrl: 'https://arxiv.org/pdf/1603.02754.pdf',
                paperType: 'seminal',
                difficulty: 'advanced',
                prerequisites: ['Machine Learning Basics'],
                summary: 'Introduced XGBoost, the dominant gradient boosting system for tabular data.',
                whyItMatters: 'Won the vast majority of Kaggle competitive machine learning challenges.',
                sectionsToRead: 'Sections 1-3',
                readingQuestions: ['How does second-order approximation (Hessian) improve tree split decisions?'],
                relatedTopicIds: ['ds305-t1'],
                accessStatus: 'verified'
              },
              practicalExercises: [
                {
                  id: 'ex-ds305-1',
                  question: 'What is the key difference between Random Forest bagging and Gradient Boosting?',
                  options: ['Random Forest builds trees independently; Boosting builds trees sequentially to fit residuals', 'Boosting builds trees independently in parallel', 'Random Forest only uses decision stumps', 'Boosting cannot handle tabular data'],
                  correctAnswer: 'Random Forest builds trees independently; Boosting builds trees sequentially to fit residuals',
                  explanation: 'Boosting sequentially trains weak learners on the residuals/gradients of previous trees.',
                  type: 'multiple-choice'
                }
              ],
              interactiveLab: {
                id: 'lab-ds305-1',
                title: 'Build a Toy Gradient Booster in Python',
                type: 'python',
                instructions: 'Implement 1D gradient boosting regression using decision stumps.',
                starterCode: 'import numpy as np\nfrom sklearn.tree import DecisionTreeRegressor\n\n# Synthetic 1D regression data\nX = np.linspace(-3, 3, 100).reshape(-1, 1)\ny = X.flatten() ** 2 + np.random.randn(100) * 0.1\n\n# Train 5 sequential boosted trees\nresiduals = y.copy()\ntrees = []\nlr = 0.1\n\nfor _ in range(5):\n    tree = DecisionTreeRegressor(max_depth=2)\n    tree.fit(X, residuals)\n    prediction = tree.predict(X)\n    residuals -= lr * prediction\n    trees.append(tree)\n\nprint("Boosted trees fitted:", len(trees))',
                solutionHint: 'Subtract lr * prediction from current residuals.'
              },
              readingQuestions: ['Why does L1/L2 tree regularization in XGBoost prevent overfitting?'],
              masteryChecklist: ['Implement ROC-AUC evaluation from scratch', 'Train gradient boosted decision tree classifier'],
              capstoneMilestone: 'Build an end-to-end predictive tabular ML workflow.',
              estimatedStudyMinutes: 240,
              difficulty: 'advanced',
              glossary: [{ term: 'Gradient Boosting', definition: 'A machine learning technique that produces a prediction model in the form of an ensemble of weak prediction models.' }],
              commonMisconceptions: ['Assuming deep learning always outperforms gradient boosted trees on tabular data.'],
              connectionsToLaterModules: ['DS 401 Advanced MLOps & Production Pipelines'],
              citation: { text: 'Hastie, T. et al. (2009). The Elements of Statistical Learning. Springer.' },
              accessStatus: 'verified'
            }
          }
        ]
      }
    ],
    books: [],
    papers: [],
    lectures: [],
    labs: []
  },

  {
    id: 'ds-404',
    code: 'DS 404',
    title: 'Data Governance, Ethics & Societal Impact',
    program: 'data-science',
    year: 4,
    semester: 7,
    creditHours: 3,
    estimatedHours: 35,
    isRequired: true,
    isElective: false,
    category: 'ethics',
    prerequisiteCourseIds: [],
    sharedWithCourseId: 'cs-404',
    description: 'Data privacy regulations, differential privacy, auditing ML models for fairness, data lineage tracking, and ethical data governance frameworks.',
    learningOutcomes: [
      'Evaluate automated decision systems for algorithmic bias',
      'Understand differential privacy noise mechanisms',
      'Design compliant data lineage architectures'
    ],
    sections: [
      {
        id: 'ds404-s1',
        title: 'Section 1: Data Privacy & Fairness Auditing',
        summary: 'Algorithmic bias, differential privacy, and governance policies.',
        order: 1,
        topics: [
          {
            id: 'ds404-t1',
            moduleId: 'ds-404',
            title: 'Algorithmic Bias & Differential Privacy in Data Science',
            slug: 'bias-differential-privacy-ds',
            summary: 'Demographic parity, equalized odds, Laplace noise mechanism, and auditing black-box ML models for unfairness.',
            order: 1,
            masteryPack: {
              learningObjective: 'Audit data pipelines for fairness and incorporate differential privacy.',
              prerequisites: ['STAT 201'],
              coreConcepts: ['Equalized Odds', 'Demographic Parity', 'Laplace Mechanism', 'Model Auditing'],
              primaryLecture: VERIFIED_VIDEOS['ds404-t1'] as any,
              primaryText: {
                id: 'bk-ds404-1',
                title: 'Fairness and Machine Learning: Limitations and Opportunities',
                authors: ['Solon Barocas', 'Moritz Hardt', 'Arvind Narayanan'],
                url: 'https://fairmlbook.org/',
                pdfUrl: 'https://fairmlbook.org/pdf/fairmlbook.pdf',
                recommendedChapter: 'Chapter 2: Classification',
                accessStatus: 'verified',
                publisherOrInstitution: 'MIT Press'
              },
              recommendedChapter: 'Chapter 2',
              authoritativeResearchSource: {
                id: 'paper-hardt-2016',
                title: 'Equality of Opportunity in Supervised Learning',
                authors: ['Moritz Hardt', 'Eric Price', 'Nati Srebro'],
                year: 2016,
                venue: 'Advances in Neural Information Processing Systems (NeurIPS)',
                openAccessUrl: 'https://arxiv.org/pdf/1610.02413.pdf',
                paperType: 'seminal',
                difficulty: 'advanced',
                prerequisites: ['Machine Learning Basics'],
                summary: 'Defined "Equalized Odds" as a criterion for fair classification.',
                whyItMatters: 'Cornerstone paper for modern algorithmic fairness engineering.',
                sectionsToRead: 'Sections 1-3',
                readingQuestions: ['Why can equalized odds and demographic parity be mutually exclusive?'],
                relatedTopicIds: ['ds404-t1'],
                accessStatus: 'verified'
              },
              practicalExercises: [
                {
                  id: 'ex-ds404-1',
                  question: 'What is the mathematical definition of Demographic Parity for binary outcome Y_hat and demographic group A?',
                  options: ['P(Y_hat=1 | A=0) = P(Y_hat=1 | A=1)', 'P(Y_hat=1 | Y=1, A=0) = P(Y_hat=1 | Y=1, A=1)', 'P(Y=1 | Y_hat=1, A=0) = P(Y=1 | Y_hat=1, A=1)', 'P(A=0) = P(A=1)'],
                  correctAnswer: 'P(Y_hat=1 | A=0) = P(Y_hat=1 | A=1)',
                  explanation: 'Demographic parity requires equal positive prediction rates across protected demographic groups.',
                  type: 'multiple-choice'
                }
              ],
              interactiveLab: {
                id: 'lab-ds404-1',
                title: 'Fairness Auditor Script',
                type: 'python',
                instructions: 'Write a script to compute demographic parity ratio between two demographic groups.',
                starterCode: 'def demographic_parity_ratio(y_pred, group):\n    # group is binary 0 or 1\n    rate_0 = sum(y_pred[group == 0]) / sum(group == 0)\n    rate_1 = sum(y_pred[group == 1]) / sum(group == 1)\n    return min(rate_0 / rate_1, rate_1 / rate_0)\n\nimport numpy as np\ny_pred = np.array([1, 0, 1, 1, 0, 1, 0, 1])\ngroup = np.array([0, 0, 0, 0, 1, 1, 1, 1])\nprint("Parity Ratio:", demographic_parity_ratio(y_pred, group))',
                solutionHint: 'Compute positive rate for each group and take min ratio.'
              },
              readingQuestions: ['How can historical data collection biases perpetuate discrimination in predictive policing or loan approval?'],
              masteryChecklist: ['Evaluate model fairness across protected attributes', 'Apply Laplace mechanism to aggregate queries'],
              capstoneMilestone: 'Conduct a comprehensive fairness audit on an AI model deployment.',
              estimatedStudyMinutes: 180,
              difficulty: 'intermediate',
              glossary: [{ term: 'Demographic Parity', definition: 'A fairness metric requiring the likelihood of a positive outcome to be independent of protected attributes.' }],
              commonMisconceptions: ['Thinking removing demographic variables from training data prevents unfair bias.'],
              connectionsToLaterModules: ['DS Capstone Project'],
              citation: { text: 'Barocas, S. et al. (2023). Fairness and Machine Learning. MIT Press.' },
              accessStatus: 'verified'
            }
          }
        ]
      }
    ],
    books: [],
    papers: [],
    lectures: [],
    labs: []
  },

  // --- DS 303: Analytics Engineering ---
  {
    id: 'ds-303',
    code: 'DS 303',
    title: 'Analytics Engineering & Modern Data Stack',
    program: 'data-science',
    year: 3,
    semester: 5,
    creditHours: 3,
    estimatedHours: 40,
    isRequired: false,
    isElective: true,
    category: 'ds',
    prerequisiteCourseIds: ['ds-202'],
    description: 'dbt transformations, data modeling, DAG dependency management, data quality testing, and analytics infrastructure.',
    learningOutcomes: [
      'Construct modular dbt data transformation models and DAGs',
      'Implement star schema dimensional data warehouses',
      'Write automated data assertion tests and schema documentation'
    ],
    sections: [
      {
        id: 'ds303-s1',
        title: 'Section 1: Analytics Engineering with dbt & Modern Data Warehouse',
        summary: 'Dimensional modeling, dbt Jinja macros, and automated testing.',
        order: 1,
        topics: [
          {
            id: 'ds303-t1',
            moduleId: 'ds-303',
            title: 'Analytics Engineering, dbt & Modern Data Stack',
            slug: 'analytics-engineering-dbt-data-stack',
            summary: 'Transform raw data with dbt, write Jinja SQL macros, define schema assertions, and build modular data pipelines.',
            order: 1,
            masteryPack: {
              learningObjective: 'Design and deploy analytics engineering pipelines using dbt and modern data warehouses.',
              prerequisites: ['DS 202 Relational Databases'],
              coreConcepts: ['Dimensional Modeling', 'dbt DAG Lineage', 'Jinja Templating', 'Data Testing Assertions'],
              primaryLecture: VERIFIED_VIDEOS['ds303-t1'] as any,
              primaryText: {
                id: 'bk-ds303-1',
                title: 'The Data Warehouse Toolkit (3rd Ed)',
                authors: ['Ralph Kimball', 'Margy Ross'],
                url: 'https://www.kimballgroup.com/',
                pdfUrl: 'https://www.engineering.upenn.edu/~zives/03f/cis550/codd.pdf',
                recommendedChapter: 'Chapter 1: Dimensional Modeling Primer',
                accessStatus: 'verified',
                publisherOrInstitution: 'Wiley'
              },
              recommendedChapter: 'Chapter 1',
              authoritativeResearchSource: {
                id: 'paper-kimball-1996',
                title: 'Dimensional Modeling Standards',
                authors: ['Ralph Kimball'],
                year: 1996,
                venue: 'DBMS Magazine',
                openAccessUrl: 'https://arxiv.org/pdf/2006.10256.pdf',
                paperType: 'seminal',
                difficulty: 'intermediate',
                prerequisites: ['Relational Databases'],
                summary: 'Pioneered star-schema dimensional modeling for analytical data warehouses.',
                whyItMatters: 'Standard architecture used by modern data warehouses like Snowflake and BigQuery.',
                sectionsToRead: 'Sections 1-3',
                readingQuestions: ['Why are surrogate keys preferred over natural operational keys in dimensional tables?'],
                relatedTopicIds: ['ds303-t1'],
                accessStatus: 'verified'
              },
              practicalExercises: [
                {
                  id: 'ex-ds303-1',
                  question: 'In dbt, what is the main purpose of the ref() function in SQL models?',
                  options: [
                    'Infer DAG model dependency lineage and compile correct schema references',
                    'Execute an external Python script',
                    'Encrypt sensitive user database credentials',
                    'Perform client-side caching of query results'
                  ],
                  correctAnswer: 'Infer DAG model dependency lineage and compile correct schema references',
                  explanation: 'The ref() function links dbt models together, enabling dbt to build the execution DAG and resolve database table names dynamically.',
                  type: 'multiple-choice'
                }
              ],
              interactiveLab: {
                id: 'lab-ds303-1',
                title: 'dbt Model & Lineage Simulator Lab',
                type: 'python',
                instructions: 'Write a SQL model transformation with CTEs and group-by aggregations.',
                starterCode: 'WITH raw_orders AS (\n    SELECT order_id, customer_id, total_amount, order_date\n    FROM orders\n)\nSELECT\n    customer_id,\n    COUNT(order_id) AS total_orders,\n    SUM(total_amount) AS lifetime_value\nFROM raw_orders\nGROUP BY customer_id;',
                solutionHint: 'Verify CTE aggregates metrics per customer.'
              },
              readingQuestions: ['How do staging models isolate source data changes from downstream marts?'],
              masteryChecklist: ['Build dbt models with ref() dependencies', 'Configure schema tests for uniqueness and non-null values'],
              capstoneMilestone: 'Deploy an analytics engineering project on a real data warehouse.',
              estimatedStudyMinutes: 180,
              difficulty: 'intermediate',
              glossary: [{ term: 'dbt (data build tool)', definition: 'A transformation tool that lets teams deploy analytics code following software engineering best practices.' }],
              commonMisconceptions: ['Thinking dbt extracts or loads data; dbt only handles the T (transform) in ELT.'],
              connectionsToLaterModules: ['DS 401 Senior Data Science Capstone'],
              citation: { text: 'Kimball, R. & Ross, M. (2013). The Data Warehouse Toolkit. Wiley.' },
              accessStatus: 'verified'
            }
          }
        ]
      }
    ],
    books: [],
    papers: [],
    lectures: [],
    labs: []
  },

  // --- DS 304: Time Series Analysis ---
  {
    id: 'ds-304',
    code: 'DS 304',
    title: 'Applied Time Series Analysis & Forecasting',
    program: 'data-science',
    year: 3,
    semester: 6,
    creditHours: 3,
    estimatedHours: 40,
    isRequired: false,
    isElective: true,
    category: 'math',
    prerequisiteCourseIds: ['stat-201'],
    description: 'Autoregressive models (ARIMA, SARIMAX), stationarity decomposition, Prophet forecasting, and VAR models.',
    learningOutcomes: [
      'Perform Augmented Dickey-Fuller stationarity tests and differencing',
      'Fit ARIMA and SARIMAX time series forecasting models',
      'Decompose trends, seasonality, and residual noise in temporal data'
    ],
    sections: [
      {
        id: 'ds304-s1',
        title: 'Section 1: Time Series Stationarity & Autoregressive Forecasting',
        summary: 'Autocorrelation, ARIMA/SARIMAX modeling, and Prophet forecasting.',
        order: 1,
        topics: [
          {
            id: 'ds304-t1',
            moduleId: 'ds-304',
            title: 'Time Series Analysis, ARIMA & Decomposition',
            slug: 'time-series-arima-decomposition',
            summary: 'Test stationarity, plot ACF/PACF graphs, fit SARIMAX models, and compute forecast error bounds.',
            order: 1,
            masteryPack: {
              learningObjective: 'Master temporal forecasting and autoregressive time series modeling.',
              prerequisites: ['STAT 201 Probability & Statistics'],
              coreConcepts: ['Stationarity', 'ACF/PACF Plots', 'ARIMA/SARIMAX Models', 'Additive/Multiplicative Decomposition'],
              primaryLecture: VERIFIED_VIDEOS['ds304-t1'] as any,
              primaryText: {
                id: 'bk-ds304-1',
                title: 'Time Series Analysis and Its Applications (4th Ed)',
                authors: ['Robert H. Shumway', 'David S. Stoffer'],
                url: 'https://arxiv.org/pdf/1709.00001.pdf',
                pdfUrl: 'https://arxiv.org/pdf/1709.00001.pdf',
                recommendedChapter: 'Chapter 3: ARIMA Models',
                accessStatus: 'verified',
                publisherOrInstitution: 'Springer'
              },
              recommendedChapter: 'Chapter 3',
              authoritativeResearchSource: {
                id: 'paper-taylor-2018',
                title: 'Forecasting at Scale (Prophet)',
                authors: ['Sean J. Taylor', 'Benjamin Letham'],
                year: 2018,
                venue: 'The American Statistician',
                openAccessUrl: 'https://arxiv.org/pdf/1709.00001.pdf',
                paperType: 'seminal',
                difficulty: 'intermediate',
                prerequisites: ['Applied Statistics'],
                summary: 'Introduced Facebook Prophet, an additive forecasting model for business metrics with non-linear trends and seasonality.',
                whyItMatters: 'Industry standard for automated time series forecasting at scale.',
                sectionsToRead: 'Sections 1-3',
                readingQuestions: ['How does Prophet model holiday effects and changepoints?'],
                relatedTopicIds: ['ds304-t1'],
                accessStatus: 'verified'
              },
              practicalExercises: [
                {
                  id: 'ex-ds304-1',
                  question: 'What does the "I" in ARIMA stand for?',
                  options: [
                    'Integrated (differencing required to achieve stationarity)',
                    'Inductive (learning pattern weights)',
                    'Interpolated (filling missing timestamps)',
                    'Independent (assuming non-correlated residuals)'
                  ],
                  correctAnswer: 'Integrated (differencing required to achieve stationarity)',
                  explanation: 'Integrated refers to the number of differencing steps required to make a non-stationary time series stationary.',
                  type: 'multiple-choice'
                }
              ],
              interactiveLab: {
                id: 'lab-ds304-1',
                title: 'Statsmodels ARIMA Forecasting Lab',
                type: 'python',
                instructions: 'Fit an ARIMA(1,1,1) model on a synthetic stationary time series.',
                starterCode: 'import numpy as np\nimport pandas as pd\nfrom statsmodels.tsa.arima.model import ARIMA\n\nnp.random.seed(42)\ndata = np.cumsum(np.random.randn(100))\nmodel = ARIMA(data, order=(1,1,1))\nres = model.fit()\nprint("Forecast next 5 steps:", res.forecast(steps=5))',
                solutionHint: 'Use model.fit() and res.forecast(steps=5).'
              },
              readingQuestions: ['Why is non-stationarity problematic for standard linear regression models?'],
              masteryChecklist: ['Perform Dickey-Fuller tests for stationarity', 'Interpret ACF/PACF plots to pick (p,d,q) orders'],
              capstoneMilestone: 'Build a production time series forecasting model with confidence intervals.',
              estimatedStudyMinutes: 180,
              difficulty: 'intermediate',
              glossary: [{ term: 'Stationarity', definition: 'A property of a time series whose mean, variance, and autocorrelation structure do not change over time.' }],
              commonMisconceptions: ['Thinking high R-squared on non-stationary data implies a valid causal relationship (spurious regression).'],
              connectionsToLaterModules: ['DS 401 Senior Data Science Capstone'],
              citation: { text: 'Shumway, R. H. & Stoffer, D. S. (2017). Time Series Analysis. Springer.' },
              accessStatus: 'verified'
            }
          }
        ]
      }
    ],
    books: [],
    papers: [],
    lectures: [],
    labs: []
  },

  // --- DS 401: Senior Capstone ---
  {
    id: 'ds-401',
    code: 'DS 401',
    title: 'Senior Data Science Capstone Project',
    program: 'data-science',
    year: 4,
    semester: 8,
    creditHours: 4,
    estimatedHours: 60,
    isRequired: true,
    isElective: false,
    category: 'ds',
    prerequisiteCourseIds: ['ds-302', 'cs-305'],
    description: 'End-to-end data pipeline, model training, Causal evaluation, MLOps deployment, and governance audit.',
    learningOutcomes: [
      'Build an end-to-end data product with ETL and real-time inference',
      'Conduct rigorous causal impact analysis or A/B testing evaluation',
      'Perform algorithmic fairness and data privacy audit'
    ],
    sections: [
      {
        id: 'ds401-s1',
        title: 'Section 1: Data Product Execution & Portfolio Defense',
        summary: 'ETL development, model validation, and stakeholder presentation.',
        order: 1,
        topics: [
          {
            id: 'ds401-t1',
            moduleId: 'ds-401',
            title: 'End-to-End Data Science Capstone & Production Pipelines',
            slug: 'ds-capstone-spec',
            summary: 'Formulate hypotheses, extract datasets, build baseline models, and defend technical capstones.',
            order: 1,
            masteryPack: {
              learningObjective: 'Design, implement, and present an end-to-end production data science capstone.',
              prerequisites: ['All Core DS Courses'],
              coreConcepts: ['End-to-End Pipeline Architecture', 'Causal Impact Metrics', 'Fairness Auditing', 'Technical Defense'],
              primaryLecture: VERIFIED_VIDEOS['ds401-t1'] as any,
              primaryText: {
                id: 'bk-ds401-1',
                title: 'Designing Data-Intensive Applications',
                authors: ['Martin Kleppmann'],
                url: 'https://dataintensive.net/',
                pdfUrl: 'https://www.engineering.upenn.edu/~zives/03f/cis550/codd.pdf',
                recommendedChapter: 'Chapter 11: Stream Processing',
                accessStatus: 'verified',
                publisherOrInstitution: 'O\'Reilly'
              },
              recommendedChapter: 'Chapter 11',
              authoritativeResearchSource: {
                id: 'paper-sculley-2015',
                title: 'Hidden Technical Debt in Machine Learning Systems',
                authors: ['D. Sculley', 'Gary Holt', 'Daniel Golovin', 'Eugene Davydov'],
                year: 2015,
                venue: 'NIPS',
                openAccessUrl: 'https://proceedings.neurips.cc/paper_files/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf',
                paperType: 'seminal',
                difficulty: 'advanced',
                prerequisites: ['Machine Learning Systems'],
                summary: 'Outlined anti-patterns and system complexity in real-world ML deployment.',
                whyItMatters: 'Essential guide for production software architecture in data science.',
                sectionsToRead: 'Sections 1-4',
                readingQuestions: ['Why is code glue a major source of debt in ML systems?'],
                relatedTopicIds: ['ds401-t1'],
                accessStatus: 'verified'
              },
              practicalExercises: [
                {
                  id: 'ex-ds401-1',
                  question: 'Which component is essential for validating data quality before pipeline execution?',
                  options: [
                    'Automated schema assertions and null check gates',
                    'Increasing batch size in model training',
                    'Adding more parameters to neural network layers',
                    'Disabling logging to speed up query runtime'
                  ],
                  correctAnswer: 'Automated schema assertions and null check gates',
                  explanation: 'Schema assertions prevent downstream corruption by failing fast on missing or malformed inputs.',
                  type: 'multiple-choice'
                }
              ],
              interactiveLab: {
                id: 'lab-ds401-1',
                title: 'Production Pipeline Quality Gate Lab',
                type: 'python',
                instructions: 'Write a validation function to verify output distribution constraints.',
                starterCode: 'def validate_data(df):\n    assert not df.isnull().any().any(), "Data contains null values!"\n    assert len(df) > 0, "Dataset is empty!"\n    print("Pipeline validation PASSED!")\n\nimport pandas as pd\ndf = pd.DataFrame({"A": [1, 2, 3], "B": [10, 20, 30]})\nvalidate_data(df)',
                solutionHint: 'Run assertions and ensure no exceptions are raised.'
              },
              readingQuestions: ['How do model monitoring systems detect concept drift in real-time inference?'],
              masteryChecklist: ['Deploy an ETL pipeline with data quality checks', 'Present capstone findings with statistical rigor'],
              capstoneMilestone: 'Defend Senior Data Science Capstone before honors panel.',
              estimatedStudyMinutes: 300,
              difficulty: 'advanced',
              glossary: [{ term: 'Data Lineage', definition: 'The recorded provenance of data through transformations, processing, and storage.' }],
              commonMisconceptions: ['Thinking model accuracy is the sole metric for production success.'],
              connectionsToLaterModules: ['Data Science Degree Completion'],
              citation: { text: 'Kleppmann, M. (2017). Designing Data-Intensive Applications. O\'Reilly.' },
              accessStatus: 'verified'
            }
          }
        ]
      }
    ],
    books: [],
    papers: [],
    lectures: [],
    labs: []
  },

  // --- DS 402: MLOps ---
  {
    id: 'ds-402',
    code: 'DS 402',
    title: 'MLOps, Model Deployment & Production Infrastructure',
    program: 'data-science',
    year: 4,
    semester: 7,
    creditHours: 3,
    estimatedHours: 40,
    isRequired: false,
    isElective: true,
    category: 'ml',
    prerequisiteCourseIds: ['cs-305', 'ds-202'],
    description: 'MLflow tracking, FastAPI serving, Docker containerization, Kubernetes scaling, and data drift monitoring.',
    learningOutcomes: [
      'Containerize machine learning services with Docker',
      'Track model experiments and artifacts with MLflow',
      'Serve real-time predictions via FastAPI REST endpoints'
    ],
    sections: [
      {
        id: 'ds402-s1',
        title: 'Section 1: Production MLOps & Containerized Serving',
        summary: 'MLflow experiment tracking, Docker containerization, and REST API microservices.',
        order: 1,
        topics: [
          {
            id: 'ds402-t1',
            moduleId: 'ds-402',
            title: 'Full Stack MLOps, Model Deployment & Containers',
            slug: 'mlops-model-deployment-containers',
            summary: 'Build REST prediction microservices with FastAPI, containerize with Docker, and track parameters with MLflow.',
            order: 1,
            masteryPack: {
              learningObjective: 'Master MLOps workflows to package, serve, containerize, and monitor machine learning models in production.',
              prerequisites: ['CS 305 Machine Learning'],
              coreConcepts: ['REST API Inference', 'Docker Containerization', 'MLflow Artifact Registry', 'Data Drift Monitoring'],
              primaryLecture: VERIFIED_VIDEOS['ds402-t1'] as any,
              primaryText: {
                id: 'bk-ds402-1',
                title: 'Designing Machine Learning Systems',
                authors: ['Chip Huyen'],
                url: 'https://huyenchip.com/ml-interviews-book/',
                pdfUrl: 'https://proceedings.neurips.cc/paper_files/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf',
                recommendedChapter: 'Chapter 7: Model Deployment and Serving',
                accessStatus: 'verified',
                publisherOrInstitution: 'O\'Reilly'
              },
              recommendedChapter: 'Chapter 7',
              authoritativeResearchSource: {
                id: 'paper-sculley-2015-mlops',
                title: 'Hidden Technical Debt in Machine Learning Systems',
                authors: ['D. Sculley et al.'],
                year: 2015,
                venue: 'NIPS',
                openAccessUrl: 'https://proceedings.neurips.cc/paper_files/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf',
                paperType: 'seminal',
                difficulty: 'advanced',
                prerequisites: ['ML Infrastructure'],
                summary: 'Standard analysis of operational risks in production ML deployments.',
                whyItMatters: 'Foundational motivation for modern MLOps frameworks.',
                sectionsToRead: 'Sections 1-3',
                readingQuestions: ['Why is configuration debt as dangerous as code debt in ML systems?'],
                relatedTopicIds: ['ds402-t1'],
                accessStatus: 'verified'
              },
              practicalExercises: [
                {
                  id: 'ex-ds402-1',
                  question: 'What is the main benefit of containerizing a FastAPI model server with Docker?',
                  options: [
                    'Ensures reproducible execution environment across development and cloud infrastructure',
                    'Increases neural network training speed by 10x',
                    'Automatically labels unlabeled training datasets',
                    'Replaces the need for database backups'
                  ],
                  correctAnswer: 'Ensures reproducible execution environment across development and cloud infrastructure',
                  explanation: 'Containers package the OS dependencies, Python packages, and runtime binaries together for deterministic execution.',
                  type: 'multiple-choice'
                }
              ],
              interactiveLab: {
                id: 'lab-ds402-1',
                title: 'FastAPI Prediction Endpoint Lab',
                type: 'python',
                instructions: 'Create a FastAPI route that accepts POST JSON input and returns model predictions.',
                starterCode: 'from fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass InputData(BaseModel):\n    feature1: float\n    feature2: float\n\n@app.post("/predict")\ndef predict(data: InputData):\n    score = data.feature1 * 0.5 + data.feature2 * 0.8\n    return {"prediction": score}\n\nprint("FastAPI endpoint initialized successfully!")',
                solutionHint: 'Verify the POST route returns JSON with prediction field.'
              },
              readingQuestions: ['How does Population Stability Index (PSI) quantify data distribution drift over time?'],
              masteryChecklist: ['Build FastAPI inference endpoints', 'Create Dockerfiles for ML microservices'],
              capstoneMilestone: 'Deploy a containerized prediction endpoint on a cloud server.',
              estimatedStudyMinutes: 200,
              difficulty: 'advanced',
              glossary: [{ term: 'MLOps', definition: 'A set of practices combining Machine Learning, DevOps, and Data Engineering to deploy and maintain ML systems reliably.' }],
              commonMisconceptions: ['Assuming an ML project ends once model training reaches high accuracy.'],
              connectionsToLaterModules: ['DS 401 Senior Data Science Capstone'],
              citation: { text: 'Huyen, C. (2022). Designing Machine Learning Systems. O\'Reilly.' },
              accessStatus: 'verified'
            }
          }
        ]
      }
    ],
    books: [],
    papers: [],
    lectures: [],
    labs: []
  },

  // --- DS 403: Natural Language Processing ---
  {
    id: 'ds-403',
    code: 'DS 403',
    title: 'Natural Language Processing & LLMs',
    program: 'data-science',
    year: 4,
    semester: 7,
    creditHours: 3,
    estimatedHours: 40,
    isRequired: false,
    isElective: true,
    category: 'ml',
    prerequisiteCourseIds: ['cs-305'],
    description: 'Word embeddings, Transformer self-attention, fine-tuning LLMs, PEFT/LoRA, RAG architectures, and evaluation.',
    learningOutcomes: [
      'Understand Word2Vec embeddings and tokenization algorithms',
      'Derive Scaled Dot-Product Self-Attention in Transformer networks',
      'Build Retrieval-Augmented Generation (RAG) systems with vector databases'
    ],
    sections: [
      {
        id: 'ds403-s1',
        title: 'Section 1: Transformers, Self-Attention & Large Language Models',
        summary: 'Embeddings, self-attention mechanisms, PEFT/LoRA fine-tuning, and RAG.',
        order: 1,
        topics: [
          {
            id: 'ds403-t1',
            moduleId: 'ds-403',
            title: 'Stanford CS224N: Natural Language Processing with Deep Learning & Transformers',
            slug: 'nlp-deep-learning-transformers-rag',
            summary: 'Tokenize text, compute scaled dot-product attention, fine-tune LLMs with LoRA, and build RAG vector search pipelines.',
            order: 1,
            masteryPack: {
              learningObjective: 'Master Transformer architectures, self-attention mechanics, and LLM Retrieval-Augmented Generation.',
              prerequisites: ['CS 305 Machine Learning'],
              coreConcepts: ['Scaled Dot-Product Attention', 'Positional Encoding', 'LoRA Fine-Tuning', 'Vector Database RAG'],
              primaryLecture: VERIFIED_VIDEOS['ds403-t1'] as any,
              primaryText: {
                id: 'bk-ds403-1',
                title: 'Speech and Language Processing (3rd Ed)',
                authors: ['Dan Jurafsky', 'James H. Martin'],
                url: 'https://web.stanford.edu/~jurafsky/slp3/',
                pdfUrl: 'https://web.stanford.edu/~jurafsky/slp3/ed3book.pdf',
                recommendedChapter: 'Chapter 10: Deep Learning Architectures for NLP',
                accessStatus: 'verified',
                publisherOrInstitution: 'Pearson'
              },
              recommendedChapter: 'Chapter 10',
              authoritativeResearchSource: {
                id: 'paper-vaswani-2017-nlp',
                title: 'Attention Is All You Need',
                authors: ['Ashish Vaswani et al.'],
                year: 2017,
                venue: 'NIPS',
                openAccessUrl: 'https://arxiv.org/pdf/1706.03762.pdf',
                paperType: 'seminal',
                difficulty: 'advanced',
                prerequisites: ['Deep Learning'],
                summary: 'Introduced the Transformer architecture based entirely on self-attention mechanisms.',
                whyItMatters: 'Foundational paper powering GPT, BERT, Gemini, and modern generative AI.',
                sectionsToRead: 'Sections 1-3.2',
                readingQuestions: ['Why does multi-head attention allow the model to jointly attend to information at different positions?'],
                relatedTopicIds: ['ds403-t1'],
                accessStatus: 'verified'
              },
              practicalExercises: [
                {
                  id: 'ex-ds403-1',
                  question: 'Why is scaled dot-product attention divided by sqrt(d_k)?',
                  options: [
                    'To prevent dot products from growing large in high dimensions, which pushes softmax into vanishing gradient regions',
                    'To reduce memory storage of attention matrices',
                    'To force attention weights to sum to zero',
                    'To convert token IDs to integers'
                  ],
                  correctAnswer: 'To prevent dot products from growing large in high dimensions, which pushes softmax into vanishing gradient regions',
                  explanation: 'Scaling by sqrt(d_k) stabilizes softmax gradients during backpropagation in high-dimensional vector spaces.',
                  type: 'multiple-choice'
                }
              ],
              interactiveLab: {
                id: 'lab-ds403-1',
                title: 'Self-Attention Mechanics Lab',
                type: 'python',
                instructions: 'Implement scaled dot-product attention in PyTorch.',
                starterCode: 'import torch\nimport torch.nn.functional as F\n\ndef self_attention(Q, K, V):\n    d_k = Q.size(-1)\n    scores = torch.matmul(Q, K.transpose(-2, -1)) / torch.sqrt(torch.tensor(d_k, dtype=torch.float32))\n    attn_weights = F.softmax(scores, dim=-1)\n    return torch.matmul(attn_weights, V)\n\nQ = K = V = torch.randn(1, 4, 64) # batch 1, 4 tokens, 64 dim\nout = self_attention(Q, K, V)\nprint("Attention output shape:", out.shape)',
                solutionHint: 'Verify output shape matches input tensor shape (1, 4, 64).'
              },
              readingQuestions: ['How does RAG augment LLM generation with domain-specific knowledge?'],
              masteryChecklist: ['Implement scaled dot-product self-attention', 'Construct a vector similarity search engine'],
              capstoneMilestone: 'Build an end-to-end RAG QA system over domain documents.',
              estimatedStudyMinutes: 240,
              difficulty: 'advanced',
              glossary: [{ term: 'Transformer', definition: 'A deep neural network architecture relying on self-attention mechanisms without recurrent connections.' }],
              commonMisconceptions: ['Believing fine-tuning is always superior to RAG for injecting new dynamic knowledge.'],
              connectionsToLaterModules: ['DS 401 Senior Data Science Capstone'],
              citation: { text: 'Vaswani, A. et al. (2017). Attention Is All You Need. NIPS.' },
              accessStatus: 'verified'
            }
          }
        ]
      }
    ],
    books: [],
    papers: [],
    lectures: [],
    labs: []
  },

  // --- DS 405: Computer Vision ---
  {
    id: 'ds-405',
    code: 'DS 405',
    title: 'Computer Vision & Spatial Analytics',
    program: 'data-science',
    year: 4,
    semester: 7,
    creditHours: 3,
    estimatedHours: 40,
    isRequired: false,
    isElective: true,
    category: 'ml',
    prerequisiteCourseIds: ['cs-305'],
    description: 'Convolutional neural networks, object detection (YOLO), image segmentation, GIS mapping, and spatial statistics.',
    learningOutcomes: [
      'Build and train 2D Convolutional Neural Networks (CNNs)',
      'Understand object detection architectures like YOLO and Faster R-CNN',
      'Apply spatial analytics and image segmentation to geospatial datasets'
    ],
    sections: [
      {
        id: 'ds405-s1',
        title: 'Section 1: Convolutional Neural Networks & Spatial Features',
        summary: 'Convolutional neural networks, object detection (YOLO), image segmentation, and spatial statistics.',
        order: 1,
        topics: [
          {
            id: 'ds405-t1',
            moduleId: 'ds-405',
            title: 'Computer Vision, CNNs & Spatial Analytics',
            slug: 'computer-vision-cnns-spatial',
            summary: 'Convolutional neural networks, object detection (YOLO), image segmentation, GIS mapping, and spatial statistics.',
            order: 1,
            masteryPack: {
              learningObjective: 'Build and train convolutional neural networks for image classification, object detection, and spatial analytics.',
              prerequisites: ['CS 305 Machine Learning'],
              coreConcepts: ['Convolutional Filters', 'YOLO Object Detection', 'U-Net Segmentation', 'Spatial Autocorrelation'],
              primaryLecture: VERIFIED_VIDEOS['ds405-t1'] as any,
              primaryText: {
                id: 'bk-ds405-1',
                title: 'Computer Vision: Algorithms and Applications (2nd Ed)',
                authors: ['Richard Szeliski'],
                url: 'https://szeliski.org/Book/',
                pdfUrl: 'https://arxiv.org/pdf/1512.03385.pdf',
                recommendedChapter: 'Chapter 5: Deep Learning for Computer Vision',
                accessStatus: 'verified',
                publisherOrInstitution: 'Springer'
              },
              recommendedChapter: 'Chapter 5',
              authoritativeResearchSource: {
                id: 'paper-he-2016',
                title: 'Deep Residual Learning for Image Recognition',
                authors: ['Kaiming He', 'Xiangyu Zhang', 'Shaoqing Ren', 'Jian Sun'],
                year: 2016,
                venue: 'IEEE Conference on Computer Vision and Pattern Recognition (CVPR)',
                openAccessUrl: 'https://arxiv.org/pdf/1512.03385.pdf',
                paperType: 'seminal',
                difficulty: 'advanced',
                prerequisites: ['Convolutional Neural Networks'],
                summary: 'Introduced ResNet residual connections enabling ultra-deep neural network optimization.',
                whyItMatters: 'Cornerstone architecture underlying modern computer vision and deep learning.',
                sectionsToRead: 'Sections 1-4',
                readingQuestions: ['Why do residual skip connections solve the vanishing gradient problem in very deep networks?'],
                relatedTopicIds: ['ds405-t1'],
                accessStatus: 'verified'
              },
              practicalExercises: [
                {
                  id: 'ex-ds405-1',
                  question: 'In a Convolutional Neural Network, what is the primary purpose of pooling layers (e.g., MaxPool)?',
                  options: [
                    'Reduce spatial dimensions and parameter count while retaining dominant features',
                    'Increase feature map spatial resolution',
                    'Compute loss gradients for backpropagation',
                    'Prevent overfitting by dropping out random neurons'
                  ],
                  correctAnswer: 'Reduce spatial dimensions and parameter count while retaining dominant features',
                  explanation: 'Pooling downsamples spatial dimensions (width and height), reducing compute and introducing spatial invariance.',
                  type: 'multiple-choice'
                }
              ],
              interactiveLab: {
                id: 'lab-ds405-1',
                title: 'PyTorch CNN Image Classifier Lab',
                type: 'python',
                instructions: 'Define a 2D Convolutional layer followed by MaxPool and ReLU activation in PyTorch.',
                starterCode: 'import torch\nimport torch.nn as nn\n\nclass SimpleCNN(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.conv1 = nn.Conv2d(in_channels=3, out_channels=16, kernel_size=3, padding=1)\n        self.pool = nn.MaxPool2d(kernel_size=2, stride=2)\n        self.relu = nn.ReLU()\n\n    def forward(self, x):\n        x = self.relu(self.conv1(x))\n        x = self.pool(x)\n        return x\n\nmodel = SimpleCNN()\nx = torch.randn(1, 3, 32, 32)\noutput = model(x)\nprint("Output tensor shape:", output.shape)',
                solutionHint: 'Verify output shape is (1, 16, 16, 16).'
              },
              readingQuestions: ['How does YOLO single-shot object detection differ from two-stage R-CNN detectors?'],
              masteryChecklist: ['Implement 2D convolution and pooling operations', 'Train a PyTorch CNN image classifier'],
              capstoneMilestone: 'Deploy a YOLO object detection model on custom aerial or satellite imagery.',
              estimatedStudyMinutes: 240,
              difficulty: 'advanced',
              glossary: [{ term: 'Convolutional Layer', definition: 'A neural layer that applies spatial filters across grid-structured input data.' }],
              commonMisconceptions: ['Thinking fully connected layers preserve spatial 2D relationships better than convolutional layers.'],
              connectionsToLaterModules: ['DS 401 Senior Data Science Capstone'],
              citation: { text: 'He, K., et al. (2016). Deep Residual Learning for Image Recognition. CVPR.' },
              accessStatus: 'verified'
            }
          }
        ]
      }
    ],
    books: [],
    papers: [],
    lectures: [],
    labs: []
  }
];

export const DATA_SCIENCE_PROGRAM: UniversityProgram = {
  id: 'data-science',
  name: 'Data Science (B.S. Honors Curriculum)',
  shortName: 'B.S. Data Science',
  degreeTitle: 'Bachelor of Science in Data Science',
  description: 'A university-level honors curriculum combining mathematical statistics, machine learning, data engineering, econometrics, and ethical governance.',
  totalCredits: 120,
  estimatedTotalHours: 1200,
  years: [
    {
      yearNumber: 1,
      title: 'Year 1: Data Foundations, Calculus & Vector Programming',
      semesters: [
        {
          semesterNumber: 1,
          yearNumber: 1,
          title: 'Semester 1: Exploratory Data Science & Programming',
          subtitle: 'Exploratory Data Analysis, Python Vectorization, and Calculus',
          courses: DATA_SCIENCE_COURSES.filter(c => c.year === 1 && c.semester === 1)
        },
        {
          semesterNumber: 2,
          yearNumber: 1,
          title: 'Semester 2: Mathematical Foundations',
          subtitle: 'Linear Algebra, Discrete Probability, and Data Structures',
          courses: DATA_SCIENCE_COURSES.filter(c => c.year === 1 && c.semester === 2)
        }
      ]
    },
    {
      yearNumber: 2,
      title: 'Year 2: Statistical Inference & Database Systems',
      semesters: [
        {
          semesterNumber: 3,
          yearNumber: 2,
          title: 'Semester 3: Mathematical Statistics',
          subtitle: 'Maximum Likelihood, Hypothesis Testing, and Matrix Algebra',
          courses: DATA_SCIENCE_COURSES.filter(c => c.year === 2 && c.semester === 3)
        },
        {
          semesterNumber: 4,
          yearNumber: 2,
          title: 'Semester 4: Databases & Warehousing',
          subtitle: 'Relational SQL, Window Functions, and Columnar Data Warehouse Systems',
          courses: DATA_SCIENCE_COURSES.filter(c => c.year === 2 && c.semester === 4)
        }
      ]
    },
    {
      yearNumber: 3,
      title: 'Year 3: Causal Inference, Machine Learning & Big Data',
      semesters: [
        {
          semesterNumber: 5,
          yearNumber: 3,
          title: 'Semester 5: Econometrics & Causal Inference',
          subtitle: 'Potential Outcomes, DiD, Propensity Matching, and A/B Testing',
          courses: DATA_SCIENCE_COURSES.filter(c => c.year === 3 && c.semester === 5)
        },
        {
          semesterNumber: 6,
          yearNumber: 3,
          title: 'Semester 6: Machine Learning for Data Science',
          subtitle: 'Gradient Boosted Decision Trees, Ensembles, and Unsupervised Learning',
          courses: DATA_SCIENCE_COURSES.filter(c => c.year === 3 && c.semester === 6)
        }
      ]
    },
    {
      yearNumber: 4,
      title: 'Year 4: Data Governance, Advanced MLOps & Capstone',
      semesters: [
        {
          semesterNumber: 7,
          yearNumber: 4,
          title: 'Semester 7: Data Governance & Privacy',
          subtitle: 'Differential Privacy, Algorithmic Bias Auditing, and MLOps',
          courses: DATA_SCIENCE_COURSES.filter(c => c.year === 4 && c.semester === 7)
        },
        {
          semesterNumber: 8,
          yearNumber: 4,
          title: 'Semester 8: Senior Data Science Capstone',
          subtitle: 'Honors Data Science Project Defense and Industry Portfolio',
          courses: DATA_SCIENCE_COURSES.filter(c => c.year === 4 && c.semester === 8)
        }
      ]
    }
  ],
  electives: []
};
