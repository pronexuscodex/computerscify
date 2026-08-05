import type {
  AiSecurityBenchmark,
  AiSecurityResearchBoundary,
} from '../types/aiSecurityResearch';

export const AI_SECURITY_RESEARCH_BOUNDARY: AiSecurityResearchBoundary = {
  allowedActivities: [
    'Explain and critique primary research papers',
    'Compare benchmark scope, methodology, evidence, and limitations',
    'Design a least-privilege sandbox and human-approval matrix',
    'Analyze supplied aggregate results in a deterministic capability-risk dashboard',
    'Write defensive implications, reproducibility, and responsible-evaluation reports',
  ],
  prohibitedActivities: [
    'Exploit a real, public, third-party, or otherwise unauthorized target',
    'Deploy malware, steal credentials, establish persistence, evade controls, or cause damage',
    'Scan public systems or provide instructions for bypassing their protections',
    'Execute benchmark agents, payloads, proof-of-concept exploits, or arbitrary target code',
  ],
  requiredControls: [
    'Synthetic fixtures and paper metadata only inside ComputerSciFy',
    'No network, shell, secret, credential, or external communication permission',
    'Human approval is required for any dual-use research activity outside this reading module',
    'Stop on scope ambiguity and follow coordinated responsible-disclosure procedures',
  ],
};

export const AI_SECURITY_BENCHMARKS: AiSecurityBenchmark[] = [
  {
    id: 'cybergym',
    title: 'CyberGym',
    primarySourceUrl: 'https://arxiv.org/abs/2506.02548',
    publicationYear: 2025,
    scope: 'Evaluation of AI agents on real-world vulnerability-analysis and reproduction tasks.',
    stages: ['vulnerability-reproduction'],
    unitOfEvaluation: 'A vulnerability task grounded in a real-world codebase and controlled evaluation environment.',
    environmentModel: 'Reproducible benchmark infrastructure; not executed by this application.',
    defensiveValue: 'Measures whether systems can reproduce vulnerability behavior that may support triage and remediation research.',
    limitations: ['Benchmark performance does not establish authorization or production safety.', 'Results depend on task construction, environment fidelity, prompts, tools, and budgets.'],
    classification: 'dual-use',
  },
  {
    id: 'exploitgym',
    title: 'ExploitGym',
    primarySourceUrl: 'https://arxiv.org/abs/2605.11086',
    publicationYear: 2026,
    scope: 'Evaluation of whether an agent can extend a supplied vulnerability-triggering input toward concrete security impact.',
    stages: ['exploitation-evaluation'],
    unitOfEvaluation: 'A known vulnerability trigger, protections, and a containerized target configuration.',
    environmentModel: 'Containerized benchmark configurations; studied here only through paper metadata and aggregate evidence.',
    defensiveValue: 'Supports measurement of exploit capability and analysis of how mitigations affect observed performance.',
    limitations: ['Exploit success is not the same as vulnerability discovery.', 'A benchmark cannot by itself demonstrate containment, safe deployment, or real-world generalization.'],
    classification: 'dual-use',
  },
  {
    id: 'cybergym-e2e',
    title: 'CyberGym-E2E',
    primarySourceUrl: 'https://arxiv.org/abs/2606.04460',
    publicationYear: 2026,
    scope: 'End-to-end evaluation across vulnerability discovery, proof-of-concept generation, and patch generation.',
    stages: ['vulnerability-discovery', 'vulnerability-reproduction', 'patch-generation'],
    unitOfEvaluation: 'A real-world open-source vulnerability transformed into an evaluation environment.',
    environmentModel: 'Automated benchmark construction pipeline; not included or invoked in ComputerSciFy.',
    defensiveValue: 'Connects capability measurement with remediation through patch-generation evaluation.',
    limitations: ['Lifecycle coverage does not guarantee patch correctness or operational safety.', 'Automated construction can introduce validity and reproducibility questions that require auditing.'],
    classification: 'dual-use',
  },
  {
    id: 'agentcyberrange',
    title: 'AgentCyberRange',
    primarySourceUrl: 'https://arxiv.org/abs/2606.14295',
    publicationYear: 2026,
    scope: 'Evaluation of autonomous cyber capability in realistic, multi-host cyber ranges.',
    stages: ['exploitation-evaluation', 'multi-host-range'],
    unitOfEvaluation: 'A bounded web or post-exploitation task inside a purpose-built cyber range.',
    environmentModel: 'Isolated multi-host ranges and orchestration tooling; discussed but never operated by this course.',
    defensiveValue: 'Helps defenders reason about long-horizon behavior, range fidelity, monitoring, and containment requirements.',
    limitations: ['Range behavior must not be generalized to unauthorized public targets.', 'Tool access, hints, budgets, range design, and scoring materially affect interpretation.'],
    classification: 'dual-use',
  },
];

export const getAiSecurityBenchmark = (id: AiSecurityBenchmark['id']) =>
  AI_SECURITY_BENCHMARKS.find((benchmark) => benchmark.id === id);
