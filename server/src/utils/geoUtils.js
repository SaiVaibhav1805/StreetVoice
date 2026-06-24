/**
 * Check if coordinate point is within an active municipality bounding box
 */
export const isPointInBounds = (latitude, longitude, bounds) => {
  const { minLat, maxLat, minLng, maxLng } = bounds;
  return latitude >= minLat && latitude <= maxLat && longitude >= minLng && longitude <= maxLng;
};

/**
 * Approximate ward finder based on latitude and longitude
 */
export const lookupWardByCoordinates = (latitude, longitude) => {
  // Mock ward boundaries mappings.
  // In production, query a GeoJSON model or GIS api.
  const wards = [
    { wardNo: 15, name: 'Koramangala', bounds: { minLat: 12.92, maxLat: 12.94, minLng: 77.61, maxLng: 77.63 } },
    { wardNo: 84, name: 'Indiranagar', bounds: { minLat: 12.96, maxLat: 12.98, minLng: 77.63, maxLng: 77.65 } },
    { wardNo: 43, name: 'Whitefield', bounds: { minLat: 12.95, maxLat: 12.97, minLng: 77.72, maxLng: 77.75 } },
    { wardNo: 99, name: 'Jayanagar', bounds: { minLat: 12.91, maxLat: 12.93, minLng: 77.58, maxLng: 77.60 } },
  ];

  const matched = wards.find((w) => isPointInBounds(latitude, longitude, w.bounds));
  return matched ? matched.wardNo : 15; // default fallback ward 15
};
export default { isPointInBounds, lookupWardByCoordinates };
