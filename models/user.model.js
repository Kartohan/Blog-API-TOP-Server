const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  permission: {
    type: "String",
    default: "Admin",
  },
});

UserSchema.methods.isValidPassword = async function (password) {
  const result = bcrypt.compare(password, this.password);
  return result;
};
module.exports = mongoose.model("User", UserSchema);
