var axios = require("axios");
// generate the access token
const tokenEndpoint = "https://dev-fcepv4jphzal67g7.us.auth0.com/oauth/token";

const oAuth = (req, res, next) => {
  var code = req.query.code;

  if(!code) {
    res.status(401).send("Missing authorization code");
  }

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("client_id", process.env.CLIENT_ID);
  params.append("client_secret", process.env.CLIENT_SECRET);
  params.append("code", code);
  params.append("redirect_uri", "http://localhost:3000/user");

  axios.post(tokenEndpoint, params)
  .then(response => {
    req.oauth = response.data;
    next();
  })
  .catch(err => {
    console.log(err);
    res.status(403).json(`Reason: ${err.message}`);
  })
}

module.exports = {oAuth};