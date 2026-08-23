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
            'HTTP Methods (GET, POST, PUT, DELETE), Status Codes, and REST Principles: REST APIs expose model predictions and resources over HTTP using a small, standardized vocabulary of methods and status codes, so any client — web app, mobile app, or another service — can reliably request inference without needing to know the server\'s internal implementation, which is the foundation for decoupling model-serving infrastructure from the applications that consume it.',
            'Data Validation Schemas and Defensive Type Casting: Validating every incoming request payload against an explicit schema (field types, ranges, required fields) before it reaches the model rejects malformed or malicious input early with a clear error, preventing silent type-coercion bugs deep inside the inference code and giving operators an auditable contract for what the API accepts.',
            'Docker Fundamentals: Images, Containers, Layers, Dockerfile Commands: Docker packages an ML model together with its exact code, dependencies, and runtime environment into an immutable, layered image that runs identically on a laptop, a CI server, or a cloud cluster, eliminating the classic "it worked on my machine" failure mode that is especially dangerous in ML where subtle library-version differences can silently change model outputs.',
            'Model Serving: Batch Inference vs Real-Time Latency Optimization: Batch inference processes large volumes of data on a schedule and optimizes for throughput and cost, while real-time (online) serving answers individual requests within a strict latency budget and optimizes for tail latency — choosing the wrong serving pattern for a use case is one of the most common production ML engineering mistakes.',
            'Data & Concept Drift: Population Stability Index (PSI) and KS-Tests: Because a model is only as good as its match to the data distribution it was trained on, production systems must continuously measure whether incoming feature distributions (data/covariate drift) or the relationship between features and labels (concept drift) have shifted using statistical tests like PSI or the Kolmogorov-Smirnov test, triggering retraining or investigation before silent accuracy degradation reaches end users.',
            'CI/CD Pipelines for Machine Learning: Continuous integration/continuous deployment for ML extends traditional software CI/CD with ML-specific stages — data validation, model training, offline evaluation against a held-out set, and automated rollback — so a new model version can be tested and promoted to production with the same rigor and speed as an application code change, rather than through slow manual handoffs.',
            'Model Monitoring and Observability: Beyond infrastructure metrics like CPU and latency, production ML systems must log prediction distributions, feature statistics, and (when available) ground-truth outcomes so engineers can distinguish an infrastructure failure from a silent model-quality failure, since a service can return HTTP 200 on every request while the underlying predictions have become useless.'
          ],
          simpleExplanation: `Imagine a restaurant where, instead of a waiter taking your order verbally, everyone fills out the same standardized order slip: dish name, quantity, special instructions, all in a fixed format the kitchen already understands. A REST API works the same way for computer programs — instead of one app calling another with some ad-hoc, unpredictable message, they agree on a small standard vocabulary (GET for "show me something," POST for "create something," and so on) and a shared format for that "order slip." If the slip is filled out wrong — say the quantity field says "purple" — the kitchen sends it straight back before it ever touches the stove. That is what schema validation and error codes like 400 or 422 do: they catch a bad request before it ever reaches the actual model.

Now imagine you perfected a recipe in your home kitchen, but every restaurant that tries to cook it gets a slightly different result, because their oven runs hotter, they're missing an ingredient, or their measuring cups are calibrated differently. Docker solves this by packing not just the recipe but the exact "oven," exact ingredient versions, and exact tools into a sealed shipping container that can be opened anywhere and produces identical results every time — whether that's a laptop, a test server, or a giant cloud data center.

But even a model that was cooked perfectly can go stale over time. Picture a GPS app that used to get you home perfectly using a map of the city from two years ago. Roads have since been rebuilt, a new neighborhood went up, and a bridge closed — the GPS keeps confidently giving directions, but they're increasingly wrong, because the real world has quietly drifted away from the map it's using. That is model drift: a model trained on last year's data keeps predicting as if the world still looks like last year, even as the real pattern of transactions, images, or user behavior shifts underneath it. Statistical tests like the Population Stability Index measure exactly how far the "new map" (live data) has drifted from the "old map" (training data), giving engineers an early warning instead of a silent failure.

Because a stale model or a bad deployment can be costly, teams roll out changes cautiously — first quietly serving a new version to a handful of "tables" (a canary release) before ever putting it on the full menu, watching closely to make sure nothing goes wrong before scaling it up to everyone.`,
          realWorldApplications: [
            {
              title: "Stripe's Payment API",
              description: "Stripe's REST API uses a small, standardized set of HTTP methods plus strict JSON schema validation so any client integrating payments gets an immediate, clear error for a malformed request before any money ever moves."
            },
            {
              title: "Spotify's containerized backend services",
              description: 'Spotify packages many of its backend and data services into Docker containers, so the exact same containerized service behaves identically across a developer laptop, staging, and production infrastructure.'
            },
            {
              title: "Netflix's recommendation model monitoring",
              description: 'Netflix continuously monitors its personalization and recommendation models for prediction and feature drift, since a model trained on older viewing patterns can silently stop matching current audience behavior.'
            },
            {
              title: "PayPal's real-time fraud-detection systems",
              description: 'Large-scale fraud-detection pipelines like PayPal\'s track statistical drift in transaction feature distributions (the same idea behind PSI and KS-tests) to catch shifts, such as holiday spending spikes, before fraud models silently degrade.'
            },
            {
              title: "Google's canary deployment practice",
              description: 'Google popularized canary deployments across its production services, routing a small slice of live traffic to a new service or model version and comparing metrics before a full rollout — now a standard practice across the industry, including ML model serving.'
            }
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
            },
            {
              id: 'ex-p7-2',
              question: 'A fraud-detection model\'s input transaction amounts start skewing much higher after a holiday sale season, but the relationship between transaction patterns and actual fraud/not-fraud outcomes stays the same. What type of drift is this?',
              options: ['Data drift (covariate shift)', 'Concept drift', 'Label leakage', 'Training/serving skew'],
              correctAnswer: 0,
              explanation: 'This is data drift: the distribution of input features P(X) changed (higher transaction amounts) but the underlying relationship between features and the fraud label P(y|X) is unchanged. Concept drift would instead mean the same transaction pattern now maps to a different fraud probability than before.',
              type: 'multiple-choice'
            },
            {
              id: 'ex-p7-3',
              question: 'Your team deploys a new model version. Offline evaluation showed a 2% accuracy improvement over the previous version, but one week after deployment, customer complaints spike and manual review shows the new model is making poor predictions on inputs with a categorical feature value that was extremely rare in the training set. Walk through how you would diagnose and confirm the root cause, and what monitoring you would add to catch this earlier next time.',
              explanation: 'This points to an underrepresented-slice failure rather than global drift: aggregate offline accuracy improved, but performance on the rare categorical value was likely already weak and got masked by the aggregate metric. Diagnosis: slice the evaluation set and production logs by that categorical feature and compare per-slice accuracy between model versions; check whether the rare category\'s frequency changed in production (data drift) or whether it was simply always underrepresented in training data. Prevention: add per-slice (stratified) evaluation metrics as a CI/CD gate rather than relying on aggregate accuracy alone, and add production monitoring that tracks prediction/error metrics broken down by key categorical features so a regression concentrated in one slice triggers an alert even when the aggregate metric looks healthy.',
              type: 'free-response'
            },
            {
              id: 'ex-p7-4',
              question: 'What is the main benefit of a canary deployment strategy when rolling out a new ML model version?',
              options: [
                'It limits the blast radius of a bad model by exposing it to only a small fraction of live traffic before a full rollout, enabling safe comparison and rollback',
                'It eliminates the need for any offline evaluation before deployment',
                'It guarantees the new model has zero latency overhead',
                'It automatically retrains the model on production data'
              ],
              correctAnswer: 0,
              explanation: 'Canary deployments reduce risk by routing a small percentage of real traffic to the new version first. If monitored metrics (error rate, latency, prediction distribution) look healthy, traffic is gradually increased; if not, the rollout is aborted with minimal user impact.',
              type: 'multiple-choice'
            },
            {
              id: 'ex-p7-5',
              question: 'Given PSI thresholds commonly used in industry (PSI < 0.1 = no significant shift, 0.1-0.25 = moderate shift worth investigating, PSI >= 0.25 = significant shift), your production monitoring reports a nightly PSI of 0.31 for a key numeric feature. What actions should this trigger, and why shouldn\'t you treat this threshold as absolute proof the model is broken?',
              explanation: 'A PSI of 0.31 exceeds the conventional 0.25 "significant shift" threshold and should trigger an investigation workflow: alert the ML/data team, inspect the feature\'s distribution change (e.g., via histograms), check upstream data pipelines for bugs or schema changes, and correlate with any available ground-truth labels or proxy metrics to see whether actual model performance has degraded. PSI alone measures distributional change, not model accuracy — a shifted-but-still-well-modeled feature range may not hurt predictions, so PSI should be treated as a triage signal that prioritizes investigation, not as automatic proof of model failure or an automatic retraining trigger.',
              type: 'free-response'
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
            'How does Docker image layer caching optimize CI/CD build speeds?',
            'Why is a 200 OK HTTP status code insufficient evidence that a deployed model is making good predictions?',
            'What tradeoffs would you weigh when deciding between batch inference and real-time serving for a given ML use case?',
            'How does a canary deployment reduce the risk of rolling out a regressed model compared to deploying directly to 100% of traffic?',
            'Why can training/serving skew degrade model accuracy even when the model itself and its offline evaluation are unchanged?'
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
            { term: 'Population Stability Index (PSI)', definition: 'A statistical metric measuring how much a variable\'s distribution has shifted between two datasets (typically training vs. production) over time, computed by binning both distributions and summing (actual% - expected%) * ln(actual%/expected%) across bins.' },
            { term: 'Containerization', definition: 'Encapsulating an application and its dependencies into an isolated, portable container image that runs consistently across development, testing, and production environments.' },
            { term: 'Data Drift (Covariate Shift)', definition: 'A change in the distribution of input features P(X) between training and production data while the relationship between features and labels P(y|X) remains the same; detected using tests like PSI or the KS-test on feature values.' },
            { term: 'Concept Drift', definition: 'A change in the underlying relationship between input features and the target label, P(y|X), over time — for example, customer behavior shifting after a market event — such that a model\'s learned mapping no longer holds even if input feature distributions look unchanged.' },
            { term: 'Kolmogorov-Smirnov (KS) Test', definition: 'A non-parametric statistical test that quantifies the maximum distance between the cumulative distribution functions of two samples, commonly used to detect whether a production feature\'s distribution has diverged significantly from its training-time distribution.' },
            { term: 'Canary Deployment', definition: 'A release strategy that routes a small percentage of live production traffic to a new model version while the majority continues to use the current version, allowing engineers to compare performance and safely roll back before a full rollout.' },
            { term: 'Feature Store', definition: 'A centralized system for storing, versioning, and serving curated features so the exact same feature computation logic is used consistently during both offline model training and online real-time inference, preventing training/serving skew.' },
            { term: 'Training/Serving Skew', definition: 'A discrepancy between how features are computed or data is preprocessed at training time versus at inference time, which silently degrades model accuracy in production even when the model itself and the offline evaluation looked correct.' },
            { term: 'Latency vs. Throughput Tradeoff', definition: 'Latency measures the time to complete a single request while throughput measures the number of requests a system can process per unit time; techniques like request batching improve throughput but typically increase per-request latency, so serving architecture must be tuned to the use case\'s requirements.' },
            { term: 'Model Rollback', definition: 'The operational practice of automatically or manually reverting a production model-serving endpoint to a previously known-good model version when monitoring detects a regression in latency, error rate, or prediction quality.' }
          ],
          commonMisconceptions: [
            'Misconception: A deployed model requires no further maintenance. Reality: Production models degrade over time due to real-world data and concept drift, changing user behavior, and upstream data pipeline changes, so they require continuous monitoring, alerting, and periodic retraining.',
            'Misconception: If a model performs well on the offline test set, it will perform identically in production. Reality: Production performance can differ due to training/serving skew, data drift, feedback loops the model itself creates, and edge cases underrepresented in the offline evaluation set — offline metrics are necessary but not sufficient evidence of production quality.',
            'Misconception: A REST API returning HTTP 200 means the underlying model prediction is correct or trustworthy. Reality: A 200 status only confirms the service executed without an infrastructure-level error; the prediction itself can still be low-confidence, out-of-distribution, or silently wrong, which is why prediction-quality monitoring must be layered on top of basic uptime/status-code monitoring.',
            'Misconception: Docker containers make deployments completely reproducible on their own. Reality: A Dockerfile that doesn\'t pin exact dependency versions (or that pulls a mutable base image tag like "latest") can still produce different builds over time, so reproducibility also requires locked dependency versions and pinned base image digests.',
            'Misconception: Detecting data drift with a high PSI or KS-statistic always means the model must be retrained immediately. Reality: Drift indicates the input distribution has changed, but that alone doesn\'t prove accuracy has dropped — engineers should correlate drift signals with actual performance metrics (once ground truth is available) before triggering a costly retraining pipeline.'
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
