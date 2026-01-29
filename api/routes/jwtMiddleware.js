const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET } = require("../config.js");

module.exports = {
  checkJwt: (req, res, next) => {
    // Get the JWT from the cookie instead of the header
    console.log('=== JWT Middleware Debug ===');
    console.log('All cookies:', req.cookies);
    const token = req.cookies.authToken;
    console.log('authToken from cookie:', token);
    let jwtPayload;

    // Validate the token and retrieve its data.
    try {
      if (!token) {
        console.error('No token found in cookies');
        throw new Error("No token provided");
      }

      console.log("Token from cookie: " + token);
      jwtPayload = jwt.verify(token, ACCESS_TOKEN_SECRET, {
        complete: true,
        algorithms: ['HS256'],
        clockTolerance: 0,
        ignoreExpiration: false,
        ignoreNotBefore: false
      });
      console.log('Token verified successfully:', jwtPayload);
      // Add the payload to the request so controllers may access it.
      req.token = jwtPayload;
    } catch (error) {
      console.error('JWT verification error:', error.message);
      res.status(401)
        .type('json')
        .send(JSON.stringify({ message: 'Missing or invalid token' }));
      return;
    }

    // Pass programmatic flow to the next middleware/controller.
    next();
  }
}
