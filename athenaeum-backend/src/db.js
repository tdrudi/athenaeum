const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const { DB_URI } = require('./config');

const db = new Client({
    connectionString: DB_URI,
});

async function initDb() {
    try {
        await db.connect();
        console.log('PostgreSQL connected successfully');

        const schemaPath = path.join(__dirname, 'schema.sql');
        if (fs.existsSync(schemaPath)) {
            const schemaSql = fs.readFileSync(schemaPath, 'utf8');
            await db.query(schemaSql);
            console.log('Database schema synchronized successfully.');
        }
    } catch (err) {
        console.error('PostgreSQL connection or schema error:', err.stack);
    }
}

initDb();

module.exports = db;