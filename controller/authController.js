import User from '../model/userModel.js';
import bcrypt from 'bcryptjs';
import { generateToken, verifyToken } from '../utils/verifyToken.js';
import crypto from 'crypto';
import { verifyEmail } from '../utils/nodemailer.js';
import Token from '../model/tokenModel.js';

// Logic to register a user
const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // check if all fields are not empty
  if (!firstName || !lastName || !email || !password) {
    return res.json({
      message: 'All fields are required',
      status: 400,
    });
  }

  // check if password is greater than or equal to 8 characters
  if (password.length < 8) {
    return res.json({
      message: 'Password must be minimum of 8 characters',
      status: 411,
    });
  }

  // check if email exist cos email must be unique
  const emailExist = await User.findOne({ email });
  if (emailExist) {
    return res.json({
      message: 'User already exist',
      status: 401,
    });
  }

  // hash password for security reasons
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  }).save();

  // generate token for email verification
  const token =
    crypto.randomBytes(32).toString('hex') +
    crypto.randomBytes(32).toString('hex');

  // save the token with the userId inside the database
  const newToken = await new Token({
    token,
    userId: newUser._id,
  }).save();

  // generate the link to be sent to user email
  const link = `${process.env.BACKEND_URL}/api/${newUser._id}/confirm/${newToken.token}`;

  // using helper function to send the mail to the user using nodemailer
  await verifyEmail(newUser.email, link);

  res.json({
    message:
      'Kindly verify your email address as verification mail has been sent to your address',
    status: 200,
    success: true,
  });

  return;
};

// email verification logic
const verifyUser = async (req, res) => {
  try {
    // validate it is the actual user
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.json({
        message: 'Invalid Link',
        status: 401,
        success: false,
      });
    }

    // validate the token
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });

    if (!token) {
      return res.json({
        message: 'Invalid link',
        status: 401,
        success: false,
      });
    }

    // update the user by changing isVerified to true
    await User.updateOne(
      {
        _id: token.userId,
      },
      { $set: { isVerified: 'true' } }
    );

    // remove the token from the database
    await Token.findByIdAndDelete(token);

    return res.json({
      message: 'Email verification successful. You can now login',
      status: 200,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return;
  }
};

// Logic to login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // check if email or password is not empty
    if (!email || !password) {
      return res.json({
        message: 'All fields are required',
        status: 400,
        success: false,
      });
    }

    if (password.length < 8) {
      return res.json({
        message: 'Password must be minimum of 8 characters',
        status: 400,
        success: false,
      });
    }

    // check if user exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        message: 'Invalid Credential',
        status: 401,
        success: false,
      });
    }
    // compare password match
    const doesPasswordMatch = await bcrypt.compare(password, user.password);
    if (!doesPasswordMatch) {
      return res.json({
        message: 'Invalid Credential',
        status: 401,
        success: false,
      });
    }

    // check if user is verified or not
    if (user.isVerified === false) {
      let token = await Token.findOne({ userId: user._id });
      if (!token) {
        token = await new Token({
          userId: user._id,
          token:
            crypto.randomBytes(32).toString('hex') +
            crypto.randomBytes(32).toString('hex'),
        });
        await token.save();

        const link = `${process.env.BACKEND_URL}/api/${user._id}/confirm/${token.token}`;

        await verifyEmail(user.email, link);

        res.json({
          status: 200,
          success: false,
          message: 'Verification email has been sent to your email',
        });
        return;
      }

      return res.json({
        message: 'Please verify the mail sent to your email address',
        status: 401,
        success: false,
      });
    }

    // destructure the user data so that i do not send password along to the client
    const { password: hashedPassword, ...rest } = user._doc;

    // generate token to be sent along to the header
    generateToken(res, user._id, user.email);
    return res.json({
      rest,
      status: 200,
      message: `${rest.firstName} your login is successful`,
    });
  } catch (error) {
    res.json({
      message: 'Internal server error',
      status: 500,
      success: false,
    });
    return;
  }
};

// Logic to log user out
const userLogout = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.json({
      message: 'Invalid Token',
      success: false,
      status: 401,
    });
  }

  res.clearCookie('access_token').json({
    message: 'Logout successful',
    status: 200,
    success: true,
  });
};

export { registerUser, loginUser, verifyUser, userLogout };
