import { CurriculumModule } from '../../types/curriculum';
import { VERIFIED_VIDEOS } from '../verifiedVideoRegistry';

export const phase8SpecializationModules: CurriculumModule[] = [
  {
    id: 'p8-m19',
    phaseId: 8,
    title: 'Advanced Specializations',
    slug: 'advanced-specializations',
    category: 'cs',
    summary: 'Explore Distributed Systems, Data Engineering, Natural Language Processing, Computer Vision, and Responsible AI Systems.',
    objective: 'Synthesize computer science, mathematics, and machine learning into specialized domains like Consensus Protocols, Large Scale Distributed Storage, and Ethical AI Governance.',
    prerequisiteModuleIds: ['p3-m13', 'p6-m17', 'p7-m18'],
    estimatedHours: 40,
    difficulty: 'advanced',
    colorAccent: 'yellow',
    capstone: {
      id: 'capstone-p8-m19',
      title: 'Distributed Consensus & Fault-Tolerant State Machine Simulator',
      description: 'Implement a distributed Raft consensus state machine simulator modeling leader election, log replication, and network partition recovery.',
      constraints: ['Pure Python message-passing simulation.'],
      expectedDeliverables: ['Leader election algorithm.', 'Log replication protocol.', 'Network partition fault tolerance recovery.'],
      evaluationRubric: [
        { criterion: 'Consensus Correctness', weight: '50%', description: 'Nodes elect a single valid leader and agree on log entries.' },
        { criterion: 'Fault Tolerance Resilience', weight: '50%', description: 'System recovers consistency after network partition resolution.' }
      ]
    },
    topics: [
      {
        id: 'p8-m19-t1',
        moduleId: 'p8-m19',
        title: 'Distributed Consensus, CAP Theorem, and Raft Protocol',
        slug: 'distributed-consensus-raft-cap',
        summary: 'Master Distributed Systems, Consistency vs Availability trade-offs (CAP Theorem), Vector Clocks, and Raft Consensus.',
        order: 1,
        masteryPack: {
          learningObjective: 'Analyze trade-offs in distributed systems, prove safety under network partitions, and trace Raft leader election state machines.',
          prerequisites: ['Networking fundamentals', 'Operating Systems and Data Structures'],
          coreConcepts: [
            'Distributed Systems Challenges: Asynchronous Networks, Clock Skew, Partial Failures',
            'CAP Theorem: Consistency, Availability, Partition Tolerance',
            'Logical Clocks & Vector Clocks for Causal Ordering',
            'Consensus Problem and Raft Protocol State Machine (Follower, Candidate, Leader)',
            'Log Replication, Heartbeats, and Quorum Voting'
          ],
          primaryLecture: VERIFIED_VIDEOS['p8-m19-t1'] as any,
          primaryText: {
            id: 'book-ddia',
            title: 'Designing Data-Intensive Applications (Open Course Materials & Notes)',
            authors: ['Martin Kleppmann'],
            url: 'https://dataintensive.net/',
            recommendedChapter: 'Chapter 8: The Trouble with Distributed Systems & Chapter 9: Consistency and Consensus',
            publisherOrInstitution: 'O’Reilly / Cambridge University Materials',
            accessStatus: 'verified'
          },
          recommendedChapter: 'Chapter 9: Consistency and Consensus',
          authoritativeResearchSource: {
            id: 'paper-ongaro-2014',
            title: 'In Search of an Understandable Consensus Algorithm (Raft)',
            authors: ['Diego Ongaro', 'John Ousterhout'],
            year: 2014,
            venue: 'USENIX Annual Technical Conference (ATC)',
            openAccessUrl: 'https://raft.github.io/raft.pdf',
            paperType: 'seminal',
            difficulty: 'advanced',
            prerequisites: ['Distributed systems concepts'],
            summary: 'The breakthrough USENIX paper introducing Raft as an equivalent but significantly more understandable consensus algorithm than Paxos.',
            whyItMatters: 'Powers modern distributed data stores like etcd, Kubernetes, CockroachDB, and Consul.',
            sectionsToRead: 'Sections 1–5: Raft Consensus Algorithm Details',
            readingQuestions: [
              'How does Raft decompose consensus into Leader Election, Log Replication, and Safety?',
              'Why is a majority quorum (N/2 + 1) required to elect a leader and commit log entries?'
            ],
            relatedTopicIds: ['p8-m19-t1'],
            accessStatus: 'verified'
          },
          practicalExercises: [
            {
              id: 'ex-p8-1',
              question: 'In a 5-node Raft cluster, what is the minimum quorum number of nodes required to commit a log entry?',
              options: ['3 nodes', '5 nodes', '2 nodes', '4 nodes'],
              correctAnswer: 0,
              explanation: 'Quorum size is floor(N/2) + 1. For N = 5, floor(5/2) + 1 = 2 + 1 = 3 nodes.',
              type: 'multiple-choice'
            }
          ],
          interactiveLab: {
            id: 'lab-p8-1',
            title: 'Raft Consensus State Machine Simulator',
            type: 'python',
            instructions: 'Write a Python simulator modeling Raft leader election vote tallying and term incrementation.',
            starterCode: `import random

class RaftNode:
    def __init__(self, node_id, total_nodes):
        self.node_id = node_id
        self.total_nodes = total_nodes
        self.current_term = 0
        self.voted_for = None
        self.state = 'FOLLOWER' # FOLLOWER, CANDIDATE, LEADER

    def start_election(self):
        self.current_term += 1
        self.state = 'CANDIDATE'
        self.voted_for = self.node_id
        votes_received = 1  # Vote for self
        
        # Request votes from peer nodes
        for peer in range(self.total_nodes):
            if peer != self.node_id:
                # Simulate peer vote decision
                if random.random() > 0.3:  # 70% chance peer grants vote
                    votes_received += 1
                    
        quorum = (self.total_nodes // 2) + 1
        if votes_received >= quorum:
            self.state = 'LEADER'
            return True, votes_received
        else:
            self.state = 'FOLLOWER'
            return False, votes_received

# Simulate 5-node cluster election
cluster_size = 5
node_0 = RaftNode(node_id=0, total_nodes=cluster_size)
won, votes = node_0.start_election()
print(f"Term {node_0.current_term} Election Result: Votes = {votes}/{cluster_size}, Won = {won}, State = {node_0.state}")
`,
            testCases: [
              {
                expectedOutput: 'Election Result:',
                description: 'Validates Raft quorum vote count and leader transition.'
              }
            ]
          },
          readingQuestions: [
            'Why cannot a distributed database guarantee both Strict Consistency and High Availability during a network partition (CAP Theorem)?',
            'How does the Raft election timer prevent split-vote deadlocks during leader elections?'
          ],
          masteryChecklist: [
            'Explain the trade-offs defined by the CAP Theorem.',
            'Trace Raft election steps, terms, and log matching properties.',
            'Differentiate between Paxos, Raft, and PBFT consensus protocols.'
          ],
          capstoneMilestone: 'Milestone 1: Fault-tolerant distributed consensus simulator.',
          estimatedStudyMinutes: 240,
          difficulty: 'advanced',
          glossary: [
            { term: 'Raft Consensus', definition: 'A consensus algorithm designed for manageability and fault-tolerance in replicated state machines.' },
            { term: 'CAP Theorem', definition: 'States that any distributed data store can simultaneously provide at most two of three guarantees: Consistency, Availability, and Partition Tolerance.' }
          ],
          commonMisconceptions: [
            'Misconception: A system can "choose" Partition Tolerance off in a distributed network. Reality: Network partitions are physical realities; systems must choose between Consistency or Availability during partitions.'
          ],
          connectionsToLaterModules: [
            'Capstone synthesis connecting Computer Science, Systems, and Scalable MLOps.'
          ],
          citation: { text: 'Ongaro, D., & Ousterhout, J. (2014). In Search of an Understandable Consensus Algorithm. USENIX ATC 2014.' },
          accessStatus: 'verified'
        }
      }
    ]
  }
];
