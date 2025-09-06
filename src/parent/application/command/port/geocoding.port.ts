export type ReverseGeocodingQuery = {
  lat: number;
  lng: number;
  address?: string;
  zipcode?: string;
};

export type ReverseGeocodingResult = {
  sidoCode?: string;
  sigunguCode?: string;
};

export interface GeocodingPort {
  reverse(q: ReverseGeocodingQuery): Promise<ReverseGeocodingResult>;
}
