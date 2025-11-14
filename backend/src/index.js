// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("./config/db.js");
const sessionRoutes = require("./routes/session.routes.js");
const userRoutes = require("./routes/user.routes.js");
const { auth } = require('express-oauth2-jwt-bearer');
const guard = require('express-jwt-permissions')();
const { oAuth } = require("./middleware/oAuth.js");
const jwtDecode = require("jwt-decode").jwtDecode;

dotenv.config();

const jwtCheck = auth({
  audience: 'https://n-device-api/',
  issuerBaseURL: 'https://dev-fcepv4jphzal67g7.us.auth0.com/',
  tokenSigningAlg: 'RS256'
});

const app = express();

app.use(cors());
app.use(express.json());
// app.use(jwtCheck);

app.get('/challenges', oAuth , function (req, res) {
 const idToken = req.oauth.id_token
 if (!idToken) {
  console.error("No ID token found in req.oauth");
  // return res.status(400).send("Missing id_token");
}
const decoded = jwtDecode(idToken);
console.log("Decoded ID token:", decoded);
  console.log(req.oauth);
    res.json({
      ch1: 'Solve 2 + 2',
      ch2: 'What is the capital of France?'
    });
});

app.use("/session", sessionRoutes);
app.use("/user", userRoutes);

const PORT = process.env.PORT || 5000;
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
