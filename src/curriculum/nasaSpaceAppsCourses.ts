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
import { makeVerifiedVideo as makeVerifiedVideoResource } from '../data/verifiedVideoRegistry';

// makeVerifiedVideo returns the richer VideoResource shape from ../types/resources
// (used by the shared verified-video registry). MasteryPack.primaryLecture expects the
// VideoResource shape from ../types/curriculum instead. Both shapes are populated
// identically by makeVerifiedVideo, so this cast mirrors the pattern already used by
// aiEngineeringCourses.ts / dataEngineeringCourses.ts when reading from VERIFIED_VIDEOS.
const makeVerifiedVideo = (params: Parameters<typeof makeVerifiedVideoResource>[0]): MasteryPack['primaryLecture'] =>
  makeVerifiedVideoResource(params) as unknown as MasteryPack['primaryLecture'];

interface NasaTopicDefinition {
  id: string;
  title: string;
  summary: string;
  objective: string;
  concepts: string[];
  prerequisites: string[];
  exercise: PracticeExercise;
  additionalExercises: PracticeExercise[];
  lab: InteractiveLabDefinition;
  checklist: string[];
  misconceptions: string[];
  glossary: Array<{ term: string; definition: string }>;
  primaryLecture?: MasteryPack['primaryLecture'];
  primaryText?: BookResource;
  researchPapers?: ResearchPaper[];
  readingQuestions: string[];
  simpleExplanation?: string;
  realWorldApplications?: { title: string; description: string }[];
}

interface NasaCourseDefinition {
  id: string;
  code: string;
  title: string;
  description: string;
  estimatedHours: number;
  difficulty: DifficultyLevel;
  prerequisiteCourseIds: string[];
  learningOutcomes: string[];
  topics: NasaTopicDefinition[];
  project: Omit<CapstoneProjectMilestone, 'id'>;
}

const makeMasteryPack = (
  course: NasaCourseDefinition,
  topic: NasaTopicDefinition,
  topicIndex: number
): MasteryPack => ({
  learningObjective: topic.objective,
  prerequisites: topic.prerequisites,
  coreConcepts: topic.concepts,
  simpleExplanation: topic.simpleExplanation,
  realWorldApplications: topic.realWorldApplications,
  recommendedChapter: `Course unit ${topicIndex + 1}: ${topic.title}`,
  practicalExercises: [topic.exercise, ...topic.additionalExercises],
  interactiveLab: topic.lab,
  primaryLecture: topic.primaryLecture,
  primaryText: topic.primaryText,
  readingQuestions: topic.readingQuestions,
  masteryChecklist: topic.checklist,
  capstoneMilestone: course.project.title,
  estimatedStudyMinutes: Math.round((course.estimatedHours * 60) / course.topics.length),
  difficulty: course.difficulty,
  glossary: topic.glossary,
  commonMisconceptions: topic.misconceptions,
  connectionsToLaterModules: [
    'Phase 2: NASA & Space Data (Earth observation, satellite imagery, GIS)',
    'Phase 3: Applied Machine Learning',
    'Phase 4: Full-stack product development',
  ],
  citation: {
    text: 'ComputerSciFy NASA Space Apps Challenge Prep curriculum — internally authored course notes and exercises, Phase 1: Data Foundation.',
  },
  accessStatus: 'needsVerification',
});

const makeAssessment = (
  course: NasaCourseDefinition,
  type: AssessmentDefinition['type']
): AssessmentDefinition => ({
  id: `${course.id}-${type}`,
  title: `${course.code} ${type === 'midterm' ? 'Checkpoint Review' : 'Final Assessment'}`,
  type,
  instructions:
    type === 'midterm'
      ? 'Answer each question in writing, then connect your answer to a concrete example from a real dataset before checking the reference explanation.'
      : 'Complete every question and cite evidence from your own weekly-challenge submissions to support each answer.',
  questions: course.topics.map((topic, index) => ({
    ...topic.exercise,
    id: `${course.id}-${type}-q${index + 1}`,
  })),
  passScorePercentage: type === 'midterm' ? 70 : 80,
});

