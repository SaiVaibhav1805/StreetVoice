import User from '../models/User.js';

export const BADGES = [
  { id: 'first_report', label: 'First Voice', emoji: '📣', condition: u => u.issuesReported >= 1 },
  { id: 'reporter_5', label: 'Street Watcher', emoji: '👀', condition: u => u.issuesReported >= 5 },
  { id: 'reporter_10', label: 'Civic Hero', emoji: '🦸', condition: u => u.issuesReported >= 10 },
  { id: 'reporter_25', label: 'Community Legend', emoji: '🏆', condition: u => u.issuesReported >= 25 },
  { id: 'verifier_5', label: 'Truth Seeker', emoji: '🔍', condition: u => u.issuesVerified >= 5 },
  { id: 'verifier_10', label: 'Ground Scout', emoji: '🧭', condition: u => u.issuesVerified >= 10 },
  { id: 'xp_100', label: 'Rising Star', emoji: '⭐', condition: u => u.xp >= 100 },
  { id: 'xp_500', label: 'Power Citizen', emoji: '💪', condition: u => u.xp >= 500 },
  { id: 'xp_1000', label: 'Urban Champion', emoji: '🌟', condition: u => u.xp >= 1000 },
];

export const checkAndAwardBadges = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return;

  const newBadges = [];

  for (const badge of BADGES) {
    if (!user.badges.includes(badge.id) && badge.condition(user)) {
      newBadges.push(badge.id);
    }
  }

  if (newBadges.length > 0) {
    user.badges.push(...newBadges);
    await user.save();
  }

  return newBadges;
};

export const awardXP = async (userId, amount) => {
  await User.findByIdAndUpdate(userId, { $inc: { xp: amount } });
  return await checkAndAwardBadges(userId);
};

export default { awardXP, checkAndAwardBadges, BADGES };