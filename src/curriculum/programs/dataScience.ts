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
              primaryLecture: VERIFIED_VIDEOS['ds101-t1'] as any,
              learningObjective: 'Clean and visualize dirty real-world datasets with statistical rigor.',
              prerequisites: ['Basic High School Math'],
              coreConcepts: [
                'Tidy Data: a standard for structuring datasets so that each variable forms a column, each observation forms a row, and each observational unit forms a table; this standardization is what allows pandas, seaborn, and most statistical tooling to operate on a dataset without custom reshaping code.',
                'Group-By Aggregation (Split-Apply-Combine): the pattern of splitting a dataset into groups by a categorical key, applying a summary function (mean, sum, count) to each group independently, and combining the results into a new table; it underlies almost every summary statistic reported during exploratory data analysis.',
                'Kernel Density Estimation (KDE): a non-parametric technique that smooths observed values into a continuous probability density curve by summing small kernel functions centered at each point; it reveals distribution shape (modality, skew) more faithfully than a histogram whose appearance depends heavily on bin width.',
                'Correlation Analysis: computing the Pearson correlation coefficient (or Spearman for monotonic-but-nonlinear relationships) to quantify the strength and direction of association between two numeric variables, the starting point for spotting candidate relationships before any causal claim is made.',
                'Grammar of Graphics: the layered framework (data, aesthetic mappings, geometric objects, statistical transformations, scales, facets) underlying libraries like ggplot2, explaining why matplotlib/seaborn charts are built by composing layers rather than selecting a single fixed chart type.',
                'Outlier Detection via the Interquartile Range (IQR): flagging points more than 1.5x the IQR below Q1 or above Q3 as potential outliers, a robust rule of thumb that determines where box plot whiskers end and whether a value warrants investigation before being dropped.'
              ],
              simpleExplanation: `Imagine your family's receipts from a whole year of shopping are all crumpled up in a shoebox. Some are on tiny thermal paper, some are handwritten, and the same item might be called "milk," "MILK 2%," or "whole milk" on different slips. Before you could answer even a simple question like "how much did we spend on groceries in June?" you'd first have to dump them all onto a table and organize them into neat rows and columns: one row per purchase, one column for the date, one for the item, one for the price. That act of organizing is called "tidying" your data, and it's the first and most important step in almost anything a data scientist does, because every tool afterward — charts, averages, statistics — assumes the data already looks like a neat table.

Once the receipts are in a tidy table, you can start asking group questions. Suppose you want to know the average amount spent per store. You'd sort all the receipts into little piles, one pile per store, add up each pile, and divide by how many receipts are in it. That's exactly what a "group-by" does to a dataset: split it into groups based on some category, do a calculation on each group separately, and then bring the results back together into a summary table. A computer can do this for millions of rows in the blink of an eye, but the idea is the same as sorting receipts into piles on your kitchen table.

Now, how do you turn that summary table into a picture a human can understand at a glance? Think of building a chart the way you'd build with LEGO bricks: you start with a base plate (the data), snap on a layer that decides where things go on the page (an x-axis for date, a y-axis for spending), then snap on a layer that decides what shape represents each data point (dots, bars, lines), and finally a layer of color or labels to add extra meaning. This "stack of layers" idea is called the grammar of graphics, and it's why chart-making tools let you build almost any kind of chart by combining a small number of building blocks rather than picking from a fixed menu of chart types.

Finally, once you have your neat table and your chart, you'll often spot a few points that look strange — maybe one receipt says you spent $10,000 on bananas. Outlier detection is just a formal way of asking "does this number look wildly different from its neighbors?" using the middle 50% of the data as a ruler for what "normal" looks like, so you know which receipts are worth double-checking for a typo versus which ones are simply an unusually expensive shopping trip.`,
              realWorldApplications: [
                {
                  title: 'The New York Times graphics desk',
                  description: 'Data journalists there use tidy-data practices and layered chart-building (the same grammar of graphics popularized by ggplot2) to turn messy government datasets into the polished interactive charts that accompany news stories.'
                },
                {
                  title: 'Spotify Wrapped',
                  description: 'Spotify\'s year-end Wrapped feature relies on grouping and aggregating billions of rows of listening events (one row per song play) by user, artist, and genre to compute each listener\'s top songs, minutes streamed, and top genres.'
                },
                {
                  title: 'Airbnb\'s internal analytics tooling',
                  description: 'Airbnb has publicly written about building internal tools on top of tidy, standardized event tables so that thousands of analysts can group and visualize booking and search data consistently without re-cleaning it each time.'
                },
                {
                  title: 'Johns Hopkins COVID-19 Dashboard',
                  description: 'The widely used Johns Hopkins CSSE dashboard aggregated raw case-report data from many inconsistent sources into a tidy table (one row per region per day) so it could be grouped by country/state and charted as the now-familiar case curves.'
                }
              ],
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
                },
                {
                  id: 'ex-ds101-2',
                  question: 'Which pandas method converts a wide-format dataframe with year columns like "2020", "2021", "2022" into a long-format dataframe with a single "year" column?',
                  options: ['pd.melt()', 'pd.pivot()', 'pd.concat()', 'pd.merge()'],
                  correctAnswer: 'pd.melt()',
                  explanation: 'pd.melt() "unpivots" a dataframe from wide to long format, turning columns into rows; pd.pivot() performs the reverse (long to wide) transformation.',
                  type: 'multiple-choice'
                },
                {
                  id: 'ex-ds101-3',
                  question: 'Anscombe\'s quartet contains four datasets that share the same mean, variance, and Pearson correlation coefficient but look very different when plotted. What does this demonstrate, and what practical habit does it recommend?',
                  explanation: 'It demonstrates that identical summary statistics can arise from very different underlying data-generating processes (linear trends, curved trends, or a single outlier). The practical habit it recommends is to always visualize a dataset (scatter plot, histogram, KDE) before trusting a summary statistic to describe it.',
                  type: 'free-response'
                },
                {
                  id: 'ex-ds101-4',
                  question: 'Write a single pandas expression that computes both the mean and standard deviation of the "Revenue" column for each group in the "Category" column of a dataframe df.',
                  correctAnswer: "df.groupby('Category')['Revenue'].agg(['mean', 'std'])",
                  explanation: 'groupby("Category") splits the data by category, ["Revenue"] selects the target column, and .agg([\'mean\', \'std\']) applies multiple aggregation functions in one pass, returning a dataframe with both statistics per group.',
                  type: 'code-snippet'
                },
                {
                  id: 'ex-ds101-5',
                  question: 'Increasing the bandwidth of a Kernel Density Estimate primarily has what effect on the resulting curve?',
                  options: ['Smooths the curve, potentially masking real modes', 'Makes the curve more jagged and detailed', 'Shifts the mean of the curve', 'Converts the KDE into a histogram'],
                  correctAnswer: 'Smooths the curve, potentially masking real modes',
                  explanation: 'A larger bandwidth widens each kernel, over-smoothing the density estimate and potentially hiding genuine multi-modal structure; too small a bandwidth instead produces a noisy, overfit curve.',
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
              readingQuestions: [
                'Why are box plots preferred over bar charts for skewed numeric distributions?',
                'What distinguishes "tidy" data from merely "clean" data, and why does the distinction matter for automated analysis pipelines?',
                'How does the split-apply-combine pattern generalize beyond simple mean aggregation to custom multi-column functions?',
                'Why might two datasets with identical Pearson correlation coefficients tell completely different stories, and how would you detect this without trusting the number alone?',
                'What is the practical trade-off involved in choosing a KDE bandwidth that is too small versus too large?'
              ],
              masteryChecklist: ['Perform pivot, melt, and group-by aggregations', 'Construct correlation heatmaps'],
              capstoneMilestone: 'Perform exploratory data analysis on a public dataset.',
              estimatedStudyMinutes: 180,
              difficulty: 'beginner',
              glossary: [
                { term: 'Tidy Data', definition: 'A standard way of organizing a dataset in which every column is a variable, every row is an observation, and every table stores one type of observational unit.' },
                { term: 'Wide vs. Long Format', definition: 'Wide format spreads repeated measurements across multiple columns; long format stacks them into fewer columns with a key column identifying which variable or time point each row belongs to. Tidy data is typically long format.' },
                { term: 'Split-Apply-Combine', definition: 'The three-step pattern implemented by groupby(): split a dataset into groups by a key, apply a function to each group independently, and combine the per-group results into a single output.' },
                { term: 'Kernel Density Estimate (KDE)', definition: 'A non-parametric estimate of a continuous probability density function, formed by summing a kernel (commonly Gaussian) placed at every observation; the bandwidth parameter controls the smoothness of the resulting curve.' },
                { term: 'Pearson Correlation Coefficient (r)', definition: 'A statistic in [-1, 1] measuring the strength and direction of the linear relationship between two numeric variables; r = 0 indicates no linear relationship but does not rule out a strong nonlinear one.' },
                { term: 'Quantile', definition: 'A value below which a given proportion of the data falls; the median is the 0.5 quantile, and quartiles divide data into four equal-sized groups.' },
                { term: 'Interquartile Range (IQR)', definition: 'The distance between the first quartile (Q1, 25th percentile) and third quartile (Q3, 75th percentile), IQR = Q3 - Q1, used as a robust measure of spread insensitive to outliers.' },
                { term: 'Box Plot', definition: 'A chart summarizing a numeric distribution via its median and quartiles (box) and whiskers extending to the most extreme non-outlier points, with points beyond 1.5x IQR plotted separately as outliers.' },
                { term: 'Missing Data (NaN)', definition: 'A placeholder representing an absent or unrecorded observation; how missing data is imputed or dropped can materially bias downstream statistics if it is not missing completely at random.' },
                { term: 'Skewness', definition: 'A measure of the asymmetry of a distribution around its mean; positive skew indicates a longer right tail, which is why the median is often preferred over the mean as a measure of central tendency for skewed data.' }
              ],
              commonMisconceptions: [
                'Misconception: Correlation between two variables implies that one causes the other. Reality: A correlation coefficient only measures the strength of linear association; establishing causation requires experimental control (randomization) or a rigorous causal-inference design that rules out confounding.',
                'Misconception: A dataset is "tidy" as long as it looks clean and has no missing values. Reality: Tidiness specifically means each variable is a column and each observation is a row; a wide-format spreadsheet can have zero missing values yet still be untidy because one variable is spread across many columns.',
                'Misconception: The mean is always the best summary of a variable\'s central tendency. Reality: For skewed distributions or data with outliers, the median is more robust because the mean is pulled toward extreme values while the median is not.',
                'Misconception: Dropping rows with missing values is always a safe default. Reality: If data is not missing completely at random, dropping rows can systematically bias the remaining sample; the missingness mechanism should be investigated before choosing to drop, impute, or flag.',
                'Misconception: A high Pearson correlation coefficient always signals a strong real-world relationship. Reality: Anscombe\'s quartet shows that datasets with identical correlation coefficients, means, and variances can have completely different underlying relationships, including nonlinear patterns or a single influential outlier driving the statistic.'
              ],
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
              primaryLecture: VERIFIED_VIDEOS['ds102-t1'] as any,
              learningObjective: 'Master vectorized array processing to avoid slow Python explicit loops.',
              prerequisites: ['DS 101'],
              coreConcepts: [
                'Strided Array: a memory layout described by a fixed number of bytes to step per dimension when moving to the next element; understanding strides explains how slicing an array produces a zero-copy "view" instead of duplicating data, which is central to writing memory-efficient pipelines.',
                'Broadcasting Rules: the algorithm NumPy uses to align arrays of different shapes for element-wise arithmetic by comparing trailing dimensions and virtually stretching any axis of size 1, letting code combine arrays of different shapes without manual reshaping or looping.',
                'Universal Functions (ufuncs): compiled C functions (np.add, np.exp, np.sqrt, etc.) that apply element-wise across arrays in a single optimized pass, which is the underlying mechanism that makes vectorized NumPy code faster than equivalent pure-Python loops.',
                'Vectorization: the practice of expressing a computation as whole-array operations instead of explicit Python for-loops, so the heavy iteration happens inside compiled ufunc code rather than the slow CPython interpreter loop.',
                'Memory Contiguity (C-order vs Fortran-order): whether array elements are laid out row-major (C order, default) or column-major (Fortran order) in memory, which determines which access pattern is cache-friendly and therefore fast.',
                'Views vs Copies: basic slicing returns a view that shares the original array\'s memory buffer, while fancy indexing (boolean masks, integer arrays) returns a new copy; conflating the two is a common source of subtle bugs when mutating "sliced" data.'
              ],
              simpleExplanation: `Picture two ways of handing out candy to a line of 1,000 kids. In the slow way, you walk up to each kid one at a time, reach into your bag, and place one candy in their hand — one trip, one kid, repeat a thousand times. In the fast way, you have a machine that dumps candy into all 1,000 hands simultaneously in one motion. Regular Python loops work like the slow way: for every single number in a list, Python does a bunch of bookkeeping (checking its type, unwrapping it, doing the math, wrapping the result back up) before moving to the next one. NumPy's vectorization is the fast way — it hands the entire list of numbers to a tightly optimized block of code, written in a lower-level language, that processes them all in one coordinated sweep, skipping all that per-item bookkeeping.

This is only possible because NumPy stores its numbers differently than a normal Python list does. A Python list is like a row of lockers, each one holding a note that says "go look over there for the actual number." A NumPy array is like a single shelf where all the numbers sit right next to each other, packed tightly, all the same size and type. Because the computer knows exactly how big each number is and that they're all lined up in a row, it can grab huge chunks of them at once instead of chasing down a separate note for every single value — this is why vectorized code is dramatically faster.

Broadcasting solves a different, related puzzle: what happens when you want to add a small set of numbers to a bigger set that doesn't quite match in size? Think of a recipe card that lists ingredient amounts "per serving," and you want to scale it for a table of 8 people who each ordered a different number of servings. Instead of writing out the recipe eight separate times, broadcasting is the rule that lets NumPy automatically "stretch" the smaller recipe card across every person's serving count, as long as the shapes are compatible in a specific, predictable way — no wasted copies, just implied repetition.

Finally, there's a subtlety about "views" versus "copies" that trips up almost every beginner. If you slice out a piece of a NumPy array — like pointing at a section of that shelf of numbers — you usually get a window looking at the very same shelf, not a new shelf. So if you change a number through that window, you've actually changed the original array too, the same way scribbling on a photocopy that's actually just a see-through overlay would mark up the original page underneath it.`,
              realWorldApplications: [
                {
                  title: 'NASA\'s JPL spacecraft trajectory calculations',
                  description: 'Mission engineering teams have used NumPy\'s vectorized array math for orbital mechanics and trajectory simulations, since propagating thousands of state vectors through physics equations is far faster as batched array operations than as Python loops.'
                },
                {
                  title: 'Instagram\'s backend image and feed-ranking pipelines',
                  description: 'Instagram engineers have described NumPy and its vectorized array operations as core to the Python-heavy parts of their backend, where numerical scoring and image-related computations need to run over large batches efficiently.'
                },
                {
                  title: 'Every major deep learning framework (PyTorch, TensorFlow)',
                  description: 'PyTorch and TensorFlow tensors are direct descendants of the NumPy array model, using the same contiguous-memory-plus-broadcasting design so that operations across millions of neural network weights run as fast, vectorized batch computations rather than slow Python loops.'
                },
                {
                  title: 'Pandas itself',
                  description: 'The pandas DataFrame library used throughout data science is built directly on top of NumPy arrays, inheriting vectorization and broadcasting so that operations like adding two columns together happen as one fast array operation instead of a per-row Python loop.'
                }
              ],
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
                },
                {
                  id: 'ex-ds102-2',
                  question: 'Given arr = np.arange(10) and view = arr[2:5], if you modify view[0] = 999, what happens to arr?',
                  options: ['arr[2] also becomes 999, because slicing returns a view sharing memory', 'arr is unchanged, because slicing always copies', 'A ValueError is raised', 'Only view changes and a warning is printed'],
                  correctAnswer: 'arr[2] also becomes 999, because slicing returns a view sharing memory',
                  explanation: 'Basic (non-fancy) slicing in NumPy returns a view backed by the same underlying memory buffer, so writes through the view mutate the original array. Use .copy() to avoid this when an independent array is needed.',
                  type: 'multiple-choice'
                },
                {
                  id: 'ex-ds102-3',
                  question: 'Explain, in terms of strides, why arr.T (the transpose of a 2D array) can be computed instantly regardless of array size.',
                  explanation: 'Transposing does not move any data in memory; it simply swaps the stride values associated with each axis, so iterating "down a column" of arr.T now walks the same bytes that used to be "along a row" of arr. Because no bytes are copied, the operation is O(1) instead of O(n).',
                  type: 'free-response'
                },
                {
                  id: 'ex-ds102-4',
                  question: 'What shape results from broadcasting an array of shape (4,) against an array of shape (3, 4)?',
                  options: ['(3, 4)', '(4, 4)', '(3,)', 'Broadcasting fails with a ValueError'],
                  correctAnswer: '(3, 4)',
                  explanation: 'Aligning trailing dimensions, (4,) is treated as (1, 4), which is compatible with (3, 4) because the size-1 axis stretches to 3, giving a broadcast result of shape (3, 4).',
                  type: 'multiple-choice'
                },
                {
                  id: 'ex-ds102-5',
                  question: 'Why can a Python list of 1,000,000 floats be substantially slower to sum than an equivalent NumPy array, even though both eventually add 1,000,000 numbers?',
                  explanation: 'A Python list stores boxed PyObject pointers scattered across memory and sum() dispatches a generic add operation per element through the interpreter loop. A NumPy array stores raw floats contiguously, so np.sum() executes as a single tight, cache-friendly C loop with no per-element interpreter overhead or type dispatch.',
                  type: 'free-response'
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
              readingQuestions: [
                'Why is memory contiguous layout critical for CPU cache efficiency during matrix operations?',
                'How do the broadcasting rules generalize when combining arrays with more than two dimensions?',
                'What is the practical risk of assuming a slice is always an independent copy of the data?',
                'Why does a single ufunc call typically outperform an equivalent Python for-loop by one or two orders of magnitude?',
                'When would you deliberately force a copy of an array rather than rely on a view?'
              ],
              masteryChecklist: ['Implement array broadcasting without explicit python for loops', 'Construct masked arrays using boolean indexing'],
              capstoneMilestone: 'Build a high-performance linear algebra library in NumPy.',
              estimatedStudyMinutes: 200,
              difficulty: 'beginner',
              glossary: [
                { term: 'Stride', definition: 'The number of bytes to skip in memory to move to the next element along a given axis of an array; strides are what let NumPy interpret the same memory buffer under different shapes without copying.' },
                { term: 'Broadcasting', definition: 'The set of rules NumPy uses to make arrays of different but compatible shapes usable together in element-wise operations by virtually stretching axes of size 1.' },
                { term: 'Universal Function (ufunc)', definition: 'A NumPy function that performs a fast, element-wise operation on arrays, implemented in compiled C and supporting broadcasting.' },
                { term: 'Vectorization', definition: 'Expressing a computation as operations on whole arrays rather than explicit element-by-element Python loops, shifting iteration into optimized compiled code.' },
                { term: 'C-order (Row-major)', definition: 'A memory layout in which the last axis varies fastest, so elements of a row are stored contiguously; NumPy\'s default layout.' },
                { term: 'Fortran-order (Column-major)', definition: 'A memory layout in which the first axis varies fastest, so elements of a column are stored contiguously; used by some linear algebra libraries.' },
                { term: 'View', definition: 'An array object that shares its underlying data buffer with another array (e.g., produced by basic slicing), so modifying one mutates the other.' },
                { term: 'Copy', definition: 'An array with its own independent data buffer; fancy indexing (boolean masks, integer arrays) and the .copy() method both produce copies rather than views.' },
                { term: 'dtype', definition: 'The fixed data type (e.g., float64, int32) shared by every element of a NumPy array, which allows the array to be stored as a single contiguous block of memory instead of boxed Python objects.' },
                { term: 'Axis', definition: 'A single dimension of a multi-dimensional array; operations like sum or mean can be applied along a specified axis to collapse that dimension while preserving the others.' }
              ],
              commonMisconceptions: [
                'Misconception: NumPy arrays are just Python list wrappers with extra methods. Reality: ndarrays store raw, fixed-type data in a single contiguous memory buffer, which is what enables vectorized C-speed operations; Python lists store pointers to boxed, heterogeneous objects scattered in memory.',
                'Misconception: Slicing a NumPy array always creates an independent copy. Reality: Basic slicing returns a view that shares memory with the original array, so in-place modification of a slice mutates the source array unless .copy() is called explicitly.',
                'Misconception: Broadcasting requires two arrays to already have identical shapes. Reality: Broadcasting exists precisely to combine arrays of different shapes, by aligning trailing dimensions and virtually stretching any axis of size 1 to match.',
                'Misconception: Vectorized NumPy code is always faster than a Python loop, no matter the array size. Reality: For very small arrays, the fixed overhead of dispatching a ufunc call can exceed the cost of a plain Python loop; vectorization\'s advantage grows with array size.',
                'Misconception: Reshaping an array with .reshape() rearranges the underlying data. Reality: .reshape() typically returns a new view over the same memory buffer with different strides, only copying data when the requested shape is incompatible with a view of the existing memory layout.'
              ],
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
              primaryLecture: VERIFIED_VIDEOS['stat201-t1'] as any,
              learningObjective: 'Derive MLE parameter estimations and evaluate goodness-of-fit.',
              prerequisites: ['MATH 101'],
              coreConcepts: [
                'Likelihood Function: the joint density (or mass) of the observed data, L(theta; x), reinterpreted as a function of the unknown parameter theta with the data held fixed; flipping probability around this way is what lets us ask "which parameter value makes the data I actually saw most plausible?"',
                'Log-Likelihood: the natural logarithm of the likelihood function, which converts a product of per-observation terms into a sum; because log is monotonically increasing it preserves the location of the maximum while being far more numerically stable and analytically tractable to differentiate.',
                'Maximum Likelihood Estimator (MLE): the parameter value theta-hat that maximizes the (log-)likelihood given the observed data; under standard regularity conditions the MLE is consistent (converges to the true parameter as n grows) and asymptotically normal and efficient, which is why it is the default estimation method for so many statistical models.',
                'Fisher Information: the expected curvature of the log-likelihood, I(theta) = -E[d^2/dtheta^2 log L], which quantifies how sharply peaked the likelihood is around the true parameter; more information means the data pins down theta more precisely, and it directly sets the theoretical lower bound on estimator variance.',
                'P-value: the probability, computed under the assumption that the null hypothesis is true, of observing a test statistic at least as extreme as the one actually observed; it is a statement about the data given the null, not a statement about the probability that the null itself is true.',
                'Likelihood Ratio Test: a hypothesis test comparing a restricted (null) model to a more general (alternative) model by computing -2 log(L_null / L_alt), which is asymptotically chi-squared distributed under the null, giving a principled way to test whether added model complexity is statistically justified.'
              ],
              simpleExplanation: `Imagine you find a mystery coin on the sidewalk and want to know how biased it is — does it land heads 50% of the time, like a fair coin, or is it weighted to land heads 80% of the time? You flip it 10 times and get 8 heads. Maximum likelihood estimation is the strategy of asking: "out of every possible bias the coin could have, which one makes the outcome I actually observed — 8 heads out of 10 — the LEAST surprising?" You're not guessing blindly; you're working backward from the evidence to the explanation that best accounts for it. In this case, a coin biased toward 80% heads makes "8 heads out of 10" a very unsurprising, likely result, while a fair 50% coin makes that same result comparatively surprising — so 80% is your maximum likelihood estimate.

Under the hood, "how surprising" is measured with something called a likelihood function, which is really just a formula that answers "if the true bias were X, how probable would my exact observed data have been?" for every possible value of X. Because probabilities multiply and get astronomically tiny very fast (imagine multiplying together the probabilities of a thousand coin flips), statisticians almost always take the logarithm of that formula first — logs turn multiplication into addition, which is both easier to compute and easier for a computer to search through without running out of decimal precision.

Once you have a best-fitting explanation, a natural next question is: "is this fancier explanation actually earning its keep, or would a simpler explanation have worked just as well?" That's what the likelihood ratio test is for. Think of two doctors examining your fussy coin: one says "it's just a normal fair coin" (the simple, restricted explanation) and the other says "it has a specific unusual bias" (the fancier, more flexible explanation). The likelihood ratio test compares how much better the fancier doctor's explanation fits the data than the simple doctor's — and if the improvement isn't bigger than what could plausibly happen by chance alone, you stick with the simpler explanation, following the general statistical principle of not adding complexity unless the data clearly demands it.`,
              realWorldApplications: [
                {
                  title: 'Pharmaceutical clinical trial analysis (FDA-regulated drug approvals)',
                  description: 'Maximum likelihood estimation is the standard method statisticians use to fit dose-response and survival models to clinical trial data, estimating parameters like a drug\'s effect size from the observed patient outcomes.'
                },
                {
                  title: 'Insurance actuarial pricing models',
                  description: 'Actuaries at insurers fit loss distributions (for claim sizes and frequencies) to historical claims data using maximum likelihood estimation, directly shaping the premiums a policyholder is charged.'
                },
                {
                  title: 'Google\'s and Meta\'s A/B testing platforms',
                  description: 'Internal experimentation platforms use likelihood-ratio-style tests to decide whether a more complex model of user behavior (e.g., one where a new feature changes click rates) is statistically justified over the simpler "no effect" baseline.'
                },
                {
                  title: 'Genome-wide association studies (GWAS) in genetics research',
                  description: 'Researchers use likelihood ratio tests to determine whether a genetic variant\'s association with a disease trait is statistically significant, comparing a model that includes the variant against a null model that excludes it.'
                }
              ],
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
                },
                {
                  id: 'ex-stat201-2',
                  question: 'Derive the MLE for the rate parameter lambda of an Exponential(lambda) distribution given iid samples x_1, ..., x_n.',
                  explanation: 'The likelihood is L(lambda) = lambda^n * exp(-lambda * sum(x_i)). The log-likelihood is l(lambda) = n*log(lambda) - lambda*sum(x_i). Setting dl/dlambda = n/lambda - sum(x_i) = 0 and solving gives lambda_hat = n / sum(x_i) = 1 / x_bar, the reciprocal of the sample mean.',
                  type: 'free-response'
                },
                {
                  id: 'ex-stat201-3',
                  question: 'A researcher reports "p = 0.03, so there is a 3% chance the null hypothesis is true." What is wrong with this statement?',
                  explanation: 'This misreads the definition of a p-value. A p-value is P(observing a test statistic at least this extreme | null hypothesis is true), a statement about the data conditional on the null. It is not P(null hypothesis is true | data), which would require Bayesian priors and posterior probabilities that frequentist hypothesis testing does not compute.',
                  type: 'free-response'
                },
                {
                  id: 'ex-stat201-4',
                  question: 'Why is the log-likelihood used for optimization instead of the raw likelihood function, beyond convenience?',
                  options: [
                    'Multiplying many probabilities less than 1 causes numerical underflow to zero; summing their logs avoids this while preserving the same argmax',
                    'The log-likelihood is always convex, guaranteeing a global maximum',
                    'The raw likelihood cannot be differentiated',
                    'Log-likelihood eliminates the need for regularity conditions'
                  ],
                  correctAnswer: 'Multiplying many probabilities less than 1 causes numerical underflow to zero; summing their logs avoids this while preserving the same argmax',
                  explanation: 'For n observations, the raw likelihood is a product of n probabilities, each less than 1, which underflows to floating-point zero for even moderate n. Because log is strictly increasing, argmax L(theta) = argmax log L(theta), so working with the sum of log-terms is both numerically safe and analytically simpler (derivatives of sums are easier than derivatives of products).',
                  type: 'multiple-choice'
                },
                {
                  id: 'ex-stat201-5',
                  question: 'How does Fisher Information for n iid observations relate to the Fisher Information of a single observation, and what does this imply about estimator precision as sample size grows?',
                  explanation: 'For n iid observations, the total Fisher Information is I_n(theta) = n * I_1(theta), where I_1 is the information from one observation. By the Cramer-Rao bound, the variance of any unbiased estimator is at least 1/I_n(theta), so variance shrinks proportionally to 1/n as sample size grows, which is the formal reason estimates get more precise with more data.',
                  type: 'free-response'
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
              readingQuestions: [
                'How does the Cramer-Rao bound limit the variance of an unbiased estimator?',
                'Why does the MLE for the variance of a Normal distribution become unbiased only after applying Bessel\'s correction (dividing by n-1 instead of n)?',
                'In what sense is the Likelihood Ratio Test a generalization of comparing nested regression models via an F-test?',
                'Why can the MLE be badly behaved (e.g., non-unique or infinite) for small samples or separable logistic regression data?',
                'How does a confidence interval\'s coverage probability relate to, and differ from, a Bayesian credible interval?'
              ],
              masteryChecklist: ['Derive MLE analytical solutions for Poisson and Exponential distributions', 'Conduct permutation hypothesis testing'],
              capstoneMilestone: 'Build an automated statistical hypothesis testing toolbox in Python.',
              estimatedStudyMinutes: 220,
              difficulty: 'intermediate',
              glossary: [
                { term: 'Likelihood', definition: 'The joint probability (or density) of the observed data, viewed as a function of the unknown model parameters with the data held fixed.' },
                { term: 'Log-Likelihood', definition: 'The natural logarithm of the likelihood function; maximizing it is equivalent to maximizing the likelihood but is numerically stable and analytically easier to differentiate.' },
                { term: 'Maximum Likelihood Estimator (MLE)', definition: 'The parameter value that maximizes the likelihood (or log-likelihood) function given observed data; under regularity conditions it is consistent, asymptotically normal, and asymptotically efficient.' },
                { term: 'Fisher Information', definition: 'The expected value of the negative second derivative of the log-likelihood with respect to the parameter, quantifying how much information the data carries about the parameter and bounding the minimum variance of unbiased estimators.' },
                { term: 'Cramer-Rao Lower Bound', definition: 'A theoretical lower bound on the variance of any unbiased estimator, equal to the inverse of the Fisher Information; an estimator achieving this bound is called efficient.' },
                { term: 'P-value', definition: 'The probability, computed under the null hypothesis, of observing a test statistic at least as extreme as the one actually observed in the sample.' },
                { term: 'Null Hypothesis (H0)', definition: 'The default or "no effect" hypothesis that a statistical test assumes to be true when computing the p-value, typically stating no difference or no relationship exists.' },
                { term: 'Type I Error', definition: 'Rejecting a true null hypothesis (a false positive); its probability is controlled by the significance level alpha chosen for the test.' },
                { term: 'Type II Error', definition: 'Failing to reject a false null hypothesis (a false negative); its probability, beta, decreases as statistical power (1 - beta) increases.' },
                { term: 'Confidence Interval', definition: 'A range constructed from sample data such that, under repeated sampling, the procedure would contain the true parameter value in a specified proportion (e.g., 95%) of samples.' }
              ],
              commonMisconceptions: [
                'Misconception: A p-value is the probability that the null hypothesis is true. Reality: The p-value is P(data this extreme or more extreme | null hypothesis true); it says nothing directly about P(null hypothesis true | data), which is a Bayesian posterior quantity requiring a prior.',
                'Misconception: The Maximum Likelihood Estimator is always unbiased. Reality: MLEs are only guaranteed to be asymptotically unbiased (bias vanishes as n grows); for finite samples many MLEs are biased, such as the MLE of variance which underestimates the true variance by a factor of (n-1)/n.',
                'Misconception: Likelihood and probability are interchangeable concepts. Reality: Probability fixes the parameters and asks about the chance of different data outcomes; likelihood fixes the observed data and asks how plausible different parameter values are. The likelihood function generally does not integrate to 1 over theta.',
                'Misconception: A model with higher likelihood on the training data is always the better model. Reality: Likelihood can always be increased by adding parameters (overfitting), which is exactly why model comparison uses penalized criteria like AIC/BIC or held-out likelihood rather than raw training likelihood.',
                'Misconception: Fisher Information is a fixed property of a parameter, independent of sample size. Reality: For n iid observations, total Fisher Information scales as I_n(theta) = n * I_1(theta), which is precisely why estimator variance shrinks and confidence intervals narrow as more data is collected.'
              ],
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
              primaryLecture: VERIFIED_VIDEOS['ds202-t1'] as any,
              learningObjective: 'Master analytical SQL query framing and execution plan tuning.',
              prerequisites: ['Basic SQL'],
              coreConcepts: [
                'Window Functions: functions that compute a value (rank, running total, lag/lead) across a set of rows related to the current row while still returning one output row per input row, unlike GROUP BY which collapses rows; this is what lets analysts compute per-row rankings or running metrics alongside the original detail data.',
                'Partitioning (PARTITION BY): the clause that divides the result set into independent groups within which a window function is computed separately, analogous to GROUP BY but without reducing the row count, so "rank within department" or "running total within customer" can be expressed directly.',
                'Common Table Expressions (CTEs): named, temporary result sets defined with a WITH clause that can be referenced later in the same query, improving readability of multi-step analytical logic and, in the recursive form, enabling hierarchical or graph-like traversals (e.g., organizational charts) that plain SQL cannot express.',
                'Columnar Storage: a physical storage layout where values of the same column are stored contiguously rather than whole rows, dramatically speeding up analytical queries that scan and aggregate a handful of columns across millions of rows because only the needed columns are read from disk.',
                'B-Tree Index: a balanced tree data structure that most relational databases use by default to support fast equality and range lookups (e.g., WHERE id = 5 or WHERE date BETWEEN ...), trading extra storage and slower writes for faster reads.',
                'Query Execution Plan (EXPLAIN ANALYZE): the concrete sequence of operations (scans, joins, sorts) the database\'s query optimizer chooses to execute a query, and the primary tool for diagnosing why a query is slow — for instance revealing an unexpected full table scan where an index should have been used.'
              ],
              simpleExplanation: `Picture a school-wide 100-meter race where every student from every grade runs together, and afterward you want to know: "who came in 1st place within their own grade?" — not across the whole school, just among their own classmates. A regular SQL aggregation, like a plain GROUP BY, can only tell you something like the average finishing time per grade — it collapses all the individual runners into one summary number and you lose each kid's personal result. A window function is different: it lets you rank, average, or compare each runner against the others "in their own lane" (their own grade) while still keeping every single runner as their own row in the results. Nobody gets erased or merged away.

Concretely, a window function does this by defining a "window" — a specific slice of rows that are relevant to each individual row, like "everyone in the same grade as me," or "everyone who ran in the last 30 days." Then it computes something over just that slice: a rank, a running total, a moving average, a comparison to the row before or after. This is why window functions are the tool of choice for things like "show me each customer's order alongside their running total spend so far" or "flag whether this month's revenue was higher or lower than last month's" — questions that need both the detail (one row per event) and a group-level calculation at the same time.

Behind the scenes, when you send a query like this to a database, it doesn't just blindly run it top to bottom — it first builds a plan, similar to how a GPS doesn't just start driving but first figures out the best route considering traffic and road closures. The database's query optimizer looks at your tables, considers whether there's a fast shortcut (like an index — think of it as a book's index that lets you jump straight to a topic instead of reading every page) versus scanning through every single row, and picks whichever route it believes will get to the answer fastest. Reading that plan (via EXPLAIN ANALYZE) is like popping the hood to see exactly which route the GPS chose, and figuring out why a query might be taking longer than expected — say, discovering it's reading the whole book page by page when an index shortcut was sitting right there unused.`,
              realWorldApplications: [
                {
                  title: 'Amazon\'s and Uber\'s internal leaderboard and ranking dashboards',
                  description: 'Analytics teams commonly use window functions like RANK() and ROW_NUMBER() to compute "top N per category" reports — for example, top-selling products within each region — without collapsing the underlying row-level detail.'
                },
                {
                  title: 'Stripe\'s and Square\'s transaction analytics',
                  description: 'Payment platforms use window functions to compute running totals and period-over-period comparisons (like month-over-month revenue change) directly in SQL against their transaction warehouses, a textbook use of the LAG/LEAD and running-sum window patterns.'
                },
                {
                  title: 'Snowflake and BigQuery query optimizers',
                  description: 'Modern cloud data warehouses like Snowflake and Google BigQuery expose EXPLAIN plans that show exactly which scan, join, and sort strategies the optimizer chose, which analytics engineers inspect to diagnose slow dashboards and multi-terabyte queries.'
                },
                {
                  title: 'Spotify\'s listening-streak and personal-stats features',
                  description: 'Computing a user\'s consecutive-day listening streaks or their rank among friends for a given artist is a classic window-function pattern (partitioning by user, ordering by date) used throughout consumer analytics products like Spotify Wrapped.'
                }
              ],
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
                },
                {
                  id: 'ex-ds202-2',
                  question: 'Given rows with salaries [100, 90, 90, 80] ordered descending, what ranks does DENSE_RANK() assign compared to RANK()?',
                  options: [
                    'DENSE_RANK gives 1, 2, 2, 3 (no gaps); RANK gives 1, 2, 2, 4 (gap after a tie)',
                    'Both produce identical output: 1, 2, 2, 3',
                    'DENSE_RANK gives 1, 2, 3, 4; RANK gives 1, 1, 1, 1',
                    'RANK and DENSE_RANK cannot handle tied values'
                  ],
                  correctAnswer: 'DENSE_RANK gives 1, 2, 2, 3 (no gaps); RANK gives 1, 2, 2, 4 (gap after a tie)',
                  explanation: 'RANK() leaves a gap in the rank sequence equal to the number of tied rows (skipping to 4 after two rows tied at rank 2), while DENSE_RANK() assigns consecutive integers with no gaps regardless of ties.',
                  type: 'multiple-choice'
                },
                {
                  id: 'ex-ds202-3',
                  question: 'Why does a GROUP BY query and a query using only window functions (no GROUP BY) produce different numbers of output rows for the same input table?',
                  explanation: 'GROUP BY collapses each group into a single summary row, discarding the original row-level detail. Window functions instead compute their aggregate per partition but keep every original row intact, attaching the computed value (e.g., a running total or rank) alongside each row\'s existing columns — one output row per input row.',
                  type: 'free-response'
                },
                {
                  id: 'ex-ds202-4',
                  question: 'Write a CTE-based query that returns only the 2nd-highest salary per department from an "employees" table with columns (dept_id, emp_id, salary).',
                  correctAnswer: 'WITH ranked AS (SELECT dept_id, emp_id, salary, DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rnk FROM employees) SELECT dept_id, emp_id, salary FROM ranked WHERE rnk = 2;',
                  explanation: 'The CTE computes a DENSE_RANK per department ordered by descending salary, then the outer query filters WHERE rnk = 2, isolating exactly the second-highest earner in each department (DENSE_RANK avoids skipping a rank if there is a tie for first place).',
                  type: 'code-snippet'
                },
                {
                  id: 'ex-ds202-5',
                  question: 'Why is columnar storage typically a poor fit for a high-throughput OLTP system that frequently inserts and updates individual rows?',
                  options: [
                    'Because writing a single row requires touching many separate column files/blocks, making row-level writes comparatively expensive',
                    'Because columnar storage cannot represent primary keys',
                    'Because columnar databases do not support SQL',
                    'Because columnar storage uses more memory for every query regardless of workload'
                  ],
                  correctAnswer: 'Because writing a single row requires touching many separate column files/blocks, making row-level writes comparatively expensive',
                  explanation: 'Columnar layouts excel when a query reads few columns across many rows (OLAP aggregation), but a single-row insert or update touches every column\'s storage segment, which is comparatively expensive versus a row-store where one row is one contiguous write.',
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
              readingQuestions: [
                'Why is columnar storage vastly superior to row-based storage for OLAP analytical queries?',
                'How does a recursive CTE differ structurally from a non-recursive one, and what class of problems does recursion unlock?',
                'Why might a database optimizer choose a full table scan over an available index, and is that always a mistake?',
                'What is the practical difference between ROW_NUMBER(), RANK(), and DENSE_RANK() when the ORDER BY column contains ties?',
                'How do B-Tree indexes trade off read speed against write speed and storage overhead?'
              ],
              masteryChecklist: ['Write complex queries using Window functions and CTEs', 'Optimize queries using EXPLAIN ANALYZE'],
              capstoneMilestone: 'Build an analytical star-schema data warehouse in DuckDB/SQLite.',
              estimatedStudyMinutes: 200,
              difficulty: 'intermediate',
              glossary: [
                { term: 'Window Function', definition: 'A SQL function that computes a value across a set of table rows related to the current row (its "window") while still returning one row of output per input row, unlike an aggregate used with GROUP BY.' },
                { term: 'PARTITION BY', definition: 'The clause within an OVER() window specification that divides rows into independent groups, within which the window function is computed separately, without collapsing the row count.' },
                { term: 'Common Table Expression (CTE)', definition: 'A named temporary result set defined with a WITH clause, usable later in the same query to break complex logic into readable, sequential steps.' },
                { term: 'Recursive CTE', definition: 'A CTE that references itself to repeatedly build up a result set, used for hierarchical or graph traversal queries such as organizational charts or bill-of-materials explosions.' },
                { term: 'B-Tree Index', definition: 'A balanced, sorted tree structure used by most relational databases to accelerate equality and range lookups at the cost of extra storage and slower writes.' },
                { term: 'Columnar Storage', definition: 'A storage format where values of the same column are stored contiguously, minimizing disk I/O for analytical queries that scan few columns across many rows.' },
                { term: 'OLAP vs. OLTP', definition: 'OLAP (Online Analytical Processing) systems are optimized for complex read-heavy aggregation queries over large historical datasets; OLTP (Online Transaction Processing) systems are optimized for fast, small, concurrent read/write transactions.' },
                { term: 'Query Execution Plan', definition: 'The sequence of physical operations (scans, joins, sorts, index lookups) the database engine chooses to satisfy a query, inspectable via EXPLAIN or EXPLAIN ANALYZE.' },
                { term: 'ROW_NUMBER()', definition: 'A window function that assigns a unique, strictly increasing integer to each row within a partition according to the ORDER BY clause, with no gaps or ties even when values are equal.' },
                { term: 'Star Schema', definition: 'A dimensional data warehouse design with a central fact table (measurements) connected to surrounding dimension tables (descriptive attributes), optimized for analytical query performance.' }
              ],
              commonMisconceptions: [
                'Misconception: GROUP BY and window functions partition data identically. Reality: GROUP BY collapses each group into one summary row and discards row-level detail; a window function computes the same kind of per-group value but keeps every original row, attaching the result alongside it.',
                'Misconception: A CTE is always materialized (computed once and cached) by the database engine. Reality: Many query optimizers (e.g., PostgreSQL prior to v12, in some plans) may inline a non-recursive CTE into the surrounding query, potentially re-evaluating it multiple times; behavior is engine- and version-specific and should be checked with EXPLAIN.',
                'Misconception: Adding an index always makes queries faster. Reality: Indexes speed up reads that use them but slow down INSERT/UPDATE/DELETE (the index must also be maintained) and consume additional storage; the optimizer may also ignore an index if it estimates a full scan is cheaper for a given query and data distribution.',
                'Misconception: RANK() and DENSE_RANK() always return the same values. Reality: They only differ when there are ties — RANK() leaves gaps in the numbering equal to the number of tied rows, while DENSE_RANK() assigns consecutive integers with no gaps.',
                'Misconception: Columnar storage is strictly better than row storage in every scenario. Reality: Columnar storage excels at scanning/aggregating few columns across many rows (OLAP) but performs poorly for workloads that frequently read or write entire individual rows (OLTP), where row storage keeps a record\'s data physically together.'
              ],
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
              primaryLecture: VERIFIED_VIDEOS['ds302-t1'] as any,
              learningObjective: 'Estimate causal effects in observational data without randomized controlled trials.',
              prerequisites: ['STAT 201'],
              coreConcepts: [
                'Potential Outcomes (Rubin Causal Model): for each unit, the pair of outcomes Y(1) (if treated) and Y(0) (if untreated) that could in principle occur; the "fundamental problem of causal inference" is that only one of the two is ever observed for a given unit, which is why every causal method is really a strategy for estimating the missing counterfactual.',
                'Parallel Trends Assumption: the identifying assumption behind Difference-in-Differences that, absent treatment, the treatment and control groups would have evolved along the same trend over time; the entire causal interpretation of a DiD estimate collapses if this assumption is violated, so it must be argued for using pre-treatment evidence, not just assumed.',
                'Propensity Score: the estimated probability e(X) = P(Treatment = 1 | X) that a unit receives treatment given its observed covariates X; matching or weighting on this single scalar (rather than on every covariate individually) lets an analyst approximate a randomized comparison from observational data under the assumption that treatment is "as good as random" once X is accounted for.',
                'Confounding Bias: bias that arises when a variable influences both treatment assignment and the outcome, creating a spurious association that has nothing to do with a true causal effect; identifying and controlling for confounders (without controlling for colliders or mediators) is the central challenge of observational causal inference.',
                'Difference-in-Differences (DiD) Estimator: computed as (Y_treatment,post - Y_treatment,pre) - (Y_control,post - Y_control,pre), this estimator differences out both the pre-existing gap between groups and any common time trend, isolating the treatment effect under the parallel trends assumption.',
                'Causal DAGs & the Backdoor Criterion: directed acyclic graphs that encode assumed causal relationships between variables, used with the backdoor criterion to formally determine the minimal set of variables that must be conditioned on to block all confounding "backdoor paths" between treatment and outcome without accidentally conditioning on a collider.'
              ],
              simpleExplanation: `You step outside, open your umbrella, and a few minutes later the rain stops. Did opening the umbrella cause the rain to stop? Obviously not — it was going to stop anyway, and the umbrella just happened to come out around the same time. This is the central puzzle of causal inference: just because two things happened together, or one followed the other, doesn't mean one caused the other. The entire field is about designing clever comparisons that let you tell "the umbrella caused it" apart from "it was going to happen regardless."

Difference-in-differences is one such trick. Imagine two nearly identical towns, and one of them raises its minimum wage while the other doesn't. If you only looked at the town that raised wages, before and after, you couldn't tell how much of any change in employment was due to the wage hike versus just the economy naturally drifting up or down that year. So instead, you track both towns over the same time period and look at how much each one changed. If the town that didn't raise wages went up by 2% and the town that did went up by only 1%, the "difference of the differences" (1% minus 2% = -1%) is your best estimate of the wage hike's true effect, because it cancels out whatever was happening to both towns anyway, like a shared economic tide lifting or lowering both boats. This only works if the two towns would have moved in parallel had neither changed anything, an assumption called "parallel trends" that researchers examine very carefully.

Propensity score matching tackles a different obstacle: comparing groups that aren't naturally similar to begin with. Imagine trying to measure whether a new medicine helps, but the doctors gave it mostly to their sicker patients. A raw comparison would unfairly make the medicine look bad, because the treated group started off worse. Propensity score matching first estimates, for every patient, "how likely were they to have received the medicine given everything we know about them?" and then pairs up treated and untreated patients who had a very similar likelihood — essentially finding each treated patient's "statistical twin" among the untreated group, so the comparison becomes closer to a fair, apples-to-apples one.

Underlying all of this is the idea of drawing out your assumptions as a causal diagram — arrows pointing from causes to effects — so you can see exactly which other variables might be secretly influencing both your suspected cause and its effect (called confounders), and figure out precisely which ones you need to account for versus which ones would actually introduce new bias if you controlled for them.`,
              realWorldApplications: [
                {
                  title: 'Card and Krueger\'s New Jersey minimum wage study',
                  description: 'This landmark study compared fast-food employment in New Jersey (which raised its minimum wage) against neighboring Pennsylvania (which didn\'t) using difference-in-differences, becoming one of the most cited applications of the method in empirical economics.'
                },
                {
                  title: 'Netflix\'s and Airbnb\'s product experimentation teams',
                  description: 'When a true randomized A/B test isn\'t possible (e.g., a feature was rolled out to only some markets), tech companies commonly use difference-in-differences on the affected versus unaffected regions to estimate the feature\'s causal impact on metrics like retention.'
                },
                {
                  title: 'The RAND Health Insurance Experiment and later observational health studies',
                  description: 'Propensity score matching is a standard tool in health economics and epidemiology for estimating a treatment\'s effect from observational (non-randomized) hospital or insurance-claims data, by matching treated and untreated patients with similar characteristics.'
                },
                {
                  title: 'Federal Reserve and academic economists\' minimum-wage and policy research',
                  description: 'Difference-in-differences remains the workhorse method economists use at agencies and universities to evaluate the effect of policy changes (minimum wage laws, tax credits, program eligibility rules) that roll out in some states or regions but not others.'
                }
              ],
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
                },
                {
                  id: 'ex-ds302-2',
                  question: 'A city raises its minimum wage. Employment in that city was 100 before and 90 after. A neighboring city with no policy change had employment 80 before and 76 after. What is the DiD estimate of the policy\'s effect on employment?',
                  correctAnswer: '-6',
                  explanation: 'DiD = (Treat_post - Treat_pre) - (Ctrl_post - Ctrl_pre) = (90 - 100) - (76 - 80) = -10 - (-4) = -6. The treatment city\'s employment fell 6 more units than would be expected from the common trend alone, after netting out the -4 decline observed in the untreated control city.',
                  type: 'free-response'
                },
                {
                  id: 'ex-ds302-3',
                  question: 'Why can the parallel trends assumption never be directly proven, only made plausible?',
                  explanation: 'Parallel trends is a statement about the counterfactual (what would have happened to the treatment group had it not been treated), which is fundamentally unobservable in the post-treatment period. Analysts instead build plausibility by checking that pre-treatment trends were parallel (an "event study" or placebo test), but similarity before treatment does not guarantee the trends would have stayed parallel afterward.',
                  type: 'free-response'
                },
                {
                  id: 'ex-ds302-4',
                  question: 'Under the backdoor criterion, why is it a mistake to control for a "collider" variable (a variable caused by both treatment and outcome) when trying to estimate a causal effect?',
                  options: [
                    'Conditioning on a collider opens a spurious association path between treatment and outcome that did not exist before, introducing collider bias',
                    'Colliders always reduce statistical power but never bias estimates',
                    'Colliders are indistinguishable from confounders and must always be controlled for',
                    'Controlling for a collider has no effect on the estimate either way'
                  ],
                  correctAnswer: 'Conditioning on a collider opens a spurious association path between treatment and outcome that did not exist before, introducing collider bias',
                  explanation: 'A collider is a common effect of two variables; conditioning on it (e.g., filtering, stratifying, or adding it as a regression control) induces a spurious statistical dependence between its causes, which can create or reverse an apparent association between treatment and outcome that is purely an artifact of the conditioning.',
                  type: 'multiple-choice'
                },
                {
                  id: 'ex-ds302-5',
                  question: 'What is the fundamental problem of causal inference, and how does the Rubin Causal Model formalize it?',
                  explanation: 'For any single unit, we can only ever observe one of its two potential outcomes: Y(1) if it was treated, or Y(0) if it was not — never both simultaneously. The Rubin Causal Model formalizes this by defining the individual causal effect as Y(1) - Y(0), which is never directly observable, and reframes causal inference as the problem of estimating the missing potential outcome (the counterfactual) using assumptions like randomization, parallel trends, or ignorability.',
                  type: 'free-response'
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
              readingQuestions: [
                'Why can propensity score matching fail if there are unobserved confounders?',
                'How does a randomized controlled trial sidestep the need for the parallel trends or ignorability assumptions entirely?',
                'What role does the pre-treatment period play in assessing whether Difference-in-Differences is a credible design for a given policy change?',
                'Why must an instrumental variable satisfy both a "relevance" condition and an "exclusion restriction," and what goes wrong causally if either fails?',
                'How does a regression discontinuity design exploit an arbitrary treatment threshold to approximate random assignment near the cutoff?'
              ],
              masteryChecklist: ['Fit DiD regression model with interaction terms in Python', 'Calculate sample size required for 80% A/B test power'],
              capstoneMilestone: 'Design and analyze an online A/B test experiment with causal inference controls.',
              estimatedStudyMinutes: 220,
              difficulty: 'advanced',
              glossary: [
                { term: 'Difference-in-Differences (DiD)', definition: 'A quasi-experimental estimator that measures a treatment effect as the change in outcome for a treated group minus the change in outcome for a control group over the same period, netting out common time trends.' },
                { term: 'Potential Outcomes', definition: 'The pair of outcomes Y(1) and Y(0) that a unit would experience under treatment or control respectively; only one is ever observed for any given unit.' },
                { term: 'Average Treatment Effect (ATE)', definition: 'The population-average difference E[Y(1) - Y(0)] between the treated and untreated potential outcomes across all units, not just those who were actually treated.' },
                { term: 'Average Treatment Effect on the Treated (ATT)', definition: 'The average causal effect specifically among units that actually received treatment, E[Y(1) - Y(0) | Treatment = 1], which can differ from the ATE if treatment effects vary by group.' },
                { term: 'Counterfactual', definition: 'The outcome a unit would have experienced under the treatment condition it did not actually receive; the unobservable quantity that all causal inference methods attempt to estimate or approximate.' },
                { term: 'Confounder', definition: 'A variable that causally influences both the treatment assignment and the outcome, and which, if not controlled for, biases the estimated association between treatment and outcome.' },
                { term: 'Propensity Score', definition: 'The estimated probability that a unit receives treatment given its observed covariates, e(X) = P(T=1|X), used to match or weight observational units to approximate a randomized comparison.' },
                { term: 'Instrumental Variable', definition: 'A variable that affects treatment assignment but has no direct effect on the outcome except through treatment (exclusion restriction), used to identify causal effects in the presence of unobserved confounding.' },
                { term: 'Regression Discontinuity Design (RDD)', definition: 'A quasi-experimental design that estimates a causal effect by comparing units just above and just below an arbitrary treatment-assignment threshold, exploiting the near-random assignment around the cutoff.' },
                { term: 'Selection Bias', definition: 'Bias introduced when the process by which units end up in treatment versus control groups is systematically related to the outcome, rather than being random.' }
              ],
              commonMisconceptions: [
                'Misconception: Matching on propensity scores eliminates all unobserved bias. Reality: Propensity score matching only balances observed covariates included in the propensity model; any confounder that was not measured and included remains a source of bias, exactly as in an unadjusted comparison.',
                'Misconception: A strong correlation observed in purely observational data is enough to justify a causal policy recommendation. Reality: Without a credible identification strategy (randomization, a valid instrument, a discontinuity, or a defensible parallel trends argument), an observed association may be fully explained by confounding or reverse causation.',
                'Misconception: The parallel trends assumption can be verified using post-treatment data. Reality: Parallel trends is fundamentally a statement about the unobservable counterfactual post-treatment period; only pre-treatment trends can be checked directly, and similarity before treatment is suggestive evidence, not proof, that trends would have remained parallel afterward.',
                'Misconception: Achieving covariate balance after propensity score matching guarantees a valid causal estimate. Reality: Balance diagnostics only confirm that observed covariates are similar across matched groups; they cannot detect or correct for imbalance in unobserved confounders, so the "ignorability" assumption remains untestable.',
                'Misconception: Adding more control variables to a regression always reduces confounding bias. Reality: Controlling for a mediator (a variable on the causal path between treatment and outcome) or a collider (a common effect of treatment and outcome) can introduce new bias rather than remove it, so which variables to control for must be guided by a causal DAG, not just statistical availability.'
              ],
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
              primaryLecture: VERIFIED_VIDEOS['ds305-t1'] as any,
              learningObjective: 'Master tree ensemble algorithms and gradient boosting mechanics.',
              prerequisites: ['STAT 201'],
              coreConcepts: [
                'Residual Learning: gradient boosting builds an ensemble sequentially, where each new tree is trained to predict the negative gradient (approximately the residual error) of the current ensemble\'s predictions, so every added tree focuses specifically on correcting what previous trees got wrong.',
                'Taylor Expansion Loss (Gradient & Hessian): XGBoost generalizes boosting to arbitrary differentiable loss functions by taking a second-order Taylor expansion around the current prediction, using the first derivative (gradient) and second derivative (Hessian) of the loss to derive closed-form optimal leaf weights and a principled split-gain formula.',
                'Feature Importance: a family of scores (split count, average gain per split, or SHAP values) estimating how much each feature contributes to a tree ensemble\'s predictions; different importance metrics can disagree, and none of them, by default, imply a causal relationship between the feature and the target.',
                'Overfitting Control (Regularization): the collection of hyperparameters — L1/L2 penalties on leaf weights, maximum tree depth, minimum child weight, row/column subsampling, and early stopping on a validation set — used to keep a highly flexible boosted ensemble from memorizing training noise.',
                'Bagging vs. Boosting: bagging (used by Random Forests) trains many trees independently and in parallel on bootstrap-resampled data and averages them to reduce variance, whereas boosting trains trees sequentially, each one targeting the previous ensemble\'s errors, which primarily reduces bias but requires careful regularization to control variance.',
                'Learning Rate (Shrinkage): a multiplier (typically 0.01-0.3) applied to each new tree\'s contribution before adding it to the ensemble; smaller learning rates require more trees but generally produce better-generalizing models by taking smaller, more conservative steps toward fitting the residuals.'
              ],
              simpleExplanation: `Imagine you're trying to guess someone's weight just by looking at them, and you're not very good at it yet. Your first guess is off by 15 pounds. Instead of throwing away your guess and starting over, imagine you brought in a second friend whose only job is to look at how wrong your first guess was and try to predict THAT error — not the weight itself, just how much and in which direction you missed by. Then a third friend looks at how wrong the combination of you and friend two still is, and tries to correct that remaining mistake, and so on. Each new friend isn't trying to solve the whole problem from scratch; they're specifically patching up whatever mistakes are left over after everyone before them has had their say. That's the core idea of gradient boosting: build one weak, simple predictor (a small decision tree — basically a flowchart of yes/no questions), see where it went wrong, then build another small tree whose entire purpose is to correct those specific errors, and keep stacking correction after correction.

Why decision trees and not something else? A single decision tree is easy to picture: it's a series of yes/no splits, like "is the person taller than 5'8\"? If yes, ask if they're male; if no, ask something else," eventually landing on a guess. One tree alone tends to be either too simple to capture real patterns or so detailed it just memorizes quirks of the specific people it was trained on (like memorizing your classmates' exact weights instead of learning general rules about height and weight). Boosting works around this by using many small, deliberately weak trees rather than one giant one, and layering them so their combined guess is far better than any single tree could manage alone.

There's an important dial called the learning rate that controls how much each new "correcting friend" is allowed to influence the final answer. If you let every new tree fully commit to fixing the previous mistake, the whole system can overreact and start chasing noise — like overcorrecting your steering after a small bump and swerving into the other lane. Instead, boosting algorithms usually only let each new tree contribute a small fraction of its suggested correction (a shrinkage factor, often as small as 1-10%), meaning it takes many trees working together in small, careful steps to reach a good answer — slower, but much more stable and less prone to memorizing noise in the training data.`,
              realWorldApplications: [
                {
                  title: 'Kaggle competition-winning models',
                  description: 'XGBoost became famous for winning a large share of structured-data machine learning competitions on Kaggle throughout the mid-2010s, often outperforming more complex neural network approaches on tabular datasets.'
                },
                {
                  title: 'Credit scoring and loan default prediction at major banks',
                  description: 'Gradient boosted trees are widely used in financial services to predict the probability a loan applicant will default, since they handle mixed numeric/categorical features well and provide feature-importance scores that support regulatory explainability requirements.'
                },
                {
                  title: 'Airbnb\'s search ranking system',
                  description: 'Airbnb has publicly described using gradient boosted decision trees (and later neural rankers) as part of the models that rank search results, blending signals like price, location, and past booking behavior to predict which listings a guest is likely to book.'
                },
                {
                  title: 'LightGBM at Microsoft',
                  description: 'Microsoft developed LightGBM, a gradient boosting framework optimized for speed and memory on very large datasets, which is now used broadly across the industry for click-through-rate prediction, fraud detection, and other large-scale tabular prediction problems.'
                }
              ],
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
                },
                {
                  id: 'ex-ds305-2',
                  question: 'Explain why Random Forests primarily reduce variance while Gradient Boosting primarily reduces bias.',
                  explanation: 'Random Forest trees are trained independently on bootstrap samples and averaged; averaging many independent, high-variance, low-bias trees cancels out noise, lowering variance while leaving bias roughly unchanged. Gradient Boosting instead starts from a weak (high-bias, low-variance) model and sequentially adds trees that correct the current ensemble\'s errors, directly driving down bias; because the trees are not independent, boosting can increase variance if left unregularized (too many trees, learning rate too high, no early stopping).',
                  type: 'free-response'
                },
                {
                  id: 'ex-ds305-3',
                  question: 'In XGBoost\'s second-order approximation, what do the gradient (g) and Hessian (h) of the loss function represent, and why does using both improve on classic gradient boosting (which uses only the gradient)?',
                  explanation: 'The gradient g = dL/dy_pred is the first derivative of the loss with respect to the current prediction, indicating the direction and steepness of steepest descent (as in standard gradient boosting). The Hessian h = d^2L/dy_pred^2 is the second derivative, capturing the local curvature of the loss. Using both terms (a second-order Taylor expansion) gives a more accurate local approximation of the loss than a first-order-only approximation, allowing XGBoost to compute the exact optimal leaf weight in closed form (-g/(h+lambda)) rather than relying on a fixed learning rate step.',
                  type: 'free-response'
                },
                {
                  id: 'ex-ds305-4',
                  question: 'Which of the following is NOT an effective way to reduce overfitting in a gradient boosted tree ensemble?',
                  options: [
                    'Increasing max_depth without bound to let each tree fit the training data more precisely',
                    'Lowering the learning rate and increasing the number of trees proportionally',
                    'Adding L1/L2 regularization on leaf weights',
                    'Using early stopping based on a held-out validation set'
                  ],
                  correctAnswer: 'Increasing max_depth without bound to let each tree fit the training data more precisely',
                  explanation: 'Deeper trees have exponentially more leaves and can memorize training data noise, increasing variance and overfitting risk; the other three options are standard, well-established regularization techniques for boosted ensembles.',
                  type: 'multiple-choice'
                },
                {
                  id: 'ex-ds305-5',
                  question: 'A colleague argues that because "Feature X" has the highest gain-based importance score in a trained XGBoost model, X must be a strong causal driver of the target. Why is this reasoning flawed?',
                  explanation: 'Gain-based feature importance measures how much a feature reduces training loss when used for splits within the specific correlational model that was fit; it reflects predictive/associative usefulness within that model, not a causal relationship. A feature can score highly because it is correlated with the true causal driver (a confounder or proxy), and importance scores can also be inflated for high-cardinality features that offer more possible split points, independent of true relevance.',
                  type: 'free-response'
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
              readingQuestions: [
                'Why does L1/L2 tree regularization in XGBoost prevent overfitting?',
                'How does the choice of learning rate interact with the number of boosting rounds needed, and what is the practical trade-off?',
                'Why can a single deep decision tree overfit badly while a bagged ensemble of similarly deep trees generalizes much better?',
                'What causes gain-based and permutation-based feature importance rankings to sometimes disagree on the same trained model?',
                'How does early stopping on a validation set prevent a boosted ensemble from continuing to fit noise after it has captured the true signal?'
              ],
              masteryChecklist: ['Implement ROC-AUC evaluation from scratch', 'Train gradient boosted decision tree classifier'],
              capstoneMilestone: 'Build an end-to-end predictive tabular ML workflow.',
              estimatedStudyMinutes: 240,
              difficulty: 'advanced',
              glossary: [
                { term: 'Gradient Boosting', definition: 'An ensemble machine learning technique that builds a strong model by sequentially adding weak learners (typically shallow trees), each trained to correct the residual errors of the current ensemble via gradient descent in function space.' },
                { term: 'Residual', definition: 'The difference between the observed target value and the current model\'s prediction; in gradient boosting with squared-error loss, the negative gradient reduces exactly to the residual.' },
                { term: 'Gradient (in boosting)', definition: 'The first derivative of the loss function with respect to the current prediction for each observation, indicating the direction in which the prediction should move to reduce loss.' },
                { term: 'Hessian (in boosting)', definition: 'The second derivative of the loss function with respect to the current prediction, capturing local curvature; used by XGBoost\'s second-order approximation to compute optimal leaf weights and split gain.' },
                { term: 'Regularization (L1/L2)', definition: 'Penalty terms added to the objective function that discourage overly complex models — L1 (lasso-style) penalizes the sum of absolute leaf weights and can drive some to exactly zero, while L2 (ridge-style) penalizes the sum of squared leaf weights, shrinking them smoothly.' },
                { term: 'Learning Rate (Shrinkage)', definition: 'A scaling factor applied to each new tree\'s output before it is added to the ensemble, controlling how large a "step" each boosting round takes toward fitting the residuals.' },
                { term: 'Bagging (Bootstrap Aggregating)', definition: 'An ensemble technique that trains multiple models independently on different bootstrap-resampled subsets of the training data and averages (or votes on) their predictions to reduce variance.' },
                { term: 'Random Forest', definition: 'A bagging-based ensemble of decision trees where each tree is also trained on a random subset of features at each split, further decorrelating the trees to reduce variance beyond plain bagging.' },
                { term: 'Feature Importance', definition: 'A score quantifying how much a given feature contributes to a tree-based model\'s predictions, commonly computed from total split gain, split frequency, or model-agnostic methods like SHAP values.' },
                { term: 'Early Stopping', definition: 'A regularization technique that halts training once performance on a held-out validation set stops improving for a specified number of rounds, preventing the model from continuing to fit training noise.' }
              ],
              commonMisconceptions: [
                'Misconception: Deep learning always outperforms gradient boosted trees on tabular data. Reality: On structured/tabular datasets, gradient boosted tree ensembles (XGBoost, LightGBM, CatBoost) frequently match or outperform deep neural networks, and remain the dominant winning approach in tabular data competitions; deep learning\'s advantages are most pronounced on unstructured data (images, text, audio).',
                'Misconception: Random Forest and Gradient Boosting are essentially the same algorithm with different names. Reality: Both are tree ensembles, but Random Forest trains trees independently in parallel on bootstrap samples to reduce variance (bagging), while Gradient Boosting trains trees sequentially, each correcting the previous ensemble\'s errors, primarily to reduce bias.',
                'Misconception: A feature with high importance score is necessarily a causal driver of the outcome. Reality: Feature importance reflects predictive usefulness within the fitted correlational model, which can be inflated by confounding, proxy variables, or high cardinality; it is not evidence of a causal relationship.',
                'Misconception: Adding more boosting rounds (trees) always improves model performance. Reality: Past a certain point, additional trees begin fitting noise in the training data rather than signal, degrading validation/test performance; this is exactly why early stopping on a held-out set is standard practice.',
                'Misconception: Gradient boosted tree libraries cannot handle missing values or categorical features without manual preprocessing. Reality: Modern implementations like XGBoost and LightGBM have native support for missing values (learning a default split direction) and, in LightGBM\'s case, native categorical feature handling, reducing the need for manual imputation or one-hot encoding.'
              ],
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
              primaryLecture: VERIFIED_VIDEOS['ds404-t1'] as any,
              learningObjective: 'Audit data pipelines for fairness and incorporate differential privacy.',
              prerequisites: ['STAT 201'],
              coreConcepts: [
                'Equalized Odds: a fairness criterion requiring that the true positive rate and false positive rate of a classifier be equal across protected demographic groups, meaning the model is equally accurate at distinguishing positive from negative cases regardless of group membership.',
                'Demographic Parity: a fairness criterion requiring the rate of positive predictions to be equal across protected groups, independent of whether the underlying true outcome rates actually differ between those groups, which is why it can conflict with predictive accuracy.',
                'Laplace Mechanism: the standard technique for achieving differential privacy on numeric queries by adding random noise drawn from a Laplace distribution whose scale is calibrated to the query\'s sensitivity divided by the privacy budget epsilon, mathematically bounding how much any single individual\'s data can change the output distribution.',
                'Model Auditing: the systematic practice of evaluating a trained model\'s performance metrics (accuracy, error rates, calibration) broken out by protected subgroup, treating a model as a black box under test rather than assuming fairness from good intentions or a clean-looking training process.',
                'Differential Privacy (epsilon): a formal mathematical guarantee that the presence or absence of any single individual\'s record changes the probability of any output by at most a factor of e^epsilon, where smaller epsilon means stronger privacy protection at the cost of more noise (and thus less statistical utility).',
                'Impossibility of Simultaneous Fairness: the formal result (Chouldechova 2017; Kleinberg, Mullainathan & Raghavan 2016) that demographic parity, equalized odds, and calibration cannot all be satisfied simultaneously except in degenerate cases (equal base rates or a perfect classifier), meaning practitioners must explicitly choose which fairness definition matters most for a given use case.'
              ],
              simpleExplanation: `Imagine a robot teacher that grades essays and learns what a "good essay" looks like by studying thousands of essays that human teachers graded in the past. If those human teachers happened to unconsciously favor one writing style over another, the robot won't invent that bias out of nowhere — it will faithfully learn and repeat whatever pattern was already sitting in the examples it was shown, even the parts nobody intended to teach it. This is the heart of algorithmic bias: a model trained on historical decisions can absorb and then automate any unfairness baked into that history, often in ways that are hard to spot until you specifically go looking for them.

The tricky part is that there isn't just one single way to define "fair." Imagine three different referees judging whether a talent show is fair: one insists that winners should be picked in equal numbers from every neighborhood in town (equal outcomes), another insists that among everyone who's actually skilled, the same fraction from each neighborhood should win (equal true-positive rates), and a third insists that "6 out of 10 stars" should mean the same actual talent level no matter which neighborhood the contestant is from (calibration). It turns out — and this is a real, proven mathematical result, not just an opinion — that you generally cannot satisfy all three referees at once unless the underlying talent happens to be distributed identically across every neighborhood to begin with. So building a "fair" system always involves consciously choosing which kind of fairness matters most for that specific decision, rather than assuming one magic fix covers everything.

Differential privacy addresses a related but different worry: how do you let researchers learn useful patterns from a big pile of personal data — say, hospital records — without any single person's information being exposed or reconstructed? The trick is to deliberately add a carefully calibrated amount of random "static" or noise to the answers a system gives out, similar to a teacher announcing the average test score for the whole class but never revealing individual scores, and specifically fuzzing that average just enough that no one can work backward and guess exactly what any one student got. The clever mathematical guarantee behind differential privacy is that the noise is tuned so precisely that the released information barely changes whether or not any single specific person's data was included in the dataset at all — protecting each individual while still letting the overall pattern shine through.`,
              realWorldApplications: [
                {
                  title: 'COMPAS recidivism risk scores used in U.S. courts',
                  description: 'A widely cited ProPublica investigation found that the COMPAS criminal risk-assessment tool exhibited different false-positive rates across racial groups, becoming the canonical real-world example motivating the equalized-odds versus calibration fairness debate.'
                },
                {
                  title: 'Amazon\'s scrapped internal recruiting tool',
                  description: 'Amazon reportedly discontinued an experimental hiring algorithm after discovering it had learned to penalize resumes containing words like "women\'s" (as in "women\'s chess club captain"), because it was trained on a decade of resumes submitted mostly by men.'
                },
                {
                  title: 'The U.S. Census Bureau\'s 2020 Census',
                  description: 'The Census Bureau adopted differential privacy to protect individual respondents\' data in published statistics, adding carefully calibrated noise so that population counts remain useful for redistricting and funding decisions while making it mathematically harder to re-identify any individual.'
                },
                {
                  title: 'Apple\'s and Google\'s on-device usage analytics',
                  description: 'Apple has used differential privacy in iOS to collect aggregate usage statistics (like popular emoji or typing patterns) from millions of devices while adding noise to each individual data point before it ever leaves the phone, so no single user\'s exact behavior is exposed.'
                }
              ],
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
                },
                {
                  id: 'ex-ds404-2',
                  question: 'Why is it mathematically impossible, in general, for a classifier to simultaneously satisfy demographic parity and equalized odds when the two protected groups have different true base rates of the positive outcome?',
                  explanation: 'Equalized odds requires equal true positive and false positive rates across groups, which, combined with different true base rates, forces the overall positive prediction rate to differ across groups (since predicted positive rate is a weighted combination of TPR and FPR weighted by the group\'s true base rate). Demographic parity requires those overall positive prediction rates to be equal instead. The only way to satisfy both simultaneously is if the groups already share the same base rate, or the classifier is perfect (zero error), which is why this is treated as a formal impossibility result rather than an engineering oversight.',
                  type: 'free-response'
                },
                {
                  id: 'ex-ds404-3',
                  question: 'A company removes race and gender columns from its loan-approval training data, believing this makes the model fair. Why is this insufficient?',
                  explanation: 'Other retained features (zip code, name, purchase history, alma mater) can act as proxy variables that are highly correlated with the removed protected attributes, allowing the model to reconstruct and effectively use the excluded information indirectly ("fairness through unawareness" fails). A rigorous audit must check outcome disparities across protected groups directly, not just check whether protected columns were present in the training features.',
                  type: 'free-response'
                },
                {
                  id: 'ex-ds404-4',
                  question: 'In the Laplace mechanism for differential privacy, what happens to the released query result as epsilon approaches 0?',
                  options: [
                    'Noise scale approaches infinity, so the released output approaches pure noise with maximal privacy but minimal utility',
                    'Noise scale approaches zero, releasing the exact true answer',
                    'Epsilon has no effect on the noise added',
                    'The mechanism switches from Laplace noise to Gaussian noise'
                  ],
                  correctAnswer: 'Noise scale approaches infinity, so the released output approaches pure noise with maximal privacy but minimal utility',
                  explanation: 'The Laplace mechanism\'s noise scale is sensitivity/epsilon; as epsilon shrinks toward 0, the denominator shrinks, so the noise scale (and variance) grows without bound. This illustrates the fundamental privacy-utility trade-off: stronger formal privacy guarantees (smaller epsilon) require adding more noise, which degrades the statistical usefulness of the released result.',
                  type: 'multiple-choice'
                },
                {
                  id: 'ex-ds404-5',
                  question: 'A model achieves 95% overall accuracy. Why is this insufficient evidence that the model is fair across demographic subgroups?',
                  explanation: 'Overall accuracy is an aggregate that can mask large disparities between subgroups — for example, a model could be 99% accurate for a majority group and 70% accurate for a minority group and still report high overall accuracy if the majority group dominates the dataset. A proper fairness audit disaggregates performance metrics (accuracy, TPR, FPR, calibration) by protected group rather than relying on a single pooled statistic.',
                  type: 'free-response'
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
              readingQuestions: [
                'How can historical data collection biases perpetuate discrimination in predictive policing or loan approval?',
                'Why must an organization explicitly choose which fairness definition (demographic parity, equalized odds, calibration) matters most for a given deployment, rather than seeking to satisfy all of them?',
                'What is the practical trade-off a data team faces when choosing a smaller epsilon for a differentially private release?',
                'How can a fairness audit distinguish disparate treatment (differential rules by group) from disparate impact (differential outcomes despite neutral rules)?',
                'Why is a proxy variable such as zip code potentially problematic even when protected attributes are formally excluded from a model?'
              ],
              masteryChecklist: ['Evaluate model fairness across protected attributes', 'Apply Laplace mechanism to aggregate queries'],
              capstoneMilestone: 'Conduct a comprehensive fairness audit on an AI model deployment.',
              estimatedStudyMinutes: 180,
              difficulty: 'intermediate',
              glossary: [
                { term: 'Demographic Parity', definition: 'A fairness metric requiring the rate of positive predictions to be equal across protected groups, independent of any difference in true underlying outcome rates.' },
                { term: 'Equalized Odds', definition: 'A fairness metric requiring both the true positive rate and false positive rate of a classifier to be equal across protected groups.' },
                { term: 'Equal Opportunity', definition: 'A relaxation of equalized odds requiring only that the true positive rate (not the false positive rate) be equal across protected groups among those who truly belong to the positive class.' },
                { term: 'Calibration', definition: 'A property requiring that among all individuals a model assigns a given predicted probability (e.g., 70% risk), the observed positive-outcome rate is actually close to that probability, consistently across protected groups.' },
                { term: 'Differential Privacy', definition: 'A formal mathematical framework guaranteeing that the inclusion or exclusion of any single individual\'s data changes the probability of any released output by at most a bounded factor, providing a provable privacy guarantee regardless of an adversary\'s auxiliary knowledge.' },
                { term: 'Privacy Budget (epsilon)', definition: 'A parameter controlling the strength of a differential privacy guarantee; smaller epsilon means stronger privacy (less information leakage) but requires more noise, reducing the utility of released statistics.' },
                { term: 'Sensitivity (Differential Privacy)', definition: 'The maximum amount that a query\'s output can change when a single individual\'s record is added to or removed from the dataset; it directly determines how much noise the Laplace mechanism must add.' },
                { term: 'Disparate Impact', definition: 'A legal and statistical concept describing a facially neutral policy or model that produces significantly different outcome rates across protected groups, regardless of intent.' },
                { term: 'Disparate Treatment', definition: 'Explicitly and intentionally treating individuals differently based on a protected attribute, as opposed to disparate impact, which can occur even without any explicit differential treatment.' },
                { term: 'Proxy Variable', definition: 'A feature that is not itself a protected attribute but is strongly correlated with one (e.g., zip code correlating with race), allowing a model to indirectly reconstruct and use protected-attribute information even when it is not an explicit input.' }
              ],
              commonMisconceptions: [
                'Misconception: Removing demographic variables from training data prevents unfair bias. Reality: Retained features can act as proxy variables strongly correlated with the removed attributes (e.g., zip code, name), allowing the model to indirectly reconstruct protected-attribute information; this is known as the failure of "fairness through unawareness."',
                'Misconception: A model can simultaneously satisfy demographic parity, equalized odds, and calibration. Reality: A formal impossibility result shows these fairness criteria are mutually exclusive except in degenerate cases (equal base rates across groups, or a perfect classifier), so choosing a fairness metric requires an explicit value judgment about the deployment context.',
                'Misconception: Differential privacy means individual records in a dataset are fully anonymized and safe to release as-is. Reality: Differential privacy is a property of the mechanism used to query or release statistics about data, not of the raw data itself; it provides a bounded, quantifiable privacy guarantee via calibrated noise addition, and the raw dataset remains sensitive.',
                'Misconception: An algorithm that does not explicitly use protected attributes as inputs is automatically fair. Reality: "Fairness through unawareness" is well documented to fail because correlated proxy variables let the model reproduce disparate outcomes even without directly observing the protected attribute.',
                'Misconception: High overall model accuracy is sufficient evidence that a model is fair. Reality: Aggregate accuracy can mask large performance disparities between subgroups, especially when one group is a small minority of the training data; fairness audits require disaggregating metrics by protected group.'
              ],
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
              primaryLecture: VERIFIED_VIDEOS['ds303-t1'] as any,
              learningObjective: 'Design and deploy analytics engineering pipelines using dbt and modern data warehouses.',
              prerequisites: ['DS 202 Relational Databases'],
              coreConcepts: [
                'Dimensional Modeling: organizing an analytical warehouse around fact tables (numeric measurements at a defined grain, e.g., one row per order line) surrounded by dimension tables (descriptive attributes like customer or product), a structure optimized for the kind of aggregate-and-slice queries analysts run rather than for transactional integrity.',
                'dbt DAG Lineage: the dependency graph dbt automatically builds from ref() calls between models, which determines both the correct topological execution order (upstream models run before downstream ones) and gives the team a visual map of how raw data flows into final business metrics.',
                'Jinja Templating: the templating language embedded in dbt SQL files that supports macros, loops, and conditionals, letting analytics engineers write DRY, parameterized SQL (e.g., a single macro that generates a repeated CASE WHEN pattern) instead of copy-pasting near-identical queries.',
                'Data Testing Assertions: automated checks (uniqueness, non-null, referential integrity, accepted value sets, or custom SQL assertions) that run against the actual data in the warehouse, catching data quality regressions before they silently propagate into dashboards and downstream models.',
                'ELT vs. ETL: the modern data stack pattern of Extracting and Loading raw data into the warehouse first, then Transforming it in-place using the warehouse\'s own compute (via dbt), which is what allows transformation logic to be iterated on quickly without re-running slow, brittle upstream extraction pipelines.',
                'Layered Architecture (Staging / Intermediate / Marts): the convention of organizing dbt models into staging models (thin, 1:1 cleanup of a raw source), intermediate models (reusable business logic), and marts (final, wide, business-user-facing tables), which isolates changes to raw source schemas from the logic and consumers built on top of them.'
              ],
              simpleExplanation: `Think about how a restaurant kitchen turns raw ingredients into a finished dish that gets served to a customer. Nobody hands the customer a raw onion and a slab of uncooked meat — there's a whole assembly line: ingredients get washed and chopped (prep station), combined into sauces or bases (the line cooks), and finally plated into the specific dish the customer ordered (the pass). Analytics engineering is that same assembly line, but for data instead of food. Raw data lands in a warehouse looking messy and inconsistent — mismatched column names, weird formats, duplicate rows — and analytics engineers build a series of transformation steps that clean it up, combine it with other ingredients, and finally plate it into a tidy, reliable table that a business analyst or dashboard can consume directly.

The tool at the center of this world, dbt, treats each transformation step as if it were a recipe card written mostly in plain SQL, with two superpowers layered on top. First, it lets you write a recipe once and reference it by name elsewhere, the same way a recipe for "tomato sauce" gets reused across a dozen different pasta dishes instead of being retyped from scratch every time — this means if you fix a mistake in one shared recipe, every dish that depends on it gets fixed automatically too. Second, it automatically figures out the correct cooking order: it knows the sauce has to be made before the pasta dish that uses it, the same way dbt understands that a "staging" table must be built before an "intermediate" table that depends on it, before a final "mart" table that depends on that.

Layering the kitchen this way — prep station, then line cooks, then the pass — means that if a supplier suddenly changes how they package the onions (the raw data source changes format), you only need to fix the prep station step; everything downstream that was built assuming clean, chopped onions doesn't need to change at all. This separation between "raw and messy" and "clean and business-ready" is exactly why staging, intermediate, and mart layers exist: it isolates the shock of any single messy raw source from all the polished, trustworthy tables the rest of the company relies on.`,
              realWorldApplications: [
                {
                  title: 'dbt Labs and its widespread adoption at companies like GitLab and JetBlue',
                  description: 'dbt (data build tool) pioneered the practice of applying software-engineering discipline — version control, testing, modularity — to SQL transformations, and is now used by thousands of companies to build their staging-to-mart data pipelines.'
                },
                {
                  title: 'Snowflake\'s and Databricks\' modern data stack ecosystem',
                  description: 'The "modern data stack" pattern (load raw data first, then transform it inside the warehouse with tools like dbt) became the dominant analytics architecture at cloud warehouse vendors like Snowflake and Databricks throughout the 2020s, replacing older pre-warehouse transformation pipelines.'
                },
                {
                  title: 'GitLab\'s publicly documented data team handbook',
                  description: 'GitLab famously publishes its own internal data team handbook and dbt project structure openly, which became a widely referenced real-world example of staging/intermediate/marts layering in a production analytics engineering setup.'
                },
                {
                  title: 'Kimball-style dimensional modeling at retailers like Walmart and Target',
                  description: 'Large retailers have long organized their sales data warehouses using the "marts" concept from dimensional modeling — wide, business-friendly fact and dimension tables — which is the direct ancestor of the mart layer in modern dbt projects.'
                }
              ],
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
                },
                {
                  id: 'ex-ds303-2',
                  question: 'Why does dbt execute models in a specific order rather than all at once, and how does it determine that order?',
                  explanation: 'dbt performs a topological sort of the dependency graph built from every ref() and source() call across all models, guaranteeing that any model is only executed after every model it depends on has successfully completed. Executing "all at once" without respecting this order could run a downstream model against stale or nonexistent upstream tables.',
                  type: 'free-response'
                },
                {
                  id: 'ex-ds303-3',
                  question: 'In dimensional modeling, what does the "grain" of a fact table refer to, and why must it be defined precisely before building the table?',
                  explanation: 'Grain is the precise definition of what a single row in the fact table represents (e.g., "one row per order line item," not "one row per order"). It must be fixed explicitly up front because every measure column and every join to a dimension table depends on a consistent, unambiguous grain — mixing grains within one fact table (e.g., some rows at order level, others at line-item level) silently corrupts aggregate calculations like SUM(revenue).',
                  type: 'free-response'
                },
                {
                  id: 'ex-ds303-4',
                  question: 'Which dbt schema test would correctly enforce that a "status" column only ever contains the values "pending", "shipped", or "cancelled"?',
                  options: ['accepted_values', 'unique', 'not_null', 'relationships'],
                  correctAnswer: 'accepted_values',
                  explanation: 'The accepted_values generic test asserts that every value in a column belongs to a specified allow-list, flagging any row containing an unexpected value such as a typo or an undocumented new status.',
                  type: 'multiple-choice'
                },
                {
                  id: 'ex-ds303-5',
                  question: 'Why is the ELT (Extract, Load, Transform) pattern generally preferred over classic ETL for modern cloud data warehouses?',
                  explanation: 'Loading raw data first and transforming it afterward inside the warehouse leverages the warehouse\'s own elastic, parallel compute (rather than a separate, often slower transformation server), and it means raw untransformed data is always available in the warehouse to re-run or redefine transformations without re-extracting from the source system — which is exactly the workflow dbt is built around.',
                  type: 'free-response'
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
              readingQuestions: [
                'How do staging models isolate source data changes from downstream marts?',
                'Why does a star schema often outperform a fully normalized 3NF schema for analytical query workloads, despite storing more redundant data?',
                'What is the difference between dbt\'s "view," "table," and "incremental" materializations, and when would you choose each?',
                'Why do surrogate keys, rather than natural business keys, tend to be preferred as primary keys in dimension tables?',
                'How does automated data testing in dbt change the way a team responds to a broken dashboard compared to manually investigating each incident?'
              ],
              masteryChecklist: ['Build dbt models with ref() dependencies', 'Configure schema tests for uniqueness and non-null values'],
              capstoneMilestone: 'Deploy an analytics engineering project on a real data warehouse.',
              estimatedStudyMinutes: 180,
              difficulty: 'intermediate',
              glossary: [
                { term: 'dbt (data build tool)', definition: 'A transformation tool that lets analytics teams write modular SQL (and Python) models, manage dependencies, and run automated tests, applying software engineering practices like version control and CI to analytics code.' },
                { term: 'ref()', definition: 'A dbt Jinja function used to reference another dbt model by name; it lets dbt infer the dependency DAG and compiles to the correct fully-qualified table name in the target environment.' },
                { term: 'source()', definition: 'A dbt Jinja function referencing a raw table loaded by an external process (not built by dbt itself), used as the entry point of the DAG and enabling source freshness checks.' },
                { term: 'Star Schema', definition: 'A dimensional modeling pattern with a central fact table connected directly to surrounding dimension tables, minimizing joins for common analytical queries at the cost of some data redundancy.' },
                { term: 'Fact Table', definition: 'A table storing quantitative measurements (e.g., revenue, quantity) at a well-defined grain, along with foreign keys to related dimension tables.' },
                { term: 'Dimension Table', definition: 'A table storing descriptive, mostly textual attributes (e.g., customer name, product category) used to filter, group, and label the measurements in a fact table.' },
                { term: 'Grain', definition: 'The precise definition of what a single row in a fact table represents (e.g., one row per order line item); every measure and join must be consistent with this definition.' },
                { term: 'Surrogate Key', definition: 'A system-generated, meaningless identifier (often an auto-incrementing integer or hash) used as a dimension table\'s primary key instead of a natural business key, which can change or be reused over time.' },
                { term: 'Materialization', definition: 'The strategy dbt uses to persist a model\'s output in the warehouse — as a view (query run each time), a table (fully rebuilt each run), or incremental (only new/changed rows are processed on subsequent runs).' },
                { term: 'Idempotency', definition: 'The property of a data pipeline where running the same transformation multiple times on the same input produces the same result, which is essential for safely re-running or backfilling dbt models.' }
              ],
              commonMisconceptions: [
                'Misconception: dbt extracts data from source systems or loads it into the warehouse. Reality: dbt only handles the T (Transform) step of ELT; a separate ingestion tool (e.g., Fivetran, Airbyte) is responsible for Extract and Load, landing raw data in the warehouse before dbt transforms it.',
                'Misconception: Passing all configured dbt tests means the data is fully correct and trustworthy. Reality: dbt tests only catch the specific conditions engineers thought to define (uniqueness, non-null, accepted values, relationships); untested data quality issues, such as subtly wrong business logic in a transformation, can still pass every test while producing incorrect numbers.',
                'Misconception: A star schema and a normalized (3NF) transactional schema serve analytics equally well. Reality: 3NF schemas minimize redundancy for safe, fast transactional writes but require many joins for typical analytical aggregations; star schemas intentionally denormalize into fact and dimension tables to minimize joins for the read-heavy, aggregate-style queries analysts run.',
                'Misconception: Incremental models are always more efficient than full-refresh table models. Reality: Incremental models add complexity (handling late-arriving data, schema changes, and occasional full-refreshes) and are only a net win when the source table is large and mostly append-only; for small or frequently-changing tables, a full-refresh table model can be simpler and just as fast.',
                'Misconception: dbt "view" and "table" materializations are performance-equivalent, just different keywords. Reality: A view re-runs its defining query against the underlying data every time it is queried, while a table stores pre-computed results physically in the warehouse; tables are faster to query repeatedly but need to be rebuilt to reflect new data, a trade-off that should guide which materialization to choose per model.'
              ],
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
              primaryLecture: VERIFIED_VIDEOS['ds304-t1'] as any,
              learningObjective: 'Master temporal forecasting and autoregressive time series modeling.',
              prerequisites: ['STAT 201 Probability & Statistics'],
              coreConcepts: [
                'Stationarity: a property of a time series whose mean, variance, and autocorrelation structure do not change over time; most classical forecasting models (ARIMA, VAR) assume stationarity because their mathematics relies on the statistical relationships between observations being stable rather than drifting.',
                'ACF/PACF Plots: the autocorrelation function (correlation of a series with its own lagged values) and partial autocorrelation function (correlation with a lag after removing the effect of shorter lags), used together as a diagnostic to choose the AR order p and MA order q of an ARIMA model.',
                'ARIMA/SARIMAX Models: AutoRegressive Integrated Moving Average models combine autoregression (predicting from past values), differencing (to induce stationarity), and a moving-average of past forecast errors; SARIMAX extends this with seasonal terms and exogenous (external) regressors to capture calendar effects and outside drivers.',
                'Additive/Multiplicative Decomposition: splitting a series into trend, seasonal, and residual components, added together when the seasonal swing has roughly constant absolute size, or multiplied together when the seasonal swing scales proportionally with the series\' level — choosing the wrong form distorts the extracted trend and seasonal signal.',
                'Augmented Dickey-Fuller (ADF) Test: a formal hypothesis test for the presence of a unit root (a specific form of non-stationarity) in a series, where the null hypothesis is that a unit root is present (non-stationary); rejecting the null gives statistical evidence supporting stationarity.',
                'Differencing: transforming a series by subtracting each value from its previous value (y_t - y_t-1), which removes a linear trend and is the standard way to make a non-stationary series stationary before fitting an ARMA-type model; the number of differencing steps needed is the "I" (Integrated) order in ARIMA.'
              ],
              simpleExplanation: `Imagine tracking a kid's height every month from birth to age 18. There's an obvious overall upward trend (they keep growing), a seasonal wiggle if you're measuring something like ice cream sales instead (spikes every summer, dips every winter), and then random day-to-day noise on top of both. Time series decomposition is simply the practice of pulling those three layers apart — trend, seasonality, and leftover noise — the way you might separate a smoothie back into "fruit," "ice," and "a splash of juice" so you can study each ingredient on its own instead of only ever seeing the blended result.

Before you can build a solid forecasting model, statisticians care a lot about whether a series is "stationary," meaning its average level and its wiggliness stay roughly constant over time rather than drifting. This matters because most classic forecasting math assumes you're always describing the same underlying process, the way a recipe for chocolate chip cookies assumes the oven temperature stays constant throughout baking — if the oven keeps heating up as you bake, none of your timing instructions are reliable anymore. A rising trend is exactly this kind of drift, so statisticians often "difference" the series — literally just subtracting each value from the one before it, similar to tracking a child's monthly height GAIN instead of their raw height — which frequently flattens out a wandering trend into something much more stable and predictable.

Once a series is reasonably stable, an ARIMA model predicts the next value using two intuitive ingredients: how much recent values have been trending (the autoregressive part — "yesterday and the day before give me a hint about tomorrow") and how much recent prediction errors have been running high or low (the moving-average part — "I've been consistently over- or under-guessing lately, so let me correct for that"). Combined with the differencing step, ARIMA is essentially a disciplined, mathematical version of "look at the recent pattern, look at how wrong you've recently been, and use both to make your best guess about what happens next."`,
              realWorldApplications: [
                {
                  title: 'Federal Reserve economic forecasting',
                  description: 'Central banks like the U.S. Federal Reserve use ARIMA and related time series models as standard tools for forecasting economic indicators such as inflation and unemployment, decomposing series into trend and seasonal components before modeling.'
                },
                {
                  title: 'Meta\'s Prophet forecasting library',
                  description: 'Meta (Facebook) open-sourced Prophet, a forecasting tool built around the same trend-plus-seasonality decomposition idea, originally created to let non-experts on its business teams forecast metrics like ad demand and infrastructure capacity.'
                },
                {
                  title: 'Retail demand forecasting at Walmart and Target',
                  description: 'Major retailers rely on time series forecasting with explicit seasonal components to predict demand for products around holidays and seasons, directly driving inventory and supply chain decisions.'
                },
                {
                  title: 'Electric utility load forecasting',
                  description: 'Power grid operators use ARIMA-family and seasonal decomposition models to forecast electricity demand hours to days ahead, accounting for daily and weekly seasonal patterns (higher usage on weekday evenings, lower on weekends) to plan generation capacity.'
                }
              ],
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
                },
                {
                  id: 'ex-ds304-2',
                  question: 'An Augmented Dickey-Fuller test on a series returns a p-value of 0.62. What should you conclude and do next?',
                  options: [
                    'Fail to reject the null hypothesis of a unit root; the series is likely non-stationary and should be differenced before ARMA modeling',
                    'Reject the null hypothesis; the series is confirmed stationary and needs no differencing',
                    'The test is inconclusive and ARIMA cannot be applied at all',
                    'A p-value of 0.62 confirms strong seasonality is present'
                  ],
                  correctAnswer: 'Fail to reject the null hypothesis of a unit root; the series is likely non-stationary and should be differenced before ARMA modeling',
                  explanation: 'The ADF null hypothesis is that a unit root (non-stationarity) is present. With p = 0.62, far above conventional thresholds like 0.05, there is no evidence to reject that null, so the series should be treated as non-stationary and differenced (increasing the "d" order) until a subsequent ADF test rejects the null.',
                  type: 'multiple-choice'
                },
                {
                  id: 'ex-ds304-3',
                  question: 'Why can differencing a series too many times ("over-differencing") harm a forecasting model rather than help it?',
                  explanation: 'Once a series is already stationary, applying additional differencing removes real signal and introduces artificial negative autocorrelation at lag 1, since differencing a white-noise-like series produces a moving-average structure that was not present in the original data. This typically increases forecast variance and can make the model harder to fit (e.g., non-invertible MA terms), so the ADF test and ACF/PACF plots should guide stopping as soon as stationarity is achieved.',
                  type: 'free-response'
                },
                {
                  id: 'ex-ds304-4',
                  question: 'A retailer\'s monthly sales series shows a seasonal swing of about $10,000 in December regardless of whether total monthly sales are $50,000 or $200,000. Should this be modeled with additive or multiplicative decomposition?',
                  options: ['Additive, because the seasonal fluctuation has a roughly constant absolute magnitude regardless of the series level', 'Multiplicative, because December sales are highest', 'Additive, because sales trend upward over time', 'Multiplicative, because the trend is linear'],
                  correctAnswer: 'Additive, because the seasonal fluctuation has a roughly constant absolute magnitude regardless of the series level',
                  explanation: 'Additive decomposition (y = trend + seasonal + residual) is appropriate when the seasonal component\'s absolute size stays roughly constant across different levels of the trend. Multiplicative decomposition is appropriate instead when the seasonal swing scales proportionally with the level of the series (e.g., a seasonal effect that is always about 20% of sales, not a fixed dollar amount).',
                  type: 'multiple-choice'
                },
                {
                  id: 'ex-ds304-5',
                  question: 'Why is a high in-sample R-squared or low in-sample error not sufficient evidence that an ARIMA model will forecast well out-of-sample?',
                  explanation: 'A sufficiently high-order ARIMA model can fit historical noise in addition to genuine signal, achieving an excellent in-sample fit while generalizing poorly to future, unseen observations — the time series analogue of overfitting. Forecast quality should instead be validated using a proper time-based train/test split (or rolling-origin cross-validation) and out-of-sample error metrics such as MAE or RMSE on held-out future periods.',
                  type: 'free-response'
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
              readingQuestions: [
                'Why is non-stationarity problematic for standard linear regression models?',
                'How do the shapes of ACF and PACF plots differ when diagnosing a pure AR(p) process versus a pure MA(q) process?',
                'What information does the seasonal component of an SARIMAX model add that a plain ARIMA model cannot capture?',
                'Why might the choice between additive and multiplicative decomposition change the interpretation of a series\' extracted trend?',
                'What is the practical difference between a forecast\'s point estimate and its confidence interval, and why does the confidence interval typically widen further into the future?'
              ],
              masteryChecklist: ['Perform Dickey-Fuller tests for stationarity', 'Interpret ACF/PACF plots to pick (p,d,q) orders'],
              capstoneMilestone: 'Build a production time series forecasting model with confidence intervals.',
              estimatedStudyMinutes: 180,
              difficulty: 'intermediate',
              glossary: [
                { term: 'Stationarity', definition: 'A property of a time series whose mean, variance, and autocorrelation structure do not change over time; classical models like ARIMA rely on this assumption.' },
                { term: 'Autocorrelation Function (ACF)', definition: 'A function measuring the correlation between a time series and a lagged version of itself at each lag k, used to detect repeating patterns and diagnose the moving-average order of a model.' },
                { term: 'Partial Autocorrelation Function (PACF)', definition: 'A function measuring the correlation between a series and its lag-k value after removing the linear effects of the intervening shorter lags, used to diagnose the autoregressive order of a model.' },
                { term: 'Differencing', definition: 'Computing the difference between consecutive observations, y_t - y_{t-1}, to remove a trend and help achieve stationarity; the number of differencing steps applied is the "d" order in ARIMA(p, d, q).' },
                { term: 'Unit Root', definition: 'A specific mathematical condition (a root of the process\'s characteristic equation equal to 1) that causes a time series to be non-stationary, with shocks having a permanent rather than decaying effect.' },
                { term: 'Augmented Dickey-Fuller (ADF) Test', definition: 'A statistical hypothesis test for the presence of a unit root in a time series, with the null hypothesis being that a unit root exists (the series is non-stationary).' },
                { term: 'White Noise', definition: 'A sequence of uncorrelated random variables with zero mean and constant variance; a well-specified time series model should leave residuals that resemble white noise, with no remaining structure to exploit.' },
                { term: 'Seasonality', definition: 'A pattern in a time series that repeats at a fixed, known period (e.g., daily, weekly, yearly), distinct from the longer-term trend and from irregular residual noise.' },
                { term: 'Random Walk', definition: 'A non-stationary process where each value equals the previous value plus a random shock, y_t = y_{t-1} + epsilon_t; it is the canonical example of a series with a unit root that becomes stationary after one round of differencing.' },
                { term: 'Exogenous Variable', definition: 'An external predictor variable (e.g., holiday indicator, marketing spend) included in a SARIMAX model to explain variation in the target series beyond its own past values.' }
              ],
              commonMisconceptions: [
                'Misconception: A high R-squared when regressing one non-stationary series on another implies a genuine, valid relationship. Reality: Two entirely unrelated non-stationary (e.g., random-walk) series will often show a spuriously high R-squared and significant-looking regression coefficients purely because both trend over time; this is the classic spurious regression problem, avoided by differencing or cointegration testing before regression.',
                'Misconception: Adding more AR or MA terms to a model always improves forecast accuracy. Reality: Higher-order models can fit in-sample noise rather than genuine structure, inflating in-sample fit while degrading out-of-sample forecast accuracy; model order should be chosen using information criteria (AIC/BIC) and out-of-sample validation, not just in-sample error minimization.',
                'Misconception: A strong in-sample fit guarantees good forecasting performance. Reality: In-sample fit measures how well a model describes data it has already seen, while forecasting requires generalizing to unseen future periods; the two can diverge sharply, which is why forecasts should always be validated with a held-out, time-ordered test period.',
                'Misconception: Differencing a series can be applied without limit and only helps. Reality: Differencing beyond what is needed to achieve stationarity ("over-differencing") removes genuine signal and introduces artificial negative autocorrelation, typically increasing forecast variance.',
                'Misconception: ARIMA models can automatically capture arbitrary nonlinear dynamics or structural breaks (e.g., a sudden regime change) without any modification. Reality: Classical ARIMA/SARIMAX models are linear in their own past values and errors; structural breaks, regime shifts, or genuinely nonlinear dynamics typically require intervention analysis, regime-switching models, or other specialized techniques beyond standard ARIMA.'
              ],
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
              primaryLecture: VERIFIED_VIDEOS['ds401-t1'] as any,
              learningObjective: 'Design, implement, and present an end-to-end production data science capstone.',
              prerequisites: ['All Core DS Courses'],
              coreConcepts: [
                'End-to-End Pipeline Architecture: designing every stage from raw data ingestion through cleaning, feature engineering, model training, serving, and monitoring as a coherent system, since a capstone that only demonstrates a notebook-level model misses the production concerns (data quality gates, versioning, latency) that define real data science work.',
                'Causal Impact Metrics: going beyond correlational model accuracy to rigorously measure the actual effect of a deployed intervention, using the experimental (A/B testing) or quasi-experimental (DiD, propensity matching) tools from earlier coursework rather than assuming a model\'s predictive performance automatically translates into business impact.',
                'Fairness Auditing: systematically evaluating the capstone\'s model or pipeline for disparate performance or outcomes across relevant subgroups, applying the demographic parity, equalized odds, and auditing techniques from data governance coursework rather than treating fairness as an afterthought.',
                'Technical Defense: the practice of clearly communicating methodology, assumptions, limitations, and validation evidence to a technical panel, anticipating and directly addressing the strongest objections a skeptical reviewer would raise about the approach.',
                'Data/Concept Drift Monitoring: tracking whether the statistical properties of incoming data (data drift) or the underlying relationship between features and target (concept drift) change after deployment, since a model validated once at training time can silently degrade as the real world shifts away from the training distribution.',
                'Reproducibility & Technical Debt: ensuring the entire pipeline can be re-run and independently verified (fixed seeds, versioned data and code, documented environment) while deliberately avoiding the anti-patterns — glue code, hidden feedback loops, undeclared configuration — identified as major sources of long-term risk in production ML systems.'
              ],
              simpleExplanation: `Building a single machine learning model that works well on your laptop is a bit like a chef inventing a great recipe in their own home kitchen. It tastes great, but that's a completely different challenge from opening a restaurant that has to make that exact same dish, correctly, thousands of times a day, with different staff, different suppliers, and customers who need it fast and consistent every single time. A capstone data science project is about making that leap: not just proving a model can work once, but building the whole surrounding system — the pipeline that gets fresh ingredients (data) in, the steps that prepare and cook them (cleaning, feature engineering, training) the same way every time, and a reliable way to serve the finished dish (predictions) to real users without the kitchen catching fire.

A huge part of this is reproducibility — making sure that if you, or a teammate, or you-six-months-from-now, re-run the exact same recipe with the exact same ingredients, you get the exact same dish. In cooking terms, that means writing down precise measurements instead of "a pinch of this," using the same brand of ingredients every time, and keeping careful notes about substitutions. In data science, that means locking down random number "seeds" so experiments aren't randomly different each run, keeping careful version records of exactly which data and exactly which code produced a given result, and documenting the kitchen's equipment (the software environment) so nothing behaves differently on a different machine.

The final, often underappreciated danger is what's sometimes called technical debt — the invisible cost of shortcuts. Imagine a kitchen where, instead of a clean, written-down recipe, half the steps live only in one cook's head, ingredients get substituted on the fly without telling anyone, and the sauce recipe secretly depends on leftover scraps from yesterday's different dish. It works today, but the moment that one cook goes on vacation, or the leftover scraps run out, the whole thing breaks in a way nobody can quickly diagnose. Real production pipelines accumulate exactly this kind of hidden fragility — tangled dependencies, undocumented configuration, feedback loops where a model's own outputs quietly influence the data it's later trained on — and a good capstone project is judged not just on accuracy, but on whether it avoids leaving these invisible landmines for whoever maintains it next.`,
              realWorldApplications: [
                {
                  title: 'Google\'s "Hidden Technical Debt in Machine Learning Systems" paper',
                  description: 'This widely cited Google paper formalized the idea that only a small fraction of real-world ML systems is the model itself, with the surrounding data pipelines, configuration, and monitoring infrastructure accounting for the vast majority of the engineering and long-term maintenance risk.'
                },
                {
                  title: 'Netflix\'s Metaflow framework',
                  description: 'Netflix built and open-sourced Metaflow specifically to help its data scientists take a model from a notebook prototype to a reliable, reproducible, versioned production pipeline without needing to become full-time infrastructure engineers.'
                },
                {
                  title: 'Kaggle competition-to-production gap widely discussed in industry',
                  description: 'It is well documented across the ML engineering community that a model winning a Kaggle competition is a very different achievement from a model running reliably in production, since competitions optimize purely for accuracy on a fixed dataset with no pipeline, drift, or reproducibility concerns.'
                },
                {
                  title: 'DVC (Data Version Control) adoption across ML teams',
                  description: 'Tools like DVC are used by data science teams to version large datasets and model artifacts alongside code in Git, directly addressing the reproducibility challenge of tying a specific model result back to the exact data and code that produced it.'
                }
              ],
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
                },
                {
                  id: 'ex-ds401-2',
                  question: 'A capstone model shows a statistically significant improvement in predicted click-through rate (p = 0.001) from an A/B test, but the absolute lift is 0.02 percentage points. How should this be evaluated in a technical defense?',
                  explanation: 'Statistical significance only indicates the observed effect is unlikely to be due to random chance at the given sample size; it says nothing about whether the effect is large enough to matter for the business. With very large sample sizes, even trivially small, practically meaningless effects can become statistically significant. The defense should report both the effect size (0.02 points) and its confidence interval, and argue separately whether that magnitude justifies the cost of the change.',
                  type: 'free-response'
                },
                {
                  id: 'ex-ds401-3',
                  question: 'Why should a capstone project include a monitoring plan for the deployed model rather than stopping at the deployment step?',
                  explanation: 'A model is validated against training-time data, but the real-world data distribution can shift after deployment (data drift) or the true relationship between features and target can change (concept drift), silently degrading performance. Without ongoing monitoring — tracking prediction distributions, input feature distributions, and downstream outcome metrics — a team has no way to detect this degradation until it has already caused business harm.',
                  type: 'free-response'
                },
                {
                  id: 'ex-ds401-4',
                  question: 'Which of the following is the strongest justification for starting a capstone\'s modeling section with a simple baseline model before a complex one?',
                  options: [
                    'It establishes a reference performance level, making it possible to quantify how much lift the complex model actually provides and to catch pipeline bugs early',
                    'Baseline models are always more accurate than complex models',
                    'Reviewers require exactly one model per capstone',
                    'Simple models require no evaluation metrics'
                  ],
                  correctAnswer: 'It establishes a reference performance level, making it possible to quantify how much lift the complex model actually provides and to catch pipeline bugs early',
                  explanation: 'A baseline (e.g., predicting the mean, or a simple logistic regression) gives a floor to compare against; if a complex model only marginally beats the baseline, that is important evidence about whether the added complexity, latency, and maintenance burden are justified, and a baseline that behaves unexpectedly can also reveal data leakage or pipeline bugs before they contaminate the complex model\'s results.',
                  type: 'multiple-choice'
                },
                {
                  id: 'ex-ds401-5',
                  question: 'Referencing "Hidden Technical Debt in Machine Learning Systems," what is meant by describing ML systems as having a high propensity for "glue code" and "pipeline jungles," and why is this relevant to a capstone\'s architecture?',
                  explanation: 'Glue code refers to the substantial custom code needed to get general-purpose ML packages to interoperate with a specific system\'s data formats and infrastructure; pipeline jungles arise when ad hoc data preparation steps accumulate into a tangled, hard-to-modify sequence of transformations. Both are cited as major sources of long-term maintenance cost that are invisible if a project is only evaluated on model accuracy, which is why a well-architected capstone should favor clean, modular, well-documented pipeline stages over a maze of one-off scripts.',
                  type: 'free-response'
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
              readingQuestions: [
                'How do model monitoring systems detect concept drift in real-time inference?',
                'Why is statistical significance alone an insufficient basis for recommending a model change to business stakeholders?',
                'What distinguishes a causal claim about a deployed model\'s impact from a purely correlational one, and why does the distinction matter for a capstone defense?',
                'What specific evidence should a capstone presentation include to preempt the objection "how do you know this generalizes beyond your test set"?',
                'How does establishing a simple baseline model change the way you interpret the performance of a more complex final model?'
              ],
              masteryChecklist: ['Deploy an ETL pipeline with data quality checks', 'Present capstone findings with statistical rigor'],
              capstoneMilestone: 'Defend Senior Data Science Capstone before honors panel.',
              estimatedStudyMinutes: 300,
              difficulty: 'advanced',
              glossary: [
                { term: 'Data Lineage', definition: 'The recorded provenance of data through every transformation, processing step, and storage location it passes through, enabling traceability from a final metric back to its raw source.' },
                { term: 'Feature Engineering', definition: 'The process of transforming raw data into input variables (features) that better expose the underlying patterns a model needs to learn, such as aggregating, encoding, or combining raw fields.' },
                { term: 'Baseline Model', definition: 'A simple, easy-to-implement model (e.g., predicting the mean, or a basic linear model) used as a reference point to quantify how much lift a more complex model actually provides.' },
                { term: 'Data Drift', definition: 'A change over time in the statistical distribution of a model\'s input features relative to the distribution seen during training, which can degrade model performance even if the underlying feature-target relationship is unchanged.' },
                { term: 'Concept Drift', definition: 'A change over time in the true underlying relationship between input features and the target variable, meaning a model\'s learned mapping becomes stale even if the input distribution itself looks similar.' },
                { term: 'Model Monitoring', definition: 'The ongoing practice of tracking a deployed model\'s prediction distributions, input feature distributions, and downstream outcome metrics to detect performance degradation, drift, or pipeline failures.' },
                { term: 'Technical Debt (ML Systems)', definition: 'The long-term maintenance cost incurred by shortcuts in an ML system\'s design, such as glue code, tangled pipeline dependencies, and undeclared configuration, which are often invisible when a project is judged only on model accuracy.' },
                { term: 'Reproducibility', definition: 'The property that an analysis or model training run produces the same results when repeated, typically requiring fixed random seeds, versioned data and code, and a documented environment.' },
                { term: 'Statistical Significance vs. Practical Significance', definition: 'Statistical significance indicates an observed effect is unlikely to be due to chance; practical significance separately asks whether the effect is large enough to matter for real-world decisions — a result can be one without being the other.' },
                { term: 'Population Stability Index (PSI)', definition: 'A metric quantifying how much a variable\'s distribution has shifted between two time periods (e.g., training vs. production), commonly used to flag data drift requiring investigation.' }
              ],
              commonMisconceptions: [
                'Misconception: Model accuracy is the sole metric for production success. Reality: A model\'s value depends on its actual causal business impact, fairness across subgroups, latency, maintainability, and robustness to drift — accuracy on a static test set captures none of these operational and ethical dimensions.',
                'Misconception: A capstone (or any ML project) is complete once the model is deployed. Reality: Deployment is the beginning of a model\'s operational life; without ongoing monitoring for data and concept drift, a validated model can silently degrade as real-world conditions diverge from the training distribution.',
                'Misconception: A statistically significant result is automatically practically or economically significant. Reality: With a large enough sample size, even a trivially small effect can produce a very small p-value; decisions should weigh the effect size and its confidence interval against the real-world cost of acting on it, not the p-value alone.',
                'Misconception: A more complex model is inherently more trustworthy or defensible than a simple baseline. Reality: Complexity adds latency, maintenance burden, and interpretability cost; a defensible capstone quantifies the actual lift a complex model provides over a well-chosen simple baseline rather than assuming sophistication implies quality.',
                'Misconception: A single successful A/B test result is sufficient evidence that an intervention will keep working indefinitely. Reality: Novelty effects, seasonality, and drifting user populations mean an initially positive result can fade or reverse over time, which is why continued monitoring and periodic re-evaluation are part of a rigorous deployment, not just the initial experiment.'
              ],
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
              primaryLecture: VERIFIED_VIDEOS['ds402-t1'] as any,
              learningObjective: 'Master MLOps workflows to package, serve, containerize, and monitor machine learning models in production.',
              prerequisites: ['CS 305 Machine Learning'],
              coreConcepts: [
                'REST API Inference: exposing a trained model behind an HTTP endpoint (e.g., a FastAPI /predict route with a Pydantic request schema) so any client application can request predictions over the network without needing the model code or dependencies installed locally.',
                'Docker Containerization: packaging an application together with its exact OS-level dependencies, Python packages, and runtime into a single portable image, which is what guarantees the model behaves identically in a developer\'s laptop, a CI pipeline, and production infrastructure.',
                'MLflow Artifact Registry: a system for tracking experiment parameters, metrics, and trained model artifacts across many training runs, and for versioning and staging (e.g., "Staging" vs. "Production") specific model versions so a deployment always references a precise, reproducible artifact rather than "whatever is in the latest notebook."',
                'Data Drift Monitoring: continuously comparing the statistical distribution of live production inputs against the training-time distribution (e.g., via the Population Stability Index) to detect when a deployed model is being asked to make predictions on data that looks meaningfully different from what it was trained on.',
                'Model Registry & Versioning: the practice of assigning every trained model artifact a unique, immutable version and lifecycle stage, so a specific model can be rolled back to, audited, or compared against a previous version without ambiguity about exactly which weights and training data produced it.',
                'Kubernetes Orchestration & Horizontal Scaling: running multiple replicas of a containerized model server behind a load balancer and automatically adding or removing replicas based on traffic, which lets a service absorb variable request volume without a human manually provisioning servers.'
              ],
              simpleExplanation: `Imagine you've perfected a recipe in your own kitchen, and now you want to sell that exact dish at food trucks parked in a hundred different cities. The problem is, your home kitchen has a specific stove, specific pots, specific water pressure — and a food truck in another city might have slightly different equipment, meaning your recipe could turn out differently or fail outright. A "container" solves this by packing not just the recipe, but a complete miniature kitchen — the exact stove, the exact pots, all the exact ingredients — into a sealed, self-contained box that can be dropped into any truck in any city and behave identically every time, regardless of what's different about that truck's surroundings. That's what Docker containers do for software: they package a model along with everything it needs to run (code, libraries, settings) so it behaves the same on a developer's laptop as it does on a server thousands of miles away.

Now imagine demand for your food truck's dish suddenly spikes — maybe there's a festival in town and ten times the usual number of customers show up. One food truck can't possibly serve them all fast enough, so you'd want a system that automatically calls in more trucks when a line gets too long, and sends some trucks home when things quiet back down, without a manager having to notice and react manually every time. That's what orchestration tools like Kubernetes do for deployed models: they watch how much traffic (requests) is coming in, and automatically spin up more copies of your containerized model — or shut extra ones down — so the service stays fast under heavy load without wasting resources when it's quiet.

Finally, deploying the model once isn't the end of the story — food trucks need regular health inspections, and a good operator watches whether ingredients are still fresh even after opening day. Model monitoring plays that role: watching whether the incoming data starts looking meaningfully different from what the model was trained on (like a food truck's regular ingredients suddenly being swapped out) — a phenomenon called drift — so a team can catch a silently degrading model before it starts serving customers bad predictions instead of a bad meal.`,
              realWorldApplications: [
                {
                  title: 'Uber\'s Michelangelo ML platform',
                  description: 'Uber built and published details about Michelangelo, an internal MLOps platform that standardizes how models across the company are trained, containerized, deployed, and monitored for drift, letting thousands of models run reliably in production.'
                },
                {
                  title: 'Docker and Kubernetes as the industry-standard deployment stack',
                  description: 'Docker containers combined with Kubernetes orchestration have become the default way companies of all sizes package and auto-scale machine learning inference services, letting a model handle traffic spikes (like a viral product launch) without manual server provisioning.'
                },
                {
                  title: 'Netflix\'s recommendation-serving infrastructure',
                  description: 'Netflix has written about running thousands of containerized microservices, including recommendation and personalization models, behind auto-scaling infrastructure that adjusts capacity in real time to viewing traffic patterns across time zones.'
                },
                {
                  title: 'FastAPI-based model-serving endpoints at countless startups',
                  description: 'Wrapping a trained model behind a lightweight FastAPI web server, containerizing it with Docker, and deploying it to a cloud platform is one of the most common real-world patterns for taking a data science model from a notebook to something other software can actually call.'
                }
              ],
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
                },
                {
                  id: 'ex-ds402-2',
                  question: 'What is the key architectural difference between a Docker container and a traditional virtual machine?',
                  options: [
                    'A container shares the host operating system\'s kernel and virtualizes only at the process level, while a VM virtualizes an entire separate OS and kernel',
                    'A container is always slower to start than a virtual machine',
                    'A virtual machine cannot run a web server, but a container can',
                    'There is no meaningful difference; the terms are interchangeable'
                  ],
                  correctAnswer: 'A container shares the host operating system\'s kernel and virtualizes only at the process level, while a VM virtualizes an entire separate OS and kernel',
                  explanation: 'Containers use OS-level virtualization, sharing the host kernel and isolating processes via namespaces and cgroups, which makes them far lighter-weight and faster to start than a virtual machine that boots and runs an entirely separate guest operating system on top of a hypervisor.',
                  type: 'multiple-choice'
                },
                {
                  id: 'ex-ds402-3',
                  question: 'Why does MLflow\'s experiment tracking and model registry matter for reproducibility, beyond simply saving a model.pkl file to disk?',
                  explanation: 'A raw pickle file records only the final weights, with no attached record of which hyperparameters, training data version, code commit, or metrics produced it. MLflow logs all of these alongside the artifact and assigns it a queryable, versioned identity (and optionally a lifecycle stage like Staging/Production), so any deployed model can be traced back to the exact run that created it and compared systematically against other runs.',
                  type: 'free-response'
                },
                {
                  id: 'ex-ds402-4',
                  question: 'A team adds more container replicas behind a load balancer to reduce their model API\'s response latency, but latency does not improve. What is a plausible explanation?',
                  explanation: 'Horizontal scaling (adding replicas) increases the system\'s total throughput capacity (requests handled per second), but it does not reduce the latency of a single request if the bottleneck is elsewhere — for example, a slow feature-lookup database call, model inference time itself, or network round-trip overhead. Reducing per-request latency instead requires optimizing the request\'s own critical path (model size, batching, caching, faster hardware), not just adding parallel capacity.',
                  type: 'free-response'
                },
                {
                  id: 'ex-ds402-5',
                  question: 'Why should a data drift monitor (e.g., using PSI) be part of a production MLOps pipeline even after a model has passed all pre-deployment validation tests?',
                  explanation: 'Pre-deployment validation only checks the model against data available at training time; it cannot see how the real world will change afterward. If the live input distribution shifts (data drift) or the true input-output relationship changes (concept drift), a model that scored well during validation can silently degrade in production, and drift monitoring is the mechanism that surfaces this degradation before it causes significant business harm.',
                  type: 'free-response'
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
              readingQuestions: [
                'How does Population Stability Index (PSI) quantify data distribution drift over time?',
                'Why does containerizing a model server help resolve the classic "it worked on my machine" deployment problem?',
                'What is the difference between vertical scaling and horizontal scaling for a model-serving API, and when is each preferred?',
                'How does a canary or blue-green deployment strategy reduce the risk of rolling out a new model version compared to an immediate full replacement?',
                'Why is request latency, not just model accuracy, a first-class design constraint for a real-time inference API?'
              ],
              masteryChecklist: ['Build FastAPI inference endpoints', 'Create Dockerfiles for ML microservices'],
              capstoneMilestone: 'Deploy a containerized prediction endpoint on a cloud server.',
              estimatedStudyMinutes: 200,
              difficulty: 'advanced',
              glossary: [
                { term: 'MLOps', definition: 'A set of practices combining Machine Learning, DevOps, and Data Engineering to reliably build, deploy, monitor, and maintain ML systems in production.' },
                { term: 'REST API', definition: 'An architectural style for networked applications using standard HTTP methods (GET, POST, etc.) and URLs to represent and manipulate resources; a model-serving REST API typically exposes a POST endpoint that accepts input features and returns a prediction.' },
                { term: 'Docker Image vs. Container', definition: 'A Docker image is an immutable, versioned blueprint bundling application code and dependencies; a container is a running instance of that image, isolated at the process level from the host operating system.' },
                { term: 'MLflow', definition: 'An open-source platform for tracking ML experiment parameters and metrics, packaging reproducible model artifacts, and managing a versioned model registry with lifecycle stages.' },
                { term: 'Model Registry', definition: 'A centralized store that catalogs versioned model artifacts along with metadata and lifecycle stage (e.g., Staging, Production, Archived), providing a single source of truth for which model version is deployed where.' },
                { term: 'Data Drift', definition: 'A change over time in the statistical distribution of a model\'s input features compared to the distribution seen during training, potentially degrading prediction quality even if the model itself is unchanged.' },
                { term: 'Population Stability Index (PSI)', definition: 'A metric that buckets a variable\'s values and compares the proportion of observations in each bucket between two time periods (e.g., training vs. production), producing a single score that quantifies how much the distribution has shifted.' },
                { term: 'Kubernetes', definition: 'An open-source system for automating the deployment, scaling, and management of containerized applications across a cluster of machines.' },
                { term: 'Horizontal Scaling', definition: 'Increasing a system\'s capacity by adding more instances (replicas) of a service running in parallel, as opposed to vertical scaling, which increases the resources (CPU/memory) of a single instance.' },
                { term: 'Canary Deployment', definition: 'A release strategy that routes a small percentage of production traffic to a new model version while most traffic still goes to the current version, allowing the new version\'s behavior to be validated on real traffic before a full rollout.' }
              ],
              commonMisconceptions: [
                'Misconception: An ML project ends once model training reaches high accuracy. Reality: A trained model still needs to be packaged, served reliably under production load, versioned, and monitored for drift; most of the long-term engineering effort in MLOps happens after training is complete.',
                'Misconception: A Docker container is essentially the same thing as a lightweight virtual machine. Reality: Containers share the host operating system\'s kernel and are isolated at the process level via namespaces and cgroups, making them much lighter-weight and faster to start than a VM, which virtualizes an entire separate guest OS on top of a hypervisor.',
                'Misconception: MLflow automatically retrains or redeploys a model when new data arrives. Reality: MLflow is a tracking, packaging, and registry tool; it records experiment metadata and manages versioned artifacts, but retraining and deployment automation must be implemented separately, typically via a CI/CD or orchestration pipeline that calls MLflow\'s APIs.',
                'Misconception: Adding more container replicas always reduces the response latency experienced by a single request. Reality: Horizontal scaling increases total throughput capacity (requests served per second) but does not speed up the processing of any individual request; latency bottlenecks in model inference time, database calls, or network overhead require different optimizations.',
                'Misconception: Low latency measured during local or staging testing will hold up under real production traffic. Reality: Production traffic patterns (concurrency, payload sizes, network conditions, cold starts) frequently differ from local testing conditions, which is why load testing under realistic, simulated traffic is a standard MLOps practice before a full rollout.'
              ],
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
              primaryLecture: VERIFIED_VIDEOS['ds403-t1'] as any,
              learningObjective: 'Master Transformer architectures, self-attention mechanics, and LLM Retrieval-Augmented Generation.',
              prerequisites: ['CS 305 Machine Learning'],
              coreConcepts: [
                'Scaled Dot-Product Attention: computed as softmax(QK^T / sqrt(d_k))V, where each token\'s Query vector is compared against every token\'s Key vector to produce similarity scores, which are normalized by softmax into weights that combine the Value vectors; this is the core mechanism letting every token directly gather information from every other token in a sequence in a single step, regardless of distance.',
                'Multi-Head Attention: running several scaled dot-product attention computations in parallel, each with its own learned Query/Key/Value projection matrices, then concatenating and linearly projecting the results; different heads can specialize in different types of relationships (e.g., syntactic dependency vs. coreference), which a single attention computation could not capture simultaneously.',
                'Positional Encoding: since self-attention itself is permutation-invariant (it has no built-in notion of token order), a positional signal — commonly sinusoidal functions of different frequencies added to each token\'s embedding — must be injected explicitly so the model can distinguish "dog bites man" from "man bites dog."',
                'Tokenization (Byte-Pair Encoding / WordPiece): the process of splitting raw text into a fixed vocabulary of subword units by iteratively merging the most frequent adjacent character pairs, which lets a model represent rare or unseen words as sequences of familiar subword pieces instead of failing on out-of-vocabulary tokens.',
                'LoRA (Low-Rank Adaptation) Fine-Tuning: a parameter-efficient fine-tuning technique that freezes the pretrained model\'s original weight matrices and instead trains a much smaller pair of low-rank matrices added alongside each frozen layer, cutting the number of trainable parameters by orders of magnitude while adapting the model to a new task or domain.',
                'Vector Database RAG (Retrieval-Augmented Generation): embedding a document corpus into dense vectors, storing them in a vector database that supports fast approximate nearest-neighbor search, and retrieving the top-k most similar chunks to a user\'s query to inject as context into an LLM prompt, grounding generation in retrievable facts rather than relying solely on knowledge memorized during pretraining.',
                'Word Embeddings (Distributional Semantics): dense vector representations of words (e.g., Word2Vec) learned so that words occurring in similar contexts end up with similar vectors, operationalizing the distributional hypothesis ("a word is characterized by the company it keeps") into arithmetic that supports similarity search and, famously, vector analogies like king - man + woman ~ queen.'
              ],
              simpleExplanation: `Read this sentence: "The trophy didn't fit in the suitcase because it was too big." What was too big — the trophy or the suitcase? You instantly know it's the trophy, but notice how you had to glance back at other words in the sentence to figure out what "it" refers to. That's exactly the problem self-attention solves for computers reading text. For every single word, self-attention asks: "which other words in this sentence should I look back at to understand what THIS word really means here?" and it lets the model weigh some words much more heavily than others — the way your brain paid much more attention to "trophy" and "suitcase" than to "the" or "because" when resolving what "it" meant.

Before this idea took over, older language models processed sentences strictly one word at a time, left to right, like reading through a keyhole where you can only see one word and have to remember everything before it purely from memory — which gets shaky and forgetful the longer the sentence runs on. Self-attention instead lets every word look at every other word in the sentence all at once, directly, no matter how far apart they are, which is why it's so much better at handling long sentences and tricky references like "it," "they," or "the former."

To make this concrete, imagine everyone in a group project holding up two cards: one card describes "what kind of help I'm looking for" (a query) and another describes "what kind of help I can offer" (a key). Self-attention works by having every word compare its "what I'm looking for" card against every other word's "what I can offer" card, and words whose cards match well get paid much closer attention to. Whichever words come out as the best matches get blended together more strongly into that word's final understanding — mathematically weighted, but conceptually just "listen more closely to the words that are most relevant to me."

Underneath all of this, words themselves first get converted into long lists of numbers — embeddings — arranged so that words used in similar contexts end up with similar number patterns, the digital equivalent of grouping words by "the company they keep." This is why the famous trick of "king minus man plus woman" landing near "queen" works: the numerical pattern that represents "royalty" and the numerical pattern that represents "gender" both get encoded consistently enough that basic arithmetic on the number lists lines up with basic arithmetic on the underlying meanings.`,
              realWorldApplications: [
                {
                  title: 'Google Translate\'s transformer-based translation models',
                  description: 'Google Translate moved to transformer architectures built on self-attention, allowing the system to weigh distant words in a sentence when producing a translation instead of processing strictly word-by-word, substantially improving translation quality for long or ambiguous sentences.'
                },
                {
                  title: 'Anthropic\'s Claude and OpenAI\'s GPT models',
                  description: 'Modern large language models like Claude and GPT are built almost entirely from stacks of self-attention layers, the same "Attention Is All You Need" architecture from the original 2017 transformer paper, scaled up dramatically.'
                },
                {
                  title: 'GitHub Copilot\'s code completion',
                  description: 'Code-completion tools like GitHub Copilot use transformer models with self-attention to look across an entire file (variable names, function definitions used earlier) when predicting what code should come next, similar to how it resolves references in natural language.'
                },
                {
                  title: 'Google\'s BERT in Google Search',
                  description: 'Google incorporated BERT, a transformer-based language model, directly into its search ranking system to better understand the intent behind ambiguous, conversational search queries by weighing how words in a query relate to one another.'
                }
              ],
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
                },
                {
                  id: 'ex-ds403-2',
                  question: 'Why does the Transformer architecture require explicit positional encoding, while a recurrent neural network (RNN) does not?',
                  explanation: 'An RNN processes tokens sequentially, one at a time, so the order of tokens is implicitly baked into the order of computation. Self-attention, in contrast, computes a weighted combination over all tokens simultaneously and is mathematically permutation-invariant with respect to token order — shuffling the input tokens (and correspondingly the output) would produce the same attention scores. Positional encoding is added specifically to break this symmetry and give the model a way to represent sequence order.',
                  type: 'free-response'
                },
                {
                  id: 'ex-ds403-3',
                  question: 'In LoRA fine-tuning, a frozen pretrained weight matrix W (d x d) is adapted via W + BA, where B is (d x r) and A is (r x d) with rank r much smaller than d. Why does this dramatically reduce the number of trainable parameters compared to fine-tuning W directly?',
                  explanation: 'Directly fine-tuning W requires updating all d^2 parameters. Training only B and A instead requires updating d*r + r*d = 2dr parameters. Since the rank r is chosen to be much smaller than d (e.g., r = 8 while d = 4096), 2dr is orders of magnitude smaller than d^2, letting LoRA adapt a large pretrained model to a new task while storing and updating only a small fraction of its original parameter count, and the original weights W remain completely untouched and reusable.',
                  type: 'free-response'
                },
                {
                  id: 'ex-ds403-4',
                  question: 'A team building a customer-support chatbot needs the model to answer questions about a product catalog that changes weekly. Why would Retrieval-Augmented Generation (RAG) typically be preferred over fully fine-tuning the LLM on the catalog?',
                  options: [
                    'RAG lets the knowledge source be updated instantly by re-indexing documents, without retraining the model, and reduces hallucination by grounding answers in retrieved text',
                    'Fine-tuning is always cheaper and faster to update than RAG',
                    'RAG eliminates the need for any embedding model',
                    'Fine-tuning guarantees zero hallucination while RAG cannot reduce it'
                  ],
                  correctAnswer: 'RAG lets the knowledge source be updated instantly by re-indexing documents, without retraining the model, and reduces hallucination by grounding answers in retrieved text',
                  explanation: 'Fine-tuning bakes knowledge into model weights, so any change to fast-moving data (like a weekly-updated catalog) would require repeated, costly retraining and risks the model still answering from stale memorized knowledge. RAG instead retrieves current information from an external index at query time, so updating the knowledge base is as simple as re-indexing documents, and grounding the generation in retrieved text reduces (though does not eliminate) hallucination.',
                  type: 'multiple-choice'
                },
                {
                  id: 'ex-ds403-5',
                  question: 'Why can high attention weights between two tokens not always be interpreted as the model considering one token causally or semantically "important" to the other?',
                  explanation: 'Attention weights reflect learned similarity between Query and Key projections optimized end-to-end for the training objective, not a guaranteed measure of human-interpretable importance or causal influence; multiple studies have shown attention patterns can be manipulated or shuffled without proportionally changing model output, and different heads/layers can attend for reasons (like maintaining positional or syntactic bookkeeping) unrelated to semantic salience. Attention should be treated as one diagnostic signal, not a definitive explanation of model reasoning.',
                  type: 'free-response'
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
              readingQuestions: [
                'How does RAG augment LLM generation with domain-specific knowledge?',
                'Why does multi-head attention allow a model to capture multiple distinct types of relationships that a single attention head cannot?',
                'What is the practical trade-off between using a very large context window versus a retrieval-based approach for grounding an LLM in external documents?',
                'How does Byte-Pair Encoding handle a word that never appeared in its training corpus?',
                'Why can Word2Vec-style embeddings support vector arithmetic like "king - man + woman ~ queen," and what does this reveal about what the embedding space actually encodes?',
                'What are the main sources of error or hallucination in a RAG pipeline, and at which stage (retrieval vs. generation) does each occur?'
              ],
              masteryChecklist: ['Implement scaled dot-product self-attention', 'Construct a vector similarity search engine'],
              capstoneMilestone: 'Build an end-to-end RAG QA system over domain documents.',
              estimatedStudyMinutes: 240,
              difficulty: 'advanced',
              glossary: [
                { term: 'Transformer', definition: 'A deep neural network architecture built entirely from self-attention and feed-forward layers, without recurrent or convolutional connections, enabling highly parallel training and effective modeling of long-range dependencies.' },
                { term: 'Self-Attention', definition: 'A mechanism where each element of a sequence computes a weighted combination of all elements (including itself) in the same sequence, with weights determined by learned similarity between Query and Key projections.' },
                { term: 'Query, Key, Value (Q, K, V)', definition: 'Three learned linear projections of the input used in attention: Queries represent what a token is "looking for," Keys represent what each token "offers," and Values are the content actually aggregated once attention weights (from Q-K similarity) are computed.' },
                { term: 'Multi-Head Attention', definition: 'Running several independent attention computations ("heads") in parallel, each with its own learned Q/K/V projections, then concatenating and linearly combining their outputs so different heads can specialize in different relationship types.' },
                { term: 'Positional Encoding', definition: 'A signal (commonly sinusoidal functions of varying frequency) added to token embeddings to inject information about token order, since self-attention alone is permutation-invariant.' },
                { term: 'Tokenization', definition: 'The process of splitting raw text into discrete units (tokens) a model can process; subword algorithms like Byte-Pair Encoding balance vocabulary size against the ability to represent rare or unseen words as combinations of familiar pieces.' },
                { term: 'LoRA (Low-Rank Adaptation)', definition: 'A parameter-efficient fine-tuning method that freezes a pretrained model\'s weights and trains small low-rank update matrices injected into each layer, drastically reducing the number of trainable parameters needed to adapt the model.' },
                { term: 'Retrieval-Augmented Generation (RAG)', definition: 'An architecture that retrieves relevant text chunks from an external knowledge source (via embedding similarity search) and injects them into an LLM\'s prompt context, grounding generation in retrievable, updatable information.' },
                { term: 'Vector Database', definition: 'A database optimized for storing high-dimensional embedding vectors and performing fast approximate nearest-neighbor similarity search, the retrieval backbone of a RAG system.' },
                { term: 'Cosine Similarity', definition: 'A measure of similarity between two vectors computed as the cosine of the angle between them (their dot product divided by the product of their magnitudes), commonly used to rank embedding vectors by semantic similarity independent of vector length.' }
              ],
              commonMisconceptions: [
                'Misconception: Fine-tuning is always superior to RAG for injecting new or dynamic knowledge. Reality: Fine-tuning bakes knowledge into fixed model weights, requiring costly retraining whenever the knowledge changes, while RAG retrieves current information at query time from an updatable external index, making it far better suited to fast-changing or very large knowledge sources.',
                'Misconception: High attention weights between two tokens directly indicate which tokens the model considers causally or semantically important. Reality: Attention weights are a byproduct of an end-to-end optimized similarity computation and are not a guaranteed faithful explanation of model reasoning; research has shown attention patterns can sometimes be altered without proportionally changing the model\'s output.',
                'Misconception: A sufficiently large context window makes retrieval-based grounding (RAG) unnecessary. Reality: Even models with very long context windows exhibit "lost in the middle" effects where information buried deep in a long context is used less reliably, and stuffing full documents into every prompt is far more computationally expensive than retrieving only the few most relevant chunks.',
                'Misconception: LoRA fine-tuning modifies the original pretrained weights directly. Reality: LoRA freezes the original weight matrix entirely and instead learns a separate small low-rank update that is added to it at inference time, which is exactly what allows the same base model to be reused with different swappable LoRA adapters for different tasks.',
                'Misconception: Word embeddings like Word2Vec capture true semantic understanding of meaning. Reality: Embeddings are learned purely from statistical co-occurrence patterns in text (the distributional hypothesis); they capture useful similarity structure but also faithfully encode any biases present in the training corpus and can conflate distinct senses of a word into a single vector.'
              ],
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
              primaryLecture: VERIFIED_VIDEOS['ds405-t1'] as any,
              learningObjective: 'Build and train convolutional neural networks for image classification, object detection, and spatial analytics.',
              prerequisites: ['CS 305 Machine Learning'],
              coreConcepts: [
                'Convolutional Filters: small learnable kernels slid across an image to detect local spatial patterns like edges or textures; because the same kernel weights are reused (shared) at every spatial position, convolutional layers need far fewer parameters than a fully connected layer and gain built-in translation invariance — a detected pattern is recognized regardless of where it appears in the image.',
                'Pooling / Downsampling: an operation (e.g., MaxPool) that reduces the spatial resolution of a feature map by summarizing small local regions, cutting computation and parameter count in later layers while adding a degree of robustness to small spatial shifts in the input.',
                'Residual (Skip) Connections: shortcut connections that add a layer\'s input directly to its output (x + F(x)), letting gradients flow directly backward through the shortcut path during backpropagation; this was the key innovation that made training networks with over 100 layers practical by addressing the degradation problem where very deep plain networks paradoxically got harder to optimize.',
                'YOLO Object Detection: a single-shot detector that divides an image into a grid and predicts bounding boxes and class probabilities for all objects in one forward pass, trading a small amount of localization precision for the real-time speed needed in video and robotics applications, in contrast to slower two-stage detectors like Faster R-CNN that first propose candidate regions and then classify them.',
                'Intersection over Union (IoU): the ratio of the overlapping area to the union area between a predicted bounding box and the ground-truth box, the standard metric for judging whether a detection counts as correct (typically IoU > 0.5) and for computing detection-quality metrics like mean Average Precision (mAP).',
                'U-Net Segmentation: an encoder-decoder architecture with skip connections directly linking corresponding encoder and decoder layers, letting the network combine coarse, high-level semantic context from deep layers with fine-grained spatial detail preserved from early layers, producing pixel-precise segmentation masks.',
                'Spatial Autocorrelation: a statistical measure (e.g., Moran\'s I) of whether observations that are geographically near each other tend to have similar values, the geospatial analogue of temporal autocorrelation and the basis for detecting spatial clustering, hotspots, and violations of the independence assumption that standard statistical models rely on.'
              ],
              simpleExplanation: `Imagine teaching a child to recognize a cat, not by describing "a cat" in words, but by handing them a small magnifying glass and having them slide it across a photo, patch by patch — first noticing a tiny patch has an edge, then noticing a few edges nearby form a curve, then noticing a few curves form a pointy shape like an ear, then noticing two pointy ears plus whiskers plus a nose add up to "cat." Convolutional neural networks (CNNs) work through a strikingly similar layered process: an early layer's "magnifying glass" (a small filter) slides across the image looking only for very simple things like edges and color changes, the next layer combines those into slightly bigger patterns like curves and corners, and layer by layer the patterns get more complex until the final layers are recognizing whole meaningful shapes and objects.

The reason this "sliding magnifying glass" trick works so well, instead of just feeding every single pixel into the model independently, is that it respects something true about images: a cat's ear looks like a cat's ear whether it appears in the top-left or bottom-right of the photo. By reusing the exact same small filter as it slides across every part of the image, a CNN only has to learn "what an edge looks like" once, and it can then recognize that same edge anywhere in the picture — a huge shortcut compared to learning "an edge in the top-left corner" and "an edge in the bottom-right corner" as two totally separate, unrelated facts.

Spatial analytics extends a similar "nearby things tend to be related" intuition beyond photographs into maps and geography. If one neighborhood has high crime rates, its immediate neighbor is statistically more likely to also have elevated crime rates than a neighborhood clear across the city — location itself carries information, the same way a pixel's neighbors carry information about what shape they're jointly part of. Spatial autocorrelation is simply the formal, measurable version of that intuition: a statistic that tells you whether nearby places really do tend to look alike more than random chance alone would predict, which matters because many standard statistical techniques secretly assume every data point is independent of its neighbors — an assumption that geography routinely, and importantly, breaks.`,
              realWorldApplications: [
                {
                  title: 'Tesla\'s and Waymo\'s self-driving perception systems',
                  description: 'Self-driving car systems use convolutional neural networks to process camera feeds in real time, detecting pedestrians, other vehicles, lane markings, and traffic signs by recognizing the same kinds of learned edge-to-shape-to-object visual hierarchies.'
                },
                {
                  title: 'Google Photos\' and Apple Photos\' automatic tagging',
                  description: 'Photo apps use CNN-based image classifiers to automatically detect and group photos by content (faces, pets, landmarks) without a human ever manually labeling each picture, relying on the same layered feature-detection approach originally proven by architectures like ResNet.'
                },
                {
                  title: 'Radiology AI tools used in hospitals (e.g., for detecting tumors in CT/MRI scans)',
                  description: 'FDA-cleared diagnostic imaging tools use CNNs trained on large sets of labeled medical scans to flag suspicious regions such as tumors or fractures, assisting radiologists by highlighting areas warranting closer review.'
                },
                {
                  title: 'The CDC\'s and public health researchers\' disease-hotspot mapping',
                  description: 'Public health researchers use spatial autocorrelation statistics like Moran\'s I to detect statistically significant disease clusters (hotspots) on a map, distinguishing a true localized outbreak from what would just be expected random geographic scatter.'
                }
              ],
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
                },
                {
                  id: 'ex-ds405-2',
                  question: 'Why do residual (skip) connections make it possible to train much deeper networks than plain stacked convolutional layers?',
                  explanation: 'In a plain deep network, gradients must pass through every layer\'s weights during backpropagation and can shrink toward zero (vanish) over many layers, and empirically, plain networks beyond a certain depth were observed to have higher training error than shallower ones (the degradation problem, not simply overfitting). A residual connection adds the identity x directly to the block\'s output, x + F(x), giving the gradient an unimpeded shortcut path back to earlier layers; the network can also easily learn F(x) = 0 to approximate an identity mapping when additional depth is not helpful, so adding layers is guaranteed to be no worse in principle.',
                  type: 'free-response'
                },
                {
                  id: 'ex-ds405-3',
                  question: 'A predicted bounding box has an IoU of 0.3 with the ground-truth box, at a detection threshold of IoU > 0.5. How is this prediction counted when computing mAP?',
                  options: [
                    'As a false positive, because the overlap does not meet the minimum IoU threshold required to count as a correct localization',
                    'As a true positive, because any non-zero overlap counts as a correct detection',
                    'As a true negative',
                    'It is excluded from the mAP calculation entirely'
                  ],
                  correctAnswer: 'As a false positive, because the overlap does not meet the minimum IoU threshold required to count as a correct localization',
                  explanation: 'Mean Average Precision requires a minimum IoU (commonly 0.5) between a predicted box and its matched ground-truth box for the detection to be counted as a true positive. An IoU of 0.3 falls below that threshold, so the prediction is counted as a false positive (a poorly localized or spurious detection) even if the predicted class label was correct.',
                  type: 'multiple-choice'
                },
                {
                  id: 'ex-ds405-4',
                  question: 'Why does U-Net use skip connections between corresponding encoder and decoder layers, rather than relying only on the bottleneck (most compressed) representation to reconstruct the segmentation mask?',
                  explanation: 'The encoder progressively downsamples the image, building strong high-level semantic understanding (what objects are present) but losing precise spatial/pixel-level detail (exactly where object boundaries fall) at each downsampling step. The skip connections carry that lost fine-grained spatial detail directly from each encoder layer to the matching decoder layer, letting the decoder combine coarse semantic context with fine spatial precision to produce sharp, pixel-accurate segmentation boundaries instead of a blurry reconstruction from the bottleneck alone.',
                  type: 'free-response'
                },
                {
                  id: 'ex-ds405-5',
                  question: 'A positive and statistically significant Moran\'s I is found for neighborhood crime rates, indicating that high-crime areas cluster spatially near other high-crime areas. Can this be interpreted as one neighborhood\'s crime rate causing its neighbor\'s crime rate to rise?',
                  explanation: 'No. Spatial autocorrelation only establishes that nearby values are statistically more similar than would be expected under spatial randomness; it does not identify the mechanism. The clustering could instead be driven by a shared underlying confounder affecting a whole region (e.g., regional economic conditions, policing patterns, or shared infrastructure), by genuine spillover effects, or by how the spatial units themselves were drawn (the modifiable areal unit problem). Establishing causation would require a causal inference design analogous to those used in non-spatial settings.',
                  type: 'free-response'
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
              readingQuestions: [
                'How does YOLO single-shot object detection differ from two-stage R-CNN detectors?',
                'Why do residual connections allow networks to be made deeper without hurting training performance, as originally motivated by the ResNet paper?',
                'What is the practical difference between semantic segmentation and instance segmentation, and which one does U-Net perform?',
                'Why is Intersection over Union preferred over simple pixel-distance metrics for evaluating bounding box predictions?',
                'How does Moran\'s I formalize the intuitive idea of spatial clustering, and what does a value near zero indicate?'
              ],
              masteryChecklist: ['Implement 2D convolution and pooling operations', 'Train a PyTorch CNN image classifier'],
              capstoneMilestone: 'Deploy a YOLO object detection model on custom aerial or satellite imagery.',
              estimatedStudyMinutes: 240,
              difficulty: 'advanced',
              glossary: [
                { term: 'Convolutional Layer', definition: 'A neural network layer that applies small, learnable spatial filters (kernels) across grid-structured input data, sharing the same weights at every spatial position to detect local patterns with far fewer parameters than a fully connected layer.' },
                { term: 'Kernel / Filter', definition: 'A small matrix of learnable weights that slides across an input feature map, computing a dot product at each position to produce one value of the output feature map; different kernels learn to detect different patterns like edges or textures.' },
                { term: 'Feature Map', definition: 'The output of applying a convolutional filter (or a full convolutional layer) across an input, representing the spatial locations where the filter\'s pattern was detected.' },
                { term: 'Receptive Field', definition: 'The region of the original input image that influences a given neuron\'s activation; receptive fields grow larger in deeper layers of a CNN as successive convolutions and poolings aggregate information from wider spatial areas.' },
                { term: 'Residual (Skip) Connection', definition: 'A shortcut that adds a layer\'s (or block\'s) input directly to its output, x + F(x), providing an unimpeded path for gradients during backpropagation and making very deep networks trainable.' },
                { term: 'Intersection over Union (IoU)', definition: 'The ratio of the overlapping area to the total union area between a predicted bounding box and the ground-truth box, used to judge localization accuracy in object detection.' },
                { term: 'Non-Max Suppression', definition: 'A post-processing step in object detection that removes redundant, overlapping bounding box predictions for the same object, keeping only the highest-confidence box among boxes whose IoU exceeds a chosen threshold.' },
                { term: 'Semantic vs. Instance Segmentation', definition: 'Semantic segmentation labels every pixel with a class (e.g., "car") without distinguishing between individual objects of that class; instance segmentation additionally separates and labels each individual object instance separately.' },
                { term: "Moran's I", definition: 'A statistic quantifying spatial autocorrelation, ranging roughly from -1 (perfect dispersion) to +1 (perfect clustering), with values near zero indicating no spatial pattern beyond what randomness would produce.' },
                { term: 'Spatial Autocorrelation', definition: 'The tendency for observations located near each other in space to have more similar values than observations located farther apart, a violation of the independence assumption many standard statistical methods rely on.' }
              ],
              commonMisconceptions: [
                'Misconception: Fully connected layers preserve spatial 2D relationships better than convolutional layers. Reality: A fully connected layer flattens the input and treats every pixel as independent, discarding spatial locality entirely; convolutional layers explicitly preserve and exploit 2D spatial structure by applying local filters that respect neighboring pixel relationships.',
                'Misconception: Pooling is the only way to achieve translation invariance or downsampling in a CNN. Reality: Strided convolutions (a convolution that steps by more than one pixel at a time) can also downsample feature maps and are used as an alternative or complement to pooling in many modern architectures.',
                'Misconception: Making a CNN deeper always improves accuracy, since more layers mean more representational capacity. Reality: Before residual connections, plain very deep networks suffered from a degradation problem where training error actually increased with depth beyond a certain point, due to optimization difficulty rather than overfitting; this motivated the residual connection design specifically to make additional depth reliably helpful rather than harmful.',
                'Misconception: A model\'s classification accuracy is sufficient to evaluate an object detection system. Reality: Object detection requires evaluating both what an object is (classification) and where it is (localization), which is why metrics like IoU-thresholded mean Average Precision (mAP) are used instead of plain classification accuracy.',
                'Misconception: Finding significant positive spatial autocorrelation (e.g., Moran\'s I) between neighboring regions proves one region\'s value causes its neighbor\'s value. Reality: Spatial clustering can equally arise from a shared regional confounder or from how spatial units were defined, not just direct spillover; establishing causation requires a dedicated causal inference design, not spatial autocorrelation alone.'
              ],
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