const makeCourse = (definition: NasaCourseDefinition): Course => ({
  id: definition.id,
  code: definition.code,
  title: definition.title,
  program: 'data-science',
  year: 4,
  semester: 7,
  creditHours: 3,
  estimatedHours: definition.estimatedHours,
  isRequired: false,
  isElective: true,
  category: 'ds',
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

const definitions: NasaCourseDefinition[] = [
  {
    id: 'nasa-101',
    code: 'NASA 101',
    title: 'NASA Space Apps Prep: Python for Data Work',
    description:
      'Week 1 of the NASA Space Apps Challenge 2026 Prep track (Phase 1: Data Foundation). Python fundamentals — variables, types, strings, collections, control flow, functions, modules, exceptions, files, virtual environments, and light OOP — taught entirely through the lens of representing, cleaning, and manipulating real data, so every syntax choice is tied to a concrete data-handling reason rather than abstract rule-memorization.',
    estimatedHours: 22,
    difficulty: 'beginner',
    prerequisiteCourseIds: [],
    learningOutcomes: [
      'Explain the full 6-phase, 11-week Space Apps preparation roadmap and how a weekly challenge is structured, scored, and self-tracked',
      'Choose the correct Python data type, string operation, or collection (list/tuple/dict/set) for a given real-data scenario and justify the choice',
      'Write control-flow logic, reusable functions, and modules that process a real dataset predictably and can be tested in isolation',
      'Handle malformed input safely with exceptions, read and write real files, isolate project dependencies with a virtual environment, and represent a data record as a class when a plain dict stops being enough',
    ],
    topics: [
      {
        id: 'nasa101-t0',
        title: 'Program Overview: How This Track Works',
        summary: 'The 6-phase, 11-week roadmap behind this track, the 15-part weekly-challenge format, the judging rubrics, the engineering-standards checklist, and the 10-category skill dashboard — read this before Week 1.',
        objective: 'Explain the full Space Apps preparation roadmap, the weekly-challenge structure, and the judging and self-tracking system well enough to plan and honestly self-assess your own progress through the whole track.',
        concepts: [
          'Phase 1 — Data Foundation (Weeks 1-2, this release): Python fundamentals plus NumPy, Pandas, statistics, and Matplotlib, ending in the Earth Data Explorer mini-project — the only phase currently published in this platform; it is deliberately NASA-agnostic so the programming and analysis fundamentals are solid before any space-specific data enters the picture.',
          'Phase 2 — NASA & Space Data (Weeks 3-4, future release): NASA open data and APIs, Earth observation, satellite imagery, remote sensing, GIS, raster versus vector data, spectral bands, and climate/weather/ocean/vegetation monitoring — builds directly on the Pandas, statistics, and visualization skills from Phase 1.',
          'Phase 3 — AI / Machine Learning (Weeks 5-6, future release): supervised and unsupervised learning, classification, regression, clustering, anomaly detection, evaluation metrics, and scikit-learn, taught with the standing rule that AI is added only when it demonstrably beats a simpler statistical baseline — never because it "sounds impressive."',
          'Phase 4 — Product & Full-Stack Development (Weeks 7-8, future release): converting a working analysis into a demoable prototype — frontend, a Python backend API, a database, and basic deployment — prioritizing speed and reliability because this is hackathon preparation, not production engineering.',
          'Phase 5 — Hackathon Simulation (Weeks 9-10, future release): full timed 48-hour mock hackathons run against realistic constraints, built around the standing principle that a working MVP beats a huge broken project every time.',
          'Phase 6 — Final Competition Preparation (Week 11, future release): challenge-specific research once NASA publishes the actual 2026 challenge statements, project-idea scoring, and final presentation rehearsal.',
          'The end-to-end pipeline this whole track trains: real-world problem, understand the underlying science, find NASA or other open data, clean and analyze it, discover a pattern, design a solution, add AI or ML only when it genuinely helps, build a backend, database, and frontend, assemble a working prototype, test it, present it, get judged, and iterate — Phase 1 covers the "clean and analyze" segment of this chain in depth.',
          'The teaching loop used in every topic in this track: concept, then intuition, then a simple worked example, then real code, then an exercise you attempt yourself, then a mini-project, then (eventually) a real project, then a review — the loop exists specifically so you never memorize syntax you cannot yet explain the purpose of.',
          '"Working MVP beats a huge broken project": a project that does one real thing end-to-end and can be demoed is worth more, in judging and in learning, than a sprawling half-built system with no working path from input to output — this principle governs every deliverable and lab constraint in this track, starting with Phase 1\'s labs.',
        ],
        prerequisites: ['None — this is the starting point of the track'],
        researchPapers: [
          {
            id: 'paper-trainer-how-to-hackathon-2016',
            title: 'How to Hackathon: Socio-technical Tradeoffs in Brief, Intensive Collocation',
            authors: ['Erik H. Trainer', 'Arun Kalyanasundaram', 'Chalalai Chaihirunkarn', 'James D. Herbsleb'],
            year: 2016,
            venue: 'Proceedings of the 19th ACM Conference on Computer-Supported Cooperative Work & Social Computing (CSCW \'16)',
            doiOrArxiv: '10.1145/2818048.2819946',
            openAccessUrl: 'https://hackathon-planning-kit.org/files/Trainer-CSCW-2016.pdf',
            canonicalUrl: 'https://dl.acm.org/doi/10.1145/2818048.2819946',
            paperType: 'applied',
            difficulty: 'beginner',
            prerequisites: ['None'],
            summary: 'A multi-case qualitative study of how real hackathons actually function — what collocation, time pressure, and brief team formation do to how technical work gets done — based on direct observation of participating teams.',
            whyItMatters: 'This is the closest thing to peer-reviewed evidence about what actually makes a hackathon submission succeed or fail, which is exactly the discipline this Program Overview and its weekly-challenge format are built around, months before the actual event.',
            sectionsToRead: 'Abstract; Section 4 (Findings), particularly the discussion of time pressure and technical scoping.',
            readingQuestions: [
              'What does the paper identify as the biggest technical-work tradeoff created by a fixed, short time limit?',
              'How does this connect to the "working MVP beats a huge broken project" principle in this track\'s roadmap?',
            ],
            relatedTopicIds: ['nasa101-t0'],
            accessStatus: 'open-access',
            deliveryMode: 'in-app-pdf-candidate',
          },
        ],
        exercise: {
          id: 'nasa101-t0-ex1',
          type: 'free-response',
          question: 'Using today\'s date, sketch a realistic week-by-week target schedule for all 11 weeks of this program through the NASA Space Apps Challenge event itself, noting which phase each week belongs to.',
          explanation: 'A strong schedule assigns concrete calendar weeks to each of the 6 phases (Weeks 1-2 Data Foundation, 3-4 NASA & Space Data, 5-6 AI/ML, 7-8 Full-Stack, 9-10 Hackathon Simulation, 11 Final Prep) and lands Week 11 in the week immediately before the actual competition date, adjusting phase lengths if the real calendar is tighter or looser than 11 weeks.',
        },
        additionalExercises: [
          { id: 'nasa101-t0-ex2', type: 'multiple-choice', question: 'A weekly challenge brief lists "Constraints" and "Bonus objectives" as two separate sections. What is the functional difference between them?', options: ['They mean the same thing and are listed twice for emphasis', 'Constraints are hard limits the submission must respect; bonus objectives are optional stretch goals attempted only after the core deliverables are done', 'Constraints apply only to code; bonus objectives apply only to the write-up', 'Bonus objectives replace constraints once the difficulty level is "advanced"'], correctAnswer: 'Constraints are hard limits the submission must respect; bonus objectives are optional stretch goals attempted only after the core deliverables are done', explanation: 'Constraints (no external APIs, fixed time budget, required libraries, etc.) are non-negotiable boundaries a valid submission must stay inside. Bonus objectives are extra, optional stretch goals attempted only once every constraint is satisfied and every core deliverable exists — attempting bonus work before the MVP is done directly violates the "working MVP first" principle.' },
          { id: 'nasa101-t0-ex3', type: 'multiple-choice', question: 'Why does the weekly judging rubric score "NASA/Data Understanding" as its own 20-point category, separate from "Technical Execution"?', options: ['Because code quality and subject-matter understanding are unrelated and must be graded independently', 'Because working code that is built on a wrong understanding of the data or domain can still fail the actual problem, so both must be verified separately', 'It is redundant and only exists for historical reasons', 'Technical Execution only applies to backend code'], correctAnswer: 'Because working code that is built on a wrong understanding of the data or domain can still fail the actual problem, so both must be verified separately', explanation: 'A script can run cleanly, pass its own tests, and still be worthless if it misunderstands what the data actually measures or answers the wrong question — separating the two categories forces an explicit check that the analysis is not just technically correct but also meaningful.' },
          { id: 'nasa101-t0-ex4', type: 'free-response', question: 'This platform has no live AI chat coach — every lesson here is fixed, human-authored content, not a conversational tutor you type commands to. Given that, explain concretely what you would personally do, using only this platform\'s existing features (topics, labs, exercises, glossary, checklist), to reproduce the effect of each of these original session commands: "NEXT", "CHALLENGE ME", "I don\'t understand", and "JUDGE MY PROJECT".', explanation: 'A workable mapping: "NEXT" = open the next topic in this course\'s section outline in order. "CHALLENGE ME" = open a topic\'s interactive lab and attempt it fully before reading any hint or the mastery checklist. "I don\'t understand" = re-read the topic\'s simpleExplanation, rewatch the primary lecture, and check the glossary and misconceptions list before moving on. "JUDGE MY PROJECT" = score your own capstone submission against the evaluation rubric in the capstone lab\'s instructions, or trade submissions with a peer or mentor and have them score it the same way.' },
        ],
        lab: {
          id: 'nasa101-lab0',
          title: 'Build Your Program Tracker',
          type: 'algo-viz',
          practiceMode: 'guided-lesson',
          level: 'level-0',
          estimatedMinutes: 45,
          instructions:
            'MISSION NAME: Program Tracker Zero.\n\n' +
            'REAL-WORLD PROBLEM: An 11-week self-directed program with no instructor checking in on you will quietly collapse without an honest, written baseline and a visible plan — teams and solo learners alike abandon multi-week prep programs most often because progress was never made visible, not because the material was too hard.\n\n' +
            'SKILLS BEING TESTED: honest self-assessment, written planning, and turning a long verbal roadmap into a concrete artifact you will actually reread.\n\n' +
            'CONCEPTS YOU MUST APPLY: the 6-phase/11-week structure, and the 10-category learning dashboard, both defined in this topic\'s glossary.\n\n' +
            'OBJECTIVES (in order):\n' +
            '1. Create a single plain-text or spreadsheet file called your Program Tracker.\n' +
            '2. Write out all 6 phases with their week ranges, and next to each phase write the actual calendar dates you intend to work on it, counting backward from the real NASA Space Apps Dakar 2026 event date (November 14-15, 2026).\n' +
            '3. List all 10 learning-dashboard categories (Python, Data Science, NASA Data, GIS/Remote Sensing, AI/ML, Full Stack, Product Design, Problem Solving, Presentation, Hackathon Skills) and give yourself an honest baseline score from 0-100 in each, today, before starting Week 1.\n' +
            '4. Write one sentence per category explaining why you gave yourself that number — a bare number with no justification is not a real assessment.\n' +
            '5. Save the file somewhere you will actually reopen it weekly.\n\n' +
            'REQUIRED TOOLS: a plain text editor or spreadsheet application — no code required for this lab.\n\n' +
            'DATASET/API REQUIREMENTS: none.\n\n' +
            'DELIVERABLES: one saved Program Tracker file containing the dated 6-phase plan and the justified 10-category baseline.\n\n' +
            'CONSTRAINTS: scores must be your honest current ability, not your aspirational goal — inflating a baseline only makes later progress look smaller than it is.\n\n' +
            'DIFFICULTY: introductory.\n\n' +
            'EVALUATION RUBRIC (self-check): Completeness /40 (all 6 phases dated, all 10 categories scored), Honesty /30 (scores plausibly match your actual current experience), Specificity /30 (each score has a real one-sentence justification, not a placeholder).\n\n' +
            'COMMON MISTAKES TO AVOID: scoring every category the same number out of habit; skipping the written justification; picking calendar dates that do not actually work backward from the real competition date.\n\n' +
            'BONUS OBJECTIVES: add a short "why I am doing this" paragraph you can reread in Week 9 when the hackathon simulations get hard.\n\n' +
            'REFLECTION QUESTIONS:\n' +
            '1. Which of the 10 categories is your weakest right now, and which phase of the roadmap is most likely to raise it?\n' +
            '2. If you only had 6 weeks instead of 11, which phases would you compress first, and why?\n' +
            '3. What would "I am ready to compete" concretely look like across these 10 categories — pick target numbers, not a feeling.',
          objective: 'Produce a dated, honestly self-scored tracker before starting any technical content.',
          starterCode: '# PROGRAM TRACKER\n\n## 6-Phase Schedule\nPhase 1 (Data Foundation, Weeks 1-2): \nPhase 2 (NASA & Space Data, Weeks 3-4): \nPhase 3 (AI/ML, Weeks 5-6): \nPhase 4 (Full-Stack, Weeks 7-8): \nPhase 5 (Hackathon Simulation, Weeks 9-10): \nPhase 6 (Final Prep, Week 11): \n\n## 10-Category Baseline (0-100, with one-sentence justification each)\nPython: \nData Science: \nNASA Data: \nGIS / Remote Sensing: \nAI/ML: \nFull Stack: \nProduct Design: \nProblem Solving: \nPresentation: \nHackathon Skills: \n',
        },
        checklist: [
          'Write out the 6-phase, 11-week roadmap in your own words with real calendar dates',
          'Explain all 15 parts of a weekly-challenge brief without looking them up',
          'Explain the difference between the weekly judging rubric and the project idea-scoring rubric',
          'Score yourself honestly across all 10 learning-dashboard categories',
          'Explain the "working MVP beats a huge broken project" principle and where it applies',
          'Map every original session command to a concrete action you will take on this platform',
        ],
        misconceptions: [
          'Misconception: this Program Overview means there is a live AI coach on this platform you can chat with using these commands. Reality: this platform is entirely human-authored, deterministic, static content with no chatbot, model API, or agent runtime anywhere in it — this page is the permanent written reference the original coaching brief becomes here, not a system prompt for an AI.',
          'Misconception: the 10-category dashboard should be updated whenever you finish reading a topic. Reality: the brief is explicit that scores are based on demonstrated performance on real exercises, labs, and projects, not on lesson completion — reading a topic does not move the needle, finishing its lab and exercises honestly might.',
          'Misconception: the weekly judging rubric and the project idea-scoring rubric are the same thing. Reality: they score different things at different times — the judging rubric (Technical Execution, Data/NASA Understanding, Creativity, Real-World Impact, Presentation) scores a finished submission after the work is done; the idea-scoring rubric (Impact, Creativity, Validity, Relevance, Presentation) scores a candidate project idea before any work starts, to help choose which idea is worth pursuing.',
          'Misconception: Phase 1 being "NASA-agnostic" means NASA and space topics are unimportant. Reality: it is a deliberate sequencing choice — Python and data-analysis fundamentals have to be solid before NASA-specific data formats and APIs are introduced in Phase 2, otherwise learners debug two unfamiliar things (the language and the domain) at once.',
        ],
        glossary: [
          { term: 'Mission name', definition: 'A short, memorable label for a weekly challenge (e.g. "Earth Data Explorer") that makes it referenceable in conversation and in a portfolio, instead of "the Week 2 assignment."' },
          { term: 'Real-world problem (challenge component)', definition: 'The actual situation or need a weekly challenge is modeling, stated before any technical detail, so the work stays anchored to why it matters rather than becoming a syntax drill.' },
          { term: 'Skills being tested', definition: 'The specific technical or professional skills a challenge is designed to exercise, stated up front so you know what you are supposed to demonstrate, not just what you are supposed to produce.' },
          { term: 'Concepts you must apply', definition: 'The prerequisite knowledge a challenge assumes you already have from the lesson that preceded it — distinct from skills, which are what you do with that knowledge.' },
          { term: 'Lesson before the challenge', definition: 'The teaching content (concept, intuition, example, code) covered before a challenge is assigned, so the challenge tests applied understanding rather than guessing.' },
          { term: 'Step-by-step objectives', definition: 'An ordered checklist breaking a challenge into concrete, verifiable steps, so partial progress is visible instead of an all-or-nothing finished/unfinished state.' },
          { term: 'Required tools', definition: 'The specific software, libraries, or platform features a challenge expects you to use, stated explicitly so time is not lost guessing at scope.' },
          { term: 'Dataset/API requirements', definition: 'Which specific dataset(s) or API(s) a challenge depends on, and any access or format details needed before starting — this platform\'s Phase 1 labs use only local or directly downloadable files, never a live external API.' },
          { term: 'Deliverables', definition: 'The concrete artifacts a challenge submission must include (code, a chart, a written explanation, a file) — the checklist against which "is this done" is answered.' },
          { term: 'Constraints', definition: 'Explicit hard limits a submission must respect (time budget, allowed libraries, no external network calls) — violating a constraint invalidates a submission even if the deliverables exist.' },
          { term: 'Difficulty (challenge component)', definition: 'A stated difficulty level for a challenge, used to calibrate expectations and to track the intentional week-over-week difficulty increase across the program.' },
          { term: 'Evaluation rubric (challenge component)', definition: 'The specific scoring categories used to grade one challenge\'s submission, usually a smaller version of the full weekly judging rubric scoped to that week\'s skills.' },
          { term: 'Common mistakes (challenge component)', definition: 'A stated list of the specific errors learners most often make on a given challenge, included up front so they can be avoided rather than discovered the hard way.' },
          { term: 'Bonus objectives', definition: 'Optional stretch goals attempted only after every core deliverable and constraint is satisfied — attempting them first violates the "working MVP first" principle.' },
          { term: 'Reflection questions', definition: '2-3 questions asked at the end of a challenge that push past "did it work" toward "what does this result mean and what would I do differently."' },
          { term: 'Weekly judging rubric (100 points)', definition: 'The rubric used to score a finished weekly submission: Technical Execution /20, NASA/Data Understanding /20 (adapted to Data & Statistical Understanding while Phase 1 stays NASA-agnostic), Creativity /20, Real-World Impact /20, and Presentation /20, plus written qualitative feedback covering what went well, what went badly, the biggest weakness, the most important next improvement, what a professional would do differently, and whether you are progressing toward competition level.' },
          { term: 'Project idea-scoring rubric (100 points)', definition: 'A separate rubric used later in the program (Phase 6, once real NASA challenge statements are published) to rank 5-10 candidate project ideas against each other before committing to one: Impact /20, Creativity /20, Validity /20, Relevance /20, and Presentation /20.' },
          { term: 'Learning dashboard', definition: 'A running self-tracker across 10 categories — Python, Data Science, NASA Data, GIS/Remote Sensing, AI/ML, Full Stack, Product Design, Problem Solving, Presentation, and Hackathon Skills — each scored 0-100 based on demonstrated performance, not lesson completion.' },
        ],
        readingQuestions: [
          'Why does the roadmap put Python and data-analysis fundamentals before any NASA-specific data or API work?',
          'What is the practical difference between a challenge\'s stated "constraints" and its "bonus objectives," and why does that ordering matter?',
          'Why does honest (not aspirational) scoring on the 10-category dashboard make it more useful, not less encouraging?',
        ],
        simpleExplanation:
          'This track is the on-platform, read-anytime version of an 11-week personal coaching plan originally written for one learner preparing for the NASA Space Apps Challenge in Dakar on November 14-15, 2026. The plan divides that preparation into six phases: two weeks of pure Python and data-analysis fundamentals, two weeks of learning to work with NASA\'s own open data and satellite imagery, two weeks of practical machine learning, two weeks of turning an analysis into an actual working app, two weeks of full timed hackathon rehearsals, and one final week of last-mile preparation right before the real event. This platform currently publishes only the first phase — Weeks 1 and 2, the two courses that make up this track today — because those two weeks are also the foundation everything later depends on; the remaining phases will arrive as separate follow-up tracks.\n\n' +
          'The original plan was written as instructions to an AI coach — commands like "NEXT," "CHALLENGE ME," and "JUDGE MY PROJECT" that a learner would type into a chat conversation. This platform does not have a chatbot anywhere in it, by design: every lesson here is fixed, human-written, and verifiable, the same way a textbook is. So instead of a conversation, this page is the syllabus you reread yourself. Where the original plan said "type NEXT," here you simply open the next topic. Where it said "type CHALLENGE ME," here you open a topic\'s interactive lab and genuinely attempt it before peeking at any hint. Where it said "type JUDGE MY PROJECT," here you score your own finished capstone against the rubric printed in that capstone\'s lab instructions — or better, find a mentor, teammate, or peer willing to score it the same way, since a second honest opinion is worth more than a self-graded one.\n\n' +
          'Every week of the program hands you one serious challenge instead of a pile of disconnected exercises, and every challenge is written the same way: what real problem is this modeling, what skills does it test, what must you already know, what are the concrete steps, what tools and data are you allowed to use, what must you turn in, what are you not allowed to do, how hard is it meant to be, how will it be scored, what do people usually get wrong, what extra credit exists if you finish early, and what should you sit and think about once it is done. That fifteen-part shape repeats in every lab in this track, including this Program Overview\'s own lab, so you learn the format by using it, not just by reading about it.',
        realWorldApplications: [
          { title: 'The 2025 NASA International Space Apps Challenge', description: 'NASA\'s own recap of the 2025 event reports 551 local events across 167 countries and territories, more than 114,000 participants, and over 11,500 project submissions judged by NASA subject-matter experts and partner organizations over a single two-day hackathon — the scale this track is ultimately training a learner to compete inside.' },
          { title: 'NASA Space Apps Connect (official YouTube channel)', description: 'NASA runs a dedicated "Space Apps Connect" video series and official YouTube channel explaining how each year\'s challenge works, evidence that the event itself treats clear, repeatable onboarding material — the same idea behind this Program Overview topic — as essential to a global hackathon with hundreds of simultaneous local events.' },
          { title: 'Standard hackathon judging rubrics at scale events', description: 'Large hackathons (Space Apps included) commonly score submissions across a small fixed set of weighted categories similar to this track\'s Technical Execution / Understanding / Creativity / Impact / Presentation split — because judges reviewing hundreds of projects in two days need a consistent, comparable scoring structure, not free-form opinions.' },
        ],
        primaryLecture: makeVerifiedVideo({
          id: 'nasa101-t0-lec',
          title: 'Space Apps Connect | 2025 NASA Space Apps Challenge',
          institution: 'NASA Space Apps Challenge',
          videoId: 'Js08rFuWGWI',
          durationMinutes: 6,
          instructor: 'NASA Space Apps Challenge',
        }),
        primaryText: {
          id: 'book-nasa-space-apps-official-site',
          title: 'NASA Space Apps Challenge — Official Website',
          authors: ['NASA', 'Space Apps Challenge partner organizations'],
          url: 'https://www.spaceappschallenge.org/',
          canonicalUrl: 'https://www.spaceappschallenge.org/',
          recommendedChapter: 'Event overview and "How it works" sections',
          accessStatus: 'open-access',
          publisherOrInstitution: 'NASA',
          deliveryMode: 'official-web-resource',
        },
      },
      {
        id: 'nasa101-t1',
        title: 'Variables, Numeric Types & Strings for Real Datasets',
        summary: 'Why a value\'s type is a data-integrity decision, not a formality — variables, int/float/bool, string parsing, formatting, and cleaning as the first line of defense against bad data.',
        objective: 'Choose the correct Python type for a given raw data field, and clean and validate string and numeric values before they enter any downstream analysis.',
        concepts: [
          'A variable is a named reference to a value stored in memory, not a box that contains the value itself; in data work this distinction matters the moment two variables reference the same mutable object and an edit to one appears to "magically" affect the other.',
          'Python is dynamically typed, meaning a variable\'s type is determined by the value currently assigned to it and can change at runtime — this is convenient for quick scripts but is exactly why real datasets need explicit type-checking: a CSV column that "looks numeric" can silently contain a stray empty string that turns an entire column into strings.',
          'int and float are Python\'s core numeric types; a value read from a text file (a CSV, a JSON field, user input) always arrives as a string first and must be deliberately converted, and choosing float for something that should be a count (like a row ID) versus int for something that should tolerate decimals (like a temperature) is a real source of silent bugs.',
          'bool in Python is technically a subtype of int (True == 1, False == 0), which is why summing a list of booleans correctly counts how many are True — a genuinely useful pattern for counting matches in a dataset, not a quirky coincidence.',
          'Strings are immutable sequences of characters; every "modification" (uppercasing, stripping, replacing) actually creates and returns a new string, which is why str.strip() called without reassigning the result silently does nothing to the original variable — a classic real-world data-cleaning bug.',
          'String methods like .strip(), .lower(), .replace(), and .split() are the first and cheapest line of defense against messy real-world text data — inconsistent capitalization, stray whitespace, and mixed delimiters are far more common in real datasets than most beginners expect.',
          'f-strings (formatted string literals) let you embed expressions directly inside a string using {expression} syntax, which is the standard, readable way to build human-facing labels, log messages, and report text from data values without manual string concatenation.',
          'Type coercion functions (int(), float(), str(), bool()) convert between types explicitly; letting Python coerce types implicitly (or crash trying) instead of validating input first is a leading cause of data pipelines that work on clean sample data and then fail on the first real file.',
        ],
        prerequisites: ['Program Overview: How This Track Works'],
        researchPapers: [
          {
            id: 'paper-oliphant-python-scientific-computing-2007',
            title: 'Python for Scientific Computing',
            authors: ['Travis E. Oliphant'],
            year: 2007,
            venue: 'Computing in Science & Engineering, vol. 9, no. 3',
            doiOrArxiv: '10.1109/MCSE.2007.58',
            openAccessUrl: 'https://www.semanticscholar.org/paper/Python-for-Scientific-Computing-Oliphant/c647e8d93d85cdc6fb8c19deaf2eb9ec5c8d8941',
            canonicalUrl: 'https://ieeexplore.ieee.org/document/4160250',
            paperType: 'applied',
            difficulty: 'beginner',
            prerequisites: ['None'],
            summary: 'An early, influential case for Python as a genuine language for scientific and data work, not just a "glue" scripting language, written by a founding author of the NumPy project.',
            whyItMatters: 'Explains, from one of the people who built the ecosystem, exactly why Python\'s core language features (the ones this topic and the next two teach) turned out to be the right foundation for real scientific and data work, rather than an accident of popularity.',
            sectionsToRead: 'Introduction; the section on Python\'s core language advantages for scientific users.',
            readingQuestions: [
              'What does Oliphant argue made Python specifically well-suited to scientific computing, compared to other scripting languages available at the time?',
              'How does this connect to why this course teaches Python fundamentals before introducing NumPy?',
            ],
            relatedTopicIds: ['nasa101-t1'],
            accessStatus: 'open-access',
            deliveryMode: 'official-web-resource',
          },
        ],
        exercise: {
          id: 'nasa101-t1-ex1',
          type: 'code-snippet',
          question: 'A CSV column of temperature readings contains the raw string value "  23.5C\\n" for one row. Write the sequence of operations needed to turn this into a clean Python float representing 23.5.',
          explanation: 'The correct sequence strips whitespace/newlines first (.strip()), then removes the trailing unit character (.rstrip("C") or .replace("C", "")), then converts the result with float(). Attempting float() directly on the raw string raises a ValueError because of the trailing "C" and whitespace — cleaning must happen before conversion, not after.',
        },
        additionalExercises: [
          { id: 'nasa101-t1-ex2', type: 'multiple-choice', question: 'Why does calling my_string.strip() on its own line, without reassigning the result, fail to clean the string in place?', options: ['strip() only works on lists, not strings', 'Strings are immutable in Python, so strip() returns a new string rather than modifying the original', 'strip() requires an argument to work correctly', 'This actually does work correctly in Python'], correctAnswer: 'Strings are immutable in Python, so strip() returns a new string rather than modifying the original', explanation: 'Every string method that appears to "modify" a string actually builds and returns a brand-new string object, leaving the original untouched. The fix is always to reassign: my_string = my_string.strip().' },
          { id: 'nasa101-t1-ex3', type: 'free-response', question: 'A dataset column meant to store a station ID (like "0042") is read into Python as the integer 42 instead of the string "0042". Explain why this happened and why it is a real data-integrity problem, not just a cosmetic one.', explanation: 'If the column was auto-converted to int during loading, the leading zero — meaningful in a fixed-width station ID scheme — is silently destroyed, since integers cannot represent leading zeros. This is a real problem because it can break joins against other datasets that still use the zero-padded ID format, and it is not reversible once the leading zero is gone. IDs, codes, and phone numbers should generally stay strings even when they look numeric.' },
          { id: 'nasa101-t1-ex4', type: 'multiple-choice', question: 'Why does Python allow sum([True, False, True, True]) to return 3?', options: ['Python silently ignores the False value', 'bool is a subtype of int, where True equals 1 and False equals 0, so summing booleans counts how many are True', 'sum() automatically converts booleans to their string length', 'This actually raises a TypeError in real Python'], correctAnswer: 'bool is a subtype of int, where True equals 1 and False equals 0, so summing booleans counts how many are True', explanation: 'Because bool inherits from int, True and False behave as 1 and 0 in any numeric context. This is a genuinely useful pattern for counting how many rows in a dataset satisfy some condition, e.g. sum(value > threshold for value in readings).' },
        ],
        lab: {
          id: 'nasa101-lab1',
          title: 'Weekly Challenge: The Messy Sensor Log',
          type: 'python',
          language: 'python',
          practiceMode: 'debugging-challenge',
          level: 'level-1',
          estimatedMinutes: 90,
          instructions:
            'MISSION NAME: The Messy Sensor Log.\n\n' +
            'REAL-WORLD PROBLEM: Real environmental sensors and manually-entered field logs never produce perfectly clean numbers — stray units, inconsistent capitalization, extra whitespace, and empty readings are the normal state of raw data, not the exception. Every data pipeline lives or dies on how it handles this first.\n\n' +
            'SKILLS BEING TESTED: choosing correct types, string cleaning, safe type conversion, and f-string formatting.\n\n' +
            'CONCEPTS YOU MUST APPLY: variables and dynamic typing, int/float/bool, string immutability and methods, f-strings, and explicit type coercion.\n\n' +
            'OBJECTIVES (in order):\n' +
            '1. Given a Python list of raw sensor-log strings such as ["  23.5C", "19.0 C", "N/A", "21.8c\\n", ""], write a function clean_reading(raw) that returns a float in Celsius, or None if the value cannot be safely parsed.\n' +
            '2. Handle both uppercase "C" and lowercase "c" unit suffixes, and strip all leading/trailing whitespace and newlines.\n' +
            '3. Treat "N/A" and empty strings as missing data (return None), not as an error that crashes the program.\n' +
            '4. Write a second function that takes the full list and returns two things: the list of successfully parsed floats, and a count of how many readings were unparseable.\n' +
            '5. Use an f-string to print a one-line summary report: how many readings were read, how many parsed successfully, and how many were missing.\n\n' +
            'REQUIRED TOOLS: core Python only — no external libraries.\n\n' +
            'DATASET/API REQUIREMENTS: none; use the small inline list of raw strings described above (and add at least 3 of your own messy examples to prove your function is robust).\n\n' +
            'DELIVERABLES: the clean_reading function, the summary function, and the printed report.\n\n' +
            'CONSTRAINTS: your code must never raise an unhandled exception, no matter what string is passed in — a crash on bad data is a worse outcome than a correctly-flagged missing value.\n\n' +
            'DIFFICULTY: introductory.\n\n' +
            'EVALUATION RUBRIC: Correctness /40 (all provided examples parse or are flagged correctly), Robustness /30 (your own edge cases do not crash it), Clarity /30 (readable code, an f-string report, sensible function names).\n\n' +
            'COMMON MISTAKES TO AVOID: calling float() before cleaning the string; forgetting that .strip() and .replace() do not modify strings in place; using a bare except: that swallows real bugs along with bad data; forgetting the lowercase "c" unit case.\n\n' +
            'BONUS OBJECTIVES: also detect and reject physically impossible readings (e.g. below -90°C or above 60°C, the extreme range of recorded Earth surface temperatures) as a second category of invalid data, separate from unparseable strings.\n\n' +
            'REFLECTION QUESTIONS:\n' +
            '1. Why is returning None for a bad reading usually better than skipping it silently or crashing the program?\n' +
            '2. What is one more messy real-world format (besides units and whitespace) you would expect a real sensor log to contain?\n' +
            '3. If this function ran on 10,000 readings instead of 5, what would you want the summary report to also tell you?',
          objective: 'Turn a list of realistically messy sensor strings into clean floats with an honest missing-data count, without ever crashing.',
          starterCode: 'def clean_reading(raw):\n    """Return a float in Celsius, or None if raw cannot be safely parsed."""\n    # TODO: strip whitespace, handle C/c unit suffix, handle N/A and empty strings\n    pass\n\n\ndef summarize(raw_readings):\n    """Return (list_of_valid_floats, missing_count)."""\n    # TODO\n    pass\n\n\nraw_readings = ["  23.5C", "19.0 C", "N/A", "21.8c\\n", ""]\n# TODO: call summarize() and print an f-string report\n',
        },
        checklist: [
          'Explain why Python variables are references, not containers',
          'Convert a messy raw string to a clean float without crashing on bad input',
          'Explain why strings are immutable and what that means for method chaining',
          'Use an f-string to build a formatted report line from variables',
          'Justify when a numeric-looking field should stay a string (IDs, codes)',
        ],
        misconceptions: [
          'Misconception: since Python is dynamically typed, type choice does not really matter until the code breaks. Reality: a field silently stored as the wrong type (a zero-padded ID as an int, a category code as a float) can corrupt data permanently and invisibly — the bug shows up much later, far from its actual cause.',
          'Misconception: my_string.strip() cleans the variable in place. Reality: strings are immutable; every string method returns a new string that must be reassigned back to the variable to have any effect.',
          'Misconception: float() and int() are safe to call directly on any data pulled from a file. Reality: raw file data is never guaranteed clean; calling a conversion function on unvalidated input is one of the most common sources of an unhandled crash in a real data pipeline.',
          'Misconception: True and False are a separate, unrelated type from numbers. Reality: bool is a subtype of int in Python, which is precisely why sum() and comparisons work directly on lists of booleans.',
        ],
        glossary: [
          { term: 'Variable', definition: 'A named reference to a value stored in memory; reassigning a variable changes what it refers to, it does not change the object other variables might still be pointing at.' },
          { term: 'Dynamic typing', definition: 'A language behavior where a variable\'s type is determined by its currently assigned value and can change at runtime, as opposed to being fixed at declaration.' },
          { term: 'Type coercion', definition: 'Explicitly converting a value from one type to another using a function like int(), float(), or str(), as distinct from Python silently inferring or failing to infer a type on its own.' },
          { term: 'String immutability', definition: 'The property that a Python string, once created, can never be changed in place — every "modifying" method returns a brand-new string object instead.' },
          { term: 'f-string', definition: 'A formatted string literal (f"...") that lets you embed Python expressions directly inside curly braces, evaluated and inserted into the string at runtime.' },
          { term: 'Sentinel value', definition: 'A special value (like None) used to represent "no valid value here" in a way that is distinguishable from any real, valid data value — the safe alternative to crashing or silently dropping a row.' },
          { term: 'Whitespace stripping', definition: 'Removing leading and trailing spaces, tabs, and newline characters from a string, most commonly with .strip(), a near-universal first step in cleaning text read from a file.' },
        ],
        readingQuestions: [
          'Why does choosing int versus float versus str for the same-looking field matter for data integrity, not just correctness of arithmetic?',
          'Why is a function that returns None for bad data usually preferable to one that raises an exception, in a data-cleaning context?',
          'What real-world formatting inconsistencies (besides units and whitespace) would you expect to see in a genuinely messy dataset?',
        ],
        simpleExplanation:
          'A Python variable is less like a labeled box holding a value, and more like a sticky note with an arrow pointing at a value sitting somewhere in memory. Two sticky notes can point at the exact same value; if that value is something changeable (a list, for instance), editing it through one sticky note means the other sticky note sees the change too, because they were never two separate things — just two arrows pointing at one thing. This matters the moment your program behaves like it "changed a value it wasn\'t supposed to touch."\n\n' +
          'Real data almost never arrives pre-cleaned. A temperature sensor might log "23.5C" one day and " 19.0 C\\n" the next, with different spacing, different capitalization, and a trailing newline character nobody typed on purpose. Python treats every one of these as just a string of characters until you explicitly tell it "now turn this into a number" — and if you skip the cleanup step and try that conversion on messy text, Python will refuse and crash, loudly and correctly, because "23.5C" is not a valid number no matter how obviously a human can tell what it means.\n\n' +
          'Strings themselves have a quirk that surprises almost everyone at first: you cannot actually edit one. Calling .strip() on a messy string does not scrub the original — it hands you back a brand new, cleaned string and leaves the messy original completely alone. If you do not catch that new string in a variable (usually by reassigning it to itself), your "cleaning" code runs, produces a perfectly clean result, and then throws that result away, leaving the original mess untouched. This one habit — remembering to catch what string methods return — is probably the single most common beginner data-cleaning bug, and it is exactly why this topic exists before you touch a single real dataset.',
        realWorldApplications: [
          { title: 'Excel-exported CSV files with inconsistent whitespace', description: 'Spreadsheet exports routinely leave trailing spaces or stray tab characters inside string cells that look identical to a human eye but fail an exact-match comparison in code, which is why .strip() is one of the first calls in almost every real Python data-cleaning script.' },
          { title: 'Government open-data portals recording measurements as text with units', description: 'Public datasets (weather stations, water-quality monitors, traffic sensors) very commonly store numeric readings as text fields with an embedded unit suffix exactly like this topic\'s exercise, because the raw sensor firmware or logging software wrote out a human-readable string rather than a clean number.' },
          { title: 'ID and code fields that break when auto-converted to numbers', description: 'Postal codes, product SKUs, and station identifiers with leading zeros are a well-known real-world data bug: spreadsheet software and naive CSV parsers frequently auto-convert them to integers on load, silently destroying the leading zeros and breaking any later join against a system that still expects the original zero-padded format.' },
        ],
        primaryLecture: makeVerifiedVideo({
          id: 'nasa101-t1-lec',
          title: 'Python Tutorial for Beginners 2: Strings - Working with Textual Data',
          institution: 'Corey Schafer',
          videoId: 'k9TUPpGqYTo',
          durationMinutes: 16,
          instructor: 'Corey Schafer',
        }),
        primaryText: {
          id: 'book-python-docs-introduction',
          title: 'The Python Tutorial — An Informal Introduction to Python',
          authors: ['Python Software Foundation'],
          url: 'https://docs.python.org/3/tutorial/introduction.html',
          canonicalUrl: 'https://docs.python.org/3/tutorial/introduction.html',
          recommendedChapter: 'Section 3: An Informal Introduction to Python (numbers, strings)',
          accessStatus: 'open-access',
          publisherOrInstitution: 'Python Software Foundation',
          deliveryMode: 'official-web-resource',
        },
      },
      {
        id: 'nasa101-t2',
        title: 'Data Structures: Lists, Tuples, Dictionaries & Sets',
        summary: 'How to represent a real dataset in memory before Pandas exists — rows as lists, fixed records as tuples, labeled fields as dictionaries, and uniqueness/membership as sets.',
        objective: 'Choose the correct built-in collection for a given real-data shape (ordered rows, fixed records, labeled fields, unique memberships) and justify the choice by its performance and mutability properties.',
        concepts: [
          'A list is an ordered, mutable, and indexable sequence — the natural representation for a column of readings or a growing collection of rows read one at a time from a file, exactly the shape most real datasets start in before any table structure is imposed.',
          'A tuple is an ordered, immutable sequence — the correct choice for a fixed-shape record (like a single (latitude, longitude) coordinate pair or a (year, month, value) reading) precisely because its immutability guarantees the record cannot be accidentally reordered or mutated later in a pipeline.',
          'A dictionary maps unique, hashable keys to values in roughly constant-time O(1) average lookup — the natural representation for a single labeled data record (a row as {"station": "S1", "temp_c": 23.5, "date": "2026-01-01"}) or for building a lookup table from an ID to a full record.',
          'A set stores only unique, hashable values with no guaranteed order and supports fast membership testing and mathematical set operations (union, intersection, difference) — the correct tool the moment a real question becomes "which stations appear in both datasets" or "how many distinct categories exist," not "in what order do they appear."',
          'List indexing and slicing (data[0], data[-1], data[2:5]) access elements by position; a negative index counts from the end, and a slice returns a new list rather than a view, which matters when you need to preserve the original ordering for later reuse.',
          'Dictionary methods .get(key, default), .keys(), .values(), and .items() are the safe, idiomatic way to read from and iterate over labeled data — using data[key] directly on a key that might be missing raises a KeyError and crashes a pipeline that .get() would have handled gracefully.',
          'List comprehensions ([expr for item in iterable if condition]) build a new list from an existing iterable in one readable line, and are the standard, faster alternative to a manual for-loop-plus-append pattern for simple row-by-row transformations and filters.',
          'Choosing the wrong collection has real performance consequences at scale: checking "is this value in my_list" is O(n) (it may have to scan the whole list), while checking "is this value in my_set" is O(1) on average — a difference that is invisible on 10 rows and very visible on 100,000.',
        ],
        prerequisites: ['Variables, Numeric Types & Strings for Real Datasets'],
        researchPapers: [
          {
            id: 'paper-oliphant-python-scientific-computing-2007-datastructures',
            title: 'Python for Scientific Computing',
            authors: ['Travis E. Oliphant'],
            year: 2007,
            venue: 'Computing in Science & Engineering, vol. 9, no. 3',
            doiOrArxiv: '10.1109/MCSE.2007.58',
            openAccessUrl: 'https://www.semanticscholar.org/paper/Python-for-Scientific-Computing-Oliphant/c647e8d93d85cdc6fb8c19deaf2eb9ec5c8d8941',
            canonicalUrl: 'https://ieeexplore.ieee.org/document/4160250',
            paperType: 'applied',
            difficulty: 'beginner',
            prerequisites: ['None'],
            summary: 'An early, influential case for Python as a genuine language for scientific and data work, highlighting how its clean, high-level built-in data structures reduced the need for hand-rolled data-handling code compared to lower-level languages.',
            whyItMatters: 'Directly explains why Python\'s built-in lists, dicts, and sets — not a third-party library — were already enough to make Python attractive for real scientific and data work, which is exactly the claim this topic\'s collection-choice reasoning is built on.',
            sectionsToRead: 'The discussion of Python\'s built-in data structures and their role in scientific code.',
            readingQuestions: [
              'What does Oliphant identify as the practical advantage of Python\'s built-in collections over writing custom data structures from scratch?',
              'Why does this advantage matter more, not less, once real (not toy) datasets are involved?',
            ],
            relatedTopicIds: ['nasa101-t2'],
            accessStatus: 'open-access',
            deliveryMode: 'official-web-resource',
          },
        ],
        exercise: {
          id: 'nasa101-t2-ex1',
          type: 'code-snippet',
          question: 'You have two lists of weather station IDs, stations_2024 and stations_2025, each with possible duplicates and different orderings. Write the most efficient way to find which station IDs appear in both years.',
          explanation: 'The efficient approach converts both lists to sets and uses the intersection operator: set(stations_2024) & set(stations_2025). This also automatically removes duplicates within each year. Using nested for-loops to compare every pair of items works but is far slower (O(n*m)) and is the wrong tool once the lists are large — this is exactly the kind of "which values overlap" question sets are built for.',
        },
        additionalExercises: [
          { id: 'nasa101-t2-ex2', type: 'multiple-choice', question: 'Why is a tuple the better choice over a list for storing a single (latitude, longitude) coordinate pair that will be passed around a data pipeline?', options: ['Tuples use less memory for any input, always', 'Tuples are immutable, so the coordinate pair cannot accidentally be reordered or have a value overwritten later in the pipeline', 'Lists cannot store two values', 'Tuples support .append() and lists do not'], correctAnswer: 'Tuples are immutable, so the coordinate pair cannot accidentally be reordered or have a value overwritten later in the pipeline', explanation: 'A coordinate pair is a fixed, two-element record where order is meaningful (latitude must stay first). Immutability is a guarantee, not just a restriction: no later code path can accidentally mutate or reorder it, which is exactly the property you want for a record that should never change shape.' },
          { id: 'nasa101-t2-ex3', type: 'free-response', question: 'A script reads weather_record["station_id"] directly and crashes with a KeyError partway through processing 5,000 records. Explain what likely went wrong and how you would rewrite the line to make the script robust.', explanation: 'The crash means at least one record dictionary is missing the "station_id" key entirely (a genuinely common real-world data-quality issue, not a bug in the reading logic). The robust rewrite uses weather_record.get("station_id"), optionally with a default value like weather_record.get("station_id", "UNKNOWN"), so a missing key produces a handleable None or default value instead of crashing the entire run partway through.' },
          { id: 'nasa101-t2-ex4', type: 'code-snippet', question: 'Rewrite this loop as a single list comprehension: results = []\\nfor reading in readings:\\n    if reading > 0:\\n        results.append(reading * 1.8 + 32)', explanation: 'results = [reading * 1.8 + 32 for reading in readings if reading > 0] — the comprehension keeps the same filter (if reading > 0) and the same transformation (Celsius-to-Fahrenheit) in one readable expression, which is the standard idiomatic replacement for a simple filter-then-transform loop.' },
        ],
        lab: {
          id: 'nasa101-lab2',
          title: 'Weekly Challenge: Station Roster Reconciliation',
          type: 'python',
          language: 'python',
          practiceMode: 'guided-lesson',
          level: 'level-1',
          estimatedMinutes: 100,
          instructions:
            'MISSION NAME: Station Roster Reconciliation.\n\n' +
            'REAL-WORLD PROBLEM: Two environmental-monitoring networks rarely agree perfectly on which stations exist — one dataset might use a station\'s old ID, one might be missing a station the other has, and any analysis that joins them needs to know exactly where they overlap and where they diverge before trusting a single combined number.\n\n' +
            'SKILLS BEING TESTED: choosing the right collection type for each sub-task, dictionary-based record lookup, and set operations.\n\n' +
            'CONCEPTS YOU MUST APPLY: lists, tuples, dictionaries, sets, .get(), and list/set comprehensions.\n\n' +
            'OBJECTIVES (in order):\n' +
            '1. Given two lists of station records (each record a dict with "id", "name", and "lat_lon" as a tuple), build a dictionary keyed by station id mapping to the full record, for each network separately.\n' +
            '2. Using sets of the station ids, compute: which ids are in both networks, which are only in network A, and which are only in network B.\n' +
            '3. For every station id present in both networks, use .get() to safely compare the two networks\' recorded lat_lon tuples and flag any station where the coordinates differ by more than a small tolerance (treat this as a likely data-entry error, not a crash).\n' +
            '4. Build a single reconciled roster: a list of dicts, one per unique station id across both networks, preferring network A\'s data when a station exists in both.\n' +
            '5. Print a summary: total unique stations, how many were in both networks, how many were network-A-only, how many were network-B-only, and how many had a coordinate mismatch.\n\n' +
            'REQUIRED TOOLS: core Python only.\n\n' +
            'DATASET/API REQUIREMENTS: none; construct two small lists of station dict records yourself (at least 6 stations each, with deliberate overlaps, one-sided entries, and at least one coordinate mismatch) to exercise every code path.\n\n' +
            'DELIVERABLES: the dictionary-building code, the set-based reconciliation logic, the coordinate-mismatch check, and the printed summary.\n\n' +
            'CONSTRAINTS: you may not use any external library (no Pandas yet) — this challenge exists specifically to build the manual-reconciliation instincts that make Pandas\'s merge() function make sense later.\n\n' +
            'DIFFICULTY: intermediate.\n\n' +
            'EVALUATION RUBRIC: Correctness /35 (all three membership categories and the mismatch check are right), Collection choice /35 (dict for lookup, set for membership, not the reverse), Robustness /30 (a missing key never crashes the script).\n\n' +
            'COMMON MISTAKES TO AVOID: using nested for-loops to compare station lists instead of set operations; accessing dict[key] directly instead of dict.get(key); forgetting that comparing floating-point coordinates for exact equality is unreliable — use a tolerance, not ==.\n\n' +
            'BONUS OBJECTIVES: also detect and report duplicate station ids within a single network\'s own list, before doing any cross-network reconciliation.\n\n' +
            'REFLECTION QUESTIONS:\n' +
            '1. Why does this challenge forbid comparing the coordinate tuples with == directly?\n' +
            '2. Which single line of your solution would have been dramatically slower if you had used a list instead of a set — and why?\n' +
            '3. What would you need to add to this script if a "network" instead had 500,000 stations rather than 6?',
          objective: 'Reconcile two overlapping, imperfect station lists into one trustworthy roster using the correct collection for each sub-task.',
          starterCode: 'network_a = [\n    {"id": "S1", "name": "Alpha", "lat_lon": (14.7, -17.4)},\n    # TODO: add more records, including at least one overlap and one A-only\n]\n\nnetwork_b = [\n    {"id": "S1", "name": "Alpha", "lat_lon": (14.701, -17.401)},\n    # TODO: add more records, including at least one B-only and one coordinate mismatch\n]\n\n\ndef build_index(records):\n    """Return {station_id: record} for the given list of station dicts."""\n    # TODO\n    pass\n\n\ndef reconcile(index_a, index_b, tolerance=0.01):\n    """Return (both, only_a, only_b, mismatches, merged_roster)."""\n    # TODO\n    pass\n\n\n# TODO: call reconcile() and print the summary\n',
        },
        checklist: [
          'Choose list vs. tuple vs. dict vs. set correctly for a described data shape and justify it',
          'Use .get() with a default instead of direct key access on untrusted dictionaries',
          'Use set operations (union, intersection, difference) instead of nested loops for membership comparisons',
          'Write a list comprehension that both filters and transforms in one line',
          'Explain why comparing floating-point values needs a tolerance, not ==',
        ],
        misconceptions: [
          'Misconception: lists and tuples are basically interchangeable, and tuples are just "lists that can\'t change." Reality: the immutability of a tuple is a deliberate correctness guarantee for fixed-shape records, not an arbitrary restriction — using a tuple signals to every future reader of the code "this shape will never change," which a list cannot promise.',
          'Misconception: checking membership with "x in my_list" and "x in my_set" behave the same way, just with different syntax. Reality: they have very different performance characteristics — list membership is O(n) and can scan the entire list, while set membership is O(1) on average, a difference that becomes significant well before real dataset sizes are reached.',
          'Misconception: dict[key] and dict.get(key) are just two ways to write the same thing. Reality: dict[key] raises a KeyError and crashes the program if the key is missing; dict.get(key) returns None (or a supplied default) instead, which is almost always the safer choice when reading real, possibly-incomplete data.',
          'Misconception: two floating-point coordinates that "look the same" when printed are safe to compare with ==. Reality: floating-point arithmetic can introduce tiny representational differences invisible in printed output but real in memory, so numeric comparisons for approximate equality should always use a tolerance.',
        ],
        glossary: [
          { term: 'List', definition: 'An ordered, mutable, indexable sequence of items, the default choice for a growing or reorderable collection of values such as a column of readings.' },
          { term: 'Tuple', definition: 'An ordered, immutable sequence of items, the correct choice for a fixed-shape record whose order and contents should never change after creation.' },
          { term: 'Dictionary', definition: 'A mapping from unique, hashable keys to values with average O(1) lookup, the natural representation for a single labeled record or an ID-to-record lookup table.' },
          { term: 'Set', definition: 'An unordered collection of unique, hashable values supporting fast membership testing and mathematical set operations like union, intersection, and difference.' },
          { term: 'Hashable', definition: 'A value type that can be used as a dictionary key or set member because it has a stable hash value for its lifetime; lists are not hashable (and cannot be dict keys) precisely because they are mutable.' },
          { term: 'List comprehension', definition: 'A concise expression of the form [expr for item in iterable if condition] that builds a new list from an existing iterable in one line, replacing a manual loop-and-append pattern.' },
          { term: 'O(1) / O(n) (informal)', definition: 'Shorthand for how an operation\'s cost scales with data size: O(1) (constant time, like a set/dict lookup) stays fast regardless of size; O(n) (linear time, like a list scan) gets proportionally slower as the collection grows.' },
        ],
        readingQuestions: [
          'Why does choosing a tuple over a list for a fixed record communicate something meaningful to future readers of the code, beyond just being "read-only"?',
          'In what real data-cleaning situation would set operations be clearly the wrong tool, even though they are fast?',
          'Why does dict.get() with a default value matter more for real, messy data than for the clean toy examples used to teach it?',
        ],
        simpleExplanation:
          'Picture four different ways to organize the same pile of index cards. A list is like a stack of cards in a specific order that you can freely reorder, add to, or remove from — perfect for a running log of sensor readings as they come in. A tuple is like a single card that has been laminated: the information on it (say, a location\'s latitude and longitude) is fixed the moment it is created, and that permanence is the whole point, because you never want a coordinate pair to accidentally get reordered somewhere deep inside a long pipeline of code.\n\n' +
          'A dictionary is like a card catalog at a library: instead of flipping through every card in order to find the one you want, you look it up directly by its label — the "key" — and jump straight to the matching card. This is why looking something up in a dictionary stays fast even as the catalog grows to thousands of entries, while searching through an unsorted stack of loose cards (a list) gets slower and slower the bigger the stack gets.\n\n' +
          'A set is like a card catalog that only cares about one question: "do I have a card for this at all?" It throws away duplicates automatically and does not care about order, which sounds like it is throwing away useful information — until you realize that "which station IDs appear in both of these two datasets" is a question sets answer almost instantly, while doing the same comparison by hand, card by card, against every card in the other pile, would take forever once the piles get big. Picking the right one of these four tools for a given job is not a style preference; it is the difference between code that is easy to reason about and stays fast, and code that quietly gets slower and buggier as real data grows.',
        realWorldApplications: [
          { title: 'Deduplicating mailing or sensor-ID lists at a government agency', description: 'Public agencies merging station or address lists from multiple regional offices routinely hit exactly this reconciliation problem — overlapping records with slightly different formatting — and Python sets and dictionaries are the standard first-pass tool before anything heavier like a full database join.' },
          { title: 'JSON API responses parsed directly into nested dicts and lists', description: 'Nearly every public API (including open weather, environmental, and geographic data APIs) returns JSON, which Python\'s json module parses directly into nested dictionaries and lists — meaning the exact patterns in this topic (.get() for safe field access, list comprehensions for extracting a column of values) are the daily-driver tools for working with real API data.' },
          { title: 'Database primary-key lookups modeled with a Python dict cache', description: 'A common real-world performance pattern is loading a lookup table (e.g., station ID to station metadata) once into a Python dictionary in memory, so thousands of later lookups avoid hitting a slower database or file read each time — the same O(1)-lookup property this topic explains.' },
        ],
        primaryLecture: makeVerifiedVideo({
          id: 'nasa101-t2-lec',
          title: 'Python Tutorial for Beginners 4: Lists, Tuples, and Sets',
          institution: 'Corey Schafer',
          videoId: 'W8KRzm-HUcc',
          durationMinutes: 20,
          instructor: 'Corey Schafer',
        }),
        primaryText: {
          id: 'book-python-docs-datastructures',
          title: 'The Python Tutorial — Data Structures',
          authors: ['Python Software Foundation'],
          url: 'https://docs.python.org/3/tutorial/datastructures.html',
          canonicalUrl: 'https://docs.python.org/3/tutorial/datastructures.html',
          recommendedChapter: 'Section 5: Data Structures (lists, tuples, dictionaries, sets, comprehensions)',
          accessStatus: 'open-access',
          publisherOrInstitution: 'Python Software Foundation',
          deliveryMode: 'official-web-resource',
        },
      },
      {
        id: 'nasa101-t3',
        title: 'Control Flow, Functions & Modules for Data Pipelines',
        summary: 'Conditionals and loops as row-by-row decision logic, functions as testable and reusable transformation units, and modules as the way a pipeline stays organized past 50 lines.',
        objective: 'Write control-flow logic, pure functions, and simple modules that transform a real dataset predictably, and can be tested and reused independently of the script that calls them.',
        concepts: [
          'if/elif/else conditionals branch execution based on a boolean condition; in data work the most common use is per-row classification (is this reading valid, is this value above a threshold, which category does this row belong to), so writing correct, readable conditions is a core data-cleaning skill, not a toy syntax exercise.',
          'Truthiness in Python means every value has an implicit boolean interpretation in an if statement — 0, 0.0, "", [], {}, and None are all falsy, and everything else is truthy — which is convenient but a real source of bugs when a legitimate data value of 0 is silently treated the same as "missing."',
          'for loops iterate over a known collection (a list of rows, a range of years); while loops repeat based on a condition being true — choosing the wrong one (a while loop when a for loop would do) is a common source of accidental infinite loops in real code.',
          'A function groups reusable logic behind a name and a defined interface (its parameters and return value); the single biggest practical benefit for data work is that a function can be tested once, in isolation, on a handful of known inputs, instead of trusting that inline code buried inside a 200-line script behaves correctly.',
          'A pure function — one whose output depends only on its inputs, with no side effects on external state — is dramatically easier to test, reuse, and reason about than a function that silently reads or modifies a global variable; data-cleaning functions should default to pure unless there is a specific reason not to be.',
          'Default parameter values (def clean(value, missing_marker="N/A")) let a function have a sensible default behavior while still allowing a caller to override it for a dataset that uses a different missing-value convention, without needing two nearly-identical functions.',
          'A module is simply a .py file whose functions and variables can be imported into another file with import module_name or from module_name import function_name; splitting a data pipeline into a cleaning module, an analysis module, and a "main" script that calls both is the standard way real projects avoid becoming one unmaintainable file.',
          'The Python standard library (modules like csv, json, math, statistics, datetime) ships with Python and covers an enormous share of everyday data tasks before any third-party library like Pandas is needed — knowing what already exists in the standard library prevents reinventing (and re-bugging) code that Python already provides.',
        ],
        prerequisites: ['Data Structures: Lists, Tuples, Dictionaries & Sets'],
        researchPapers: [
          {
            id: 'paper-dijkstra-goto-1968',
            title: 'Go To Statement Considered Harmful',
            authors: ['Edsger W. Dijkstra'],
            year: 1968,
            venue: 'Communications of the ACM, vol. 11, no. 3',
            doiOrArxiv: '10.1145/362929.362947',
            openAccessUrl: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            canonicalUrl: 'https://dl.acm.org/doi/10.1145/362929.362947',
            paperType: 'seminal',
            difficulty: 'beginner',
            prerequisites: ['None'],
            summary: 'Dijkstra\'s famous short letter arguing that unrestricted jump (goto) statements make a program\'s execution paths too hard to reason about, and that structured constructs — sequencing, conditionals, and loops — should be preferred instead.',
            whyItMatters: 'This letter is the historical origin of exactly the structured control-flow style (if/elif/else, for, while, functions) this topic teaches; understanding why it was considered a big deal in 1968 explains why "just write clear, structured control flow" is not an arbitrary style rule but a hard-won lesson from early software\'s worst debugging nightmares.',
            sectionsToRead: 'The full letter (it is very short) — pay attention to the reasoning about program correctness and the difficulty of reasoning about arbitrary jumps.',
            readingQuestions: [
              'What specific difficulty does Dijkstra argue unrestricted goto statements create for reasoning about a program\'s correctness?',
              'How do Python\'s structured control-flow constructs (if/for/while/functions) directly reflect the alternative Dijkstra was arguing for?',
            ],
            relatedTopicIds: ['nasa101-t3'],
            accessStatus: 'open-access',
            deliveryMode: 'in-app-pdf-candidate',
          },
        ],
        exercise: {
          id: 'nasa101-t3-ex1',
          type: 'code-snippet',
          question: 'Write a pure function classify_reading(value, low=-10, high=45) that returns the string "invalid" if value is None, "low" if value < low, "high" if value > high, and "normal" otherwise. Explain, in one sentence, why this function being pure makes it easy to test.',
          explanation: 'def classify_reading(value, low=-10, high=45):\\n    if value is None:\\n        return "invalid"\\n    if value < low:\\n        return "low"\\n    if value > high:\\n        return "high"\\n    return "normal"\\nBecause the function only depends on its arguments and has no side effects, every possible case can be tested by calling it directly with a known input and checking the exact returned string, with no setup or hidden state required.',
        },
        additionalExercises: [
          { id: 'nasa101-t3-ex2', type: 'multiple-choice', question: 'Why is "if value:" a risky way to check whether a reading is present, if 0 is a legitimate recorded value in the dataset?', options: ['Python does not allow 0 in an if statement', 'Because 0 is falsy in Python, "if value:" treats a real reading of 0 the same as a missing value, silently dropping valid data', 'if statements only work with strings', 'This is actually always safe to use'], correctAnswer: 'Because 0 is falsy in Python, "if value:" treats a real reading of 0 the same as a missing value, silently dropping valid data', explanation: 'This is exactly the kind of truthiness bug that is invisible in casual testing (nobody tests "what if the temperature is exactly 0") and devastating in production. The fix is an explicit check like "if value is not None:", which correctly distinguishes a real 0 reading from a genuinely missing one.' },
          { id: 'nasa101-t3-ex3', type: 'free-response', question: 'A teammate writes a "cleaning function" that reads directly from a global variable named raw_data instead of accepting a parameter, and writes its result into another global variable named clean_data instead of returning it. Explain two concrete problems this causes.', explanation: 'First, the function cannot be tested in isolation — testing it requires first setting up the exact global raw_data state, and its result must be inspected via a second global rather than a direct return value, making unit tests awkward or impossible to write cleanly. Second, the function is not reusable: it can only ever operate on the one specific variable named raw_data, so processing a second dataset requires either renaming variables or duplicating the function, instead of simply calling the same function twice with different arguments.' },
          { id: 'nasa101-t3-ex4', type: 'multiple-choice', question: 'You need year, month, and day components from many date strings in a data pipeline. Which is the better first move?', options: ['Write your own date-parsing regular expression from scratch', 'Check whether Python\'s standard-library datetime module already solves this before writing custom parsing code', 'Store dates as three separate unrelated string fields permanently', 'Avoid working with dates entirely'], correctAnswer: 'Check whether Python\'s standard-library datetime module already solves this before writing custom parsing code', explanation: 'Date parsing has enormous numbers of edge cases (leap years, varying month lengths, different input formats) that the standard library\'s datetime module has already solved and tested extensively; writing a custom parser from scratch reinvents a solved problem and very likely reintroduces bugs the standard library no longer has.' },
        ],
        lab: {
          id: 'nasa101-lab3',
          title: 'Weekly Challenge: The Reusable Cleaning Toolkit',
          type: 'python',
          language: 'python',
          practiceMode: 'independent',
          level: 'level-2',
          estimatedMinutes: 110,
          instructions:
            'MISSION NAME: The Reusable Cleaning Toolkit.\n\n' +
            'REAL-WORLD PROBLEM: A one-off script that cleans one dataset, used once, is a dead end — real analysts and engineers reuse the same cleaning logic across many datasets over months or years, which only works if that logic lives in tested, importable functions rather than being copy-pasted and slightly modified each time.\n\n' +
            'SKILLS BEING TESTED: writing pure, testable functions; correct control-flow logic; organizing code into a reusable module.\n\n' +
            'CONCEPTS YOU MUST APPLY: if/elif/else, truthiness pitfalls, for loops, pure functions, default parameters, and modules.\n\n' +
            'OBJECTIVES (in order):\n' +
            '1. In a file named cleaning_tools.py, write a pure function classify_reading(value, low, high) as defined in this topic\'s exercise, with sensible default low/high values.\n' +
            '2. In the same file, write a pure function flag_outliers(readings, low, high) that takes a list of numeric readings and returns a list of (index, value, reason) tuples for every reading classified as "low" or "high" — do not modify the input list.\n' +
            '3. In the same file, write a pure function safe_average(readings) that computes the mean of only the readings that are not None, and returns None (not a crash) if the list is empty or entirely None.\n' +
            '4. In a second file (your main script), import cleaning_tools and use all three functions on a small sample dataset containing at least one None, one outlier, and several normal values.\n' +
            '5. Print a short report: how many readings were classified in each category, the list of flagged outliers with their reasons, and the safe average of the valid readings.\n\n' +
            'REQUIRED TOOLS: core Python only, split across two files (a module and a script that imports it).\n\n' +
            'DATASET/API REQUIREMENTS: none; build your own sample list of at least 10 numeric readings including at least one None and at least two outliers.\n\n' +
            'DELIVERABLES: cleaning_tools.py (the module) and a separate script that imports and uses it, plus the printed report.\n\n' +
            'CONSTRAINTS: none of the three functions in cleaning_tools.py may read or write a global variable — every input must arrive as a parameter, and every result must come back as a return value.\n\n' +
            'DIFFICULTY: intermediate.\n\n' +
            'EVALUATION RUBRIC: Purity /35 (zero global reads/writes inside the module\'s functions), Correctness /35 (outliers and average are computed correctly, None never crashes anything), Organization /30 (real module/import split, not one file).\n\n' +
            'COMMON MISTAKES TO AVOID: using "if value:" to check for missing data instead of "if value is not None:"; computing the average by summing all readings including None and crashing; putting the sample dataset inside the module file instead of the script that imports it.\n\n' +
            'BONUS OBJECTIVES: add a fourth function, readings_by_category(readings, low, high), that returns a dictionary mapping each category ("low", "normal", "high", "invalid") to a list of the readings in it.\n\n' +
            'REFLECTION QUESTIONS:\n' +
            '1. Why does keeping cleaning_tools.py free of any dataset-specific values make it more reusable across future projects?\n' +
            '2. Which of your three functions would be hardest to test if it were not pure, and why specifically?\n' +
            '3. What is one more cleaning function you can already predict you will want next week, once Pandas is introduced?',
          objective: 'Build a small, genuinely reusable, tested cleaning module split across two files, using only pure functions.',
          starterCode: '# --- cleaning_tools.py ---\ndef classify_reading(value, low=-10, high=45):\n    # TODO\n    pass\n\n\ndef flag_outliers(readings, low=-10, high=45):\n    # TODO: return list of (index, value, reason) tuples\n    pass\n\n\ndef safe_average(readings):\n    # TODO: average of non-None readings, or None if none are valid\n    pass\n\n\n# --- main script (separate file) ---\n# from cleaning_tools import classify_reading, flag_outliers, safe_average\n#\n# sample = [23.5, None, 100.0, 21.0, -50.0, 22.8, 24.1, None, 19.9, 23.0]\n# TODO: use the three functions and print the report\n',
        },
        checklist: [
          'Write an if/elif/else chain that correctly distinguishes missing (None) from a legitimate 0 or empty value',
          'Explain why "if value:" is a truthiness trap for real data with meaningful zero values',
          'Write a pure function with a default parameter and explain why purity matters for testability',
          'Split reusable logic into a module file and import it from a separate script',
          'Name at least one standard-library module relevant to a data-cleaning task',
        ],
        misconceptions: [
          'Misconception: "if value:" and "if value is not None:" are interchangeable ways to check for missing data. Reality: because 0, 0.0, and empty strings/collections are all falsy in Python, "if value:" silently discards legitimate zero or empty values along with genuinely missing ones — a bug that only shows up on real data, not on toy test cases.',
          'Misconception: a function that reads a global variable is fine as long as it "works." Reality: a function with hidden dependencies on global state cannot be tested in isolation, cannot be safely reused on a second dataset without side effects, and is far harder for a future reader (including your future self) to reason about — purity is a practical engineering property, not a stylistic preference.',
          'Misconception: splitting code into multiple files (modules) is only necessary for "big" professional projects. Reality: even a small weekly script benefits the moment its cleaning logic needs to be reused on a second file or tested independently — the module boundary is what makes both possible.',
          'Misconception: writing your own parsing/averaging/date logic from scratch shows more skill than using the standard library. Reality: the standard library\'s modules have already handled the edge cases (leap years, empty inputs, locale differences) that a from-scratch version usually misses; reusing tested code is the professional default, not a shortcut.',
        ],
        glossary: [
          { term: 'Truthiness', definition: 'The implicit boolean interpretation Python gives every value in a condition; 0, 0.0, "", [], {}, and None are falsy, everything else is truthy — a common source of bugs when a real zero value needs to be distinguished from missing data.' },
          { term: 'Pure function', definition: 'A function whose output depends only on its input arguments, with no reads or writes of external/global state — the property that makes a function easy to test and safely reusable.' },
          { term: 'Side effect', definition: 'Any change a function makes to state outside its own local scope (modifying a global variable, writing a file, printing output) beyond simply returning a value.' },
          { term: 'Default parameter', definition: 'A function parameter with a pre-set value used when the caller does not supply one explicitly, letting one function serve a common case and an overridden case without duplication.' },
          { term: 'Module', definition: 'A single .py file whose top-level functions, classes, and variables can be imported into another file with import or from ... import ...' },
          { term: 'Standard library', definition: 'The collection of modules that ship with Python itself (csv, json, math, statistics, datetime, and many more), usable without installing anything extra.' },
          { term: 'Unit test (informal)', definition: 'A small, isolated check that a specific function returns the expected output for a specific, known input — practical only when the function under test is pure.' },
        ],
        readingQuestions: [
          'Why does treating 0 as automatically "falsy" become dangerous specifically in a data-cleaning context, rather than in ordinary control-flow code?',
          'What concretely breaks, in terms of testing and reuse, when a function relies on a global variable instead of parameters and a return value?',
          'Why does splitting cleaning logic into its own module pay off even for a single-week project?',
        ],
        simpleExplanation:
          'Control flow is just your code making decisions the way you would while manually sorting a stack of papers: "if this number is below zero, put it in the low pile; if it is above some limit, put it in the high pile; otherwise, the normal pile." The one trap almost everyone falls into is that Python treats the number 0 as if it means "nothing here" in a plain if-check, the same way it treats an empty string or an empty list — which is completely wrong the moment 0 is a real, meaningful measurement (a temperature of exactly zero degrees is a valid reading, not a missing one), so data-cleaning code has to check "is this actually missing" explicitly, not just "is this falsy."\n\n' +
          'A function is a named, reusable recipe: you give it ingredients (its parameters), it does the same steps every time, and it hands back a result (its return value). The single most important property a data-cleaning function can have is being "pure" — meaning it only looks at the ingredients you handed it, and never secretly peeks at or changes anything else sitting around in the kitchen. A pure function is trustworthy in a very concrete way: you can test it completely by handing it a few known ingredients and checking the result, without needing to first set up the entire kitchen a specific way.\n\n' +
          'Once you have a handful of these trustworthy little recipes, a module is just the recipe book you put them in, so any other script can borrow them with one line (import cleaning_tools) instead of retyping them from memory every time. This is exactly how real, professional Python projects are organized: not as one giant script that does everything once, but as a small library of tested, reusable pieces that get imported wherever they are needed — a habit worth building in Week 1, long before a project gets big enough to force the issue.',
        realWorldApplications: [
          { title: 'The zero-versus-missing bug in real sensor and financial data', description: 'This exact truthiness trap is a well-documented, recurring real-world bug class: a temperature of 0°C, a bank balance of $0, or a rainfall reading of 0mm are all legitimate values that naive "if value:" checks silently treat as missing, corrupting downstream statistics without any visible error.' },
          { title: "NumPy and Pandas's own internal design choices around None/NaN", description: 'The distinction this topic teaches between "falsy" and "actually missing" is exactly why NumPy and Pandas introduce their own explicit missing-value markers (NaN, pd.NA) rather than relying on Python\'s built-in None and truthiness rules — a design decision Week 2 of this course builds on directly.' },
          { title: 'Standard software engineering practice of splitting scripts into importable modules', description: 'Every production Python codebase — from a small internal tool to a large open-source library like Pandas itself — is organized as a collection of importable modules with pure, testable functions, precisely so logic can be reused and verified independently, exactly the discipline this topic\'s lab practices at a small scale.' },
        ],
        primaryLecture: makeVerifiedVideo({
          id: 'nasa101-t3-lec',
          title: 'Python Tutorial for Beginners 8: Functions',
          institution: 'Corey Schafer',
          videoId: '9Os0o3wzS_I',
          durationMinutes: 14,
          instructor: 'Corey Schafer',
        }),
        primaryText: {
          id: 'book-python-docs-controlflow',
          title: 'The Python Tutorial — More Control Flow Tools',
          authors: ['Python Software Foundation'],
          url: 'https://docs.python.org/3/tutorial/controlflow.html',
          canonicalUrl: 'https://docs.python.org/3/tutorial/controlflow.html',
          recommendedChapter: 'Section 4: More Control Flow Tools (if, for, functions, default arguments); Section 6: Modules',
          accessStatus: 'open-access',
          publisherOrInstitution: 'Python Software Foundation',
          deliveryMode: 'official-web-resource',
        },
      },
      {
        id: 'nasa101-t4',
        title: 'Exceptions, Files, Virtual Environments & Light OOP',
        summary: 'Handling bad data without crashing, reading and writing real files safely, isolating project dependencies, and reaching for a class only once a plain dict genuinely stops being enough.',
        objective: 'Write scripts that read and write real files safely, fail gracefully on malformed data using targeted exception handling, keep project dependencies isolated in a virtual environment, and represent a data record as a class when that is the clearer design.',
        concepts: [
          'An exception is Python\'s mechanism for signaling that something went wrong at runtime (a missing file, a malformed number, a missing dictionary key); a try/except block lets you catch a specific, anticipated failure and recover, instead of letting the entire program crash on one bad row out of thousands.',
          'Catching a specific exception type (except ValueError:) rather than a bare except: is essential in real code — a bare except silently swallows every error, including genuine bugs in your own code, making them far harder to find later.',
          'The with statement (a context manager) guarantees a file is properly closed even if an error occurs while reading or writing it — with open("file.csv") as f: is the correct, idiomatic way to work with files in Python, not a stylistic preference over manually calling f.close().',
          'Reading a real file line-by-line or with the csv module is the foundation every higher-level tool (Pandas included) is ultimately built on; understanding this layer explains why Pandas behaves the way it does when a real CSV file has a malformed row.',
          'A virtual environment (venv) is an isolated Python installation with its own independently installed packages, created so that one project\'s dependencies (and their exact versions) never silently conflict with another project\'s — without one, "it works on my machine" becomes a permanent, unfixable problem.',
          'A class is a template for creating objects that bundle related data (attributes) and behavior (methods) together; the concrete signal that a plain dictionary has stopped being enough is when the same handful of fields keep traveling together everywhere and the same validation or computed-value logic keeps getting copy-pasted next to them.',
          'The __init__ method runs automatically when a class is instantiated and is where you validate and set an object\'s starting attributes — putting validation here (reject an impossible temperature at creation time) is what stops invalid data from ever entering a program\'s data model in the first place.',
          'Choosing a class over a dictionary is a design decision, not an upgrade: a dict is simpler, more flexible, and perfectly correct for most rows of data; a class earns its extra structure specifically when a record needs guaranteed fields, built-in validation, or attached behavior (a compute_anomaly() method, for instance) that a plain dict cannot express directly.',
        ],
        prerequisites: ['Control Flow, Functions & Modules for Data Pipelines'],
        researchPapers: [
          {
            id: 'paper-kay-early-history-smalltalk-1993',
            title: 'The Early History of Smalltalk',
            authors: ['Alan C. Kay'],
            year: 1993,
            venue: 'ACM SIGPLAN Notices — Proceedings of the Second ACM SIGPLAN History of Programming Languages Conference (HOPL-II)',
            doiOrArxiv: '10.1145/155360.155364',
            openAccessUrl: 'https://worrydream.com/EarlyHistoryOfSmalltalk/',
            canonicalUrl: 'https://dl.acm.org/doi/10.1145/155360.155364',
            paperType: 'historical',
            difficulty: 'intermediate',
            prerequisites: ['None'],
            summary: 'Alan Kay\'s own account of how object-oriented programming and the Smalltalk language emerged from 1960s and 70s research, including the original motivation for bundling data and behavior together as "objects."',
            whyItMatters: 'Gives the original reasoning behind object-oriented programming directly from one of its inventors, which is exactly the design idea this topic\'s class-and-validation pattern is a small, practical application of — reaching for a class only once data and its behavior genuinely belong together.',
            sectionsToRead: 'The early sections on the original motivation for objects and message-passing, before the detailed Smalltalk implementation history.',
            readingQuestions: [
              'What core idea did Kay describe as the original motivation for bundling data and behavior together as an "object"?',
              'How does this topic\'s guidance on "when to reach for a class" reflect that same original motivation, at a much smaller scale?',
            ],
            relatedTopicIds: ['nasa101-t4'],
            accessStatus: 'open-access',
            deliveryMode: 'official-web-resource',
          },
        ],
        exercise: {
          id: 'nasa101-t4-ex1',
          type: 'code-snippet',
          question: 'Write a function load_readings(path) that opens a CSV-like text file (one number per line) using a with block, converts each line to a float, and skips (without crashing) any line that cannot be converted, printing a warning for each skipped line.',
          explanation: 'def load_readings(path):\\n    readings = []\\n    with open(path) as f:\\n        for line_number, line in enumerate(f, start=1):\\n            try:\\n                readings.append(float(line.strip()))\\n            except ValueError:\\n                print(f"Skipping unparseable line {line_number}: {line.strip()!r}")\\n    return readings\\nThe with block guarantees the file closes properly even if an exception occurs partway through, and catching ValueError specifically (not a bare except) means a genuine bug elsewhere in the function would still surface as a real crash instead of being silently hidden.',
        },
        additionalExercises: [
          { id: 'nasa101-t4-ex2', type: 'multiple-choice', question: 'Why is "except:" (a bare except, with no specified exception type) generally considered bad practice in real code?', options: ['It is slower than catching a specific exception', 'It catches every possible error, including genuine bugs unrelated to the situation you meant to handle, hiding them instead of surfacing them', 'Python does not actually allow bare except clauses', 'It only works inside a class definition'], correctAnswer: 'It catches every possible error, including genuine bugs unrelated to the situation you meant to handle, hiding them instead of surfacing them', explanation: 'A bare except: silently catches everything — a malformed data row, a typo in your own variable name, a totally unrelated crash — all treated identically. Catching a specific exception type communicates exactly what failure you anticipated and expected to handle, and lets truly unexpected errors surface loudly, where they can actually be found and fixed.' },
          { id: 'nasa101-t4-ex3', type: 'free-response', question: 'Two teammates are collaborating on a data project. One has pandas version 1.5 installed globally on their machine; the other installed pandas version 2.1 globally on theirs. Explain how a virtual environment, defined per project, would have prevented the bugs this mismatch is about to cause.', explanation: 'Without a virtual environment, each teammate\'s code runs against whatever version happens to be installed globally on their own machine, and different major versions of a library can have different behavior or removed features, causing code that works for one teammate to break for the other with no visible cause in the shared code itself. A project-specific virtual environment with a pinned, shared list of exact dependency versions (e.g. in a requirements.txt) ensures both teammates — and any future environment the code runs in — use the identical, tested library versions.' },
          { id: 'nasa101-t4-ex4', type: 'multiple-choice', question: 'A dictionary {"station": "S1", "temp_c": 23.5} is being passed around a growing codebase, and five different functions each independently re-implement the same "is this temperature physically plausible" check. What does this pattern suggest?', options: ['Nothing is wrong; this is normal Python style', 'This is a signal that a Reading class with the validation built into __init__ (or a dedicated method) would remove the duplicated logic and guarantee the check always runs', 'The dictionary should be converted to a tuple instead', 'The five functions should be merged into one giant function'], correctAnswer: 'This is a signal that a Reading class with the validation built into __init__ (or a dedicated method) would remove the duplicated logic and guarantee the check always runs', explanation: 'Repeated, copy-pasted validation logic scattered across many functions is exactly the signal this topic describes for reaching for a class: bundling the data and its validation together in one place means the check happens automatically and consistently every time a Reading is created, instead of depending on every future function remembering to re-implement it correctly.' },
        ],
        lab: {
          id: 'nasa101-lab4',
          title: 'Weekly Challenge: The Fault-Tolerant File Loader',
          type: 'python',
          language: 'python',
          practiceMode: 'independent',
          level: 'level-2',
          estimatedMinutes: 110,
          instructions:
            'MISSION NAME: The Fault-Tolerant File Loader.\n\n' +
            'REAL-WORLD PROBLEM: Real files handed to a data pipeline are frequently incomplete, malformed, or simply missing — a script that crashes on the first bad line of a 50,000-line file, instead of skipping it and reporting it, is not production-usable no matter how correct its math is.\n\n' +
            'SKILLS BEING TESTED: targeted exception handling, safe file I/O with context managers, environment isolation reasoning, and deciding when a class is the right tool.\n\n' +
            'CONCEPTS YOU MUST APPLY: try/except with specific exception types, the with statement, virtual environments, classes, and __init__ validation.\n\n' +
            'OBJECTIVES (in order):\n' +
            '1. Create a small text file (by hand or generated by your script) with one reading per line as "station_id,temperature", including at least one line with a missing field, one with a non-numeric temperature, and several valid lines.\n' +
            '2. Write a Reading class whose __init__ takes station_id and temperature, validates that temperature is a number between -90 and 60 (the extreme real range of recorded Earth surface temperatures), and raises a ValueError with a clear message if not.\n' +
            '3. Write a function load_readings(path) that opens the file with a with block, and for each line, attempts to parse and construct a Reading; catches both malformed-line errors and the Reading class\'s own ValueError, logging (printing) a specific reason for each skipped line without stopping the loop.\n' +
            '4. Return a list of successfully constructed Reading objects, along with a count of how many lines were skipped and why.\n' +
            '5. In a short comment or docstring, explain in your own words what problem a virtual environment would solve for this script if it depended on a third-party library, even though this particular script only uses the standard library.\n\n' +
            'REQUIRED TOOLS: core Python only (this challenge intentionally has no third-party dependency, to isolate the venv concept as reasoning, not a required command here).\n\n' +
            'DATASET/API REQUIREMENTS: none; the file is self-authored as described above.\n\n' +
            'DELIVERABLES: the Reading class, the load_readings function, the sample data file, and the printed skip report.\n\n' +
            'CONSTRAINTS: the loader must never crash on a malformed line — every failure must be caught, specifically, and reported, and the loop must continue.\n\n' +
            'DIFFICULTY: intermediate.\n\n' +
            'EVALUATION RUBRIC: Robustness /35 (genuinely never crashes on any malformed input you can construct), Correctness /35 (valid readings are loaded correctly, invalid ones are rejected with the right reason), Design /30 (validation lives in __init__, not duplicated in the loader).\n\n' +
            'COMMON MISTAKES TO AVOID: using a bare except: instead of catching specific exception types; opening the file without a with block; putting the temperature-range validation in the loader function instead of inside the Reading class, which would let an invalid Reading be constructed elsewhere in the codebase without the check ever running.\n\n' +
            'BONUS OBJECTIVES: add a __repr__ method to Reading so printing a list of them produces a readable summary instead of Python\'s default object address.\n\n' +
            'REFLECTION QUESTIONS:\n' +
            '1. Why does putting the temperature validation inside Reading.__init__, rather than in load_readings, make the validation more reliable going forward?\n' +
            '2. What specifically would go wrong if this loader used a bare except: instead of catching ValueError specifically?\n' +
            '3. You are about to start Week 2, where this same loading job gets handed to Pandas in one line. What do you now understand about what that one line is actually doing underneath?',
          objective: 'Build a file loader that never crashes on malformed input, using targeted exception handling and a validating class.',
          starterCode: 'class Reading:\n    def __init__(self, station_id, temperature):\n        # TODO: validate temperature is a number in [-90, 60]; raise ValueError if not\n        self.station_id = station_id\n        self.temperature = temperature\n\n\ndef load_readings(path):\n    """Return (list_of_Reading, skipped_count, skip_reasons)."""\n    readings = []\n    skipped = 0\n    reasons = []\n    # TODO: open the file with a `with` block, parse each line, catch and log failures\n    return readings, skipped, reasons\n\n\n# TODO: write a small sample file, call load_readings(), and print the report\n',
        },
        checklist: [
          'Catch a specific exception type instead of using a bare except',
          'Open and read a file using a with block, and explain what guarantee that provides',
          'Explain what problem a virtual environment solves and why it matters for a team, not just an individual',
          'Write a class whose __init__ validates its own data before accepting it',
          'Explain the concrete signal that indicates a dict should become a class',
        ],
        misconceptions: [
          'Misconception: catching every possible error with a bare except: is the safest way to make a script never crash. Reality: a bare except also hides genuine bugs in your own code — the goal is to anticipate and handle specific, expected failure modes while letting truly unexpected errors surface where they can be found and fixed.',
          'Misconception: manually calling f.close() after reading a file is equivalent to using a with block. Reality: if an exception is raised between opening the file and the manual close() call, the file is never closed; a with block guarantees the file closes in every case, including when an error occurs.',
          'Misconception: virtual environments only matter for "big" team projects, not a solo weekly challenge. Reality: even a solo project benefits the moment you install a second project\'s dependencies on the same machine — without isolation, upgrading one project\'s library can silently break another project that was never touched.',
          'Misconception: switching from a dict to a class is always "more professional" and should be done as early as possible. Reality: a dict is often the simpler, entirely correct choice; reaching for a class before there is a genuine reason (repeated validation logic, guaranteed fields, attached behavior) adds structure and ceremony without adding real value.',
        ],
        glossary: [
          { term: 'Exception', definition: 'An object Python raises to signal a runtime error; a try/except block lets you catch a specific exception type and recover instead of letting the whole program crash.' },
          { term: 'try / except', definition: 'The Python construct for attempting a risky operation (try) and handling a specific anticipated failure (except SpecificError:) without stopping the entire program.' },
          { term: 'Bare except', definition: 'An except: clause with no specified exception type, which catches every possible error indiscriminately — generally discouraged because it also hides genuine, unrelated bugs.' },
          { term: 'Context manager / with statement', definition: 'A Python construct (most commonly with open(...) as f:) that guarantees a resource like a file is properly released even if an error occurs while it is being used.' },
          { term: 'Virtual environment (venv)', definition: 'An isolated Python installation with its own independently installed package versions, created per project so dependencies never silently conflict across different projects.' },
          { term: 'Class', definition: 'A template for creating objects that bundle related data (attributes) and behavior (methods) together, instantiated by calling the class like a function.' },
          { term: '__init__', definition: 'The method that runs automatically when a class is instantiated, conventionally used to validate inputs and set an object\'s starting attribute values.' },
        ],
        readingQuestions: [
          'Why does catching a specific exception type communicate something meaningful that a bare except: cannot?',
          'What real, concrete failure does a virtual environment prevent that "just installing what you need" does not?',
          'What is the specific signal that a plain dictionary should be replaced by a class, according to this topic?',
        ],
        simpleExplanation:
          'A try/except block is like reaching into a bag of mixed hardware, expecting most items to be screws, but being specifically ready for the occasional bent nail. try is you reaching in; except ValueError is you specifically saying "if what I pull out is not a usable screw, set it aside and keep going" — instead of the whole job stopping the moment one bent nail shows up. A bare except is the equivalent of saying "set aside anything at all that seems wrong," which also quietly sets aside a genuinely different problem, like your hand slipping, that you actually needed to notice and fix.\n\n' +
          'The with statement is a promise: "whatever happens while I am using this file, close it properly when I am done, even if something goes wrong halfway through." Without it, an error partway through reading a file can leave that file open and locked, which is exactly the kind of subtle bug that seems to work fine in quick testing and then causes strange failures later. A virtual environment solves a related but different problem: it is like giving every project its own separate toolbox instead of one shared toolbox for your whole computer, so upgrading a tool for one project can never accidentally break a completely different project that happened to be using an older version of the same tool.\n\n' +
          'A class is what you reach for once a plain dictionary starts feeling cramped — specifically, once you notice the same handful of fields traveling around together everywhere, and the same "is this actually valid" check getting copy-pasted next to them in five different places. Building that validation once, into the class\'s __init__, means it is impossible to accidentally create an invalid record anywhere in the whole program, because the check runs automatically, every single time, the moment the object is born — which is a much stronger guarantee than hoping every future piece of code remembers to check by hand.',
        realWorldApplications: [
          { title: 'Production ETL pipelines that log-and-skip bad rows instead of crashing', description: 'Real data-engineering pipelines processing millions of rows overnight are built specifically to catch and log malformed individual rows and keep running, because a pipeline that halts entirely on the first bad row out of a million is operationally unusable — exactly the pattern this topic\'s lab practices at a small scale.' },
          { title: 'requirements.txt / pyproject.toml files in virtually every real Python project on GitHub', description: 'Every serious open-source or team Python project pins its exact dependency versions and expects contributors to install them inside a project-specific virtual environment, precisely to prevent the "works on my machine" version-mismatch bugs this topic describes.' },
          { title: 'Pydantic and dataclasses in real-world Python codebases', description: 'The pattern of validating data at the moment an object is constructed — this topic\'s Reading.__init__ — is exactly what popular real-world Python libraries like Pydantic and the standard library\'s own dataclasses are built to formalize and extend for larger production data models.' },
        ],
        primaryLecture: makeVerifiedVideo({
          id: 'nasa101-t4-lec',
          title: 'Python OOP Tutorial 1: Classes and Instances',
          institution: 'Corey Schafer',
          videoId: 'ZDa-Z5JzLYM',
          durationMinutes: 15,
          instructor: 'Corey Schafer',
        }),
        primaryText: {
          id: 'book-python-docs-errors-classes',
          title: 'The Python Tutorial — Errors and Exceptions; Classes',
          authors: ['Python Software Foundation'],
          url: 'https://docs.python.org/3/tutorial/errors.html',
          canonicalUrl: 'https://docs.python.org/3/tutorial/errors.html',
          recommendedChapter: 'Section 8: Errors and Exceptions; Section 9: Classes; "Virtual Environments and Packages"',
          accessStatus: 'open-access',
          publisherOrInstitution: 'Python Software Foundation',
          deliveryMode: 'official-web-resource',
        },
      },
    ],
    project: {
      title: 'Dataset Profiler CLI Tool',
      description:
        'A single Python script (no Pandas, standard library only) that takes the path to a real messy text/CSV file, safely loads and validates it using the Reading-style class and exception patterns from this week, and prints a data-readiness profile: row count, missing/invalid-row count with reasons, min/max/average of the valid values, and a list of any flagged outliers.',
      constraints: [
        'Standard library only — no third-party packages (Pandas arrives in Week 2)',
        'Must never crash on malformed input; every failure must be caught, counted, and reported',
        'Must be split across at least one reusable module file and one runnable script file',
      ],
      expectedDeliverables: [
        'A cleaning/validation module with pure, tested functions and at least one validating class',
        'A runnable script that loads a real file and prints the data-readiness profile',
        'A short written note on which rows were rejected and why',
      ],
      evaluationRubric: [
        { criterion: 'Technical Execution', weight: '35%', description: 'Correct, robust code that never crashes on malformed input and produces an accurate profile.' },
        { criterion: 'Data & Statistical Understanding', weight: '25%', description: 'Sensible validation thresholds and a profile that actually communicates the data\'s quality and shape.' },
        { criterion: 'Creativity', weight: '15%', description: 'Thoughtful extra checks or profile fields beyond the stated minimum.' },
        { criterion: 'Real-World Impact', weight: '15%', description: 'The profile would genuinely help a real analyst decide whether this file is safe to use.' },
        { criterion: 'Presentation', weight: '10%', description: 'Clear, readable printed output and code organization.' },
      ],
    },
  },
  {
    id: 'nasa-102',
    code: 'NASA 102',
    title: 'NASA Space Apps Prep: Data Analysis, Statistics & Visualization',
    description:
      'Week 2 of the NASA Space Apps Challenge 2026 Prep track (Phase 1: Data Foundation). NumPy arrays, Pandas DataFrames, real-world data cleaning (missing values, duplicates, filtering, grouping, aggregation), core descriptive statistics and correlation, time-series basics, and Matplotlib visualization — culminating in the Earth Data Explorer mini-project, a genuine end-to-end analysis of a real, freely downloadable environmental dataset.',
    estimatedHours: 26,
    difficulty: 'intermediate',
    prerequisiteCourseIds: ['nasa-101'],
    learningOutcomes: [
      'Use NumPy arrays and vectorized operations to work with numeric data faster and more reliably than plain Python loops',
      'Load, clean (missing values, duplicates, filtering), and aggregate real tabular data with Pandas DataFrames',
      'Compute and correctly interpret core descriptive statistics, correlation, and basic time-series trends on real data',
      'Build clear, honest Matplotlib visualizations, and complete an end-to-end analysis of a real environmental dataset that finds and explains a genuine pattern',
    ],
    topics: [
      {
        id: 'nasa102-t1',
        title: 'NumPy Foundations for Numerical Array Data',
        summary: 'Why arrays beat lists for numeric data — vectorized operations, broadcasting, and the array-shape thinking that Pandas is built on top of.',
        objective: 'Represent and manipulate numeric data as NumPy arrays, use vectorized operations instead of manual loops, and reason correctly about array shapes and broadcasting.',
        concepts: [
          'A NumPy array (ndarray) is a fixed-type, fixed-shape, contiguous block of numeric data in memory — unlike a Python list, every element is guaranteed to be the same type, which is exactly what allows NumPy to process the whole array in fast, compiled code instead of a slow, interpreted Python loop.',
          'Vectorized operations apply an operation to every element of an array at once (array * 1.8 + 32 converts an entire array of Celsius readings to Fahrenheit in one expression) — this is not just shorter to write than a for loop, it runs substantially faster because the looping happens in optimized C code, not the Python interpreter.',
          'An array\'s shape describes its dimensions as a tuple, e.g. (12,) for 12 monthly values or (10, 12) for 10 years by 12 months; reasoning correctly about shape is the single most important NumPy skill, since the majority of real NumPy errors are shape mismatches, not logic errors.',
          'Broadcasting is NumPy\'s rule for applying an operation between arrays of different (but compatible) shapes without writing an explicit loop — e.g. subtracting a single (12,) array of monthly averages from a (10, 12) array of ten years of data, applied automatically to every year; broadcasting rules are precise, not magic, and violating them raises a clear shape-mismatch error rather than silently doing the wrong thing.',
          'Boolean indexing (array[array > threshold]) selects only the elements matching a condition in one expression, and is the vectorized replacement for a manual filtering loop — the same "filter the data" task from Week 1\'s list comprehensions, now applied to numeric arrays at speed.',
          'NumPy represents a missing numeric value as np.nan (Not a Number), a special floating-point value with the surprising property that np.nan == np.nan evaluates to False — which is precisely why checking for missing data uses np.isnan(value) instead of a direct equality comparison.',
          'Aggregation functions (array.mean(), array.sum(), array.std(), array.min(), array.max()) reduce an array to a single summary number, and most accept an axis argument to aggregate along just one dimension of a multi-dimensional array (e.g. the average across years for each month, versus the average across months for each year).',
          'NumPy is the numeric foundation Pandas is built on top of — every Pandas DataFrame column is, underneath, backed by a NumPy array, which is why understanding array shape, vectorization, and NaN handling here makes every subsequent Pandas topic in this course click faster.',
        ],
        prerequisites: ['Exceptions, Files, Virtual Environments & Light OOP'],
        researchPapers: [
          {
            id: 'paper-harris-numpy-2020',
            title: 'Array Programming with NumPy',
            authors: ['Charles R. Harris', 'K. Jarrod Millman', 'Stéfan J. van der Walt', 'Ralf Gommers', 'et al.'],
            year: 2020,
            venue: 'Nature, vol. 585',
            doiOrArxiv: 'arXiv:2006.10256',
            openAccessUrl: 'https://arxiv.org/pdf/2006.10256',
            canonicalUrl: 'https://www.nature.com/articles/s41586-020-2649-2',
            paperType: 'applied',
            difficulty: 'intermediate',
            prerequisites: ['Basic Python programming'],
            summary: 'The official NumPy project paper, written by its core development team, describing array programming — vectorized operations, broadcasting, and the ndarray data structure — as the foundation of the modern Python scientific computing ecosystem.',
            whyItMatters: 'Written by the people who built the exact vectorization and broadcasting behavior this topic teaches; explains why NumPy became the shared numerical foundation nearly every other data and scientific Python library, including Pandas, is built on top of.',
            sectionsToRead: 'Introduction; the section on array programming and broadcasting.',
            readingQuestions: [
              'What does the paper identify as the key advantage of vectorized array operations over explicit Python loops?',
              'How does the paper describe NumPy\'s role as a foundation for the rest of the scientific Python ecosystem, including Pandas?',
            ],
            relatedTopicIds: ['nasa102-t1'],
            accessStatus: 'open-access',
            deliveryMode: 'in-app-pdf-candidate',
          },
        ],
        exercise: {
          id: 'nasa102-t1-ex1',
          type: 'code-snippet',
          question: 'Given a NumPy array monthly_c of 12 average monthly temperatures in Celsius, write one vectorized expression (no loop) that returns a boolean array flagging every month above 30°C, and a second expression that returns the actual Fahrenheit values for just those months.',
          explanation: 'hot_months = monthly_c > 30 creates a boolean array in one vectorized comparison. monthly_c[hot_months] * 1.8 + 32 then uses boolean indexing to select only the flagged months and converts them to Fahrenheit, all without writing an explicit for loop — this is the core NumPy pattern of combining a vectorized condition with boolean indexing.',
        },
        additionalExercises: [
          { id: 'nasa102-t1-ex2', type: 'multiple-choice', question: 'Why does np.nan == np.nan evaluate to False in Python/NumPy?', options: ['This is a bug in NumPy that will eventually be fixed', 'NaN is defined by the IEEE floating-point standard to never equal anything, including itself, which is precisely why np.isnan() exists as the correct way to check for it', 'NumPy arrays cannot contain NaN values at all', 'It only evaluates to False the first time; subsequent comparisons return True'], correctAnswer: 'NaN is defined by the IEEE floating-point standard to never equal anything, including itself, which is precisely why np.isnan() exists as the correct way to check for it', explanation: 'This is standard, intentional floating-point behavior (not a NumPy quirk), and it is exactly why code that checks "is this value missing" with == nan is a well-known real bug — the correct check is always np.isnan(value) or, in Pandas, pd.isna(value).' },
          { id: 'nasa102-t1-ex3', type: 'free-response', question: 'A NumPy operation between a (10, 12) array and a (12,) array succeeds and applies the smaller array to every row, but the same operation between a (10, 12) array and a (10,) array raises a shape-mismatch error. Explain why, referring to NumPy\'s broadcasting rule.', explanation: 'NumPy\'s broadcasting rule compares shapes from the trailing (rightmost) dimension: a (12,) array aligns with the trailing dimension of (10, 12) — both are 12 — so it broadcasts across the other dimension automatically. A (10,) array does not align with the trailing dimension (12) of (10, 12), so NumPy cannot determine a consistent way to apply it and raises an error rather than guessing. Reshaping the (10,) array to (10, 1) would instead align it with the leading dimension and broadcast correctly across columns.' },
          { id: 'nasa102-t1-ex4', type: 'multiple-choice', question: 'Why is a vectorized NumPy operation typically much faster than the equivalent Python for loop over a list, for large numeric data?', options: ['NumPy secretly runs on a different, faster computer', 'The loop over array elements happens in optimized, compiled C code inside NumPy, instead of the slower Python interpreter evaluating one element at a time', 'Vectorized operations use less memory, which is the only reason they are faster', 'There is no real performance difference for realistic dataset sizes'], correctAnswer: 'The loop over array elements happens in optimized, compiled C code inside NumPy, instead of the slower Python interpreter evaluating one element at a time', explanation: 'A Python for loop pays the overhead of the Python interpreter on every single iteration; a vectorized NumPy operation hands the entire loop off to pre-compiled C code that processes the whole array in one call, which is why the same logical operation can be an order of magnitude (or more) faster at real dataset sizes.' },
        ],
        lab: {
          id: 'nasa102-lab1',
          title: 'Weekly Challenge: Ten Years of Monthly Anomalies',
          type: 'python',
          language: 'python',
          practiceMode: 'guided-lesson',
          level: 'level-2',
          estimatedMinutes: 100,
          instructions:
            'MISSION NAME: Ten Years of Monthly Anomalies.\n\n' +
            'REAL-WORLD PROBLEM: Climate and environmental scientists constantly work with exactly this shape of data — many years, each broken into 12 months — and the first real analytical question is almost always "how does each month compare to its own typical average," which is a broadcasting problem, not a looping problem.\n\n' +
            'SKILLS BEING TESTED: array construction, shape reasoning, vectorized arithmetic, broadcasting, boolean indexing, and axis-aware aggregation.\n\n' +
            'CONCEPTS YOU MUST APPLY: NumPy arrays, shape, vectorized operations, broadcasting, boolean indexing, np.nan/np.isnan, and axis-based aggregation.\n\n' +
            'OBJECTIVES (in order):\n' +
            '1. Construct a NumPy array of shape (10, 12) representing 10 years of synthetic monthly average temperatures (you may generate these with a mix of a base seasonal pattern plus small random noise, or type in your own plausible numbers) and deliberately set at least 2 values to np.nan to represent missing months.\n' +
            '2. Compute the per-month climatological average across all 10 years (a (12,) array), correctly ignoring the NaN values (research and use np.nanmean with the correct axis, not np.mean).\n' +
            '3. Use broadcasting to compute a (10, 12) array of anomalies: each month\'s value minus that month\'s climatological average.\n' +
            '4. Use boolean indexing to find and print every (year, month) anomaly greater than +2 degrees or less than -2 degrees — a simple but genuine "unusual month" detector.\n' +
            '5. Compute and print the single year with the highest average anomaly across its 12 months, again correctly ignoring any NaN values.\n\n' +
            'REQUIRED TOOLS: NumPy only.\n\n' +
            'DATASET/API REQUIREMENTS: none; synthetic data constructed as described.\n\n' +
            'DELIVERABLES: the array construction code, the climatology and anomaly computation, the unusual-month detector, and the highest-anomaly-year result.\n\n' +
            'CONSTRAINTS: you may not use a Python for loop anywhere in your anomaly, detection, or aggregation logic — every one of those steps must be a vectorized NumPy expression.\n\n' +
            'DIFFICULTY: intermediate.\n\n' +
            'EVALUATION RUBRIC: Correctness /35 (anomalies and detections are mathematically right), NaN handling /30 (NaN values never silently corrupt an average), Vectorization /35 (genuinely no manual loops in the required logic).\n\n' +
            'COMMON MISTAKES TO AVOID: using np.mean instead of np.nanmean and getting NaN as the result of an entire average because of just one missing value; forgetting to specify axis=0 versus axis=1 and averaging across the wrong dimension; comparing values to np.nan directly with == instead of using np.isnan().\n\n' +
            'BONUS OBJECTIVES: also compute the standard deviation of each month\'s anomalies across the 10 years, to see which calendar month is the most variable one.\n\n' +
            'REFLECTION QUESTIONS:\n' +
            '1. What would have silently gone wrong in your climatology calculation if you had used np.mean instead of np.nanmean?\n' +
            '2. Which axis argument corresponds to "average across years for each month," and which corresponds to "average across months for each year" — and how did you verify you had it right?\n' +
            '3. Why does broadcasting a (12,) array against a (10, 12) array make sense conceptually, not just syntactically?',
          objective: 'Compute per-month climatological anomalies over a 10-year synthetic dataset using only vectorized NumPy operations, correctly handling missing values.',
          starterCode: 'import numpy as np\n\n# TODO: build a (10, 12) array of synthetic monthly temperatures with at least 2 np.nan values\nmonthly_data = None\n\n# TODO: climatology = per-month average across all 10 years (ignore NaN)\nclimatology = None\n\n# TODO: anomalies = monthly_data minus climatology, via broadcasting\nanomalies = None\n\n# TODO: find and print all (year, month) anomalies beyond +/- 2 degrees\n\n# TODO: find and print the year with the highest average anomaly (ignore NaN)\n',
        },
        checklist: [
          'Explain why NumPy arrays are faster than Python lists for numeric operations',
          'Write a vectorized expression instead of a manual for loop for an elementwise operation',
          'Correctly reason about array shape and predict whether a broadcast will succeed',
          'Use boolean indexing to filter an array by a condition',
          'Use np.isnan()/np.nanmean() correctly instead of == or plain mean() on data with missing values',
        ],
        misconceptions: [
          'Misconception: NumPy arrays are basically just Python lists with extra methods. Reality: arrays are fixed-type and contiguous in memory, which is precisely what allows vectorized operations to run in fast compiled code — a Python list, which can hold mixed types anywhere, could never support this.',
          'Misconception: broadcasting is a vague, magical feature that "just works" for any two array shapes. Reality: broadcasting follows a precise, learnable rule based on aligning trailing dimensions; shapes that do not satisfy the rule raise an explicit, informative error rather than producing a silently wrong result.',
          'Misconception: np.mean() is always the right way to average an array. Reality: if the array contains any np.nan values, np.mean() itself returns NaN for the whole result; np.nanmean() is required whenever missing values are possible, which in real data is essentially always.',
          'Misconception: checking if value == np.nan is a valid way to detect a missing value. Reality: by the IEEE floating-point standard, NaN never equals anything, including itself, so this comparison always evaluates to False; np.isnan(value) is the only correct check.',
        ],
        glossary: [
          { term: 'ndarray', definition: 'NumPy\'s core array type: a fixed-type, fixed-shape, contiguous block of numeric data supporting fast vectorized operations.' },
          { term: 'Vectorization', definition: 'Applying an operation to an entire array at once using optimized compiled code, instead of an explicit Python-level loop over individual elements.' },
          { term: 'Shape', definition: 'A tuple describing an array\'s dimensions, e.g. (12,) for a 1-D array of 12 values or (10, 12) for a 2-D array of 10 rows by 12 columns.' },
          { term: 'Broadcasting', definition: 'NumPy\'s rule for applying an operation between arrays of different but compatible shapes by aligning their trailing dimensions, without writing an explicit loop.' },
          { term: 'Boolean indexing', definition: 'Selecting the elements of an array that satisfy a condition by indexing the array with a boolean array of the same shape, e.g. array[array > 0].' },
          { term: 'NaN (Not a Number)', definition: 'NumPy/IEEE\'s special floating-point value representing a missing or undefined numeric result; NaN never equals anything, including itself, so np.isnan() must be used to detect it.' },
          { term: 'Axis', definition: 'The dimension along which an aggregation function like .mean() or .sum() operates in a multi-dimensional array; axis=0 typically aggregates down rows, axis=1 across columns.' },
        ],
        readingQuestions: [
          'Why does a fixed-type, contiguous array enable vectorized operations in a way a general Python list cannot?',
          'What is the precise rule that determines whether two array shapes can be broadcast together?',
          'Why does using np.mean() instead of np.nanmean() on real data with missing values produce a result that is worse than merely "slightly wrong"?',
        ],
        simpleExplanation:
          'A Python list is like a drawer where you can toss in anything — a number, a string, another list — in any order, which is flexible but means Python has to check what each item actually is every single time it does anything with the drawer\'s contents. A NumPy array is like an ice-cube tray: every compartment is exactly the same size and holds exactly the same kind of thing, and because of that strict uniformity, NumPy can process the entire tray in one fast, bulk operation instead of reaching into each compartment one at a time.\n\n' +
          'Vectorization is what that bulk operation looks like in code: instead of writing a loop that walks through every value and does the math one at a time, you write the math once — array * 1.8 + 32 — and NumPy applies it to the whole array internally, in compiled code that runs far faster than a Python loop ever could. Broadcasting extends this same idea to two arrays of different sizes: if you have one year\'s worth of monthly averages (12 numbers) and ten years of monthly data (a grid of 10 rows by 12 columns), NumPy can automatically figure out that the 12-number average should be applied to every one of the 10 rows, without you writing a loop over the years by hand.\n\n' +
          'The one genuinely tricky wrinkle is missing data. NumPy represents "no value here" with a special marker called NaN, and NaN has an odd rule attached to it: it is defined to never equal anything, not even another NaN — so asking "does this value equal NaN" always comes back false, even when the value genuinely is NaN. That is precisely why NumPy gives you a dedicated tool, np.isnan(), to ask that question correctly, and a whole family of "nan-aware" functions like np.nanmean() that correctly skip missing values instead of letting a single missing month silently turn an entire ten-year average into a useless NaN.',
        realWorldApplications: [
          { title: 'Climate anomaly calculations at NOAA and Berkeley Earth', description: 'The exact "subtract each month from its long-term climatological average" pattern this lab practices is literally how real climate agencies compute the temperature anomaly time series used throughout Week 2\'s capstone dataset — it is not a simplified toy version of the real technique, it is the real technique at a smaller scale.' },
          { title: 'Image data represented as NumPy arrays', description: 'A digital image is, underneath, just a NumPy array of shape (height, width, channels); the same shape-reasoning and vectorized-operation skills this topic teaches on temperature grids apply directly to image processing, satellite imagery, and computer vision work in later phases of this track.' },
          { title: 'Every Pandas DataFrame column, under the hood', description: 'Pandas — the subject of the very next topic — stores each DataFrame column internally as a NumPy array; the NaN-handling rules, vectorized-operation habits, and shape intuition built here are exactly what make Pandas\'s behavior predictable rather than mysterious.' },
        ],
        primaryLecture: makeVerifiedVideo({
          id: 'nasa102-t1-lec',
          title: 'Python NumPy Tutorial for Beginners',
          institution: 'freeCodeCamp.org',
          videoId: 'QUT1VHiLmmI',
          durationMinutes: 60,
          instructor: 'Keith Galli',
        }),
        primaryText: {
          id: 'book-numpy-quickstart',
          title: 'NumPy User Guide — NumPy Quickstart',
          authors: ['NumPy Developers'],
          url: 'https://numpy.org/doc/stable/user/quickstart.html',
          canonicalUrl: 'https://numpy.org/doc/stable/user/quickstart.html',
          recommendedChapter: 'The Basics; Shape Manipulation; Broadcasting Rules',
          accessStatus: 'open-access',
          publisherOrInstitution: 'NumPy / NumFOCUS',
          deliveryMode: 'official-web-resource',
        },
      },
      {
        id: 'nasa102-t2',
        title: 'Pandas DataFrames: Loading, Cleaning & Aggregating Real Data',
        summary: 'Loading real CSV/JSON data into a DataFrame, and the core cleaning operations every real dataset needs — missing values, duplicates, filtering, grouping, and aggregation.',
        objective: 'Load real tabular data into a Pandas DataFrame and clean it (missing values, duplicates, filtering) and summarize it (grouping and aggregation) to produce a trustworthy, analysis-ready table.',
        concepts: [
          'A Pandas DataFrame is a labeled, two-dimensional table — rows and named columns — built on top of NumPy arrays; the labeling (row index and column names) is the key upgrade over a raw NumPy array, since it lets you refer to data by meaningful name ("temperature") instead of only by position.',
          'pd.read_csv() and pd.read_json() load real files directly into a DataFrame, automatically inferring column types — this convenience is also a risk, since Pandas can silently infer the wrong type (a zero-padded ID column read as an integer) exactly the way raw file-parsing could in Week 1, so the inferred dtypes of a newly loaded DataFrame should always be checked, not assumed.',
          'Missing values in Pandas are represented as NaN (for numeric columns) or None/NaT (for object/datetime columns); .isna() and .notna() detect them, and .dropna() or .fillna(value) are the two fundamental strategies for handling them — dropping loses data but is unambiguous, filling preserves row count but requires a defensible choice of fill value.',
          'df.duplicated() flags rows that are exact repeats of an earlier row, and df.drop_duplicates() removes them; real datasets frequently contain duplicates from repeated data collection or merged files, and silently analyzing a dataset with undetected duplicates inflates every count and average that depends on row frequency.',
          'Boolean filtering (df[df["temperature"] > 30]) selects rows matching a condition, directly extending the boolean-indexing pattern from NumPy to labeled DataFrame rows, and is the standard way to answer "show me just the rows where X is true."',
          'df.groupby("column") splits a DataFrame into groups sharing the same value in that column, and is almost always followed immediately by an aggregation (.mean(), .sum(), .count()) — this split-apply-combine pattern is how "average temperature per station" or "total readings per year" questions are actually answered in Pandas.',
          '.describe() produces a fast statistical summary (count, mean, std, min, quartiles, max) of every numeric column in one call, and is the standard first command run on any newly loaded DataFrame to get an immediate sense of its scale, range, and potential outliers before writing any custom analysis code.',
          'Method chaining (df.dropna().drop_duplicates().reset_index(drop=True)) applies a sequence of cleaning operations in one readable pipeline; each method returns a new DataFrame by default, which is why forgetting to reassign the result (df = df.dropna(), not just df.dropna()) is the Pandas version of the same "strings are immutable" trap from Week 1.',
        ],
        prerequisites: ['NumPy Foundations for Numerical Array Data'],
        researchPapers: [
          {
            id: 'paper-mckinney-pandas-2010',
            title: 'Data Structures for Statistical Computing in Python',
            authors: ['Wes McKinney'],
            year: 2010,
            venue: 'Proceedings of the 9th Python in Science Conference (SciPy 2010)',
            doiOrArxiv: '10.25080/Majora-92bf1922-00a',
            openAccessUrl: 'https://proceedings.scipy.org/articles/Majora-92bf1922-00a',
            canonicalUrl: 'https://proceedings.scipy.org/articles/Majora-92bf1922-00a',
            paperType: 'applied',
            difficulty: 'intermediate',
            prerequisites: ['NumPy Foundations for Numerical Array Data'],
            summary: 'Wes McKinney\'s original paper introducing Pandas and its DataFrame data structure, written to solve exactly the "labeled, real-world, messy tabular data" problem this course\'s Week 2 topics are built around.',
            whyItMatters: 'This is the founding document of the library this entire topic teaches; McKinney explains, from first principles, why labeled, missing-data-aware tabular structures were needed on top of raw NumPy arrays — the exact motivation behind every method covered in this topic.',
            sectionsToRead: 'Introduction; the sections describing the DataFrame object and missing-data handling.',
            readingQuestions: [
              'What specific limitation of raw NumPy arrays does McKinney identify as the motivation for building Pandas?',
              'How does the paper\'s discussion of missing-data handling connect to this topic\'s dropna/fillna guidance?',
            ],
            relatedTopicIds: ['nasa102-t2'],
            accessStatus: 'open-access',
            deliveryMode: 'official-web-resource',
          },
        ],
        exercise: {
          id: 'nasa102-t2-ex1',
          type: 'code-snippet',
          question: 'Given a DataFrame df with columns "station", "date", and "temp_c", write one chained expression that removes exact duplicate rows, drops rows where temp_c is missing, and returns the average temp_c per station, sorted from highest to lowest average.',
          explanation: 'df.drop_duplicates().dropna(subset=["temp_c"]).groupby("station")["temp_c"].mean().sort_values(ascending=False) — this chains duplicate removal, targeted missing-value dropping (only where temp_c specifically is missing, not any column), the groupby/aggregate step, and a final sort, all in one readable pipeline.',
        },
        additionalExercises: [
          { id: 'nasa102-t2-ex2', type: 'multiple-choice', question: 'Why might dropping every row with any missing value (df.dropna()) be a worse choice than dropping only rows missing a specific critical column (df.dropna(subset=["temp_c"]))?', options: ['There is no difference between the two', 'The unrestricted dropna() can discard otherwise-perfectly-good rows just because an unrelated, less important column happened to be missing, losing more data than necessary', 'dropna() with a subset argument is not valid Pandas syntax', 'dropna() without arguments is always faster'], correctAnswer: 'The unrestricted dropna() can discard otherwise-perfectly-good rows just because an unrelated, less important column happened to be missing, losing more data than necessary', explanation: 'A row missing a minor "notes" column but with a perfectly valid temperature reading is still useful for temperature analysis; an unrestricted dropna() would discard it anyway. Targeting the subset to only the column(s) that actually matter for the analysis at hand preserves far more usable data.' },
          { id: 'nasa102-t2-ex3', type: 'free-response', question: 'A dataset\'s .describe() output shows a "temp_c" column with a minimum of -273.15 and a maximum of 5000. Explain what this tells you before you have looked at a single individual row, and what you would do next.', explanation: '-273.15°C is absolute zero and 5000°C is far beyond any naturally occurring Earth surface temperature, so both extremes are almost certainly data-entry errors, sensor faults, or sentinel/placeholder values (like -273.15 sometimes used to mean "no reading") rather than real measurements. The next step is to filter and inspect the specific rows producing these extreme values before deciding whether to correct, flag, or drop them — .describe() is a screening tool that reveals a problem exists, not a fix for it.' },
          { id: 'nasa102-t2-ex4', type: 'multiple-choice', question: 'What does df.groupby("station")["temp_c"].mean() actually compute?', options: ['The overall average temperature across the entire DataFrame, ignoring station', 'The average temp_c value computed separately within each distinct group of rows sharing the same station value', 'A random sample of temperatures from each station', 'It raises an error unless every station has the same number of readings'], correctAnswer: 'The average temp_c value computed separately within each distinct group of rows sharing the same station value', explanation: 'groupby splits the DataFrame into one sub-table per distinct station value, and the following .mean() is applied independently within each sub-table, producing one average per station — the split-apply-combine pattern that underlies almost all real tabular summarization.' },
        ],
        lab: {
          id: 'nasa102-lab2',
          title: 'Weekly Challenge: The Multi-Source Merge & Clean',
          type: 'python',
          language: 'python',
          practiceMode: 'independent',
          level: 'level-2',
          estimatedMinutes: 120,
          instructions:
            'MISSION NAME: The Multi-Source Merge & Clean.\n\n' +
            'REAL-WORLD PROBLEM: Real environmental datasets rarely arrive as one clean file — different collection dates get exported separately, forms get resubmitted (creating duplicates), and sensors occasionally fail to log a reading — before any real analysis can happen, this mess has to be turned into one trustworthy table.\n\n' +
            'SKILLS BEING TESTED: loading real tabular data, missing-value strategy, duplicate detection, boolean filtering, and groupby aggregation.\n\n' +
            'CONCEPTS YOU MUST APPLY: pd.read_csv/read_json, .isna()/.dropna()/.fillna(), .duplicated()/.drop_duplicates(), boolean filtering, .groupby(), and .describe().\n\n' +
            'OBJECTIVES (in order):\n' +
            '1. Create two small CSV files representing the same underlying dataset collected in two batches (station, date, temp_c columns), with at least one exact duplicate row within a file, at least one missing temp_c value, and an overlapping date range between the two files.\n' +
            '2. Load both files into DataFrames with pd.read_csv() and concatenate them into one combined DataFrame (pd.concat).\n' +
            '3. Run .describe() on the combined DataFrame before any cleaning, and write a one-sentence note on anything suspicious it reveals.\n' +
            '4. Remove exact duplicate rows, and decide (with a written justification) whether to drop or fill the missing temp_c value — do not do this silently.\n' +
            '5. Group the cleaned data by station and compute the average, min, and max temp_c per station, and separately filter and print all rows where temp_c is above the 90th percentile of the cleaned data.\n\n' +
            'REQUIRED TOOLS: Pandas.\n\n' +
            'DATASET/API REQUIREMENTS: none; the two source files are self-authored as described above.\n\n' +
            'DELIVERABLES: the two source CSV files, the loading/concatenation code, the pre-cleaning .describe() note, the cleaning code with its written justification, and the final grouped summary and filtered high-temperature rows.\n\n' +
            'CONSTRAINTS: every cleaning decision (drop vs. fill, which duplicates removed) must be written down as a one-sentence justification — silent cleaning with no explanation is treated as incomplete for this challenge.\n\n' +
            'DIFFICULTY: intermediate.\n\n' +
            'EVALUATION RUBRIC: Correctness /30 (duplicates and missing values genuinely handled), Judgment /35 (the drop-vs-fill decision is reasonable and justified in writing), Analysis /35 (the groupby summary and percentile filter are correct and clearly presented).\n\n' +
            'COMMON MISTAKES TO AVOID: calling df.dropna() (unrestricted) when only one column\'s missing values actually matter; forgetting that df.method() returns a new DataFrame and must be reassigned to take effect; treating .describe()\'s output as already "clean" instead of as a screening step.\n\n' +
            'BONUS OBJECTIVES: add a third source file with a completely different column order and at least one differently-named column (e.g. "temperature_c" instead of "temp_c"), and handle reconciling it into the same combined DataFrame.\n\n' +
            'REFLECTION QUESTIONS:\n' +
            '1. What did .describe() reveal before you did any cleaning, and how did it change what you looked at next?\n' +
            '2. Why did you choose to drop or fill the missing value the way you did, and what would change your mind?\n' +
            '3. If this were 500 files instead of 2, what part of this workflow would need to change first?',
          objective: 'Merge two messy real-shaped data sources into one clean, justified, analysis-ready DataFrame and summarize it correctly.',
          starterCode: 'import pandas as pd\n\n# TODO: create batch_a.csv and batch_b.csv (station, date, temp_c) with a duplicate,\n# a missing value, and an overlapping date range, then load them here.\n\n# df_a = pd.read_csv("batch_a.csv")\n# df_b = pd.read_csv("batch_b.csv")\n# combined = pd.concat([df_a, df_b], ignore_index=True)\n\n# TODO: combined.describe() -- note anything suspicious\n\n# TODO: clean (drop_duplicates, and a justified dropna/fillna choice)\n\n# TODO: groupby("station") summary, and a 90th-percentile filter\n',
        },
        checklist: [
          'Load a real CSV/JSON file into a DataFrame and check its inferred dtypes before trusting them',
          'Distinguish targeted (subset) missing-value handling from unrestricted dropna()',
          'Detect and remove exact duplicate rows before aggregating',
          'Use boolean filtering and groupby/aggregate correctly and explain what each computes',
          'Use .describe() as a screening tool and explain what an implausible min/max reveals',
        ],
        misconceptions: [
          'Misconception: pd.read_csv() always infers the correct column types, so the result can be used immediately. Reality: type inference can be wrong in exactly the same ways raw file parsing can (a zero-padded ID silently becoming an integer), so checking df.dtypes after loading is a required habit, not an optional one.',
          'Misconception: df.dropna() is always the safe, correct way to handle missing data. Reality: an unrestricted dropna() can discard rows that are perfectly usable for the analysis at hand, just because an unrelated column happened to be missing; targeting the subset argument to the columns that actually matter preserves far more real data.',
          'Misconception: calling df.drop_duplicates() without reassigning the result (just running the line on its own) cleans the DataFrame. Reality: like nearly every Pandas method, drop_duplicates() returns a new DataFrame by default and leaves the original untouched unless you reassign it (df = df.drop_duplicates()) or pass inplace=True.',
          'Misconception: .describe() means the data has already been checked and is ready to use. Reality: .describe() is a screening tool that surfaces suspicious values (impossible minimums/maximums, surprising counts) for a human to investigate — it does not fix or validate anything on its own.',
        ],
        glossary: [
          { term: 'DataFrame', definition: 'Pandas\'s core two-dimensional, labeled data structure — rows and named columns — built on top of NumPy arrays, the standard representation for a real tabular dataset in Python.' },
          { term: 'dtype', definition: 'The data type Pandas has inferred (or been told) for a column, e.g. int64, float64, object (usually strings), or datetime64 — worth checking immediately after loading any real file.' },
          { term: 'Missing-value handling (drop vs. fill)', definition: 'The two fundamental strategies for dealing with NaN values: dropna() removes affected rows (or columns), losing data but avoiding invented values; fillna(value) keeps every row but requires a defensible choice of what value to substitute.' },
          { term: 'Duplicate row', definition: 'A row that is an exact repeat of an earlier row across all (or a specified subset of) columns, detected with .duplicated() and removed with .drop_duplicates().' },
          { term: 'Boolean filtering (Pandas)', definition: 'Selecting DataFrame rows matching a condition, e.g. df[df["temp_c"] > 30], directly extending NumPy\'s boolean-indexing pattern to labeled rows.' },
          { term: 'groupby (split-apply-combine)', definition: 'Splitting a DataFrame into groups sharing a common column value, applying an aggregation independently within each group, and combining the results — the standard pattern for "summary per category" questions.' },
          { term: '.describe()', definition: 'A DataFrame method that returns count, mean, standard deviation, min, quartiles, and max for every numeric column in one call, used as a fast first screening step on any newly loaded dataset.' },
        ],
        readingQuestions: [
          'Why is checking a newly loaded DataFrame\'s dtypes a required habit rather than an optional extra step?',
          'When would filling a missing value be a more defensible choice than dropping the row entirely, and when would the reverse be true?',
          'What specifically does an implausible minimum or maximum in .describe() output tell you, and what does it not tell you?',
        ],
        simpleExplanation:
          'A Pandas DataFrame is what you get when you take a NumPy array and staple readable name-tags onto its rows and columns — instead of "give me column 3," you can say "give me the temperature column," which sounds like a small convenience but is the difference between code that is self-explanatory and code you have to constantly cross-reference against a separate notes file to understand. Loading a real CSV file into a DataFrame with one line (pd.read_csv) feels almost too easy, which is exactly why it deserves a moment of suspicion afterward: Pandas guesses each column\'s type as best it can, and that guess can be wrong in the same quiet, dangerous ways a manual conversion could be wrong back in Week 1.\n\n' +
          'Real data is never fully clean, and Pandas gives you two honest choices for a missing value: throw the row away (dropna), or fill in a value you have to justify (fillna). Neither is automatically correct — the right choice depends entirely on what that row is otherwise worth to you, which is why a good analyst always writes down which choice they made and why, instead of quietly cleaning data behind the scenes where nobody (including their future self) can check the reasoning. Duplicate rows are a similar quiet trap: two identical copies of the same reading, from a resubmitted form or a re-exported file, will not look wrong at a glance, but they will silently double-count that reading in every average and total until you specifically check for and remove them.\n\n' +
          'Once the data is clean, groupby is how you ask "break this down by category and summarize each group separately" — average temperature per station, total rainfall per year — in one line instead of writing a manual loop that filters and averages each group by hand. And .describe() is the fast gut-check you run the moment any new dataset lands in front of you: if the "minimum" of a temperature column reads -273 degrees or the "maximum" reads 5000, that single number is telling you, before you have inspected a single individual row, that something in this dataset needs your attention before you trust anything computed from it.',
        realWorldApplications: [
          { title: 'Government open-data portals publishing monthly CSV exports', description: 'Public environmental and health agencies routinely publish data as separate monthly or annual CSV files that analysts must concatenate, deduplicate, and reconcile column names across — exactly the workflow this topic\'s lab practices, not a simplified version of it.' },
          { title: 'The pandas.concat + drop_duplicates pattern in real newsroom data journalism', description: 'Data journalists at outlets like The New York Times and FiveThirtyEight routinely combine multiple official data releases (which frequently overlap or get resubmitted) using this exact combine-then-deduplicate pattern before any public-facing analysis is published.' },
          { title: 'Sentinel/placeholder values in real government datasets', description: 'Real government and scientific datasets have a well-known history of using implausible sentinel values (like -999, -273.15, or 9999) to mean "no reading was taken," which is precisely why running .describe() and inspecting the min/max before trusting a dataset is standard professional practice, not an academic exercise.' },
        ],
        primaryLecture: makeVerifiedVideo({
          id: 'nasa102-t2-lec',
          title: 'Pandas & Python for Data Analysis by Example – Full Course for Beginners',
          institution: 'freeCodeCamp.org',
          videoId: 'gtjxAH8uaP0',
          durationMinutes: 300,
          instructor: 'Santiago Basulto',
        }),
        primaryText: {
          id: 'book-pandas-10min',
          title: 'Pandas User Guide — 10 minutes to pandas',
          authors: ['Pandas Development Team'],
          url: 'https://pandas.pydata.org/docs/user_guide/10min.html',
          canonicalUrl: 'https://pandas.pydata.org/docs/user_guide/10min.html',
          recommendedChapter: 'Missing data; Merge; Grouping',
          accessStatus: 'open-access',
          publisherOrInstitution: 'NumFOCUS / Pandas Development Team',
          deliveryMode: 'official-web-resource',
        },
      },
      {
        id: 'nasa102-t3',
        title: 'Descriptive Statistics, Correlation & Time-Series Basics',
        summary: 'Mean, median, and variance as different (and sometimes contradictory) summaries of the same data; correlation as a measured relationship, not proof of cause; and rolling averages as the standard way to see a trend through noisy time-series data.',
        objective: 'Compute and correctly interpret mean, median, variance/standard deviation, and correlation on real data, and use a rolling average to reveal a trend in noisy time-series data without overstating what the numbers prove.',
        concepts: [
          'The mean (average) and median (middle value when sorted) can tell very different stories about the same dataset when the data is skewed by outliers — a mean income can be dragged far above the "typical" income by a small number of very high earners, while the median is unaffected by their exact size, only their position.',
          'Variance measures the average squared distance of each value from the mean, and standard deviation (its square root) expresses that same spread back in the original units — a small standard deviation means values cluster tightly around the mean, a large one means they are spread widely, which is often more informative for real decisions than the mean alone.',
          'Correlation (commonly Pearson\'s r) measures the strength and direction of a linear relationship between two variables on a scale from -1 to +1; a value near 0 means little to no linear relationship, but critically, this only measures linear association, not causation and not any nonlinear relationship, no matter how strong that nonlinear relationship actually is.',
          '"Correlation does not imply causation" is not a cliché disclaimer, it is a precise statistical fact: two variables can be strongly correlated because one causes the other, because both are caused by a third unmeasured variable, or by pure coincidence in a limited sample — correlation alone can never distinguish between these explanations.',
          'A time series is data indexed by time (daily, monthly, or yearly values), and real time series almost always contain both a genuine underlying trend and short-term noise on top of it — the central analytical challenge is separating the two, not assuming every up-tick or down-tick is meaningful.',
          'A rolling (moving) average smooths a noisy time series by replacing each point with the average of itself and its nearest neighbors within a fixed window (e.g. a 5-year rolling average), which reveals the underlying trend at the cost of losing the very first and last few points, where a full window is not yet available.',
          'Choosing a rolling window size is a real analytical decision, not an arbitrary default: too small a window still shows noise as if it were signal; too large a window smooths away genuine shorter-term patterns along with the noise, so the choice should be justified by what timescale of pattern the analysis actually cares about.',
          'A percentile (or quantile) describes the value below which a given percentage of the data falls — the 90th percentile is the value exceeded by only 10% of the data — and is often more useful than a simple threshold for describing "unusually high" in a way that adapts to the actual shape of a specific dataset.',
        ],
        prerequisites: ['Pandas DataFrames: Loading, Cleaning & Aggregating Real Data'],
        researchPapers: [
          {
            id: 'paper-tukey-future-of-data-analysis-1962',
            title: 'The Future of Data Analysis',
            authors: ['John W. Tukey'],
            year: 1962,
            venue: 'The Annals of Mathematical Statistics, vol. 33, no. 1',
            doiOrArxiv: '10.1214/aoms/1177704711',
            openAccessUrl: 'https://projecteuclid.org/journals/annals-of-mathematical-statistics/volume-33/issue-1/The-Future-of-Data-Analysis/10.1214/aoms/1177704711.full',
            canonicalUrl: 'https://projecteuclid.org/journals/annals-of-mathematical-statistics/volume-33/issue-1/The-Future-of-Data-Analysis/10.1214/aoms/1177704711.full',
            paperType: 'seminal',
            difficulty: 'intermediate',
            prerequisites: ['Basic descriptive statistics'],
            summary: 'Tukey\'s landmark argument that data analysis is a broader, more exploratory activity than formal mathematical statistics alone — encompassing summarizing, visualizing, and questioning data, not just testing pre-specified hypotheses.',
            whyItMatters: 'This paper is the historical root of exactly the mindset this topic and the next teach: look at the actual shape and spread of real data (mean vs. median, distributions, trends) before jumping to a single summary number or a hypothesis test.',
            sectionsToRead: 'The opening sections distinguishing data analysis from formal mathematical statistics.',
            readingQuestions: [
              'How does Tukey distinguish "data analysis" from narrower mathematical statistics?',
              'How does this distinction connect to why this topic insists on checking mean AND median, not just one summary number?',
            ],
            relatedTopicIds: ['nasa102-t3'],
            accessStatus: 'open-access',
            deliveryMode: 'official-web-resource',
          },
        ],
        exercise: {
          id: 'nasa102-t3-ex1',
          type: 'free-response',
          question: 'A dataset of 10 households has 9 households earning between $30,000-$60,000 and one household earning $5,000,000. Explain what happens to the mean versus the median in this dataset, and which one better describes a "typical" household in it.',
          explanation: 'The mean is dragged dramatically upward by the single outlier — it could easily exceed $500,000 despite 9 out of 10 households earning far less — while the median (the middle value when sorted) stays within the $30,000-$60,000 range regardless of exactly how large the outlier is, since the median only cares about position, not magnitude. In this case the median is the far more representative "typical household" figure; the mean is technically correct but practically misleading.',
        },
        additionalExercises: [
          { id: 'nasa102-t3-ex2', type: 'multiple-choice', question: 'A dataset shows a strong positive correlation (r = 0.85) between monthly ice cream sales and monthly drowning incidents. What is the most statistically sound interpretation?', options: ['Ice cream causes drowning, and sales should be restricted', 'Drowning causes people to buy more ice cream', 'Both variables are very plausibly driven by a third factor — hot weather — that increases both swimming (and drowning risk) and ice cream demand simultaneously, without either variable causing the other', 'The correlation must be a calculation error since the two variables are unrelated'], correctAnswer: 'Both variables are very plausibly driven by a third factor — hot weather — that increases both swimming (and drowning risk) and ice cream demand simultaneously, without either variable causing the other', explanation: 'This is the classic textbook example of a confounding variable: correlation cannot distinguish "A causes B," "B causes A," and "C causes both A and B" from each other. A high r value here only tells you the two variables move together, never why.' },
          { id: 'nasa102-t3-ex3', type: 'free-response', question: 'You compute a 3-year rolling average and a 20-year rolling average on the same 50-year temperature time series, and they look meaningfully different. Explain why, and which one you would choose to answer "is there a long-term warming trend" versus "was last year unusually warm compared to its immediate surroundings."', explanation: 'A 3-year rolling average still shows a fair amount of short-term year-to-year noise smoothed only slightly, useful for the "unusual compared to immediate surroundings" question. A 20-year rolling average smooths away almost all short-term noise and reveals only the slow, long-term underlying trend, which is the right tool for the "is there a long-term trend" question — but it would completely hide whether any single recent year was unusual, since that information is exactly what a wide window averages away.' },
          { id: 'nasa102-t3-ex4', type: 'multiple-choice', question: 'Why is the 90th percentile often a more useful way to define "unusually high" than a fixed threshold like "above 35 degrees," when comparing across multiple different stations or datasets?', options: ['Percentiles are always mathematically larger than fixed thresholds', 'A percentile automatically adapts to each dataset\'s own actual distribution, so "unusually high" means the same relative thing (top 10%) in a naturally hot climate and a naturally cool one, while a fixed threshold does not', 'Fixed thresholds are illegal to use in scientific analysis', 'There is no real difference between the two approaches'], correctAnswer: 'A percentile automatically adapts to each dataset\'s own actual distribution, so "unusually high" means the same relative thing (top 10%) in a naturally hot climate and a naturally cool one, while a fixed threshold does not', explanation: 'A fixed threshold like 35 degrees might flag nearly every summer day in a hot climate as "unusual" while never triggering in a cool climate, making cross-location comparison meaningless. A percentile-based definition self-adjusts to each dataset\'s own actual range, so "top 10%" is a comparable, meaningful statement in either climate.' },
        ],
        lab: {
          id: 'nasa102-lab3',
          title: 'Weekly Challenge: Trend or Noise?',
          type: 'python',
          language: 'python',
          practiceMode: 'guided-lesson',
          level: 'level-2',
          estimatedMinutes: 100,
          instructions:
            'MISSION NAME: Trend or Noise?\n\n' +
            'REAL-WORLD PROBLEM: A single unusually hot or cold year does not, by itself, prove or disprove a long-term climate trend — the whole point of statistics is separating a real underlying pattern from ordinary year-to-year noise, and jumping to a conclusion from one data point is one of the most common real-world statistical mistakes.\n\n' +
            'SKILLS BEING TESTED: descriptive statistics, correlation interpretation, rolling averages, and percentile-based thresholds.\n\n' +
            'CONCEPTS YOU MUST APPLY: mean vs. median, standard deviation, Pearson correlation, rolling averages, window-size reasoning, and percentiles.\n\n' +
            'OBJECTIVES (in order):\n' +
            '1. Using a Pandas Series or DataFrame of at least 40 years of synthetic annual values (a mild upward trend plus meaningful random year-to-year noise — you construct this), compute the overall mean, median, and standard deviation.\n' +
            '2. Compute 3-year and 15-year rolling averages of the same series and compare, in writing, what each reveals and hides.\n' +
            '3. Compute the Pearson correlation between "year number" and "value" using .corr(), and write one paragraph explaining exactly what this number does and does not prove about a trend.\n' +
            '4. Using percentiles, identify the years that fall in the top 10% and bottom 10% of the raw (non-averaged) values, and separately identify which years are in the top 10% of the 15-year rolling average — compare the two lists and explain why they differ.\n' +
            '5. Write a short conclusion (3-5 sentences) stating whether you believe there is a genuine long-term trend in your synthetic data, citing specific numbers from steps 1-4 as evidence, not just an impression.\n\n' +
            'REQUIRED TOOLS: Pandas.\n\n' +
            'DATASET/API REQUIREMENTS: none; synthetic 40+ year time series constructed as described (a helper generator using NumPy\'s random functions plus a linear trend term is expected).\n\n' +
            'DELIVERABLES: the data generation code, the descriptive statistics, both rolling averages with a written comparison, the correlation with its written interpretation, the percentile analysis, and the final evidence-based conclusion.\n\n' +
            'CONSTRAINTS: your conclusion must explicitly avoid claiming the correlation "proves" a trend causally — describe what it shows (association) and be explicit about what it does not show (causation).\n\n' +
            'DIFFICULTY: intermediate.\n\n' +
            'EVALUATION RUBRIC: Statistical correctness /35, Correlation interpretation /30 (correctly distinguishes association from causation), Written reasoning /35 (the final conclusion is evidence-based, not just asserted).\n\n' +
            'COMMON MISTAKES TO AVOID: reporting only the mean and never checking whether it is skewed by outliers; treating a high correlation coefficient as proof of causation; choosing a rolling window size without explaining why that size fits the question being asked.\n\n' +
            'BONUS OBJECTIVES: repeat the correlation and rolling-average analysis after deliberately injecting one extreme outlier year, and describe how much it changes your results — this previews why outlier handling matters for real analysis.\n\n' +
            'REFLECTION QUESTIONS:\n' +
            '1. What is the single strongest piece of evidence from your analysis that convinced you a trend was (or was not) real, and why is it stronger than just looking at the raw numbers?\n' +
            '2. If someone showed you only the correlation coefficient, with no chart and no rolling average, what would you ask to see before trusting their conclusion?\n' +
            '3. How would your conclusion change if your synthetic dataset had only 5 years of data instead of 40?',
          objective: 'Separate a genuine long-term trend from year-to-year noise in a synthetic time series using rolling averages, correlation, and percentiles, and defend the conclusion with specific numbers.',
          starterCode: 'import numpy as np\nimport pandas as pd\n\nnp.random.seed(42)\nyears = np.arange(1985, 2026)\n# TODO: construct values = trend + noise, e.g. a small linear increase per year plus random noise\nvalues = None\n\nseries = pd.Series(values, index=years)\n\n# TODO: mean, median, std\n\n# TODO: 3-year and 15-year rolling averages (series.rolling(window=N).mean())\n\n# TODO: correlation between year number and value (series.corr, or np.corrcoef)\n\n# TODO: 10th/90th percentile years, raw vs. on the 15-year rolling average\n\n# TODO: print your final written conclusion\n',
        },
        checklist: [
          'Explain a concrete case where mean and median tell meaningfully different stories about the same data',
          'Compute and correctly interpret a Pearson correlation coefficient, including its limits',
          'Explain "correlation does not imply causation" with a real example, not just the phrase',
          'Compute a rolling average and justify a specific window-size choice',
          'Use percentiles to define "unusual" in a way that adapts to a dataset\'s own distribution',
        ],
        misconceptions: [
          'Misconception: the mean is always the best single number to summarize a dataset. Reality: when data is skewed by outliers (income, wait times, extreme weather events), the mean can be pulled far from what most people would call "typical," and the median is often the more representative summary.',
          'Misconception: a strong correlation coefficient proves one variable causes the other. Reality: correlation measures only the strength and direction of a linear association; it cannot distinguish causation from reverse causation, a shared underlying cause, or coincidence in limited data.',
          'Misconception: a rolling average with a bigger window is always "more accurate." Reality: window size is a tradeoff, not a quality dial — too large a window smooths away real, meaningful shorter-term patterns along with the noise; the right window size depends on what timescale of pattern the question actually cares about.',
          'Misconception: a single unusually hot, cold, wet, or dry year is strong evidence of a long-term trend by itself. Reality: real time series contain substantial year-to-year noise on top of any genuine trend, which is exactly why a single data point is weak evidence and a rolling average or multi-decade comparison is required to see the underlying signal.',
        ],
        glossary: [
          { term: 'Mean', definition: 'The arithmetic average of a set of values; sensitive to outliers, since one extreme value can shift it substantially.' },
          { term: 'Median', definition: 'The middle value of a dataset when sorted; robust to outliers, since it depends only on position, not on how extreme the outlying values are.' },
          { term: 'Variance / standard deviation', definition: 'Measures of how spread out a dataset\'s values are around the mean; standard deviation is the square root of variance, expressed in the same units as the original data.' },
          { term: 'Pearson correlation (r)', definition: 'A statistic from -1 to +1 measuring the strength and direction of a linear relationship between two variables; near 0 means little linear relationship, but says nothing about nonlinear relationships or causation.' },
          { term: 'Confounding variable', definition: 'An unmeasured third factor that influences two observed variables, causing them to appear correlated with each other even though neither directly causes the other.' },
          { term: 'Rolling (moving) average', definition: 'A smoothing technique that replaces each point in a time series with the average of itself and its nearest neighbors within a fixed window, used to reveal an underlying trend through short-term noise.' },
          { term: 'Percentile / quantile', definition: 'The value below which a given percentage of a dataset\'s values fall; the 90th percentile is exceeded by only 10% of the data, adapting automatically to a dataset\'s own actual distribution.' },
        ],
        readingQuestions: [
          'What concrete real-world dataset would you expect the mean and median to disagree on sharply, and why?',
          'Why can correlation never, by itself, distinguish "A causes B" from "a third factor causes both A and B"?',
          'How would you decide what rolling-average window size is appropriate for a specific question, rather than defaulting to a common choice like 5 or 10?',
        ],
        simpleExplanation:
          'Imagine ten friends compare their weekly allowance, and nine of them get between $10 and $20, but one friend\'s parents happen to be extremely wealthy and give them $2,000. The average allowance across all ten friends would come out well over $200 — a number that does not describe any single one of these nine ordinary friends at all. The median — the middle value once you line everyone up in order — stays right around $15, completely unbothered by exactly how rich that one outlier friend\'s parents are, because the median only cares about position in line, not how far away the extreme value sits. Neither number is "wrong," but only one of them answers "what does a typical friend get," and knowing which question you are actually asking is the real skill.\n\n' +
          'Correlation is one of the most misused ideas in casual data conversation. It only tells you two things move together — when one goes up, does the other tend to go up too, or down, or is there no pattern at all — and it never tells you why. A famous example: ice cream sales and drowning incidents rise and fall together throughout the year, strongly correlated, but ice cream obviously does not cause drowning. Both are driven by a third thing entirely — hot weather brings out more swimmers (and more drowning risk) and more ice cream buyers at the same time. Seeing a strong correlation should make you curious about a possible hidden cause, never satisfied that you have found one.\n\n' +
          'Real time-based data — yearly temperatures, monthly sales, daily readings — almost always looks jagged and noisy up close, even when there is a real, gentle trend hiding underneath. A rolling average is like squinting at a jagged mountain skyline from far away: the small jagged peaks and valleys blur together, and the big, slow shape of the mountain range becomes obvious. Squint too little (too small a window) and you still see every jagged peak as if it mattered; squint too much (too large a window) and you blur away real, smaller hills along with the noise. Picking the right amount of squinting — the right window size — for the actual question you are asking is the real analytical judgment call underneath every trend chart you will ever see reported in the news.',
        realWorldApplications: [
          { title: 'Global temperature anomaly charts published by NOAA and Berkeley Earth', description: 'Every major climate agency publishes both the raw annual values and a smoothed rolling-average line on the same chart, precisely because the raw values alone are too noisy to see the underlying long-term trend clearly, and this is the exact technique this topic\'s lab practices.' },
          { title: '"Correlation is not causation" as a recurring theme in public-health reporting', description: 'Retracted or overstated news headlines linking two correlated health trends without a plausible causal mechanism are a recurring, well-documented pattern in science journalism, and the ice-cream-and-drowning example this topic uses is a standard teaching case used across introductory statistics courses worldwide for exactly this reason.' },
          { title: 'Percentile-based "extreme weather" definitions used by meteorological agencies', description: 'National weather services commonly define a "heatwave" or "extreme rainfall event" using a location-specific percentile threshold (e.g. the 90th or 95th percentile of that location\'s own historical distribution) rather than one fixed global number, exactly matching this topic\'s percentile-based reasoning.' },
        ],
        primaryLecture: makeVerifiedVideo({
          id: 'nasa102-t3-lec',
          title: "Pearson's Correlation, Clearly Explained!!!",
          institution: 'StatQuest with Josh Starmer',
          videoId: 'xZ_z8KWkhXE',
          durationMinutes: 7,
          instructor: 'Josh Starmer',
        }),
        primaryText: {
          id: 'book-nist-statistical-handbook',
          title: 'NIST/SEMATECH e-Handbook of Statistical Methods',
          authors: ['NIST/SEMATECH'],
          url: 'https://www.itl.nist.gov/div898/handbook/',
          canonicalUrl: 'https://www.itl.nist.gov/div898/handbook/',
          recommendedChapter: '1.3.5 Quantitative Techniques (measures of location, spread, and correlation)',
          accessStatus: 'open-access',
          publisherOrInstitution: 'National Institute of Standards and Technology (NIST)',
          deliveryMode: 'official-web-resource',
        },
      },
      {
        id: 'nasa102-t4',
        title: 'Visualizing Data with Matplotlib',
        summary: 'Choosing the right chart type for the question being asked — distributions, trends, and comparisons — and the specific habits that separate an honest chart from a misleading one.',
        objective: 'Build clear, correctly-labeled Matplotlib visualizations matched to the type of question being asked (distribution, trend, or comparison), and identify common ways a chart can mislead even when its underlying numbers are correct.',
        concepts: [
          'Every chart type answers a different kind of question: a line chart shows a trend over an ordered axis (usually time), a histogram shows the distribution/shape of a single numeric variable, a bar chart compares a quantity across discrete categories, and a scatter plot shows the relationship between two numeric variables — picking the wrong chart type for the question is a common, avoidable source of confusing or misleading visualizations.',
          'plt.plot(x, y) draws a line chart, the default choice for a time series, because it visually reinforces the ordered, continuous nature of time in a way that a bar chart (designed for discrete, unordered-feeling categories) does not.',
          'plt.hist(data, bins=N) draws a histogram, which reveals the shape of a distribution (is it roughly symmetric, skewed, bimodal) that a single summary number like the mean can hide entirely — two datasets with an identical mean can have completely different, and differently meaningful, shapes.',
          'The bins argument to a histogram is a real analytical choice, not a cosmetic default: too few bins can hide real structure (like two distinct clusters merging into what looks like one hump), too many bins can make genuine noise look like meaningful structure — the same tradeoff as choosing a rolling-average window size.',
          'A truncated y-axis (one that does not start at zero) can make a small, unremarkable difference look dramatic, which is why bar charts in particular should almost always start their y-axis at zero — a line chart showing change over time is more forgiving of this, but even there, an unlabeled or misleading axis range is a common way an honest dataset produces a dishonest-looking chart.',
          'Every publishable chart needs, at minimum: a title stating what it shows, labeled axes with units, and (when multiple series are shown) a legend — a chart a viewer has to guess the meaning of is not finished, no matter how correct the underlying data is.',
          'plt.scatter(x, y) is the right chart for visually assessing whether two numeric variables might be correlated before computing the actual correlation coefficient — a scatter plot can reveal a strong nonlinear relationship that a Pearson correlation coefficient, which only measures linear association, would report as weak or near zero.',
          'Matplotlib\'s Figure and Axes objects (fig, ax = plt.subplots()) give explicit, more controllable access to a chart\'s components than the simpler plt.plot()-style shortcut interface, and become necessary the moment you need multiple subplots or fine-grained control over labels, ticks, or layout.',
        ],
        prerequisites: ['Descriptive Statistics, Correlation & Time-Series Basics'],
        researchPapers: [
          {
            id: 'paper-rougier-ten-simple-rules-figures-2014',
            title: 'Ten Simple Rules for Better Figures',
            authors: ['Nicolas P. Rougier', 'Michael Droettboom', 'Philip E. Bourne'],
            year: 2014,
            venue: 'PLOS Computational Biology, vol. 10, no. 9',
            doiOrArxiv: '10.1371/journal.pcbi.1003833',
            openAccessUrl: 'https://journals.plos.org/ploscompbiol/article/file?id=10.1371/journal.pcbi.1003833&type=printable',
            canonicalUrl: 'https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1003833',
            paperType: 'applied',
            difficulty: 'beginner',
            prerequisites: ['None'],
            summary: 'A practical, widely-cited set of ten concrete rules for making scientific figures clear and honest rather than misleading — covering chart-type choice, labeling, and avoiding visual distortion — co-authored by a Matplotlib core developer.',
            whyItMatters: 'States, with the authority of a Matplotlib core developer and a major scientific journal, the exact same honest-visualization standards (correct chart type, complete labeling, no distorting axis tricks) this topic requires in every lab submission.',
            sectionsToRead: 'Rules 1-5, covering the purpose of a figure and honest representation of the underlying data.',
            readingQuestions: [
              'Which of the paper\'s ten rules most directly matches this topic\'s "start bar charts at zero" guidance, and why?',
              'How does the paper justify treating figure design as a scientific integrity issue, not just an aesthetic one?',
            ],
            relatedTopicIds: ['nasa102-t4'],
            accessStatus: 'open-access',
            deliveryMode: 'in-app-pdf-candidate',
          },
        ],
        exercise: {
          id: 'nasa102-t4-ex1',
          type: 'code-snippet',
          question: 'You have a Pandas Series of 40 years of annual average temperatures indexed by year, and you also want to see the distribution (shape) of all 40 values. Write the Matplotlib code for both a labeled line chart of the trend and a labeled histogram of the distribution, and explain in one sentence why these are two different, complementary views of the same data.',
          explanation: 'import matplotlib.pyplot as plt\\nplt.plot(series.index, series.values); plt.title("Annual Average Temperature, 1985-2025"); plt.xlabel("Year"); plt.ylabel("Temperature (C)"); plt.show()\\nplt.hist(series.values, bins=12); plt.title("Distribution of Annual Averages"); plt.xlabel("Temperature (C)"); plt.ylabel("Count of years"); plt.show()\\nThe line chart shows how the value changes in time order, revealing trends and specific unusual years, while the histogram discards the time ordering entirely and instead shows how often each range of values occurred overall — a warming trend and a symmetric-versus-skewed distribution are two genuinely different, non-interchangeable pieces of information about the same 40 numbers.',
        },
        additionalExercises: [
          { id: 'nasa102-t4-ex2', type: 'multiple-choice', question: 'A bar chart compares annual rainfall between two cities, with the y-axis starting at 800mm instead of 0mm. City A has 850mm and City B has 900mm of rainfall. What does this axis choice risk doing?', options: ['Nothing; truncating a y-axis has no visual effect', 'It can make City B\'s bar look several times taller than City A\'s, visually exaggerating what is actually only a modest ~6% difference', 'It makes the chart technically inaccurate, since the numbers themselves are wrong', 'It only matters for line charts, not bar charts'], correctAnswer: 'It can make City B\'s bar look several times taller than City A\'s, visually exaggerating what is actually only a modest ~6% difference', explanation: 'Bar charts encode value as bar height starting implicitly from zero in a viewer\'s intuition; truncating the axis breaks that intuition and can make a small real difference look dramatic, even though every individual number on the chart remains technically correct. This is one of the most common ways real charts mislead without any single number being false.' },
          { id: 'nasa102-t4-ex3', type: 'free-response', question: 'You want to check whether two variables might have a relationship before computing their correlation coefficient, and a scatter plot shows a clear U-shaped (curved, not straight-line) pattern between them. Explain why the Pearson correlation coefficient alone, without the scatter plot, could seriously mislead you here.', explanation: 'Pearson correlation specifically measures the strength of a linear relationship; a perfect U-shaped (or any strongly curved but symmetric) relationship can produce a correlation coefficient near zero even though the two variables are very clearly, strongly related in a predictable, nonlinear way. Looking only at the number would incorrectly suggest "no relationship," while the scatter plot immediately reveals the real, structured pattern the coefficient is blind to — which is exactly why visualizing data before or alongside computing a summary statistic is standard good practice.' },
          { id: 'nasa102-t4-ex4', type: 'multiple-choice', question: 'Why does the choice of histogram bin count matter for correctly reading a distribution\'s shape?', options: ['It does not matter; any bin count shows the same shape', 'Too few bins can merge genuinely distinct clusters into what looks like a single hump, while too many bins can make ordinary random noise look like meaningful fine structure', 'More bins is always strictly better and should be maximized', 'Bin count only affects color, not shape'], correctAnswer: 'Too few bins can merge genuinely distinct clusters into what looks like a single hump, while too many bins can make ordinary random noise look like meaningful fine structure', explanation: 'This is directly analogous to choosing a rolling-average window size: too coarse a view (few bins) can hide real structure, too fine a view (too many bins) can manufacture the appearance of structure out of ordinary sampling noise. There is no single universally correct bin count — it depends on the dataset\'s size and the question being asked.' },
        ],
        lab: {
          id: 'nasa102-lab4',
          title: 'Weekly Challenge: Three Charts, Three Questions',
          type: 'python',
          language: 'python',
          practiceMode: 'independent',
          level: 'level-2',
          estimatedMinutes: 100,
          instructions:
            'MISSION NAME: Three Charts, Three Questions.\n\n' +
            'REAL-WORLD PROBLEM: A chart that answers the wrong question, or that visually exaggerates a small real difference, actively misleads its audience even when every underlying number is correct — choosing the right chart type and drawing it honestly is a professional responsibility, not a decoration step done at the end.\n\n' +
            'SKILLS BEING TESTED: matching chart type to question type, honest axis choices, complete labeling, and comparing what a chart shows versus what a correlation coefficient alone would show.\n\n' +
            'CONCEPTS YOU MUST APPLY: line charts, histograms, bar charts, scatter plots, bin-count reasoning, and honest axis/labeling practice.\n\n' +
            'OBJECTIVES (in order):\n' +
            '1. Reusing (or regenerating) the 40+ year synthetic time series from the previous topic\'s lab, build a fully labeled line chart (title, axis labels with units) showing the trend, with the 15-year rolling average plotted on the same chart as a second line, with a legend distinguishing the two.\n' +
            '2. Build a labeled histogram of the raw annual values, and produce it twice with two clearly different bin counts (e.g. 5 and 40); write one sentence on how the apparent shape changes between them.\n' +
            '3. Construct a small categorical dataset (e.g. average annual value for 5 different synthetic "stations") and build a correctly labeled bar chart comparing them, with the y-axis starting at zero.\n' +
            '4. Build the same bar chart a second time with the y-axis artificially truncated (not starting at zero), and write one sentence describing how the visual impression changes even though the numbers are identical.\n' +
            '5. Construct two synthetic variables with a clear nonlinear (U-shaped or curved) relationship, plot them as a scatter plot, compute their Pearson correlation coefficient, and write a short paragraph explaining the mismatch between what the scatter plot shows and what the coefficient alone would suggest.\n\n' +
            'REQUIRED TOOLS: Matplotlib, NumPy, Pandas.\n\n' +
            'DATASET/API REQUIREMENTS: none; all data is synthetic and self-constructed as described.\n\n' +
            'DELIVERABLES: five saved or displayed charts (trend-with-rolling-average, two histograms, two bar charts) and the scatter plot, each fully titled and labeled, plus the written comparison sentences.\n\n' +
            'CONSTRAINTS: every chart must have a title, labeled axes with units where applicable, and a legend if it shows more than one series — an unlabeled chart is treated as an incomplete deliverable.\n\n' +
            'DIFFICULTY: intermediate.\n\n' +
            'EVALUATION RUBRIC: Correct chart-type choice /30, Labeling completeness /30, Honest axis practice /20 (the zero-baseline bar chart is genuinely correct), Written analysis /20 (the bin-count and truncated-axis comparisons are clearly explained).\n\n' +
            'COMMON MISTAKES TO AVOID: using a bar chart for a time trend or a line chart for unordered categories; leaving a chart untitled or unlabeled "because it\'s obvious what it shows"; forgetting the legend when two lines are on the same chart; treating the truncated-axis bar chart as acceptable just because it looks more dramatic.\n\n' +
            'BONUS OBJECTIVES: recreate the trend-with-rolling-average chart using the explicit fig, ax = plt.subplots() interface instead of the plt.plot() shortcut, and place it side-by-side with the histogram in a single 1x2 subplot figure.\n\n' +
            'REFLECTION QUESTIONS:\n' +
            '1. Which of your two bar charts (zero-baseline vs. truncated) would you actually publish, and why?\n' +
            '2. What did the scatter plot reveal about your two nonlinear variables that the correlation coefficient alone completely missed?\n' +
            '3. If you had to pick just one of your five charts to show someone with 10 seconds of attention, which would you pick and why?',
          objective: 'Build five correctly-typed, honestly-labeled charts matched to five different analytical questions, and explicitly compare an honest chart against a misleading variant of the same data.',
          starterCode: 'import numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\n# TODO: reuse or regenerate your 40+ year synthetic time series (years, values)\n\n# 1. Line chart: raw trend + 15-year rolling average, with legend\n\n# 2. Histogram with two different bin counts\n\n# 3 & 4. Bar chart of 5 synthetic stations, zero-baseline vs. truncated y-axis\n\n# 5. Scatter plot of two nonlinear variables + their Pearson correlation\n',
        },
        checklist: [
          'Choose the correct chart type (line, histogram, bar, scatter) for a stated question',
          'Label every chart with a title, axis labels with units, and a legend when needed',
          'Explain why bar charts should almost always start their y-axis at zero',
          'Explain how histogram bin count can hide or manufacture apparent structure',
          'Explain a real case where a scatter plot reveals a relationship a correlation coefficient misses',
        ],
        misconceptions: [
          'Misconception: any chart type can be used for any data, as long as the numbers are correct. Reality: chart type encodes meaning — a line chart implies ordered continuity, a bar chart implies discrete comparison — using the wrong type for the data\'s actual structure can visually suggest a relationship or trend that is not really there.',
          'Misconception: a chart with correct underlying numbers cannot be misleading. Reality: axis truncation, cherry-picked bin counts, and missing labels can all make a chart visually misleading while every individual data point plotted remains technically accurate — honesty in visualization is about presentation choices, not just data correctness.',
          'Misconception: more histogram bins always shows "more detail" and is therefore always better. Reality: past a certain point, more bins mostly displays random sampling noise as if it were real structure; the right bin count depends on the dataset\'s size and the question being asked, the same tradeoff as a rolling-average window.',
          'Misconception: if the correlation coefficient is near zero, there is no meaningful relationship between two variables. Reality: Pearson correlation only detects linear relationships; a strong, clearly visible nonlinear relationship (like a U-shape) can produce a correlation coefficient near zero, which is exactly why plotting the data is a necessary complement to computing a single summary statistic.',
        ],
        glossary: [
          { term: 'Line chart', definition: 'A chart connecting ordered data points with a line, the standard choice for visualizing a trend over an ordered axis such as time.' },
          { term: 'Histogram', definition: 'A chart showing the distribution (shape) of a single numeric variable by counting how many values fall into each of a set of bins.' },
          { term: 'Bar chart', definition: 'A chart comparing a quantity across discrete, unordered-feeling categories using bar height or length, which should almost always start its value axis at zero.' },
          { term: 'Scatter plot', definition: 'A chart plotting two numeric variables against each other as points, used to visually assess whether a relationship (linear or nonlinear) might exist between them.' },
          { term: 'Bin count', definition: 'The number of intervals a histogram divides its data range into; too few bins can hide real structure, too many can make noise look like structure.' },
          { term: 'Axis truncation', definition: 'Starting a chart\'s value axis at a point other than zero, which can visually exaggerate small real differences, particularly in bar charts.' },
          { term: 'Legend', definition: 'A chart element mapping each visual style (color, line pattern) to what it represents, required whenever a chart displays more than one data series.' },
        ],
        readingQuestions: [
          'Why does using a bar chart for a time-ordered trend risk visually misrepresenting the data, even if the numbers are correct?',
          'What is one concrete case where truncating a y-axis would be defensible, and one where it would clearly not be?',
          'Why is a scatter plot a necessary complement to a Pearson correlation coefficient, rather than a redundant extra step?',
        ],
        simpleExplanation:
          'A chart is a translation from numbers into a picture, and like any translation, it can be faithful or it can distort the original meaning even while every individual word (or number) is technically correct. Picking the right chart type is the first translation decision: a line connecting points in time order visually says "this is a journey, watch it move," while separate bars say "these are different, unrelated buckets, compare their heights" — using a line for unordered categories, or bars for a smooth trend, quietly tells the viewer the wrong kind of story about the data\'s shape before they have even read a single number.\n\n' +
          'The most common way an honest dataset produces a dishonest-looking chart is the y-axis. If two bars are 850 and 900 units tall, but you start the y-axis at 800 instead of 0, the taller bar can visually look two or three times bigger than the shorter one, even though the real difference is a modest 6%. Nothing on the chart is technically false — 850 is still labeled 850 — but the visual impression a viewer walks away with is wildly out of proportion to the real difference, which is why bar charts in particular should almost always start at zero.\n\n' +
          'Histograms have their own version of this same "how you slice it changes what you see" trap: dividing 40 years of data into 5 wide buckets can make an underlying two-humped pattern look like one smooth hump, while dividing that same data into 40 narrow buckets can make ordinary statistical noise look like real, meaningful bumps and dips. And a scatter plot earns its place in this topic because it can catch something a correlation coefficient by itself is completely blind to: two variables can trace out an unmistakable, strongly patterned curve — like a U-shape — and still produce a correlation coefficient near zero, because that coefficient only ever asks "is this a straight-line relationship," never "is there any relationship at all." Looking at the actual picture, not just the summary number, is often the only way to catch this.',
        realWorldApplications: [
          { title: 'FiveThirtyEight and The Economist\'s public data-journalism style guides', description: 'Major data-journalism outlets publish explicit internal style rules requiring zero-baseline bar charts and full axis labeling specifically because truncated or unlabeled axes are a well-documented, recurring way news charts have historically misled readers, even when reporting accurate underlying numbers.' },
          { title: 'Anscombe\'s quartet, a classic statistics teaching dataset', description: 'A famous 1973 dataset (Anscombe\'s quartet) consists of four data groups with nearly identical mean, variance, and Pearson correlation, but wildly different shapes when actually plotted — including one with a clear nonlinear curve — used in statistics education worldwide as the canonical demonstration of exactly why this topic insists on visualizing data, not just summarizing it numerically.' },
          { title: 'Choosing histogram bin counts in real scientific publishing', description: 'Peer-reviewed scientific papers commonly report the specific bin-count or binning method used for a published histogram precisely because reviewers and readers know bin choice can materially change the apparent shape of a distribution — the same judgment call this topic\'s lab requires learners to make and justify themselves.' },
        ],
        primaryLecture: makeVerifiedVideo({
          id: 'nasa102-t4-lec',
          title: 'Matplotlib Tutorial (Part 1): Creating and Customizing Our First Plots',
          institution: 'Corey Schafer',
          videoId: 'UO98lJQ3QGI',
          durationMinutes: 20,
          instructor: 'Corey Schafer',
        }),
        primaryText: {
          id: 'book-matplotlib-quickstart',
          title: 'Matplotlib Documentation — Quick Start Guide',
          authors: ['Matplotlib Development Team'],
          url: 'https://matplotlib.org/stable/tutorials/introductory/quick_start.html',
          canonicalUrl: 'https://matplotlib.org/stable/tutorials/introductory/quick_start.html',
          recommendedChapter: 'Parts of a Figure; Types of inputs to plotting functions',
          accessStatus: 'open-access',
          publisherOrInstitution: 'NumFOCUS / Matplotlib Development Team',
          deliveryMode: 'official-web-resource',
        },
      },
      {
        id: 'nasa102-t5',
        title: 'Capstone: Earth Data Explorer',
        summary: 'The Phase 1 capstone — load, clean, analyze, and visualize a real, freely downloadable global temperature dataset, and find and explain one genuine pattern in it, end to end.',
        objective: 'Independently execute a complete, honest data-analysis pipeline — load, clean, analyze, visualize, and explain — on a real environmental dataset, producing a result a real reader could trust.',
        concepts: [
          'This capstone uses Berkeley Earth\'s publicly published global land-surface average temperature record (Complete_TAVG_complete.txt), a real, independently-produced, freely downloadable dataset — not NASA data, in keeping with Phase 1 staying NASA-agnostic — reporting monthly and annual temperature anomalies in Celsius relative to a fixed 1951-1980 baseline period, exactly as the file\'s own header documents.',
          'The file\'s structure is itself a realistic data-cleaning exercise: it opens with roughly 30 lines of "%"-prefixed comment/metadata text describing the methodology and baseline, followed by a blank line, followed by whitespace-separated data columns for year, month, monthly anomaly, monthly uncertainty, annual anomaly, annual uncertainty, and 5/10/20-year rolling anomalies and uncertainties, with NaN used for any rolling average that does not yet have a full window of data.',
          'An "anomaly" in this dataset does not mean the actual temperature — it means the difference from that fixed 1951-1980 baseline average, in degrees Celsius; a monthly anomaly of +1.2 means that month was 1.2°C warmer than the same calendar month\'s 1951-1980 average, which is why anomalies (not absolute temperatures) are the standard way climate datasets are reported and compared.',
          'Real scientific data files provide their own already-computed rolling averages (here, 5/10/20-year) specifically because the data producers know raw values are too noisy to interpret directly — using the provided rolling columns is legitimate, but this capstone also asks you to compute your own, to prove you understand what the file\'s columns actually represent rather than trusting them blindly.',
          'A genuine pattern, for this capstone, means a specific, falsifiable, evidence-backed claim (e.g. "the annual anomaly has been positive in every year since 1998" or "the rate of warming in the 20-year rolling average roughly doubled between the 1900-1960 period and the 1990-2020 period") — a vague claim like "temperatures are rising" is not sufficient; the standard is a claim a skeptical reader could check against your own chart and numbers.',
          'Explaining why a found pattern matters is a distinct, required step from finding it — a genuine explanation connects the statistical result to a real consequence or mechanism (e.g., what a sustained multi-decade positive anomaly trend implies for ecosystems, agriculture, or sea level) without overclaiming certainty the data alone cannot support.',
          'This capstone is deliberately scoped to what Phase 1 has taught: Python, NumPy, Pandas, statistics, and Matplotlib are sufficient to do a complete, genuine, evidence-based analysis of a real dataset — no NASA API, machine learning, or web framework is needed to produce real, defensible insight, which is itself the point of ending Phase 1 here before those tools are introduced.',
        ],
        prerequisites: ['Visualizing Data with Matplotlib'],
        researchPapers: [
          {
            id: 'paper-rohde-berkeley-earth-2013',
            title: 'A New Estimate of the Average Earth Surface Land Temperature Spanning 1753 to 2011',
            authors: ['Richard A. Muller', 'Robert Rohde', 'Robert Jacobsen', 'Elizabeth Muller', 'Saul Perlmutter', 'Arthur Rosenfeld', 'Jonathan Wurtele', 'Donald Groom', 'Charlotte Wickham'],
            year: 2013,
            venue: 'Geoinformatics & Geostatistics: An Overview',
            doiOrArxiv: '10.4172/2327-4581.1000101',
            openAccessUrl: 'https://static.berkeleyearth.org/papers/Results-Paper-Berkeley-Earth.pdf',
            canonicalUrl: 'https://berkeleyearth.org/archive/summary-of-findings/',
            paperType: 'applied',
            difficulty: 'intermediate',
            prerequisites: ['Descriptive Statistics, Correlation & Time-Series Basics'],
            summary: 'The original Berkeley Earth methodology paper describing exactly how the global land-surface temperature record used in this capstone was constructed and validated from over a billion individual station observations.',
            whyItMatters: 'This is the actual scientific documentation for the exact dataset this capstone analyzes — reading it is the difference between treating Complete_TAVG_complete.txt as a random file of numbers and understanding precisely what its anomaly and uncertainty columns represent and how they were derived.',
            sectionsToRead: 'Abstract; the sections describing the anomaly method and the reported land-temperature trend since the 1950s.',
            readingQuestions: [
              'What specific temperature-rise figure does the paper report for the 1950s-decade-to-2000s-decade comparison, and how was it computed?',
              'How does the paper\'s described methodology relate to the "annual_anomaly" and "twenty_yr_anomaly" columns you will work with directly in this capstone?',
            ],
            relatedTopicIds: ['nasa102-t5'],
            accessStatus: 'open-access',
            deliveryMode: 'in-app-pdf-candidate',
          },
        ],
        exercise: {
          id: 'nasa102-t5-ex1',
          type: 'free-response',
          question: 'Before writing any code, state in one or two sentences what specific, falsifiable question you intend to answer about the Berkeley Earth global temperature record (not "analyze the data," but a real, checkable question).',
          explanation: 'A strong question is specific and checkable against the data, for example: "Has the 10-year rolling average anomaly increased monotonically (with no multi-decade reversal) since 1975?" or "Is the rate of change in the 20-year rolling average larger in the second half of the record than the first half?" A weak, unfalsifiable question like "what does the data show about climate" gives no way to know when you have actually answered it — this is the same problem-framing discipline used throughout data science, not unique to this dataset.',
        },
        additionalExercises: [
          { id: 'nasa102-t5-ex2', type: 'code-snippet', question: 'The Berkeley Earth data file has roughly 30 lines of "%"-prefixed comments before the actual data begins. Write the Pandas call that correctly skips these comment lines when loading the file, given that the data columns are whitespace-separated, not comma-separated.', explanation: 'pd.read_csv(path, comment="%", delim_whitespace=True, header=None, names=["year", "month", "monthly_anomaly", "monthly_unc", "annual_anomaly", "annual_unc", "five_yr_anomaly", "five_yr_unc", "ten_yr_anomaly", "ten_yr_unc", "twenty_yr_anomaly", "twenty_yr_unc"]) — the comment="%" argument tells Pandas to ignore any line starting with that character, and delim_whitespace=True handles the file\'s whitespace-separated (not comma-separated) column format. (In recent pandas versions, sep="\\\\s+" is the non-deprecated equivalent of delim_whitespace=True.)' },
          { id: 'nasa102-t5-ex3', type: 'free-response', question: 'Your loaded DataFrame has a "twenty_yr_anomaly" column full of NaN for the first several decades of the record. Explain why this is expected and correct, not a data-quality bug you need to fix.', explanation: 'A 20-year rolling average, by definition, cannot be computed until 20 full years of underlying data exist — the file\'s own documentation states these rolling columns are centered on a window of surrounding months, so the very first and last stretches of any rolling column will always be NaN simply because a full window is not yet available at the edges of the record. This is the expected, correct behavior of any rolling calculation (matching Week 2\'s own rolling-average topic), not something to drop or "fix" by filling in a fabricated value.' },
        ],
        lab: {
          id: 'nasa102-lab5',
          title: 'Weekly Challenge: Earth Data Explorer',
          type: 'python',
          language: 'python',
          practiceMode: 'independent',
          level: 'level-3',
          estimatedMinutes: 180,
          instructions:
            'MISSION NAME: Earth Data Explorer.\n\n' +
            'REAL-WORLD PROBLEM: Understanding whether — and how much — Earth\'s surface temperature has genuinely changed over time is one of the most consequential real-world data-analysis questions there is, and answering it honestly requires exactly the skills this whole course has built: loading a real messy file, cleaning it, computing real statistics, visualizing it, and finding and explaining a genuine, defensible pattern rather than a vague impression.\n\n' +
            'SKILLS BEING TESTED: every skill from this course, combined into one real, independent, end-to-end analysis: file loading and cleaning, NumPy/Pandas manipulation, descriptive statistics, correlation, rolling averages, and honest, correctly-labeled visualization.\n\n' +
            'CONCEPTS YOU MUST APPLY: pd.read_csv with comment/whitespace handling, missing-value awareness (NaN in early rolling columns), descriptive statistics, correlation, custom rolling averages, and at least two different chart types.\n\n' +
            'OBJECTIVES (in order):\n' +
            '1. Download the real dataset directly (see DATASET/API REQUIREMENTS below) and load it into a Pandas DataFrame, correctly skipping the comment header and parsing the whitespace-separated columns.\n' +
            '2. Clean the DataFrame: confirm the year/month columns are read as the correct numeric types, and explicitly document (in a comment or markdown note) which columns legitimately contain NaN and why, per this topic\'s concepts.\n' +
            '3. Compute descriptive statistics (mean, median, standard deviation) of the annual anomaly column for two different multi-decade sub-periods you choose yourself (e.g. 1900-1960 vs. 1990-2050, adjusted to whatever full decades the real file actually contains), and compare them.\n' +
            '4. Using only the monthly_anomaly column and Pandas\'s own .rolling() method, compute your own 10-year rolling average, and compare it visually and numerically against the file\'s own provided ten_yr_anomaly column to confirm your understanding matches the data producer\'s method.\n' +
            '5. Produce at least two Matplotlib charts: a fully labeled line chart of the annual anomaly over the full record with your 10-year rolling average overlaid, and a histogram comparing the distribution of annual anomalies in your two chosen sub-periods (as two overlaid or side-by-side histograms).\n' +
            '6. State your specific, falsifiable pattern claim (from this topic\'s first exercise), present the exact numbers and chart(s) that support or refute it, and write a short paragraph explaining why this pattern would matter to a real person or system, being explicit about what the data does and does not prove.\n\n' +
            'REQUIRED TOOLS: Pandas, NumPy, Matplotlib.\n\n' +
            'DATASET/API REQUIREMENTS: the real Berkeley Earth global land-surface average temperature file, freely downloadable with no account or authentication required, directly from: https://berkeley-earth-temperature.s3.us-west-1.amazonaws.com/Global/Complete_TAVG_complete.txt (documented at https://berkeleyearth.org/data/). This is a static file download, not a live API — no network calls are required at analysis time once the file is saved locally.\n\n' +
            'DELIVERABLES: the loading/cleaning code with its documentation of legitimate NaN values, the sub-period statistics comparison, the custom-vs-provided rolling-average check, the two required charts (fully labeled), and the written pattern claim with its supporting evidence and its real-world explanation.\n\n' +
            'CONSTRAINTS: your pattern claim must be specific and falsifiable (per this topic\'s first exercise), every chart must be fully labeled per Week 2\'s visualization standards, and your written explanation must explicitly state what the data does and does not prove — no causal claims beyond what a correlation or trend can actually support.\n\n' +
            'DIFFICULTY: advanced (for Phase 1) — this is the capstone combining every prior topic in this course.\n\n' +
            'EVALUATION RUBRIC (100 points, adapted for a NASA-agnostic Phase 1 capstone): Technical Execution /20 (loading, cleaning, and computation are all correct), Data & Statistical Understanding /20 (the NaN explanation, sub-period comparison, and rolling-average check are all correct and understood, not just copied), Creativity /20 (the chosen sub-periods, chart design, or extra analysis go beyond the stated minimum), Real-World Impact /20 (the written explanation connects the pattern to a genuine, well-reasoned consequence), Presentation /20 (charts are clearly labeled and the write-up is clear enough for a stranger to follow without you present to explain it).\n\n' +
            'COMMON MISTAKES TO AVOID: trying to load the file with plain pd.read_csv() defaults and getting garbage from the comment header; treating the early-decades NaN values in the rolling columns as a bug to "fix" by filling them in; claiming the data "proves" a specific cause rather than describing what the trend itself does and does not show; submitting an untitled or unlabeled chart.\n\n' +
            'BONUS OBJECTIVES: also compute and report the single hottest and coldest year in the full record by annual anomaly, and cross-check whether your specific pattern claim still holds if you exclude the most recent 5 years of data — a basic robustness check on your own conclusion.\n\n' +
            'REFLECTION QUESTIONS:\n' +
            '1. What is the strongest objection a skeptical reader could raise against your specific pattern claim, and how would your existing analysis (or an additional check) answer it?\n' +
            '2. Which single skill from Weeks 1-2 turned out to matter most in actually completing this capstone, and why?\n' +
            '3. Now that you have done this once by hand with a general climate file, what do you expect will be different — harder or easier — once Phase 2 introduces NASA-specific satellite and Earth-observation data formats?',
          objective: 'Independently load, clean, analyze, and visualize a real global temperature dataset, and state and defend one specific, falsifiable, evidence-backed pattern.',
          starterCode: 'import pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\n\n# Data source (download once, then load locally):\n# https://berkeley-earth-temperature.s3.us-west-1.amazonaws.com/Global/Complete_TAVG_complete.txt\n\nCOLUMNS = [\n    "year", "month",\n    "monthly_anomaly", "monthly_unc",\n    "annual_anomaly", "annual_unc",\n    "five_yr_anomaly", "five_yr_unc",\n    "ten_yr_anomaly", "ten_yr_unc",\n    "twenty_yr_anomaly", "twenty_yr_unc",\n]\n\n# TODO: df = pd.read_csv("Complete_TAVG_complete.txt", comment="%", sep=r"\\s+", header=None, names=COLUMNS)\n\n# TODO: document which columns legitimately contain NaN and why\n\n# TODO: compare descriptive statistics between two chosen multi-decade sub-periods\n\n# TODO: compute your own 10-year rolling average of monthly_anomaly and compare to ten_yr_anomaly\n\n# TODO: two labeled charts (annual trend + rolling average; sub-period histograms)\n\n# TODO: state your falsifiable pattern claim, the supporting evidence, and its real-world explanation\n',
        },
        checklist: [
          'Load a real, uncleaned scientific data file with a nonstandard comment/whitespace format into Pandas correctly',
          'Explain why early-record NaN values in rolling-average columns are expected, not a bug',
          'Compute and compare descriptive statistics across two self-chosen sub-periods',
          'Compute a custom rolling average and validate it against a data producer\'s own provided column',
          'State a specific, falsifiable pattern claim and support it with both numbers and a labeled chart',
          'Explain a found pattern\'s real-world significance without overclaiming causation',
        ],
        misconceptions: [
          'Misconception: this capstone is "just Week 2\'s exercises again, with real data." Reality: real data adds genuine friction Week 2\'s synthetic examples deliberately avoided — a nonstandard file format, undocumented-until-you-read-the-header conventions, and no guaranteed clean answer — which is exactly why completing it independently is the actual test of whether Phase 1\'s skills transfer to a real problem.',
          'Misconception: because this is a "climate" dataset, using it here means this platform has broken its NASA-agnostic Phase 1 design. Reality: Berkeley Earth is an independent nonprofit temperature-analysis project, unaffiliated with NASA, chosen deliberately so this capstone can be genuinely NASA-agnostic while still being a real, scientifically meaningful environmental dataset.',
          'Misconception: a good capstone write-up should claim the analysis "proves" climate change is happening or not happening. Reality: a single dataset and a multi-decade trend comparison can support a specific, falsifiable claim about that dataset\'s own recorded pattern — it cannot, on its own, settle a claim of that scope, and an honest write-up says exactly what the evidence does and does not establish.',
          'Misconception: the file\'s own provided rolling-average columns should just be used directly, since recomputing them is redundant busywork. Reality: recomputing one of them yourself and checking it against the provided column is the concrete proof that you understand what a rolling average actually is, rather than trusting a column whose computation you cannot verify.',
        ],
        glossary: [
          { term: 'Temperature anomaly', definition: 'The difference between a measured temperature and a fixed historical baseline average for the same time period (here, 1951-1980), the standard way climate datasets report and compare change over time rather than using absolute temperatures.' },
          { term: 'Baseline period', definition: 'The fixed historical time window (1951-1980 in this dataset) against which every anomaly value is measured; changing the baseline period shifts every anomaly value by a constant but does not change the shape or trend of the data.' },
          { term: 'Falsifiable claim', definition: 'A statement specific enough that it could, in principle, be shown false by the data — the standard this capstone requires for its "pattern," as opposed to a vague, unchecked impression.' },
          { term: 'Robustness check', definition: 'A follow-up test of whether a conclusion still holds under a small, reasonable change to the analysis (e.g. excluding the most recent few years), used to gauge how much a finding depends on a specific analytical choice.' },
          { term: 'Comment-prefixed file header', definition: 'Lines at the start of a real data file (often prefixed with % or # ) containing metadata and methodology notes rather than data, which must be explicitly skipped when loading the file, as this capstone\'s dataset requires.' },
        ],
        readingQuestions: [
          'Why does reporting a temperature anomaly, rather than an absolute temperature, make different times and places easier to compare fairly?',
          'What specifically distinguishes a falsifiable pattern claim from a vague one, and why does this capstone require the former?',
          'Why does recomputing one of the file\'s own provided rolling-average columns yourself demonstrate real understanding in a way that simply reading the column does not?',
        ],
        simpleExplanation:
          'This capstone hands you one real, publicly published file instead of the friendly practice examples from earlier in the week, and real files are messier in specific, predictable ways: this one opens with about thirty lines of plain-English notes explaining how the data was produced, before the actual numbers even begin — exactly the kind of thing a naive pd.read_csv() call would choke on, and exactly the kind of thing this whole course has been quietly preparing you to expect and handle calmly instead of panicking over.\n\n' +
          'The numbers themselves are not raw temperatures, they are "anomalies" — how far a given month or year sat above or below the long-term average from a fixed reference period decades ago. This is a deliberate scientific choice, not an arbitrary complication: reporting "1.2 degrees above the usual" is directly comparable across different times and places in a way that "23.4 degrees" alone is not, since 23.4 degrees means something completely different in January than in July, and something different again depending on where on Earth you are standing.\n\n' +
          'The actual assignment here is not just to make some charts — anyone can make a chart. It is to state, out loud and in advance, one specific thing you think this data shows, precise enough that someone else could check your exact claim against your exact chart and either agree or catch you being wrong. That is a genuinely different, harder, and more honest task than "explore the data and see what\'s interesting," and it is the same discipline every real scientist, analyst, and journalist is supposed to hold themselves to before publishing a conclusion — which is exactly why this is the project that closes out Phase 1, instead of one more guided exercise.',
        realWorldApplications: [
          { title: "Berkeley Earth's own published global temperature analysis", description: 'The exact dataset this capstone uses is the same one Berkeley Earth — an independent, donor-funded nonprofit founded in part to provide a rigorous, from-scratch replication of global temperature analysis — publishes and updates monthly for public and scientific use, meaning this capstone is a genuine, if smaller-scale, repetition of real published climate science methodology.' },
          { title: 'IPCC and national climate reports built on anomaly-based trend analysis', description: 'Major climate assessment reports worldwide are built on exactly this anomaly-and-rolling-average methodology — comparing a baseline period to more recent data — because it is the most direct, defensible way to demonstrate a long-term trend while being transparent about the uncertainty and noise in any single year\'s measurement.' },
          { title: 'The general "load real messy file, clean it, find and defend one claim" pattern in every data-analyst job', description: 'This capstone\'s exact shape — a real file with a nonstandard format, a specific claim to state and defend with evidence, and an honest accounting of what the data does and does not prove — is functionally the daily task of a working data analyst, not a simplified classroom version of one.' },
        ],
        primaryLecture: makeVerifiedVideo({
          id: 'nasa102-t5-lec',
          title: 'Statistical Analysis of Temperature Data | Time Series Analysis in Python | Weather Derivatives',
          institution: 'QuantPy',
          videoId: '4zV-ZyQHl7s',
          durationMinutes: 25,
          instructor: 'QuantPy',
        }),
        primaryText: {
          id: 'book-berkeley-earth-data',
          title: 'Berkeley Earth — Data Overview (Global Land-Surface Temperature Record)',
          authors: ['Berkeley Earth'],
          url: 'https://berkeleyearth.org/data/',
          canonicalUrl: 'https://berkeleyearth.org/data/',
          recommendedChapter: 'Global temperature summary files (Complete_TAVG_complete.txt) and methodology notes',
          accessStatus: 'open-access',
          publisherOrInstitution: 'Berkeley Earth',
          deliveryMode: 'official-web-resource',
        },
      },
    ],
    project: {
      title: 'Earth Data Explorer',
      description:
        'The Phase 1 capstone: an independent, end-to-end analysis of the real Berkeley Earth global land-surface temperature record (Complete_TAVG_complete.txt) — load it correctly despite its nonstandard comment/whitespace format, document its legitimate missing values, compute and compare real descriptive statistics across self-chosen sub-periods, validate a self-computed rolling average against the file\'s own provided column, produce fully labeled charts, and state and defend one specific, falsifiable pattern with honest reasoning about what the evidence does and does not prove.',
      constraints: [
        'Must use the real Berkeley Earth dataset (or an equivalent real, freely-downloadable environmental dataset approved as a substitute), not synthetic data',
        'The stated pattern claim must be specific and falsifiable, not a vague impression',
        'Every chart must be fully titled, axis-labeled with units, and use a legend where more than one series is shown',
        'The written explanation must not claim more than the evidence supports (no unqualified causal claims)',
      ],
      expectedDeliverables: [
        'Cleaned, correctly-typed DataFrame loaded from the real source file, with documented legitimate NaN values',
        'A sub-period descriptive-statistics comparison and a self-computed rolling average validated against the file\'s own column',
        'At least two fully labeled Matplotlib charts',
        'A written, falsifiable pattern claim with supporting evidence and an honest real-world explanation',
      ],
      evaluationRubric: [
        { criterion: 'Technical Execution', weight: '20%', description: 'Loading, cleaning, and computation are all correct on the real, messy source file.' },
        { criterion: 'Data & Statistical Understanding', weight: '20%', description: 'NaN handling, sub-period comparison, and the rolling-average validation are correct and demonstrably understood.' },
        { criterion: 'Creativity', weight: '20%', description: 'Sub-period choice, chart design, or extra analysis meaningfully exceed the stated minimum.' },
        { criterion: 'Real-World Impact', weight: '20%', description: 'The written explanation connects the found pattern to a genuine, well-reasoned real-world consequence.' },
        { criterion: 'Presentation', weight: '20%', description: 'Charts are fully labeled and the write-up is clear enough for a stranger to follow unaided.' },
      ],
    },
  },
];

export const NASA_SPACE_APPS_COURSES: Course[] = definitions.map(makeCourse);

