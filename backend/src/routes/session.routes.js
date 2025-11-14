const express = require("express");
const router = express.Router();
const {
  loginSession,
  logoutSession,
  forceLogoutSession,
} = require("../controllers/session.controller");
const { requireAuth  } = require("../middleware/auth");

router.post("/login", requireAuth , loginSession);
router.post("/logout", requireAuth , logoutSession);
router.post("/force-logout", requireAuth , forceLogoutSession);

module.exports = router;
