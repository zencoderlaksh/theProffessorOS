const ADMIN_EMAIL = 'yadavlakshya86@gmail.com';
const ADMIN_PASSWORD = '8854888165@Laksh';
const HARDCODED_TOKEN = 'prof_admin_secret_token_2026_x885';

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      return res.json({
        message: 'Admin authentication successful',
        token: HARDCODED_TOKEN,
        user: {
          email: ADMIN_EMAIL,
          role: 'Admin Professor',
          name: 'Lakshya Yadav'
        }
      });
    }

    return res.status(401).json({ error: 'Invalid credentials. Only admin has access.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyAdmin = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.includes(HARDCODED_TOKEN)) {
      return res.json({
        valid: true,
        user: {
          email: ADMIN_EMAIL,
          role: 'Admin Professor',
          name: 'Lakshya Yadav'
        }
      });
    }
    return res.status(401).json({ valid: false, error: 'Unauthorized' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
