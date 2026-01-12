const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const safetyRoutes = require('./routes/safety');
const placesRoutes = require('./routes/places');
const geofenceRoutes = require('./routes/geofence');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(session({
    secret: 'safar_secret_key',
    resave: false,
    saveUninitialized: true
}));

// Serve templates folder
app.use(express.static(path.join(__dirname, '../templates')));

// Default route → always show login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../templates/login.html'));
});

// Route to handle login (simple demo)
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Dummy check → replace with real database later
    if (username && password) {
        req.session.user = username;
        return res.json({ success: true, redirect: '/dashboard' });
    } else {
        return res.json({ success: false, message: 'Invalid credentials' });
    }
});

// Route to check session and serve dashboard
app.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, '../templates/dashboard.html'));
    } else {
        res.redirect('/');
    }
});

// API routes
app.use('/api/safety', safetyRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/geofence', geofenceRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
