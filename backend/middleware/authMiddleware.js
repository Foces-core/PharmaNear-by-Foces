import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV !== "production" ? "fallback_local_secret_key" : null);

if (!JWT_SECRET) {
    throw new Error("FATAL: JWT_SECRET is required in production but is missing from environment variables.");
}
export const AuthMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = req.cookies?.token || (authHeader && authHeader.split(" ")[1]);

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decoded; // attach payload (e.g. userId)
    next();
  });
};