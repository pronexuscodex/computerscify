import {
  AssessmentDefinition,
  BookResource,
  CapstoneProjectMilestone,
  Course,
  InteractiveLabDefinition,
  MasteryPack,
  PracticeExercise,
  ResearchPaper,
  Topic,
} from '../types/curriculum';
import {
  CyberLabSafetyMetadata,
  CyberLessonSafetyMetadata,
  CyberSafetyClassification,
} from '../types/cyberSafety';
import { VERIFIED_VIDEOS } from '../data/verifiedVideoRegistry';

interface CyberTopicDefinition {
  id: string;
  title: string;
  summary: string;
  objective: string;
  concepts: string[];
  classification: CyberSafetyClassification;
  environment: string;
  allowedTargets: string[];
  allowedTools: string[];
  exercise: PracticeExercise;
  lab: Omit<InteractiveLabDefinition, 'safety'>;
  checklist: string[];
  researchPapers?: ResearchPaper[];
  primaryText?: BookResource;
}

interface CyberCourseDefinition {
  id: string;
  code: string;
  title: string;
  description: string;
  estimatedHours: number;
  prerequisiteCourseIds: string[];
  learningOutcomes: string[];
  topics: CyberTopicDefinition[];
  project: Omit<CapstoneProjectMilestone, 'id'>;
}

const LEGAL_USE_NOTICE =
  'Practice only on systems you own or have explicit written authorization to test. Public targets, third-party accounts, and real credentials are prohibited.';
const DISCLOSURE_GUIDANCE =
  'If you encounter a real vulnerability, stop testing, preserve minimal evidence, notify the owner through an authorized channel, and follow coordinated-disclosure policy.';

const makeLessonSafety = (topic: CyberTopicDefinition): CyberLessonSafetyMetadata => ({
  legalUseNotice: LEGAL_USE_NOTICE,
  ethicalObjective: `Learn ${topic.title.toLowerCase()} to reduce risk and protect users, data, and services.`,
  defensivePurpose: topic.objective,
  requiredEnvironment: topic.environment,
  classification: topic.classification,
  responsibleDisclosureGuidance: DISCLOSURE_GUIDANCE,
});

const makeLabSafety = (topic: CyberTopicDefinition): CyberLabSafetyMetadata => ({
  ...makeLessonSafety(topic),
  allowedTargets: topic.allowedTargets,
  allowedTools: topic.allowedTools,
  isolationRequirements: [
    topic.environment,
    'No route to arbitrary public targets',
    'Use only supplied synthetic data and resettable fixtures',
  ],
  dataSensitivity: 'synthetic-only',
  humanSupervision: topic.classification === 'dual-use' ? 'required' : 'recommended',
  resetProcedure: 'Discard the local workspace or reset the supplied fixture to its documented initial state before another attempt.',
});

const makeMasteryPack = (
  course: CyberCourseDefinition,
  topic: CyberTopicDefinition,
  index: number
): MasteryPack => ({
  learningObjective: topic.objective,
  prerequisites: course.prerequisiteCourseIds,
  coreConcepts: topic.concepts,
  recommendedChapter: `Defensive unit ${index + 1}: ${topic.title}`,
  practicalExercises: [topic.exercise],
  interactiveLab: { ...topic.lab, safety: makeLabSafety(topic) },
  primaryLecture: (VERIFIED_VIDEOS as Record<string, MasteryPack['primaryLecture']>)[topic.id],
  primaryText: topic.primaryText,
  readingQuestions: [
    'What authorization and environment boundaries apply before this activity begins?',
    'Which defensive evidence would justify the recommended control or remediation?',
  ],
  masteryChecklist: topic.checklist,
  capstoneMilestone: course.project.title,
  estimatedStudyMinutes: Math.round((course.estimatedHours * 60) / course.topics.length),
  difficulty: topic.classification === 'dual-use' ? 'advanced' : 'intermediate',
  glossary: topic.concepts.slice(0, 2).map((concept) => ({
    term: concept,
    definition: `A core defensive-security concept covered in ${topic.title}.`,
  })),
  commonMisconceptions: [
    'Educational intent alone authorizes testing against any target.',
    'A security finding is complete before impact, evidence, and remediation are documented.',
  ],
  connectionsToLaterModules: ['Secure engineering', 'Detection and response', 'Risk governance'],
  citation: { text: 'ComputerSciFy defensive cybersecurity curriculum — internally authored lab and assessment material.' },
  accessStatus: 'needsVerification',
});

const makeAssessment = (
  course: CyberCourseDefinition,
  type: AssessmentDefinition['type']
): AssessmentDefinition => ({
  id: `${course.id}-${type}`,
  title: `${course.code} ${type === 'midterm' ? 'Defensive Review' : 'Final Assessment'}`,
  type,
  instructions: 'Answer from a defensive, authorized perspective and identify the applicable safety boundary in every response.',
  questions: course.topics.map((topic, index) => ({ ...topic.exercise, id: `${course.id}-${type}-q${index + 1}` })),
  passScorePercentage: type === 'midterm' ? 75 : 80,
});

const makeCourse = (definition: CyberCourseDefinition): Course => {
  const topics = definition.topics.map((topic, index): Topic => {
    const lab = { ...topic.lab, safety: makeLabSafety(topic) };
    return {
      id: topic.id,
      moduleId: definition.id,
      title: topic.title,
      slug: topic.id,
      summary: topic.summary,
      order: index + 1,
      cyberSafety: makeLessonSafety(topic),
      masteryPack: makeMasteryPack(definition, topic, index),
      labIds: [lab.id],
      interactiveLabs: [lab],
      researchPapers: topic.researchPapers,
    };
  });

  return {
    id: definition.id,
    code: definition.code,
    title: definition.title,
    program: 'computer-science',
    year: 4,
    semester: 8,
    creditHours: 3,
    estimatedHours: definition.estimatedHours,
    isRequired: false,
    isElective: true,
    category: 'security',
    prerequisiteCourseIds: definition.prerequisiteCourseIds,
    description: definition.description,
    learningOutcomes: definition.learningOutcomes,
    sections: [{ id: `${definition.id}-s1`, title: `Section 1: ${definition.title}`, summary: definition.description, order: 1, topics }],
    books: [],
    papers: [],
    lectures: [],
    labs: topics.flatMap((topic) => topic.interactiveLabs ?? []),
    midTermAssessment: makeAssessment(definition, 'midterm'),
    finalAssessment: makeAssessment(definition, 'final'),
    capstoneProject: { ...definition.project, id: `${definition.id}-capstone` },
  };
};

