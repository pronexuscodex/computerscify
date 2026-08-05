import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Clock,
  Filter,
  ArrowRight,
  GitFork,
  X,
  FileText,
  Layers
} from 'lucide-react';
import {
  PROGRAMS,
  calculateProgramProgress,
  getCanonicalCoursesForProgram,
  SPECIALIZATION_TRACKS,
} from '../../curriculum';
import { Course, ProgramType, LearnerProgress } from '../../types/curriculum';

interface RoadmapViewProps {
  progress: LearnerProgress;
  onSelectCourse: (courseId: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  progress,
  onSelectCourse,
}) => {
  const currentProgramId: ProgramType = progress.selectedProgram || 'computer-science';
  const program = PROGRAMS[currentProgramId] || PROGRAMS['computer-science'];

  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'semesters' | 'graph' | 'catalog'>('semesters');
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<Course | null>(null);

  // Get projected canonical courses for active program
  const programCourses = getCanonicalCoursesForProgram(currentProgramId);

  // Compute program progress with cross-program shared credit
  const progStats = calculateProgramProgress(currentProgramId, progress.completedCourseIds);

  const availableTracks = SPECIALIZATION_TRACKS.filter(t => t.programId === currentProgramId);

  const handleStartCourse = (courseId: string) => {
    setSelectedCourseDetail(null);
    onSelectCourse(courseId);
  };

  // Build academic years array (Years 1 to 4, Semesters 1 to 8)
  const academicYears = [1, 2, 3, 4].map(yearNum => {
    const sem1Num = (yearNum - 1) * 2 + 1;
    const sem2Num = (yearNum - 1) * 2 + 2;

    const getCoursesForSem = (semNum: number) => {
      return programCourses.filter(c => {
        if (c.year !== yearNum || c.semester !== semNum) return false;

        if (selectedTrack !== 'all') {
          const track = SPECIALIZATION_TRACKS.find(t => t.id === selectedTrack);
          if (track && track.recommendedCourseIds.includes(c.id)) return true;
          if (c.category === track?.category) return true;
          return false;
        }

        return true;
      });
    };

    return {
      yearNumber: yearNum,
      title: `Year ${yearNum} ${yearNum === 1 ? '— Foundations & Principles' : yearNum === 2 ? '— Core Systems & Methods' : yearNum === 3 ? '— Advanced Engineering & ML' : '— Honors Capstone & Mastery'}`,
      semesters: [
        {
          semesterNumber: sem1Num,
          title: `Semester ${sem1Num}`,
          subtitle: sem1Num === 1 ? 'First Principles & Foundations' : sem1Num === 3 ? 'Core Systems & Probability' : sem1Num === 5 ? 'Advanced Algorithms & Architecture' : 'Senior Honors & Governance',
          courses: getCoursesForSem(sem1Num),
        },
        {
          semesterNumber: sem2Num,
          title: `Semester ${sem2Num}`,
          subtitle: sem2Num === 2 ? 'Data Structures & Analysis' : sem2Num === 4 ? 'Database Systems & Assembly' : sem2Num === 6 ? 'Machine Learning & Compilers' : 'Senior Capstone Defense',
          courses: getCoursesForSem(sem2Num),
        },
      ],
    };
  });

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6 overflow-x-hidden p-4 text-[var(--ds-text)] animate-fade-in md:p-6 lg:p-8">
      {/* The global program control already switches degrees; this header only provides roadmap context. */}
      <section className="space-y-5 rounded-[var(--ds-radius-lg)] border-2 border-[var(--ds-border-strong)] bg-[var(--ds-surface)] p-4 shadow-[var(--ds-shadow-md)] sm:p-5" aria-labelledby="roadmap-title">
        <div className="flex min-w-0 items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--ds-radius-md)] border-2 border-[var(--ds-border-strong)] bg-[var(--ds-primary)] text-[var(--ds-on-primary)]">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="min-w-0 space-y-1">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--ds-text-muted)]">Degree roadmap</p>
            <h1 id="roadmap-title" className="text-xl font-black leading-tight tracking-tight text-[var(--ds-text)] sm:text-2xl">
              {program.name}
            </h1>
            <p className="max-w-3xl text-sm font-medium leading-relaxed text-[var(--ds-text-muted)]">
              {program.description}
            </p>
          </div>
        </div>

        {/* Progress Bar & Credit Stats */}
        <div className="grid grid-cols-2 gap-3 border-t border-[var(--ds-border)] pt-4 text-xs font-black lg:grid-cols-4">
          <div className="rounded-[var(--ds-radius-md)] border border-[var(--ds-border)] bg-[var(--ds-surface-muted)] p-3">
            <span className="uppercase text-[var(--ds-text-muted)]">Degree Completion</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-mono text-xl font-black text-[var(--ds-text)]">{progStats.percentage}%</span>
              <span className="text-[var(--ds-text-muted)]">({progStats.completedCount}/{progStats.totalCoursesCount} courses)</span>
            </div>
          </div>

          <div className="rounded-[var(--ds-radius-md)] border border-[var(--ds-border)] bg-[var(--ds-surface-muted)] p-3">
            <span className="uppercase text-[var(--ds-text-muted)]">Credits Earned</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-mono text-xl font-black text-[var(--ds-text)]">{progStats.earnedCredits}</span>
              <span className="text-[var(--ds-text-muted)]">/ {progStats.totalCredits} Credits</span>
            </div>
          </div>

          <div className="rounded-[var(--ds-radius-md)] border border-[var(--ds-border)] bg-[var(--ds-surface-muted)] p-3">
            <span className="uppercase text-[var(--ds-text-muted)]">Cross-Program Credit</span>
            <div className="mt-1 font-black text-[var(--ds-text)]">
              Shared with {currentProgramId === 'computer-science' ? 'Data Science' : 'Computer Science'}
            </div>
          </div>

          <div className="rounded-[var(--ds-radius-md)] border border-[var(--ds-border)] bg-[var(--ds-surface-muted)] p-3">
            <span className="uppercase text-[var(--ds-text-muted)]">Degree Level</span>
            <div className="mt-1 font-black text-[var(--ds-text)]">4-Year Academic Honors</div>
          </div>
        </div>

        {/* View Mode Tabs & Track Filter */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-pressed={activeTab === 'semesters'}
              onClick={() => setActiveTab('semesters')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded text-xs font-black uppercase tracking-wider transition-all border-2 border-[#000000] ${
                activeTab === 'semesters' ? 'bg-[#F2C94C] text-[#000000] neo-shadow-sm' : 'bg-[#FFFFFF] dark:bg-[#2B2929] text-[#000000] dark:text-[#F6EFEF]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Semesters View</span>
            </button>
            <button
              type="button"
              aria-pressed={activeTab === 'graph'}
              onClick={() => setActiveTab('graph')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded text-xs font-black uppercase tracking-wider transition-all border-2 border-[#000000] ${
                activeTab === 'graph' ? 'bg-[#F2C94C] text-[#000000] neo-shadow-sm' : 'bg-[#FFFFFF] dark:bg-[#2B2929] text-[#000000] dark:text-[#F6EFEF]'
              }`}
            >
              <GitFork className="w-4 h-4" />
              <span>Prerequisite Graph</span>
            </button>
          </div>

          <div className="flex items-center gap-2 max-w-full">
            <Filter className="w-4 h-4 text-[#000000] dark:text-[#F2C94C] shrink-0 self-center" />
            <div className="flex flex-wrap sm:flex-nowrap lg:flex-wrap items-center gap-1.5 overflow-x-auto no-scrollbar py-1 max-w-full">
              <button
                type="button"
                onClick={() => setSelectedTrack('all')}
                className={`h-9 px-3 rounded text-xs font-black uppercase tracking-wider transition-all border-2 border-[#000000] shrink-0 flex items-center gap-1.5 ${
                  selectedTrack === 'all'
                    ? 'bg-[#000000] text-[#FFFFFF] neo-shadow-sm'
                    : 'bg-[#FFFFFF] dark:bg-[#2B2929] text-[#000000] dark:text-[#F6EFEF]'
                }`}
              >
                {selectedTrack === 'all' && <CheckCircle2 className="w-3.5 h-3.5 text-[#F2C94C]" />}
                <span>All Tracks</span>
              </button>

              {availableTracks.map((t) => {
                const isSelected = selectedTrack === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedTrack(t.id)}
                    className={`h-9 px-3 rounded text-xs font-black uppercase tracking-wider transition-all border-2 border-[#000000] shrink-0 flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#000000] text-[#FFFFFF] neo-shadow-sm'
                        : 'bg-[#FFFFFF] dark:bg-[#2B2929] text-[#000000] dark:text-[#F6EFEF]'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#F2C94C]" />}
                    <span>{t.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SEMESTERS VIEW */}
      {activeTab === 'semesters' && (
        <div className="space-y-8">
          {academicYears.map((yearGroup) => (
            <div key={yearGroup.yearNumber} className="space-y-4">
              <div className="flex items-center gap-3 border-b-4 border-[#000000] pb-2">
                <div className="w-9 h-9 rounded bg-[#F2C94C] text-[#000000] font-black flex items-center justify-center text-sm font-mono border-2 border-[#000000] neo-shadow-sm">
                  Y{yearGroup.yearNumber}
                </div>
                <h2 className="font-display font-black text-xl uppercase tracking-wide text-[#000000] dark:text-[#F6EFEF]">
                  {yearGroup.title}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {yearGroup.semesters.map((sem) => (
                  <div
                    key={sem.semesterNumber}
                    className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b-2 border-[#000000] pb-3">
                      <div>
                        <h3 className="font-display font-black text-base uppercase text-[#000000] dark:text-[#F6EFEF]">{sem.title}</h3>
                        <p className="text-xs text-[#000000]/70 dark:text-[#F6EFEF]/70 font-bold">{sem.subtitle}</p>
                      </div>
                      <span className="text-xs font-mono font-black bg-[#000000] text-[#FFFFFF] px-2.5 py-1 rounded border border-[#000000]">
                        Sem {sem.semesterNumber}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {sem.courses.map((course) => {
                        const isCompleted = progStats.expandedCompletedIds.includes(course.id);
                        const isShared =
                          course.role === 'shared-required' ||
                          (course.programAssignments?.length ?? 0) > 1;

                        return (
                          <button
                            type="button"
                            key={course.id}
                            onClick={() => setSelectedCourseDetail(course)}
                            className="w-full text-left p-4 bg-[#FEF8F7] dark:bg-[#2B2929] border-2 border-[#000000] rounded neo-shadow-sm hover:translate-y-[-2px] transition-all space-y-2 group"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-black text-xs bg-[#F2C94C] text-[#000000] px-2 py-0.5 rounded border border-[#000000]">
                                  {course.code}
                                </span>
                                {isShared && (
                                  <span className="text-[10px] font-mono font-black bg-[#D0BCFF] text-[#000000] px-1.5 py-0.5 rounded border border-[#000000]">
                                    Shared Credit
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                {isCompleted ? (
                                  <span className="flex items-center gap-1 text-[11px] font-black text-[#000000] bg-[#82E0AA] px-2 py-0.5 rounded border border-[#000000]">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 text-[11px] font-black text-[#000000] dark:text-[#F6EFEF] bg-[#DFD9D8] dark:bg-stone-800 px-2 py-0.5 rounded border border-[#000000]">
                                    <Clock className="w-3.5 h-3.5" /> {course.creditHours} Credits
                                  </span>
                                )}
                              </div>
                            </div>

                            <h4 className="font-black text-sm text-[#000000] dark:text-[#F6EFEF] group-hover:text-[#626200] dark:group-hover:text-[#F2C94C] transition-colors leading-snug uppercase">
                              {course.title}
                            </h4>

                            <p className="text-xs text-[#000000]/80 dark:text-[#F6EFEF]/80 line-clamp-2 leading-relaxed font-medium">
                              {course.description}
                            </p>

                            {course.prerequisiteCourseIds.length > 0 && (
                              <div className="flex items-center gap-1 text-[11px] pt-1 font-mono font-bold">
                                <span>Prereqs:</span>
                                <span className="text-[#000000] dark:text-[#F2C94C]">
                                  {course.prerequisiteCourseIds.join(', ')}
                                </span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PREREQUISITE GRAPH VIEW */}
      {activeTab === 'graph' && (
        <div className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-6 space-y-6">
          <div className="flex items-center justify-between border-b-2 border-[#000000] pb-4">
            <div>
              <h3 className="font-display font-black text-lg uppercase">Interactive Prerequisite & Dependency Map</h3>
              <p className="text-xs text-[#000000]/70 dark:text-[#F6EFEF]/70 font-bold">Visual mapping of foundational prerequisites unlocking advanced courses.</p>
            </div>
          </div>

          <div className="space-y-6 overflow-x-auto pb-4">
            {academicYears.map((y) => (
              <div key={y.yearNumber} className="flex items-center gap-4 min-w-[800px]">
                <div className="w-24 shrink-0 font-mono font-black text-xs text-[#000000] bg-[#F2C94C] p-2 rounded border-2 border-[#000000] text-center neo-shadow-sm uppercase">
                  Year {y.yearNumber}
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  {y.semesters.flatMap((s) => s.courses).map((course) => {
                    const isCompleted = progStats.expandedCompletedIds.includes(course.id);
                    return (
                      <button
                        type="button"
                        key={course.id}
                        onClick={() => setSelectedCourseDetail(course)}
                        className={`w-full text-left p-3 rounded border-2 border-[#000000] text-xs transition-all neo-shadow-sm ${
                          isCompleted
                            ? 'bg-[#82E0AA] text-[#000000]'
                            : 'bg-[#FEF8F7] dark:bg-[#2B2929] text-[#000000] dark:text-[#F6EFEF] hover:bg-[#F2C94C]/30'
                        }`}
                      >
                        <div className="flex justify-between font-black font-mono">
                          <span>{course.code}</span>
                          {isCompleted && <CheckCircle2 className="w-4 h-4 text-[#000000]" />}
                        </div>
                        <div className="font-black uppercase mt-1 truncate">{course.title}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COURSE DETAIL MODAL */}
      {selectedCourseDetail && (
        <CourseDetailModal
          course={selectedCourseDetail}
          progress={progress}
          expandedCompletedIds={progStats.expandedCompletedIds}
          onStartCourse={handleStartCourse}
          onClose={() => setSelectedCourseDetail(null)}
        />
      )}
    </div>
  );
};

interface CourseDetailModalProps {
  course: Course;
  progress: LearnerProgress;
  expandedCompletedIds: string[];
  onStartCourse: (courseId: string) => void;
  onClose: () => void;
}

const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  progress,
  expandedCompletedIds,
  onStartCourse,
  onClose,
}) => {
  const isCompleted = expandedCompletedIds.includes(course.id);
  const allTopicIds = course.sections.flatMap((s) => s.topics.map((t) => t.id));
  const completedTopicsCount = allTopicIds.filter((id) =>
    progress.completedTopicIds.includes(id)
  ).length;
  const hasStarted = completedTopicsCount > 0 && !isCompleted;

  const actionLabel = isCompleted
    ? 'Review course'
    : hasStarted
    ? 'Continue course'
    : 'Begin course';

  // Body scroll lock
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-[#000000]/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="courseModal bg-[#FEF8F7] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow-lg rounded-t sm:rounded w-full sm:w-[92vw] max-w-5xl max-h-[100dvh] sm:max-h-[calc(100dvh-3rem)] h-[92dvh] sm:h-[min(46rem,calc(100dvh-3rem))] grid grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden text-[#1D1B1B] dark:text-[#F6EFEF]"
      >
        {/* Fixed Header */}
        <div className="p-4 sm:p-6 border-b-4 border-[#000000] flex items-start justify-between gap-4 bg-[#DFD9D8] dark:bg-[#111010] shrink-0">
          <div className="space-y-1.5 min-w-0 pr-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono font-black text-xs bg-[#F2C94C] text-[#000000] px-2.5 py-0.5 rounded border border-[#000000]">
                {course.code}
              </span>
              <span className="text-[11px] font-black text-[#000000] dark:text-[#F6EFEF] uppercase font-mono">
                {course.category} • {course.creditHours} Credits
              </span>
            </div>
            <h2
              id="course-modal-title"
              className="font-display font-black text-xl sm:text-3xl text-[#000000] dark:text-[#F6EFEF] uppercase leading-snug break-words"
            >
              {course.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close course details modal"
            className="p-2.5 bg-[#FEF8F7] dark:bg-[#1E1C1C] hover:bg-[#F2C94C] rounded border-2 border-[#000000] text-[#000000] dark:text-[#F6EFEF] transition-colors shrink-0 flex items-center justify-center min-w-[44px] min-h-[44px] neo-shadow-sm focus:outline-none"
          >
            <X className="w-5 h-5 text-[#000000] dark:text-[#F6EFEF]" />
          </button>
        </div>

        {/* Independently Scrollable Body */}
        <div className="p-4 sm:p-7 space-y-6 text-sm sm:text-base min-h-0 overflow-y-auto font-bold leading-relaxed">
          {/* Description */}
          <div className="space-y-1">
            <h3 className="font-black text-sm sm:text-base text-[#000000] dark:text-[#F6EFEF] uppercase tracking-wide flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#000000] dark:text-[#F2C94C]" /> Course Description
            </h3>
            <p className="text-[#000000]/80 dark:text-[#F6EFEF]/80 leading-relaxed text-sm sm:text-base font-medium">{course.description}</p>
          </div>

          {/* Learning Outcomes */}
          <div className="space-y-2 pt-3 border-t-2 border-[#000000]">
            <h3 className="font-black text-sm sm:text-base text-[#000000] dark:text-[#F6EFEF] uppercase tracking-wide flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#000000] dark:text-[#F2C94C]" /> Learning Outcomes
            </h3>
            <ul className="space-y-2 list-disc list-inside text-[#000000]/80 dark:text-[#F6EFEF]/80 pl-1 text-sm sm:text-base font-medium">
              {course.learningOutcomes.map((out, idx) => (
                <li key={idx} className="leading-relaxed">
                  {out}
                </li>
              ))}
            </ul>
          </div>

          {/* Curriculum Sections & Topics */}
          <div className="space-y-2 pt-3 border-t-2 border-[#000000]">
            <h3 className="font-black text-sm sm:text-base text-[#000000] dark:text-[#F6EFEF] uppercase tracking-wide flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#000000] dark:text-[#F2C94C]" /> Curriculum Sections & Topics
            </h3>
            <div className="space-y-2">
              {course.sections.map((sec) => (
                <div
                  key={sec.id}
                  className="p-4 bg-[#FFFFFF] dark:bg-[#2B2929] border-2 border-[#000000] rounded space-y-2 neo-shadow-sm"
                >
                  <h4 className="font-black text-sm text-[#000000] dark:text-[#F6EFEF] uppercase">{sec.title}</h4>
                  <p className="text-sm text-[#000000]/70 dark:text-[#F6EFEF]/70 font-medium">{sec.summary}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {sec.topics.map((top) => {
                      const topCompleted = progress.completedTopicIds.includes(top.id);
                      return (
                        <span
                          key={top.id}
                          className={`px-2.5 py-1 rounded text-xs font-mono border flex items-center gap-1 ${
                            topCompleted
                              ? 'bg-[#82E0AA] border-[#000000] text-[#000000] font-black'
                              : 'bg-[#DFD9D8] dark:bg-stone-800 border-[#000000] text-[#000000] dark:text-[#F6EFEF]'
                          }`}
                        >
                          {topCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-[#000000]" />}
                          {top.title}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prerequisites & Hours Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t-2 border-[#000000]">
            <div className="p-3 bg-[#FFFFFF] dark:bg-[#2B2929] border-2 border-[#000000] rounded">
              <div className="text-[11px] font-black uppercase text-[#000000]/70 dark:text-[#F6EFEF]/70">Prerequisites</div>
              <div className="text-xs font-black text-[#000000] dark:text-[#F2C94C] mt-0.5 font-mono">
                {course.prerequisiteCourseIds.length > 0
                  ? course.prerequisiteCourseIds.join(', ')
                  : 'None (Foundational)'}
              </div>
            </div>
            <div className="p-3 bg-[#FFFFFF] dark:bg-[#2B2929] border-2 border-[#000000] rounded">
              <div className="text-[11px] font-black uppercase text-[#000000]/70 dark:text-[#F6EFEF]/70">Estimated Study</div>
              <div className="text-xs font-black text-[#000000] dark:text-[#F2C94C] mt-0.5 font-mono">
                {course.creditHours * 15} Hours Total
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 sm:px-6 sm:py-4 bg-[#DFD9D8] dark:bg-[#111010] border-t-4 border-[#000000] flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center justify-between sm:justify-start gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded border-2 border-[#000000] bg-[#FFFFFF] dark:bg-[#2B2929] text-[#000000] dark:text-[#F6EFEF] hover:bg-[#F2C94C] hover:text-[#000000] text-xs font-black uppercase transition-colors min-h-[44px] min-w-[80px] neo-shadow-sm"
            >
              Close
            </button>
            <span className="text-xs sm:text-sm font-mono font-black text-[#000000] dark:text-[#F6EFEF]">
              {isCompleted ? (
                <span className="inline-flex items-center gap-1 text-[#000000] dark:text-[#F2C94C]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Course Completed
                </span>
              ) : hasStarted ? (
                `${completedTopicsCount}/${allTopicIds.length} Topics Completed`
              ) : (
                'Status: Ready to Start'
              )}
            </span>
          </div>

          {/* Learning Gold #F2C94C CTA */}
          <button
            type="button"
            onClick={() => onStartCourse(course.id)}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#F2C94C] hover:bg-[#ffe08b] text-[#000000] font-black text-xs sm:text-sm uppercase tracking-wider rounded border-2 border-[#000000] neo-btn flex items-center justify-center gap-2 min-h-[44px] focus:outline-none"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
