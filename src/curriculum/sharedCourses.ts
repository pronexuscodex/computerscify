export interface SharedCourseEquivalence {
  csCourseId: string;
  dsCourseId: string;
  title: string;
  category: string;
}

export const SHARED_COURSES: SharedCourseEquivalence[] = [
  {
    csCourseId: 'cs-102',
    dsCourseId: 'ds-102',
    title: 'Programming Principles & Python',
    category: 'cs',
  },
  {
    csCourseId: 'math-101',
    dsCourseId: 'math-101',
    title: 'Single & Multivariable Calculus',
    category: 'math',
  },
  {
    csCourseId: 'cs-201',
    dsCourseId: 'ds-201',
    title: 'Data Structures & Algorithmic Thinking',
    category: 'cs',
  },
  {
    csCourseId: 'math-201',
    dsCourseId: 'math-201',
    title: 'Linear Algebra & Matrix Decompositions',
    category: 'math',
  },
  {
    csCourseId: 'cs-205',
    dsCourseId: 'ds-202',
    title: 'Relational Database Systems & Analytical SQL',
    category: 'ds',
  },
  {
    csCourseId: 'cs-305',
    dsCourseId: 'ds-305',
    title: 'Machine Learning Foundations & Statistical Learning',
    category: 'ml',
  },
  {
    csCourseId: 'cs-404',
    dsCourseId: 'ds-404',
    title: 'Tech Ethics, Data Governance & Societal Impact',
    category: 'ethics',
  },
];

/**
 * Given a set of completed course IDs, returns the expanded set of course IDs
 * including equivalent shared credit in the sister academic program.
 */
export function getCrossProgramCompletedCourses(completedCourseIds: string[]): string[] {
  const result = new Set<string>(completedCourseIds);

  for (const shared of SHARED_COURSES) {
    if (result.has(shared.csCourseId) || result.has(shared.dsCourseId)) {
      result.add(shared.csCourseId);
      result.add(shared.dsCourseId);
    }
  }

  return Array.from(result);
}