const definitions: CyberCourseDefinition[] = [
  {
    id: 'cyber-100', code: 'CYBER 100', title: 'Security Foundations and Linux Hardening', estimatedHours: 52, prerequisiteCourseIds: ['cs-101'],
    description: 'Ethics, authorization, risk, least privilege, defense in depth, Linux permissions, services, logs, SSH concepts, and safe laboratory setup.',
    learningOutcomes: ['Apply authorization and responsible-disclosure rules', 'Create an asset-based threat and risk model', 'Review and harden a supplied Linux baseline'],
    topics: [
      {
        id: 'cyber100-t1', title: 'Ethics, Authorization, Risk and Defensive Controls', classification: 'defensive', environment: 'Offline worksheet using a fictional login service and synthetic asset inventory.',
        summary: 'CIA triad, assets, threats, vulnerabilities, attack surfaces, risk, controls, least privilege, defense in depth, zero trust, ethics, and disclosure.', objective: 'Create an authorized threat model and risk worksheet that connects assets and threats to layered controls.',
        concepts: ['Authorization', 'CIA triad', 'Threat modeling', 'Risk', 'Least privilege', 'Defense in depth', 'Zero trust', 'Responsible disclosure'], allowedTargets: ['Fictional login-service architecture', 'Supplied synthetic asset inventory'], allowedTools: ['Threat-model worksheet', 'Risk matrix', 'Text editor'],
        exercise: { id: 'cyber100-ex1', type: 'multiple-choice', question: 'What must exist before testing a system you do not own?', options: ['Curiosity', 'Explicit written authorization and a defined scope', 'A public IP address', 'A security tool'], correctAnswer: 'Explicit written authorization and a defined scope', explanation: 'Authorization and scope are mandatory; educational intent does not create permission.' },
        lab: { id: 'cyber100-lab1', title: 'Login-System Threat Model', type: 'algo-viz', practiceMode: 'guided-lesson', level: 'level-2', estimatedMinutes: 90, instructions: 'Map assets, trust boundaries, threats, likelihood, impact, and layered controls for the supplied fictional service.', objective: 'Practice defensive threat modeling without interacting with a live target.', starterCode: '' },
        checklist: ['State authorization and scope', 'Inventory assets', 'Document trust boundaries', 'Prioritize risks', 'Recommend layered controls'],
        researchPapers: [
          { id: 'paper-nist-csf-2', title: 'The NIST Cybersecurity Framework (CSF) 2.0', authors: ['National Institute of Standards and Technology (NIST)'], year: 2024, venue: 'NIST Cybersecurity White Paper (CSWP) 29', doiOrArxiv: 'NIST.CSWP.29', openAccessUrl: 'https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf', canonicalUrl: 'https://csrc.nist.gov/pubs/cswp/29/the-nist-cybersecurity-framework-csf-20/final', paperType: 'implementation', difficulty: 'beginner', prerequisites: ['Basic computing vocabulary'], summary: 'The official U.S. government framework for managing cybersecurity risk, organized around six functions — Govern, Identify, Protect, Detect, Respond, and Recover — usable by any organization regardless of size or sector.', whyItMatters: 'Gives this topic\'s risk worksheet a standard, industry-recognized vocabulary and structure instead of an ad hoc list — the CSF\'s six functions map directly onto the asset/threat/control reasoning this topic\'s lab requires.', sectionsToRead: 'The Framework Core table and the Govern, Identify, and Protect function descriptions.', readingQuestions: ['How does the CSF define the relationship between "Identify" and "Protect"?', 'Why does the 2024 revision add "Govern" as a standalone function?', 'How would you map this topic\'s threat-model worksheet onto the CSF\'s six functions?'], relatedTopicIds: ['cyber100-t1'], accessStatus: 'open-access', deliveryMode: 'in-app-pdf-candidate' },
        ],
        primaryText: {
          id: 'book-nist-sp-800-30-risk-assessments',
          title: 'Guide for Conducting Risk Assessments',
          authors: ['Joint Task Force', 'National Institute of Standards and Technology (NIST)'],
          url: 'https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-30r1.pdf',
          pdfUrl: 'https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-30r1.pdf',
          canonicalUrl: 'https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-30r1.pdf',
          recommendedChapter: 'Chapter 3: The Fundamentals — assessing threats, vulnerabilities, and risk',
          accessStatus: 'open-access',
          publisherOrInstitution: 'NIST',
        },
      },
      {
        id: 'cyber100-t2', title: 'Linux Permissions, Services, Logs and Hardening', classification: 'educational-lab', environment: 'Resettable local container or supplied offline filesystem and log fixtures.',
        summary: 'Users, groups, permissions, processes, services, filesystems, logs, packages, environment variables, SSH concepts, and secure baselines.', objective: 'Audit a supplied Linux-like fixture and produce a least-privilege hardening and monitoring baseline.',
        concepts: ['Users and groups', 'Filesystem permissions', 'Processes and services', 'Logs', 'Package management', 'Environment variables', 'SSH hardening'], allowedTargets: ['Supplied local container', 'Offline filesystem fixture', 'Synthetic authentication logs'], allowedTools: ['Shell read-only inspection commands', 'Local text processing', 'Baseline checklist'],
        exercise: { id: 'cyber100-ex2', type: 'free-response', question: 'Explain why world-writable configuration files violate least privilege and how to remediate them safely.', explanation: 'The answer should identify unauthorized modification risk, ownership, minimal permissions, backup, validation, and monitoring.' },
        lab: { id: 'cyber100-lab2', title: 'Linux Baseline and Log Inspection', type: 'python', language: 'python', practiceMode: 'code-reading', level: 'level-2', estimatedMinutes: 120, instructions: 'Analyze supplied permission and log records, flag policy violations, and produce remediation recommendations. Do not connect to another host.', objective: 'Turn local configuration evidence into a defensive baseline.', starterCode: 'def review_permission(record):\n    findings = []\n    # Flag unsafe ownership or write access in the supplied fixture.\n    return findings' },
        checklist: ['Review ownership and permissions', 'Identify unnecessary services', 'Protect secrets and environment variables', 'Define logging and update expectations'],
        researchPapers: [
          { id: 'paper-nist-sp-800-123-server-security', title: 'Guide to General Server Security', authors: ['Karen Scarfone', 'Wayne Jansen', 'Miles Tracy'], year: 2008, venue: 'NIST Special Publication 800-123', doiOrArxiv: 'NIST.SP.800-123', openAccessUrl: 'https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-123.pdf', canonicalUrl: 'https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-123.pdf', paperType: 'implementation', difficulty: 'beginner', prerequisites: ['Basic computing vocabulary'], summary: 'Official NIST guidance on securing servers, covering installation, configuration, patching, and ongoing administration, including user/permission management, service minimization, and logging.', whyItMatters: "This topic's Linux baseline-and-hardening lab is a direct application of this guide's server-security principles: least privilege, minimizing unnecessary services, and maintaining logs for accountability.", sectionsToRead: 'Sections on operating system configuration, user accounts, and logging.', readingQuestions: ['What does the guide recommend for minimizing unnecessary services on a server?', 'How does the guide define a secure baseline configuration?', "Which of this topic's checklist items map onto the guide's account and permission-management recommendations?"], relatedTopicIds: ['cyber100-t2'], accessStatus: 'open-access', deliveryMode: 'in-app-pdf-candidate' },
        ],
        primaryText: {
          id: 'book-cis-rhel-benchmark',
          title: 'CIS Red Hat Enterprise Linux Benchmark v1.0.5',
          authors: ['Center for Internet Security (CIS)'],
          url: 'https://www.cisecurity.org/benchmark/red_hat_linux',
          pdfUrl: 'https://www.cisecurity.org/-/jssmedia/Project/cisecurity/cisecurity/data/media/files/uploads/2017/04/CIS_RHLinux_Benchmark_v105.pdf',
          canonicalUrl: 'https://www.cisecurity.org/-/jssmedia/Project/cisecurity/cisecurity/data/media/files/uploads/2017/04/CIS_RHLinux_Benchmark_v105.pdf',
          recommendedChapter: 'SSH hardening, access/authentication, and logging sections',
          accessStatus: 'open-access',
          publisherOrInstitution: 'Center for Internet Security',
        },
      },
    ],
    project: { title: 'Defensive Security Baseline Pack', description: 'Create a login-system threat model, asset inventory, risk worksheet, and Linux hardening baseline.', constraints: ['Fictional architecture and local fixtures only', 'No public target interaction'], expectedDeliverables: ['Threat model', 'Asset inventory', 'Risk register', 'Hardening checklist'], evaluationRubric: [{ criterion: 'Authorization and ethics', weight: '25%', description: 'Scope and disclosure boundaries are explicit.' }, { criterion: 'Risk reasoning', weight: '40%', description: 'Assets, threats, impacts, and controls are connected.' }, { criterion: 'Baseline quality', weight: '35%', description: 'Recommendations are least-privilege, testable, and reversible.' }] },
  },
  {
    id: 'cyber-210', code: 'CYBER 210', title: 'Network and Web Application Defense', estimatedHours: 68, prerequisiteCourseIds: ['cyber-100', 'cs-302'],
    description: 'TCP/IP, DNS, HTTP, TLS, segmentation, monitoring, and defensive web security covering authentication, authorization, validation, sessions, APIs, and remediation.',
    learningOutcomes: ['Design a segmented monitored network', 'Review a toy web application against common defensive controls', 'Write evidence-based remediation and verification tests'],
    topics: [
      {
        id: 'cyber210-t1', title: 'Network Security, Segmentation and Monitoring', classification: 'educational-lab', environment: 'Offline packet fixture and toy network diagram with no live capture or public addressing.',
        summary: 'TCP/IP, ports, DNS, HTTP, TLS, firewalls, proxies, VPN concepts, segmentation, legal packet analysis, monitoring, and misconfiguration prevention.', objective: 'Analyze supplied traffic metadata and design segmentation, firewall, TLS, and monitoring controls.',
        concepts: ['TCP/IP', 'Ports', 'DNS', 'HTTP and TLS', 'Firewalls', 'Proxies and VPNs', 'Segmentation', 'Packet-analysis ethics', 'Monitoring'], allowedTargets: ['Supplied packet metadata fixture', 'Toy private-address network'], allowedTools: ['Offline packet viewer', 'Network diagramming', 'Firewall rule worksheet'],
        exercise: { id: 'cyber210-ex1', type: 'multiple-choice', question: 'Which target is allowed for this packet-analysis lesson?', options: ['Any nearby wireless network', 'A supplied offline capture generated for the lab', 'A public website', 'Another learner’s device'], correctAnswer: 'A supplied offline capture generated for the lab', explanation: 'The lab uses known synthetic evidence and does not authorize interception of real traffic.' },
        lab: { id: 'cyber210-lab1', title: 'Offline Network Evidence Review', type: 'python', language: 'python', practiceMode: 'guided-lesson', level: 'level-3', estimatedMinutes: 120, instructions: 'Parse supplied connection records, identify insecure services and segmentation gaps, and produce a defensive network design.', objective: 'Practice network defense using fixed offline evidence.', starterCode: 'def summarize_connections(records):\n    # Return service counts and policy violations from supplied fixtures.\n    pass' },
        checklist: ['Identify trust zones', 'Require encrypted transport', 'Minimize exposed ports', 'Define firewall and monitoring rules'],
        researchPapers: [
          { id: 'paper-nist-sp-800-207-zero-trust', title: 'Zero Trust Architecture', authors: ['Scott Rose', 'Oliver Borchert', 'Stu Mitchell', 'Sean Connelly'], year: 2020, venue: 'NIST Special Publication 800-207', doiOrArxiv: 'NIST.SP.800-207', openAccessUrl: 'https://nvlpubs.nist.gov/nistpubs/specialpublications/NIST.SP.800-207.pdf', canonicalUrl: 'https://csrc.nist.gov/pubs/sp/800/207/final', paperType: 'implementation', difficulty: 'intermediate', prerequisites: ['TCP/IP fundamentals'], summary: 'The official NIST definition of Zero Trust Architecture: a security model that assumes no implicit trust based on network location and requires continuous verification of every access request, regardless of whether it originates inside or outside a traditional network perimeter.', whyItMatters: 'This topic\'s segmentation and monitoring design directly implements zero-trust principles; the publication gives the formal threat model and deployment scenarios behind "never trust, always verify" that the topic\'s glossary term assumes.', sectionsToRead: 'Section 2 (Zero Trust Basics) and Section 3 (Logical Components of Zero Trust Architecture).', readingQuestions: ['How does zero trust change the role of network segmentation compared to a traditional perimeter model?', 'What are the core logical components NIST defines for a zero trust architecture?', 'Which of this topic\'s firewall and monitoring rules would need to change under a zero-trust deployment?'], relatedTopicIds: ['cyber210-t1'], accessStatus: 'open-access', deliveryMode: 'in-app-pdf-candidate' },
        ],
        primaryText: {
          id: 'book-nist-sp-800-41-firewalls',
          title: 'Guidelines on Firewalls and Firewall Policy',
          authors: ['Karen Scarfone', 'Paul Hoffman'],
          url: 'https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-41r1.pdf',
          pdfUrl: 'https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-41r1.pdf',
          canonicalUrl: 'https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-41r1.pdf',
          recommendedChapter: 'Firewall policy, technologies, and network segmentation guidance',
          accessStatus: 'open-access',
          publisherOrInstitution: 'NIST',
        },
      },
      {
        id: 'cyber210-t2', title: 'Defensive Web and API Security', classification: 'educational-lab', environment: 'Local toy application or supplied request/response fixtures in an isolated resettable container.',
        summary: 'OWASP risk categories, input validation, authentication, authorization, sessions, injection concepts, XSS, CSRF, SSRF, uploads, headers, APIs, rate limits, logging, and remediation.', objective: 'Find control gaps in a deliberately simplified local application and verify a secure rewrite with tests.',
        concepts: ['OWASP Top 10', 'Input validation', 'Authentication', 'Authorization', 'Session security', 'Injection concepts', 'Security headers', 'API security', 'Rate limiting', 'Remediation'], allowedTargets: ['Supplied local toy application', 'Intentionally vulnerable educational fixture'], allowedTools: ['Browser developer tools against localhost only', 'Unit tests', 'Static code review'],
        exercise: { id: 'cyber210-ex2', type: 'free-response', question: 'Design authorization tests proving that one fictional user cannot access another user’s record.', explanation: 'Tests should cover ownership checks, identifiers, roles, failure responses, logging, and regression protection.' },
        lab: { id: 'cyber210-lab2', title: 'Secure Rewrite and Authorization Test Suite', type: 'ts', language: 'typescript', practiceMode: 'test-writing', level: 'level-3', estimatedMinutes: 150, instructions: 'Review supplied toy handlers, replace insecure validation and authorization logic, and add regression tests. Do not scan or probe external sites.', objective: 'Practice remediation and verification rather than exploitation.', starterCode: 'export function canReadRecord(userId: string, ownerId: string): boolean {\n  return false;\n}' },
        checklist: ['Validate on the server', 'Enforce object ownership', 'Protect sessions', 'Set defensive headers', 'Log rejected actions without secrets'],
        researchPapers: [
          { id: 'paper-owasp-top-10-2021', title: 'OWASP Top 10:2021', authors: ['OWASP Top 10 Team'], year: 2021, venue: 'OWASP Foundation', openAccessUrl: 'https://owasp.org/Top10/2021/', canonicalUrl: 'https://owasp.org/Top10/2021/', paperType: 'implementation', difficulty: 'beginner', prerequisites: ['Web application fundamentals'], summary: 'The standard, broadly-consensus awareness document ranking the ten most critical security risks to web applications, including broken access control, injection, and identification/authentication failures.', whyItMatters: "Directly names and ranks the vulnerability classes this topic's remediation and authorization-test lab targets, giving learners the industry-standard vocabulary and risk ranking security teams actually use.", sectionsToRead: 'The A01 (Broken Access Control) and A03 (Injection) category pages.', readingQuestions: ['Why does Broken Access Control rank as the top risk in the 2021 edition?', 'How does the document distinguish injection from broken authentication?', "Which OWASP Top 10 categories does this topic's authorization test suite directly address?"], relatedTopicIds: ['cyber210-t2'], accessStatus: 'open-access', deliveryMode: 'official-web-resource' },
        ],
        primaryText: {
          id: 'book-owasp-asvs-5',
          title: 'OWASP Application Security Verification Standard 5.0.0',
          authors: ['OWASP Foundation'],
          url: 'https://owasp.org/www-project-application-security-verification-standard/',
          pdfUrl: 'https://raw.githubusercontent.com/OWASP/ASVS/v5.0.0/5.0/OWASP_Application_Security_Verification_Standard_5.0.0_en.pdf',
          canonicalUrl: 'https://raw.githubusercontent.com/OWASP/ASVS/v5.0.0/5.0/OWASP_Application_Security_Verification_Standard_5.0.0_en.pdf',
          recommendedChapter: 'V4 Access Control, V6 Authentication, V7 Session Management, V8 Authorization',
          accessStatus: 'open-access',
          publisherOrInstitution: 'OWASP Foundation',
        },
      },
    ],
    project: { title: 'Secure Network and Local Web Assessment', description: 'Produce a segmented network design and remediate a local toy web application with an authorization test suite.', constraints: ['Local toy targets and offline captures only', 'No public scanning, interception, or exploitation'], expectedDeliverables: ['Network map', 'Packet-fixture analysis', 'Secure rewrite', 'Authorization tests', 'Assessment report'], evaluationRubric: [{ criterion: 'Network controls', weight: '30%', description: 'Segmentation, transport, firewall, and monitoring decisions are justified.' }, { criterion: 'Remediation', weight: '40%', description: 'Application fixes address root causes and include regression tests.' }, { criterion: 'Safety', weight: '30%', description: 'All work remains inside approved targets and records disclosure boundaries.' }] },
  },
  {
    id: 'cyber-310', code: 'CYBER 310', title: 'Secure Software Delivery and Supply-Chain Defense', estimatedHours: 58, prerequisiteCourseIds: ['cyber-100', 'cs-304'],
    description: 'Secure requirements, threat modeling, coding, review, static analysis, dependencies, secrets, CI/CD, containers, infrastructure, and patch management.',
    learningOutcomes: ['Convert threats into secure requirements and tests', 'Design a secure CI pipeline with supply-chain controls', 'Review dependencies, secrets, containers, and patches defensively'],
    topics: [
      {
        id: 'cyber310-t1', title: 'Secure Requirements, Coding and Review', classification: 'defensive', environment: 'Local source repository containing a supplied fictional API and synthetic configuration.',
        summary: 'Secure requirements, threat modeling, validation, error handling, code review, static analysis, secret handling, and remediation tests.', objective: 'Translate a threat model into secure code requirements, review findings, and regression tests.',
        concepts: ['Secure requirements', 'Threat modeling', 'Secure coding', 'Code review', 'Static analysis', 'Secrets management'], allowedTargets: ['Supplied local fictional API repository'], allowedTools: ['Text editor', 'Local static checks', 'Unit tests', 'Secret-pattern fixture scanner'],
        exercise: { id: 'cyber310-ex1', type: 'multiple-choice', question: 'Where should a production secret be stored?', options: ['In source code', 'In a public issue', 'In an approved secret manager with scoped access', 'In client-side JavaScript'], correctAnswer: 'In an approved secret manager with scoped access', explanation: 'Secrets require access control, rotation, auditability, and separation from source and client code.' },
        lab: { id: 'cyber310-lab1', title: 'Secure API Review and Secret Fixture Scanner', type: 'ts', language: 'typescript', practiceMode: 'refactoring', level: 'level-3', estimatedMinutes: 120, instructions: 'Review the supplied local API, remediate validation and secret-handling findings, and add tests using fake secret fixtures only.', objective: 'Connect threat findings to code and verification.', starterCode: 'export function findFakeSecrets(files: string[]): string[] {\n  return [];\n}' },
        checklist: ['Write abuse-resistant requirements', 'Review trust boundaries', 'Keep secrets out of code and logs', 'Add remediation tests'],
        researchPapers: [
          { id: 'paper-nist-sp-800-218-ssdf', title: 'Secure Software Development Framework (SSDF) Version 1.1: Recommendations for Mitigating the Risk of Software Vulnerabilities', authors: ['Murugiah Souppaya', 'Karen Scarfone', 'Donna Dodson'], year: 2022, venue: 'NIST Special Publication 800-218', doiOrArxiv: 'NIST.SP.800-218', openAccessUrl: 'https://nvlpubs.nist.gov/nistpubs/specialpublications/nist.sp.800-218.pdf', canonicalUrl: 'https://csrc.nist.gov/pubs/sp/800/218/final', paperType: 'implementation', difficulty: 'intermediate', prerequisites: ['Software development lifecycle basics'], summary: 'A core set of high-level secure-software-development practices — organized into Prepare the Organization, Protect the Software, Produce Well-Secured Software, and Respond to Vulnerabilities — meant to be layered onto any existing SDLC.', whyItMatters: 'Gives this topic\'s secure-requirements-and-review process a standard structure to follow instead of an ad hoc checklist; its "Produce Well-Secured Software" practices map directly onto the coding, review, and static-analysis concepts this topic covers.', sectionsToRead: 'The practice summary table and the "Produce Well-Secured Software" (PW) practice group.', readingQuestions: ['What are the four practice groups the SSDF organizes secure development around?', 'How does the SSDF recommend handling a vulnerability discovered after release?', 'Which SSDF practices does this topic\'s secret-handling checklist item already satisfy?'], relatedTopicIds: ['cyber310-t1'], accessStatus: 'open-access', deliveryMode: 'in-app-pdf-candidate' },
        ],
        primaryText: {
          id: 'book-nist-sp-800-218-ssdf-reader',
          title: 'Secure Software Development Framework (SSDF) Version 1.1',
          authors: ['Murugiah Souppaya', 'Karen Scarfone', 'Donna Dodson'],
          url: 'https://nvlpubs.nist.gov/nistpubs/specialpublications/nist.sp.800-218.pdf',
          pdfUrl: 'https://nvlpubs.nist.gov/nistpubs/specialpublications/nist.sp.800-218.pdf',
          canonicalUrl: 'https://nvlpubs.nist.gov/nistpubs/specialpublications/nist.sp.800-218.pdf',
          recommendedChapter: 'Secure requirements, coding, and review practice groups',
          accessStatus: 'open-access',
          publisherOrInstitution: 'NIST',
        },
      },
      {
        id: 'cyber310-t2', title: 'Dependencies, CI/CD, Containers and Patch Management', classification: 'defensive', environment: 'Offline dependency manifest, container configuration, and CI workflow fixtures.',
        summary: 'Software composition analysis, dependency scanning, artifact integrity, CI/CD security, container and infrastructure controls, updates, and patch validation.', objective: 'Design a secure delivery pipeline with dependency, artifact, container, and patch gates.',
        concepts: ['Software composition analysis', 'Dependency scanning', 'CI/CD security', 'Artifact integrity', 'Container security', 'Infrastructure security', 'Patch management'], allowedTargets: ['Supplied dependency manifest', 'Local CI and container fixtures'], allowedTools: ['Offline manifest analyzer', 'Configuration linter', 'Policy checklist'],
        exercise: { id: 'cyber310-ex2', type: 'free-response', question: 'Define release gates for a dependency update that affects a security-sensitive service.', explanation: 'A complete answer covers provenance, advisory review, tests, compatibility, staged rollout, monitoring, and rollback.' },
        lab: { id: 'cyber310-lab2', title: 'Secure CI Policy Evaluator', type: 'python', language: 'python', practiceMode: 'test-writing', level: 'level-3', estimatedMinutes: 120, instructions: 'Evaluate supplied pipeline fixtures for missing tests, unpinned actions, excessive permissions, secret exposure, and rollback gaps.', objective: 'Automate defensive review of deterministic delivery metadata.', starterCode: 'def evaluate_pipeline(pipeline):\n    findings = []\n    return findings' },
        checklist: ['Pin and verify dependencies', 'Minimize pipeline permissions', 'Scan artifacts and containers', 'Test rollback before release'],
        researchPapers: [
          { id: 'paper-nist-sp-800-161-supply-chain', title: 'Cybersecurity Supply Chain Risk Management Practices for Systems and Organizations', authors: ['Jon Boyens', 'Angela Smith', 'Nadya Bartol', 'Kris Winkler', 'Alex Holbrook', 'Matthew Fallon'], year: 2022, venue: 'NIST Special Publication 800-161 Revision 1', doiOrArxiv: 'NIST.SP.800-161r1-upd1', openAccessUrl: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-161r1-upd1.pdf', canonicalUrl: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-161r1-upd1.pdf', paperType: 'implementation', difficulty: 'intermediate', prerequisites: ['Software development lifecycle basics'], summary: 'The standard NIST framework for identifying, assessing, and mitigating supply-chain risk across an organization\'s systems, including third-party dependencies, CI/CD tooling, and vendor relationships.', whyItMatters: "This topic's dependency-scanning, artifact-integrity, and CI/CD gate checklist directly implements supply-chain risk practices this publication formalizes at the organizational level.", sectionsToRead: 'The supply chain risk management practices catalog covering software acquisition and CI/CD security.', readingQuestions: ['What distinguishes a supply-chain risk from a conventional application vulnerability?', 'Which practices does the framework recommend for dependency and artifact provenance?', "How would you map this topic's rollback-gate requirement onto the framework's risk-response practices?"], relatedTopicIds: ['cyber310-t2'], accessStatus: 'open-access', deliveryMode: 'in-app-pdf-candidate' },
        ],
        primaryText: {
          id: 'book-nist-sp-800-161-reader',
          title: 'Cybersecurity Supply Chain Risk Management Practices for Systems and Organizations',
          authors: ['Jon Boyens', 'Angela Smith', 'Nadya Bartol', 'Kris Winkler', 'Alex Holbrook', 'Matthew Fallon'],
          url: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-161r1-upd1.pdf',
          pdfUrl: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-161r1-upd1.pdf',
          canonicalUrl: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-161r1-upd1.pdf',
          recommendedChapter: 'CI/CD and dependency-management risk-response practices',
          accessStatus: 'open-access',
          publisherOrInstitution: 'NIST',
        },
      },
    ],
    project: { title: 'Secure Delivery Pipeline', description: 'Threat-model a fictional service and implement a deterministic CI policy and dependency-audit dashboard.', constraints: ['Offline manifests and fake secrets only', 'No production registry or infrastructure access'], expectedDeliverables: ['Project threat model', 'Secure API template', 'CI policy checks', 'Dependency audit', 'Patch and rollback plan'], evaluationRubric: [{ criterion: 'Secure design', weight: '35%', description: 'Requirements and code controls address realistic threats.' }, { criterion: 'Supply-chain controls', weight: '40%', description: 'Dependencies, artifacts, permissions, and containers have enforceable gates.' }, { criterion: 'Recovery', weight: '25%', description: 'Patching, monitoring, and rollback are explicit and tested.' }] },
  },
  {
    id: 'cyber-320', code: 'CYBER 320', title: 'Security Operations, Forensics and Incident Response', estimatedHours: 64, prerequisiteCourseIds: ['cyber-100', 'cyber-210'],
    description: 'Logs, alerts, detection engineering, SIEM concepts, triage, phishing defense, endpoint evidence, timelines, containment, recovery, reporting, and escalation.',
    learningOutcomes: ['Write and test defensive detection logic', 'Triage synthetic alerts and reconstruct an incident timeline', 'Produce evidence-aware containment, recovery, and lessons-learned reports'],
    topics: [
      {
        id: 'cyber320-t1', title: 'Monitoring, Detection Engineering and Triage', classification: 'defensive', environment: 'Offline synthetic authentication, endpoint, email, and network logs.',
        summary: 'Monitoring, logs, alerts, SIEM concepts, detection rules, triage, phishing classification, endpoint security, threat intelligence, reporting, and escalation.', objective: 'Build and test explainable detection rules against synthetic logs and triage alerts with documented evidence.',
        concepts: ['Monitoring', 'SIEM concepts', 'Detection engineering', 'Incident triage', 'Phishing defense', 'Endpoint security', 'Threat intelligence', 'Escalation'], allowedTargets: ['Supplied synthetic event records'], allowedTools: ['Local log parser', 'Detection-rule fixtures', 'Timeline worksheet'],
        exercise: { id: 'cyber320-ex1', type: 'multiple-choice', question: 'What should a useful alert include?', options: ['Only a dramatic name', 'Evidence, affected asset, severity rationale, and next triage step', 'A password', 'Unverified attribution'], correctAnswer: 'Evidence, affected asset, severity rationale, and next triage step', explanation: 'Actionable alerts connect evidence and context to a defensible next step.' },
        lab: { id: 'cyber320-lab1', title: 'Synthetic Log Analyzer and Detection Rules', type: 'python', language: 'python', practiceMode: 'test-writing', level: 'level-3', estimatedMinutes: 140, instructions: 'Parse supplied events, implement transparent detection rules, measure false positives, and produce triage records.', objective: 'Practice detection engineering without monitoring real users or systems.', starterCode: 'def detect(events):\n    alerts = []\n    return alerts' },
        checklist: ['Document data source and retention', 'Tie alerts to evidence', 'Measure false positives', 'Define escalation criteria'],
        researchPapers: [
          { id: 'paper-nist-sp-800-92-log-management', title: 'Guide to Computer Security Log Management', authors: ['Karen Kent', 'Murugiah Souppaya'], year: 2006, venue: 'NIST Special Publication 800-92', doiOrArxiv: 'NIST.SP.800-92', openAccessUrl: 'https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-92.pdf', canonicalUrl: 'https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-92.pdf', paperType: 'implementation', difficulty: 'intermediate', prerequisites: ['Basic computing vocabulary'], summary: 'Official NIST guidance on planning, implementing, and maintaining computer security log management, including log generation, storage, analysis, and the design of alerting infrastructure.', whyItMatters: "This topic's detection-rule and triage lab directly implements this guide's log-management lifecycle: retention, data-source documentation, and alert-to-evidence traceability.", sectionsToRead: 'Sections on log management infrastructure and log analysis.', readingQuestions: ['What are the phases of the log-management lifecycle this guide defines?', 'How does the guide recommend balancing log retention against storage cost?', "Which of this topic's checklist items map onto the guide's log-analysis recommendations?"], relatedTopicIds: ['cyber320-t1'], accessStatus: 'open-access', deliveryMode: 'in-app-pdf-candidate' },
        ],
        primaryText: {
          id: 'book-nist-sp-800-92-reader',
          title: 'Guide to Computer Security Log Management',
          authors: ['Karen Kent', 'Murugiah Souppaya'],
          url: 'https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-92.pdf',
          pdfUrl: 'https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-92.pdf',
          canonicalUrl: 'https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-92.pdf',
          recommendedChapter: 'Log analysis and SIEM infrastructure planning',
          accessStatus: 'open-access',
          publisherOrInstitution: 'NIST',
        },
      },
      {
        id: 'cyber320-t2', title: 'Digital Forensics and Incident Recovery', classification: 'defensive', environment: 'Supplied fictional case file containing synthetic disk, memory, network, and log artifacts.',
        summary: 'Incident lifecycle, evidence principles, chain of custody, timeline reconstruction, containment, eradication, recovery, documentation, and lessons learned.', objective: 'Reconstruct a simulated incident while preserving evidence and distinguishing facts from hypotheses.',
        concepts: ['Incident lifecycle', 'Evidence principles', 'Timeline reconstruction', 'Disk and memory concepts', 'Network evidence', 'Containment', 'Eradication', 'Recovery', 'Lessons learned'], allowedTargets: ['Supplied fictional incident case file'], allowedTools: ['Offline timeline builder', 'Hash calculator for supplied fixtures', 'Evidence inventory template'],
        exercise: { id: 'cyber320-ex2', type: 'free-response', question: 'Explain how containment can preserve evidence while reducing ongoing harm.', explanation: 'The response should balance isolation, volatile evidence, documentation, authorization, business impact, and recovery.' },
        lab: { id: 'cyber320-lab2', title: 'Simulated Incident Timeline', type: 'python', language: 'python', practiceMode: 'independent', level: 'level-3', estimatedMinutes: 150, instructions: 'Normalize supplied timestamps, inventory evidence, build a fact/hypothesis timeline, and recommend containment and recovery steps.', objective: 'Practice evidence-aware incident response using a fictional case.', starterCode: 'def build_timeline(artifacts):\n    # Preserve source identifiers and distinguish facts from analyst notes.\n    return []' },
        checklist: ['Inventory and hash supplied evidence', 'Preserve provenance', 'Separate facts from hypotheses', 'Document containment and recovery', 'Record lessons learned'],
        researchPapers: [
          { id: 'paper-nist-sp-800-61r2', title: 'Computer Security Incident Handling Guide', authors: ['Paul Cichonski', 'Thomas Millar', 'Tim Grance', 'Karen Scarfone'], year: 2012, venue: 'NIST Special Publication 800-61 Revision 2', doiOrArxiv: 'NIST.SP.800-61r2', openAccessUrl: 'https://nvlpubs.nist.gov/nistpubs/specialpublications/nist.sp.800-61r2.pdf', canonicalUrl: 'https://csrc.nist.gov/pubs/sp/800/61/r2/final', paperType: 'implementation', difficulty: 'intermediate', prerequisites: ['Basic computing vocabulary'], summary: 'The standard U.S. government guide to incident response, covering the incident-response lifecycle (preparation, detection and analysis, containment/eradication/recovery, and post-incident activity) independent of any specific platform or tool.', whyItMatters: 'This topic\'s fact/hypothesis timeline and containment-and-recovery checklist directly implement this guide\'s lifecycle model; it is the primary source for why evidence provenance and hypothesis separation matter during incident reconstruction.', sectionsToRead: 'Section 2.3 (The Incident Response Life Cycle) and Section 3 (Handling an Incident).', readingQuestions: ['What are the four phases of the incident-response lifecycle this guide defines?', 'Why does the guide emphasize preserving evidence chain of custody during containment?', 'Which of this topic\'s checklist items map onto the "post-incident activity" phase?'], relatedTopicIds: ['cyber320-t2'], accessStatus: 'open-access', deliveryMode: 'in-app-pdf-candidate' },
        ],
        primaryText: {
          id: 'book-nist-sp-800-86-forensics',
          title: 'Guide to Integrating Forensic Techniques into Incident Response',
          authors: ['National Institute of Standards and Technology (NIST)'],
          url: 'https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-86.pdf',
          pdfUrl: 'https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-86.pdf',
          canonicalUrl: 'https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-86.pdf',
          recommendedChapter: 'Evidence handling, chain of custody, and timeline reconstruction',
          accessStatus: 'open-access',
          publisherOrInstitution: 'NIST',
        },
      },
    ],
    project: { title: 'Defensive SOC Incident Case', description: 'Build detection logic, triage alerts, reconstruct a fictional incident, and produce a complete response report.', constraints: ['Synthetic offline evidence only', 'No monitoring of real people or endpoints'], expectedDeliverables: ['Detection rules', 'Alert dashboard', 'Evidence inventory', 'Incident timeline', 'Incident and recovery report'], evaluationRubric: [{ criterion: 'Detection quality', weight: '30%', description: 'Rules are explainable and evaluated for false positives.' }, { criterion: 'Evidence integrity', weight: '35%', description: 'Provenance and fact/hypothesis boundaries are preserved.' }, { criterion: 'Response quality', weight: '35%', description: 'Containment, recovery, communication, and lessons learned are actionable.' }] },
  },
  {
    id: 'cyber-410', code: 'CYBER 410', title: 'Cloud Security Engineering', estimatedHours: 54, prerequisiteCourseIds: ['cyber-100', 'cs-302'],
    description: 'Shared responsibility, IAM, storage, networks, keys, logs, secrets, containers, serverless systems, misconfiguration prevention, and cloud incident response.',
    learningOutcomes: ['Apply shared-responsibility and least-privilege reasoning', 'Review fictional cloud IAM and storage configurations', 'Design monitored cloud architecture and response procedures'],
    topics: [
      {
        id: 'cyber410-t1', title: 'Shared Responsibility, IAM and Cloud Data Protection', classification: 'defensive', environment: 'Offline fictional cloud inventory, IAM policy, storage, key, and secret fixtures.',
        summary: 'Shared responsibility, identities, roles, permissions, storage controls, key management, secrets, and misconfiguration prevention.', objective: 'Review a fictional cloud environment for excessive privileges and unsafe data protection settings.',
        concepts: ['Shared responsibility', 'IAM', 'Least privilege', 'Storage security', 'Key management', 'Secrets', 'Misconfiguration prevention'], allowedTargets: ['Supplied fictional cloud inventory and policy fixtures'], allowedTools: ['Offline policy analyzer', 'Architecture worksheet', 'IAM review checklist'],
        exercise: { id: 'cyber410-ex1', type: 'multiple-choice', question: 'Which IAM policy best follows least privilege?', options: ['Administrator access for every service', 'Only the documented actions on required resources', 'Wildcard actions and resources', 'A shared root account'], correctAnswer: 'Only the documented actions on required resources', explanation: 'Least privilege limits actions, resources, conditions, and duration to the demonstrated requirement.' },
        lab: { id: 'cyber410-lab1', title: 'Offline IAM and Storage Policy Review', type: 'algo-viz', language: 'json', practiceMode: 'code-reading', level: 'level-4', estimatedMinutes: 120, instructions: 'Review fictional JSON policies and storage settings, identify excessive access, and propose testable least-privilege remediations.', objective: 'Practice cloud policy review without cloud credentials or a live account.', starterCode: '{\n  "finding": "",\n  "evidence": "",\n  "least_privilege_remediation": ""\n}' },
        checklist: ['Assign responsibility boundaries', 'Remove wildcard privileges', 'Protect storage and keys', 'Rotate and scope secrets'],
        researchPapers: [
          { id: 'paper-nist-sp-800-210-cloud-ac', title: 'General Access Control Guidance for Cloud Systems', authors: ['Vincent C. Hu', 'Michaela Iorga', 'Wei Bao', 'Ang Li', 'Qinghua Li', 'Antonios Gouglidis'], year: 2020, venue: 'NIST Special Publication 800-210', doiOrArxiv: 'NIST.SP.800-210', openAccessUrl: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-210.pdf', canonicalUrl: 'https://csrc.nist.gov/pubs/sp/800/210/final', paperType: 'implementation', difficulty: 'intermediate', prerequisites: ['IAM fundamentals'], summary: 'Analyzes access-control considerations across IaaS, PaaS, and SaaS cloud delivery models, and provides guidance for designing access control that accounts for cloud characteristics like broad network access, resource pooling, and rapid elasticity.', whyItMatters: 'This topic\'s IAM policy review and least-privilege remediation exercise applies exactly the access-control reasoning this publication formalizes for cloud-specific conditions that on-premises access control models do not address.', sectionsToRead: 'Section 2 (Cloud Systems and Access Control) and Section 4 (Access Control Guidance).', readingQuestions: ['How do access-control needs differ across IaaS, PaaS, and SaaS?', 'Which cloud characteristics does the guidance identify as changing access-control design?', 'How would you apply this guidance to flag the wildcard-privilege issue in this topic\'s lab?'], relatedTopicIds: ['cyber410-t1'], accessStatus: 'open-access', deliveryMode: 'in-app-pdf-candidate' },
        ],
        primaryText: {
          id: 'book-nist-sp-800-144-cloud-security',
          title: 'Guidelines on Security and Privacy in Public Cloud Computing',
          authors: ['Wayne Jansen', 'Timothy Grance'],
          url: 'https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-144.pdf',
          pdfUrl: 'https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-144.pdf',
          canonicalUrl: 'https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-144.pdf',
          recommendedChapter: 'Shared responsibility, data protection, and public cloud risk guidance',
          accessStatus: 'open-access',
          publisherOrInstitution: 'NIST',
        },
      },
      {
        id: 'cyber410-t2', title: 'Cloud Networks, Workloads, Logging and Response', classification: 'defensive', environment: 'Offline architecture and synthetic cloud-log fixtures; no cloud account required.',
        summary: 'Cloud networks, containers, serverless controls, logging, monitoring, secure architecture, and incident response.', objective: 'Design a segmented, monitored cloud architecture and analyze a synthetic misconfiguration incident.',
        concepts: ['Cloud network security', 'Containers', 'Serverless security', 'Logging and monitoring', 'Secure architecture', 'Cloud incident response'], allowedTargets: ['Supplied fictional architecture', 'Synthetic cloud audit logs'], allowedTools: ['Diagramming', 'Offline log parser', 'Response checklist'],
        exercise: { id: 'cyber410-ex2', type: 'free-response', question: 'Design logging and response controls for a fictional public object-storage exposure.', explanation: 'Cover prevention, detection, evidence, containment, access review, notification, recovery, and lessons learned.' },
        lab: { id: 'cyber410-lab2', title: 'Cloud Log Analysis and Architecture Review', type: 'python', language: 'python', practiceMode: 'independent', level: 'level-4', estimatedMinutes: 130, instructions: 'Analyze supplied audit events, reconstruct configuration changes, and update the provided architecture with preventive and detective controls.', objective: 'Connect cloud design controls with response evidence.', starterCode: 'def cloud_change_timeline(events):\n    return []' },
        checklist: ['Segment workloads', 'Minimize public exposure', 'Centralize protected logs', 'Define containment and credential rotation'],
        researchPapers: [
          { id: 'paper-nist-sp-800-190-container-security', title: 'Application Container Security Guide', authors: ['Murugiah Souppaya', 'John Morello', 'Karen Scarfone'], year: 2017, venue: 'NIST Special Publication 800-190', doiOrArxiv: 'NIST.SP.800-190', openAccessUrl: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-190.pdf', canonicalUrl: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-190.pdf', paperType: 'implementation', difficulty: 'intermediate', prerequisites: ['Cloud networking fundamentals'], summary: 'Official NIST guidance on container and container-platform security risks, covering image, registry, orchestrator, host OS, and workload-runtime controls.', whyItMatters: "This topic's segmented, monitored cloud architecture design directly applies this guide's container and workload security controls to prevent and detect the misconfiguration incident the topic's lab investigates.", sectionsToRead: 'Sections on container runtime and orchestrator security.', readingQuestions: ['What are the major risk categories the guide identifies for container platforms?', 'How does the guide recommend segmenting workloads at the orchestrator level?', "Which of this topic's containment steps map onto the guide's incident-response recommendations?"], relatedTopicIds: ['cyber410-t2'], accessStatus: 'open-access', deliveryMode: 'in-app-pdf-candidate' },
        ],
        primaryText: {
          id: 'book-cisa-event-logging-threat-detection',
          title: 'Best Practices for Event Logging and Threat Detection',
          authors: ['Cybersecurity and Infrastructure Security Agency (CISA)', 'National Security Agency (NSA)', 'FBI', 'Five Eyes partner agencies'],
          url: 'https://www.ic3.gov/CSA/2024/240822.pdf',
          pdfUrl: 'https://www.ic3.gov/CSA/2024/240822.pdf',
          canonicalUrl: 'https://www.ic3.gov/CSA/2024/240822.pdf',
          recommendedChapter: 'Cloud and enterprise logging best-practice recommendations',
          accessStatus: 'open-access',
          publisherOrInstitution: 'CISA / NSA / FBI (joint advisory)',
        },
      },
    ],
    project: { title: 'Secure Cloud Architecture Review', description: 'Threat-model and harden a fictional cloud environment using offline policy and log fixtures.', constraints: ['No live cloud account, credential, or public resource', 'Offline fictional configurations only'], expectedDeliverables: ['Cloud threat model', 'IAM review', 'Secure architecture', 'Cloud log analysis', 'Incident-response checklist'], evaluationRubric: [{ criterion: 'Identity and data controls', weight: '35%', description: 'IAM, storage, keys, and secrets follow least privilege.' }, { criterion: 'Architecture', weight: '35%', description: 'Network and workload controls reduce exposure and improve observability.' }, { criterion: 'Response readiness', weight: '30%', description: 'Logs, containment, recovery, and credential rotation are actionable.' }] },
  },
  {
    id: 'cyber-420', code: 'CYBER 420', title: 'Memory Safety and Defensive Malware Analysis', estimatedHours: 62, prerequisiteCourseIds: ['cyber-100', 'cs-301', 'cs-403'],
    description: 'Memory, stack, heap, pointers, corruption, safe languages, isolation, compiler mitigations, fuzzing, patching, malware awareness, indicators, containment, and recovery.',
    learningOutcomes: ['Explain memory-safety failures and layered mitigations', 'Fuzz and patch a supplied toy parser inside an isolated lab', 'Classify benign malware-like indicators and design containment and recovery'],
    topics: [
      {
        id: 'cyber420-t1', title: 'Memory Safety, Fuzzing and Mitigation', classification: 'dual-use', environment: 'Instructor-supplied toy parser inside an offline resettable container with human supervision.',
        summary: 'Stack, heap, pointers, corruption, undefined behavior, memory-safe languages, sandboxing, isolation, compiler protections, exploit mitigations, fuzzing, root cause, and patching.', objective: 'Use bounded fuzzing against a toy parser to identify a crash, explain root cause, and verify a safe patch and mitigations.',
        concepts: ['Stack and heap', 'Pointers', 'Memory corruption', 'Undefined behavior', 'Memory-safe languages', 'Sandboxing', 'Compiler protections', 'Fuzzing', 'Patch development'], allowedTargets: ['Instructor-supplied toy parser in the local lab'], allowedTools: ['Supplied bounded input generator', 'Local debugger against the toy process', 'Compiler sanitizers in the isolated container'],
        exercise: { id: 'cyber420-ex1', type: 'free-response', question: 'Explain how bounds checking, memory-safe languages, compiler protections, and sandboxing provide defense in depth.', explanation: 'Each control acts at a different layer; none alone should be treated as perfect prevention.' },
        lab: { id: 'cyber420-lab1', title: 'Toy Parser Fuzzing and Safe Patch', type: 'python', language: 'python', practiceMode: 'debugging-challenge', level: 'level-4', estimatedMinutes: 150, instructions: 'Generate bounded inputs only for the supplied toy parser, group crashes, document root cause, implement a bounds-checking patch, and rerun regression fixtures. Do not adapt the lab to another target.', objective: 'Practice defensive root-cause analysis and patch verification.', starterCode: 'def generate_bounded_inputs(seed: str):\n    # Mutate only the supplied toy-format fixture within documented limits.\n    return [seed]' },
        checklist: ['Confirm target and supervision', 'Keep execution isolated', 'Minimize crash input', 'Patch root cause', 'Compare mitigations', 'Retest the full fixture set'],
        researchPapers: [
          { id: 'paper-memory-safe-roadmaps', title: 'The Case for Memory Safe Roadmaps', authors: ['Cybersecurity and Infrastructure Security Agency (CISA)', 'National Security Agency (NSA)', 'FBI', 'Five Eyes partner agencies'], year: 2023, venue: 'Joint CISA/NSA/FBI/ASD/CCCS/NCSC guidance', openAccessUrl: 'https://www.ic3.gov/CSA/2023/231206.pdf', canonicalUrl: 'https://www.ic3.gov/CSA/2023/231206.pdf', paperType: 'implementation', difficulty: 'intermediate', prerequisites: ['C/C++ fundamentals'], summary: 'A joint international cybersecurity advisory arguing that memory-unsafe languages are a root cause of a large share of exploited vulnerabilities, and recommending organizations adopt roadmaps toward memory-safe languages and mitigations.', whyItMatters: "Frames the exact class of bug this topic's fuzzing lab targets — memory corruption in C-family code — as a systemic industry risk, and connects the topic's layered-mitigation checklist (bounds checking, safe languages, sandboxing, compiler protections) to the advisory's recommended defenses.", sectionsToRead: 'The sections on memory-safe languages and defense-in-depth mitigations.', readingQuestions: ['What evidence does the advisory cite for memory-unsafe languages being a leading root cause of vulnerabilities?', 'Which mitigations does the advisory recommend short of a full language migration?', "How does this topic's checklist item to 'compare mitigations' reflect the advisory's defense-in-depth framing?"], relatedTopicIds: ['cyber420-t1'], accessStatus: 'open-access', deliveryMode: 'in-app-pdf-candidate' },
        ],
        primaryText: {
          id: 'book-memory-safe-roadmaps-reader',
          title: 'The Case for Memory Safe Roadmaps',
          authors: ['Cybersecurity and Infrastructure Security Agency (CISA)', 'National Security Agency (NSA)', 'FBI', 'Five Eyes partner agencies'],
          url: 'https://www.ic3.gov/CSA/2023/231206.pdf',
          pdfUrl: 'https://www.ic3.gov/CSA/2023/231206.pdf',
          canonicalUrl: 'https://www.ic3.gov/CSA/2023/231206.pdf',
          recommendedChapter: 'Defense-in-depth mitigations for memory-unsafe code',
          accessStatus: 'open-access',
          publisherOrInstitution: 'CISA / NSA / FBI (joint advisory)',
        },
      },
      {
        id: 'cyber420-t2', title: 'Malware Awareness, Indicators and Recovery', classification: 'defensive', environment: 'Static text-only fixtures describing fictional benign samples and synthetic indicators; no executable sample is provided.',
        summary: 'Malware categories, indicators of compromise, static and dynamic analysis concepts, sandboxing, detection, containment, recovery, and reporting.', objective: 'Classify synthetic indicators and produce a defensive containment, evidence, recovery, and reporting plan.',
        concepts: ['Malware categories', 'Indicators of compromise', 'Static analysis concepts', 'Dynamic analysis concepts', 'Sandboxed analysis', 'Detection', 'Containment', 'Recovery', 'Reporting'], allowedTargets: ['Supplied text-only fictional sample metadata', 'Synthetic indicators of compromise'], allowedTools: ['Offline indicator parser', 'Classification worksheet', 'Containment-plan template'],
        exercise: { id: 'cyber420-ex2', type: 'multiple-choice', question: 'What should happen first when an unknown executable is discovered on a real endpoint?', options: ['Run it to see what happens', 'Follow the authorized incident process and isolate or preserve evidence as directed', 'Upload private data publicly', 'Delete all logs'], correctAnswer: 'Follow the authorized incident process and isolate or preserve evidence as directed', explanation: 'Uncoordinated execution or deletion can increase harm and destroy evidence.' },
        lab: { id: 'cyber420-lab2', title: 'Benign Indicator Classification', type: 'python', language: 'python', practiceMode: 'code-reading', level: 'level-3', estimatedMinutes: 100, instructions: 'Parse supplied text-only sample metadata, extract synthetic indicators, classify confidence, and write containment and recovery recommendations. No executable malware is included.', objective: 'Practice defensive classification and reporting without harmful payloads.', starterCode: 'def extract_indicators(sample_metadata):\n    return {"files": [], "domains": [], "behaviors": []}' },
        checklist: ['Do not execute unknown samples', 'Preserve evidence and provenance', 'Separate indicator from confirmed attribution', 'Define containment and recovery', 'Write a defensive report'],
        researchPapers: [
          { id: 'paper-nist-sp-800-83r1-malware', title: 'Guide to Malware Incident Prevention and Handling for Desktops and Laptops', authors: ['Murugiah Souppaya', 'Karen Scarfone'], year: 2013, venue: 'NIST Special Publication 800-83 Revision 1', doiOrArxiv: 'NIST.SP.800-83r1', openAccessUrl: 'https://nvlpubs.nist.gov/nistpubs/specialpublications/nist.sp.800-83r1.pdf', canonicalUrl: 'https://csrc.nist.gov/pubs/sp/800/83/r1/final', paperType: 'implementation', difficulty: 'intermediate', prerequisites: ['Basic computing vocabulary'], summary: 'Official NIST guidance on preventing and handling malware incidents, covering malware categories, prevention measures, and an incident-handling process with worked scenarios.', whyItMatters: 'This topic\'s rule to never execute unknown samples and its containment/recovery checklist are direct applications of this guide\'s incident-handling process, which was written for exactly this class of desktop/laptop malware incident.', sectionsToRead: 'Section 3 (Malware Incident Prevention) and Section 4 (Malware Incident Response Methodology).', readingQuestions: ['What malware categories does the guide distinguish, and why does that classification matter for response?', 'What does the guide recommend before analyzing a suspected malicious file?', 'How does the guide\'s incident-handling methodology map onto this topic\'s indicator-classification lab?'], relatedTopicIds: ['cyber420-t2'], accessStatus: 'open-access', deliveryMode: 'in-app-pdf-candidate' },
        ],
        primaryText: {
          id: 'book-nist-sp-800-61r3',
          title: 'Incident Response Recommendations and Considerations for Cybersecurity Risk Management (NIST SP 800-61 Rev. 3)',
          authors: ['Alexander Nelson', 'Sanjay Rekhi', 'Murugiah Souppaya', 'Karen Scarfone'],
          url: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r3.pdf',
          pdfUrl: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r3.pdf',
          canonicalUrl: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r3.pdf',
          recommendedChapter: 'Malware incident handling within the broader incident-response lifecycle',
          accessStatus: 'open-access',
          publisherOrInstitution: 'NIST',
        },
      },
    ],
    project: { title: 'Memory-Safety and Malware-Defense Casebook', description: 'Patch a toy memory-safety defect and produce a defensive malware-awareness containment report.', constraints: ['Toy parser and text-only benign fixtures only', 'Human supervision required for the fuzzing lab', 'No deployable malware, persistence, credential theft, evasion, or harmful payloads'], expectedDeliverables: ['Memory layout explanation', 'Bounded fuzzing report', 'Safe patch and regression tests', 'Indicator report', 'Containment and recovery plan'], evaluationRubric: [{ criterion: 'Memory-safety reasoning', weight: '35%', description: 'Root cause and layered mitigations are accurate.' }, { criterion: 'Patch verification', weight: '35%', description: 'The fix is minimal, tested, and remains inside the toy target.' }, { criterion: 'Defensive malware handling', weight: '30%', description: 'Evidence, containment, recovery, and reporting are safe and disciplined.' }] },
  },
];

export const CYBERSECURITY_COURSES: Course[] = definitions.map(makeCourse);
