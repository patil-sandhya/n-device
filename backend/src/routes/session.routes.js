const express = require("express");
const router = express.Router();
const {
  loginSession,
  listSessions,
  logoutSession,
  forceLogoutSession,
  validateSession,
} = require("../controllers/session.controller");
const { requireAuth  } = require("../middleware/auth");

router.post("/login", requireAuth , loginSession);
router.get("/list", requireAuth , listSessions);
router.post("/logout", requireAuth , logoutSession);
router.post("/force-logout/:sessionId", requireAuth , forceLogoutSession);
router.get("/validate", requireAuth , validateSession);

module.exports = router;
