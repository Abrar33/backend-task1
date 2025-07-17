const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User=require('../Models/user-model') // ✅ Correct import

exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email }); // ✅ Correct usage
    if (existingUser) return res.status(400).json({ error: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Signup error:', err.message); // ✅ Log error
    res.status(500).json({ error: 'Signup failed' });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    res.json({ message: 'Sign-in successful',user, token });
  } catch (err) {
    console.error('Signin error:', err.message); // ✅ Log error
    res.status(500).json({ error: 'Sign-in failed' });
  }
};