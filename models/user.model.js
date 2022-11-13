const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

UserSchema.virtual("fullname").get(function () {
  return this.firstname + " " + this.lastname;
});
UserSchema.methods.isValidPassword = async function (password) {
  const result = bcrypt.compare(password, this.password);
  return result;
};
module.exports = mongoose.model("User", UserSchema);
