import Issue from '../models/Issue.js';

/**
 * Checks for existing unresolved issues of the same category within a 100-meter radius
 */
export const runDeduplicationCheck = async (coordinates, category) => {
  try {
    const [longitude, latitude] = coordinates;
    const radiusInMeters = 100;

    const nearDuplicates = await Issue.find({
      category,
      status: { $in: ['pending', 'verified', 'in progress'] },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: radiusInMeters,
        },
      },
    });

    return nearDuplicates.length > 0;
  } catch (error) {
    console.error('Deduplication filter failure:', error.message);
    return false; // Fail open to avoid blocking reports
  }
};

export default { runDeduplicationCheck };
