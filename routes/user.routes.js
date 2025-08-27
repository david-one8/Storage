const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const authMiddleware = require("../middlewares/auth");

/* "/user/register" */
router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register",
  body("email").trim().isEmail().isLength({ min: 13 }),
  body("username").trim().isLength({ min: 3 }),
  body("password").trim().isLength({ min: 5 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.render('register', {
          error: "Please check your input: Email must be valid and at least 13 characters, username at least 3 characters, and password at least 5 characters"
        });
      }

      const { username, email, password } = req.body;

      // Check if user already exists
      const existingUser = await userModel.findOne({
        $or: [
          { email: email },
          { username: username }
        ]
      });

      if (existingUser) {
        return res.render('register', {
          error: "Username or email already exists"
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await userModel.create({
        username,
        email,
        password: hashedPassword,
      });

      // Create JWT token after successful registration with expiration
      const token = JWT.sign(
        {
          userId: newUser._id,
          email: newUser.email,
          username: newUser.username
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '36h' }  // Token expires in 36 hours
      );

      // Set the token in cookie with security options
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 36 * 60 * 60 * 1000, // 36 hours in milliseconds
        sameSite: 'strict'
      });

      return res.render('login', {
        success: "Registration successful! Please log in with your credentials."
      });

    } catch (error) {
      console.error("Registration error:", error);
      return res.render('register', {
        error: "An error occurred during registration. Please try again."
      });
    }
  },
);

/* "/user/login" */
router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login",
  body("username").trim().isLength({ min: 3 }),
  body("password").trim().isLength({ min: 5 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.render('login', { 
          error: "Username must be at least 3 characters and password must be at least 5 characters"
        });
      }

      const { username, password } = req.body;

      const user = await userModel.findOne({
        username: username
      });

      if (!user) {
        return res.render('login', { 
          error: "Invalid username or password" 
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.render('login', { 
          error: "Invalid username or password" 
        });
      }

      const token = JWT.sign({
        userId: user._id,
        email: user.email,
        username: user.username
      }, 
      process.env.JWT_SECRET_KEY,
      { expiresIn: '36h' }  // Token expires in 36 hours
      );

      // Set the token in cookie with security options
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 36 * 60 * 60 * 1000, // 36 hours in milliseconds
        sameSite: 'strict'
      });
      
      res.redirect("/home");

    } catch (error) {
      return res.render('login', { 
        error: "An error occurred. Please try again later." 
      });
    }
  }
);

/* "/user/profile" */
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.userId).select('username email');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      username: user.username,
      email: user.email
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/* "/user/logout" */
router.post("/logout", (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
});

/* "/user/profile" - Update profile */
router.put("/profile",
  authMiddleware,
  body("username").optional().trim().isLength({ min: 3 }),
  body("currentPassword").optional().trim().isLength({ min: 5 }),
  body("newPassword").optional().trim().isLength({ min: 5 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Please check your input: Username must be at least 3 characters, passwords must be at least 5 characters"
        });
      }

      const { username, currentPassword, newPassword } = req.body;
      const userId = req.user.userId;

      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // If updating password, verify current password first
      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({ error: 'Current password is required to change password' });
        }

        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
          return res.status(400).json({ error: 'Current password is incorrect' });
        }
      }

      // If updating username, check if it's already taken
      if (username && username !== user.username) {
        const existingUser = await userModel.findOne({
          username: username.toLowerCase(),
          _id: { $ne: userId }
        });

        if (existingUser) {
          return res.status(400).json({ error: 'Username already exists' });
        }
      }

      // Update fields
      if (username) {
        user.username = username.toLowerCase();
      }

      if (newPassword) {
        user.password = await bcrypt.hash(newPassword, 10);
      }

      await user.save();

      // Generate new JWT token with updated username
      const token = JWT.sign(
        {
          userId: user._id,
          email: user.email,
          username: user.username
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '36h' }
      );

      // Update cookie with new token
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 36 * 60 * 60 * 1000,
        sameSite: 'strict'
      });

      res.json({
        success: true,
        message: 'Profile updated successfully',
        username: user.username
      });

    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ error: 'An error occurred while updating profile' });
    }
  }
);

module.exports = router;
