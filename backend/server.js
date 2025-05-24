// server.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true
}));

// Session setup
app.use(session({
  secret: 'your-secret-key', // Change this to a secure random string
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // use secure cookies in production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/petfectly', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Define User Schema and Model
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: function() {
      // Password only required for local accounts
      return !this.googleId && !this.facebookId;
    }
  },
  googleId: String,
  facebookId: String,
  displayName: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

// Passport Local Strategy
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      
      if (!user) {
        return done(null, false, { message: 'Email not registered' });
      }
      
      // For users who registered with OAuth but trying to login with password
      if (!user.password) {
        return done(null, false, { 
          message: 'This email is registered with a social login. Please use that method.' 
        });
      }
      
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password' });
      }
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// Google OAuth Strategy - Replace with your credentials
passport.use(new GoogleStrategy({
  clientID: 'YOUR_GOOGLE_CLIENT_ID',
  clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
  callbackURL: 'http://localhost:5000/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    let user = await User.findOne({ googleId: profile.id });
    
    if (user) {
      return done(null, user);
    }
    
    // Check if user exists with the same email
    user = await User.findOne({ email: profile.emails[0].value });
    
    if (user) {
      // Link Google account to existing user
      user.googleId = profile.id;
      await user.save();
      return done(null, user);
    }
    
    // Create new user
    const newUser = new User({
      googleId: profile.id,
      email: profile.emails[0].value,
      displayName: profile.displayName
    });
    
    await newUser.save();
    return done(null, newUser);
  } catch (err) {
    return done(err);
  }
}));

// Facebook OAuth Strategy - Replace with your credentials
passport.use(new FacebookStrategy({
  clientID: 'YOUR_FACEBOOK_APP_ID',
  clientSecret: 'YOUR_FACEBOOK_APP_SECRET',
  callbackURL: 'http://localhost:5000/api/auth/facebook/callback',
  profileFields: ['id', 'emails', 'name']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    let user = await User.findOne({ facebookId: profile.id });
    
    if (user) {
      return done(null, user);
    }
    
    // Check if user exists with the same email (if email is available)
    if (profile.emails && profile.emails.length > 0) {
      user = await User.findOne({ email: profile.emails[0].value });
      
      if (user) {
        // Link Facebook account to existing user
        user.facebookId = profile.id;
        await user.save();
        return done(null, user);
      }
    }
    
    // Create new user
    const newUser = new User({
      facebookId: profile.id,
      email: profile.emails ? profile.emails[0].value : `fb_${profile.id}@placeholder.com`,
      displayName: `${profile.name.givenName} ${profile.name.familyName}`
    });
    
    await newUser.save();
    return done(null, newUser);
  } catch (err) {
    return done(err);
  }
}));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Define routes
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword
    });
    
    await newUser.save();
    
    // Login the user after registration
    req.login(newUser, (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Login after registration failed' });
      }
      return res.json({ success: true, user: { email: newUser.email, id: newUser._id } });
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/auth/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Server error' });
    }
    
    if (!user) {
      return res.status(401).json({ success: false, message: info.message });
    }
    
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Login failed' });
      }
      
      return res.json({ 
        success: true, 
        user: { email: user.email, id: user._id }
      });
    });
  })(req, res, next);
});

app.get('/api/auth/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { 
      return res.status(500).json({ success: false, message: 'Logout failed' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

app.get('/api/auth/check', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ 
      isAuthenticated: true, 
      user: { email: req.user.email, id: req.user._id }
    });
  }
  res.json({ isAuthenticated: false });
});

// Google OAuth routes
app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/api/auth/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: 'http://localhost:3000/auth/login'
  }),
  (req, res) => {
    res.redirect('http://localhost:3000/');
  }
);

// Facebook OAuth routes
app.get('/api/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

app.get('/api/auth/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: 'http://localhost:3000/auth/login'
  }),
  (req, res) => {
    res.redirect('http://localhost:3000/');
  }
);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});