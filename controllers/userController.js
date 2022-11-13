const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

exports.login = async (req, res, next) => {
  passport.authenticate("login", async (err, user) => {
    try {
      if (err || !user) {
        const error = new Error("An error occurred.");
        return next(err);
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = { _id: user._id };
        const token = jwt.sign({ user: body }, process.env.SECRET, {
          expiresIn: "1d",
        });

        return res.json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};

exports.signup = [
  body("username")
    .trim()
    .isLength({ min: 4 })
    .withMessage("User Name must have at least 4 characters")
    .isAlphanumeric()
    .withMessage("User Name allow only letters A-z and numbers 0-9")
    .custom(async (value) => {
      const user = await User.findOne({ username: value });
      if (user !== null) {
        return Promise.reject();
      }
      return Promise.resolve();
    })
    .withMessage("User Name already exists")
    .escape(),
  body("firstname")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Enter a name")
    .isAlphanumeric()
    .withMessage("First Name field allow only letters A-z and numbers 0-9")
    .escape(),
  body("lastname")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Enter a Last Name")
    .isAlphanumeric()
    .withMessage("Last Name field allow only letters A-z and numbers 0-9")
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters long")
    .isAlphanumeric()
    .withMessage("Password field allow only letters A-z and numbers 0-9")
    .escape(),
  body("confirmpassword")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Enter a password confirmation")
    .escape()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Confirm password and password fields do not match");
      } else {
        return true;
      }
    }),
  (req, res, next) => {
    const errors = validationResult(req);

    const user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.userName,
    };

    if (!errors.isEmpty()) {
      res.json({
        errors: errors.array({ onlyFirstError: true }),
        user,
      });
      return;
    }

    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
      const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        password: hashedPassword,
      });
      user.save((err) => {
        if (err) return next(err);
        res.json({
          message: "Signed-up sucessfuly",
        });
      });
    });
  },
];

exports.logout = function (req, res) {
  req.logout();
  res.redirect("/");
};
