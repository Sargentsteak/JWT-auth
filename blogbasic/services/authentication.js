const JWT = require("jsonwebtoken");

const secret = "superman@123";

// Function to create a token for a user
function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    profileImageURL: user.profileImageUrl,
    role: user.role,
  };
  const token = JWT.sign(payload, secret); // Use JWT.sign() to create a token
  return token;
}

// Function to validate a token
function validateToken(token) {
  const payload = JWT.verify(token, secret);
  return payload;
}

module.exports = {
  createTokenForUser,
  validateToken,
};
