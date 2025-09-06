export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(a));
}

export function bboxAround(
  lat: number,
  lng: number,
  km: number,
): {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
} {
  const KM_PER_DEG_LAT = 111.0; // 1도당 km 근사치
  const dLat = km / KM_PER_DEG_LAT;

  const radius = (lat * Math.PI) / 180;
  const cos = Math.cos(radius) || 1e-5; // epsilon 가드
  const dLng = km / (KM_PER_DEG_LAT * Math.abs(cos));

  const minLat = Math.max(-90, lat - dLat);
  const maxLat = Math.min(90, lat + dLat);

  const minLng = lng - dLng;
  const maxLng = lng + dLng;

  return { minLat, maxLat, minLng, maxLng };
}
