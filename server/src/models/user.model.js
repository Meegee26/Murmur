import mongoose from "mongoose";
import { hashValue, compareValue } from "../utils/bcrypt.util.js";

const capitalize = (val) => {
  if (typeof val !== "string") return val;
  return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
};

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      set: capitalize,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      set: capitalize,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Fill in a valid email address"],
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
      minLength: 6,
    },
    googleId: { type: String, unique: true, sparse: true },
    avatar: { type: String, default: null },
    isDev: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        if (ret) {
          delete ret.password;
        }
        return ret;
      },
    },
  }
);

userSchema.pre("save", async function () {
  if (this.password && this.isModified("password")) {
    this.password = await hashValue(this.password);
  }
});

userSchema.methods.comparePassword = async function (val) {
  return compareValue(val, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
