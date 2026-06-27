const Issue = require('../models/Issue');

// Check if a similar issue exists within 50 meters
const findNearbyDuplicate = async (longitude, latitude, category) => {
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

module.exports = { findNearbyDuplicate };