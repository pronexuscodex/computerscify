import {
  AssessmentDefinition,
  BookResource,
  CapstoneProjectMilestone,
  Course,
  DifficultyLevel,
  InteractiveLabDefinition,
  MasteryPack,
  PracticeExercise,
  ResearchPaper,
  Topic,
} from '../types/curriculum';
import type { CyberLessonSafetyMetadata } from '../types/cyberSafety';
import { VERIFIED_VIDEOS } from '../data/verifiedVideoRegistry';

interface AiTopicDefinition {
  id: string;
  title: string;
  summary: string;
  objective: string;
  concepts: string[];
  prerequisites: string[];
  exercise: PracticeExercise;
  lab: InteractiveLabDefinition;
  checklist: string[];
  misconceptions: string[];
  glossary: Array<{ term: string; definition: string }>;
  researchPapers?: ResearchPaper[];
  primaryText?: BookResource;
  cyberSafety?: CyberLessonSafetyMetadata;
}

interface AiCourseDefinition {
  id: string;
  code: string;
  title: string;
  description: string;
  estimatedHours: number;
  difficulty: DifficultyLevel;
  prerequisiteCourseIds: string[];
  learningOutcomes: string[];
  topics: AiTopicDefinition[];
  project: Omit<CapstoneProjectMilestone, 'id'>;
}

const makeMasteryPack = (
  course: AiCourseDefinition,
  topic: AiTopicDefinition,
  topicIndex: number
): MasteryPack => ({
  learningObjective: topic.objective,
  prerequisites: topic.prerequisites,
  coreConcepts: topic.concepts,
  recommendedChapter: `Course unit ${topicIndex + 1}: ${topic.title}`,
  practicalExercises: [topic.exercise],
  interactiveLab: topic.lab,
  primaryLecture: (VERIFIED_VIDEOS as Record<string, MasteryPack['primaryLecture']>)[topic.id],
  primaryText: topic.primaryText,
  readingQuestions: [
    `What evidence would demonstrate that ${topic.title.toLowerCase()} works as intended?`,
    'Which assumptions or failure modes should be documented before deployment?',
  ],
  masteryChecklist: topic.checklist,
  capstoneMilestone: course.project.title,
  estimatedStudyMinutes: Math.round((course.estimatedHours * 60) / course.topics.length),
  difficulty: course.difficulty,
  glossary: topic.glossary,
  commonMisconceptions: topic.misconceptions,
  connectionsToLaterModules: ['AI evaluation', 'Production reliability', 'Responsible AI'],
  citation: {
    text: 'ComputerSciFy AI Engineering curriculum — internally authored course notes and exercises.',
  },
  accessStatus: 'needsVerification',
});

const makeAssessment = (
  course: AiCourseDefinition,
  type: AssessmentDefinition['type']
): AssessmentDefinition => ({
  id: `${course.id}-${type}`,
  title: `${course.code} ${type === 'midterm' ? 'Design Review' : 'Final Assessment'}`,
  type,
  instructions:
    type === 'midterm'
      ? 'Explain the engineering trade-offs in writing before checking the reference explanation.'
      : 'Complete the questions and connect each answer to evidence from the course project.',
  questions: course.topics.map((topic, index) => ({
    ...topic.exercise,
    id: `${course.id}-${type}-q${index + 1}`,
  })),
  passScorePercentage: type === 'midterm' ? 70 : 80,
});

const makeCourse = (definition: AiCourseDefinition): Course => ({
  id: definition.id,
  code: definition.code,
  title: definition.title,
  program: 'data-science',
  year: 4,
  semester: 8,
  creditHours: 3,
  estimatedHours: definition.estimatedHours,
  isRequired: false,
  isElective: true,
  category: 'ml',
  prerequisiteCourseIds: definition.prerequisiteCourseIds,
  description: definition.description,
  learningOutcomes: definition.learningOutcomes,
  sections: [
    {
      id: `${definition.id}-s1`,
      title: `Section 1: ${definition.title}`,
      summary: definition.description,
      order: 1,
      topics: definition.topics.map((topic, index): Topic => ({
        id: topic.id,
        moduleId: definition.id,
        title: topic.title,
        slug: topic.id,
        summary: topic.summary,
        order: index + 1,
        masteryPack: makeMasteryPack(definition, topic, index),
        labIds: [topic.lab.id],
        interactiveLabs: [topic.lab],
        researchPapers: topic.researchPapers,
        cyberSafety: topic.cyberSafety,
      })),
    },
  ],
  books: [],
  papers: [],
  lectures: [],
  labs: definition.topics.map((topic) => topic.lab),
  midTermAssessment: makeAssessment(definition, 'midterm'),
  finalAssessment: makeAssessment(definition, 'final'),
  capstoneProject: {
    ...definition.project,
    id: `${definition.id}-capstone`,
  },
});

