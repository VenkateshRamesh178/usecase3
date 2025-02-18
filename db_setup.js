require('dotenv').config();
const mysql = require('mysql2');

// Database connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST.split(':')[0],
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

// Database name from environment variable
const databaseName = process.env.DB_NAME || 'notes_app';

// Create database if not exists
connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``, (err) => {
    if (err) {
        console.error('Error creating database:', err);
        process.exit(1);
    }
    console.log(`Database '${databaseName}' is ready.`);

    // Connect to the created database
    const db = mysql.createConnection({
        host: process.env.DB_HOST.split(':')[0],
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: databaseName
    });

    // Create notes table if not exists
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS notes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    db.query(createTableQuery, (err) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log("Table 'notes' is ready.");
        }
        db.end(); // Close connection
    });
});

connection.end();
