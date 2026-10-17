# Athenaeum
A relational backend API built for comprehensive library collection management.


# Tech Stack
Runtime: Node.js
Framework: Express.js
Database: PostgreSQL
Environment Configuration: 'dotenv'

--

# Architecture and Database Design
This app features a 9 table relational model designed to handle many-to-many relationships without data redundance.

Core TABLES: books, authors, genres, series, tropes
Junction Tables: book_authors, book_genres, book_series, book_tropes

Design Note: The database schema intentionally allows duplicate author names in the authors table to correctly accommodate distinct authors who share names while writing in separate genres.

--

## Getting Started and Installation

1. Prerequisites
    [Node.js] installed on your machine
    [PostgreSQL] running locally

2. Clone the Repository

    git clone [https://github.com/your-username/athenaeum-backend.git](https://github.com/your-username/athenaeum-backend.git)
    cd athenaeum-backend

3. Install Dependencies
   
    npm install

4. Configure Environment Variables
Create a local .env file in root directory

    cp .env.example .env

Open your .env file and update the connection string with your local PostgreSQL credentials:

    PORT=5000
    DATABASE_URL=postgresql://your_username:your_password@127.0.0.1:5432/athenaeum_db

5. Initialize the Database
Create the database and execute schema script in your terminal

    psql -U postgres -c "CREATE DATABASE athenaeum_db"
    psql -U postgres -d athenaeum_db -f schema.sql

Verify the tables were created successfully

    psql -d athenaeum_db
    \dt                     (Verify that all 9 tables were created)
    \q

6. Run the Application
    npm run dev
