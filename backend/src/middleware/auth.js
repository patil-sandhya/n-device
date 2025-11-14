const { expressjwt } = require("express-jwt");
const jwksClient  = require("jwks-rsa");
const jwt = require("jsonwebtoken");


// const checkJwt = expressjwt({
//   secret: jwksRsa.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksRequestsPerMinute: 5,
//     jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
//   }),
//   audience: process.env.AUTH0_AUDIENCE,
//   issuer: `https://${process.env.AUTH0_DOMAIN}/`,
//   algorithms: ["RS256"],
// });


const client = jwksClient({
  jwksUri: `https://dev-fcepv4jphzal67g7.us.auth0.com/.well-known/jwks.json`,
   cache: true,             // optional, speeds up repeated verifications
  cacheMaxEntries: 5,      // optional
  cacheMaxAge: 600000 
});

function getKey(header, callback) {
  if (!header.kid) return callback(new Error("No KID in token header"));
  
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);

    // newer jwks-rsa versions
    const signingKey = key?.getPublicKey?.() || key?.rsaPublicKey;
    if (!signingKey) return callback(new Error("Unable to get signing key"));

    callback(null, signingKey);
  });
}

function verifyAccessToken(token, expectedAudience) {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      {
        audience: expectedAudience,
        issuer: `https://${process.env.AUTH0_DOMAIN}/`,
        algorithms: ["RS256"]
      },
      (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      }
    );
  });
}

const requireAuth  = async(req, res, next) => {
   const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).send("Missing Authorization header");

  const token = authHeader.split(" ")[1];

  const header = JSON.parse(Buffer.from(token.split('.')[0], 'base64').toString());
console.log("Token header:", header);

  try {
    const decoded = await verifyAccessToken(token, "https://n-device-api/");
    console.log("Decoded token:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("Token verification error:", err);
    res.status(401).send("Invalid or expired token");
  }
}

module.exports = { requireAuth  };