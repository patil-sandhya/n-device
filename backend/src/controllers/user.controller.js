const User = require("../models/User");
const Session = require("../models/Session");
const jwtDecode = require("jwt-decode").jwtDecode;

const verifyCode = async (req, res) => {
  try {
    const idToken = req.oauth.id_token;
    if (!idToken) {
      console.error("No ID token found in req.oauth");
    }
    const decoded = jwtDecode(idToken);
     const { email, name, sub } = decoded;
    var deviceId = req.query.deviceid;
 if (!email) {
      return res.status(400).json({ message: "Invalid token payload" });
    }

    if (!deviceId) {
      return res.status(400).json({ message: "Missing deviceId" });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        fullName: name || "",
        email,
        sub
      });
    }

    const sessions = await Session.find({ userId: user._id });

    const activeSessions = await Session.find({
      userId: user._id,
      isActive: true,
    });

    const existingSession = sessions.find(
      (s) => s.deviceId === deviceId
    );

    // turminate req if existing session is forcefully logged out
    if (existingSession && existingSession.revokedReason === "ForceLogout") {
      return res.status(403).json({
        status: "force_logged_out",
        message: "This session has been forcefully logged out. Please contact support.",
      });
    }

     if (existingSession) {
      // update last active
      existingSession.lastActive = new Date();
      existingSession.isActive = true;
      existingSession.revokedReason = null;
      await existingSession.save();

      return res.json({
        status: "active",
        message: "Session already active for this device.",
        accessToken: req.oauth.access_token,
        user: {
          name: user.fullName,
          email: user.email,
          phone: user.phone || null,
        },
        activeSessions,
      });
    }

    // check limit 
    if (activeSessions.length >= process.env.N_DEVICE_LIMIT) {
      return res.status(409).json({
        status: "max_sessions",
        message: "You have reached the maximum number of allowed devices.",
        accessToken: req.oauth.access_token,
        activeSessions: activeSessions.map((s) => ({
          deviceId: s.deviceId,
          loginTime: s.loginTime,
          isActive: s.isActive,
        })),
      });
    }

// Create new session
    const newSession = await Session.create({
      userId: user._id,
      deviceId,
      // ip: req.ip,
      isActive: true,
      loginTime: new Date(),
      lastActive: new Date(),
    });

    console.log("Decoded ID token:", decoded, deviceId);
    console.log(req.oauth);
    return res.status(200).json({
      status: "success",
      message: "Login verified and session created.",
      accessToken: req.oauth.access_token,
      user: {
        name: user.fullName,
        email: user.email,
        phone: user.phone || null,
      },
      activeSessions: [...activeSessions, newSession],
    });
  } catch (err) {
    console.error("verifyCode error:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.sub; 
        const { fullName, phone } = req.body;

        let user = await User.findOne({ sub: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.fullName = fullName || user.fullName;
        user.phone = phone || user.phone;
        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                name: user.fullName,
                email: user.email,
                phone: user.phone || null,
            },
        });

    } catch (err) {
        console.error("updateProfile error:", err);
        res.status(500).json({
          message: "Server error",
          error: err.message,
        });
      }
}

const getProfileDetails = async (req, res) => {
  try {
      const userId = req.user.sub;
       var deviceId = req.query.deviceid;
      let user = await User.findOne({ sub: userId });
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      const checkActiveSession = await Session.findOne({ userId: user._id, deviceId });
      if (!checkActiveSession) {
        return res.status(403).json({ 
         status: "logged_out",
          message: "No active session found for this device. Please log in again." });
      }

      const sessions = await Session.find({ userId: user._id, deviceId });
      
      if(checkActiveSession.revokedReason === "ForceLogout"){
        return res.status(403).json({ 
         status: "force_logged_out",
          message: "Session has been forcefully logged out" });

      }
       const activeSessions = await Session.find({
      userId: user._id,
      isActive: true,
    });

      res.status(200).json({
          user: {
              name: user.fullName,
              email: user.email,
              phone: user.phone || null,
          },
          activeSessions
      });
  } catch (err) {
      console.error("getProfileDetails error:", err);
      res.status(500).json({
        message: "Server error",
        error: err.message,
      });
    }
}

module.exports = { 
    verifyCode,
    updateProfile,
    getProfileDetails
};
