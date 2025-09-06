export type RecommendByLocationQuery = {
  lat: number;
  lng: number;
  address?: string;
  zipcode?: string;
};

export type TeacherContactView = {
  name: string;
  phone: string;
};
