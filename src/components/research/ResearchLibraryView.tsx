import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  BookOpen,
  Bookmark,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  FileText,
  Filter,
  FlaskConical,
  FolderPlus,
  Save,
  Search,
  X,
} from 'lucide-react';
import { getAllResearchPapers } from '../../data/curriculumData';
import {
  getResearchPublicationStatus,
  getResearchSafetyLabel,
  matchesResearchMetadata,
} from '../../services/researchLibrary';
import type { LearnerProgress, PaperType, ResearchPaper } from '../../types/curriculum';
import type {
  PaperProjectForm,
  PaperReadingWorksheet,
  ResearchPublicationStatus,
  ResearchSafetyLabel,
} from '../../types/researchLibrary';
import { InAppPdfReader } from '../reader/InAppPdfReader';

interface ResearchLibraryViewProps {
  progress: LearnerProgress;
  onUpdateProgress: (newProgress: LearnerProgress) => void;
  onSelectPaper: (paperId: string) => void;
}

type ReadFilter = 'all' | 'unread' | 'read';

const emptyWorksheet = (paperId: string): PaperReadingWorksheet => ({
  paperId,
  researchQuestion: '',
  centralClaim: '',
  methodsAndEvidence: '',
  limitations: '',
  openQuestions: '',
  completedByLearner: false,
  updatedAt: '',
});

const emptyProjectForm = (paperId: string): PaperProjectForm => ({
  id: `paper-project-${paperId}`,
  paperId,
  title: '',
  objective: '',
  proposedMethod: '',
  expectedDeliverables: '',
  ethicsAndSafety: '',
  learnerConfirmedManualWork: false,
  updatedAt: '',
});

const labelText = (value: string) => value.replaceAll('-', ' ');

