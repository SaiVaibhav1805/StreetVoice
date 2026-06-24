import mongoose from 'mongoose';

const BadgeSchema = new mongoose.Schema(
  {
    badgeId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String, // Emoji or asset URL
      required: true,
    },
    category: {
      type: String, // e.g., 'reporting', 'verification', 'impact'
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Badge = mongoose.model('Badge', BadgeSchema);
export default Badge;
