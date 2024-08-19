const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const metadata_fetching = require('./fetch_logic/main');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

///////////// this is the main backend file -> endpoint define here, CORS as well to handle, rate limiting and security//////////

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3001', credentials: true }));

// help prevent various types of attacks, such as Cross-Site Scripting (XSS) and data injection attacks.
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'"],
            imgSrc: ["'self'", 'data:']
        }
    }
}));

// using express-rate-limit -> define the request per minutes and relevant msg in case when out of this range
const limiter = rateLimit({
    windowMs: 1000,
    max: 5,
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// for csrf token 
app.use(csrf({
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict'
    }
}));

/// initialize the _csrf token, will add to the header when sent request via the frontend
app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// this is the main endpoint logic of the api, 
app.post('/api/fetch', async (req, res) => {
    try {
        const { items } = req.body.data;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Add URLs to the list' });
        }

        const metadata = await metadata_fetching(items);

        res.status(200).json({
            success: true,
            data: metadata,
        });
    } catch (error) {
        console.error('Backend Error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching metadata',
            error: error.message,
        });
    }
});

// mainly used when i dont recived valid key -> so in that way i will know for sure that there was a problem
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        return res.status(403).json({ message: 'Invalid CSRF token' });
    }
    next(err);
});

// PORT 3002
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});