import {
  RecommendByLocationQuery,
  TeacherContactView,
} from './parent-teacher.port.type';

export interface ParentTeacherPort {
  recommend(q: RecommendByLocationQuery): Promise<TeacherContactView[]>;
}
