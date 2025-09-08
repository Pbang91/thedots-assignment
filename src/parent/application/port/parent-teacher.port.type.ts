export type RecommendByLocationQuery = {
  lat: number;
  lng: number;
  address?: string;
  zipcode?: string;
};

export type TeacherContactView = {
  id: string;
  name: string;
  phone: string;
};
