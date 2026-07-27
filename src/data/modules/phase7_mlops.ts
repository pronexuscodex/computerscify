import { CurriculumModule } from '../../types/curriculum';
import { VERIFIED_VIDEOS } from '../verifiedVideoRegistry';

export const phase7MLOpsModules: CurriculumModule[] = [
  {
    id: 'p7-m18',
    phaseId: 7,
    title: 'Production Engineering & MLOps',
    slug: 'production-engineering-mlops',
    category: 'engineering',
    summary: 'Master REST API development, Docker containerization, continuous integration, model serving, experiment tracking, data drift monitoring, and cloud deployment principles.',
    objective: 'Package ML models into production microservices, construct reproducible CI/CD container pipelines, and implement real-time data drift monitoring.',
    prerequisiteModuleIds: ['p2-m8', 'p5-m16'],
    estimatedHours: 28,
    difficulty: 'advanced',
    colorAccent: 'softblue',
    capstone: {
      id: 'capstone-p7-m18',
      title: 'Containerized Production Model Microservice & Monitoring Dashboard',
      description: 'Build a production-ready REST API microservice wrapping a trained ML model inside Docker with input data schema validation, metrics logging, and drift detection.',
      constraints: ['REST API architecture with schema validation and Dockerfile containerization.'],
      expectedDeliverables: ['REST API route handler with input validation.', 'Dockerfile specification.', 'Data drift monitoring module (KS-test / PSI).'],
      evaluationRubric: [
        { criterion: 'API Resilience & Schema Validation', weight: '50%', description: 'Rejects invalid input payloads with HTTP 422 before model inference.' },
        { criterion: 'Drift Monitoring Accuracy', weight: '50%', description: 'Accurately detects distribution shifts between training and inference payloads.' }
      ]
    },
    topics: [
      {
        id: 'p7-m18-t1',
        moduleId: 'p7-m18',
        title: 'REST APIs, Docker Containers, and Model Drift Monitoring',
        slug: 'apis-docker-drift-monitoring',
        summary: 'Learn HTTP REST principles, data validation schemas, Dockerfile container building, and Kolmogorov-Smirnov statistical data drift monitoring.',
        order: 1,
        masteryPack: {
          learningObjective: 'Design production HTTP APIs, containerize services using Docker, and measure statistical distribution drift in live model traffic.',
          prerequisites: ['Python web fundamentals', 'Machine learning inference concepts'],
          coreConcepts: [
            'HTTP Methods (GET, POST, PUT, DELETE), Status Codes, and REST Principles',
            'Data Validation Schemas and Defensive Type Casting',
            'Docker Fundamentals: Images, Containers, Layers, Dockerfile Commands',
            'Model Serving: Batch Inference vs Real-Time Latency Optimization',
            'Data & Concept Drift: Population Stability Index (PSI) and KS-Tests'
          ],
          primaryLecture: VERIFIED_VIDEOS['p7-m18-t1'] as any,
          primaryText: {
            id: 'book-designing-ml-systems',
            title: 'Designing Machine Learning Systems (Free Course Materials & Chapters)',
            authors: ['Chip Huyen'],
            url: 'https://huyenchip.com/ml-interviews-book/',
        pdfUrl: 'https://proceedings.neurips.cc/paper_files/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf',
            recommendedChapter: 'Chapter 7: Model Deployment & Chapter 9: Continual Learning and Monitoring',
            publisherOrInstitution: 'O’Reilly / Chip Huyen Open Courseware',
            accessStatus: 'verified'
          },
          recommendedChapter: 'Chapter 7: Model Deployment and Serving',
          authoritativeResearchSource: {
            id: 'paper-sculley-2015',
            title: 'Hidden Technical Debt in Machine Learning Systems',
            authors: ['D. Sculley', 'Gary Holt', 'Daniel Golovin', 'Eugene Davydov', 'Todd Phillips', 'Dietmar Ebner', 'Vinay Chaudhary', 'Michael Young', 'Jean-François Crespo', 'Dan Webb'],
            year: 2015,
            venue: 'Advances in Neural Information Processing Systems (NeurIPS)',
            openAccessUrl: 'https://papers.nips.cc/paper/5656-hidden-technical-debt-in-machine-learning-systems.pdf',
            paperType: 'seminal',
            difficulty: 'intermediate',
            prerequisites: ['Software engineering & ML systems'],
            summary: 'The iconic Google paper establishing that actual ML model code is only a tiny fraction of a production ML system, warning against technical debt in glue code, data cascades, and pipeline debt.',
            whyItMatters: 'Defined the core rationale for the entire field of MLOps and production ML engineering.',
            sectionsToRead: 'Sections 1–4: Boundaries, Glue Code, and Pipeline Debt',
            readingQuestions: [
              'Why is "glue code" dangerous in production machine learning systems?',
              'What is a "data cascade" and how does it propagate errors in production ML pipelines?'
            ],
            relatedTopicIds: ['p7-m18-t1'],
            accessStatus: 'verified'
          },
          practicalExercises: [
            {
              id: 'ex-p7-1',
              question: 'Which HTTP status code should a REST API return when a client sends an invalid payload that fails schema validation?',
              options: ['400 Bad Request / 422 Unprocessable Entity', '200 OK', '500 Internal Server Error', '404 Not Found'],
              correctAnswer: 0,
              explanation: 'Invalid input payloads from clients trigger 400 or 422 client error status codes.',
              type: 'multiple-choice'
            }
          ],
          interactiveLab: {
            id: 'lab-p7-1',
            title: 'Population Stability Index (PSI) Data Drift Detector',
            type: 'python',
            instructions: 'Write a Python script that calculates Population Stability Index (PSI) between baseline training feature distribution and incoming inference production feature values.',
            starterCode: `import math

def calculate_psi(expected, actual, num_buckets=5):
    # Quantile binning for drift
    expected_sorted = sorted(expected)
    actual_sorted = sorted(actual)
    
    N_exp = len(expected)
    N_act = len(actual)
    
    psi_total = 0.0
    bucket_size_exp = N_exp // num_buckets
    
    for i in range(num_buckets):
        exp_sub = expected_sorted[i*bucket_size_exp : (i+1)*bucket_size_exp]
        if not exp_sub:
            continue
        min_val = exp_sub[0]
        max_val = exp_sub[-1] if i < num_buckets - 1 else float('inf')
        
        # Count actual in range
        act_count = sum(1 for x in actual if min_val <= x <= max_val)
        exp_pct = max(0.0001, len(exp_sub) / N_exp)
        act_pct = max(0.0001, act_count / N_act)
        
        # PSI formula = (Actual % - Expected %) * ln(Actual % / Expected %)
        bucket_psi = (act_pct - exp_pct) * math.log(act_pct / exp_pct)
        psi_total += bucket_psi
        
    return psi_total

# Test baseline vs shifted production distribution
training_data = [10, 12, 11, 14, 13, 15, 12, 11, 13, 14, 12, 13, 15, 10, 11]
shifted_prod_data = [25, 28, 30, 27, 26, 29, 31, 28, 27, 30, 29, 28, 32, 26, 27]

psi = calculate_psi(training_data, shifted_prod_data)
print("Calculated PSI:", round(psi, 4))
print("Drift Status:", "High Data Drift (PSI > 0.25)" if psi > 0.25 else "Stable Data")
`,
            testCases: [
              {
                expectedOutput: 'Drift Status: High Data Drift (PSI > 0.25)',
                description: 'Validates statistical data drift detection trigger.'
              }
            ]
          },
          readingQuestions: [
            'What is the difference between Data Drift (covariate shift) and Concept Drift (P(y|X) changes)?',
            'How does Docker image layer caching optimize CI/CD build speeds?'
          ],
          masteryChecklist: [
            'Construct a REST API with request schema validation.',
            'Write a multi-stage Dockerfile optimizing container image size.',
            'Calculate PSI and KS-statistic to alert on live data drift.'
          ],
          capstoneMilestone: 'Milestone 1: Containerized API microservice & drift alert system.',
          estimatedStudyMinutes: 220,
          difficulty: 'advanced',
          glossary: [
            { term: 'Population Stability Index (PSI)', definition: 'A statistical metric measuring how much a variable’s distribution has shifted between two datasets over time.' },
            { term: 'Containerization', definition: 'Encapsulating an application and its dependencies into an isolated container image running consistently across environments.' }
          ],
          commonMisconceptions: [
            'Misconception: A deployed model requires no further maintenance. Reality: Production models degrade over time due to real-world data drift and require continuous monitoring.'
          ],
          connectionsToLaterModules: [
            'Foundation for Distributed Machine Learning & Cloud Architectures in Phase 8'
          ],
          citation: { text: 'Sculley, D., et al. (2015). Hidden Technical Debt in Machine Learning Systems. NeurIPS 2015.' },
          accessStatus: 'verified'
        }
      }
    ]
  }
];
