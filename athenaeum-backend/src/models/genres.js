const db = require("../db");
const ExpressError = require("../../expressError");

class Genre { 
    //Get all genres
    static async all() {
        const result = await db.query(`
            SELECT id, name 
            FROM genres 
            ORDER BY name;
        `);
        return result.rows;
    }

    //Get books with genre
    static async get(id) {
        const genreResult = await db.query(`
            SELECT id, name 
            FROM genres 
            WHERE id = $1;
        `, [id]);

        const genre = genreResult.rows[0];

        if (!genre) {
            throw new ExpressError(`Genre not found`, 404);
        }

        const booksResult = await db.query(`
            SELECT b.id, b.title, b.status, b.sprayed_edges, b.signed
            FROM books b
            JOIN book_genres bg ON b.id = bg.book_id
            WHERE bg.genre_id = $1
            ORDER BY b.title;
        `, [id]);

        genre.books = booksResult.rows;
        return genre;
    }

    //Create new genre
    static async create({name}) {
        if (!name) {
            throw new ExpressError("Genre name is required", 400);
        }

        const result = await db.query(`
            INSERT INTO genres (name)
            VALUES ($1)
            RETURNING id, name;
        `, [name]);

        return result.rows[0];
    }

    //Update a genre
    static async update(id, {name}) {
        if (!name) {
            throw new ExpressError("Genre name is required", 400);
        }

        const result = await db.query(`
            UPDATE genres 
            SET name = $2
            WHERE id = $1
            RETURNING id, name;
        `, [id, name]);

        return result.rows[0];
    }

    //Add genre to book
    static async add(genreId, bookId) {
        const result = await db.query(`
            INSERT INTO book_genres (genre_id, book_id)
            VALUES ($1, $2)
            RETURNING genre_id, book_id;
        `, [genreId, bookId]);

        return result.rows[0];
    }

     //Delete genre
    static async delete(id) {
        const result = await db.query(
            `DELETE FROM genres 
            WHERE id = $1 RETURNING id`,
            [id]
        );

        if (result.rows.length === 0) {
            throw new ExpressError(`Genre not found`, 404);
        }

        return { message: "Genre deleted" };
    }

}

module.exports = Genre;