// src/controllers/session.controller.js
const User = require("../models/User");
const Session = require("../models/Session");

const N_DEVICE_LIMIT = parseInt(process.env.N_DEVICE_LIMIT) || 3;

const loginSession = async (req, res) => {
  try {
    const { sub: userId, name: fullName, email } = req.auth;
    const { deviceId } = req.body;

    if (!deviceId) return res.status(400).json({ message: "deviceId is required" });

    const userAgent = req.headers["user-agent"] || "unknown";
    const ipAddress = req.ip;
    let user = await User.findOne({ userId });
    if (!user) {
      user = await User.create({ userId, fullName, email });
    }
    const activeSessions = await Session.find({ userId, isActive: true });
    const existingSession = await Session.findOne({ userId, deviceId });

    if (existingSession) {
      // Same device → update lastActiveAt
      existingSession.lastActiveAt = new Date();
      existingSession.isActive = true;
      await existingSession.save();
      return res.status(200).json({ message: "Logged in on same device", session: existingSession });
    }

    // New device
    if (activeSessions.length >= N_DEVICE_LIMIT) {
      return res.status(200).json({
        exceedsLimit: true,
        message: `You have reached the maximum of ${N_DEVICE_LIMIT} devices.`,
        activeSessions
      });
    }

    // Create new session
    const session = await Session.create({ userId, deviceId, userAgent, ipAddress });
    return res.status(201).json({ message: "Login successful", session });
  } catch (err) {
    // console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


const logoutSession = async (req, res) => {
  try {
    const userId = req.user.sub
    const { deviceId } = req.body;

    if (!deviceId) {
      return res.status(400).json({ message: "deviceId is required" });
    }

    let user = await User.findOne({ sub: userId });

    // Find the session for this device
    const session = await Session.findOne({ userId: user._id, deviceId, isActive: true });

    if (!session) {
      return res.status(404).json({ message: "Session not found or already logged out" });
    }

    // Mark session inactive
    session.isActive = false;
    session.revokedReason = "ManualLogout";
    await session.save();

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    // console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

const forceLogoutSession = async (req, res) => {
  try {
    const userId = req.user.sub; 
   const { deviceId } = req.body;
    let user = await User.findOne({ sub: userId });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

    const targetSession = await Session.findOne({ userId:user._id,  isActive: true });

    if (!targetSession) {
      return res.status(404).json({ message: "Session not found or already inactive" });
    }

    // Mark target session inactive
    targetSession.isActive = false;
    targetSession.revokedReason = "ForceLogout";
    await targetSession.save();

     const newSession = await Session.create({
          userId: user._id,
          deviceId,
          // ip: req.ip,
          isActive: true,
          loginTime: new Date(),
          lastActive: new Date(),
        });

    const activeSessions = await Session.find({
      userId: user._id,
      isActive: true,
    });

    

    return res.status(200).json({ message: "Session force logged out successfully",
      user: {
          name: user.fullName,
          email: user.email,
          phone: user.phone || null,
        },
        activeSessions,
     });
  } catch (err) {
    // console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};



module.exports = {
  loginSession,
  logoutSession,
  forceLogoutSession,
};
