import bcrypt from "bcryptjs";

export const hashValue = async (value, salt = 10) => {
  return await bcrypt.hash(value, salt);
};

export const compareValue = async (value, hashedValue) => {
  return await bcrypt.compare(value, hashedValue);
};
