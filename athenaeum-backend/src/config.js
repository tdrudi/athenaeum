require('dotenv').config();

const PORT = +process.env.PORT || 5000;

const DB_URI =
    process.env.NODE_ENV === 'test'
        ? process.env.DATABASE_TEST_URL || 'postgresql://127.0.0.1:5432/athenaeum_test'
        : process.env.DATABASE_URL || 'postgresql://127.0.0.1:5432/athenaeum';

module.exports = { PORT, DB_URI };