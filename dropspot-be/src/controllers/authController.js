const { z } = require('zod');
const jwt = require('jsonwebtoken');
const { defineModels } = require('../models');

const { User } = defineModels();
const SignupSchema = z.object({ email: z.string().email() });

const signup = async (req, res) => {
  const parsed = SignupSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ error: 'invalid_email' });
  const { email } = parsed.data;

  try {
    const [user] = await User.findOrCreate({ where: { email }, defaults: { email } });
    const token = jwt.sign({ sub: user.id, email: user.email, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.status(201).json({ user: { id: user.id, email: user.email }, token });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'signup_failed' });
  }
};

module.exports = { signup };
