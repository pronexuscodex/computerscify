import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Clock,
  Filter,
  ArrowRight,
  Sparkles,
  GitFork,
  ChevronRight,
  X,
  FileText,
  Play,
  Code,
  Award,
  Lock,
  Layers,
  BarChart2,
  ShieldCheck,
  Star
} from 'lucide-react';
import {
  PROGRAMS,
  calculateProgramProgress,
  getCourseById,
  getEquivalentCourseInOtherProgram,
  getCanonicalCoursesForProgram,
  SPECIALIZATION_TRACKS,
} from '../../curriculum';
import { Course, ProgramType, TrackCategory, LearnerProgress } from '../../types/curriculum';

interface RoadmapViewProps {
  progress: LearnerProgress;
  onSelectCourse: (courseId: string) => void;
  onSelectProgram: (program: ProgramType) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  progress,
  onSelectCourse,
  onSelectProgram,
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
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in text-[#151313] w-full min-w-0 overflow-x-hidden">
      {/* Program Selector & Stats Header */}
      <div className="bg-[#F7F7F5] brand-border brand-shadow-lg rounded-2xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151313] text-[#F7F7F5] text-xs font-bold font-mono">
              <GraduationCap className="w-4 h-4 text-[#BE94F5]" />
              University Degree Pathway
            </div>
            <h1 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight text-[#151313]">
              {program.name}
            </h1>
            <p className="text-sm text-[#151313]/80 max-w-2xl font-medium">
              {program.description}
            </p>
          </div>

          {/* Program Switcher Buttons */}
          <div className="flex items-center gap-2 bg-[#151313] p-1.5 rounded-xl self-start md:self-auto">
            <button
              onClick={() => onSelectProgram('computer-science')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                currentProgramId === 'computer-science'
                  ? 'bg-[#BE94F5] text-[#151313] shadow'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Computer Science
            </button>
            <button
              onClick={() => onSelectProgram('data-science')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                currentProgramId === 'data-science'
                  ? 'bg-[#BE94F5] text-[#151313] shadow'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Data Science
            </button>
          </div>
        </div>

        {/* Progress Bar & Credit Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-[#151313]/10 text-xs">
          <div className="bg-white p-3.5 rounded-xl border border-[#151313]">
            <span className="text-stone-500 font-medium">Degree Completion</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black font-mono text-[#BE94F5]">{progStats.percentage}%</span>
              <span className="text-stone-500">({progStats.completedCount}/{progStats.totalCoursesCount} courses)</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#151313]">
            <span className="text-stone-500 font-medium">Credits Earned</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black font-mono text-[#151313]">{progStats.earnedCredits}</span>
              <span className="text-stone-500">/ {progStats.totalCredits} Credits</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#151313]">
            <span className="text-stone-500 font-medium">Cross-Program Credit</span>
            <div className="mt-1 font-semibold text-[#151313]">
              Active (Shared with {currentProgramId === 'computer-science' ? 'Data Science' : 'Computer Science'})
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#151313]">
            <span className="text-stone-500 font-medium">Degree Level</span>
            <div className="mt-1 font-semibold text-[#151313]">4-Year Academic Honors</div>
          </div>
        </div>

        {/* View Mode Tabs & Track Filter */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-pressed={activeTab === 'semesters'}
              onClick={() => setActiveTab('semesters')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all brand-border ${
                activeTab === 'semesters' ? 'bg-[#BE94F5] text-[#151313] brand-shadow-sm' : 'bg-white text-[#151313] hover:bg-stone-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Semesters View</span>
            </button>
            <button
              type="button"
              aria-pressed={activeTab === 'graph'}
              onClick={() => setActiveTab('graph')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all brand-border ${
                activeTab === 'graph' ? 'bg-[#BE94F5] text-[#151313] brand-shadow-sm' : 'bg-white text-[#151313] hover:bg-stone-100'
              }`}
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>Prerequisite Graph</span>
            </button>
          </div>

          <div className="flex items-center gap-2 max-w-full">
            <Filter className="w-4 h-4 text-[#151313]/70 shrink-0 self-center" />
            <div className="flex flex-wrap sm:flex-nowrap lg:flex-wrap items-center gap-1.5 overflow-x-auto no-scrollbar py-1 max-w-full">
              <button
                type="button"
                onClick={() => setSelectedTrack('all')}
                className={`h-9 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 brand-border ${
                  selectedTrack === 'all'
                    ? 'bg-[#151313] text-[#F7F7F5] brand-shadow-sm'
                    : 'bg-white text-[#151313] hover:bg-stone-100'
                }`}
              >
                {selectedTrack === 'all' && <CheckCircle2 className="w-3.5 h-3.5 text-[#82E0AA]" />}
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
                    className={`h-9 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 brand-border ${
                      isSelected
                        ? 'bg-[#151313] text-[#F7F7F5] brand-shadow-sm'
                        : 'bg-white text-[#151313] hover:bg-[#BE94F5]/20'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#82E0AA]" />}
                    <span>{t.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* SEMESTERS VIEW */}
      {activeTab === 'semesters' && (
        <div className="space-y-8">
          {academicYears.map((yearGroup) => (
            <div key={yearGroup.yearNumber} className="space-y-4">
              <div className="flex items-center gap-3 border-b-2 border-[#151313] pb-2">
                <div className="w-8 h-8 rounded-lg bg-[#BE94F5] text-[#151313] font-extrabold flex items-center justify-center text-sm font-mono border border-[#151313]">
                  Y{yearGroup.yearNumber}
                </div>
                <h2 className="font-display font-extrabold text-xl text-[#151313]">
                  {yearGroup.title}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {yearGroup.semesters.map((sem) => (
                  <div
                    key={sem.semesterNumber}
                    className="bg-[#F7F7F5] brand-border brand-shadow-sm rounded-2xl p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-[#151313]/10 pb-3">
                      <div>
                        <h3 className="font-display font-bold text-base text-[#151313]">{sem.title}</h3>
                        <p className="text-xs text-stone-600 font-medium">{sem.subtitle}</p>
                      </div>
                      <span className="text-xs font-mono font-bold bg-[#151313] text-white px-2.5 py-1 rounded-md">
                        Sem {sem.semesterNumber}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {sem.courses.map((course) => {
                        const isCompleted = progStats.expandedCompletedIds.includes(course.id);
                        const isShared = course.role === 'shared-required' || course.programAssignments?.length! > 1;

                        return (
                          <div
                            key={course.id}
                            onClick={() => setSelectedCourseDetail(course)}
                            className="p-4 bg-white border border-[#151313] rounded-xl hover:shadow-md transition-all cursor-pointer space-y-2 group"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-bold text-xs bg-[#BE94F5]/20 text-[#151313] px-2 py-0.5 rounded border border-[#BE94F5]/40">
                                  {course.code}
                                </span>
                                {isShared && (
                                  <span className="text-[10px] font-mono font-bold bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded border border-purple-300">
                                    Shared Credit
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                {isCompleted ? (
                                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                                    <CheckCircle2 className="w-3 h-3" /> Completed
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 text-[11px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-300">
                                    <Clock className="w-3 h-3" /> {course.creditHours} Credits
                                  </span>
                                )}
                              </div>
                            </div>

                            <h4 className="font-bold text-sm text-[#151313] group-hover:text-[#BE94F5] transition-colors leading-snug">
                              {course.title}
                            </h4>

                            <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                              {course.description}
                            </p>

                            {course.prerequisiteCourseIds.length > 0 && (
                              <div className="flex items-center gap-1 text-[11px] text-stone-500 pt-1 font-mono">
                                <span>Prereqs:</span>
                                <span className="text-stone-700 font-semibold">
                                  {course.prerequisiteCourseIds.join(', ')}
                                </span>
                              </div>
                            )}
                          </div>
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
        <div className="bg-[#F7F7F5] brand-border rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#151313]/10 pb-4">
            <div>
              <h3 className="font-display font-bold text-lg">Interactive Prerequisite & Dependency Map</h3>
              <p className="text-xs text-stone-600">Visual mapping of foundational prerequisites unlocking advanced courses.</p>
            </div>
          </div>

          <div className="space-y-6 overflow-x-auto pb-4">
            {academicYears.map((y) => (
              <div key={y.yearNumber} className="flex items-center gap-4 min-w-[800px]">
                <div className="w-24 shrink-0 font-mono font-bold text-xs text-[#151313] bg-[#BE94F5]/20 p-2 rounded border border-[#BE94F5]/40 text-center">
                  Year {y.yearNumber}
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  {y.semesters.flatMap((s) => s.courses).map((course) => {
                    const isCompleted = progStats.expandedCompletedIds.includes(course.id);
                    return (
                      <div
                        key={course.id}
                        onClick={() => setSelectedCourseDetail(course)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          isCompleted
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                            : 'bg-white border-[#151313] hover:border-[#BE94F5]'
                        }`}
                      >
                        <div className="flex justify-between font-bold font-mono">
                          <span>{course.code}</span>
                          {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        </div>
                        <div className="font-semibold mt-1 truncate">{course.title}</div>
                      </div>
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-[#151313]/75 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="courseModal bg-[#F7F7F5] brand-border brand-shadow-lg rounded-t-2xl sm:rounded-2xl w-full max-w-3xl max-h-[100dvh] sm:max-h-[min(52rem,calc(100dvh-2rem))] h-[92dvh] sm:h-auto grid grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden text-[#151313] border-2 border-[#151313]"
      >
        {/* Fixed Header */}
        <div className="p-4 sm:p-6 border-b-2 border-[#151313] flex items-start justify-between gap-4 bg-[#F7F7F5] shrink-0">
          <div className="space-y-1.5 min-w-0 pr-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono font-bold text-xs bg-[#BE94F5] text-[#151313] px-2.5 py-0.5 rounded border border-[#151313]">
                {course.code}
              </span>
              <span className="text-[11px] font-bold text-[#151313]/70 uppercase font-mono">
                {course.category} • {course.creditHours} Credits
              </span>
            </div>
            <h2
              id="course-modal-title"
              className="font-display font-extrabold text-xl sm:text-2xl text-[#151313] leading-snug break-words"
            >
              {course.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close course details modal"
            className="p-2.5 hover:bg-[#BE94F5]/20 rounded-xl border border-[#151313]/20 text-[#151313] transition-colors shrink-0 flex items-center justify-center min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#BE94F5]"
          >
            <X className="w-5 h-5 text-[#BE94F5]" />
          </button>
        </div>

        {/* Independently Scrollable Body */}
        <div className="p-4 sm:p-6 space-y-5 text-xs sm:text-sm text-[#151313] min-h-0 overflow-y-auto font-medium leading-relaxed">
          {/* Description */}
          <div className="space-y-1">
            <h3 className="font-bold text-xs sm:text-sm text-[#151313] uppercase tracking-wide flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#BE94F5]" /> Course Description
            </h3>
            <p className="text-[#151313]/80 leading-relaxed text-xs sm:text-sm">{course.description}</p>
          </div>

          {/* Learning Outcomes */}
          <div className="space-y-2 pt-3 border-t border-[#151313]/10">
            <h3 className="font-bold text-xs sm:text-sm text-[#151313] uppercase tracking-wide flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-[#82E0AA]" /> Learning Outcomes
            </h3>
            <ul className="space-y-1.5 list-disc list-inside text-[#151313]/80 pl-1 text-xs sm:text-sm">
              {course.learningOutcomes.map((out, idx) => (
                <li key={idx} className="leading-relaxed">
                  {out}
                </li>
              ))}
            </ul>
          </div>

          {/* Curriculum Sections & Topics */}
          <div className="space-y-2 pt-3 border-t border-[#151313]/10">
            <h3 className="font-bold text-xs sm:text-sm text-[#151313] uppercase tracking-wide flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#BE94F5]" /> Curriculum Sections & Topics
            </h3>
            <div className="space-y-2">
              {course.sections.map((sec) => (
                <div
                  key={sec.id}
                  className="p-3 bg-white border border-[#151313]/20 rounded-xl space-y-1.5 brand-shadow-sm"
                >
                  <h4 className="font-bold text-xs text-[#151313]">{sec.title}</h4>
                  <p className="text-xs text-[#151313]/70">{sec.summary}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {sec.topics.map((top) => {
                      const topCompleted = progress.completedTopicIds.includes(top.id);
                      return (
                        <span
                          key={top.id}
                          className={`px-2 py-0.5 rounded text-[11px] font-mono border flex items-center gap-1 ${
                            topCompleted
                              ? 'bg-[#82E0AA]/30 border-emerald-400 text-emerald-900 font-bold'
                              : 'bg-[#151313]/5 border-[#151313]/15 text-[#151313]'
                          }`}
                        >
                          {topCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-700" />}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#151313]/10">
            <div className="p-3 bg-white border border-[#151313]/20 rounded-xl">
              <div className="text-[11px] font-bold uppercase text-[#151313]/60">Prerequisites</div>
              <div className="text-xs font-semibold text-[#151313] mt-0.5 font-mono">
                {course.prerequisiteCourseIds.length > 0
                  ? course.prerequisiteCourseIds.join(', ')
                  : 'None (Foundational)'}
              </div>
            </div>
            <div className="p-3 bg-white border border-[#151313]/20 rounded-xl">
              <div className="text-[11px] font-bold uppercase text-[#151313]/60">Estimated Study</div>
              <div className="text-xs font-semibold text-[#151313] mt-0.5 font-mono">
                {course.creditHours * 15} Hours Total
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 sm:px-6 sm:py-4 bg-[#F7F7F5] border-t-2 border-[#151313] flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 shrink-0 shadow-lg">
          <div className="flex items-center justify-between sm:justify-start gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#151313] bg-white text-[#151313] hover:bg-stone-100 text-xs font-bold transition-colors min-h-[44px] min-w-[80px]"
            >
              Close
            </button>
            <span className="text-xs font-mono font-bold text-[#151313]/70">
              {isCompleted ? (
                <span className="inline-flex items-center gap-1 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Course Completed
                </span>
              ) : hasStarted ? (
                `${completedTopicsCount}/${allTopicIds.length} Topics Completed`
              ) : (
                'Status: Ready to Start'
              )}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onStartCourse(course.id)}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#BE94F5] hover:bg-[#FCCC42] text-[#151313] font-extrabold text-xs sm:text-sm rounded-xl border border-[#151313] shadow-md transition-colors flex items-center justify-center gap-2 min-h-[44px] brand-shadow-sm focus:outline-none focus:ring-2 focus:ring-[#151313]"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
