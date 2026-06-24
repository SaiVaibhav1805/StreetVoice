import User from '../models/User.js';

export const checkAndAwardGamification = async (userId, actionType) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    let xpGained = 0;
    if (actionType === 'report') {
      xpGained = 150;
    } else if (actionType === 'verify') {
      xpGained = 50;
    }

    user.xp += xpGained;
    
    // Check level up (1 level per 1000 XP)
    const newLevel = Math.floor(user.xp / 1000) + 1;
    const leveledUp = newLevel > user.level;
    user.level = newLevel;

    // Check badges
    const existingBadgeIds = user.badges.map((b) => b.id);
    const newBadges = [];

    // Award first action badges
    if (actionType === 'report' && !existingBadgeIds.includes('first_report')) {
      newBadges.push({
        id: 'first_report',
        name: 'First Responder',
        icon: '🚀',
      });
    }
    if (actionType === 'verify' && !existingBadgeIds.includes('first_verify')) {
      newBadges.push({
        id: 'first_verify',
        name: 'Civic Witness',
        icon: '🔎',
      });
    }

    if (newBadges.length > 0) {
      user.badges.push(...newBadges);
    }

    await user.save();
    return { xpGained, leveledUp, newBadges };
  } catch (error) {
    console.error('Gamification engine failure:', error.message);
  }
};

export default { checkAndAwardGamification };
