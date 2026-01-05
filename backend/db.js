const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

// Create or open the database
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'));

// Create Users table
const userTable = `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT
);`;

// Create CrimeReports table
const crimeTable = `CREATE TABLE IF NOT EXISTS crime_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    crimeType TEXT NOT NULL,
    description TEXT NOT NULL,
    locationName TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    evidence TEXT,
    evidence_images TEXT,
    witnesses TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    userId INTEGER,
    FOREIGN KEY(userId) REFERENCES users(id)
);`;

// Initialize database
db.serialize(async () => {
    // Create tables if they don't exist
    db.run(userTable);
    db.run(crimeTable);
    
    console.log('Database tables have been initialized');
});

module.exports = db;