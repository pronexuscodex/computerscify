export interface Academy {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon?: string;
  colorToken?: string;
  learningPathIds: string[];
  canonicalCourseIds: string[];
}
