const request = require('supertest');
const express = require('express');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const app = express();

// test endpoint csrf token

app.use(cookieParser());
app.use(csrf({ cookie: { httpOnly: true, secure: false, sameSite: 'Strict' } }));
app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

describe('GET /api/csrf-token', () => {
    it('should return a valid CSRF token', async () => {
        const response = await request(app).get('/api/csrf-token');
        expect(response.status).toBe(200);
        expect(response.body.csrfToken).toBeDefined();
    });
});