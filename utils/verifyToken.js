import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const generateToken = async (res, userId, userEmail) => {
  const token = jwt.sign(
    { id: userId, email: userEmail },
    process.env.JWT_SECRET,
    {
      expiresIn: '3600s',
    }
  );

  res.cookie('access_token', token, {
    httpOnly: true,
    maxAge: 60 * 60 * 1 * 1000,
  });
};

const verifyToken = async (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.json({
      message: 'You need to login to continue',
      success: false,
      status: 401,
    });
  }

  await jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.json({
        message: 'Invalid token',
        success: false,
        status: 401,
      });
    }
    req.user = user;
    next();
  });
};

export { generateToken, verifyToken };
