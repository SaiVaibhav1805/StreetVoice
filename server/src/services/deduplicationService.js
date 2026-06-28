import Issue from '../models/Issue.js';

// Check if a similar issue exists within 50 meters
export const findNearbyDuplicate = async (longitude, latitude, category) => {
  if (isNaN(longitude) || isNaN(latitude) || longitude === undefined || latitude === undefined) {
    return null;
  }
  const nearby = await Issue.findOne({
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [longitude, latitude] },
        $maxDistance: 50 // meters
      }
    },
    category,
    status: { $ne: 'resolved' }
  }).populate('reportedBy', 'name');

  return nearby || null;
};

// Backwards compatibility wrapper for controllers
export const runDeduplicationCheck = async (coordinates, category) => {
  try {
    const [longitude, latitude] = coordinates;
    const duplicate = await findNearbyDuplicate(longitude, latitude, category);
    return !!duplicate;
  } catch (error) {
    console.error('Deduplication filter failure:', error.message);
    return false; // Fail open
  }
};

export default { findNearbyDuplicate, runDeduplicationCheck };