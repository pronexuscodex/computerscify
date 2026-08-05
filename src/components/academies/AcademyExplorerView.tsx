import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  Check,
  Cloud,
  Code2,
  Cpu,
  Database,
  Layers3,
  ShieldCheck,
  Target,
} from 'lucide-react';
import { ACADEMIES, COMPETENCIES, getLearningPathsForAcademy } from '../../data/academyRegistry';
import { CANONICAL_COURSES } from '../../curriculum/canonicalRegistry';
import { calculateLearningPathProgress, isCanonicalCourseComplete } from '../../curriculum/academyProgress';
import { LearnerProgress, ProgramType } from '../../types/curriculum';
import { LearningPath } from '../../types/learningPaths';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Cluster, ContentGrid, PageContainer, SectionHeader, Stack } from '../common/Layout';

interface AcademyExplorerViewProps {
  progress: LearnerProgress;
  activeProgram: ProgramType;
  onSelectCourse: (courseId: string, programId: ProgramType) => void;
}

const academyIcons = {
  cpu: Cpu,
  code: Code2,
  brain: Brain,
  shield: ShieldCheck,
  cloud: Cloud,
  database: Database,
  'book-open': BookOpen,
  briefcase: BriefcaseBusiness,
} as const;

const levelLabel: Record<LearningPath['level'], string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export const AcademyExplorerView: React.FC<AcademyExplorerViewProps> = ({
  progress,
  activeProgram,
  onSelectCourse,
}) => {
  const [selectedAcademyId, setSelectedAcademyId] = useState(ACADEMIES[0].id);
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);

  const selectedAcademy = ACADEMIES.find((academy) => academy.id === selectedAcademyId) ?? ACADEMIES[0];
  const academyPaths = getLearningPathsForAcademy(selectedAcademy.id);
  const selectedPath = academyPaths.find((learningPath) => learningPath.id === selectedPathId);

  const competencyById = useMemo(
    () => new Map(COMPETENCIES.map((competency) => [competency.id, competency])),
    []
  );

  const openAcademy = (academyId: string) => {
    setSelectedAcademyId(academyId);
    setSelectedPathId(null);
  };

  if (selectedPath) {
    const pathProgress = calculateLearningPathProgress(selectedPath, progress);
    const academy = ACADEMIES.find((candidate) => candidate.id === selectedPath.academyId) ?? selectedAcademy;

    return (
      <PageContainer as="section" className="py-5 sm:py-8">
        <Stack gap="lg">
          <Button
            variant="ghost"
            size="sm"
            className="self-start"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => setSelectedPathId(null)}
          >
            Back to {academy.title}
          </Button>

          <Card padding="lg">
            <Stack gap="lg">
              <Cluster justify="between">
                <div className="min-w-0">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ds-primary)]">
                    {academy.title} · {levelLabel[selectedPath.level]}
                  </p>
                  <h1 className="ds-page-heading ds-text-safe">{selectedPath.title}</h1>
                  <p className="ds-muted ds-text-safe mt-3 max-w-3xl leading-relaxed">{selectedPath.description}</p>
                </div>
                <div className="rounded-[var(--ds-radius-md)] border border-[var(--ds-border)] bg-[var(--ds-surface-muted)] px-4 py-3 text-right">
                  <p className="font-mono text-2xl font-bold text-[var(--ds-text)]">{pathProgress.percentage}%</p>
                  <p className="text-xs text-[var(--ds-text-muted)]">{pathProgress.completedCount} of {pathProgress.totalCount} courses</p>
                </div>
              </Cluster>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--ds-border)]" aria-label={`${pathProgress.percentage}% complete`}>
                <div className="h-full rounded-full bg-[var(--ds-primary)] transition-[width]" style={{ width: `${pathProgress.percentage}%` }} />
              </div>
              <Cluster>
                <span className="rounded-full border border-[var(--ds-border)] bg-[var(--ds-surface-muted)] px-3 py-1 text-xs font-semibold text-[var(--ds-text-muted)]">
                  {selectedPath.estimatedHours ?? 0} estimated hours
                </span>
                {selectedPath.careerOutcomes.map((outcome) => (
                  <span key={outcome} className="rounded-full border border-[var(--ds-primary)]/25 bg-[var(--ds-primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--ds-primary)]">
                    {outcome}
                  </span>
                ))}
              </Cluster>
            </Stack>
          </Card>

          <SectionHeader title="Learning stages" description="Courses are resolved from the canonical curriculum. Progress is shared anywhere the same course appears." />
          <Stack gap="lg">
            {selectedPath.stages.map((stage) => (
              <Card
                key={stage.id}
                title={`${stage.order}. ${stage.title}`}
                subtitle={`${stage.requiredCourseIds.length} required course${stage.requiredCourseIds.length === 1 ? '' : 's'}`}
              >
                <Stack gap="md">
                  <div className="grid min-w-0 gap-3 md:grid-cols-2">
                    {stage.requiredCourseIds.map((courseId) => {
                      const course = CANONICAL_COURSES.find((candidate) => candidate.id === courseId);
                      if (!course) return null;
                      const completed = isCanonicalCourseComplete(course.id, progress);
                      const preferredAssignment = course.programAssignments.find((assignment) => assignment.programId === activeProgram)
                        ?? course.programAssignments[0];
                      return (
                        <div key={course.id} className="flex min-w-0 flex-col gap-3 rounded-[var(--ds-radius-sm)] border border-[var(--ds-border)] bg-[var(--ds-surface-muted)] p-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <Cluster className="mb-1 gap-2">
                              <span className="font-mono text-xs font-bold text-[var(--ds-primary)]">{preferredAssignment.displayCode ?? course.code}</span>
                              {course.programAssignments.length > 1 && (
                                <span className="rounded-full bg-[var(--ds-learning-soft)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--ds-learning)]">Shared course</span>
                              )}
                              {completed && <Check aria-label="Completed" className="h-4 w-4 text-[var(--ds-success)]" />}
                            </Cluster>
                            <h3 className="ds-text-safe font-semibold text-[var(--ds-text)]">{course.title}</h3>
                          </div>
                          <Button
                            variant={completed ? 'tertiary' : 'outline'}
                            size="sm"
                            className="shrink-0"
                            onClick={() => onSelectCourse(course.id, preferredAssignment.programId)}
                            rightIcon={<ArrowRight className="h-4 w-4" />}
                          >
                            {completed ? 'Review' : 'Open course'}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                  {(stage.competencyIds?.length ?? 0) > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--ds-text-muted)]">Competencies</p>
                      <Cluster>
                        {stage.competencyIds?.map((competencyId) => {
                          const competency = competencyById.get(competencyId);
                          return competency ? (
                            <span key={competency.id} title={competency.description} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--ds-border)] px-3 py-1 text-xs text-[var(--ds-text)]">
                              <Target className="h-3.5 w-3.5 text-[var(--ds-primary)]" />
                              {competency.title}
                            </span>
                          ) : null;
                        })}
                      </Cluster>
                    </div>
                  )}
                </Stack>
              </Card>
            ))}
          </Stack>
        </Stack>
      </PageContainer>
    );
  }

  return (
    <PageContainer as="section" className="py-5 sm:py-8">
      <Stack gap="xl">
        <header>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ds-primary)]">Career learning paths</p>
          <h1 className="ds-page-heading ds-text-safe">Choose a direction without starting over</h1>
          <p className="ds-muted ds-text-safe mt-3 max-w-3xl leading-relaxed">
            Academies organize the same university-grade courses around practical outcomes. Finish a canonical course once and it counts in every program and path that references it.
          </p>
        </header>

        <div className="grid min-w-0 gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
          <aside aria-label="Academies" className="min-w-0">
            <div className="flex snap-x gap-2 overflow-x-auto pb-2 lg:sticky lg:top-4 lg:flex-col lg:overflow-visible">
              {ACADEMIES.map((academy) => {
                const Icon = academyIcons[academy.icon as keyof typeof academyIcons] ?? Layers3;
                const active = academy.id === selectedAcademy.id;
                return (
                  <button
                    key={academy.id}
                    type="button"
                    onClick={() => openAcademy(academy.id)}
                    aria-pressed={active}
                    className={`flex min-h-11 min-w-[13rem] snap-start items-center gap-3 rounded-[var(--ds-radius-md)] border px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-focus)] lg:min-w-0 ${active ? 'border-[var(--ds-primary)] bg-[var(--ds-primary)] text-[var(--ds-on-primary)]' : 'border-[var(--ds-border)] bg-[var(--ds-surface)] text-[var(--ds-text-muted)] hover:bg-[var(--ds-surface-muted)] hover:text-[var(--ds-text)]'}`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="min-w-0 text-sm font-semibold leading-tight">{academy.title}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <Stack gap="lg">
            <SectionHeader
              title={selectedAcademy.title}
              description={selectedAcademy.description}
              action={<span className="text-xs font-semibold text-[var(--ds-text-muted)]">{academyPaths.length} path{academyPaths.length === 1 ? '' : 's'} · {selectedAcademy.canonicalCourseIds.length} courses</span>}
            />
            <ContentGrid>
              {academyPaths.map((learningPath) => {
                const pathProgress = calculateLearningPathProgress(learningPath, progress);
                const courseCount = new Set(learningPath.stages.flatMap((stage) => stage.requiredCourseIds)).size;
                return (
                  <Card key={learningPath.id} className="lg:col-span-6" hoverable>
                    <Stack gap="md">
                      <Cluster justify="between">
                        <span className="rounded-full bg-[var(--ds-primary-soft)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--ds-primary)]">{levelLabel[learningPath.level]}</span>
                        <span className="font-mono text-xs font-bold text-[var(--ds-text-muted)]">{pathProgress.percentage}%</span>
                      </Cluster>
                      <div>
                        <h3 className="ds-text-safe font-display text-lg font-bold text-[var(--ds-text)]">{learningPath.title}</h3>
                        <p className="ds-muted ds-text-safe mt-2 text-sm leading-relaxed">{learningPath.description}</p>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--ds-border)]">
                        <div className="h-full rounded-full bg-[var(--ds-primary)]" style={{ width: `${pathProgress.percentage}%` }} />
                      </div>
                      <Cluster justify="between">
                        <span className="text-xs text-[var(--ds-text-muted)]">{courseCount} courses · {learningPath.stages.length} stages</span>
                        <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />} onClick={() => setSelectedPathId(learningPath.id)}>
                          View path
                        </Button>
                      </Cluster>
                    </Stack>
                  </Card>
                );
              })}
            </ContentGrid>
          </Stack>
        </div>
      </Stack>
    </PageContainer>
  );
};
