const express = require('express');
const auth = require('./lib/actions/auth.js');

const app = express();
const port = 3000;


app.use(express.json());


//check authentication of user
app.post('/api/checkAuthentication', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    try {
        const isAuthenticated = await auth.checkAuthentication(token);
        if (isAuthenticated) {
            res.status(200).json({ message: 'Authenticated' });
        } else {
            res.status(401).json({ message: 'Unauthorized' });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//login user
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const token = await auth.login(email, password);
        res.status(token.status).json({ message:token.token });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//register user
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email and password are required' });
    }

    try {
        const token = await auth.register(name, email, password);
        res.status(token.status).json({ message:token.token });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//get user position
app.post('/api/getPosition', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    try {
        const result = await auth.getPosition(token);
        res.status(result.status).json({ user: result.user });
    } catch (error) {
        res.status(500).send(error.message);
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});