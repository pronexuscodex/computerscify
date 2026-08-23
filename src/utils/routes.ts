import { ProgramType } from '../types/curriculum';
import { NavView } from '../components/layout/NavigationRail';

export interface RouteState {
  view: NavView;
  programId: ProgramType;
  year?: number;
  semester?: number;
  courseId?: string;
  topicId?: string;
  paperId?: string;
}

export function parseRoutePath(pathStr: string, defaultProgram: ProgramType = 'computer-science'): RouteState {
  let path = pathStr || '/';
  if (path.startsWith('#')) {
    path = path.slice(1);
  }
  if (!path.startsWith('/')) {
    path = '/' + path;
  }

  if (path === '/audit' || path === '/curriculum-audit') {
    return { view: 'audit', programId: defaultProgram };
  }

  let programId: ProgramType = defaultProgram;
  let remainingPath = path;

  if (path.startsWith('/programs/data-science')) {
    programId = 'data-science';
    remainingPath = path.replace('/programs/data-science', '');
  } else if (path.startsWith('/programs/computer-science')) {
    programId = 'computer-science';
    remainingPath = path.replace('/programs/computer-science', '');
  } else if (path.startsWith('/data-science')) {
    programId = 'data-science';
    remainingPath = path.replace('/data-science', '');
  } else if (path.startsWith('/computer-science')) {
    programId = 'computer-science';
    remainingPath = path.replace('/computer-science', '');
  }

  const cleanPath = remainingPath.replace(/^\/+|\/+$/g, '');

  if (!cleanPath || cleanPath === 'dashboard') {
    return { view: 'dashboard', programId };
  }

  if (cleanPath === 'roadmap') {
    return { view: 'roadmap', programId };
  }

  const yearMatch = cleanPath.match(/^year\/(\d+)\/semester\/(\d+)/);
  if (yearMatch) {
    return {
      view: 'roadmap',
      programId,
      year: parseInt(yearMatch[1], 10),
      semester: parseInt(yearMatch[2], 10),
    };
  }

  // Topic routes: courses/:courseId/topics/:topicId OR topics/:topicId
  const courseTopicMatch = cleanPath.match(/^courses\/([^\/]+)\/topics\/([^\/]+)$/);
  if (courseTopicMatch) {
    return {
      view: 'topic-player',
      programId,
      courseId: courseTopicMatch[1],
      topicId: courseTopicMatch[2],
    };
  }

  const topicMatch = cleanPath.match(/^topics\/([^\/]+)$/);
  if (topicMatch) {
    return {
      view: 'topic-player',
      programId,
      topicId: topicMatch[1],
    };
  }

  // Course / Module overview routes: courses/:courseId OR modules/:courseId
  const courseMatch = cleanPath.match(/^(?:courses|modules)\/([^\/]+)$/);
  if (courseMatch) {
    return {
      view: 'module-overview',
      programId,
      courseId: courseMatch[1],
    };
  }

  // Research routes: research OR research/:paperId
  const researchMatch = cleanPath.match(/^research(?:\/([^\/]+))?$/);
  if (researchMatch) {
    return {
      view: 'research',
      programId,
      paperId: researchMatch[1],
    };
  }

  const knownViews: NavView[] = [
    'dashboard',
    'roadmap',
    'academies',
    'research',
    'lab',
    'spaced-review',
    'mistake-journal',
    'portfolio',
    'capstones',
    'progress',
    'settings',
    'resource-health',
    'audit',
    'news',
  ];

  if (knownViews.includes(cleanPath as NavView)) {
    return { view: cleanPath as NavView, programId };
  }

  // Fallbacks for legacy routes without /programs/:programId prefix
  if (path.startsWith('/courses/')) {
    const courseId = path.replace('/courses/', '');
    return { view: 'module-overview', programId: defaultProgram, courseId };
  }
  if (path.startsWith('/topics/')) {
    const topicId = path.replace('/topics/', '');
    return { view: 'topic-player', programId: defaultProgram, topicId };
  }

  return { view: 'dashboard', programId };
}

export function parseCurrentURL(defaultProgram: ProgramType = 'computer-science'): RouteState {
  if (typeof window === 'undefined') {
    return { view: 'dashboard', programId: defaultProgram };
  }

  const hashPath = window.location.hash ? window.location.hash.replace(/^#/, '') : '';
  const rawPath = hashPath || window.location.pathname;

  return parseRoutePath(rawPath, defaultProgram);
}

export function formatProgramURL(programId: ProgramType, year?: number, semester?: number): string {
  let url = `/programs/${programId}`;
  if (year && semester) {
    url += `/year/${year}/semester/${semester}`;
  } else {
    url += '/roadmap';
  }
  return url;
}

export function formatCourseURL(programId: ProgramType, courseId: string): string {
  return `/programs/${programId}/courses/${courseId}`;
}

export function formatTopicURL(programId: ProgramType, topicId: string, courseId?: string): string {
  if (courseId) {
    return `/programs/${programId}/courses/${courseId}/topics/${topicId}`;
  }
  return `/programs/${programId}/topics/${topicId}`;
}

export function formatViewURL(
  programId: ProgramType,
  view: NavView,
  params?: {
    courseId?: string;
    topicId?: string;
    paperId?: string;
    year?: number;
    semester?: number;
  }
): string {
  switch (view) {
    case 'dashboard':
      return `/programs/${programId}/dashboard`;
    case 'roadmap':
      return formatProgramURL(programId, params?.year, params?.semester);
    case 'module-overview':
      return params?.courseId ? formatCourseURL(programId, params.courseId) : `/programs/${programId}/roadmap`;
    case 'topic-player':
      return params?.topicId ? formatTopicURL(programId, params.topicId, params.courseId) : `/programs/${programId}/roadmap`;
    case 'research':
      return params?.paperId ? `/programs/${programId}/research/${params.paperId}` : `/programs/${programId}/research`;
    case 'audit':
      return '/audit';
    default:
      return `/programs/${programId}/${view}`;
  }
}

export function updateBrowserURL(url: string, title?: string) {
  if (typeof window !== 'undefined' && window.history) {
    if (window.location.pathname !== url) {
      window.history.pushState({}, title || 'ComputerSciFy', url);
    }
  }
}
