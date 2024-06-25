import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  // Generate a JWT token with the user ID as the payload
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  // just learned it's called a cookie as a reference to fortune cookies since those cookies contain a fortune - data - as these cookies contain data

  // Set the token as an HTTP-only cookie
  res.cookie("jwt", token, {
    httpOnly: true, // more secure - prevents client-side access to the cookie
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days, 24 hours,
    sameSite: "strict", // CSRF - more protection
  });

  return token;
};

export default generateTokenAndSetCookie;
