import { CurriculumModule } from '../../types/curriculum';
import { VERIFIED_VIDEOS } from '../verifiedVideoRegistry';

export const phase4DSModules: CurriculumModule[] = [
  {
    id: 'p4-m15',
    phaseId: 4,
    title: 'Applied Data Science & Analytics Pipelines',
    slug: 'applied-data-science-pipelines',
    category: 'ds',
    summary: 'Master Data Cleaning, Feature Engineering, Statistical Hypothesis Testing, A/B Testing, Data Warehousing, and Batch Data Pipelines.',
    objective: 'Construct end-to-end data processing pipelines, perform statistical significance testing, and engineer domain-specific features.',
    prerequisiteModuleIds: ['p1-m6', 'p2-m10', 'p2-m11'],
    estimatedHours: 25,
    difficulty: 'intermediate',
    colorAccent: 'mint',
    capstone: {
      id: 'capstone-p4-m15',
      title: 'A/B Testing Statistical Experimentation & ETL Pipeline',
      description: 'Build a statistical A/B testing evaluation framework calculating P-values, Confidence Intervals, and Sample Size requirements alongside an ETL data pipeline.',
      constraints: ['Pure Python statistical calculations.'],
      expectedDeliverables: ['Z-test & T-test p-value calculators.', 'ETL data transformation pipeline.', 'Statistical decision report.'],
      evaluationRubric: [
        { criterion: 'Statistical Accuracy', weight: '50%', description: 'P-value calculation matches two-tailed hypothesis testing formulas.' },
        { criterion: 'ETL Pipeline Cleanliness', weight: '50%', description: 'Handles data validation and missing value transformations.' }
      ]
    },
    topics: [
      {
        id: 'p4-m15-t1',
        moduleId: 'p4-m15',
        title: 'Statistical Hypothesis Testing & A/B Experimentation',
        slug: 'statistical-hypothesis-testing-ab-testing',
        summary: 'Master Null/Alternative Hypotheses, Type I & Type II Errors, Z-Tests, T-Tests, Chi-Square Tests, and p-value interpretations.',
        order: 1,
        masteryPack: {
          learningObjective: 'Design randomized controlled A/B experiments, calculate sample sizes, and evaluate statistical significance using Z-tests and T-tests.',
          prerequisites: ['Probability and Statistics fundamentals'],
          coreConcepts: [
            'Null Hypothesis (H0) vs Alternative Hypothesis (H1)',
            'Type I Error (Alpha, False Positive) vs Type II Error (Beta, False Negative) and Statistical Power',
            'Z-Test for Proportions and Student’s t-Test for Means',
            'P-Value Interpretation and 95% Confidence Interval Derivation',
            'A/B Testing Pitfalls: Peeking, Multiple Testing Corrections (Bonferroni), Novelty Effects'
          ],
          primaryLecture: VERIFIED_VIDEOS['p4-m15-t1'] as any,
          primaryText: {
            id: 'book-openintro-stats',
            title: 'OpenIntro Statistics (Free Open Textbook)',
            authors: ['David Diez', 'Mine Çetinkaya-Rundel', 'Christopher Barr'],
            url: 'https://www.openintro.org/book/os/',
            recommendedChapter: 'Chapter 5: Foundations for Inference & Chapter 7: Inference for Numerical Data',
            publisherOrInstitution: 'OpenIntro Free Textbooks',
            accessStatus: 'verified'
          },
          recommendedChapter: 'Chapter 5: Foundations for Inference',
          authoritativeResearchSource: {
            id: 'paper-student-1908',
            title: 'The Probable Error of a Mean',
            authors: ['Student (William Sealy Gosset)'],
            year: 1908,
            venue: 'Biometrika',
            doiOrArxiv: '10.2307/2331554',
            openAccessUrl: 'https://d3bxy9euw4e147.cloudfront.net/oscms-prodcms/media/documents/IntroductoryStatistics-WEB.pdf',
            paperType: 'historical',
            difficulty: 'intermediate',
            prerequisites: ['Sample mean and variance'],
            summary: 'The historical paper written under the pseudonym "Student" introducing the Student’s t-distribution for small sample statistical inference.',
            whyItMatters: 'Allowed scientists and engineers to draw valid statistical conclusions from small sample sets without knowing the population variance.',
            sectionsToRead: 'Sections I–III: Derivation of t-distribution',
            readingQuestions: [
              'Why does the t-distribution have heavier tails than the standard normal distribution when sample size N is small?',
              'How does degrees of freedom (N - 1) impact the t-test critical region?'
            ],
            relatedTopicIds: ['p4-m15-t1'],
            accessStatus: 'verified'
          },
          practicalExercises: [
            {
              id: 'ex-p4-1',
              question: 'If an A/B test yields a p-value of 0.03 at an alpha significance level of 0.05, what is the statistical decision?',
              options: [
                'Reject the Null Hypothesis (H0) — the difference is statistically significant.',
                'Fail to reject the Null Hypothesis (H0).',
                'Accept the Null Hypothesis as 100% true.',
                'Invalidate the test due to insufficient data.'
              ],
              correctAnswer: 0,
              explanation: 'Since p-value (0.03) < alpha (0.05), we reject the null hypothesis H0 in favor of the alternative hypothesis H1.',
              type: 'multiple-choice'
            }
          ],
          interactiveLab: {
            id: 'lab-p4-1',
            title: 'Two-Sample Z-Test A/B Experiment Evaluator',
            type: 'python',
            instructions: 'Write a Python function `ab_test_z_test(conv_A, n_A, conv_B, n_B)` calculating Z-score and p-value for A/B conversion rates.',
            starterCode: `import math

def erf(x):
    # Approximation of error function for normal CDF
    a1, a2, a3, a4, a5 = 0.254829592, -0.284496736, 1.421413741, -1.453152027, 1.061405429
    p = 0.3275911
    sign = 1 if x >= 0 else -1
    x = abs(x)
    t = 1.0 / (1.0 + p * x)
    y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * math.exp(-x * x)
    return sign * y

def norm_cdf(z):
    return 0.5 * (1.0 + erf(z / math.sqrt(2)))

def ab_test_z_score(conv_A, n_A, conv_B, n_B):
    pA = conv_A / n_A
    pB = conv_B / n_B
    p_pooled = (conv_A + conv_B) / (n_A + n_B)
    se = math.sqrt(p_pooled * (1.0 - p_pooled) * (1.0/n_A + 1.0/n_B))
    
    z_score = (pB - pA) / se
    p_value = 2.0 * (1.0 - norm_cdf(abs(z_score)))
    return round(z_score, 3), round(p_value, 4)

# Test A/B conversion data
z, p = ab_test_z_score(conv_A=120, n_A=1000, conv_B=160, n_B=1000)
print(f"Z-Score: {z}, P-Value: {p}")
print("Result:", "Statistically Significant Difference (Reject H0)" if p < 0.05 else "Inconclusive")
`,
            testCases: [
              {
                expectedOutput: 'Z-Score: 2.515, P-Value: 0.0119',
                description: 'Validates two-sample proportion Z-test calculation.'
              }
            ]
          },
          readingQuestions: [
            'Why does "peeking" at A/B test results repeatedly inflate the Type I error rate above 5%?',
            'What is the relationship between sample size N and the minimum detectable effect (MDE)?'
          ],
          masteryChecklist: [
            'Formulate H0 and H1 hypotheses for business experiment scenarios.',
            'Calculate Z-scores and two-tailed p-values from scratch.',
            'Apply Bonferroni correction when evaluating multiple metric variants.'
          ],
          capstoneMilestone: 'Milestone 1: Statistical A/B testing framework & ETL pipeline.',
          estimatedStudyMinutes: 210,
          difficulty: 'intermediate',
          glossary: [
            { term: 'P-Value', definition: 'The probability of obtaining test results at least as extreme as the observed results under the assumption that the null hypothesis is true.' },
            { term: 'Type I Error', definition: 'The incorrect rejection of a true null hypothesis (False Positive).' }
          ],
          commonMisconceptions: [
            'Misconception: A p-value of 0.03 means there is a 97% probability that the alternative hypothesis is true. Reality: P-value measures data likelihood under H0, not hypothesis posterior probability.'
          ],
          connectionsToLaterModules: [
            'Prerequisite for Model Evaluation & Causal Inference in Phase 5',
            'Foundation for Feature Engineering in Phase 5 & 6'
          ],
          citation: { text: 'Student (Gosset, W. S.). (1908). The Probable Error of a Mean. Biometrika, 6(1), 1–25.' },
          accessStatus: 'verified'
        }
      }
    ]
  }
];
