const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("node:crypto");
const { createTokenForUser } = require("../services/authentication");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageUrl: {
      type: String,
      default: "/images/default.jpeg",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

// Middleware to hash password before saving
userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next(); // Call next if password is not modified

  const salt = randomBytes(16).toString("hex"); // Generate unique salt
  const hashedPassword = createHmac("sha256", salt) // Hash password with salt
    .update(user.password)
    .digest("hex");

  user.salt = salt; // Set salt
  user.password = hashedPassword; // Set hashed password

  next(); // Call next middleware
});

// Define `matchPasswordAndGenerateToken` as a static method
userSchema.statics.matchPasswordAndGenerateToken = async function (
  email,
  enteredPassword
) {
  const user = await this.findOne({ email });
  if (!user) return false; // If user not found, return false

  const salt = user.salt;
  const hashedPassword = user.password; // Corrected property name

  const userProvidedHash = createHmac("sha256", salt) // Hash using the stored salt
    .update(enteredPassword) // Use enteredPassword instead of user.password
    .digest("hex");

  if (hashedPassword !== userProvidedHash) {
    throw new Error("Incorrect password"); // Password does not match
  }

  const token = createTokenForUser(user); // Generate JWT token
  return token; // Return the generated token
};

const User = model("user", userSchema);

module.exports = User;
