require("dotenv").config();
const { ExtractJwt } = require("passport-jwt");
const User = require("../models/user.model");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ username });
        if (!user) return done(null, false, { message: "User not found" });
        const validate = await user.isValidPassword(password);
        if (!validate) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user, { message: "Success Log In" });
      } catch (err) {
        done(err);
      }
    }
  )
);

const Jwtoptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET,
};

const Jwtstrategy = new JwtStrategy(Jwtoptions, async (token, done) => {
  try {
    return done(null, token.user);
  } catch (err) {
    done(err);
  }
});

passport.use(Jwtstrategy);
