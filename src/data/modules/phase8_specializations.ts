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
            'Distributed Systems Challenges: Asynchronous Networks, Clock Skew, Partial Failures: Unlike a single machine, a distributed system must tolerate messages arriving out of order or not at all, clocks on different nodes drifting apart, and individual nodes crashing while others keep running — designing correct algorithms under these conditions, rather than assuming a synchronous, reliable network, is the central challenge of distributed systems and directly underlies how large-scale ML training and serving clusters stay correct and available.',
            'CAP Theorem: Consistency, Availability, Partition Tolerance: The CAP theorem proves that when a network partition occurs (unavoidable at scale), a distributed data store must choose between returning the most recent write (Consistency) or always responding to requests even with possibly stale data (Availability) — it cannot guarantee both simultaneously, so understanding this trade-off is essential for choosing the right database or coordination service for a given system\'s requirements.',
            'Logical Clocks & Vector Clocks for Causal Ordering: Because physical clocks on different machines cannot be perfectly synchronized, distributed systems use logical clocks (like Lamport timestamps) or vector clocks to establish a causally-correct ordering of events across nodes without relying on wall-clock time, which is what lets systems detect whether one event happened-before another or whether they were truly concurrent.',
            'Consensus Problem and Raft Protocol State Machine (Follower, Candidate, Leader): The consensus problem asks how a cluster of nodes, some of which may fail, can agree on a single value or sequence of operations; Raft solves this by having nodes cycle through Follower, Candidate, and Leader states with randomized election timers, decomposing consensus into understandable sub-problems (leader election, log replication, safety) that were historically much harder to reason about in the equivalent Paxos protocol.',
            'Log Replication, Heartbeats, and Quorum Voting: Once a leader is elected, it replicates every state-changing operation as an entry in an append-only log to a majority (quorum) of followers before considering it committed, while periodic heartbeat messages both keep followers from starting new elections and let the leader detect follower failures — this majority-quorum requirement is what guarantees the cluster stays consistent even if a minority of nodes are down or partitioned.',
            'Split-Brain and Network Partitions: A network partition can split a cluster into two or more groups of nodes that can each communicate internally but not with each other, risking a "split-brain" scenario where more than one group believes it is authoritative; Raft\'s majority-quorum requirement prevents this by guaranteeing at most one partition can contain a majority of nodes at any given term.',
            'Trade-offs Between Consensus Protocols (Raft vs. Paxos vs. PBFT): Raft and Paxos both assume nodes may crash but not act maliciously (the "crash-fault-tolerant" model) and both require a simple majority quorum, while Byzantine Fault Tolerant protocols like PBFT tolerate nodes that actively lie or behave arbitrarily at the cost of needing a larger supermajority and significantly higher message complexity — the right choice depends on the trust model of the deployment environment.'
          ],
          simpleExplanation: `Picture five friends trying to agree on where to eat dinner, but they can only communicate by passing notes through a slow, unreliable mail system where notes sometimes arrive late, out of order, or get lost entirely. That is the core challenge of distributed systems: computers spread across different machines can't just shout across the room to each other — they have to coordinate over a network that might delay, drop, or reorder their messages, all while any individual computer might crash without warning. Any agreement they reach has to survive that messiness.

Now suppose, mid-conversation, the group gets physically split into two rooms and the connecting door locks — a network partition. Each room still has friends who want to keep planning. They have two options: everyone waits, refusing to make a final decision until the door reopens and both rooms can compare notes (favoring being right over being fast — that's Consistency), or each room goes ahead and picks its own restaurant independently, risking that the two rooms disagree (favoring always giving an answer — that's Availability). The CAP theorem is just the observation that during a split like this, a system cannot have both perfect agreement and an instant answer from everyone — it has to pick one.

Raft is one clever way computers elect a single leader to make decisions on the group's behalf, similar to a classroom where, if the teacher suddenly leaves, every student silently counts down from a random number before raising a hand to volunteer as the substitute. Because the countdowns are randomized, usually only one student's hand goes up first, and everyone else votes for that student the moment they see a hand raised, avoiding the chaos of everyone shouting "me!" at the exact same time. If nobody gets enough votes because two countdowns happened to finish together, they simply try again with a fresh random countdown.

Once elected, the leader doesn't act alone either. Before treating any decision as final, it needs a majority of the group — a quorum — to confirm they've written it down too, the same way a decision only counts as official once more than half a club has signed off on it in their own notebooks. This majority rule is the trick that prevents two different rooms from each electing their own leader and both confidently issuing conflicting instructions at once: since any two majorities drawn from the same group must share at least one common member, there is mathematically no way for two separate "majorities" to disagree about who is in charge during the same round.`,
          realWorldApplications: [
            {
              title: "etcd, Kubernetes' cluster coordination store",
              description: 'Kubernetes relies on etcd, a distributed key-value store built directly on the Raft consensus protocol, to keep a single consistent source of truth for cluster configuration and state across all of its control-plane nodes.'
            },
            {
              title: 'CockroachDB',
              description: 'CockroachDB uses Raft consensus to replicate data across nodes and data centers, requiring quorum agreement on writes so the database keeps working correctly even when some replicas fail or a network partition occurs.'
            },
            {
              title: 'HashiCorp Consul',
              description: 'Consul, widely used for service discovery and configuration in distributed systems, uses the Raft protocol internally to elect a leader server and keep its service registry consistent across a cluster.'
            },
            {
              title: 'Amazon DynamoDB',
              description: "DynamoDB's design explicitly leans toward the Availability side of the CAP theorem, using eventual consistency and versioning techniques descended from vector clocks to keep responding to reads and writes even during network partitions."
            },
            {
              title: 'MongoDB replica sets',
              description: 'MongoDB replica sets use a Raft-like leader-election protocol to choose a primary node among replicas and require acknowledgment from a majority of members before a write is considered durably committed.'
            }
          ],
          primaryLecture: VERIFIED_VIDEOS['p8-m19-t1'] as any,
          primaryText: {
            id: 'book-ddia',
            title: 'Designing Data-Intensive Applications (Open Course Materials & Notes)',
            authors: ['Martin Kleppmann'],
            url: 'https://dataintensive.net/',
        pdfUrl: 'https://raft.github.io/raft.pdf',
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
            },
            {
              id: 'ex-p8-2',
              question: 'During a network partition, a distributed database configured for strong consistency refuses to serve read requests on the minority side of the partition until connectivity is restored. Which CAP theorem trade-off does this represent?',
              options: [
                'Choosing Consistency over Availability (CP)',
                'Choosing Availability over Consistency (AP)',
                'Achieving both Consistency and Availability simultaneously',
                'Opting out of Partition Tolerance'
              ],
              correctAnswer: 0,
              explanation: 'By refusing to serve potentially stale reads during the partition, the system prioritizes Consistency (CP) at the cost of Availability on the minority side. An AP system would instead keep serving reads/writes on both sides, risking stale or conflicting data.',
              type: 'multiple-choice'
            },
            {
              id: 'ex-p8-3',
              question: 'Derive the general formula for the minimum quorum size in an N-node Raft cluster, and explain why a quorum-based approach guarantees that two independently elected leaders can never both believe they hold a majority in the same term.',
              explanation: 'Minimum quorum size is floor(N/2) + 1. Proof sketch: any two subsets of nodes each of size at least floor(N/2)+1 must overlap by at least one node, since 2*(floor(N/2)+1) > N for any N. Because Raft requires a candidate to receive votes from a quorum before becoming leader, and each node votes for at most one candidate per term, any two quorums formed in the same term must share at least one common voter — that shared voter cannot have voted for two different candidates in the same term, so at most one candidate can win a majority per term, preventing two simultaneous leaders.',
              type: 'free-response'
            },
            {
              id: 'ex-p8-4',
              question: 'In a 5-node Raft cluster, an engineer observes that leader elections repeatedly fail with vote splits (no candidate reaches quorum) whenever the current leader crashes. What mechanism does Raft use to reduce the likelihood of repeated split votes, and how does it work?',
              explanation: 'Raft uses randomized election timeouts: each follower waits a randomly chosen duration (drawn from a fixed range, e.g., 150-300ms) before becoming a candidate and starting a new election. Randomization makes it statistically unlikely that multiple followers time out and become candidates simultaneously in the same term, so usually only one candidate requests votes first and wins a majority before others time out, resolving elections quickly. If a split vote does happen, each affected candidate simply waits out another randomized timeout and retries in a new term.',
              type: 'free-response'
            },
            {
              id: 'ex-p8-5',
              question: 'Node A has vector clock [2,1,0] and Node B has vector clock [1,2,0] (for nodes A, B, C respectively). What can you conclude about the relationship between the events these vector clocks represent?',
              options: [
                'The events are concurrent (neither happened-before the other), since neither vector clock is element-wise greater than or equal to the other',
                'Event A definitely happened before Event B',
                'Event B definitely happened before Event A',
                'The vector clocks indicate a network partition occurred'
              ],
              correctAnswer: 0,
              explanation: 'One vector clock happened-before another only if it is less than or equal to the other in every component and strictly less in at least one. Here [2,1,0] vs [1,2,0]: A\'s clock has a larger first component but a smaller second component than B\'s, so neither dominates the other — the events are concurrent, meaning neither is causally derived from the other.',
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
            'How does the Raft election timer prevent split-vote deadlocks during leader elections?',
            'Why is a strict majority (rather than any fixed number) required for a Raft quorum, and how does that guarantee prevent two leaders from being elected in the same term?',
            'How do vector clocks let a distributed system distinguish concurrent events from causally ordered events without synchronized physical clocks?',
            'What is the practical difference between a crash-fault-tolerant protocol like Raft and a Byzantine-fault-tolerant protocol like PBFT, and when would you need the latter?',
            'Why does Raft guarantee safety (no two conflicting committed entries) even though it may temporarily sacrifice liveness (progress) during a network partition?'
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
            { term: 'Raft Consensus', definition: 'A consensus algorithm designed for understandability and fault tolerance in replicated state machines, decomposing consensus into leader election, log replication, and safety.' },
            { term: 'CAP Theorem', definition: 'States that any distributed data store experiencing a network partition can provide at most two of three guarantees simultaneously: Consistency, Availability, and Partition Tolerance; since partitions are unavoidable at scale, this is effectively a choice between Consistency and Availability during a partition.' },
            { term: 'Quorum', definition: 'The minimum number of nodes (typically a strict majority, floor(N/2)+1) that must agree before an operation such as a leader election or log commit is considered valid, guaranteeing that any two quorums in a cluster must overlap by at least one node.' },
            { term: 'Leader Election', definition: 'The process by which nodes in a distributed cluster agree on a single coordinating node (the leader) responsible for handling client requests and replicating the log, typically triggered when followers stop receiving heartbeats from the current leader within a randomized election timeout.' },
            { term: 'Log Replication', definition: 'The process of a consensus leader appending each state-changing operation to its local log and then propagating that entry to follower nodes, considering the entry committed only once a quorum of nodes has stored it durably.' },
            { term: 'Vector Clock', definition: 'A data structure consisting of one counter per node that is incremented on local events and merged on message receipt, used to determine the partial causal ordering of events across a distributed system without relying on synchronized physical clocks.' },
            { term: 'Network Partition', definition: 'A failure scenario in which a network fault splits a cluster into subgroups of nodes that can communicate within their own subgroup but not across subgroups, which is the exact condition the CAP theorem\'s "Partition Tolerance" guarantee addresses.' },
            { term: 'Byzantine Fault Tolerance (BFT)', definition: 'The property of a distributed system that continues to function correctly even when some nodes fail arbitrarily or maliciously (e.g., sending conflicting information to different peers), as opposed to the weaker crash-fault-tolerance model assumed by protocols like Raft and Paxos.' },
            { term: 'Idempotency', definition: 'A property where applying the same operation multiple times produces the same result as applying it once; distributed systems rely on idempotent operations to safely retry requests after timeouts or failures without corrupting state.' },
            { term: 'Eventual Consistency', definition: 'A consistency model in which, if no new updates are made to a given data item, all replicas will eventually converge to the same value, trading immediate consistency for higher availability and lower latency — the opposite end of the spectrum from the strong consistency Raft provides.' }
          ],
          commonMisconceptions: [
            'Misconception: A system can "choose" Partition Tolerance off in a distributed network. Reality: Network partitions are physical realities that any system spanning multiple nodes or data centers must eventually face, so real design decisions are about choosing Consistency or Availability during a partition, not whether to tolerate partitions at all.',
            'Misconception: Raft and Paxos guarantee the system will always make progress. Reality: Consensus protocols guarantee safety (nodes never disagree on committed values) but can pause making progress (liveness) during extended network partitions or repeated split votes, by design — sacrificing availability to preserve correctness.',
            'Misconception: A larger cluster is always more fault-tolerant. Reality: Fault tolerance depends on quorum size relative to cluster size (a cluster tolerates floor((N-1)/2) failures), and larger clusters also increase the number of nodes that must participate in every quorum vote, which can increase latency and the chance of a majority partition failing — cluster size must be balanced against these costs, not simply maximized.',
            'Misconception: Vector clocks and physical timestamps solve the same problem. Reality: Physical clocks measure wall-clock time and are subject to drift and skew across machines, while vector clocks capture causal (happened-before) relationships between events regardless of clock synchronization — two events can have vector clocks that are incomparable (concurrent) even if their physical timestamps differ.',
            'Misconception: Once a Raft leader is elected, it can immediately consider any log entry it appends as committed. Reality: A log entry is only committed once it has been replicated to and acknowledged by a majority (quorum) of nodes in the cluster; an entry that exists only on the leader can still be lost if the leader crashes before replicating it.'
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
