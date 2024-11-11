const express = require("express");
const userRoute = require("./routes/user");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const path = require("path");
const { checkForAuthenticationCookie } = require("./middleware/authentication");
const app = express();

const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // Use cookie parser before using the middleware
app.use(checkForAuthenticationCookie("token")); // Use middleware before defining routes

const CONNECTION_URL =
  "mongodb+srv://root:root@blogbasic.ohcbx.mongodb.net/?retryWrites=true&w=majority&appName=blogbasic";

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port : ${PORT}`))
  )
  .catch((error) => console.log(error.message));

app.get("/", (req, res) => {
  res.render("home", {
    user: req.user, // Now `req.user` will be populated if the token is valid
  });
});

app.use("/user", userRoute);
