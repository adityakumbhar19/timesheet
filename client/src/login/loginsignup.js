const express = require('express');
const router = express.Router();
const con = require('../DL/databaseCon');
const bcrypt = require('bcryptjs')

router.get('/', (req, res) => {
    console.log(1);
    res.send("hello you are in login page");
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = ?';
    con.query(query, [email], async (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length > 0) {
            const hashedPassword = results[0].Password;
            const passwordMatch = await bcrypt.compare(password, hashedPassword);

            if (passwordMatch) {
                const userID = results[0].UserID;
                const role = results[0].Role;
                const name = results[0].Fullname;
                return res.status(200).json({ message: 'Login successful', ID: userID, role: role, name: name });
            } else {
                return res.status(401).json({ error: 'Invalid username or password' });
            }
        } else {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
    });
});

module.exports = router;