const definitions: AiCourseDefinition[] = [
  {
    id: 'ai-100',
    code: 'AI 100',
    title: 'AI Orientation, Product Lifecycle & Responsible Practice',
    description: 'A grounded introduction to AI fields, product lifecycles, limitations, evaluation, privacy, bias, and responsible use.',
    estimatedHours: 28,
    difficulty: 'beginner',
    prerequisiteCourseIds: [],
    learningOutcomes: [
      'Distinguish AI, machine learning, deep learning, generative AI, computer vision, recommendation systems, and agents',
      'Map an AI product from problem framing through monitoring and retirement',
      'Recognize hallucination, bias, privacy, and evaluation risks',
    ],
    topics: [
      {
        id: 'ai100-t1',
        title: 'AI Systems and Product Lifecycles',
        summary: 'AI families, common product patterns, lifecycle stages, and the boundary between models and complete systems.',
        objective: 'Classify AI system types and trace the evidence required at every product lifecycle stage.',
        concepts: ['Machine learning', 'Deep learning', 'Generative AI', 'Computer vision', 'Recommendation systems', 'AI agents', 'Product lifecycle'],
        prerequisites: ['Basic computing vocabulary'],
        exercise: { id: 'ai100-ex1', type: 'free-response', question: 'Create an AI concept map that separates models, data, interfaces, and operational controls.', explanation: 'A sound map treats the model as one component of a larger sociotechnical system.' },
        lab: { id: 'ai100-lab1', title: 'AI Product Classification Worksheet', type: 'algo-viz', practiceMode: 'guided-lesson', level: 'level-0', estimatedMinutes: 45, instructions: 'Classify five product scenarios and map their data, model, evaluation, and monitoring stages.', objective: 'Connect AI categories to complete product lifecycles.', starterCode: '' },
        checklist: ['Explain the difference between ML and deep learning', 'Identify the model, data, interface, and monitoring layers', 'Describe an appropriate retirement condition'],
        misconceptions: ['Every automated decision system uses machine learning', 'A capable model is a complete product'],
        glossary: [{ term: 'AI product lifecycle', definition: 'The stages from problem framing and data work through evaluation, deployment, monitoring, and retirement.' }],
        researchPapers: [
          { id: 'paper-foundation-models-opportunities-risks', title: 'On the Opportunities and Risks of Foundation Models', authors: ['Rishi Bommasani', 'Drew A. Hudson', 'Ehsan Adeli', 'et al. (Stanford Center for Research on Foundation Models)'], year: 2021, venue: 'arXiv preprint (Stanford CRFM)', doiOrArxiv: 'arXiv:2108.07258', openAccessUrl: 'https://arxiv.org/pdf/2108.07258', canonicalUrl: 'https://arxiv.org/abs/2108.07258', paperType: 'survey', difficulty: 'intermediate', prerequisites: ['Basic computing vocabulary'], summary: 'A wide-ranging report examining large-scale "foundation models" (e.g. BERT, GPT-3, DALL-E) trained on broad data and adapted to many downstream tasks, covering capabilities, technical architecture, and societal implications.', whyItMatters: 'Names and frames the exact family of systems this topic asks learners to classify, and its central warning — that "the defects of the foundation model are inherited by all the adapted models downstream" — is the direct argument for treating a model as one component of a larger product, not the whole product.', sectionsToRead: 'Abstract, Section 1 (Introduction), and the overview of societal considerations.', readingQuestions: ['What distinguishes a foundation model from the products built on top of it?', 'Why does the paper treat inherited defects as a systemic risk rather than a per-model bug?', 'Which product-lifecycle stages does this topic\'s concept map need to cover that a model card alone would not?'], relatedTopicIds: ['ai100-t1'], accessStatus: 'open-access', deliveryMode: 'in-app-pdf-candidate' },
        ],
        primaryText: {
          id: 'book-stanford-ai-index-report-2026',
          title: 'The 2026 AI Index Report',
          authors: ['Stanford Institute for Human-Centered AI (HAI)'],
          url: 'https://hai.stanford.edu/ai-index',
          pdfUrl: 'https://hai.stanford.edu/assets/files/ai_index_report_2026.pdf',
          canonicalUrl: 'https://hai.stanford.edu/assets/files/ai_index_report_2026.pdf',
          recommendedChapter: 'Chapter 1: Research and Development — AI system and product landscape',
          accessStatus: 'open-access',
          publisherOrInstitution: 'Stanford HAI',
        },
      },
      {
        id: 'ai100-t2',
        title: 'Limitations, Bias, Privacy and Responsible AI',
        summary: 'Hallucinations, bias, privacy risks, human oversight, evaluation, and responsible release decisions.',
        objective: 'Produce a responsible-AI checklist tied to concrete risks and evidence.',
        concepts: ['Hallucination', 'Bias', 'Privacy', 'Evaluation', 'Human oversight', 'Responsible AI'],
        prerequisites: ['AI systems and product lifecycles'],
        exercise: { id: 'ai100-ex2', type: 'multiple-choice', question: 'Which artifact best connects a known AI risk to a release decision?', options: ['A larger model', 'A documented evaluation rubric and acceptance threshold', 'A longer prompt', 'A marketing summary'], correctAnswer: 'A documented evaluation rubric and acceptance threshold', explanation: 'Release decisions require explicit evidence, thresholds, and accountable owners.' },
        lab: { id: 'ai100-lab2', title: 'Responsible AI Release Checklist', type: 'algo-viz', practiceMode: 'independent', level: 'level-0', estimatedMinutes: 60, instructions: 'Review a fictional AI product and document risks, affected users, evidence gaps, release gates, and escalation owners.', objective: 'Turn broad responsible-AI principles into testable release criteria.', starterCode: '' },
        checklist: ['Document affected users', 'Name at least three failure modes', 'Define evidence-based release gates'],
        misconceptions: ['A disclaimer is a substitute for evaluation', 'Bias is only a property of training data'],
        glossary: [{ term: 'Hallucination', definition: 'A fluent output that is unsupported, incorrect, or ungrounded in the required evidence.' }],
        researchPapers: [
          { id: 'paper-survey-bias-fairness-ml', title: 'A Survey on Bias and Fairness in Machine Learning', authors: ['Ninareh Mehrabi', 'Fred Morstatter', 'Nripsuta Saxena', 'Kristina Lerman', 'Aram Galstyan'], year: 2019, venue: 'arXiv preprint', doiOrArxiv: 'arXiv:1908.09635', openAccessUrl: 'https://arxiv.org/pdf/1908.09635', canonicalUrl: 'https://arxiv.org/abs/1908.09635', paperType: 'survey', difficulty: 'intermediate', prerequisites: ['AI systems and product lifecycles'], summary: 'Surveys real-world cases of AI systems producing unfair outcomes in consequential decisions, categorizes where bias enters a system, and builds a taxonomy of fairness definitions used across the field.', whyItMatters: 'Gives learners a structured way to name bias sources (data, algorithm, or evaluation) instead of treating "bias" as one vague risk, which is exactly what this topic\'s checklist and release gates require.', sectionsToRead: 'Abstract, Section 2 (Bias in data), and Section 3 (Fairness definitions).', readingQuestions: ['At which stages of a pipeline can bias be introduced, according to the survey\'s taxonomy?', 'Why do different fairness definitions sometimes conflict with each other?', 'How would you connect one of these fairness definitions to a concrete release-gate threshold?'], relatedTopicIds: ['ai100-t2'], accessStatus: 'open-access', deliveryMode: 'in-app-pdf-candidate' },
        ],
        primaryText: {
          id: 'book-nist-ai-rmf-1',
          title: 'Artificial Intelligence Risk Management Framework (AI RMF 1.0)',
          authors: ['Elham Tabassi', 'National Institute of Standards and Technology (NIST)'],
          url: 'https://nvlpubs.nist.gov/nistpubs/ai/nist.ai.100-1.pdf',
          pdfUrl: 'https://nvlpubs.nist.gov/nistpubs/ai/nist.ai.100-1.pdf',
          canonicalUrl: 'https://nvlpubs.nist.gov/nistpubs/ai/nist.ai.100-1.pdf',
          recommendedChapter: 'Part 2: AI Risks and Trustworthiness — Bias, Privacy, and Harmful Uses',
          accessStatus: 'open-access',
          publisherOrInstitution: 'NIST',
        },
      },
    ],
    project: { title: 'Responsible AI Product Analysis', description: 'Analyze a proposed AI product, create a concept map, and deliver a responsible-release checklist.', constraints: ['No live model or external AI service is required', 'Every recommendation must cite observable evidence or an explicit assumption'], expectedDeliverables: ['AI concept map', 'Product lifecycle analysis', 'Responsible AI checklist'], evaluationRubric: [{ criterion: 'Systems reasoning', weight: '35%', description: 'Separates model capability from data, product, and operational concerns.' }, { criterion: 'Risk evidence', weight: '40%', description: 'Connects concrete risks to evaluation and release gates.' }, { criterion: 'Communication', weight: '25%', description: 'Explains trade-offs clearly for technical and non-technical readers.' }] },
  },
  {
    id: 'ai-410',
    code: 'AI 410',
    title: 'Deep Learning Systems with PyTorch',
    description: 'Tensors, neural networks, backpropagation, optimization, regularization, CNNs, sequence models, attention, transformers, embeddings, and GPU-aware training.',
    estimatedHours: 72,
    difficulty: 'advanced',
    prerequisiteCourseIds: ['cs-305', 'math-201', 'stat-201'],
    learningOutcomes: ['Implement and debug a neural-network training loop', 'Explain backpropagation and optimization behavior', 'Evaluate image and text models with error analysis'],
    topics: [
      {
        id: 'ai410-t1', title: 'Tensors, Backpropagation and Optimization', summary: 'Forward passes, computation graphs, activation functions, losses, optimizers, regularization, and training diagnostics.', objective: 'Implement a small neural network from basic tensor operations and diagnose its training behavior.', concepts: ['Tensors', 'Forward pass', 'Backpropagation', 'Activation functions', 'Loss functions', 'Optimizers', 'Regularization', 'GPUs'], prerequisites: ['Machine learning', 'Linear algebra', 'Calculus'],
        exercise: { id: 'ai410-ex1', type: 'multiple-choice', question: 'What does backpropagation compute for each trainable parameter?', options: ['The dataset mean', 'The gradient of the loss', 'The final class label', 'The batch size'], correctAnswer: 'The gradient of the loss', explanation: 'Backpropagation applies the chain rule through the computation graph to compute loss gradients.' },
        lab: { id: 'ai410-lab1', title: 'Neural Network from Basic Components', type: 'python', language: 'python', practiceMode: 'guided-lesson', level: 'level-4', estimatedMinutes: 120, instructions: 'Implement a two-layer network, loss, backpropagation, and gradient checks using arrays before comparing with PyTorch autograd.', objective: 'Connect the mathematical gradient to executable training code.', starterCode: 'def forward(x, w1, w2):\n    # Return logits and cached activations.\n    pass\n\ndef gradient_check(loss_fn, parameters):\n    pass' },
        checklist: ['Trace tensor shapes', 'Explain the chain rule for one parameter', 'Use a gradient check', 'Interpret a learning curve'], misconceptions: ['Backpropagation updates parameters by itself', 'A lower training loss always means a better model'], glossary: [{ term: 'Computation graph', definition: 'A graph of tensor operations used to evaluate outputs and propagate derivatives.' }],
        researchPapers: [
          { id: 'paper-adam-optimizer', title: 'Adam: A Method for Stochastic Optimization', authors: ['Diederik P. Kingma', 'Jimmy Ba'], year: 2015, venue: 'International Conference on Learning Representations (ICLR) 2015', doiOrArxiv: 'arXiv:1412.6980', openAccessUrl: 'https://arxiv.org/pdf/1412.6980', canonicalUrl: 'https://arxiv.org/abs/1412.6980', paperType: 'seminal', difficulty: 'intermediate', prerequisites: ['Gradient descent', 'Backpropagation'], summary: 'Introduces the Adam optimizer, which combines per-parameter adaptive learning rates with momentum using running estimates of the first and second moments of the gradient.', whyItMatters: 'Adam became the default optimizer for most deep learning training loops because it converges reliably across a wide range of architectures with comparatively little tuning.', sectionsToRead: 'Abstract, Section 2 (Algorithm), and Section 6 (Experiments).', readingQuestions: ['What do the first and second moment estimates approximate?', 'Why does Adam apply bias correction to these estimates?', 'How does the effective per-parameter learning rate change as training progresses?'], relatedTopicIds: ['ai410-t1'], accessStatus: 'open-access', deliveryMode: 'in-app-pdf-candidate' },
        ],
      },
      {
        id: 'ai410-t2', title: 'CNNs, Sequence Models, Attention and Transformers', summary: 'Architectures for images and sequences, attention, transformer blocks, embeddings, and disciplined model evaluation.', objective: 'Select and evaluate a neural architecture for image or text data.', concepts: ['CNNs', 'Sequence models', 'Attention', 'Transformers', 'Embeddings', 'PyTorch', 'Error analysis'], prerequisites: ['Tensors and backpropagation'],
        exercise: { id: 'ai410-ex2', type: 'free-response', question: 'Compare the inductive bias of a CNN with the content-dependent interactions of self-attention.', explanation: 'CNNs emphasize local shared filters; self-attention learns content-dependent interactions across positions.' },
        lab: { id: 'ai410-lab2', title: 'Image and Text Classifier Error Analysis', type: 'python', language: 'python', practiceMode: 'independent', level: 'level-4', estimatedMinutes: 150, instructions: 'Train a compact classifier in a controlled notebook, record metrics by subgroup, and build an error-analysis table.', objective: 'Evaluate model behavior beyond a single aggregate score.', starterCode: 'def evaluate_by_slice(predictions, labels, slice_ids):\n    # Return metrics and representative errors per slice.\n    pass' },
        checklist: ['Explain convolutional weight sharing', 'Describe query-key-value attention', 'Report subgroup metrics', 'Document compute constraints'], misconceptions: ['Transformers make evaluation unnecessary', 'Embedding similarity is equivalent to factual correctness'], glossary: [{ term: 'Attention', definition: 'A mechanism that computes content-dependent weighted combinations of representations.' }],
        researchPapers: [
          { id: 'paper-attention-is-all-you-need', title: 'Attention Is All You Need', authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'Llion Jones', 'Aidan N. Gomez', 'Lukasz Kaiser', 'Illia Polosukhin'], year: 2017, venue: 'Neural Information Processing Systems (NeurIPS) 2017', doiOrArxiv: 'arXiv:1706.03762', openAccessUrl: 'https://arxiv.org/pdf/1706.03762', canonicalUrl: 'https://arxiv.org/abs/1706.03762', paperType: 'seminal', difficulty: 'advanced', prerequisites: ['Sequence models', 'Neural network training'], summary: 'Introduces the Transformer, an architecture built entirely on attention mechanisms that dispenses with recurrence and convolution for sequence modeling.', whyItMatters: 'The Transformer is the architectural basis for nearly all modern large language and multimodal models; understanding query-key-value attention here is a prerequisite for the rest of the AI Engineering track.', sectionsToRead: 'Abstract, Section 3 (Model Architecture), and Section 3.2 (Attention).', readingQuestions: ['How does self-attention differ from the convolutional weight sharing used in CNNs?', 'What role do positional encodings play in a model with no recurrence?', 'Why is multi-head attention used instead of a single attention function?'], relatedTopicIds: ['ai410-t2'], accessStatus: 'open-access', deliveryMode: 'in-app-pdf-candidate' },
        ],
      },
    ],
    project: { title: 'Deep Learning Training and Error-Analysis Dashboard', description: 'Build and compare an image or text classifier, then communicate training behavior and representative errors.', constraints: ['Use a bounded local or notebook dataset', 'Report compute assumptions and failed experiments', 'Do not expose private data'], expectedDeliverables: ['Training implementation', 'Evaluation report', 'Error-analysis gallery', 'Training dashboard'], evaluationRubric: [{ criterion: 'Correctness', weight: '35%', description: 'Training and evaluation code is reproducible and technically sound.' }, { criterion: 'Evaluation depth', weight: '40%', description: 'Uses meaningful slices, baselines, and representative errors.' }, { criterion: 'Responsible practice', weight: '25%', description: 'Documents data, compute, privacy, and limitation considerations.' }] },
  },
  {
    id: 'ai-420',
    code: 'AI 420',
    title: 'Generative AI and LLM Engineering',
    description: 'Transformer architecture, tokens, context, structured outputs, retrieval, reranking, citations, tool calling, multimodality, evaluation, and safety.',
    estimatedHours: 64,
    difficulty: 'advanced',
    prerequisiteCourseIds: ['ai-410', 'ds-403'],
    learningOutcomes: ['Design a citation-grounded retrieval pipeline', 'Explain context, structured output, and tool-use trade-offs', 'Specify safety and evaluation gates for a generative system'],
    topics: [
      {
        id: 'ai420-t1', title: 'Tokens, Context and Structured Generation', summary: 'Transformer inference, tokenization, context windows, prompt contracts, structured outputs, tool calling, and multimodal boundaries.', objective: 'Design an explicit input-output contract for a generative system and identify its failure modes.', concepts: ['Transformer architecture', 'Tokens', 'Context windows', 'Prompt design', 'Structured outputs', 'Tool calling', 'Multimodal systems'], prerequisites: ['Deep learning', 'Natural language processing'],
        exercise: { id: 'ai420-ex1', type: 'free-response', question: 'Design a schema and validation strategy for extracting structured claims and citations from a document.', explanation: 'A robust design defines required fields, rejects invalid structures, and verifies citations independently of generation.' },
        lab: { id: 'ai420-lab1', title: 'Structured Information Extractor Specification', type: 'algo-viz', language: 'json', practiceMode: 'guided-lesson', level: 'level-4', estimatedMinutes: 90, instructions: 'Define an input contract, JSON schema, validation errors, fallback behavior, and evaluation cases. This is a deterministic design lab; no model is embedded in ComputerSciFy.', objective: 'Specify reliable boundaries around probabilistic generation.', starterCode: '{\n  "claim": "",\n  "source_id": "",\n  "source_span": "",\n  "confidence_note": ""\n}' },
        checklist: ['Define a schema', 'Reject unsupported claims', 'Separate model output from application authorization', 'Document context limits'], misconceptions: ['A JSON instruction guarantees valid JSON', 'Tool calling gives a model permission to perform any action'], glossary: [{ term: 'Context window', definition: 'The bounded token sequence available to a model for one inference operation.' }],
        researchPapers: [
          { id: 'paper-gpt3-few-shot-learners', title: 'Language Models are Few-Shot Learners', authors: ['Tom B. Brown', 'Benjamin Mann', 'Nick Ryder', 'et al.'], year: 2020, venue: 'Neural Information Processing Systems (NeurIPS) 2020', doiOrArxiv: 'arXiv:2005.14165', openAccessUrl: 'https://arxiv.org/pdf/2005.14165', canonicalUrl: 'https://arxiv.org/abs/2005.14165', paperType: 'seminal', difficulty: 'advanced', prerequisites: ['Transformer architecture'], summary: 'Introduces GPT-3, a 175-billion-parameter language model, and shows that tasks can be specified purely through in-context text (few-shot demonstrations within the prompt) without any gradient updates or fine-tuning.', whyItMatters: 'Established the pattern of controlling model behavior through prompt content within a fixed context window rather than retraining — the exact input-output contract this topic asks learners to design and validate.', sectionsToRead: 'Abstract, Section 2 (Approach), and Section 5 (Limitations).', readingQuestions: ['What is the difference between the paper\'s "few-shot," "one-shot," and "zero-shot" settings?', 'What does it mean for a task to be "specified purely via text interaction," and what does that imply about context-window limits?', 'Which limitations does the paper itself identify that a structured-output contract would need to guard against?'], relatedTopicIds: ['ai420-t1'], accessStatus: 'open-access', deliveryMode: 'in-app-pdf-candidate' },
        ],
        primaryText: {
          id: 'book-jurafsky-martin-slp3-ch2',
          title: 'Speech and Language Processing (3rd ed. draft) — Chapter 2: Words and Tokens',
          authors: ['Daniel Jurafsky', 'James H. Martin'],
          url: 'https://web.stanford.edu/~jurafsky/slp3/',
          pdfUrl: 'https://web.stanford.edu/~jurafsky/slp3/2.pdf',
          canonicalUrl: 'https://web.stanford.edu/~jurafsky/slp3/2.pdf',
          recommendedChapter: 'Chapter 2: Words and Tokens',
          accessStatus: 'open-access',
          publisherOrInstitution: 'Stanford University',
        },
      },
      {
        id: 'ai420-t2', title: 'Retrieval-Augmented Generation and Evidence', summary: 'Chunking, embeddings, retrieval, reranking, citations, evaluation, fine-tuning concepts, multilingual retrieval, and safety.', objective: 'Design and evaluate a citation-based retrieval system without confusing retrieval quality with generation quality.', concepts: ['Embeddings', 'Chunking', 'Retrieval-augmented generation', 'Reranking', 'Citations', 'Fine-tuning', 'Evaluation', 'Safety'], prerequisites: ['Structured generation'],
        exercise: { id: 'ai420-ex2', type: 'multiple-choice', question: 'Which metric most directly tests whether the retriever found a known relevant passage?', options: ['Retrieval recall at k', 'Output length', 'Token price', 'Grammar accuracy'], correctAnswer: 'Retrieval recall at k', explanation: 'Recall at k measures whether relevant evidence appears among the top retrieved items.' },
        lab: { id: 'ai420-lab2', title: 'Citation-Based RAG Evaluation Harness', type: 'python', language: 'python', practiceMode: 'test-writing', level: 'level-4', estimatedMinutes: 150, instructions: 'Using supplied deterministic retrieval fixtures, calculate recall at k, citation coverage, unsupported-claim rate, and multilingual query slices.', objective: 'Evaluate retrieval and grounding separately.', starterCode: 'def recall_at_k(retrieved_ids, relevant_ids, k):\n    pass\n\ndef citation_coverage(claims):\n    pass' },
        checklist: ['Create a gold retrieval set', 'Measure recall at k', 'Verify cited spans', 'Report multilingual failures'], misconceptions: ['RAG guarantees factual answers', 'Fine-tuning replaces retrieval for changing factual knowledge'], glossary: [{ term: 'Reranking', definition: 'A second-stage process that reorders candidate results using a more precise relevance signal.' }],
        researchPapers: [
          { id: 'paper-rag-knowledge-intensive-nlp', title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks', authors: ['Patrick Lewis', 'Ethan Perez', 'Aleksandra Piktus', 'Fabio Petroni', 'Vladimir Karpukhin', 'Naman Goyal', 'Heinrich Küttler', 'Mike Lewis', 'Wen-tau Yih', 'Tim Rocktäschel', 'Sebastian Riedel', 'Douwe Kiela'], year: 2020, venue: 'Neural Information Processing Systems (NeurIPS) 2020', doiOrArxiv: 'arXiv:2005.11401', openAccessUrl: 'https://arxiv.org/pdf/2005.11401', canonicalUrl: 'https://arxiv.org/abs/2005.11401', paperType: 'seminal', difficulty: 'advanced', prerequisites: ['Transformer architecture', 'Dense embeddings'], summary: 'Introduces models that combine a pre-trained sequence-to-sequence generator with a learned dense-vector retriever over an external document index, updating retrieval end-to-end with generation.', whyItMatters: 'RAG is the origin of the retrieve-then-generate pattern that the course\'s citation-grounded pipeline design is built on; it also motivates why retrieval quality and generation quality must be evaluated separately.', sectionsToRead: 'Abstract, Section 2 (Methods), and Section 4 (Results).', readingQuestions: ['What is retrieved at inference time, and how does it condition generation?', 'How does the paper separate the contribution of retrieval from the contribution of generation in its evaluation?', 'What are the practical limits of updating a non-parametric knowledge index compared to retraining a model?'], relatedTopicIds: ['ai420-t2'], accessStatus: 'open-access', deliveryMode: 'in-app-pdf-candidate' },
        ],
        primaryText: {
          id: 'book-rag-survey-gao',
          title: 'Retrieval-Augmented Generation for Large Language Models: A Survey',
          authors: ['Yunfan Gao', 'Yun Xiong', 'Xinyu Gao', 'et al.'],
          url: 'https://arxiv.org/abs/2312.10997',
          pdfUrl: 'https://arxiv.org/pdf/2312.10997',
          canonicalUrl: 'https://arxiv.org/abs/2312.10997',
          recommendedChapter: 'RAG architectures, chunking, and retrieval/reranking techniques',
          accessStatus: 'open-access',
          publisherOrInstitution: 'arXiv',
        },
      },
    ],
    project: { title: 'Citation-Based Multilingual Knowledge Base', description: 'Design a controlled RAG knowledge base and evaluate retrieval, grounding, structured output, and safety.', constraints: ['Learner experiments run only in an external controlled project environment', 'ComputerSciFy must not call or host a generative model', 'Every factual claim requires a verifiable citation'], expectedDeliverables: ['System architecture', 'Retrieval and chunking pipeline', 'Structured extraction contract', 'Evaluation report'], evaluationRubric: [{ criterion: 'Evidence architecture', weight: '35%', description: 'Separates retrieval, reranking, generation, citation, and validation responsibilities.' }, { criterion: 'Evaluation', weight: '40%', description: 'Measures retrieval, grounding, multilingual behavior, and failures.' }, { criterion: 'Safety', weight: '25%', description: 'Defines permission, privacy, and unsupported-claim controls.' }] },
  },
  {
    id: 'ai-430',
    code: 'AI 430',
    title: 'AI Agent Architecture and Safe Workflow Orchestration',
    description: 'Planning, tools, state, memory, orchestration, human approval, sandboxing, recovery, evaluation, cost, latency, and security risks as an engineering subject.',
    estimatedHours: 52,
    difficulty: 'advanced',
    prerequisiteCourseIds: ['ai-420'],
    learningOutcomes: ['Model an agent workflow as explicit states and transitions', 'Design permission and human-approval boundaries', 'Evaluate task completion, recovery, cost, and latency without embedding an agent in the platform'],
    topics: [
      {
        id: 'ai430-t1', title: 'Planning, Tools, State and Memory', summary: 'Agent loops, plan execution, tool contracts, state, memory, reflection concepts, and multi-agent orchestration.', objective: 'Represent an agent-like workflow as an auditable state machine with bounded tools.', concepts: ['Planning', 'Tool use', 'State', 'Memory', 'Reflection', 'Multi-agent systems', 'Workflow orchestration'], prerequisites: ['Generative AI system architecture'],
        exercise: { id: 'ai430-ex1', type: 'free-response', question: 'Draw a state machine for a research workflow with explicit stop, retry, escalation, and approval states.', explanation: 'Explicit transitions make authority, retries, and failure recovery inspectable.' },
        lab: { id: 'ai430-lab1', title: 'Deterministic Workflow State-Machine Simulator', type: 'ts', language: 'typescript', practiceMode: 'guided-lesson', level: 'level-4', estimatedMinutes: 120, instructions: 'Implement a deterministic workflow simulator with allowlisted actions, state transitions, retry limits, and an approval gate. It must not call an AI model.', objective: 'Make orchestration and control flow explicit and testable.', starterCode: "type State = 'queued' | 'running' | 'approval' | 'done' | 'failed';\nfunction transition(state: State, event: string): State {\n  throw new Error('Implement explicit transitions');\n}" },
        checklist: ['Enumerate states and transitions', 'Bound retries', 'Separate memory from authority', 'Log every tool decision'], misconceptions: ['Memory grants authority', 'More agents necessarily improve reliability'], glossary: [{ term: 'Agent loop', definition: 'A repeated cycle of observing state, selecting a bounded action, executing it, and evaluating the result.' }],
        researchPapers: [
          { id: 'paper-react-reasoning-acting', title: 'ReAct: Synergizing Reasoning and Acting in Language Models', authors: ['Shunyu Yao', 'Jeffrey Zhao', 'Dian Yu', 'Nan Du', 'Izhak Shafran', 'Karthik Narasimhan', 'Yuan Cao'], year: 2022, venue: 'arXiv preprint (International Conference on Learning Representations (ICLR) 2023)', doiOrArxiv: 'arXiv:2210.03629', openAccessUrl: 'https://arxiv.org/pdf/2210.03629', canonicalUrl: 'https://arxiv.org/abs/2210.03629', paperType: 'applied', difficulty: 'advanced', prerequisites: ['Large language model prompting', 'Tool use'], summary: 'Proposes interleaving explicit reasoning traces with tool-use actions in a single prompted loop, so a language model narrates its plan between each action and observation.', whyItMatters: 'ReAct is the reference pattern for the observe-plan-act loop this topic asks learners to represent as an explicit state machine, and it motivates why raw model reasoning traces are not by themselves an audit log or an authority boundary.', sectionsToRead: 'Abstract, Section 3 (ReAct method), and the case studies in Section 4.', readingQuestions: ['What distinguishes a "Thought" step from an "Action" step in the ReAct loop?', 'How does interleaving reasoning with actions help recover from an unexpected tool result?', 'What does the paper NOT address about permissions, approval, or bounding tool authority?'], relatedTopicIds: ['ai430-t1'], accessStatus: 'open-access', deliveryMode: 'in-app-pdf-candidate' },
        ],
        primaryText: {
          id: 'book-llm-agents-survey-wang',
          title: 'A Survey on Large Language Model based Autonomous Agents',
          authors: ['Lei Wang', 'Chen Ma', 'Xueyang Feng', 'et al.'],
          url: 'https://arxiv.org/abs/2308.11432',
          pdfUrl: 'https://arxiv.org/pdf/2308.11432',
          canonicalUrl: 'https://arxiv.org/abs/2308.11432',
          recommendedChapter: 'Agent construction: planning, memory, and tool-use modules',
          accessStatus: 'open-access',
          publisherOrInstitution: 'arXiv',
        },
      },
      {
        id: 'ai430-t2', title: 'Human Approval, Sandboxing and Failure Recovery', summary: 'Permission boundaries, human approval, sandboxing, cost and latency budgets, recovery, security risks, and evaluation.', objective: 'Create a permission matrix and evaluation plan for a high-consequence workflow.', concepts: ['Human approval', 'Sandboxing', 'Permission boundaries', 'Failure recovery', 'Agent evaluation', 'Cost', 'Latency', 'Security risks'], prerequisites: ['Workflow state machines'],
        exercise: { id: 'ai430-ex2', type: 'multiple-choice', question: 'Which action most clearly requires a human approval gate?', options: ['Reading a supplied local fixture', 'Calculating a checksum', 'Sending an external message', 'Formatting a timestamp'], correctAnswer: 'Sending an external message', explanation: 'External communication affects other people and should require explicit authorization and review.' },
        lab: { id: 'ai430-lab2', title: 'Permission Matrix and Failure-Recovery Tabletop', type: 'algo-viz', practiceMode: 'independent', level: 'level-4', estimatedMinutes: 100, instructions: 'Classify actions by reversibility and consequence, assign approval gates, and simulate timeout, tool failure, and unsafe-request scenarios.', objective: 'Design least-privilege controls and graceful recovery.', starterCode: '' },
        checklist: ['Classify action consequences', 'Require approval for external side effects', 'Define rollback or compensation', 'Track cost and latency budgets'], misconceptions: ['A sandbox eliminates all risk', 'Human approval is useful without sufficient context'], glossary: [{ term: 'Permission boundary', definition: 'An enforced limit on the actions, data, and systems a workflow may access.' }],
        researchPapers: [
          { id: 'paper-concrete-problems-ai-safety', title: 'Concrete Problems in AI Safety', authors: ['Dario Amodei', 'Chris Olah', 'Jacob Steinhardt', 'Paul Christiano', 'John Schulman', 'Dan Mané'], year: 2016, venue: 'arXiv preprint', doiOrArxiv: 'arXiv:1606.06565', openAccessUrl: 'https://arxiv.org/pdf/1606.06565', canonicalUrl: 'https://arxiv.org/abs/1606.06565', paperType: 'seminal', difficulty: 'intermediate', prerequisites: ['Machine learning fundamentals'], summary: 'Frames AI safety as concrete, practical engineering problems — avoiding negative side effects, avoiding reward hacking, scalable oversight, safe exploration, and robustness to distributional shift — rather than abstract long-term risk.', whyItMatters: 'Its "scalable oversight" and "safe exploration" problems are the direct research lineage behind this topic\'s human-approval gates and sandboxing requirements: both are engineering answers to problems this paper names precisely.', sectionsToRead: 'Abstract, Section 1 (Introduction), and Section 4 (Safe exploration).', readingQuestions: ['How does "reward hacking" differ from a model simply performing poorly?', 'Why is human oversight described as a "scalable" problem rather than a one-time design choice?', 'Which of the paper\'s five problems maps most directly onto this topic\'s permission-matrix exercise?'], relatedTopicIds: ['ai430-t2'], accessStatus: 'open-access', deliveryMode: 'in-app-pdf-candidate' },
        ],
        primaryText: {
          id: 'book-owasp-agentic-ai-threats',
          title: 'Agentic AI — Threats and Mitigations',
          authors: ['OWASP Agentic Security Initiative'],
          url: 'https://genai.owasp.org/resource/agentic-ai-threats-and-mitigations/',
          pdfUrl: 'https://genai.owasp.org/download/45674/',
          canonicalUrl: 'https://genai.owasp.org/download/45674/',
          recommendedChapter: 'Human oversight, sandboxing, and permission-boundary mitigations',
          accessStatus: 'open-access',
          publisherOrInstitution: 'OWASP Foundation',
        },
      },
    ],
    project: { title: 'Safe Human-Approval Workflow Simulator', description: 'Build a deterministic simulator and design document for a bounded, permissioned workflow.', constraints: ['No AI agent or model call is implemented', 'All actions are deterministic fixtures', 'External side effects are represented but never executed'], expectedDeliverables: ['Agent architecture diagram', 'Permission matrix', 'Workflow simulator', 'Failure-recovery and evaluation report'], evaluationRubric: [{ criterion: 'Control architecture', weight: '40%', description: 'Authority, state, memory, and tools are separated and bounded.' }, { criterion: 'Failure handling', weight: '35%', description: 'Retries, escalation, rollback, cost, and latency are addressed.' }, { criterion: 'Safety', weight: '25%', description: 'Human approval and sandbox boundaries match action consequences.' }] },
  },
  {
    id: 'ai-440',
    code: 'AI 440',
    title: 'AI Evaluation and Reliability Engineering',
    description: 'Ground truth, automated and human evaluation, rubrics, pairwise comparison, hallucination and retrieval evaluation, safety, reproducibility, contamination, and cost-performance trade-offs.',
    estimatedHours: 52,
    difficulty: 'advanced',
    prerequisiteCourseIds: ['cs-305', 'stat-201'],
    learningOutcomes: ['Build a reproducible evaluation suite', 'Combine automated metrics with structured human evaluation', 'Detect contamination and communicate cost-performance trade-offs'],
    topics: [
      {
        id: 'ai440-t1', title: 'Ground Truth, Metrics and Evaluation Design', summary: 'Evaluation datasets, ground truth, automated metrics, hallucination, retrieval and safety evaluation, and task-completion criteria.', objective: 'Design an evaluation suite that links system requirements to datasets, metrics, slices, and thresholds.', concepts: ['Ground truth', 'Automated evaluation', 'Hallucination evaluation', 'Retrieval evaluation', 'Safety evaluation', 'Agent task completion'], prerequisites: ['Statistics', 'Machine learning evaluation'],
        exercise: { id: 'ai440-ex1', type: 'free-response', question: 'Define separate metrics for retrieval quality, citation support, answer usefulness, and safety.', explanation: 'Separating dimensions prevents one aggregate score from hiding distinct failures.' },
        lab: { id: 'ai440-lab1', title: 'Reproducible Evaluation Suite', type: 'python', language: 'python', practiceMode: 'test-writing', level: 'level-4', estimatedMinutes: 130, instructions: 'Implement deterministic evaluators for supplied predictions, evidence spans, safety labels, and task outcomes. Report confidence intervals where appropriate.', objective: 'Turn quality requirements into repeatable tests.', starterCode: 'def evaluate_case(case, prediction):\n    return {\n        "task_complete": False,\n        "citation_supported": False,\n        "safety_pass": False,\n    }' },
        checklist: ['Define ground truth provenance', 'Separate evaluation dimensions', 'Choose thresholds before testing', 'Report uncertainty and slices'], misconceptions: ['One benchmark represents every deployment context', 'Automated metrics eliminate the need for error review'], glossary: [{ term: 'Ground truth', definition: 'Reference labels or judgments with documented provenance used to evaluate system behavior.' }],
        researchPapers: [
          { id: 'paper-checklist-behavioral-testing', title: 'Beyond Accuracy: Behavioral Testing of NLP Models with CheckList', authors: ['Marco Tulio Ribeiro', 'Tongshuang Wu', 'Carlos Guestrin', 'Sameer Singh'], year: 2020, venue: 'Association for Computational Linguistics (ACL) 2020', doiOrArxiv: 'arXiv:2005.04118', openAccessUrl: 'https://arxiv.org/pdf/2005.04118', canonicalUrl: 'https://arxiv.org/abs/2005.04118', paperType: 'applied', difficulty: 'intermediate', prerequisites: ['Natural language processing evaluation basics'], summary: 'Introduces CheckList, a software-testing-inspired methodology that evaluates NLP models against a matrix of linguistic capabilities and test types instead of relying on a single held-out accuracy number.', whyItMatters: 'Directly demonstrates why this topic asks learners to separate evaluation dimensions: in the paper\'s user study, testers using CheckList "created twice as many tests, and found almost three times as many bugs" than those relying on aggregate accuracy alone.', sectionsToRead: 'Abstract, Section 3 (Capabilities and test types), and the user-study results in Section 5.', readingQuestions: ['Why can a model pass a held-out accuracy benchmark while failing a CheckList capability test?', 'What are the three test types CheckList introduces, and how do they differ?', 'How would you adapt CheckList\'s capability-matrix idea to this course\'s evaluation-suite lab?'], relatedTopicIds: ['ai440-t1'], accessStatus: 'open-access', deliveryMode: 'in-app-pdf-candidate' },
        ],
        primaryText: {
          id: 'book-llm-evaluation-survey-chang',
          title: 'A Survey on Evaluation of Large Language Models',
          authors: ['Yupeng Chang', 'Xu Wang', 'Jindong Wang', 'et al.'],
          url: 'https://arxiv.org/abs/2307.03109',
          pdfUrl: 'https://arxiv.org/pdf/2307.03109',
          canonicalUrl: 'https://arxiv.org/abs/2307.03109',
          recommendedChapter: 'Evaluation datasets, metrics, and task-completion criteria',
          accessStatus: 'open-access',
          publisherOrInstitution: 'arXiv / ACM TIST',
        },
      },
      {
        id: 'ai440-t2', title: 'Human Evaluation, Contamination and Trade-offs', summary: 'Rubrics, pairwise comparison, evaluator agreement, benchmark contamination, reproducibility, and cost-performance decisions.', objective: 'Run a structured human evaluation and communicate reliability and cost trade-offs.', concepts: ['Human evaluation', 'Rubrics', 'Pairwise comparison', 'Benchmark contamination', 'Reproducibility', 'Cost-performance trade-offs'], prerequisites: ['Evaluation design'],
        exercise: { id: 'ai440-ex2', type: 'multiple-choice', question: 'What most improves the interpretability of a human-evaluation result?', options: ['Hiding the rubric', 'Documenting rubric, sampling, evaluator agreement, and exclusions', 'Using one evaluator', 'Removing disagreements'], correctAnswer: 'Documenting rubric, sampling, evaluator agreement, and exclusions', explanation: 'Evaluation results need transparent procedures and uncertainty.' },
        lab: { id: 'ai440-lab2', title: 'Pairwise Human-Evaluation Form', type: 'html-css', language: 'html-css', practiceMode: 'independent', level: 'level-4', estimatedMinutes: 90, instructions: 'Create an accessible evaluation form with randomized A/B order, rubric anchors, abstention, rationale, and exportable judgments.', objective: 'Collect structured human judgments without hiding ambiguity.', starterCode: '<form>\n  <!-- Add rubric criteria, A/B choice, abstain, and rationale fields. -->\n</form>' },
        checklist: ['Write anchored rubric criteria', 'Randomize presentation order', 'Allow abstention', 'Measure agreement'], misconceptions: ['Human evaluation is automatically objective', 'Benchmark performance guarantees production reliability'], glossary: [{ term: 'Benchmark contamination', definition: 'Evaluation leakage caused when benchmark data influences training or system design.' }],
        researchPapers: [
          { id: 'paper-llm-as-judge-mt-bench', title: 'Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena', authors: ['Lianmin Zheng', 'Wei-Lin Chiang', 'Ying Sheng', 'et al.'], year: 2023, venue: 'Neural Information Processing Systems (NeurIPS) 2023', doiOrArxiv: 'arXiv:2306.05685', openAccessUrl: 'https://arxiv.org/pdf/2306.05685', canonicalUrl: 'https://arxiv.org/abs/2306.05685', paperType: 'applied', difficulty: 'advanced', prerequisites: ['Evaluation design', 'Statistics'], summary: 'Studies using a strong LLM as an automated judge of another model\'s outputs, identifies systematic biases (position, verbosity, self-enhancement) in that approach, and validates it against MT-Bench and crowdsourced Chatbot Arena human preferences.', whyItMatters: 'Directly informs this topic\'s pairwise-comparison and evaluator-agreement requirements — the paper both proposes pairwise LLM judging as a scalable alternative to human evaluation and documents exactly the kinds of bias this topic\'s checklist asks learners to guard against.', sectionsToRead: 'Abstract, Section 3 (Limitations of LLM-as-a-judge), and Section 4 (Agreement with human judgments).', readingQuestions: ['What are the three biases the paper identifies in LLM-as-a-judge evaluation?', 'How does the paper measure agreement between LLM judges and human judges?', 'Why might randomizing presentation order (as this topic\'s lab requires) mitigate one of the paper\'s named biases?'], relatedTopicIds: ['ai440-t2'], accessStatus: 'open-access', deliveryMode: 'in-app-pdf-candidate' },
        ],
        primaryText: {
          id: 'book-llm-evaluation-survey-chang-t2',
          title: 'A Survey on Evaluation of Large Language Models',
          authors: ['Yupeng Chang', 'Xu Wang', 'Jindong Wang', 'et al.'],
          url: 'https://arxiv.org/abs/2307.03109',
          pdfUrl: 'https://arxiv.org/pdf/2307.03109',
          canonicalUrl: 'https://arxiv.org/abs/2307.03109',
          recommendedChapter: 'Human evaluation protocols and benchmark contamination',
          accessStatus: 'open-access',
          publisherOrInstitution: 'arXiv / ACM TIST',
        },
      },
    ],
    project: { title: 'AI Reliability Evaluation Dashboard', description: 'Create an evaluation suite and interface comparing systems across quality, safety, latency, and cost.', constraints: ['Use fixed supplied outputs or learner-generated external experiment results', 'Document data provenance and exclusions', 'Do not rank systems with one opaque aggregate score'], expectedDeliverables: ['Evaluation dataset card', 'Automated evaluation suite', 'Human-evaluation form', 'Model comparison dashboard'], evaluationRubric: [{ criterion: 'Validity', weight: '40%', description: 'Metrics and rubrics align with intended system behavior.' }, { criterion: 'Reproducibility', weight: '30%', description: 'Data, versions, thresholds, and exclusions are documented.' }, { criterion: 'Decision quality', weight: '30%', description: 'Trade-offs and uncertainty are communicated without overclaiming.' }] },
  },
  {
    id: 'ai-450',
    code: 'AI 450',
    title: 'AI Safety, Security and Governance',
    description: 'Prompt injection, insecure tool use, data exfiltration, excessive agency, supply-chain risk, poisoning, adversarial examples, privacy, secrets, sandboxing, oversight, and secure architecture.',
    estimatedHours: 56,
    difficulty: 'advanced',
    prerequisiteCourseIds: ['ai-440', 'cs-403'],
    learningOutcomes: ['Threat-model AI systems and data flows', 'Design least-privilege tool and secret boundaries', 'Create capability, safety, incident-response, and governance controls'],
    topics: [
      {
        id: 'ai450-t1', title: 'AI Threat Modeling and Secure Tool Boundaries', summary: 'Prompt injection, indirect injection, exfiltration, excessive agency, insecure tools, secret handling, and secure architecture.', objective: 'Threat-model an AI-enabled architecture and design least-privilege tool boundaries.', concepts: ['Prompt injection', 'Indirect prompt injection', 'Data exfiltration', 'Excessive agency', 'Insecure tool use', 'Secret handling', 'Secure agent architecture'], prerequisites: ['Generative AI systems', 'Security foundations'],
        exercise: { id: 'ai450-ex1', type: 'free-response', question: 'Threat-model a document assistant that can retrieve internal files and draft external messages.', explanation: 'The model should identify untrusted document content, privilege boundaries, exfiltration paths, approval gates, and monitoring.' },
        lab: { id: 'ai450-lab1', title: 'AI Threat Model and Permission Matrix', type: 'algo-viz', practiceMode: 'guided-lesson', level: 'level-4', estimatedMinutes: 120, instructions: 'Map assets, trust boundaries, untrusted inputs, tools, secrets, abuse cases, mitigations, and approval gates for a fictional system.', objective: 'Apply defensive threat modeling to AI system components.', starterCode: '' },
        checklist: ['Mark untrusted content', 'Separate model suggestions from authorization', 'Keep secrets outside prompts and outputs', 'Require approval for consequential actions'], misconceptions: ['System prompts are a security boundary', 'Input filtering alone prevents prompt injection'], glossary: [{ term: 'Indirect prompt injection', definition: 'Malicious instructions embedded in external content that a model or workflow later processes.' }],
        researchPapers: [
          { id: 'paper-indirect-prompt-injection', title: 'Not What You\'ve Signed Up For: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection', authors: ['Kai Greshake', 'Sahar Abdelnabi', 'Shailesh Mishra', 'Christoph Endres', 'Thorsten Holz', 'Mario Fritz'], year: 2023, venue: 'arXiv preprint', doiOrArxiv: 'arXiv:2302.12173', openAccessUrl: 'https://arxiv.org/pdf/2302.12173', canonicalUrl: 'https://arxiv.org/abs/2302.12173', paperType: 'applied', difficulty: 'advanced', prerequisites: ['LLM-integrated applications', 'Web security fundamentals'], summary: 'Defines indirect prompt injection, where an attacker plants instructions in content a model retrieves and processes (a webpage, document, or API response) rather than in the user\'s own prompt, and demonstrates it against real LLM-integrated applications.', whyItMatters: 'This is the primary source for the exact threat this topic asks learners to threat-model: untrusted retrieved content overriding a system\'s intended instructions. It directly supports the topic\'s glossary definition and its checklist item to mark untrusted content.', sectionsToRead: 'Abstract, Section 3 (Threat model), and the case studies in Section 5.', readingQuestions: ['How does indirect prompt injection differ from a user directly typing a malicious prompt?', 'Which real applications did the authors demonstrate the attack against, and what made them vulnerable?', 'What mitigations does the paper discuss, and which ones does this course\'s checklist already reflect?'], relatedTopicIds: ['ai450-t1'], accessStatus: 'open-access', deliveryMode: 'in-app-pdf-candidate' },
        ],
        primaryText: {
          id: 'book-nist-adversarial-ml-taxonomy',
          title: 'Adversarial Machine Learning: A Taxonomy and Terminology of Attacks and Mitigations',
          authors: ['Apostol Vassilev', 'Alina Oprea', 'Alie Fordyce', 'Hyrum Anderson'],
          url: 'https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-2e2025.pdf',
          pdfUrl: 'https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-2e2025.pdf',
          canonicalUrl: 'https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-2e2025.pdf',
          recommendedChapter: 'Attacks on generative AI: prompt injection and secure tool boundaries',
          accessStatus: 'open-access',
          publisherOrInstitution: 'NIST',
        },
      },
      {
        id: 'ai450-t2', title: 'Supply Chain, Privacy, Oversight and Incident Response', summary: 'Model supply chains, poisoning concepts, adversarial examples, privacy leakage, sandboxing, capability evaluation, governance, human oversight, and response.', objective: 'Design an AI assurance and incident-response plan across development, release, and operation.', concepts: ['Model supply-chain risk', 'Training-data poisoning', 'Adversarial examples', 'Privacy leakage', 'Sandboxing', 'Capability evaluation', 'Human oversight', 'Governance'], prerequisites: ['AI threat modeling', 'AI evaluation'],
        exercise: { id: 'ai450-ex2', type: 'multiple-choice', question: 'Which control best supports a safe rollback after a newly deployed model fails evaluation?', options: ['Unversioned model files', 'Versioned artifacts, deployment gates, monitoring, and a tested rollback procedure', 'A longer prompt', 'Disabling logs'], correctAnswer: 'Versioned artifacts, deployment gates, monitoring, and a tested rollback procedure', explanation: 'Safe rollback requires traceable artifacts, gates, telemetry, and rehearsed recovery.' },
        lab: { id: 'ai450-lab2', title: 'AI Incident-Response Tabletop', type: 'algo-viz', practiceMode: 'independent', level: 'level-4', estimatedMinutes: 100, instructions: 'Respond to a fictional privacy-leakage and unsafe-tool-use incident. Define containment, evidence preservation, notification, recovery, and follow-up evaluation.', objective: 'Connect governance controls to operational response.', starterCode: '' },
        checklist: ['Inventory model and dataset provenance', 'Define capability evaluation gates', 'Preserve incident evidence', 'Test rollback and recovery'], misconceptions: ['Governance is only documentation', 'A trusted model eliminates supply-chain and privacy risk'], glossary: [{ term: 'Capability evaluation', definition: 'Testing focused on what a system can do, including harmful or high-consequence behaviors.' }],
        researchPapers: [
          { id: 'paper-extracting-training-data-llms', title: 'Extracting Training Data from Large Language Models', authors: ['Nicholas Carlini', 'Florian Tramer', 'Eric Wallace', 'et al.'], year: 2020, venue: 'USENIX Security Symposium 2021 (arXiv preprint)', doiOrArxiv: 'arXiv:2012.07805', openAccessUrl: 'https://arxiv.org/pdf/2012.07805', canonicalUrl: 'https://arxiv.org/abs/2012.07805', paperType: 'applied', difficulty: 'advanced', prerequisites: ['Large language models', 'Privacy fundamentals'], summary: 'Demonstrates that an attacker can query a language model to recover verbatim training examples — including personally identifiable information and other sensitive text that appeared only once in training — and shows that larger models are more vulnerable.', whyItMatters: 'This is the primary source for the "privacy leakage" risk this topic asks learners to assurance-plan against, and its finding that model scale increases (not decreases) memorization risk directly motivates treating privacy leakage as a supply-chain and governance concern, not just a training-time one.', sectionsToRead: 'Abstract, Section 3 (Extraction attacks), and Section 6 (Larger models memorize more).', readingQuestions: ['What made some training examples extractable even though they appeared only once in the dataset?', 'Why does the paper find that larger models are more vulnerable to this attack?', 'What mitigations does the paper discuss, and how would you connect them to this course\'s incident-response checklist?'], relatedTopicIds: ['ai450-t2'], accessStatus: 'open-access', deliveryMode: 'in-app-pdf-candidate' },
        ],
      },
    ],
    project: { title: 'AI Security and Governance Assurance Pack', description: 'Produce a threat model, secure tool-gateway design, incident-response checklist, and safety evaluation report.', constraints: ['Defensive design and tabletop analysis only', 'No exploitation of real systems', 'Use fictional or intentionally isolated scenarios'], expectedDeliverables: ['AI threat model', 'Agent permission matrix', 'Secure tool gateway design', 'Incident-response checklist', 'Safety evaluation report'], evaluationRubric: [{ criterion: 'Threat coverage', weight: '35%', description: 'Assets, trust boundaries, abuse cases, and supply-chain risks are complete.' }, { criterion: 'Control quality', weight: '40%', description: 'Controls are enforceable, least-privilege, monitored, and testable.' }, { criterion: 'Response readiness', weight: '25%', description: 'Incident and rollback plans are specific and evidence-preserving.' }] },
  },
  {
    id: 'ai-460',
    code: 'AI 460',
    title: 'AI Security Capability Evaluation and Responsible ExploitGym Research',
    description: 'Research-focused study of AI-agent security, capability-risk evaluation, ExploitGym, related benchmarks, containment, least privilege, and responsible interpretation.',
    estimatedHours: 48,
    difficulty: 'research',
    prerequisiteCourseIds: ['ai-440', 'ai-450', 'cyber-100'],
    learningOutcomes: [
      'Distinguish vulnerability discovery, reproduction, exploitation evaluation, and remediation',
      'Compare ExploitGym, CyberGym, CyberGym-E2E, and AgentCyberRange without operationalizing them',
      'Design a least-privilege, human-approved sandbox and capability-risk evaluation plan',
    ],
    topics: [
      {
        id: 'ai460-t1',
        title: 'AI-Agent Security Theory, Authority and Containment',
        summary: 'Long-horizon behavior, tool authority, benchmark validity, containment, least privilege, human approval, monitoring, and dual-use risk.',
        objective: 'Design an auditable security boundary for a hypothetical capability evaluation without implementing an autonomous agent.',
        concepts: ['AI-agent security', 'Long-horizon tasks', 'Capability evaluation', 'Sandboxing', 'Containment', 'Least privilege', 'Human approval', 'Dual-use risk'],
        prerequisites: ['AI evaluation', 'AI threat modeling', 'Defensive security foundations'],
        exercise: { id: 'ai460-ex1', type: 'free-response', question: 'Create a permission matrix that separates observation, proposal, approval, and execution for a hypothetical benchmark evaluation.', explanation: 'A safe design grants no implicit authority: tools, targets, data flows, budgets, logging, stop conditions, and approvals are explicit.' },
        lab: {
          id: 'ai460-lab1', title: 'Secure Sandbox Architecture Tabletop', type: 'algo-viz', practiceMode: 'guided-lesson', level: 'level-4', estimatedMinutes: 110,
          instructions: 'Using a supplied fictional architecture, classify trust boundaries and choose controls for network denial, immutable fixtures, ephemeral state, monitoring, approval, and emergency stop. Do not execute an agent, shell command, payload, or target.',
          objective: 'Evaluate containment as a layered system rather than a single sandbox switch.', starterCode: '',
          safety: {
            legalUseNotice: 'Use only supplied fictional diagrams and synthetic fixtures. No third-party or public system is in scope.', ethicalObjective: 'Learn how evaluators reduce risk while measuring dual-use capability.', defensivePurpose: 'Design containment, oversight, and evidence controls for responsible AI-security research.', requiredEnvironment: 'ComputerSciFy deterministic tabletop only; no model, agent, network, shell, or target runtime.', classification: 'dual-use', responsibleDisclosureGuidance: 'If analysis suggests a real vulnerability, stop, preserve minimal evidence, and use the affected project\'s coordinated disclosure process.',
            allowedTargets: ['Supplied fictional sandbox diagram', 'Synthetic permission and event-log fixtures'], allowedTools: ['Course worksheet', 'Static decision table'], isolationRequirements: ['Network access denied', 'No credentials or secrets', 'No executable target or payload', 'Human review of the completed design'], dataSensitivity: 'synthetic-only', humanSupervision: 'required', resetProcedure: 'Discard the worksheet state and reload the original synthetic fixture.',
          },
        },
        checklist: ['Separate model output from authority', 'Deny network and secret access by default', 'Define monitoring and emergency stop conditions', 'Require approval for all dual-use execution'],
        misconceptions: ['A container alone guarantees containment', 'A benchmark score grants permission to deploy a system'],
        glossary: [{ term: 'Capability-risk evaluation', definition: 'A structured measurement of what a system can accomplish, interpreted alongside misuse, containment, and deployment risks.' }],
        researchPapers: [
          { id: 'paper-ai-sandboxes-threat-model', title: 'AI Sandboxes: A Threat Model, Taxonomy, and Measurement Framework', authors: ['Inderjeet Singh', 'Haitham Mahmoud', 'Andrés Murillo'], year: 2026, venue: 'arXiv preprint', doiOrArxiv: 'arXiv:2606.18532', openAccessUrl: 'https://arxiv.org/pdf/2606.18532', canonicalUrl: 'https://arxiv.org/abs/2606.18532', paperType: 'applied', difficulty: 'research', prerequisites: ['AI evaluation', 'AI threat modeling'], summary: 'Formalizes what a "sandbox" boundary means for AI system evaluation, proposes a taxonomy of sandbox archetypes, and defines a measurement framework covering fidelity, controllability, observability, containment, reproducibility, and governance.', whyItMatters: 'Gives precise, citable vocabulary for exactly what this topic asks learners to design: the paper\'s "containment" and "observability" dimensions are the same layered-controls idea behind the topic\'s emergency-stop and monitoring checklist items, applied at a theoretical level this course keeps deliberately non-operational.', sectionsToRead: 'Abstract, the sandbox taxonomy section, and the containment dimension of the measurement framework.', readingQuestions: ['What does the paper mean by a sandbox\'s "fidelity" versus its "containment"?', 'Why does the paper treat the assurance apparatus itself (not just the AI system) as part of the threat model?', 'Which of the paper\'s measurement dimensions would a benchmark-validity claim in ai460-t2 need evidence for?'], relatedTopicIds: ['ai460-t1'], accessStatus: 'open-access', deliveryMode: 'in-app-pdf-candidate' },
        ],
        primaryText: {
          id: 'book-international-ai-safety-report-2026-t1',
          title: 'International AI Safety Report 2026',
          authors: ['Yoshua Bengio (Chair)', 'Stephen Clare', 'Carina Prunkl', 'et al.'],
          url: 'https://arxiv.org/abs/2602.21012',
          pdfUrl: 'https://arxiv.org/pdf/2602.21012',
          canonicalUrl: 'https://arxiv.org/abs/2602.21012',
          recommendedChapter: 'Capability evaluation methodology and containment',
          accessStatus: 'open-access',
          publisherOrInstitution: 'International AI Safety Report (mandated by the Bletchley AI Safety Summit)',
        },
        cyberSafety: { legalUseNotice: 'This lesson is for lawful research analysis and defensive design only.', ethicalObjective: 'Interpret AI cybersecurity capabilities without enabling harmful activity.', defensivePurpose: 'Improve evaluation safety, containment, and responsible decision-making.', requiredEnvironment: 'Reading, supplied metadata, and deterministic tabletop exercises only.', classification: 'dual-use', responsibleDisclosureGuidance: 'Do not validate suspected issues on real systems; follow coordinated disclosure with an authorized owner.' },
      },
      {
        id: 'ai460-t2',
        title: 'ExploitGym, CyberGym and Cyber-Range Benchmark Analysis',
        summary: 'Primary-source comparison of vulnerability discovery, reproduction, exploitation evaluation, patching, multi-host ranges, methodology, mitigations, reproducibility, and defensive implications.',
        objective: 'Compare benchmark claims and limitations while keeping the learning activity non-operational.',
        concepts: ['ExploitGym', 'CyberGym', 'CyberGym-E2E', 'AgentCyberRange', 'Vulnerability discovery', 'Vulnerability reproduction', 'Exploitation', 'Benchmark design', 'Exploit mitigations', 'Responsible research'],
        prerequisites: ['Capability evaluation', 'Sandbox architecture'],
        exercise: { id: 'ai460-ex2', type: 'multiple-choice', question: 'Which statement best distinguishes ExploitGym from vulnerability-discovery evaluation?', options: ['It begins with a supplied vulnerability-triggering input and evaluates extension toward security impact', 'It searches arbitrary public systems', 'It replaces authorization review', 'It proves production safety'], correctAnswer: 'It begins with a supplied vulnerability-triggering input and evaluates extension toward security impact', explanation: 'The paper frames exploitation as extending a known trigger; that is distinct from finding a vulnerability and does not authorize real-target activity.' },
        lab: {
          id: 'ai460-lab2', title: 'Deterministic Capability-Risk Dashboard', type: 'algo-viz', practiceMode: 'independent', level: 'level-4', estimatedMinutes: 120,
          instructions: 'Compare supplied benchmark metadata across lifecycle stage, unit of evaluation, environment, defensive value, limitations, reproducibility, and required controls. Do not download datasets, run benchmark code, or generate exploit content.',
          objective: 'Interpret capability evidence alongside methodology and safety boundaries.', starterCode: '',
          safety: {
            legalUseNotice: 'Analyze only published papers and supplied aggregate metadata.', ethicalObjective: 'Practice careful, reproducible interpretation of dual-use research.', defensivePurpose: 'Translate benchmark evidence into mitigations, evaluation controls, and deployment decisions.', requiredEnvironment: 'Static local comparison worksheet with no benchmark runtime or external target.', classification: 'dual-use', responsibleDisclosureGuidance: 'Report newly suspected vulnerabilities through authorized coordinated disclosure; do not reproduce them here.',
            allowedTargets: ['Published benchmark metadata', 'Supplied aggregate comparison fixtures'], allowedTools: ['Course comparison matrix', 'Static risk rubric'], isolationRequirements: ['No benchmark dataset download', 'No target execution', 'No payload or proof-of-concept generation', 'No external network action'], dataSensitivity: 'public-training-data', humanSupervision: 'required', resetProcedure: 'Clear learner selections and restore the original read-only comparison fixture.',
          },
        },
        checklist: ['Separate discovery, reproduction, exploitation, and patching', 'Record tools, budgets, environments, and scoring assumptions', 'State validity and generalization limits', 'Connect findings to mitigations and responsible release gates'],
        misconceptions: ['Benchmarks with similar names measure identical capabilities', 'A successful exploit evaluation implies unrestricted real-world capability'],
        glossary: [{ term: 'Vulnerability reproduction', definition: 'Recreating documented vulnerable behavior in an authorized controlled environment; it is distinct from discovery and from extending impact.' }],
        researchPapers: [
          { id: 'paper-exploitgym', title: 'ExploitGym: Can AI Agents Turn Security Vulnerabilities into Real Attacks?', authors: ['Zhun Wang', 'Nico Schiller', 'Hongwei Li', 'Srijiith Sesha Narayana', 'Milad Nasr', 'Nicholas Carlini', 'Xiangyu Qi', 'Eric Wallace', 'Elie Bursztein', 'Luca Invernizzi', 'Kurt Thomas', 'Yan Shoshitaishvili', 'Wenbo Guo', 'Jingxuan He', 'Thorsten Holz', 'Dawn Song'], year: 2026, venue: 'arXiv preprint', doiOrArxiv: 'arXiv:2605.11086', openAccessUrl: 'https://arxiv.org/pdf/2605.11086', canonicalUrl: 'https://arxiv.org/abs/2605.11086', paperType: 'applied', difficulty: 'research', prerequisites: ['AI evaluation', 'Systems security'], summary: 'Introduces a benchmark for evaluating whether agents can extend known vulnerability-triggering inputs toward concrete security impact in controlled configurations.', whyItMatters: 'Clarifies exploitation as a distinct, dual-use capability and motivates stronger evaluation containment.', sectionsToRead: 'Abstract, benchmark design, evaluation setup, limitations, and ethics discussion.', readingQuestions: ['What capability is isolated from vulnerability discovery?', 'Which protections and environment choices affect interpretation?', 'What containment controls should surround this class of evaluation?'], relatedTopicIds: ['ai460-t1', 'ai460-t2'], accessStatus: 'open-access', deliveryMode: 'in-app-pdf-candidate' },
          { id: 'paper-cybergym', title: 'CyberGym: Evaluating AI Agents\' Cybersecurity Capabilities with Real-World Vulnerabilities at Scale', authors: ['Tianneng Shi', 'Kexin Pei', 'Ali Asghar Heidari', 'Zhun Wang', 'Kaixin Ma', 'Ke Xu', 'Wenbo Guo', 'Dawn Song'], year: 2025, venue: 'arXiv preprint; published at ICLR 2026', doiOrArxiv: 'arXiv:2506.02548', openAccessUrl: 'https://arxiv.org/pdf/2506.02548', canonicalUrl: 'https://arxiv.org/abs/2506.02548', paperType: 'applied', difficulty: 'research', prerequisites: ['AI evaluation', 'Software security'], summary: 'Presents a large-scale framework for evaluating agents on real-world vulnerability-analysis and reproduction tasks.', whyItMatters: 'Provides a comparison point for understanding the transition from reproduction to exploitation evaluation.', sectionsToRead: 'Abstract, task construction, evaluation protocol, results, and limitations.', readingQuestions: ['What is the unit of evaluation?', 'How does reproduction differ from discovery and exploitation?', 'Which factors limit cross-benchmark comparison?'], relatedTopicIds: ['ai460-t2'], accessStatus: 'open-access', deliveryMode: 'in-app-pdf-candidate' },
          { id: 'paper-cybergym-e2e', title: 'CyberGym-E2E: Scalable Real-World Benchmark for AI Agents\' End-to-End Cybersecurity Capabilities', authors: ['Tianneng Shi', 'Robin Rheem', 'Dongwei Jiang', 'Mona Wang', 'Francisco De La Riega', 'Zhun Wang', 'Jingzhi Jiang', 'Alexander Cheung', 'Sean Tai', 'Jonah Cha', 'Jianhong Tu', 'Gabriel Han', 'Chenguang Wang', 'Jingxuan He', 'Wenbo Guo', 'Dawn Song'], year: 2026, venue: 'ICML 2026', doiOrArxiv: 'arXiv:2606.04460', openAccessUrl: 'https://arxiv.org/pdf/2606.04460', canonicalUrl: 'https://arxiv.org/abs/2606.04460', paperType: 'applied', difficulty: 'research', prerequisites: ['AI evaluation', 'Secure software development'], summary: 'Evaluates an end-to-end lifecycle spanning vulnerability discovery, proof-of-concept generation, and patch generation.', whyItMatters: 'Adds remediation to capability evaluation and raises questions about lifecycle scoring and validation.', sectionsToRead: 'Abstract, pipeline, benchmark tasks, evaluation, limitations, and responsible-use discussion.', readingQuestions: ['How are lifecycle stages scored separately?', 'What validates a generated patch?', 'What risks arise from automated benchmark construction?'], relatedTopicIds: ['ai460-t2'], accessStatus: 'open-access', deliveryMode: 'in-app-pdf-candidate' },
          { id: 'paper-agentcyberrange', title: 'AgentCyberRange: Benchmarking Frontier AI Systems in Realistic Cyber Ranges', authors: ['Fengyu Liu', 'Jiarun Dai', 'Yihe Fan', 'Wuyuao Mai', 'Ziao Li', 'Bofei Chen', 'Jie Zhang', 'Zheng Lou', 'Bocheng Xiang', 'Qiyi Zhang', 'Xudong Pan', 'Geng Hong', 'Yuan Zhang', 'Min Yang'], year: 2026, venue: 'arXiv preprint', doiOrArxiv: 'arXiv:2606.14295', openAccessUrl: 'https://arxiv.org/pdf/2606.14295', canonicalUrl: 'https://arxiv.org/abs/2606.14295', paperType: 'applied', difficulty: 'research', prerequisites: ['AI-agent security', 'Network defense'], summary: 'Introduces multi-host cyber ranges for measuring long-horizon autonomous cyber capability under controlled evaluation conditions.', whyItMatters: 'Highlights the additional containment and validity concerns created by longer-horizon, multi-host evaluation.', sectionsToRead: 'Abstract, range design, orchestration, evaluation methodology, limitations, and ethics.', readingQuestions: ['How does a multi-host range change the unit of evaluation?', 'Which controls prevent scope escape?', 'How should hints, budgets, and tool access be reported?'], relatedTopicIds: ['ai460-t1', 'ai460-t2'], accessStatus: 'open-access', deliveryMode: 'in-app-pdf-candidate' },
        ],
        primaryText: {
          id: 'book-international-ai-safety-report-2026-t2',
          title: 'International AI Safety Report 2026',
          authors: ['Yoshua Bengio (Chair)', 'Stephen Clare', 'Carina Prunkl', 'et al.'],
          url: 'https://arxiv.org/abs/2602.21012',
          pdfUrl: 'https://arxiv.org/pdf/2602.21012',
          canonicalUrl: 'https://arxiv.org/abs/2602.21012',
          recommendedChapter: 'Cyber capability evaluation and benchmark validity',
          accessStatus: 'open-access',
          publisherOrInstitution: 'International AI Safety Report (mandated by the Bletchley AI Safety Summit)',
        },
        cyberSafety: { legalUseNotice: 'Research papers are provided for lawful analysis, not operational exploitation.', ethicalObjective: 'Compare capability evidence and its risks responsibly.', defensivePurpose: 'Improve benchmark methodology, mitigations, sandbox design, and defensive readiness.', requiredEnvironment: 'Read-only paper study and deterministic supplied metadata only.', classification: 'dual-use', responsibleDisclosureGuidance: 'Never test a paper-derived hypothesis on an unauthorized target; coordinate privately with the responsible owner.' },
      },
    ],
    project: {
      title: 'Responsible AI Cybersecurity Evaluation Assurance Pack',
      description: 'Design a non-operational evaluation plan that compares benchmark methodologies and documents risk, permissions, containment, reproducibility, and defensive implications.',
      constraints: ['No autonomous agent, model call, benchmark runner, target, payload, or network access', 'Use primary papers and supplied metadata only', 'Prohibit real-target exploitation, scanning, persistence, credential access, evasion, and destructive actions'],
      expectedDeliverables: ['Benchmark methodology comparison', 'Capability-risk dashboard', 'Secure sandbox architecture', 'Agent permission matrix', 'Responsible evaluation checklist', 'Limitations and reproducibility analysis'],
      evaluationRubric: [{ criterion: 'Research accuracy', weight: '35%', description: 'Distinguishes benchmark questions, methods, evidence, and limitations.' }, { criterion: 'Safety architecture', weight: '40%', description: 'Uses enforceable least privilege, isolation, monitoring, approval, and stop conditions.' }, { criterion: 'Defensive implications', weight: '25%', description: 'Connects capability evidence to mitigations and responsible decisions without operational enablement.' }],
    },
  },
];

export const AI_ENGINEERING_COURSES: Course[] = definitions.map(makeCourse);