export const ResearchLibraryView: React.FC<ResearchLibraryViewProps> = ({
  progress,
  onUpdateProgress,
  onSelectPaper,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<PaperType | 'all'>('all');
  const [publicationFilter, setPublicationFilter] = useState<ResearchPublicationStatus | 'all'>('all');
  const [safetyFilter, setSafetyFilter] = useState<ResearchSafetyLabel | 'all'>('all');
  const [readFilter, setReadFilter] = useState<ReadFilter>('all');
  const [collectionFilter, setCollectionFilter] = useState('all');
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);
  const [readingModalPaper, setReadingModalPaper] = useState<ResearchPaper | null>(null);
  const [newCollectionTitle, setNewCollectionTitle] = useState('');
  const [activeDetailTab, setActiveDetailTab] = useState<'details' | 'worksheet' | 'project'>('details');

  const papers = useMemo(() => getAllResearchPapers(), []);
  const selectedCollection = progress.researchCollections.find((collection) => collection.id === collectionFilter);

  useEffect(() => {
    if (!readingModalPaper) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setReadingModalPaper(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [readingModalPaper]);

  useEffect(() => {
    if (!selectedPaper) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedPaper(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedPaper]);

  const filteredPapers = papers.filter((paper) => {
    const publicationStatus = getResearchPublicationStatus(paper);
    const safetyLabel = getResearchSafetyLabel(paper);
    const isRead = progress.readPaperIds.includes(paper.id);
    return matchesResearchMetadata(paper, searchQuery) &&
      (selectedType === 'all' || paper.paperType === selectedType) &&
      (publicationFilter === 'all' || publicationStatus === publicationFilter) &&
      (safetyFilter === 'all' || safetyLabel === safetyFilter) &&
      (readFilter === 'all' || (readFilter === 'read' ? isRead : !isRead)) &&
      (!selectedCollection || selectedCollection.paperIds.includes(paper.id));
  });

  const updateProgress = (patch: Partial<LearnerProgress>) => {
    onUpdateProgress({ ...progress, ...patch });
  };

  const toggleReadStatus = (paperId: string) => {
    const readSet = new Set(progress.readPaperIds);
    readSet.has(paperId) ? readSet.delete(paperId) : readSet.add(paperId);
    updateProgress({ readPaperIds: [...readSet] });
  };

  const openDetails = (paper: ResearchPaper) => {
    setSelectedPaper(paper);
    setActiveDetailTab('details');
    onSelectPaper(paper.id);
  };

  const createCollection = () => {
    const title = newCollectionTitle.trim();
    if (!title) return;
    const idBase = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'collection';
    let id = idBase;
    let suffix = 2;
    while (progress.researchCollections.some((collection) => collection.id === id)) {
      id = `${idBase}-${suffix}`;
      suffix += 1;
    }
    updateProgress({
      researchCollections: [
        ...progress.researchCollections,
        { id, title, paperIds: [], createdAt: new Date().toISOString() },
      ],
    });
    setNewCollectionTitle('');
    setCollectionFilter(id);
  };

  const togglePaperInCollection = (paperId: string, collectionId: string) => {
    updateProgress({
      researchCollections: progress.researchCollections.map((collection) => {
        if (collection.id !== collectionId) return collection;
        const paperIds = new Set(collection.paperIds);
        paperIds.has(paperId) ? paperIds.delete(paperId) : paperIds.add(paperId);
        return { ...collection, paperIds: [...paperIds] };
      }),
    });
  };

  const saveWorksheet = (worksheet: PaperReadingWorksheet) => {
    updateProgress({
      researchWorksheets: {
        ...progress.researchWorksheets,
        [worksheet.paperId]: { ...worksheet, updatedAt: new Date().toISOString() },
      },
    });
  };

  const savePaperNote = (paperId: string, note: string) => {
    updateProgress({ notes: { ...progress.notes, [`paper:${paperId}`]: note } });
  };

  const saveProjectForm = (form: PaperProjectForm) => {
    const otherForms = progress.researchProjectForms.filter((candidate) => candidate.paperId !== form.paperId);
    updateProgress({
      researchProjectForms: [...otherForms, { ...form, updatedAt: new Date().toISOString() }],
    });
  };

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6 overflow-x-hidden p-4 text-[var(--ds-text)] animate-fade-in md:p-8">
      <header className="flex flex-col gap-4 border-b-2 border-[var(--ds-border-strong)] pb-5 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0 space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-[var(--ds-radius-md)] bg-[var(--ds-text)] px-3 py-1 font-mono text-xs font-black uppercase tracking-wider text-[var(--ds-background)]">
            <FileText className="h-3.5 w-3.5 text-[var(--ds-primary)]" /> Research workspace
          </div>
          <h1 className="text-2xl font-black tracking-tight md:text-3xl">Research Library</h1>
          <p className="max-w-3xl text-sm font-medium text-[var(--ds-text-muted)]">
            Search complete stored metadata, inspect publication and safety labels, then write your own notes, worksheet, collection, and project brief.
          </p>
        </div>
        <div className="shrink-0 rounded-[var(--ds-radius-md)] border border-[var(--ds-border)] bg-[var(--ds-primary)] px-4 py-3 font-mono text-xs font-black text-[var(--ds-on-primary)]">
          Read {progress.readPaperIds.length} / {papers.length}
        </div>
      </header>

      <section className="space-y-3" aria-label="Research search and filters">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ds-text-muted)]" />
          <input
            type="search"
            placeholder="Search titles, abstracts, authors, methods, questions, identifiers…"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="min-h-11 w-full rounded-[var(--ds-radius-md)] border-2 border-[var(--ds-border-strong)] bg-[var(--ds-surface)] pl-10 pr-4 text-sm font-bold text-[var(--ds-text)] outline-none focus:border-[var(--ds-focus)] focus:ring-2 focus:ring-[var(--ds-focus)]/30"
          />
        </div>
        <div className="flex max-w-full items-center gap-2 overflow-x-auto pb-1">
          <Filter className="h-4 w-4 shrink-0 text-[var(--ds-text-muted)]" />
          <FilterSelect label="Type" value={selectedType} onChange={(value) => setSelectedType(value as PaperType | 'all')} options={['all', 'seminal', 'survey', 'applied', 'theoretical', 'historical', 'implementation']} />
          <FilterSelect label="Publication" value={publicationFilter} onChange={(value) => setPublicationFilter(value as ResearchPublicationStatus | 'all')} options={['all', 'preprint', 'published', 'status-unknown']} />
          <FilterSelect label="Safety" value={safetyFilter} onChange={(value) => setSafetyFilter(value as ResearchSafetyLabel | 'all')} options={['all', 'general-research', 'dual-use-security']} />
          <FilterSelect label="Reading" value={readFilter} onChange={(value) => setReadFilter(value as ReadFilter)} options={['all', 'unread', 'read']} />
          <FilterSelect label="Collection" value={collectionFilter} onChange={setCollectionFilter} options={['all', ...progress.researchCollections.map((collection) => collection.id)]} optionLabel={(value) => progress.researchCollections.find((collection) => collection.id === value)?.title ?? labelText(value)} />
        </div>
      </section>

      <section className="rounded-[var(--ds-radius-lg)] border border-[var(--ds-border)] bg-[var(--ds-surface)] p-4" aria-labelledby="collections-heading">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="collections-heading" className="font-black">Collections</h2>
            <p className="text-xs text-[var(--ds-text-muted)]">Create a named reading collection, then save papers from their cards.</p>
          </div>
          <div className="flex min-w-0 gap-2">
            <input value={newCollectionTitle} onChange={(event) => setNewCollectionTitle(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') createCollection(); }} placeholder="New collection name" className="min-h-10 min-w-0 flex-1 rounded-[var(--ds-radius-md)] border border-[var(--ds-border)] bg-[var(--ds-background)] px-3 text-sm outline-none focus:border-[var(--ds-focus)] sm:w-56" />
            <button type="button" onClick={createCollection} disabled={!newCollectionTitle.trim()} className="inline-flex min-h-10 items-center gap-1.5 rounded-[var(--ds-radius-md)] border border-[var(--ds-border-strong)] bg-[var(--ds-primary)] px-3 text-xs font-black text-[var(--ds-on-primary)] disabled:opacity-50">
              <FolderPlus className="h-4 w-4" /> Create
            </button>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold">{filteredPapers.length} paper{filteredPapers.length === 1 ? '' : 's'}</p>
        {(searchQuery || selectedType !== 'all' || publicationFilter !== 'all' || safetyFilter !== 'all' || readFilter !== 'all' || collectionFilter !== 'all') && (
          <button type="button" onClick={() => { setSearchQuery(''); setSelectedType('all'); setPublicationFilter('all'); setSafetyFilter('all'); setReadFilter('all'); setCollectionFilter('all'); }} className="text-xs font-black text-[var(--ds-primary)] hover:underline">Clear filters</button>
        )}
      </div>

      {filteredPapers.length === 0 ? (
        <div className="rounded-[var(--ds-radius-lg)] border border-dashed border-[var(--ds-border-strong)] bg-[var(--ds-surface)] p-10 text-center">
          <Search className="mx-auto mb-3 h-7 w-7 text-[var(--ds-text-muted)]" />
          <h2 className="font-black">No matching papers</h2>
          <p className="mt-1 text-sm text-[var(--ds-text-muted)]">Broaden the metadata query or clear one of the filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {filteredPapers.map((paper) => (
            <PaperCard
              key={paper.id}
              paper={paper}
              isRead={progress.readPaperIds.includes(paper.id)}
              collections={progress.researchCollections.map((collection) => ({ ...collection, containsPaper: collection.paperIds.includes(paper.id) }))}
              onToggleRead={() => toggleReadStatus(paper.id)}
              onOpenDetails={() => openDetails(paper)}
              onRead={() => setReadingModalPaper(paper)}
              onToggleCollection={(collectionId) => togglePaperInCollection(paper.id, collectionId)}
            />
          ))}
        </div>
      )}

      {selectedPaper && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 backdrop-blur-sm sm:p-4" role="dialog" aria-modal="true" aria-label={`Paper workspace: ${selectedPaper.title}`} onClick={() => setSelectedPaper(null)}>
          <div className="max-h-[calc(100dvh-1rem)] w-full max-w-5xl overflow-y-auto sm:max-h-[calc(100dvh-2rem)]" onClick={(event) => event.stopPropagation()}>
            <PaperWorkspace
              paper={selectedPaper}
              activeTab={activeDetailTab}
              onTabChange={setActiveDetailTab}
              note={progress.notes[`paper:${selectedPaper.id}`] ?? ''}
              worksheet={progress.researchWorksheets[selectedPaper.id] ?? emptyWorksheet(selectedPaper.id)}
              projectForm={progress.researchProjectForms.find((form) => form.paperId === selectedPaper.id) ?? emptyProjectForm(selectedPaper.id)}
              onSaveNote={(note) => savePaperNote(selectedPaper.id, note)}
              onSaveWorksheet={saveWorksheet}
              onSaveProject={saveProjectForm}
              onClose={() => setSelectedPaper(null)}
            />
          </div>
        </div>,
        document.body
      )}

      {readingModalPaper && createPortal(
        <div onClick={() => setReadingModalPaper(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm md:p-6" role="dialog" aria-modal="true" aria-label={`Read ${readingModalPaper.title}`}>
          <div onClick={(event) => event.stopPropagation()} className="relative flex h-[92dvh] max-h-[92dvh] w-full max-w-6xl flex-col overflow-hidden rounded-[var(--ds-radius-lg)] border-2 border-[var(--ds-border-strong)] bg-[var(--ds-surface)] shadow-[var(--ds-shadow-lg)]">
            <InAppPdfReader document={readingModalPaper} isCompleted={progress.readPaperIds.includes(readingModalPaper.id)} onMarkCompleted={() => toggleReadStatus(readingModalPaper.id)} onClose={() => setReadingModalPaper(null)} />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

const FilterSelect: React.FC<{ label: string; value: string; options: string[]; onChange: (value: string) => void; optionLabel?: (value: string) => string }> = ({ label, value, options, onChange, optionLabel = labelText }) => (
  <label className="shrink-0 text-xs font-bold text-[var(--ds-text-muted)]">
    <span className="sr-only">{label}</span>
    <select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} className="min-h-10 rounded-[var(--ds-radius-md)] border border-[var(--ds-border)] bg-[var(--ds-surface)] px-3 font-bold capitalize text-[var(--ds-text)] outline-none focus:border-[var(--ds-focus)]">
      {options.map((option) => <option key={option} value={option}>{option === 'all' ? `All ${label.toLowerCase()}` : optionLabel(option)}</option>)}
    </select>
  </label>
);

interface PaperCardProps {
  paper: ResearchPaper;
  isRead: boolean;
  collections: Array<{ id: string; title: string; containsPaper: boolean }>;
  onToggleRead: () => void;
  onOpenDetails: () => void;
  onRead: () => void;
  onToggleCollection: (collectionId: string) => void;
}

const PaperCard: React.FC<PaperCardProps> = ({ paper, isRead, collections, onToggleRead, onOpenDetails, onRead, onToggleCollection }) => {
  const publicationStatus = getResearchPublicationStatus(paper);
  const safetyLabel = getResearchSafetyLabel(paper);
  return (
    <article className="flex min-w-0 flex-col justify-between gap-4 rounded-[var(--ds-radius-lg)] border-2 border-[var(--ds-border-strong)] bg-[var(--ds-surface)] p-5 shadow-[var(--ds-shadow-sm)]">
      <div className="min-w-0 space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-wide">
          <span className="rounded-full bg-[var(--ds-text)] px-2.5 py-1 text-[var(--ds-background)]">{paper.paperType}</span>
          <span className="rounded-full border border-[var(--ds-border)] px-2.5 py-1 text-[var(--ds-text-muted)]">{labelText(publicationStatus)}</span>
          <span className={`rounded-full border px-2.5 py-1 ${safetyLabel === 'dual-use-security' ? 'border-[var(--ds-warning)] bg-[var(--ds-surface-muted)] text-[var(--ds-text)]' : 'border-[var(--ds-border)] text-[var(--ds-text-muted)]'}`}>{labelText(safetyLabel)}</span>
        </div>
        <div>
          <p className="font-mono text-xs font-bold text-[var(--ds-text-muted)]">{paper.year} · {paper.venue}</p>
          <h2 className="mt-1 break-words text-lg font-black leading-snug">{paper.title}</h2>
          <p className="mt-1 truncate font-mono text-xs text-[var(--ds-text-muted)]">{paper.authors.join(', ')}</p>
        </div>
        <p className="line-clamp-3 text-sm leading-relaxed text-[var(--ds-text-muted)]">{paper.summary}</p>
      </div>
      <div className="space-y-3 border-t border-[var(--ds-border)] pt-4">
        {collections.length > 0 && (
          <div className="flex max-w-full gap-2 overflow-x-auto pb-1" aria-label="Save paper to collection">
            {collections.map((collection) => (
              <button key={collection.id} type="button" aria-pressed={collection.containsPaper} onClick={() => onToggleCollection(collection.id)} className={`inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-bold ${collection.containsPaper ? 'border-[var(--ds-primary)] bg-[var(--ds-surface-muted)] text-[var(--ds-text)]' : 'border-[var(--ds-border)] text-[var(--ds-text-muted)]'}`}>
                <Bookmark className="h-3.5 w-3.5" /> {collection.title}
              </button>
            ))}
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button type="button" onClick={onToggleRead} className={`inline-flex min-h-10 items-center gap-1.5 rounded-[var(--ds-radius-md)] border px-3 text-xs font-black ${isRead ? 'border-[var(--ds-success)] bg-[var(--ds-success-soft)]' : 'border-[var(--ds-border)]'}`}>
            <CheckCircle2 className="h-4 w-4" /> {isRead ? 'Read' : 'Mark read'}
          </button>
          <div className="flex gap-2">
            <button type="button" onClick={onOpenDetails} className="min-h-10 rounded-[var(--ds-radius-md)] border border-[var(--ds-border)] px-3 text-xs font-black">Details & notes</button>
            <button type="button" onClick={onRead} className="inline-flex min-h-10 items-center gap-1.5 rounded-[var(--ds-radius-md)] bg-[var(--ds-primary)] px-3 text-xs font-black text-[var(--ds-on-primary)]"><BookOpen className="h-4 w-4" /> Read</button>
            <a href={paper.canonicalUrl ?? paper.openAccessUrl} target="_blank" rel="noopener noreferrer" aria-label="Open canonical paper source" className="flex min-h-10 min-w-10 items-center justify-center rounded-[var(--ds-radius-md)] border border-[var(--ds-border)]"><ExternalLink className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
    </article>
  );
};

interface PaperWorkspaceProps {
  paper: ResearchPaper;
  activeTab: 'details' | 'worksheet' | 'project';
  onTabChange: (tab: 'details' | 'worksheet' | 'project') => void;
  note: string;
  worksheet: PaperReadingWorksheet;
  projectForm: PaperProjectForm;
  onSaveNote: (note: string) => void;
  onSaveWorksheet: (worksheet: PaperReadingWorksheet) => void;
  onSaveProject: (form: PaperProjectForm) => void;
  onClose: () => void;
}

const PaperWorkspace: React.FC<PaperWorkspaceProps> = ({ paper, activeTab, onTabChange, note, worksheet, projectForm, onSaveNote, onSaveWorksheet, onSaveProject, onClose }) => {
  const [draftNote, setDraftNote] = useState(note);
  const [draftWorksheet, setDraftWorksheet] = useState(worksheet);
  const [draftProject, setDraftProject] = useState(projectForm);

  useEffect(() => { setDraftNote(note); }, [note, paper.id]);
  useEffect(() => { setDraftWorksheet(worksheet); }, [worksheet, paper.id]);
  useEffect(() => { setDraftProject(projectForm); }, [projectForm, paper.id]);

  return (
    <section className="scroll-mt-4 rounded-[var(--ds-radius-lg)] border-2 border-[var(--ds-border-strong)] bg-[var(--ds-surface-elevated)] shadow-[var(--ds-shadow-md)]" aria-labelledby="paper-workspace-title">
      <div className="flex items-start justify-between gap-3 border-b border-[var(--ds-border)] p-4 sm:p-5">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-wide text-[var(--ds-primary)]">Paper workspace</p>
          <h2 id="paper-workspace-title" className="mt-1 text-lg font-black leading-snug">{paper.title}</h2>
        </div>
        <button type="button" onClick={onClose} aria-label="Close paper workspace" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--ds-radius-md)] border border-[var(--ds-border)]"><X className="h-4 w-4" /></button>
      </div>
      <div className="flex gap-1 overflow-x-auto border-b border-[var(--ds-border)] p-2" role="tablist">
        {([{ id: 'details', label: 'Details & notes', icon: FileText }, { id: 'worksheet', label: 'Reading worksheet', icon: ClipboardList }, { id: 'project', label: 'Manual project form', icon: FlaskConical }] as const).map((tab) => {
          const Icon = tab.icon;
          return <button key={tab.id} type="button" role="tab" aria-selected={activeTab === tab.id} onClick={() => onTabChange(tab.id)} className={`inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-[var(--ds-radius-md)] px-3 text-xs font-black ${activeTab === tab.id ? 'bg-[var(--ds-primary)] text-[var(--ds-on-primary)]' : 'text-[var(--ds-text-muted)]'}`}><Icon className="h-4 w-4" /> {tab.label}</button>;
        })}
      </div>
      <div className="p-4 sm:p-5">
        {activeTab === 'details' && (
          <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-4 text-sm leading-relaxed">
              <Detail label="Summary" value={paper.summary} />
              <Detail label="Why it matters" value={paper.whyItMatters} />
              <Detail label="Sections to read" value={paper.sectionsToRead} />
              <div><h3 className="text-xs font-black uppercase tracking-wide text-[var(--ds-text-muted)]">Reading questions</h3><ul className="mt-2 list-disc space-y-1 pl-5">{paper.readingQuestions.map((question) => <li key={question}>{question}</li>)}</ul></div>
            </div>
            <div>
              <label className="text-xs font-black uppercase tracking-wide text-[var(--ds-text-muted)]" htmlFor={`paper-note-${paper.id}`}>Learner notes</label>
              <textarea id={`paper-note-${paper.id}`} value={draftNote} onChange={(event) => setDraftNote(event.target.value)} rows={12} placeholder="Write your own observations, questions, and citations…" className="mt-2 w-full resize-y rounded-[var(--ds-radius-md)] border border-[var(--ds-border)] bg-[var(--ds-background)] p-3 text-sm outline-none focus:border-[var(--ds-focus)]" />
              <SaveButton onClick={() => onSaveNote(draftNote)} label="Save notes" />
            </div>
          </div>
        )}
        {activeTab === 'worksheet' && (
          <div className="space-y-4">
            <p className="rounded-[var(--ds-radius-md)] border border-[var(--ds-border)] bg-[var(--ds-surface-muted)] p-3 text-xs font-bold">Complete this worksheet yourself. ComputerSciFy stores your writing but does not generate answers.</p>
            <WorkspaceField label="Research question" value={draftWorksheet.researchQuestion} onChange={(value) => setDraftWorksheet({ ...draftWorksheet, researchQuestion: value })} />
            <WorkspaceField label="Central claim" value={draftWorksheet.centralClaim} onChange={(value) => setDraftWorksheet({ ...draftWorksheet, centralClaim: value })} />
            <WorkspaceField label="Methods and evidence" value={draftWorksheet.methodsAndEvidence} onChange={(value) => setDraftWorksheet({ ...draftWorksheet, methodsAndEvidence: value })} />
            <WorkspaceField label="Limitations" value={draftWorksheet.limitations} onChange={(value) => setDraftWorksheet({ ...draftWorksheet, limitations: value })} />
            <WorkspaceField label="Open questions" value={draftWorksheet.openQuestions} onChange={(value) => setDraftWorksheet({ ...draftWorksheet, openQuestions: value })} />
            <label className="flex items-start gap-2 text-sm font-bold"><input type="checkbox" checked={draftWorksheet.completedByLearner} onChange={(event) => setDraftWorksheet({ ...draftWorksheet, completedByLearner: event.target.checked })} className="mt-1" /> I completed this worksheet in my own words.</label>
            <SaveButton onClick={() => onSaveWorksheet(draftWorksheet)} label="Save worksheet" />
          </div>
        )}
        {activeTab === 'project' && (
          <div className="space-y-4">
            <p className="rounded-[var(--ds-radius-md)] border border-[var(--ds-border)] bg-[var(--ds-surface-muted)] p-3 text-xs font-bold">This form records a learner-designed project proposal. Nothing is generated, executed, submitted, or published automatically.</p>
            <WorkspaceField label="Project title" value={draftProject.title} onChange={(value) => setDraftProject({ ...draftProject, title: value })} rows={2} />
            <WorkspaceField label="Objective" value={draftProject.objective} onChange={(value) => setDraftProject({ ...draftProject, objective: value })} />
            <WorkspaceField label="Proposed method" value={draftProject.proposedMethod} onChange={(value) => setDraftProject({ ...draftProject, proposedMethod: value })} />
            <WorkspaceField label="Expected deliverables" value={draftProject.expectedDeliverables} onChange={(value) => setDraftProject({ ...draftProject, expectedDeliverables: value })} />
            <WorkspaceField label="Ethics, authorization, and safety" value={draftProject.ethicsAndSafety} onChange={(value) => setDraftProject({ ...draftProject, ethicsAndSafety: value })} />
            <label className="flex items-start gap-2 text-sm font-bold"><input type="checkbox" checked={draftProject.learnerConfirmedManualWork} onChange={(event) => setDraftProject({ ...draftProject, learnerConfirmedManualWork: event.target.checked })} className="mt-1" /> I created this proposal manually and reviewed its ethical and safety boundaries.</label>
            <SaveButton onClick={() => onSaveProject(draftProject)} label="Save project form" disabled={!draftProject.learnerConfirmedManualWork} />
          </div>
        )}
      </div>
    </section>
  );
};

const Detail: React.FC<{ label: string; value: string }> = ({ label, value }) => <div><h3 className="text-xs font-black uppercase tracking-wide text-[var(--ds-text-muted)]">{label}</h3><p className="mt-1">{value}</p></div>;

const WorkspaceField: React.FC<{ label: string; value: string; onChange: (value: string) => void; rows?: number }> = ({ label, value, onChange, rows = 4 }) => (
  <label className="block text-xs font-black uppercase tracking-wide text-[var(--ds-text-muted)]">{label}<textarea value={value} onChange={(event) => onChange(event.target.value)} rows={rows} className="mt-2 w-full resize-y rounded-[var(--ds-radius-md)] border border-[var(--ds-border)] bg-[var(--ds-background)] p-3 text-sm font-medium normal-case tracking-normal text-[var(--ds-text)] outline-none focus:border-[var(--ds-focus)]" /></label>
);

const SaveButton: React.FC<{ onClick: () => void; label: string; disabled?: boolean }> = ({ onClick, label, disabled }) => (
  <button type="button" onClick={onClick} disabled={disabled} className="mt-3 inline-flex min-h-10 items-center gap-1.5 rounded-[var(--ds-radius-md)] bg-[var(--ds-primary)] px-4 text-xs font-black text-[var(--ds-on-primary)] disabled:cursor-not-allowed disabled:opacity-50"><Save className="h-4 w-4" /> {label}</button>
);
