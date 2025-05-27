// server.js - Express backend with MongoDB
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// ── MIDDLEWARE ────────────────────────────────────────────────────────────────
// Allow Next.js client
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed!'), false);
  }
});

// ── MONGOOSE CONNECTION ───────────────────────────────────────────────────────
mongoose.connect('mongodb://localhost:27017/petfectly', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// ── SCHEMAS & MODELS ──────────────────────────────────────────────────────────
// User schema
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  petInfo: {
    name:   { type: String, required: true },
    breed:  { type: String, required: true },
    age:    { type: String, required: true },
    photo:  { type: String, default: null }
  },
  createdAt: { type: Date, default: Date.now }
});
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});
const User = mongoose.model('User', userSchema);

// Pet schema (must be defined _before_ we use it in routes)
const petSchema = new mongoose.Schema({
  name:        String,
  age:         String,
  breed:       String,
  distance:    String,
  bio:         String,
  interests:   [String],
  personality: [String],
  images:      [String],
  liked:       { type: Boolean, default: false },
  lastActive:  String
});
const Pet = mongoose.model('Pet', petSchema);

// ── ROUTES ────────────────────────────────────────────────────────────────────
// Registration endpoint
app.post('/api/register', upload.single('petPhoto'), async (req, res) => {
  try {
    const { fullName, email, password, petName, petBreed, petAge } = req.body;

    // Check if user exists
    if (await User.findOne({ email })) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create & save user
    const userData = {
      fullName, email, password,
      petInfo: {
        name: petName,
        breed: petBreed,
        age: petAge,
        photo: req.file ? req.file.filename : null
      }
    };
    const user = new User(userData);
    await user.save();

    // ── OPTIONAL: seed a Pet document so /api/pets returns something ──
    const petDoc = new Pet({
      name:       petName,
      breed:      petBreed,
      age:        petAge,
      images:     req.file ? [`/uploads/${req.file.filename}`] : [],
      liked:      false,
      lastActive: new Date().toISOString()
    });
    await petDoc.save();

    // Respond (omitting password)
    const userObj = user.toObject();
    delete userObj.password;
    res.status(201).json({ success: true, user: userObj, pet: petDoc });

  } catch (error) {
    console.error('Registration error:', error);
    if (req.file) fs.unlinkSync(req.file.path);
    const status = error.code === 11000 ? 400 : 500;
    res.status(status).json({ success: false, message: error.message });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    const userObj = user.toObject();
    delete userObj.password;
    res.json({ success: true, user: userObj });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// (Optional) list all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json({ success: true, users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Fetch all *unliked* pets
app.get('/api/pets', async (req, res) => {
  try {
    const pets = await Pet.find({ liked: false });
    res.json(pets);
  } catch (error) {
    console.error('Get pets error:', error);
    res.status(500).json({ error: 'Failed to fetch pets' });
  }
});

// Like/unlike a pet
app.patch('/api/pets/:id/like', async (req, res) => {
  try {
    const pet = await Pet.findOneAndUpdate(
      { id: Number(req.params.id) },
      { liked: req.body.liked },
      { new: true }
    );
    if (!pet) return res.status(404).json({ error: 'Pet not found' });
    res.json(pet);
  } catch (error) {
    console.error('Patch pet error:', error);
    res.status(500).json({ error: 'Failed to update pet' });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: err.message || 'Something went wrong' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
