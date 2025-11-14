const express = require("express");
const { oAuth } = require("../middleware/oAuth");
const { verifyCode, updateProfile, getProfileDetails } = require("../controllers/user.controller");
const router = express.Router();
const { requireAuth  } = require("../middleware/auth");

router.get("/verify-code", oAuth , verifyCode);
router.put("/update-profile", requireAuth , updateProfile);
router.get("/profile-details", requireAuth , getProfileDetails);



module.exports = router;
