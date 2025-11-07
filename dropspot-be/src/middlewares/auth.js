const jwt = require("jsonwebtoken");

/**
 * Genel kimlik doğrulama.
 * Kullanıcının giriş yapıp yapmadığını kontrol eder.
 * Token geçerliyse req.user içerisine { id, email, role } bilgilerini ekler.
 */
const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "authorization_header_missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "token_missing" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role ,
    };

    // Debug (isteğe bağlı)
    // console.log("✅ Authenticated user:", req.user);

    next();
  } catch (err) {
    console.error("JWT verify failed:", err.message);
    return res.status(401).json({ error: "invalid_token" });
  }
};

/**
 * Admin rolü kontrolü.
 * requireAuth sonrasında çağrılır.
 * Eğer role !== "admin" ise erişimi engeller.
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "unauthenticated" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "forbidden" });
  }

  next();
};

module.exports = { requireAuth, requireAdmin };
