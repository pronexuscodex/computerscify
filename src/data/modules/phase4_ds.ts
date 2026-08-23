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
            'Null Hypothesis (H0) vs Alternative Hypothesis (H1): H0 is the default claim of "no effect" or "no difference" that we assume true until evidence says otherwise, and H1 is the competing claim we adopt when the data are inconsistent with H0; every hypothesis test in this topic (and every A/B test run in industry) is structured as a decision between these two statements based on observed sample data.',
            'Type I Error (Alpha, False Positive) vs Type II Error (Beta, False Negative) and Statistical Power: Alpha is the probability of rejecting a true H0 (a false alarm) and beta is the probability of failing to reject a false H0 (a missed effect), with statistical power (1 - beta) measuring the test\'s ability to detect a real effect when one exists; balancing these two error rates against sample size is the central design problem of any experiment, and directly determines the sample size calculations used later in the capstone A/B testing framework.',
            'Z-Test for Proportions and Student\'s t-Test for Means: The Z-test compares sample proportions (e.g., conversion rates) using the standard normal distribution and is valid when sample sizes are large, while the t-test compares sample means using the heavier-tailed t-distribution to correctly account for the extra uncertainty of estimating variance from small samples; choosing the right test statistic for the data type (proportion vs continuous mean) and sample size is a foundational skill for feature engineering and later causal inference.',
            'P-Value Interpretation and 95% Confidence Interval Derivation: The p-value is the probability of observing data at least as extreme as what was measured, assuming H0 is true, while a 95% confidence interval is the range of parameter values that would not be rejected by a hypothesis test at the 5% significance level; both quantify uncertainty from the same sampling distribution and are frequently reported together to communicate both statistical significance and practical effect size.',
            'A/B Testing Pitfalls: Peeking, Multiple Testing Corrections (Bonferroni), Novelty Effects: Repeatedly checking significance before the experiment ends ("peeking") inflates the true false-positive rate far above the nominal alpha, testing many metrics simultaneously without correction (e.g., Bonferroni) multiplies the chance of a spurious significant result, and novelty effects can make a new feature appear to perform better temporarily simply because it is new; recognizing these pitfalls is essential for building trustworthy experimentation pipelines rather than statistically invalid ones.',
            'Statistical Power and Sample Size Determination: Before running an experiment, the minimum detectable effect, desired power (commonly 80%), and significance level alpha jointly determine the required sample size per group; underpowered experiments systematically fail to detect real effects, which is why sample size planning is a prerequisite step in the capstone ETL and experimentation pipeline.'
          ],
          simpleExplanation: `Imagine you run a lemonade stand, and one day you wonder whether putting up a bright yellow sign makes more people stop and buy a cup. You can't just try the sign for one afternoon and declare victory — maybe that day was simply sunnier, or a nearby school let out early and flooded the sidewalk with thirsty kids. So instead, for every person who walks by, you flip a coin: heads, they see the yellow sign; tails, they see the plain stand. After a week you count how many people from each group bought lemonade. That's an A/B test — and the "default" boring assumption you start with, that the sign makes no real difference at all, is called the null hypothesis. Your hope that the sign actually helps is the alternative hypothesis.

Here's the tricky part: even if the sign truly does nothing, the two groups will still come out a little different just by chance, the same way flipping a coin 100 times rarely lands exactly 50-50. So the real question isn't "is there any difference," it's "is the difference bigger than what pure chance would typically produce?" A p-value answers exactly that: it's like asking "if the sign really did nothing at all, how surprising would results this lopsided be?" A tiny p-value means "extremely surprising if nothing were going on" — which is evidence the sign is doing something real. Statisticians usually draw the "surprising enough" line at results that would happen less than 5% of the time by chance alone. When you're comparing rates of something (like the percentage who bought a cup), you use a tool called a Z-test; when you're comparing average amounts from a small group (like average dollars spent), you use a close cousin called a t-test, which is a bit more forgiving about how little you actually know from a small sample.

But two kinds of mistakes can sneak in. You might get excited by a lucky streak and conclude the sign works when it actually did nothing — like seeing a face in the clouds that isn't really there. That's called a Type I error, a false alarm. Or the sign might genuinely help a little, but your week of watching was too short and noisy to notice it — you missed a real effect entirely, a Type II error. How good your test is at catching a real effect when one truly exists is called its power, and the reliable way to boost power is to watch more passersby — a bigger sample size — rather than hoping to get lucky.

One last trap: if you keep peeking at your tally jar every hour and stop the moment it looks good, you're stacking the deck in your own favor, because you're far more likely to catch a lucky streak at some point during the week than to still see one at the very end — this is called "peeking," and it quietly inflates your false-alarm rate. And if you test ten different sign designs at once and report whichever one happened to look best, you're almost guaranteed that at least one will look good purely by luck, the way rolling enough dice eventually turns up a double-six. That's why statisticians use a correction — dividing the surprise threshold by the number of things being compared — so a random fluke doesn't get mistaken for a genuine discovery.`,
          realWorldApplications: [
            {
              title: "Netflix's UI and thumbnail experimentation platform",
              description: 'Netflix runs continuous randomized A/B tests on artwork, thumbnails, and UI layout changes, using hypothesis testing and statistical significance thresholds to decide whether a variant genuinely improves engagement before rolling it out to all members.'
            },
            {
              title: "Booking.com's large-scale experimentation culture",
              description: 'Booking.com is well known for running thousands of concurrent A/B tests on its website, relying on rigorous p-value and confidence-interval analysis (and awareness of multiple-testing and peeking pitfalls) to decide which changes actually move booking conversion rates.'
            },
            {
              title: "Guinness Brewery's quality control (birthplace of the t-test)",
              description: "William Sealy Gosset, a statistician working at the Guinness brewery in Dublin, developed the Student's t-distribution (published under the pseudonym \"Student\") specifically to draw reliable conclusions about beer quality from the small sample batches available in brewing."
            },
            {
              title: 'FDA-regulated clinical drug trials',
              description: 'Pharmaceutical trials use null/alternative hypothesis framing and p-value thresholds (with corrections for testing multiple endpoints) to determine whether a new drug produces a statistically significant improvement over placebo before regulators approve it.'
            },
            {
              title: "A/B tests behind Google Search ranking changes",
              description: "Google evaluates proposed changes to its search ranking algorithm through controlled experiments that split users into treatment and control groups, using statistical significance testing to decide whether a ranking change measurably improves user outcomes."
            }
          ],
          primaryLecture: VERIFIED_VIDEOS['p4-m15-t1'] as any,
          primaryText: {
            id: 'book-openintro-stats',
            title: 'OpenIntro Statistics (Free Open Textbook)',
            authors: ['David Diez', 'Mine Çetinkaya-Rundel', 'Christopher Barr'],
            url: 'https://arxiv.org/pdf/2006.10256.pdf',
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
            openAccessUrl: 'https://www.york.ac.uk/depts/maths/histstat/student.pdf',
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
            },
            {
              id: 'ex-p4-2',
              question: 'Derive the standard error (SE) used in the pooled two-proportion Z-test for comparing conversion rates pA (group A, size nA) and pB (group B, size nB), starting from the variance of each sample proportion under H0 (equal true proportions p_pooled). Why is the pooled proportion used instead of pA and pB separately?',
              explanation: 'Under H0, both groups are assumed to share the same true conversion rate p, estimated by pooling: p_pooled = (conv_A + conv_B) / (n_A + n_B). For a sample proportion, Var(p_hat) = p(1-p)/n, and since the two groups are independent samples, Var(pB_hat - pA_hat) = Var(pB_hat) + Var(pA_hat) = p_pooled(1-p_pooled)/n_A + p_pooled(1-p_pooled)/n_B = p_pooled(1-p_pooled) * (1/n_A + 1/n_B). Taking the square root gives SE = sqrt(p_pooled(1-p_pooled)(1/n_A + 1/n_B)), matching the formula in the interactive lab. Pooling is used (rather than plugging in the separately observed pA and pB) because the Z-test statistic must be computed under the null hypothesis\'s assumption that there is no true difference, so the best single estimate of the shared population proportion is the combined pooled rate.',
              type: 'free-response'
            },
            {
              id: 'ex-p4-3',
              question: 'A product team wants to detect an absolute lift from a 10% baseline conversion rate to 12% (a minimum detectable effect of 2 percentage points), with a two-tailed alpha of 0.05 (z ≈ 1.96) and 80% power (z ≈ 0.84). Using the approximate two-proportion sample size formula n ≈ 2*p*(1-p)*(z_alpha/2 + z_beta)^2 / delta^2, what is the approximate required sample size per group?',
              options: ['~880 per group', '~1,568 per group', '~3,528 per group', '~7,056 per group'],
              correctAnswer: 2,
              explanation: 'Plugging in p = 0.10, delta = 0.02, and (z_alpha/2 + z_beta)^2 = (1.96 + 0.84)^2 = 2.8^2 = 7.84: n ≈ 2 * 0.10 * 0.90 * 7.84 / (0.02)^2 = 0.18 * 7.84 / 0.0004 = 1.4112 / 0.0004 ≈ 3,528 per group. Smaller minimum detectable effects require quadratically larger sample sizes, since delta appears squared in the denominator.',
              type: 'multiple-choice'
            },
            {
              id: 'ex-p4-4',
              question: 'A data scientist runs an experiment tracking 10 different metrics (click-through rate, revenue, session length, etc.) and finds that exactly one metric, "time on page," is significant at p = 0.04. Should this be reported as a significant finding without further correction?',
              options: [
                'Yes, any p-value below 0.05 is significant regardless of how many metrics were tested.',
                'No — with 10 simultaneous comparisons, a Bonferroni-corrected threshold of 0.05/10 = 0.005 should be used, and 0.04 would not clear it.',
                'No — the experiment should be discarded entirely because multiple metrics were measured.',
                'Yes, because only one metric out of ten was significant, which proves it is a real effect.'
              ],
              correctAnswer: 1,
              explanation: 'Testing 10 metrics simultaneously without correction means the family-wise probability of at least one false positive is much higher than 5% even if every null hypothesis is true. The Bonferroni correction controls this by dividing alpha by the number of comparisons (0.05/10 = 0.005); since 0.04 > 0.005, this result would not be considered significant after correction, and is plausibly a false positive from multiple testing.',
              type: 'multiple-choice'
            },
            {
              id: 'ex-p4-5',
              question: 'In the interactive lab\'s `ab_test_z_score` function, what would happen to the computed Z-score and p-value if `n_A` and `n_B` were both doubled while `conv_A` and `conv_B` were also both doubled (keeping the observed conversion rates pA and pB identical)?',
              options: [
                'The Z-score would stay exactly the same, since the conversion rates are unchanged.',
                'The Z-score would increase in magnitude (become more significant), because the standard error shrinks as sample size grows while the observed rate difference stays the same.',
                'The Z-score would decrease in magnitude, because more data always adds more noise.',
                'The p-value would become undefined due to division by zero.'
              ],
              correctAnswer: 1,
              explanation: 'The standard error SE = sqrt(p_pooled(1-p_pooled)(1/n_A + 1/n_B)) shrinks as n_A and n_B grow, while the numerator (pB - pA) is unchanged since the rates are identical. A smaller denominator with the same numerator produces a larger-magnitude Z-score and therefore a smaller p-value — this is precisely why larger sample sizes make it easier to detect the same true effect size with statistical confidence.',
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
            'What is the relationship between sample size N and the minimum detectable effect (MDE)?',
            'Why does the Student\'s t-distribution converge to the standard normal distribution as sample size (and degrees of freedom) grows, and why does this matter for choosing between a Z-test and a t-test?',
            'How would you explain the difference between statistical significance and practical significance to a stakeholder who wants to ship a feature based purely on a small p-value?',
            'Why does pooling the conversion rate across both groups (rather than using each group\'s own observed rate) matter when computing the standard error for a two-proportion Z-test under the null hypothesis?',
            'If a team wants to keep monitoring an experiment continuously without inflating the false-positive rate, what statistical approaches (beyond simply waiting until a fixed sample size is reached) might address the peeking problem?'
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
            { term: 'P-Value', definition: 'The probability of obtaining test results at least as extreme as the observed results under the assumption that the null hypothesis is true; a small p-value indicates the observed data would be unusual if H0 were true.' },
            { term: 'Type I Error', definition: 'The incorrect rejection of a true null hypothesis (a false positive), whose probability is controlled by the chosen significance level alpha.' },
            { term: 'Type II Error', definition: 'The failure to reject a false null hypothesis (a false negative, probability beta), which occurs when a test lacks sufficient power or sample size to detect a real effect.' },
            { term: 'Statistical Power', definition: 'The probability (1 - beta) that a hypothesis test correctly rejects a false null hypothesis; power increases with larger sample sizes, larger true effect sizes, and higher significance thresholds.' },
            { term: 'Confidence Interval', definition: 'A range of values, computed from sample data, that would contain the true population parameter in a specified proportion (e.g., 95%) of repeated samples; it quantifies the precision of a point estimate.' },
            { term: 'Significance Level (Alpha)', definition: 'The pre-chosen probability threshold (commonly 0.05) below which a p-value is considered small enough to reject the null hypothesis; it directly sets the long-run Type I error rate of the test.' },
            { term: "Student's t-Distribution", definition: 'A probability distribution similar to the standard normal but with heavier tails, used when estimating the mean of a normally distributed population from a small sample with unknown population variance; it converges to the standard normal as degrees of freedom (N-1) grows.' },
            { term: 'Bonferroni Correction', definition: 'A multiple-testing correction that divides the significance threshold alpha by the number of comparisons m (using alpha/m per test) to control the family-wise error rate when multiple hypotheses are tested simultaneously.' },
            { term: 'Minimum Detectable Effect (MDE)', definition: 'The smallest true effect size that an experiment is powered to reliably detect at a given sample size, significance level, and power; smaller MDEs require larger sample sizes to detect.' },
            { term: 'Peeking (Optional Stopping)', definition: 'The practice of repeatedly checking a test\'s p-value before the pre-planned sample size is reached and stopping as soon as significance is observed, which inflates the true Type I error rate well above the nominal alpha.' }
          ],
          commonMisconceptions: [
            'Misconception: A p-value of 0.03 means there is a 97% probability that the alternative hypothesis is true. Reality: P-value measures data likelihood under H0, not hypothesis posterior probability; interpreting it as P(H1 is true) confuses a frequentist likelihood statement with a Bayesian posterior probability.',
            'Misconception: Failing to reject the null hypothesis proves the null hypothesis is true. Reality: A non-significant result only means the test lacked sufficient evidence (or power) to detect an effect; it does not establish that no effect exists.',
            'Misconception: A statistically significant result is automatically practically or business-meaningful. Reality: With a large enough sample size, even a trivially small effect can produce a very small p-value, so statistical significance must always be paired with an examination of effect size and confidence interval width.',
            'Misconception: Checking A/B test results daily and stopping as soon as p < 0.05 is a valid way to run the experiment faster. Reality: This "peeking" behavior inflates the true false-positive rate far above the nominal 5%, because each additional look gives the test another chance to cross the significance threshold purely by random chance.',
            'Misconception: Running many metrics or segment comparisons in one experiment and reporting whichever ones came out significant is a fair use of the data. Reality: Without a multiple-testing correction like Bonferroni, testing many hypotheses simultaneously sharply increases the probability that at least one comparison appears significant purely by chance.'
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
