const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");

// Kayıt için doğrulama şeması
const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin"]).optional().default("user"), // varsayılan: user
});

// Giriş için doğrulama şeması
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password required"),
});


// ✅ Kayıt ol
const signup = async (req, res) => {
  const parsed = SignupSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(422).json({ error: parsed.error.errors[0].message });

  const { email, password, role } = parsed.data;

  try {
    // E-posta zaten kayıtlı mı kontrol et
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "email_already_exists" });
    }

    // Şifre hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcı oluştur
    const user = await User.create({
      email,
      password: hashedPassword,
      role,
    });

    // JWT oluştur
    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      user: { id: user.id, email: user.email, role: user.role },
      token,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "signup_failed" });
  }
};


// ✅ Giriş yap
const login = async (req, res) => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(422).json({ error: parsed.error.errors[0].message });

  const { email, password } = parsed.data;

  try {
    // Kullanıcıyı bul
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "user_not_found" });
    }

    // Şifre kontrol et
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "invalid_credentials" });
    }

    // JWT oluştur
    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      user: { id: user.id, email: user.email, role: user.role },
      token,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "login_failed" });
  }
};


module.exports = { signup, login };
