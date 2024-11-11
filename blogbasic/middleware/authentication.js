const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookiename) {
  return (req, res, next) => {
    // Corrected parameter order: `req, res, next`
    const tokenCookieValue = req.cookies[cookiename]; // Corrected cookie name usage
    if (!tokenCookieValue) {
      return next(); // Return `next()` if there's no cookie
    }
    try {
      const userPayload = validateToken(tokenCookieValue); // Validate token
      req.user = userPayload; // Set `req.user` to the validated user payload
    } catch (error) {
      console.error("Token validation error:", error.message); // Log validation errors if any
    }
    next(); // Continue to the next middleware or route handler
  };
}

module.exports = {
  checkForAuthenticationCookie,
};
