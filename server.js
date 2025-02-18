const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'your-rds-endpoint', // Update with your RDS endpoint
    user: 'admin',
    password: 'yourpassword', // Replace with your MySQL password
    database: 'your_database_name'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

app.get('/notes', (req, res) => {
    db.query('SELECT * FROM notes', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.post('/notes', (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Note text is required' });

    db.query('INSERT INTO notes (text) VALUES (?)', [text], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ id: result.insertId, text });
    });
});

app.delete('/notes/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM notes WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Note deleted' });
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));
