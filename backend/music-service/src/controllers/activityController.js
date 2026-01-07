import Activity from "../models/Activity.js";

export const logActivity = async (req, res) => {
  try {
    const { userId, type, metadata = {} } = req.body;
    if (!userId || !type) {
      return res.status(400).json({ success: false, message: "userId and type are required" });
    }
    const activity = await Activity.create({ userId, type, metadata });
    return res.status(201).json({ success: true, activity });
  } catch (error) {
    console.error("Failed to log activity", error);
    return res.status(500).json({ success: false, message: "Could not log activity" });
  }
};

export const getRecentActivity = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }
    const activities = await Activity.find({ userId }).sort({ createdAt: -1 }).limit(20);
    return res.status(200).json({ success: true, activities });
  } catch (error) {
    console.error("Failed to fetch activity", error);
    return res.status(500).json({ success: false, message: "Could not fetch activity" });
  }
};
