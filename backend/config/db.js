const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { promisify } = require('util');

// Create or open the database
const dbPath = path.join(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Promisify database methods for async/await usage
const dbGet = promisify(db.get.bind(db));
const dbRun = function(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
};
const dbAll = promisify(db.all.bind(db));

// Create Users table
const userTable = `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT
)`;

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
)`;

// Initialize database tables
const initializeDatabase = async () => {
    try {
        await dbRun(userTable);
        await dbRun(crimeTable);
        console.log('Database tables have been initialized');
    } catch (error) {
        console.error('Error initializing database tables:', error);
    }
};

// Initialize on module load
initializeDatabase();

// Export database methods
module.exports = {
    db,
    get: dbGet,
    run: dbRun,
    all: dbAll
};
