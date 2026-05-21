require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet'); 
const mongoSanitize = require('express-mongo-sanitize'); 
const rateLimit = require('express-rate-limit'); 
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcryptjs'); 

const app = express();

// 1. High-Security Middleware Setup
app.use(helmet()); 
app.use(express.json({ limit: '10kb' })); 
app.use(mongoSanitize());

// Strict CORS for Production
const allowedOrigin = process.env.FRONTEND_URL;
if (!allowedOrigin) {
    console.error("CRITICAL ERROR: FRONTEND_URL is not defined in .env");
    process.exit(1); 
}
app.use(cors({ origin: allowedOrigin, credentials: true })); 

// 2. Brute Force & DoS Protection
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: { error: "Too many requests. Please try again later." },
    standardHeaders: true, 
    legacyHeaders: false,
});
app.use('/api/', limiter);

// Strict rate limit for login attempts
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: { error: "Too many login attempts. Please try again in 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
});

// 3. Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Database Connected Successfully"))
    .catch(err => console.error("Database Connection Error:", err.message));

// 4. JWT Authentication & Authorization Middleware
const verifyAdminJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2) {
        return res.status(401).json({ error: "Access denied. Invalid token format." });
    }

    const token = tokenParts[1]; // HAKIKISHA unaweka [1] hapa ili kusoma token halisi

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: "Access denied. Admin role required." });
        }

        req.admin = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: "Invalid or expired token." });
    }
};

// ==================== SCHEMAS & MODELS ====================
const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true, lowercase: true, maxLength: 50 },
    password: { type: String, required: true }
});
const Admin = mongoose.model('Admin', AdminSchema);

const CertSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, maxLength: 100 }, 
    issuer: { type: String, required: true, trim: true, maxLength: 100 },
    meta: { type: String, required: true, trim: true, maxLength: 500 }
});
const Certificate = mongoose.model('Certificate', CertSchema);

const WriteUpSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, maxLength: 150 },
    category: { type: String, required: true, trim: true, maxLength: 100 }, 
    summary: { type: String, required: true, trim: true, maxLength: 300 },
    content: { type: String, required: true }, 
    date: { type: Date, default: Date.now }
});
const WriteUp = mongoose.model('WriteUp', WriteUpSchema);


// ==================== API ROUTES ====================

// --- AUTHENTICATION ROUTES ---
app.post('/api/auth/register-setup-admin', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Username and password are required." });

    try {
        const adminExists = await Admin.findOne({ username: username.toLowerCase() });
        if (adminExists) return res.status(400).json({ error: "Admin already exists." });

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new Admin({ username, password: hashedPassword });
        await newAdmin.save();
        res.status(201).json({ message: "Admin account initialized successfully!" });
    } catch (err) {
        res.status(500).json({ error: "Registration failed." });
    }
});

app.post('/api/auth/login', loginLimiter, async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Please enter all credentials." });

    try {
        const foundAdmin = await Admin.findOne({ username: username.toLowerCase() });
        if (!foundAdmin) return res.status(401).json({ error: "Invalid login credentials." }); 

        const isMatch = await bcrypt.compare(password, foundAdmin.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid login credentials." });

        const token = jwt.sign({ id: foundAdmin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.json({ message: "Login successful!", token: token });
    } catch (err) {
        res.status(500).json({ error: "An unexpected server error occurred." });
    }
});


// --- CERTIFICATIONS ENDPOINTS ---
app.get('/api/certifications', async (req, res) => {
    try {
        const certs = await Certificate.find().select('title issuer meta _id');
        res.json(certs);
    } catch (err) {
        res.status(500).json({ error: "Failed to retrieve certificate data." });
    }
});

app.post('/api/certifications', verifyAdminJWT, async (req, res) => {
    const { title, issuer, meta } = req.body;
    if (!title || !issuer || !meta) return res.status(400).json({ error: "All fields are required." });

    try {
        const newCert = new Certificate({ title, issuer, meta });
        await newCert.save();
        res.status(201).json({ message: "Certificate saved successfully!" });
    } catch (err) {
        res.status(500).json({ error: "Failed to save data to the database." });
    }
});

app.delete('/api/certifications/:id', verifyAdminJWT, async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid ID format." });

    try {
        const deletedCert = await Certificate.findByIdAndDelete(id);
        if (!deletedCert) return res.status(404).json({ error: "Certificate not found." });
        res.json({ message: "Certificate deleted successfully!" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete data." });
    }
});


// --- OWASP WRITE-UPS ENDPOINTS ---

// Public Route: Kila mtu anaweza kusoma makala
app.get('/api/writeups', async (req, res) => {
    try {
        const posts = await WriteUp.find().sort({ date: -1 }).select('title category summary content date _id');
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: "Failed to retrieve write-ups." });
    }
});

// Protected Route: Admin tu anaweza kuongeza makala mpya
app.post('/api/writeups', verifyAdminJWT, async (req, res) => {
    const { title, category, summary, content } = req.body;
    if (!title || !category || !summary || !content) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const newPost = new WriteUp({ title, category, summary, content });
        await newPost.save();
        res.status(201).json({ message: "Write-up published successfully!" });
    } catch (err) {
        res.status(500).json({ error: "Failed to publish write-up." });
    }
});

// Protected Route: Admin tu anaweza kufuta makala (Hapa ndipo kodi yako ilipokatika)
app.delete('/api/writeups/:id', verifyAdminJWT, async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid ID format." });

    try {
        const deletedPost = await WriteUp.findByIdAndDelete(id);
        if (!deletedPost) return res.status(404).json({ error: "Write-up not found." });
        res.json({ message: "Write-up deleted successfully!" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete write-up." });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Secure server running on port ${PORT}`));
