import {
  RecommendByLocationQuery,
  TeacherContactView,
} from './parent-teacher.port.type';

export interface ParentTeacherPort {
  recommendTeacherByLocation(
    q: RecommendByLocationQuery,
  ): Promise<TeacherContactView[]>;
}
